---
layout: post
title: "几个常见的 NAS 系统整理及选择"
tagline: ""
description: ""
category: 学习笔记
tags: [freenas, unraid, esxi, docker, linux, freebsd, openmediavault, nas, ]
last_updated:
---

看文章老有几个 NAS 系统被翻来覆去的提到，这里就一起看看 Wiki，看看有什么区别吧。

## FreeNAS
NAS 系统中最著名也最强大的一个系统，基于安全和稳定著称的 FreeBSD，集成了 Sun 公司的 ZFS 文件系统，ZFS 拥有很多文件管理的特性，非常适合管理大量可扩展的数据系统。[^zfs] 目前由 ixsystems 公司维护。

- <http://www.freenas.org>

[^zfs]: <https://en.wikipedia.org/wiki/ZFS>

### 硬件依赖
FreeNAS 对硬件有一定的要求，至少需要 8G 内存，如果要安装插件或者启用虚拟机可能需要更多。FreeNAS 的 ZFS 需要一个基本的内存量来维持基本的运行。[^1]

[^1]: <https://www.getnas.com/freenas-hardware-guide-goal/>

### 安装

安装教程：

- <https://www.youtube.com/watch?v=QgTBUQ6C2ZY>
- <https://www.youtube.com/watch?v=wk3JTY045s4>

## NAS4Free
基于 FreeNAS 0.7 开发的一个分支，由原 FreeNAS 系统开发者发起创建。

官网：

- <http://www.nas4free.org/>

## OpenMediaVault
OpenMediaVault 是一款基于 Linux 的 NAS 操作系统，项目领导人是 Volker Theile，具体来说 OpenMediaVault 是基于 Debian 的，并且于 GUN GPLv3 下开源。OpenMediaVault 和 FreeNAS 有个很深的缘源，他们都基于 FreeNAS，不过在 2009 主要的两位项目负责人产生分歧，所以 Volker Theile 基于 Linux 重写了 FreeNAS 于是成就了 OpenMediaVault，而另一位 FreeNAS 的创始人 Olivier Cochard-Labbé 则基于 FreeBSD 重写了 FreeNAS，于是成就了今天的 FreeNAS。[^wiki]

[^wiki]: <https://en.wikipedia.org/wiki/OpenMediaVault>

OpenMediaVault 主要面向小型办公环境和家庭，所以体积非常小，并且还有树莓派版本。

### 其他参考链接

- <http://www.openmediavault.org/>

## ESXi
由 VMware 开发，一听名字就知道，这家以虚拟机著称的公司，开发的一款为企业设计的虚拟机。ESXi 可以方便的安装在服务器中，然后就可以虚拟化安装其他系统。

更详细的介绍可以参考这个[视频](https://www.youtube.com/watch?v=-Hltydu9PXk)

<iframe width="560" height="315" src="https://www.youtube.com/embed/-Hltydu9PXk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Unraid
Unraid 是另一款 NAS 操作系统，实现的功能都大同小异 [^unraid]，Unraid 不通过组 RAID 方式来存储数据，但是可以和 RAID 一样做到冗余备份，Unraid 另外比较亮眼的就是虚拟化技术以及硬件直通，可以在此基础上虚拟化安装各个操作系统以及充分利用硬件接口。

> Unraid Server OS is a Network Attached Storage server operating system that boots from a USB Flash device, and is specifically designed for digital media storage.

Unraid 6 默认使用 XFS 文件系统，但如果定义了 Cache poll，那么会使用 BTRFS 文件系统。

[^unraid]: <https://unraid.net/product>


## reference

- FreeNAS vs Unraid <https://www.youtube.com/watch?v=aXsRIrC5bjg>
https://www.openmediavault.org
