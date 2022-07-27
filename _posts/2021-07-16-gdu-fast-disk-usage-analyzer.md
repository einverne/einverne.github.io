---
layout: post
title: "使用 gdu 快速查看磁盘空间占用"
aliases:
- "使用 gdu 快速查看磁盘空间占用"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, gdu, du, disk, disk-space, cli, go-lang ]
last_updated:
---

gdu 是一个使用 Go 编写的，非常漂亮的磁盘空间占用分析工具。

直接运行 gdu 可以展示一个非常直观的磁盘空间占用。

gdu 为 SSD 做了优化，但在机械硬盘上也能很好的工作。

![gdu-20210904214154.png](/assets/gdu-20210904214154.png)

## Install
Linux:

```
curl -L https://github.com/dundee/gdu/releases/latest/download/gdu_linux_amd64.tgz | tar xz
chmod +x gdu_linux_amd64
sudo mv gdu_linux_amd64 /usr/bin/gdu
```

macOS:

```
brew install -f gdu
brew link --overwrite gdu  # if you have coreutils installed as well
```

Android Termux 安装：

```
wget https://github.com/dundee/gdu/releases/lastest/download/gdu_linux_arm64.tgz
tar xzvf gdu_linux_arm64.tgz
chmod +x gdu_linux_arm64
```

更多的安装方式可以参考 [repo](https://github.com/dundee/gdu)

## Usage

```
gdu                                   # analyze current dir
gdu -a                                # show apparent size instead of disk usage
gdu <some_dir_to_analyze>             # analyze given dir
gdu -d                                # show all mounted disks
gdu -l ./gdu.log <some_dir>           # write errors to log file
gdu -i /sys,/proc /                   # ignore some paths
gdu -I '.*[abc]+'                     # ignore paths by regular pattern
gdu -c /                              # use only white/gray/black colors

gdu -n /                              # only print stats, do not start interactive mode
gdu -np /                             # do not show progress, useful when using its output in a script
gdu / > file                          # write stats to file, do not start interactive mode

gdu -o- / | gzip -c >report.json.gz   # write all info to JSON file for later analysis
zcat report.json.gz | gdu -f-         # read analysis from file
```
