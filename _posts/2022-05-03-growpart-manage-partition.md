---
layout: post
title: "每天学习一个命令：growpart 扩容分区"
aliases:
- "每天学习一个命令：growpart 扩容分区"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [ linux, drive, growpart, partition, cli ]
last_updated:
---

前端时间给 Proxmox VE 下的虚拟机扩容的时候留意到了这个 growpart 命令，专门用来给分区进行扩容的命令。

> growpart - extend a partition in a partition table to fill available space

growpart 工具完成 Linux 系统盘分区扩容及文件系统扩展

## Installation
Ubuntu 下可以直接安装：

    sudo apt install cloud-guest-utils

## 使用
注意，对磁盘进行操作是高风险操作，如果对命令不熟悉，请先做好数据的备份，然后再进行操作，或实验。

我以我自己的实际情况为例，我有一个 Proxmox VE 的虚拟机因为磁盘内容告警，所以扩容了一倍，从 64G 扩容到 128GB。

在 Proxmox VE 中停止虚拟机之后扩容，然后启动虚拟机进入系统操作。

首先使用 `fdisk -l` 来查看磁盘分区信息，可以看到目前系统的分区还是没有改变，但是可以看到磁盘已经有剩余空间了。

因为我这里比较简单，我只想把剩余的空间分配给我当前的系统分区，所以可以直接使用 growpart，如果你还需要复杂操作，比如再划分一个分区之类的，可以考虑 [[parted]] 等命令。

还可以使用 `lsblk` 再确认一下。

因为我的系统分区是 `/dev/sda` 磁盘的第二个分区，所以运行 growpart 命令扩容分区

    growpart /dev/sda 2

然后再执行以下命令，扩容 ext 文件系统

    resize2fs /dev/sda2

再查看磁盘：

    df -h
    lsblk
    fdisk -l

## 总结
`growpart` 命令可以非常方便的将分区扩展到全部的磁盘空间，不过需要注意的是，我的例子中 `/dev/sda2`  分区是磁盘的最后一个分区，如果你要扩容的分区在分区中间，可能需要考虑其他方案。

## 相关

- [[gparted]]
- [[2018-04-03-parted-linux-partition]]
- [[2016-04-02-fdisk]]
- [[lsblk]]
