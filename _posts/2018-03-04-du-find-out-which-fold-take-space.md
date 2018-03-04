---
layout: post
title: "每天学习一个命令：du 找出哪个文件夹占用空间"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, du, df, ]
last_updated: 
---

最近VPS磁盘空间一直上涨报警，就像查看一下哪个文件夹占用空间比较大，可以腾出一些可用空间来。查了一圈发现 `du` 命令就是该功能。

`du` 文档中就是这么描述他的功能的----文件占用的空间，具体用法

    du [OPTIONS] ... [FILE] ...

和绝大多数的命令一样，支持很多的选项，最常用的和 `df` 命令一样 `-h`，可以记忆 `--human-readable` ，用比较人性化的单位，比如 K，M，G。

所以这样就可以使用

    du -h <dir> | grep '[0-9\,]\+G'

来快速的找到占用空间比较大的文件夹。

更多的命令使用方法可以参考[tecmint](https://www.tecmint.com/check-linux-disk-usage-of-files-and-directories/)
