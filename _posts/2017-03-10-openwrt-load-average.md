---
layout: post
title: "Openwrt 平均负载"
tagline: ""
description: ""
category: 经验总结
tags: [openwrt, linux, cpu, ]
last_updated: 
---

Openwrt 在 Luci 后台很显眼的位置有三个不断刷新的数字，其实这个数字是“平均负载”（Load Average）的意思，这是 Linux 操作系统衡量系统负载和稳定性的重要参数。

## 平均负载

在 Linux 及各种 Linux 衍生版（包括 Openwrt）中，都可以使用如下命令查看系统平均负载。

uptime 命令：

    root@OpenWrt:/# uptime
     21:22:57 up 19:21,  load average: 1.30, 2.44, 2.38

top 命令：

	Mem: 119632K used, 6740K free, 0K shrd, 41348K buff, 48152K cached
    CPU:   0% usr   0% sys   0% nic  72% idle   0% io   0% irq  27% sirq
    Load average: 0.33 1.82 2.17 1/76 16075

w 命令，查看当前系统有谁登录，都在干什么：

    $ w
     21:25:04 up 3 days, 11:07,  8 users,  load average: 0.48, 0.52, 0.59
    USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
    einverne tty7     :0               Tue10    3days  2:19m  2.39s cinnamon-session --session cinnamon
    einverne pts/1    ev               Tue10   37.00s  2.45s  0.32s ssh root@192.168.1.1

直接查看 load average：

    $ cat /proc/loadavg 
    0.56 0.48 0.56 1/1264 5890

前三个数字表示平均进程数量外，后面一个分数，分子为正在运行进程数，分母表示系统进程总数，最后一个数字表示最近运行进程ID。

load average 显示的3个数字，分别表示：系统在过去1分钟、5分钟、15分钟内运行进程队列中的平均进程数量。
正常情况下的时候就是0到1之间，大于1的时候，表示系统已经没有多余资源了，有些队列就需要等待处理。

短时间大于1是没有影响的，特别是第一个一分钟的数据，但是如果后面两个数据，特别是最后一个，经常大于0.7，就说明，有可能路由器超负荷了。

## 交通流量来比喻

有一篇 [Understanding Linux CPU Load](http://blog.scoutapp.com/articles/2009/07/31/understanding-load-averages) 将负载比喻交通流量，很形象，非常值得一看。

具体来说：

- `0.00-1.00` 之间的数字表示此时路况非常良好，没有拥堵，车辆可以毫无阻碍地通过。
- 1.00 表示道路还算正常，但有可能会恶化并造成拥堵。此时系统已经没有多余的资源了，管理员需要进行优化。
- `1.00-***` 表示路况不太好了，如果到达2.00表示有桥上车辆一倍数目的车辆正在等待。这种情况你必须进行检查了。

多核CPU的话，满负荷状态的数字为 "1.00 * CPU核数"，即双核CPU为2.00，四核CPU为4.00。

## reference

- <http://blog.scoutapp.com/articles/2009/07/31/understanding-load-averages>
- <http://www.slyar.com/blog/linux-load-average-three-numbers.html>
- <http://zvv.me/xiankan/openwrt-load.html>
