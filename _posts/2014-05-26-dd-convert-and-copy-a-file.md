---
layout: post
title: "每天学习一个命令：dd 读取转换输出数据"
tagline: ""
description: ""
category: 学习笔记
tags: [dd, linux, command, ]
last_updated:
---

dd 命令可以复制文件并对原文件内容进行转换和格式处理。dd 命令经常被用来备份设备。

	dd if=/dev/zero of=sun.txt bs=1M count=1

解释：

- if 输入文件，不指定从 stdin
- of 输出文件，不指定默认 stdout 作为默认输出
- bs 字节为单位的块大小
- count 表示被复制的块

几个设备：

- `/dev/null` 向其输入任何内容都会被吞掉
- `/dev/zero` 输入设备，用来初始化文件，提供无穷的 0.

## 使用实例
**注意**: 运行 dd 命令需要非常小心，如下命令如果不清楚其含义请千万不要轻易尝试。

### 测试硬盘读写速度

	dd if=/dev/zero bs=1024 count=1000000 of=/root/1Gb.file

### 备份整块磁盘
将整块磁盘 /dev/sda 备份到 /dev/sdb，注意 sdb 上的数据将会被覆盖！！！

	dd if=/dev/sda of=/dev/sdb bs=4M

### 创建空文件
创建一个 512M 大小的空文件

	dd if=/dev/zero of=/path/to/file count=1024 bs=500000

### 销毁磁盘数据
利用随机数据填充磁盘，用以销毁数据

	dd if=/dev/urandom of=/dev/sda1

### 全盘数据备份与恢复
备份

	dd if=/dev/sda of=/root/sda.img

恢复镜像到指定盘

	dd if=/root/sda.img of=/dev/sda

使用 gzip 压缩备份

	dd if=/dev/sda | gzip > /root/image.gz

将压缩文件恢复

	gzip -dc /root/image.gz | dd of=/dev/sda
