---
layout: post
title: "每天学习一个命令：pidstat 查看进程消耗资源"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, commmand, network, pidstat, iotop, ram, cpu]
last_updated:
---

pidstat 是 sysstat 工具包含的一个命令，主要用于监控 Linux Kernel 管理的进程资源占用情况，包括 CPU，IO，内存，线程等等。

> The pidstat command is used for monitoring individual tasks currently being managed by the Linux kernel.

pidstat 首次运行会显示系统自开机起各项统计，之后运行将显示从上一次运行到该次运行的统计信息。

## installation

    apt-get install sysstat

## usage

    pidstat [options] [interval] [times]

常用的参数：

- `-u` 默认参数，显示各个进程的 CPU 统计信息
- `-r` 显示各个进程的内存使用情况
- `-d` 显示各个进程的 IO 使用
- `-w` 显示各个进程的上下文切换
- `-p PID` 指定 PID

比如常见的每一秒查看 IO 统计，统计 10 次

	pidstat -d 1 10

## Examples

### 所有进程的 CPU 统计信息 {#cpu-usage}
直接运行 `pidstat` 默认显示所有进程的 CPU 使用信息，等效于 `pidstat -u -p ALL`

    pidstat -u 1 10
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

### 显示内存统计信息 {#memory-usage}
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

### 显示 IO 统计信息 {#show-IO-usage}

    pidstat -d

Result field:

- UID
- PID
- kB_rd/s: 每秒进程从磁盘读取的数据量 KB 单位 read from disk each second KB
- kB_wr/s: 每秒进程向磁盘写的数据量 KB 单位 write to disk each second KB
- kB_ccwr/s: 每秒进程向磁盘写入，但是被取消的数据量，This may occur when the task truncates some dirty pagecache.
- iodelay: Block I/O delay, measured in clock ticks
- Command: 进程名 task name

### T 选项来打印更详细信息
使用 `-T [TASK|CHILD|ALL]` 来报告打印更详细的信息，默认 pidstat 使用 TASK，表示监控独立的任务信息。

- TASK 报告独立的进程
- CHILD 报告进程下所有线程的情况
- ALL 输出进程及线程统计信息

### Specific PID
To show CPU, memory, IO:

	pidstat -u -p PID
	pidstat -r -p PID
	pidstat -d -p PID

比如要查看 PID 为 12002 的进程的 CPU 使用情况，并且要查看所有子线程，每隔 1 秒输出一次，输出 10 次，则可以

	pidstat -T ALL -u -p 12002 1 10

## reference

- <https://linux.die.net/man/1/pidstat>

