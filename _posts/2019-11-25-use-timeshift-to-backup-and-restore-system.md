---
layout: post
title: "使用 timeshift 来备份和还原系统"
tagline: ""
description: ""
category: 学习笔记
tags: [timeshift, linux, backup, restore, security, ]
last_updated:
---

Linux Mint 自带的备份和还原工具就是 timeshift, 今天看到有人[贡献](https://github.com/tldr-pages/tldr/pull/3613) timeshift 的命令行版本，突然意识到这个工具其实还有命令行版本。


## 安装 {#installation}

	sudo apt-add-repository -y ppa:teejee2008/ppa
	sudo apt-get update
	sudo apt-get install timeshift

## Snapshot Type
timeshift 提供两种模式的备份方式：

- RSYNC
- BTRFS

RSYNC 在第一次使用时会拷贝所有文件，以后每次备份都是增量备份，使用硬链接创建从上一次快照未修改的系统文件。快照文件可以保存到任何 Linux 文件系统的硬盘格式下，保存快照到非系统盘或者外部硬盘上，这样即使系统盘损坏或者被格式化也能够快速从外部硬盘恢复数据。RSYNC 支持排除文件和目录来节省硬盘空间。

BTRFS 需要安装 `btrfs-tools`，快照通过 BTRFS 文件系统创建，快照备份和恢复的速度要比 RSYNC 快，快照创建和恢复都是原子事务的，不能中断。快照通过替换系统 subvolumns 来恢复，因为文件没有拷贝，删除或者覆盖，不会有文件丢失的风险。恢复后的系统会作为一次新的快照。快照在备份时是完美地逐字节拷贝，不能排除任何文件。快照会存在系统相同的硬盘上，暂时还不支持备份到其他硬盘，如果系统盘损坏，那么快照也会丢失。初始 BTRFS 备份是 0 字节，但是随着系统使用占用内容会逐日增多，快照中的文件依然还是会指向原始的文件 block. 系统必须安装在 BTRFS 分区上，并使用 Ubuntu-type subvolumn layout(@ and @home subvolumns)，其他的 layouts 不支持。

## Usage
通过界面可以非常快速的设置 timeshift.

### 设置过滤器
在标签页，Filters 一栏中可以设置不备份的路径。

### Cron 备份
通过界面可以定制简单的定时备份任务，但是如果界面无法满足高级的需求，比如固定时间调用 timeshift 来备份，那么可以使用 cron 脚本来定时备份。比如要在每天下午 7 点中执行备份，可以新建 `/etc/cron.d/timeshift_daily_7p` 并在其中配置：

	SHELL=/bin/bash
	PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
	MAILTO=""

	0 19 * * * root timeshift --create --tags D --scripted

## 无法进入系统时如何从 timeshift 恢复
如果安装某些程序导致了无法进入系统，那么可以用 USB 上的系统进入，然后在 USB 启动的系统中使用 timeshift 来恢复系统。


## reference

- <https://linuxmint-installation-guide.readthedocs.io/en/latest/timeshift.html>
- man timeshift
