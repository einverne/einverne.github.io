---
layout: post
title: "威联通折腾篇十三：替换默认 shell 为 zsh"
aliases: "威联通折腾篇十三：替换默认 shell 为 zsh"
tagline: ""
description: ""
category: [ 学习笔记 , 威联通 ]
tags: [qnap, qnap-tutorial, qpkg, linux, shell, login-shell, zsh, oh-my-zsh, bash ]
last_updated:
---

默认 SSH 登录到 QNAP 的 login shell 可以通过 `echo $SHELL` 来查看到是

    /bin/sh

默认的这个 bash 是 QNAP 自带的

    /bin/sh --version
    GNU bash, version 3.2.57(1)-release (x86_64-QNAP-linux-gnu)
    Copyright (C) 2007 Free Software Foundation, Inc.

也是一个相对比较简陋的版本，自动补全很难用，也没有语法高亮。所以想能不能把 QNAP 自带的 shell 换成日常使用的 ZSH，QNAP 本质上就是一个 Linux，所以理所当然的应该是可行的。

## Installation

首先要要解决的问题是安装问题，普通的 Linux 发行版直接使用一行命令就可以完成，QNAP 可以使用 [QNAP club](https://www.qnapclub.eu/en/qpkg/706) 别人提供的版本，直接安装即可

    wget https://cdn.qnapclub.eu/qpkg_artifacts/ZSH_5.7.0_x86_64/ZSH_5.7.0_x86_64.qpkg
    sh ZSH_5.7.0_x86_64.qpkg

如果你参考过我之前的[文章](/post/2018/04/qnap-ts453bmini.html) 你应该知道添加了 QNAP Club 的地址可以直接在 App Center 中直接搜索下载。

安装好之后，默认的 zsh 会安装到

    /opt/ZSH

## Usage

SSH 登陆 QNAP 之后直接在终端输入 `zsh` 即可进入 zsh。

ZSH 一些强大的功能：

- 强大的补全功能
- 错误检查以及自动更正
- 命令别名、路径别名
- 强大的提示信息

默认的配置在 `/opt/ZSH` 中，可以自己做一些微调，比如

    vi /opt/ZSH/zshrc.zsh-template
    or
    vi /root/.zshrc

修改主题

    ZSH_THEME="agnoster"

等等。

## Tips

如果在使用过程中发现,delete功能异常,比如delete虽然删除了字符但是向右多显示一个空格，而且不显示移动光标
那么可以编辑*zsh*配置文件
``` shell
vi ~/.zshrc
```
在.zshrc里添加
``` shell
TERM=xterm
```
保存, 然后执行, 使配置生效
``` shell
source ~/.zshrc
```

