---
layout: post
title: "每天学习一个命令：sort 排序"
tagline: ""
description: "sort 命令可以在命令行中快速排序输出"
category:
tags: [linux, sort, command, ]
last_updated:
---

sort 命令用来对文件行进行排序，常用的一些参数

- `-n` 表示数字序号
- `-r` 表示逆序
- `-k,` 表示根据第几列
- `-t,` 表示字段与字段之间的分隔符

## 使用

### 按第三列排序

    sort -nk3 /path/to/file

解释：

- `-n` 表示的是按照字母序排
- `-k3` 表示第三列

### 按列优先级排序
比如有一行数据包含多列，需要按照第一列排序，然后按照第三列排序

    1  a  2
    3  b  5
    1  c  4
    2  d  2
    3  e  1

期望的结果是按照第一列先排序，然后第三列排序

    1  a  2
    1  c  4
    2  d  2
    3  e  1
    3  b  5

那么可以使用命令

    sort -n -k1,1 -k3,3 /path/to/file

严格意义来说，`-k3` 表示的是从第三个字段开始到行尾。

### 使用自定义分隔符

    sort -t: -nk3 /etc/passwd
    sort -t' ' -k3,3 file

`-t` 后面接 `:` 表示以 `:` 来分割列，最常见的比如 `/etc/passwd` 文件，以 `:` 来区分一行中的各个列

### 合并两个文件并且移除重复行
一个典型的 sort 应用场景

    sort file1 file2 | uniq

### 排序日志中耗时最大的行

假设有日志

	2020-02-02 11:20:20 requestId method=someGet param=param cost=100
	2020-02-02 11:20:21 requestId1 method=someGet param=param cost=101
	2020-02-02 11:20:22 requestId2 method=someGet param=param cost=103

现在要过滤出其中耗时最大的行，可以使用

	sort -r -nk4 -t= log.txt

解释：

- `-t=` split lines by `=`，so the string to sort is column 4
- `-k4` sort column 4
- `-n` numberic order
- `-r` reverse order

From: <https://stackoverflow.com/q/62493937/1820217>

