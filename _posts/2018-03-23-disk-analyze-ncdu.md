---
layout: post
title: "每天学习一个命令：ncdu 磁盘分析工具"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, ubuntu, ncdu, disk]
last_updated: 
---

最近想把机械硬盘换成 SSD，然后使用 `du -h` 查看了一下本地硬盘使用，发现用了180多G，想要清理一下废弃的大文件，然后就发现了这个非常好用的磁盘管理工具 ncdu。 Ubuntu 源下有这个软件，可以直接使用命令安装：

    sudo apt install ncdu

## 使用

终端下直接使用 ncdu ，然后工具就会直接扫描当前目录，并且按照文件及文件夹占用大小，从大到小排列，例如：


       22.2 GiB [#####     ] /Documents
       16.2 GiB [###       ] /.local
    .  13.7 GiB [###       ] /.cache
       10.9 GiB [##        ] /.m2
       10.8 GiB [##        ] /Dropbox
        9.8 GiB [##        ] /Git
        3.2 GiB [          ] /.IntelliJIdea2016.3
        2.2 GiB [          ] /.pyenv
        1.4 GiB [          ] /.IdeaIC2016.3
        1.3 GiB [          ] /.wiznote

在界面中按下 `?` 就会发现很多快捷键


    ┌───ncdu help─────────────────1:Keys───2:Format───3:About──┐
    │                                                          │
    │       up, k  Move cursor up                              │
    │     down, j  Move cursor down                            │
    │ right/enter  Open selected directory                     │
    │  left, <, h  Open parent directory                       │
    │           n  Sort by name (ascending/descending)         │
    │           s  Sort by size (ascending/descending)         │
    │           C  Sort by items (ascending/descending)        │
    │           d  Delete selected file or directory           │
    │           t  Toggle dirs before files when sorting       │
    │           g  Show percentage and/or graph                │
    │                        -- more --                        │
    │                                         Press q to close │
    └──────────────────────────────────────────────────────────┘

看到这个快捷键，就可以疯狂的使用`d` 来删除不再使用的大文件了。

最后开心的按下 `q` 退出。
