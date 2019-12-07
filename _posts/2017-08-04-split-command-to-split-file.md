---
layout: post
title: "每天学习一个命令：使用 split 分割文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [split, command, linux, ]
last_updated:
---

split 命令可以用来分割文件，支持按文本分割，也支持二进制分割。常见的格式

    split [OPTION]... [FILE [PREFIX]]

输出的结果为多个文件 PREFIXaa，PREFIXab ...  默认的大小是 1000 行，默认的 PREFIX 是 `x`。

如果没有 FILE 文件，或者当 FILE 参数是 `-` 时，会从标准输入读取。

## 举例

### 按文件大小
`-C` 指定分割文件大小：

    split -C 10M large_file.mp4 small

将大文件 `large_file.mp4` 按照 10M 大小进行分割，并指定分割后文件前缀 `small`，不指定前缀时， 自动对分割文件名命名，一般以 x 开头

### 按行分割
`-l` 选项后接分割行

    split -l 1000 large_file.txt small

### 二进制分割

    split -b 100M data.bak smail

## 合并

    cat small* > new_file.txt




