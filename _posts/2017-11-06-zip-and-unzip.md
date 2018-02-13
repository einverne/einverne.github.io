---
layout: post
title: "每天学习一个命令：zip and unzip 压缩及解压缩"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, command, zip, tar, archive, ]
last_updated: 
---

zip 是一个非常常见的压缩工具，很多平台包括 Unix, VMS, MSDOS, OS/2, Windows 9x/NT/XP, Minix, Atari, Macintosh, Amiga, and Acorn RISC OS 等都有应用。zip 结合了打包和压缩。

## 基本使用
参数非常多

    zip options archive inpath infile
    zip [-aABcdDeEfFghjklLmoqrRSTuvVwXyz!@$] [--longoption ...]  [-b path] [-n suffixes] [-t date] [-tt date] [zipfile [file ...]]  [-xi list]


- `-h` 帮助
- `-m` 将文件压缩后，删除源文件
- `-o` 将文件内所有为的文件最新变动设置为压缩时间
- `-q` 安静模式，压缩时不显示执行的执行过程
- `-r` 将执行的目录下所有子目录及文件一同处理
- `-S` 包含系统文件和隐藏文件

## 实例

将文件及文件夹打包到 `dest.zip` 中。

    zip -r dest.zip path/to/folder file

压缩时排除某些目录

    zip -r dest.zip folder -x *.git*

使用密码压缩文件

    zip -r -P password dest.zip file folder

解压文件

    unzip dest.zip

解压文件到特定文件夹

    unzip dest.zip -d /path/to/folder

不解压查看压缩包内部内容

    unzip -l dest.zip
    unzip -v dest.zip

在 Linux 下经常遇到 zip 乱码的情况呢，其实因为 Windows或者其他系统下生成默认使用 GBK/GB2312 编码，而在 Linux 下默认为 UTF8，所以可以使用 unzip 的 `-O` 参数，这个参数 只有 `unzip 1.6` 及以上版本才有。

    unzip -O cp936 file.zip -d /path/to/folder

## reference

- man zip
- man unzip
