---
layout: post
title: "每天学习一个命令：使用 rz sz 向服务器发送文件"
tagline: ""
description: ""
category: 学习笔记
tags: [rz, sz, linux, server, scp, command, ]
last_updated:
---

搜索 rz sz 命令使用方式进来的，可以不用往下看了，直接学习 [scp](/post/2017/03/scp-copy-file-between-machines.html) 或者 [rsync](/post/2017/07/rsync-introduction.html) 吧， rz sz 看了一下还是有很多限制的。

虽然它可以实现向服务器发送文件，或者接受服务器的文件，但是限制条件必须在 screen 中执行，另外如果要在 Tmux 中使用还需要特殊的 hack [^t]

[^t]: <https://v2ex.com/t/379440>

## 使用
所以最基本的使用就是：

	rz -be


