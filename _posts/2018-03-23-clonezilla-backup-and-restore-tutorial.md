---
layout: post
title: "使用 clonezilla 备份和恢复"
tagline: ""
description: ""
category: 经验总结
tags: [clonezilla, tutorial, backup, restore, system, ssd, linux]
last_updated:
---

Clonezilla 是一个分区和硬盘镜像和克隆的工具。Clonezilla 能够实现硬盘到硬盘，分区到分区的快速拷贝，在备份文件，克隆系统的应用中有着非常高的性能。使用起来也非常的方便，因此平时都保留着一个 8G U 盘制作的 Clonezilla 可以启动 U 盘。

> Clonezilla is a partition and disk imaging/cloning program

下载地址： <http://clonezilla.org/downloads.php>

之前其实写过一篇克隆系统的[文章](/post/2016/08/clonezilla-clone-system.html) 这里再系统性的总结一下。

## 制作 U 盘启动

制作一个 bootable Clonezilla 非常简单，在官网现在 iso 镜像之后，使用镜像写入工具就可以制作可以启动的 Clonezilla。在 Windows 下可以使用 Universal usb installer，或者 [unetbootin](https://unetbootin.github.io/)，Linux 下使用 [etcher](https://etcher.io/)。几乎都是加载 iso，选择写入设备，写入的过程比较简单，就不展开具体教程了。

## 备份流程

使用制作好的 U 盘启动，需要调整 PC 启动顺序，然后进入 clonezilla 系统，在 Clonezilla 中可以选择硬盘到硬盘复制，分区到分区复制，还有网络的备份，SSH 的备份，这些不怎么常用就暂时省略，主要使用硬盘到硬盘的备份和分区到分区的备份。

在具体的使用过程中遇到了一系列的问题，比如 Clonezilla 中无法找到新加的磁盘，比如如何将大容量的分区拷贝到小容量的分区中。不过这些问题都一一得到了解决。下面就讲下这些问题的解决方案。

## Clonezilla 无法找到新加的磁盘
在电脑上直接插上新的 SSD，有可能默认情况下新的 SSD 没有分区，磁盘上也没有新建的分区表。这个时候 Clonezilla 就无法在分区到分区的拷贝中找到新的磁盘的分区。因此需要使用 Live boot 的 Linux mint U 盘启动，在 U 盘启动的 Linux 中使用 GParted 来针对新的磁盘进行分区。一般情况下直接划分一个系统分区就足够了。

划分分区的时候可能会遇到 MBR(Master Boot Record) 和 GPT(GUID Partition Table) 这样两个分区表的名词，这两个都是硬盘分区表的格式，不过一老一新。

MBR 主引导记录，是传统的分区机制，MBR 支持 32 位或者 64 位系统，但是支持的分区数量有限，并且不支持超过 2T 的硬盘。

GPT 是全局唯一标识分区表，是一个新的分区机制，解决了 MBR 很多缺点。支持大于 2T 的磁盘，`fdisk` 命令最大只能建立 2T 分区，需要使用 `parted` 命令来创建大于 2T 的分区。GPT 向后兼容 MBR，必须在支持 UEFI 的硬件上才能使用。

可以使用

    sudo parted /dev/sdb print

来查看 `sdb` 这块硬盘上的分区表。关于 [parted](/post/2018/04/parted-linux-partition.html) 命令更多的介绍，可以参考[这篇文章](/post/2018/04/parted-linux-partition.html)

如果使用 GUI，那么在 U 盘启动的 Linux 中使用 GParted 可以直接对硬盘进行分区，然后应用即可，当新硬盘有分区时，Clonezilla 就能够找到分区并将原先的分区克隆到新的分区中了。

## 将大容量 HDD 拷贝到小容量的 SSD

Clonezilla 只能够将小的分区复制到大的分区中，因此会面临一个大问题。比如有一块 1T 的机械硬盘，需要将其中的一个 500g 的分区克隆到 250G 的 SSD 中，那么就需要先将 500G 的分区缩小到 250G 以下。查看当前 500G 系统分区实际文件占用大小，实际使用量一定要小于 250G，删除无用文件将实际占用文件缩小到 250G 以下之后，可能需要一个可以启动的 Linux live CD，一般情况下我也会制作一个 Linux Mint 的可启动 U 盘，然后启动该 U 盘，在 Linux Mint 中，使用 GParted 调整需要克隆的分区大小，将分区调整到 250G 以下。搜索关键词 **shrink partition**。缩小分区操作可能因不同硬盘和文件占用而不同耗时，一般情况下也需要非常长时间的操作。

在缩小分区之后，就可以启动 Clonezilla 然后使用分区到分区的操作，将原先 HDD 上的系统分区拷贝到 SSD 的分区中。拷贝也是一个非常耗时的操作，等待拷贝完成，这样系统就在原来分区和 SSD 上各有一份拷贝了。

由于 Clonezilla 在拷贝时是原样复制，因此可能导致 Linux 分区的 UUID 也一模一样，因此需要根据[这篇文章](/post/2016/08/clonezilla-clone-system.html) 来修改 Linux 分区的 UUID。

接下来的事情就是修改引导，让电脑启动到 SSD 中的系统。

这里就要推荐一个软件 `boot-repair`

    sudo add-apt-repository ppa:yannubuntu/boot-repair
    sudo apt-get update
    sudo apt-get install -y boot-repair && boot-repair

需要在 Live boot 的 Linux mint 中启动 `boot-repair` 来修复确实的引导。然后开机启动新硬盘上的系统就 OK 了。


## reference

- <https://help.ubuntu.com/community/Boot-Repair>
