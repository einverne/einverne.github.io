---
layout: post
title: "每天学习一个命令：tail 输出文件的最后部分内容"
aliases: 
- "每天学习一个命令：tail 输出文件的最后部分内容"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [ linux, tail, log,  ]
last_updated:
---

tail 命令是一个日常查看日志非常常用的命令，用来在终端显示文件的最后部分内容。


## 用例
tail 不加任何参数的情况下，默认显示文件最后 10 行内容。

    tail /path/to/file.log

### 显示文件追加的内容
通常业务系统中以文件形式记录日志时会一直追加到文件末尾，可以使用 `-f` 来显示新追加的内容：

    tail -f /path/to/file.log


### 显示文件结尾 100 行

    tail -100 mail.log
    tail -n 100 mail.log

### 显示文件第20行至末尾

    tail -n +20 mail.log

### 显示结尾10个字符

    tail -c 10 mail.log