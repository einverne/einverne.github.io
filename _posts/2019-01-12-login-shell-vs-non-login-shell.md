---
layout: post
title: "登录式 shell 和非登录式 shell 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [shell, linux, tmux, bash, ]
last_updated:
---

昨天在 Tmux 中使用 gpg 时遇到了[一个问题](https://unix.stackexchange.com/q/493700/115007)，在别人的回答中看到了 login shell 和 non-login shell 的区别。在我的情况下终端中 bash 或者 zsh 都是能够使用 gpg 签名 git commit 的，但是在 tmux 下却报了错误。所以才有了这样一篇总结。

登录式 shell 是**用户使用自己的 user ID 登录交互式 shell 的第一个进程**。这里又要提及另外两个概念就是交互式 shell 和非交互式 shell，幸而这两个概念比较好理解。

- 交互式 shell 指的是**在终端有交互的模式，用户输入命令，并在回车后立即执行的 shell**，这种模式也是大部分情况下用户执行的一种方式，比如 ssh 登录
- 非交互式 shell 指的**是 bash shell 以命令脚本的形式执行**，这种模式下，shell 不会和用户有交互，而是读取脚本文件并执行，直到读取到文件 EOF 时结束

说完这两个区别，回到主题：

- 当你在已经存在的终端 session 中开启一个 shell，比如在 screen, Tmux, X terminal 等中，会得到一个交互式，非登录 shell，这时 shell 会**读取**对应的配置（`~/.bashrc` for bash, `/etc/zshrc` and `~/.zshrc` for zsh)
- 当 shell 执行一个脚本，或者通过命令行将命令传送过去执行，这时就是非交互，非登录的 shell。这种 shell 无处不在，在程序调用另外一个程序时非常常见

有一种判断 login shell vs non-login shell 的非常快速的方法，使用命令 `echo $0`

- `-bash` 中 `-` 表示当前是一个 login shell
- `bash` 表示不是 login shell

## Why
至于为什么会有这么多的模式，是因为不同的模式读取的配置文件有所区别。

login shell 会读取不同的配置文件，比如 bash 会读取 `/etc/profile` ， `~/.profile`，`~/.bash_profile` 等配置文件。而 zsh 会是 `/etc/zprofile` 和 `~/.zprofile`

而 non-login shell 只会读取 `~/.bashrc` 配置。

## reference

- <https://unix.stackexchange.com/a/46856/115007>
