---
layout: post
title: "从零搭建一台 NAS：软件篇"
aliases: "从零搭建一台 NAS：软件篇"
tagline: ""
description: ""
category: 学习笔记
tags: [nas, software, server, operating-system,]
last_updated:
---

之前总结过一篇 [NAS 硬件](/post/2018/12/build-nas-from-scratch.html) 介绍了自组 NAS 可能遇到的一些名词和概念，这里再总结一下相关的软件。

## Operating System
首先就是操作系统的选择，[这里](/post/2020/02/nas-operating-system-choice.html) 也简单总结过 FreeNAS，OpenMediaVault 和 [[unRAID]] 的优缺。

## 软件的选择

### MergerFS
MergerFS 提供了一种简单的，类似于存储池的概念，可以让我们通过简单的方式来访问多块硬盘，和 unRAID, Synology, Qnap 提供的方式类似。总结一下就是 MergerFS 允许我们混合合并多个数据卷到一个挂载点下。

> mergerfs is a union filesystem geared towards simplifying storage and management of files across numerous commodity storage devices. It is similar to mhddfs, unionfs, and aufs.

特性：

- 组合多块磁盘成存储池
- 支持多块不同格式，不同大小的硬盘
- 支持增量升级硬盘，可以不用一下子购入一组硬盘来扩充容量
- 将多个硬盘驱动器组合在一个挂载点进行读取和写入
- 为每个驱动器提供一个单独可读的文件系统，所以假如想要拆下一块硬盘，那么这块硬盘也可以挂载到其他系统中使用
- 只运行当前有读写任务的硬盘

官网：

- <https://github.com/trapexit/mergerfs/>

#### 安装
直接从源安装：

	apt install mergerfs fuse

或者用 deb 安装：

	wget https://github.com/trapexit/mergerfs/releases/download/*/mergerfs_*.debian-stretch_amd64.deb && dpkg -i mergerfs*.deb

### Docker

Docker 官方的教程已经足够清晰：

	apt install curl
	curl -sSL https://get.docker.com | sh

为了管理方便，可以将自己的用户名加入到 Docker 用户组：

	usermod -aG docker your-name

Test Docker：

	docker run --rm hello-world


### snapRAID
snapRAID 是一个备份应用，他可以在一组硬盘中计算 parity，然后通过 parity 来恢复磁盘故障可能带来的数据丢失。snapRAID 是 'snapshot' RAID 的缩写，它不是和 mdadm, ZFS 或者 uRAID 那样实时备份，它需要定时运行 sync 来同步。

snapRAID 支持不同大小的硬盘，但是 partiy 磁盘必须要大于或等于最大的数据盘的容量。

- snapRAID 支持最多 6 块 parity 磁盘（基于奇偶校验保护），这就使得 snapRAID 可以提供远超过 ZFS 和 BTRFS RAID 的错误容忍。
- snapRAID 的数据完整性校验使用 128 bit 校验和，类似于 ZFS 的 256bit 校验和，snapRAID 可以自动修复这些错误。
- 此外，上次同步以后更改的任何文件都可以逐个文件还原，从而在文件级别提供了非常完善的备份解决方案。要知道 RAID 并**不是**备份。
- snapRAID 还可以在已经有数据的磁盘中使用，这想比如传统的 RAID，又是一个巨大的进步。
- 再者，它只会让正在使用的磁盘运转，不像 RAID 即使获取一个文件，也需要所有磁盘运转。

> SnapRAID is a backup program for disk arrays. It stores parity information of your data and it recovers from up to six disk failures.

SnapRAID 是为一组不经常修改的文件而设计的，一个常见的用例就是媒体或家用服务器。假设你拥有 2TB 的影片，2TB 的剧集，你多长时间更改他们一次？并不是很经常吧。那么你需要对这些文件进行实时的奇偶校验计算，还是在每天固定时间安静地执行一次？我的想法就是每天一次同步就已经足够保证数据的安全。

再举一个简单的例子，假如你下载了一个文件，并保存为 "WorstMovieEver.mkv"，这个文件立即可以访问到，但直到下一次奇偶校验（或者奇偶校验快照）执行，这个文件都是没有被保护的。这就意味着在下载完成后到执行奇偶校验这个过程中，如果你遇到了磁盘故障，那么这个文件就无法恢复了。值得注意的是，如果文件足够重要，那么手工执行一次 `snapraid sync` 也是非常简单的。

snapRAID 在 GPL v3 开源许可下开源，snapRAID 支持大量的操作系统，包括但不限于 Linux, OS X, Windows, BSD, Solaris 等等。

官网：

- <http://www.snapraid.it/>

经过上面的一大番解释，相信你已经了解 snapRAID 的运作方式了，在使用 snapRAID 之前请先审视一下自己的使用场景。snapRAID 非常不适用于频繁修改的应用程序，例如数据库或其他类似的应用程序，如果你的使用场景是类似这种，那么请优先考虑实时奇偶校验的解决方案。如果你能够容忍可能造成数据丢失的时间窗口，并且有一批静态的大文件，SnapRAID 就是为你准备的。

#### 安装 {#installation}
[@IronicBadger](https://twitter.com/IronicBadger) 提供了一键编译脚本：

    apt install git
    git clone https://github.com/IronicBadger/docker-snapraid.git
    cd docker-snapraid/
    chmod +x build.sh
    ./build.sh
    cd build/
    dpkg -i snapraid*.deb

    snapraid -V
    # snapraid v11.1 by Andrea Mazzoleni, http://www.snapraid.it


#### 使用 {#usage}
SnapRAID 有详尽的[文档](http://www.snapraid.it/manual).

## reference

- <https://blog.linuxserver.io/2016/02/02/the-perfect-media-server-2016/>
- <https://blog.linuxserver.io/2017/06/24/the-perfect-media-server-2017/>
- <https://blog.linuxserver.io/2019/07/16/perfect-media-server-2019/>
