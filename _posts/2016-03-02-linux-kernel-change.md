---
layout: post
title: "切换 Linux 内核版本"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, kernel, versions]
last_updated:
---

Linux 内核是开源类 Unix 系统宏内核。仅仅一个内核并不是一套完整的操作系统。有一套基于 Linux 内核的完整操作系统叫作 Linux 操作系统。Kernel 是 Linux 系统的核心，主要负责硬件的支持。

Linux 内核提供了安全补丁， bugfix 和新特性。

Linux 内核在 GNU 通用公共许可证第 2 版之下发布。

Linux 的 Kernel 主要提供以下五个基本的功能 [^book]：

- 硬件管理以及硬件的抽象
- 进程和线程的管理，以及之间的通信
- 内存的管理，包括虚拟内存管理以及内存空间的包含
- I/O 设备，包括文件系统，网络接口，串行接口 (Serial interfaces) 等等
- 设备基本功能，包括开启启动，关闭，计时器，多任务管理等等

[^book]: 《UNIX AND LINUX SYSTEM ADMINISTRATION HANDBOOK》第十一章

修改启动内核版本需要谨慎，每一步在确认知道自己在做什么的情况下再操作。Linux 内核版本变更可能导致网络访问异常，声音异常，甚至是桌面环境无法启动。在安装和移除内核时，确保已经已经阅读过相关帮助，确保自己知道如何选择不同版本的内核，如何恢复之前的版本，以及如何检查 DKMS 状态。

## Linux 内核版本号的意义

Linux 内核版本号由 3 组数字组成：第一个组数字。第二组数字。第三组数字

- 第一个组数字：目前发布的内核主版本。
- 第二个组数字：偶数表示稳定版本；奇数表示开发中版本。
- 第三个组数字：错误修补的次数。

## 查看内核版本
在 Linux 机器上执行如下命令查看当前正在使用的内核版本

    uname -r

使用如下命令查看当前系统安装的内核版本

    dpkg -l | grep linux-image

如果使用的是 Linux Mint 那么在 Update Manager 中，选择 View -> Linux Kernels 可以查看当前安装的版本和正在使用的版本，或者选择安装新的版本切换。

## 安装和卸载内核版本

    sudo apt search linux-image
    sudo apt install xxx
    sudo apt-get purge xxx

## 选择内核版本
一个系统可以同时安装多个内核，但是运行时只能选择一个，当启动电脑时，在显示 GRUB 菜单时可以选择加载哪一个内核。（当只有一个系统安装时，GRUB 菜单可能被跳过，强制显示 GRUB 菜单可以在启动电脑时一直按住 <kbd>Shift</kbd> 按键）

在 `Advanced options` 选项中，可以选择系统上安装的内核版本，在启动时选择一个即可。

## DKMS
DKMS 全称是 Dynamic Kernel Module Support，它可以帮我们维护内核外的这些驱动程序，在内核版本变动之后可以自动重新生成新的模块。

    sudo apt-get install dkms

内核包含了所有的开源驱动，一般都可以正常工作，私有的驱动（DVIDIA，AMD，Broadcom... 等等）不包含在其中。这些私有驱动（proprietary drivers）需要在安装时手动编译到每一个内核中。这个操作可以用 dkms 来完成。如果私有驱动无法正常编译到内核中，可能导致启动异常，所以需要提前检查

    dkms status

## reference

- <https://en.wikipedia.org/wiki/Linux_kernel>
