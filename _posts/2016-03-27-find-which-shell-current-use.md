---
layout: post
title: "查看当前正在使用哪种 Shell"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, shell, bash ,sh, zsh]
last_updated:
---

当前正在运行的 shell 路径被保存在 `$0` 环境变量中，可以使用如下方式查看

    echo $0

根据不同系统的实现，输出可能会是当前正在运行的 shell，或者是当前运行的 shell 的路径。

    prompt:~$ echo $0
    /bin/bash
    prompt:~$ sh
    sh-4.0$ echo $0
    sh
    sh-4.0$ exit
    exit
    prompt:~$ /bin/sh
    sh-4.0$ echo $0
    /bin/sh
    sh-4.0$

`$SHELL` 变量保存了用户偏好的 shell，而不是当前正在运行的 shell。

更多关于 shell 的默认特殊变量，可以查看之前的[总结](/post/2017/03/bash-shell-script.html)。
