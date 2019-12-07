---
layout: post
title: "每天学习一个命令：xclip 与剪贴板交互"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, xclip, ]
last_updated:
---

xclip 命令可以从 stdin，或者文件读入数据到剪贴板，或者将剪贴板内容粘贴到目的应用中。xclip 命令建立了终端和剪切板之间通道，可以用命令的方式将终端输出或文件的内容保存到剪切板中，也可以将剪切板的内容输出到终端或文件

## 安装

    sudo apt-get xclip

## 命令格式

    xclip [OPTION] [FILE] ...

常用参数：

    -i      从 stdin 读入
    -o      打印到标准输出

## 使用实例

不加选项时只在保存在 X PRIMARY（终端剪切板），加上选项 `-selection c` 后保存在 X CLIPBOARD（外部程序剪切板）

为了区分这二者的区别，可以简单的做一个试验。

    echo "Hello World" | xclip

此时 Hello World 字符只是在终端的剪贴板中，可以尝试在终端鼠标中键粘贴，发现终端的粘贴板是已经被修改的，此时用 Ctrl + v 粘贴到其他 GUI 应用程序（比如 Chrome 地址栏）发现粘贴板并不是 Hello World。

    echo "TEST OUTSIDE CLIPBOARD" | xclip -sel c

此时会发现 Chrome 中可以粘贴 TEST 这行文本，而鼠标中键粘贴到终端的还是上面的 Hello World。

### 终端输出保存到剪切板中

    ls -al | xclip
    echo "SOME" | xclip
    xclip /etc/passwd
    xclip < /etc/passwd

此时 ls -al 的输出内容已经保存在剪切板中了，此时 xclip -o 可以看到剪切板的内容。

但此时还不可以粘贴到终端以外的程序中，此时需要用到： xclip -selection c

    ls -al | xclip -selection c
    xclip -sel c /etc/passwd
    xclip -sel c < /etc/passwd

### 剪切板内容输出到终端

    xclip -o
    xclip -selection c -o

### 剪切板内容输出到文件

    xclip -o > ~/test.txt
    xclip -selection c -o > ~/test.txt

## reference

- man xclip
