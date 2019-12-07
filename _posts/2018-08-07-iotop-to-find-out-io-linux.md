---
layout: post
title: "每天学习一个命令：iotop 查看 Linux 下每个进程 IO 占用"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [io, iotop, top, linux, htop, ]
last_updated:
---

[iotop](http://guichaz.free.fr/iotop/) 是一个用来监控磁盘 I/O 的类似 top 的工具，Linux 下 IO 统计工具，比如 iostat， nmon 等只能统计到每个设备的读写情况，如果想要知道哪一个进程占用比较高的 IO 就要使用 iotop。 iotop 使用 Python 语言编写，要求 Python >= 2.5，Linux Kernel >= 2.6.20. （使用 `python -V` 和 `uname -r` 来查看）

使用这个命令最主要的一个原因就是快速找到 IO 占用比较高的程序，以便进行排查。

## 安装 {#install}

    sudo apt install iotop
    sudo yum install iotop

### install from source

	wget http://guichaz.free.fr/iotop/files/iotop-0.6.tar.bz2
	tar -xjvf iotop-0.6.tar.bz2
	cd iotop-0.6/
	./setup.py install

## 使用 {#usage}

直接使用，可以查看到对应进程的 IO 磁盘读写信息

	iotop

只显示有实际 I/O 的进程或者线程

	iotop -o

只显示进程的 I/O 数据：

	iotop -P

显示某一个 PID 的 IO：

	iotop -p PID

显示某一个用户的 I/O:

	iotop -u USER

显示累计 IO 数据：

	iotop -a

调整刷新时间为 10 秒：

	iotop -d 10

## 快捷键
直接启动 `iotop` 会进入交互模式，使用如下快捷键可以控制显示。

- **左右箭头**用来改变排序，默认按照 IO 排序，可以切换为读或者写排序等等。
- 交互式快捷键，`a` 用来切换累积使用量和 IO 读写速率。
- `r` 改变排序顺序
- `o` 只显示有 IO 输出的进程
- `q` 退出

## reference

- <http://guichaz.free.fr/iotop/>
