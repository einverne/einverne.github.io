---
layout: post
title: "每天学习一个命令：pidstat 查看进程消耗资源"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, commmand, network, ]
last_updated:
---

The pidstat command is used for monitoring individual tasks currently being managed by the Linux kernel.

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


    pidstat -p ALL
    pidstat

### Show memory usage
Following command will display PID memory usage 10 times every 2 seconds:

    pidstat -r -p PID 2 10

Result fields:

- PID
- Minflt/s
- Majflt/s
- VSZ virtual memory usage  KB
- RSS  KB
- Command  task name

### show IO usage

    pidstat -d -p PID

Result field:

- PID
- kB_rd/s  read from disk each second KB
- kB_wr/s  write to disk each second KB
- kB_ccwr/s
- Command task name

## reference

- <https://linux.die.net/man/1/pidstat>

