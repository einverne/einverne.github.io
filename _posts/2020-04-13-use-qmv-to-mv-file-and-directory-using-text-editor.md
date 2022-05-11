---
layout: post
title: "每天学习一个命令：qmv 在文本编辑器中对文件及目录进行编辑"
tagline: ""
description: ""
category: 学习笔记
tags: [qmv, linux, command, rename, batch-rename, ]
last_updated:
---

在给 tldr review 提交时，有一个命令引起了我的兴趣，那就是 `qmv`，当时简单的尝试了一下，浏览了一下 man page。没有仔细的深入，但昨天突然遇到一个需求，我要批量修改一个目录下文件的大小写，需要将大写部分修改成小写，一下子就想起了这个命令。虽然这个命令是作为移动来介绍的，但它也可以作为重命名来使用，毕竟重命名也算是移动的一种嘛。

命令的使用特别简单，直接使用 `qmv` 后面接目录名即可，然后会打开默认的文本编辑器， 比如`vi`，然后在其中能看到两列，左边是原始名字，后面是目标名，如果要批量修改重命名那就直接对后面一列进行编辑即可。最后保存退出，那么 qmv 会自动把所作的修改应用到文件中。

[![asciicast](https://asciinema.org/a/319474.svg)](https://asciinema.org/a/319474)

## 延展
qmv 是属于`renameutils` 这个包，这个包中还有 `qcp` 和 `qcmd`，看名字应该比较好猜，`cp` 和 `cmd`，复制和执行。

通过如下方式安装：

    sudo apt install renameutils
    
macOS 下：

    brew install renameutils


## reference

- <http://manpages.ubuntu.com/manpages/bionic/man1/qcmd.1.html>
