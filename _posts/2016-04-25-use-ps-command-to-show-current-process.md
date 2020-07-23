---
layout: post
title: "每天学习一个命令：ps 显示当前运行进程"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [ps, command, linux, process, ]
last_updated:
---

Linux 中的 ps 命令是 Process Status 的缩写。ps 命令用来列出系统中当前运行的那些进程。ps 命令列出的是当前那些进程的快照，就是执行 ps 命令的那个时刻的那些进程，如果想要动态的显示进程信息，就可以使用 top 命令。

## 简介
要对进程进行监测和控制，首先必须要了解当前进程的情况，也就是需要查看当前进程，而 ps 命令就是最基本同时也是非常强大的进程查看命令。使用该命令可以确定有哪些进程正在运行和运行的状态、进程是否结束、进程有没有僵死、哪些进程占用了过多的资源等等。总之大部分信息都是可以通过执行该命令得到的。

> ps - report a snapshot of the current processes.

ps 提供的是执行时刻进程的状态，它提供的结果不是动态连续的；如果想对进程进行连续监控，应该用 `top/htop` 工具。


Linux 上进程有 5 种状态：

1. 运行（正在运行或在运行队列中等待）
2. 中断（休眠中，受阻，在等待某个条件的形成或接受到信号）
3. 不可中断（收到信号不唤醒和不可运行，进程必须等待直到有中断发生）
4. 僵死（进程已终止，但进程描述符存在，直到父进程调用 wait4() 系统调用后释放）
5. 停止（进程收到 SIGSTOP, SIGSTP, SIGTIN, SIGTOU 信号后停止运行运行）

ps 工具标识进程的 5 种状态码：

    D 不可中断 uninterruptible sleep (usually IO)
    R 运行 runnable (on run queue)
    S 中断 sleeping
    T 停止 traced or stopped
    Z 僵死 a defunct (”zombie”) process

## 语法

```
ps --help all

Usage:
 ps [options]

Basic options:
 -A, -e               all processes
 -a                   all with tty, except session leaders
  a                   all with tty, including other users
 -d                   all except session leaders
 -N, --deselect       negate selection
  r                   only running processes
  T                   all processes on this terminal
  x                   processes without controlling ttys

Selection by list:
 -C <command>         command name
 -G, --Group <gid>    real group id or name
 -g, --group <group>  session or effective group name
 -p, --pid <pid>      process id
     --ppid <pid>     select by parent process id
 -s, --sid <session>  session id
 -t, t, --tty <tty>   terminal
 -u, U, --user <uid>  effective user id or name
 -U, --User <uid>     real user id or name

  selection <arguments> take either:
    comma-separated list e.g. '-u root,nobody' or
    blank-separated list e.g. '-p 123 4567'

Output formats:
 -F                   extra full
 -f                   full-format, including command lines
  f, --forest         ascii art process tree 显示进程间关系
 -H                   show process hierarchy 显示树形结构
 -j                   jobs format
  j                   BSD job control format
 -l                   long format
  l                   BSD long format
 -M, Z                add security data (for SE Linux)
 -O <format>          preloaded with default columns
  O <format>          as -O, with BSD personality
 -o, o, --format <format>
                      user defined format
  s                   signal format
  u                   user-oriented format
  v                   virtual memory format
  X                   register format
 -y                   do not show flags, show rrs vs. addr (used with -l)
     --context        display security context (for SE Linux)
     --headers        repeat header lines, one per page
     --no-headers     do not print header at all
     --cols, --columns, --width <num>
                      set screen width
     --rows, --lines <num>
                      set screen height

Show threads:
  H                   as if they where processes
 -L                   possibly with LWP and NLWP columns
 -m, m                after processes
 -T                   possibly with SPID column

Miscellaneous options:
 -c                   show scheduling class with -l option
  c                   show true command name 显示进程真实名称
  e                   show the environment after command
  k,    --sort        specify sort order as: [+|-]key[,[+|-]key[,...]]
  L                   list format specifiers
  n                   display numeric uid and wchan
  S,    --cumulative  include some dead child process data
 -y                   do not show flags, show rss (only with -l)
 -V, V, --version     display version information and exit
 -w, w                unlimited output width

        --help <simple|list|output|threads|misc|all>
                      display help and exit

For more details see ps(1).
```

## 基本使用

### 打印所有用户的运行进程

    ps aux

- `a` 显示所有用户的进程
- `u` 显示进程的所有者
- `x` 显示非终端启用的进程

输出：

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0  10656   668 ?        Ss   Apr12   1:14 init [2]
root         2  0.0  0.0      0     0 ?        S    Apr12   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        S    Apr12   4:28 [ksoftirqd/0]
root         5  0.0  0.0      0     0 ?        S    Apr12   0:00 [kworker/u:0]
```

说明：

- USER：该 process 属于那个使用者账号的
- PID ：该 process 的号码
- %CPU：该 process 使用掉的 CPU 资源百分比
- %MEM：该 process 所占用的物理内存百分比
- VSZ ：该 process 使用掉的虚拟内存量 (Kbytes)
- RSS ：该 process 占用的固定的内存量 (Kbytes)
- TTY ：该 process 是在那个终端机上面运作，若与终端机无关，则显示 ?，另外， tty1-tty6 是本机上面的登入者程序，若为 pts/0 等等的，则表示为由网络连接进主机的程序。
- STAT：该程序目前的状态，主要的状态有
- R ：该程序目前正在运作，或者是可被运作
- S ：该程序目前正在睡眠当中 （可说是 idle 状态），但可被某些讯号 (signal) 唤醒。
- T ：该程序目前正在侦测或者是停止了
- Z ：该程序应该已经终止，但是其父程序却无法正常的终止他，造成 zombie （疆尸） 程序的状态
- START：该 process 被触发启动的时间
- TIME ：该 process 实际使用 CPU 运作的时间
- COMMAND：该程序的实际指令

### 显示所有进程信息

    ps -A

输出：

```
  PID TTY          TIME CMD
    1 ?        00:01:20 systemd
    2 ?        00:00:00 kthreadd
    3 ?        00:00:13 ksoftirqd/0
    5 ?        00:00:00 kworker/0:0H
    7 ?        00:17:02 rcu_sched
    8 ?        00:00:00 rcu_bh
    9 ?        00:00:03 migration/0
   10 ?        00:00:02 watchdog/0
```

### 显示指定用户所有进程

    ps a -u root

### 显示所有进程信息，连同命令行

     ps -ef
     ps aux

###  ps 与 grep 常用组合用法，查找特定进程

    ps -ef | grep ssh

输出：

```
ps -ef | grep ssh
root     18928 22845  0 21:10 ?        00:00:00 sshd: root@pts/4
root     19852 20288  0 21:25 pts/2    00:00:00 grep ssh
root     22845     1  0 Jun18 ?        00:00:32 /usr/sbin/sshd
```

### 将目前属于您自己这次登入的 PID 与相关信息列示出来

   ps -l

输出：

```
F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
4 S     0 17398 17394  0  75   0 - 16543 wait   pts/0    00:00:00 bash
4 R     0 17469 17398  0  77   0 - 15877 -      pts/0    00:00:00 ps
```

各相关信息的意义：

- F 代表这个程序的旗标 (flag)， 4 代表使用者为 super user
- S 代表这个程序的状态 (STAT)，关于各 STAT 的意义将在内文介绍
- UID 程序被该 UID 所拥有
- PID 就是这个程序的 ID ！
- PPID 则是其上级父程序的 ID
- C CPU 使用的资源百分比
- PRI 这个是 Priority （优先执行序） 的缩写，详细后面介绍
- NI 这个是 Nice 值，在下一小节我们会持续介绍
- ADDR 这个是 kernel function，指出该程序在内存的那个部分。如果是个 running 的程序，一般就是 "-"
- SZ 使用掉的内存大小
- WCHAN 目前这个程序是否正在运作当中，若为 - 表示正在运作
- TTY 登入者的终端机位置
- TIME 使用掉的 CPU 时间。
- CMD 所下达的指令为何

在预设的情况下， ps 仅会列出与目前所在的 bash shell 有关的 PID 而已，所以，当使用 ps -l 的时候，只有三个 PID。


### 列出类似程序树的程序显示

    ps -axjf

输出：

```
 PPID   PID  PGID   SID TTY      TPGID STAT   UID   TIME COMMAND
    0     2     0     0 ?           -1 S        0   0:00 [kthreadd]
    2     3     0     0 ?           -1 S        0   4:28  \_ [ksoftirqd/0]
    2     5     0     0 ?           -1 S        0   0:00  \_ [kworker/u:0]
    2     6     0     0 ?           -1 S        0   0:00  \_ [migration/0]
    1 20287 20287 20287 ?           -1 Ss       0   0:01 SCREEN -S lnmp
20287 20288 20288 20288 pts/2    19855 Ss       0   0:00  \_ /bin/bash
20288 19855 19855 20288 pts/2    19855 R+       0   0:00      \_ ps -axjf
```


### 找出与 cron 与 syslog 这两个服务有关的 PID 号码

    ps aux | grep '(cron|syslog)'

输出：

    root      2682  0.0  0.0  83384  2000 ?        Sl   Nov02   0:00 /sbin/rsyslogd -i /var/run/syslogd.pid -c 5
    root      2735  0.0  0.0  74812  1140 ?        Ss   Nov02   0:00 crond
    root     17475  0.0  0.0  61180   832 pts/0    S+   16:27   0:00 egrep (cron|syslog)

### 输出指定的字段

    ps -o pid,ppid,pgrp,session,tpgid,comm

      PID  PPID  PGRP  SESS TPGID COMMAND
    17398 17394 17398 17398 17478 bash
    17478 17398 17478 17398 17478 ps

### 打印前 5 个最消耗 CPU 的进程
组合 sort 和 head 使用：

	ps aux | sort -nrk 3,3 | head -n 5

## 外延

    ps aux | less
    ps aux > /tmp/ps.txt
