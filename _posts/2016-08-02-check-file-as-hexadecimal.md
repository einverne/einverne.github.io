---
layout: post
title: "以十六进制查看文件的方法整理"
tagline: ""
description: ""
category: 整理合集
tags: [linux, command, ]
last_updated:
---


使用 `file` 命令来检测 data 文件的类型

    file data

`zsh` 和 `bash` 原生 echo 支持将十六进制 HEX 转成 ASCII

    echo -e '\x68'

将二进制文件写入文件

    printf "\x68\x65\x6c\x6c\x6f\x20\x77\x6f" | cat - oldfile > newfile

## 命令查看

Linux 下可以使用如下命令查看文件二进制

    xxd filename.txt
    hexdump filename.txt

## 编辑

GUI 二进制编辑器

    sudo apt-get install ghex

    biew

    hexedit

使用二进制模式编辑文件

    vim -b datafile

在 vim 编辑器中使用 `:%!xxd` 来将文件变成十六进制

使用 `:%!xxd -r` 来转变为原来的文件

十六进制模式下只有修改十六进制部分才会生效，右边可显示文本部分修改不会对文件有修改效果。

