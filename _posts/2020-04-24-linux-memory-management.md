---
layout: post
title: "Linux 内存管理初识"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, memory, ]
last_updated:
---


DMA 内存区域，0~16MB 内存。

NORMAL 内存区域，16MB~896MB

HIGHMEM，高端内存区域。

## 用户空间
用户进程访问的内存空间，每个进程有自己的独立用户空间，虚拟地址从

`0x00000000` 到 `0xBFFFFFFF`

总容量 3G.


进程与内存

按照”访问属性” 划分五个不同的内存区域。

### 代码段
存放可执行文件的操作指令，可执行程序在内存中的镜像。

只读，不可写

### 数据段
可执行文件中已初始化全局变量，静态分配的变量和全局变量。

### BSS
未初始化的全局变量

### heap
heap 用来存放进程运行时被动态分配的内存段，大小不固定。

malloc 新内存加到 heap，free 时从 heap 释放。

### stack

- 临时的局部变量，函数中定义的变量（不包括 static)
- 函数被调用时，参数也会被压入发起调用的进程栈中，调用结束时，返回值也会被存放到栈


可以使用 `size` 命令来查看编译后的程序在各个内存区域的大小，比如查看 sshd 进程：

	which sshd
	sudo size /usr/sbin/sshd


