---
layout: post
title: "每天学习一个命令：tee 读取标准输入并输出"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, ]
last_updated:
---

在执行 Linux 命令时，我们可以把输出重定向到文件中，比如 `ls > a.txt`，这时我们就不能看到输出了，如果我们既想把输出保存到文件中，又想在屏幕上看到输出内容，就可以使用 tee 命令了。tee 命令读取标准输入，把这些内容同时输出到标准输出和（多个）文件中（read from standard input and write to standard output and files. Copy standard input to each FILE, and also to standard output. If a FILE is -, copy again to standard output.）。

在 tee 中说道：tee 命令可以重定向标准输出到多个文件（`tee': Redirect output to multiple files. The `tee' command copies standard input to standard output and also to any files given as arguments.  This is useful when you want not only to send some data down a pipe, but also to save a copy.）。要注意的是：在使用管道时，前一个命令的标准错误输出不会被 tee 读取。

## 实例

格式：

    tee file

输出到标准输出的同时，保存到文件 file 中。如果文件不存在，则创建；如果已经存在，则覆盖之。当使用 `-a` 参数时不会覆盖，而是附加。

格式：

    tee -a file

输出到标准输出的同时，追加到文件 file 中。如果文件不存在，则创建；如果已经存在，就在末尾追加内容，而不是覆盖。

格式：

    tee -

输出到标准输出两次。（A FILE of `-' causes `tee' to send another copy of input to standard output, but this is typically not that useful as the copies are interleaved.）

格式：

    tee file1 file2 -

输出到标准输出两次，同时保存到 file1 和 file2 中。

使用 tee 命令重复输出字符串

    echo 12345 | tee
    12345

    echo 12345 | tee -
    12345
    12345
    echo 12345 | tee - -
    12345
    12345
    12345

使用 tee 命令把标准错误输出也保存到文件，默认情况下 tee 是不会将标准错误内容也保存到文件的，这个时候需要使用 `2>$1`

    ls "*" 2>&1 | tee ls.txt

文件中就是

    ls: cannot access '*': No such file or directory

