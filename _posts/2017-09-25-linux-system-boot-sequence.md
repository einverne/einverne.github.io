---
layout: post
title: "从 Clonezilla 恢复系统学习 Linux 启动过程"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, boot, mbr, uefi, bios, clonezilla, ]
last_updated:
---

最近[又一次使用 Clonezilla 来克隆系统](/post/2016/08/clonezilla-clone-system.html)，和以往不同的是，这一次我是备份了整块硬盘到镜像，然后从镜像恢复系统到另外一块硬盘，而不是以往是复制一个分区，所以又产生了一些问题，所以有了这篇文章，一方面来记录一下中间遇到的问题，另一方面也学习巩固一下关于 Linux 启动过程中的必要流程。

## 基础知识
关于最基础的计算机启动过程也就不展开说，[阮一峰](http://www.ruanyifeng.com/blog/2013/02/booting.html)，和网上大部分文章已经讲的非常清晰了，这里只简单的列举一些基础名词，必须要知道的概念。

### BIOS
全称是 Basic Input Output System，也就是一块被写入开机程序的只读内存，电脑通电之后第一时间会读取的芯片。

### POST
POST 不是 HTTP 请求方法的 POST，而是 Power On Self Test，开机自检，在通电之后 BIOS 加载后会自动执行。

### MBR
[[MBR]] 是主引导分区，全称是 Master Boot Record，该分区决定该设备是否能够启动。如果设备能够启动，那么该设备第一个扇区，512 字节就需要表明该设备能够启动。

主引导记录告诉计算机去哪一块硬盘寻找操作系统，主引导记录由三部分组成

- 1-446 字节，调用系统机器码
- 447-510 字节，分区表
- 511-512 字节，主引导记录签名 （0x55,0xAA）。

![mbr](/assets/boot-mbr.png)

### GRUB
[[GRUB]] 是 Linux 下最流行的启动管理器（Boot Loader），全称是 GRand Unified Bootloader。计算机在读取 MBR 前 446 字节机器码之后，将运行事先安装的启动管理器 boot loader 也就是 GRUB。

GRUB 设计兼容 [multiboot specification](https://en.wikipedia.org/wiki/Multiboot_Specification)，为了使得 GRUB 能够引导启动各种版本的 Linux。GRUB 也能够让用户选择从不同的 kernels 启动。Grub 的配置文件地址在 `/boot/grub/grub.conf`.

GRUB1 现在正在被 GRUB2 代替，Grub2 在 `/boot/grub2/grub.cfg` 配置。

所以总结来看，计算机通电之后，先通过 BIOS，到 MBR，通过 GRUB 引导操作系统启动。以上就是计算机 boot sequence 的过程。

## System startup
通过 GRUB 引导启动操作系统，之后操作系统就会接管系统启动，操作系统启动过程也分为很多步骤。

### Stage 1.0
BIOS 在 MBR 中搜索 boot record，因为主引导分区必须保证尽量小，所以通过 stage 1.0 找到 1.5 GRUB 引导，GRUB 引导必须在 boot record 和第一个分区之间，将 GRUB 加载到内存之后进入 stage 1.5.

### Stage 1.5
上面提到 GRUB 必须在引导记录和磁盘第一个分区之间，这一块区域因为历史原因被预留，磁盘的第一个分区从 sector 63 开始，MBR 在 sector 0，所以留下了 62512 byte sectors，大概 31774 bytes，用来保存 core.img， core.img 只有 25389 字节，所以完全足够。

需要注意的是，`/boot` 目录需要存放在支持 GRUB 的文件系统上。stage 1.5 在找到 `/boot` 文件和加载必要的驱动之后执行。

### Stage 2
GRUB stage 2 阶段会加载 Linux kernel 到内存中，kernel 和相关的文件在 `/boot` 目录中。kernel 文件都以 `vmlinuz` 开头。

kernel 都是压缩的格式以节省空间，当计算机解压并加载内核到内存之后，会加载 [systemd](https://en.wikipedia.org/wiki/Systemd)，自此系统启动过程结束，内核和 systemd 都已经在运行。

systemd 是所有进程的创始者，他负责将系统启动至一个可工作的状态，他负责包括挂载系统文件，启动管理系统服务等等工作。

## systemd 启动流程
首先 systemd 会尝试使用 `/etc/fstab` 中定义的内容挂载文件系统，包括定义的根分区，swap 分区文件等等。

    # /etc/fstab: static file system information.
    #
    # Use 'blkid' to print the universally unique identifier for a
    # device; this may be used with UUID= as a more robust way to name devices
    # that works even if disks are added and removed. See fstab(5).
    #
    # <file system> <mount point>   <type>  <options>       <dump>  <pass>
    # / was on /dev/sda1 during installation
    UUID=3d1b7e3e-c184-4664-9555-2b088997f2c8 /              ext4    errors=remount-ro 0       1
    # swap was on /dev/sda5 during installation
    UUID=b99bf592-a25b-4ca0-b597-fc62e121aae1 none          swap    sw            0    0

关于 systemd 的启动顺序，可以参考[阮一峰的这篇](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)

## 修改 GRUB
默认情况下 GRUB 会有 10 秒时间来给用户选择系统，这个设置可以通过修改 `/etc/default/grub` 来修改。

    GRUB_DEFAULT=0          # 默认启动的系统序号
    GRUB_TIMEOUT=4          # 默认等待多久以预设系统开机

更新之后使用 `sudo update-grub` 来更新 GRUB。

[GRUB Manual](https://www.gnu.org/software/grub/manual/grub.html#Simple-configuration) 手册中提供了完整的参数解释。

## 遇到的问题

### No bootable device
使用 Clonezilla 复制硬盘所有分区到另外一块硬盘，而我这边遇到的情况是复制结束之后硬盘没有 boot 分区，导致 BIOS 无法找到主引导分区。

解决办法是使用 Clonezilla 的专家（高级）模式，在高级模式中会自动修复 grub 的问题

### 无法启动 Linux Mint 桌面
这个问题表现形式可能是各种各样的，开机黑屏，或者在 grub 引导之后出现各种乱码命令。对于这个问题的解决方法可能需要是修改 `/etc/fstab` ，将其中硬盘的 UUID ，通过 sudo blkid 查看获取后保证 `/etc/fstab` 中启动的硬盘是一块。可以参考[之前的文章](/post/2016/08/clonezilla-clone-system.html)

## reference

- <http://www.invoke-ir.com/2015/05/ontheforensictrail-part2.html>
- <https://opensource.com/article/17/2/linux-boot-and-startup>
- <https://help.ubuntu.com/community/UEFI>
- [GRUB 入门教程](https://wiki.ubuntu.com.cn/GRUB%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B)
