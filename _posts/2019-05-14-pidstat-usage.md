---
layout: post
title: "每天学习一个命令：pidstat 查看进程消耗资源"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, commmand, network, pidstat, iotop, ram, cpu]
last_updated:
---

pidstat 主要用于监控 Linux Kernel 管理的进程资源占用情况，包括 CPU，IO，内存，线程等等。

> The pidstat command is used for monitoring individual tasks currently being managed by the Linux kernel.

pidstat 首次运行会显示系统自开机起各项统计，之后运行将显示从上一次运行到该次运行的统计信息。

## installation

    apt-get install sysstat

## usage

    pidstat [options] [interval] [times]

Most common use options:

- `-r` show memory usage
- `-d` show io usage per process id
- `-p PID` specify PID

## Examples

### Show CPU usage of all process

    pidstat -u
    pidstat

Result fields:

- UID
- PID
- %usr: 进程在用户空间占用 cpu 的百分比
- %system: 进程在内核空间占用 CPU 百分比
- %guest: 进程在虚拟机占用 CPU 百分比
- %wait: 进程等待运行的百分比
- %CPU: 进程占用 CPU 百分比
- CPU: 处理进程的 CPU 编号
- Command: 进程名

### Show memory usage
Following command will display PID memory usage 10 times every 2 seconds:

    pidstat -r 2 10

Result fields:

- UID
- PID
- Minflt/s : 每秒次缺页错误次数 （minor page faults），虚拟内存地址映射成物理内存地址产生的 page fault 次数
- Majflt/s : 每秒主缺页错误次数 (major page faults), 虚拟内存地址映射成物理内存地址时，相应 page 在 swap 中
- VSZ virtual memory usage : 该进程使用的虚拟内存 KB 单位
- RSS : 该进程使用的物理内存 KB 单位
- %MEM : 内存使用率
- Command : 该进程的命令 task name

### show IO usage

    pidstat -d

Result field:

- UID
- PID
- kB_rd/s: 每秒进程从磁盘读取的数据量 KB 单位 read from disk each second KB
- kB_wr/s: 每秒进程向磁盘写的数据量 KB 单位 write to disk each second KB
- kB_ccwr/s: 每秒进程向磁盘写入，但是被取消的数据量，This may occur when the task truncates some dirty pagecache.
- iodelay: Block I/O delay, measured in clock ticks
- Command: 进程名 task name

### Specific PID
To show CPU, memory, IO:

	pidstat -u -p PID
	pidstat -r -p PID
	pidstat -d -p PID

## reference

- <https://linux.die.net/man/1/pidstat>

