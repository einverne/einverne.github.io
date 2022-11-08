---
layout: post
title: "每天学习一个命令：dd 读取转换输出数据"
aliases: "每天学习一个命令：dd 读取转换输出数据"
tagline: ""
description: ""
category: 学习笔记
tags: [dd, linux, command, ]
last_updated:
---

dd 命令可以复制文件并对原文件内容进行转换和格式处理。dd 命令经常被用来备份设备。

比如创建一个空文件：

	dd if=/dev/zero of=test.txt bs=1M count=1

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
可以使用如下的命令来测试磁盘的读写速度：

	dd if=/dev/zero bs=1024 count=1 of=/tmp/test.file
	dd if=/dev/zero bs=1G count=1 of=/tmp/1Gb.file

说明：

- `if`  input file
- `of` output file
- `bs` block size  表示同时读入/输出的块大小
- `count` number of blocks ，拷贝的块个数
- `oflag` synchronization I/O for data

最后读写的文件大小是 bs 乘以 count 数。


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

### 对比

```
dd bs=64k count=4k if=/dev/zero of=test
dd bs=64k count=4k if=/dev/zero of=test; sync
dd bs=64k count=4k if=/dev/zero of=test conv=fdatasync
dd bs=64k count=4k if=/dev/zero of=test oflag=dsync
```

dd 命令的区别在于写缓存的处理方式。

- 第一条，不包括 sync，dd 命令完成之前并没有让系统把文件写入磁盘，只是把数据读入内存缓存中。dd 命令完成之后系统才会往磁盘写数据，所以这个速度不是真实速度
- 第二条，使用独立的 sync 命令，但是在 sync 命令执行之前 dd 就已经把速度打印出来了，所以也不是真正的速度
- 第三条命令使用 `conv=fdatasync` 执行之后，会执行一次同步操作
- 第四条命令 `oflag=dsync` 在执行每次都会进行同步写入操作，这是最慢的一种很是，基本没有用到写缓存

