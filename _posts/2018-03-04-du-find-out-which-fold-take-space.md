---
layout: post
title: "每天学习一个命令：du 找出哪个文件夹占用空间"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, du, df, disk-space, disk, ]
last_updated:
---

最近 VPS 磁盘空间一直上涨报警，就想查看一下哪个文件夹占用空间比较大，可以腾出一些可用空间来。查了一圈发现 `du` 命令就是该功能。`du` 全称 disk usage，

`du` 文档中就是这么描述他的功能的 ---- 文件占用的空间，具体用法

    du [OPTIONS] ... [FILE] ...

和绝大多数的命令一样，支持很多的选项，最常用的和 `df` 命令一样 `-h`，可以记忆 `--human-readable` ，用比较人性化的单位，比如 K，M，G。

所以这样就可以使用

    du -d 2 -h <dir> | grep '[0-9\,]\+G'
    sudo du -h --max-depth=1

来快速的找到占用空间比较大的文件夹，这里的 `-d` 实际是 `--max-depth` 的缩写形式，也就是查看 dir 目录下，最多往下查找 2 层，然后以 `-h` 比较友好的方式输出结果。

## 用法

除了上面提到了 `-h` 参数，du 命令还有一些其他的参数

当我们使用 `-h` 选项时命令会根据不同的大小给出合适的 K, M, G 单位，方便查看，但如果想要强制命令输出统一的单位可以使用 `-BM`

这里将 `-BM` 拆开，`-B` 表示的是 `--block-size=SIZE`， M 表示的是兆，同理可以使用 `-BG` 强制使用 G 单位。

### 查看当前目录及其指定深度目录的大小

    du -ah –-max-depth=0

- `-a` 显示目录中所有文件及文件夹大小
- `-–max-depth＝n` 这个选项也能简写成 `-d n`: 深入到第 n 层目录，此处设置为 0，即表示不深入到子目录，设置为 1，则超过 1 层深度则忽略


### 忽略目录或文件

    du --exclude=/path


### 只报告目录占用空间总量
`-s` 显示总和

    du -hs /path

如果使用 `du -h` 那么会打印出 path 下所有目录的占用情况，如果使用 `-s` 那么只会输出 /path 占用的空间。

### 额外报告总量
使用 `-c` 选项会额外在最后打印两行总占用量

    du -ch /Download

例如：

    ..
    ..
    3.3G	Downloads
    3.3G	total


### 分割子目录占用

通常情况下 du 会打印目录及其下所有子目录大小，加入有一个目录 Parent，下方有 SubDirA，SubDirB，还有很多的文件在 Parent 目录下，那么想要知道所有在 Parent 下文件占用，但是不想包括 SubDirA 和 SubDirB 的空间，那么可以使用 `-S` 选项。

    du -h -S -d 2 /path/to/Parent

## 外延

熟悉了 `du` 命令之后，还有一个可视化更好的工具叫做 [ncdu](/post/2018/03/disk-analyze-ncdu.html)，在终端中使用比较友好的展示来显示磁盘空间占用。

更多的命令使用方法可以参考 [tecmint](https://www.tecmint.com/check-linux-disk-usage-of-files-and-directories/)
