---
layout: post
title: "每天学习一个命令：du 找出哪个文件夹占用空间"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, du, df, disk-space, disk, ]
last_updated:
---

最近 VPS 磁盘空间一直上涨报警，就想查看一下哪个文件夹占用空间比较大，可以腾出一些可用空间来。查了一圈发现 `du` 命令就是该功能。`du` 全称 disk usage，

`du` 文档中就是这么描述他的功能的 ---- 文件占用的空间，具体用法

    du [OPTIONS] ... [FILE] ...

和绝大多数的命令一样，支持很多的选项，最常用的和 `df` 命令一样 `-h`，可以记忆 `--human-readable` ，用比较人性化的单位，比如 K，M，G。

所以这样就可以使用

    du -h <dir> | grep '[0-9\,]\+G'

来快速的找到占用空间比较大的文件夹。

## 用法

除了上面提到了 `-h` 参数，du 命令还有一些其他的参数

### 查看当前目录及其指定深度目录的大小

    du -ah –-max-depth=0

- `-a` 显示目录中所有文件及文件夹大小
- `-–max-depth＝n` : 深入到第 n 层目录，此处设置为 0，即表示不深入到子目录，设置为 1，则超过 1 层深度则忽略


### 忽略目录或文件

    du --exclude=/path


### 只报告目录占用空间总量

    du -hs

更多的命令使用方法可以参考 [tecmint](https://www.tecmint.com/check-linux-disk-usage-of-files-and-directories/)
