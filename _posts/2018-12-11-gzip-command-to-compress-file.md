---
layout: post
title: "每天学习一个命令：gzip 压缩文件"
aliases: "每天学习一个命令：gzip 压缩文件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, gzip, tar, command, ]
last_updated:
---

gunzip 是个使用广泛的解压缩程序，它用于解开被 gzip 压缩过的文件，这些压缩文件预设最后的扩展名为".gz"。  事实上 gunzip 就是 gzip 的硬连接，因此不论是压缩或解压缩，都可通过 gzip 指令单独完成。

## 命令格式

    unzip  [-Z]  [-cflptTuvz[abjnoqsCDKLMUVWX$/:^]]  file[.zip] [file(s) ...]
       [-x xfile(s) ...] [-d exdir]

常用参数：

- `-c` 将输出写到标准输出上，并保留原有文件
- `-d` 把 .gz 文件解压出来
- `-l` 查看当前压缩文件的信息。
- `-r` 递归式地查找指定目录并压缩其中的所有文件或者是解压缩
- `-t` 测试，检查压缩文件是否完整
- `-num` 用指定的数字 num 调整压缩的速度，-1 或 --fast 表示最快压缩方法（低压缩比），-9 或 --best 表示最慢压缩方法（高压缩比）系统缺省值为 6
- `-v` 对每一个压缩和解压的文件，显示文件名和压缩比。

## 使用实例

### 压缩

    gzip file1

压缩直接使用 gzip 加上文件名，还可以指定压缩率默认是 6 ，最高是 9 最低是 1。

### 解压缩
`-d` 表示解压缩， 等同于 `--decompress`。`-v` 表示 verbose，打印更多的日志：

    gzip -dv file.gz

### 显示压缩包内容

    gzip -l file.gz

可以显示压缩之后的大小 解压缩之后的大小 压缩率是多少，大概像下图这样。

    compressed       uncompressed         ratio          uncompressed_name
      23124234          110229            60.4%          file.gz

### 合并多个 gzip 文件
可以使用 `cat` 来合并多个 gzip ：

```
cat 1.gz 2.gz 3.gz > total.gz
```

