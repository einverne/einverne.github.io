---
layout: post
title: "调查 Netdata 10min cpu iowait 告警"
aliases:
- "调查 Netdata 10min cpu iowait 告警"
tagline: ""
description: ""
category: 经验总结
tags: [ netdata, cpu, iowait, rsync, top, iostat ]
create_time: 2022-10-30 04:15:43
last_updated: 2022-11-08 02:10:11
---

这些天在一台备份服务器上安装了 Netdata 做监控之后每天都会给我发送很多  `10min_cpu_iowait` 的邮件告警。

简单的看了一下这个 [指标](https://community.netdata.cloud/t/10min-cpu-iowait/2119) 的说明，指的是 10 分钟间隔内 iowait 的平均等待时间。iowait 指的是当 CPU 空闲的时候至少有一个 I/O 请求的时间占比。

> To summarize it in one sentence, 'iowait' is the percentage of time the CPU is idle AND there is at least one I/O in progress.

I/O wait (iowait) 是操作系统还有等待的磁盘 I/O 请求时 CPU 空闲时间的百分比 （`man sar`）。而在 `man top` 中 I/O wait 指的是 等待 I/O 完成的时间。

需要注意的是，在等待 I/O 的过程中，系统可以运行其他进程，但是 `iowait` 单纯指的是 CPU idle 的情况。

一个通常可能的情况这个 `10min_cpu_iowait`  告警是因为 CPU 请求或接受一些数据，然后设备无法快速地处理这些数据，结果就是 CPU（在下一个时钟周期）空闲，然后就遇到 `iowait`。

每一个 CPU 都会处于如下的状态中的一个：

- user
- sys
- idle
- iowait

一些性能检测监控工具，比如 vmstat, iostat, top, sar 等等都可以显示这些信息。`sar` 命令可以输出每一颗 CPU 核心的状态（`-P` 选项），而其他命令只能输出一个所有 CPU 的平均值。因为是一个百分比，所以这些状态的总和是 100%。[^1] [^2]

[^1]: <https://blog.pregos.info/wp-content/uploads/2010/09/iowait.txt>
[^2]: <https://serverfault.com/questions/12679/can-anyone-explain-precisely-what-iowait-is>

## 查看 iowait 的方法

### top
在 top 命令第三行，CPU 信息列，`wa` 表示的就是 IO wait.

### vmstat
执行 `vmstat 1` 每秒打印一次结果，在输出结果的最后面 `wa` 就表示 IO wait。

### sar
`sar` 命令在 `sysstat` 包中。

执行 `sudo sar -d 1 3`

### iostat
执行 `sudo iostat -xm 1`，结果中的 `%iowait`。

### iotop
使用 `sudo iotop -oPa` 来查看活跃进程累计 I/O

### ps
使用 `ps auxf` ，在 `STAT` 列下，状态是 `D` 则表示 disk iowait。

### other

- strace
- lsof  在确定了进程之后，可以使用 `-p [PID]` 来确定

## 告警原因
查看了一下 Netdata 控制面板

![netdata dashboard cpu](/assets/screenshot-area-2022-10-31-125700.png)

然后查看了一下当时服务器处理的进程就发现原来是在用 `rsync` 备份的时候，因为高频读写磁盘导致 `iowait` 迅速上升。

然后我做了一个简单的测试，手动执行一下备份命令，每次都会导致 `iowait` 迅速飙高，大概原因就找到了。

## 如何解决 Netdata 告警

### 修改 Netdata 告警阈值

默认情况下 Netdata 设置的 `10min_cpu_iowait` 是 `[20,40]` Warning， `[40,50]` Critic。

```
 template: 10min_cpu_iowait
       on: system.cpu
    class: Utilization
     type: System
component: CPU
       os: linux
    hosts: *
   lookup: average -10m unaligned of iowait
    units: %
    every: 1m
     warn: $this > (($status >= $WARNING)  ? (20) : (40))
     crit: $this > (($status == $CRITICAL) ? (40) : (50))
    delay: down 15m multiplier 1.5 max 1h
     info: average CPU iowait time over the last 10 minutes
       to: sysadmin
```

因为我使用 [docker-compose](https://github.com/einverne/dockerfile/tree/master/netdata) 安装，所以先进入容器 `docker-compose exec netdata /bin/sh`，然后

```
cd /etc/netdata/
./edit-config health.d/cpu.conf
```

调整其中的 `warn` 和 `crit` 数值。然后保存 `: wq` 。重启 Netdata 容器。

### 调整 rsync 传输速率

既然是因为 rsync 备份传输文件导致的，那就看一下传输的速率，在 rsync 命令上加上 `--progress`，可以看到普通情况下能在 20MB/s ，那就限制一下速率 `--bwlimit=5m` ，然后再执行。可以看到 iowait 稳定在告警线一下。

### 联系 VPS 提供商
如果发现只有简单的读写，并且速度不高（10MB/s）的情况，可以使用 [benchmark](/post/2021/07/vps-benchmark.html) 脚本来检测磁盘读写速度：

```
curl -sL yabs.sh | bash -s -- -i -g
```

正常情况 blocksize 在 512k 以上，读写速度应该在 100MB/s 以上，否则可能 VPS 的磁盘出现问题，可以直接 Open a ticket ，并贴上命令的结果寻问服务提供商。

## reference

- <https://learn.netdata.cloud/docs/monitor/configure-alarms>
- [[2017-07-22-rsync-introduction]]
- <https://haydenjames.io/what-is-iowait-and-linux-performance/>
