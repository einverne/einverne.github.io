---
layout: post
title: "每天学习一个命令：top 查看资源占用"
aliases: "每天学习一个命令：top 查看资源占用"
tagline: ""
description: ""
category: 学习笔记
tags: [top, linux, command, io, cpu, memory, ]
last_updated:
---


top 命令能够实时显示系统中各个进程资源占用情况。可以用它来快速排查系统性能问题。

## 先行概念

- 用户空间，常规进程所在空间，用户空间非特权区域，不能直接访问硬件设备
- 内核空间，操作系统所在空间，能与设备控制器通讯，控制用户区域进程运行状态

## 使用举例

### 直接使用

默认进入 top 时，各进程是按照 CPU 的占用量来排序的：

	top

解释：

- 第一行，系统时间，已运行天数，登录用户数，1 分钟，5 分钟，15 分钟负载
- 第二行，运行任务数
- 第三行，CPU 运行状态
	- `us` 用户空间(user)占用 CPU 百分比
	- `sy` 内核空间(system)占用 CPU 百分比
	- `ni` (nice)改变过优先级的进程占用 CPU 百分比
	- `id` (idle)空闲 CPU 百分比
       - `wa` IO 等待(wait)占用 CPU 的百分比
	- `hi` 硬中断（Hardware interrupts）占用 CPU 的百分比
	- `si` 软中断（Software Interrupts）占用 CPU 的百分比
	- `st` (steal)
- 第四行，内存使用
	- total 全部物理内存
	- free 空闲内存
	- used 已使用内存
	- buff/cache 缓存内存
- 第五行，swap 交换分区信息
- 第六行，空行
- 第七行及以下，各进程的运行状态

第七行信息，包括：

- PID
- USER
- PR 进程优先级
- NI 负值表示高优先级
- VIRT 进程使用的虚拟内存总量，单位 kb。VIRT=SWAP+RES
- RES (**resident memory usage**)常驻内存，进程使用的、未被换出的物理内存大小，单位 kb。RES=CODE+DATA
- SHR (**shared memory**) 共享内存大小，单位 kb
- S  进程状态，D= 不可中断的睡眠状态；R= 运行；S= 睡眠；T= 跟踪 / 停止；Z= 僵尸进程
- %CPU 上次更新到现在的 CPU 时间占用百分比
- %MEM 进程使用的物理内存百分比
- TIME+ 进程使用的 CPU 时间总计，单位 1/100 秒
- COMMAND 进程名

### 查看每个 CPU 状态
在交互状态下按下 `1` 展开，查看每个 CPU 情况。

### 改变排序规则
按下 Shift + `<` 或者 `>` 来改变排序规则。

### 显示完整命令：

	top -c

### 显示指定进程信息

	top -p 12002

### 交互命令

- h 显示帮助
- c 切换名字与完整路径
- m 切换内存显示方式
- i 忽略闲置和僵死进程
- r 重新设置进程优先级别
- P CPU 使用百分比排序



## macOS 区别
在 Linux 机器上使用 top 命令。常用的快键键是:

 * p 键 - 按 CPU 使用率排序
 * m 键 - 按内存使用量排序

这 2 个快捷键在 macOS 上都不一样。对应的是，先输入 o，然后输入 CPU 则按 CPU 使用量排序，输入 rsize 则按内存使用量排序。

如果记不清了，可以在 top 的界面上按 `?`，在弹出的帮助界面中即可看到。
