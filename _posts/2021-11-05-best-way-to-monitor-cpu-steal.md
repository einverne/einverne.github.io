---
layout: post
title: "如何发现 CPU steal 并解决"
aliases: 
- "如何发现 CPU steal 并解决"
tagline: ""
description: ""
category: 经验总结
tags: [cpu, linux, vps, cpu-steal, virtual-machine ]
last_updated: 2023-01-10 09:54:24
create_time: 2021-11-05 04:59:14
---

## 什么是 CPU 窃取

CPU 窃取（CPU steal）指的是一个虚拟 CPU 核心必须等待物理 CPU 的时间百分比。通常 CPU 窃取发生在共享主机上，简短地来说就说当共享主机去处理一个请求时发生延迟。这种情况通常会发生在资源争夺的时候，当处理 CPU 密集型任务时。

## 为什么会发生 CPU 窃取

在共享主机、或云主机中，虚拟机管理程序会安装在物理硬件和虚拟机化化境之间，然后将 CPU 时间、内存等等资源分配给虚拟机。

当进程准备好由虚拟 CPU 执行时，等待管理程序分配物理 CPU，而如果管理程序将此 CPU 已经分配给了另一个虚拟机时，就会发生等待。

CPU 窃取时间长的原因：

- 虚拟机进程计算任务繁重，分配的 CPU 周期不足以处理工作负载
- 物理服务器被虚拟机超载，云服务器提供商超额出售了虚拟机，使得物理 CPU 无法处理进程

## 当发生请求处理缓慢时如何查看 CPU streal

当检测到共享主机性能无故受到影响时，怀疑可能出现 CPU steal。最好的排查方法就是使用 `iostat` 命令。

```
iostat 1 10
for x in `seq 1 1 30`; do ps -eo state,pid,cmd | grep "^D"; echo "-"; sleep 2; done
top -bn 1 | head -15
```

拆分开每一行命令：

```
iostat 1 10
```

每隔 1s 执行一次 iostat 命令，执行 10 次。

结果可能是这样的：

```
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           5.29    2.12   12.17   46.03    0.53   33.86

Device             tps    kB_read/s    kB_wrtn/s    kB_dscd/s    kB_read    kB_wrtn    kB_dscd
dm-0              1.00         4.00         0.00         0.00          4          0          0
dm-1             19.00       760.00      6144.00         0.00        760       6144          0
loop0             0.00         0.00         0.00         0.00          0          0          0
loop1             0.00         0.00         0.00         0.00          0          0          0
loop2             0.00         0.00         0.00         0.00          0          0          0
loop3             0.00         0.00         0.00         0.00          0          0          0
loop4             0.00         0.00         0.00         0.00          0          0          0
loop5             0.00         0.00         0.00         0.00          0          0          0
loop6             0.00         0.00         0.00         0.00          0          0          0
loop7             0.00         0.00         0.00         0.00          0          0          0
loop8             0.00         0.00         0.00         0.00          0          0          0
loop9             0.00         0.00         0.00         0.00          0          0          0
xvda             34.00      1412.00         0.00         0.00       1412          0          0
xvdb             30.00      1124.00         0.00         0.00       1124          0          0
xvdc            161.00       964.00      5440.00         0.00        964       5440          0

```

从结果上来看，上面的结果只有一点儿的 CPU steal，来看看一个存在 CPU steal 的结果。

```
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.39    0.00   12.74    0.00   37.84   49.03
```

注意到 `%steal` 值，这么高的值则表示正在发生 CPU steal。一般来说这个值低于 15% 算是比较正常，如果一直比较偏高则需要 open a ticket 给虚拟机提供商请求调查了。

```
for x in `seq 1 1 30`; do ps -eo state,pid,cmd | grep "^D"; echo "-"; sleep 2; done
```

这一行命令则是检查状态在 D 状态的进程，D 状态意味着进程在 uninterruptible sleep，这一行命令每隔 1s 执行一次，执行 30 次。

正常的结果应该是只输出 `-` 行。而如果输出的结果中包含 D 状态的进程：

```
# for x in `seq 1 1 30`; do ps -eo state,pid,cmd | grep "^D"; echo "-"; sleep 2; done
-
D  2169 [jbd2/sda-8]
-
D  2169 [jbd2/sda-8]
-
D  2169 [jbd2/sda-8]
```

这意味着特定的进程在 uninterruptible sleep。调查该特定的进程，查看是否因为其他的，比如 IO 等待而造成系统卡顿。

D 状态进程通常在等待 IO，但这也常常意味着会发生 CPU steal，所有的系统资源都会被绑定到 D 状态的进程上，导致系统无法处理其他任务。

D 状态的进程无法被通常的方法 kill，因此一个完整的系统重启才可能清除掉此类进程。另一个方法就是等待 IO ，直到进程自己解决问题。但缺点也是在整个等待 IO 的过程中会持续造成系统问题。

```
top -bn 1 | head -15
```

`top` 命令是用来监控系统进程资源使用情况的命令，上面的命令则是打印资源使用最多的 15 个进程。

> 注意：超出 100% 使用率的进程不是问题，一个 8 CPU 核心的虚拟机可能会有 800% 的 CPU 使用率

在查看 `top` 的结果时，如果 `top` 命令结果中有占用 CPU 异常的进程，可以进行相关的处理。

## mpstat

另外一个查看的命令是 `mpstat`

```
mpstat -P ALL 1 10
```

每隔 1s 时间打印一次，在结果中可以查看 `%steal` 的数值。

## sar

在 sysstat 包中的 `sar` 命令也可以查看 steal 情况。

## reference

- <https://www.linode.com/community/questions/18168/what-is-cpu-steal-and-how-does-it-affect-my-linode>
