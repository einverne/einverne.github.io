---
layout: post
title: "每天学习一个命令：tail 打印到标准输出"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, tail, tailf, command, ]
last_updated:
---

tail 命令从指定点开始将文件写到标准输出。使用 tail 命令的 -f 选项可以方便的查阅正在改变的日志文件，tail -f filename 会把 filename 里最尾部的内容显示在屏幕上，并且不但刷新，使你看到最新的文件内容。

默认情况下 tail 会打印文件最后 10 行。

## 命令格式

    tail [OPTION] file

用于显示指定文件末尾内容，不指定文件时，作为输入信息进行处理。常用查看日志文件。

命令参数：

    -f          循环读取，只要文件有修改会立即显示
    -q          不显示处理信息
    -v          显示详细的处理信息
    -c NUM      显示的字节数
    -n NUM      显示行数
    --pid=PID 与 -f 合用，表示在进程 ID,PID 死掉之后结束。
    -q, --quiet, --silent 从不输出给出文件名的首部
    -s, --sleep-interval=S 与 -f 合用，表示在每次反复的间隔休眠 S 秒


## 使用实例



### 显示文件末尾内容

命令：

    tail -n 5 /var/log/syslog

说明：

显示文件最后 5 行内容，使用重定向可以将最后 10000 行重定向到其他文件，比如

    tail -n 10000 /var/log/syslog > newfile.log


### 循环查看文件内容

命令：

    tail -f /var/log/syslog


### 从第 5 行开始显示文件

命令：

    tail -n +5 /var/log/syslog

## 衍生
tailf 是 `tail -f` 的快捷版本，man 手册中 tailf 已经被启用，可以使用一个 alias 来继续使用 tailf。


