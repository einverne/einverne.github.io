---
layout: post
title: "Linux 下设置编码格式 locales"
tagline: ""
description: ""
category: 经验总结
tags: [locale, unix, linux, encoding, utf8]
last_updated:
---

很多人在程序中会处理 non-ASCII 字符，在日志中，在终端显示中等等。

## locales installs

检查 locales 是否安装

    dpkg -l locales

如果 locales 之前显示 `ii` 表示已经安装了，否则

    sudo apt install locales

重新配置

    dpkg-reconfigure locales

## locales 配置
使用命令 `locale` 查看配置

    locale
    LANG=en_US.UTF-8
    LANGUAGE=en_US:en
    LC_CTYPE=en_US.UTF-8
    LC_NUMERIC=zh_CN.UTF-8
    LC_TIME=zh_CN.UTF-8
    LC_COLLATE="en_US.UTF-8"
    LC_MONETARY=zh_CN.UTF-8
    LC_MESSAGES="en_US.UTF-8"
    LC_PAPER=zh_CN.UTF-8
    LC_NAME=zh_CN.UTF-8
    LC_ADDRESS=zh_CN.UTF-8
    LC_TELEPHONE=zh_CN.UTF-8
    LC_MEASUREMENT=zh_CN.UTF-8
    LC_IDENTIFICATION=zh_CN.UTF-8
    LC_ALL=

在 `.bashrc` 中放入如下设置：

    export LANG=en_US.UTF-8
    export LC_ALL=en_US.UTF-8

## Q & A
某些情况下在终端 `less /path/to/logfile` 会显示 `\u` 开头的中文编码，这是 unicode 编码，大部分情况下 less 会使用 UTF-8 去查看文件。但是如果文件编码格式非 UTF-8 那么可能会有些问题。

使用 `file /path/to/file` 来查看文件的编码。

## reference

- <https://perlgeek.de/en/article/set-up-a-clean-utf8-environment>
