---
layout: post
title: "每天学习一个命令：wc 统计文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, word-count, ]
last_updated:
---

wc 命令是 Linux 下 Word Count 的缩写，用来统计文件中的字节数，字数，行数等等。

## 命令格式
非常简单

    wc [options] files

## 选项 {#options}

    -c, --bytes 统计字节数
    -l, --lines 统计行数
    -m, --chars 统计字符数，不能和 -c 一起使用
    -w 统计字数，一个字定义为由空白、空格或者换行分割的字串
    -L, --max-line-length 最长行的长度

## 例子

### 查看文件字节数、字数、行数

命令：`wc file.txt`

比如有如下文件：

    cat file.txt  
    Linux
    Debian
    Ubuntu
    Linux Mint

命令有如下结果

    wc file.txt
     4  5 31 file.txt

    wc -l file.txt
    4 file.txt

    wc -c file.txt
    31 file.txt

    wc -w file.txt
    5 file.txt

    wc -m file.txt
    31 file.txt

    wc -L file.txt
    10 file.txt

直接使用命令 `wc file.txt` 输出的内容对应

```
wc file.txt 
4       5          31         file.txt
行数 单词数 字节数 文件名
```


### 不打印文件名

使用管道命令或者重定向来避免命令打印文件名

wc 命令如果从管道命令或者重定向命令中接受输入，则不产生文件名输出，参考如下例子：

当 wc 接受文件名作为参数时，打印出文件名

    wc -l /etc/passwd
    41 /etc/passwd 

当文件以管道形式或者标准输入时不打印文件名

    cat /etc/passwd | wc -l 
    41 

unusual redirection, but wc still ignores the filename 

    < /etc/passwd wc -l
    41 

typical redirection, taking standard input from a file 

    wc -l < /etc/passwd
    41

由此可以看到，当文件被当成 wc 的参数传递过去的时候会打印出文件名，而其他标准输入时候不会打印出文件名。某些情况下，你可能希望打印文件名，因此有必要知道何时会打印文件名，而何时不会打印。
