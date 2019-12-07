---
layout: post
title: "每天学习一个命令：tr 命令行届的翻译"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, tr, command, ]
last_updated:
---

tr 是 translate 的缩写。

    tr [OPTION] SET1 [SET2]

translate SET1 to SET2

## 转换大小写

    cat "abc" | tr a-z A-Z
    cat "abc" | tr [:lower:] [:upper:]

## 将空白转换成 TABs

    echo "a b" | tr [:space:] '\t'

## 转换括号

   echo '{abc}' | tr '{}' '()'
   (abc)

## delete set
删除 `-d` 指定的字符集

    echo "abc" | tr -d 'a'
    bc

删除数字

    ➜ echo "123abc123" | tr -d [:digit:]
    abc


删除连续空白

    ➜ echo "emmmmmmmmmm   no" | tr -s [:space:] ' '
    emmmmmmmmmm no %

## squeeze repeats

    echo "abbbbccccbd"  | tr -s a-z A-Z
    ABCBD

## 使用 -c 补足
比如说想要删除除了数字之外的内容

    ➜ echo "my id is 123" | tr -cd [:digit:]
    123%

单独使用 `-c` 选项则表示将 不是 SET1 中的内容，替换为 SET2 中内容

    ➜ echo 'abc123' | tr -c [:digit:] x
    xxx123x%

## reference

- man tr
