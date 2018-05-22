---
layout: post
title: "每天学习一个命令：tar 压缩和解压文件"
tagline: ""
description: ""
category: 学习笔记
tags: [tar, linux, archive, extract, command]
last_updated: 
---

tar 本质上只是一个打包命令，可以将存放在多个地方的文件或者文件夹打包第一个文件中，结合其他的压缩程序再将打包后的档案文件压缩。所以看到 `.tar.gz`, `.tar.bz2`, `.tar.xz` 等等文件其实是 tar 文件之后进行 Gzip, Bzip2, XZ 压缩之后的文件。


## 使用
常见的压缩和解压用法

    tar -cvf filename.tar /folder    # 仅打包不压缩
    tar -xvf filename.tar            # 解压包

    tar -zcvf filename.tar.gz /folder # gzip 压缩
    tar -zxvf filename.tar.gz         # 当前目录下解压文件

    tar -jcvf filename.tar.bz2 /folder # bzip2 压缩
    tar -jxvf filename.tar.bz2 -C /path # 解压

    tar -Jcvf filename.tar.xz /folder  # xz 压缩
    tar -Jxvf filename.tar.xz          # 解压

解释

- `-c` 表示创建
- `-x` 表示解压
- `-t` 表示查看压缩包内容
    
        注意 c/x/t 三个参数不能同时使用

- `-v` 表示打印出日志
- `-j` 表示 bzip2
- `-J` 表示 xz
- `-z` 表示 gzip
- `-f ARCHIVE` 后面接文件，`-f` 后面需要直接接压缩包名

经过上面的解释，可以习惯上可以记忆成 压缩格式 (z/j/J) + 压缩/解压/查看 (c/x/t) + v + f 文件名

### 列出压缩包内的文件

    tar -ztvf filename.tar.gz     # 列出 tar.gz 下文件
    tar -zxvf filename.tar.gz folder/filename   # 仅仅解压某个文件

    tar -zcvpf fileetc.tar.gz /etc   # 将 /etc/ 内所有文件备份，并保存其权限 -p

### 保留文件原始属性

    tar -zcvpf file.tar.gz /etc 

这里多了一个 `-p` 参数，保留原始属性时使用

### 排除文件或文件夹

    tar --exclude /path -zcvf file.tar.gz /etc /home

这里注意 `--exclude` 参数


## Gzip Bzip2 vs XZ 

Gzip, Bzip2 和 XZ 是 UNIX 系统下常见的压缩工具。


[这里](https://www.rootusers.com/gzip-vs-bzip2-vs-xz-performance-comparison/) 有篇文章对比了三个工具的压缩率，压缩时间等等
