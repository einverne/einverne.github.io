---
layout: post
title: "每天学习一个命令：uniq 打印唯一行"
tagline: ""
description: ""
category: 学习笔记
tags: [uniq, linux, command, awk,]
last_updated: 
---

查看 `man uniq` 得知这个命令是用来显示，或者隐藏重复行的命令，一般情况下使用管道命令组合其他 `cat`, `grep`, `awk`, `sort` 等等使用。可用来过滤重复行，或者找到文本中重复的行。

## 基本使用
`uniq` 的基本使用如下：

    uniq [OPTION]... [INPUT [OUTPUT]]

`uniq` 会从标准输入读取数据，过滤相邻的行，并将结果输出到标准输出。如果没有其他选项，重复的行会合并到第一次出现的行上。

一些常用参数

- `-c` 在每一行前打印行出现的次数
- `-d` 只打印重复的行，重复的行只打印一次
- `-D` 打印出所有重复的行
- `-f` 在比较时跳过前N个fields
- `-i` 在比较重复行时忽略大小写
- `-s` 在比较时忽略前N字符
- `-u` 只打印唯一的行
- `-w` 比较时只比较每一行的前N个字符

通常情况下field是由空格或者 TABs 分割的。

通常情况下，`uniq` 会和 `sort` 搭配使用。

命令返回 `0` 或者 `>0` 的数值表示退出，如果为 `0` 表示运行成功，`>0` 的数值表示发生错误。

## 实例

打印重复行的数量

    sort file.txt | uniq -c

可以使用 `-s` 参数跳过开头N个字符

    cat /var/log/nginx.log | uniq -s 10


