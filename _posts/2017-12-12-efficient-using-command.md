---
layout: post
title: "优雅地使用命令行"
tagline: ""
description: ""
category: 经验总结
tags: [linux, command, git, tmux]
last_updated:
---

## 使用快捷键
Ctrl+a  Ctrl+e
Ctrl+u
Ctrl+r

Ctrl+n Ctrl+p 等等

更多的快捷键和 bash 的内容可以参考[这篇](/post/2015/09/bash-learning-notes.html)

## 终端显示 Git 分支
绝大多数情况下会在终端来管理 git 项目，对 git 项目最好能够有一个直观的显示，包括当前的分支，修改的内容，命令行空间比较小，但是也能够显示分支名和是否有修改，推荐使用

oh-my-zsh

## 使用别名
把每天要使用 5 次以上的命令都制作别名保存到 bashrc 或者 zshrc 中

    alias vi='vim'

## 使用 Terminator 或者 Tmux
如果经常切换不同的终端窗口执行不同的任务，那么就需要考虑使用顺手的多窗口或者支持分屏 (panel) 的终端，推荐使用 Tmux，配合快捷键无比顺畅。

Tmux 的内容可以参考[这个](/post/2017/07/tmux-introduction.html)

## 善用 Linux 命令
除却常用的查找文件、浏览文件命令等等之外，善用命令行中的 Tab 自动补全，通配符等等。

cat, grep

通过文件名查找

    sudo find -name <filename> path_to_search

滚动查看大文件

    less path_to_file

当前路径下打开文件管理器

    nemo .

树形结构展开当前目录结构，包括子目录和文件

    tree

流式读取一个文件，实时日志文件

    tail -f filename

### 管道机制
Unix 哲学中，每个程序都足够小，只做一件事情，并将其做到最好。Bash 提供的管道机制 (|) 可以将命令的输出作为另一个命令的输入，结合两个或者多个命令，比如最简单的例子，ls 是将目录下文件列出， grep 命令是搜索包含指定正则的行，结合两者

    ls ~ | grep word

就可以过滤 HOME 目录下，包含 word 的文件

### 通配符
`*` 星号字符匹配任意长度，比如删除文件夹下，指定文件

    rm morning*.jpg

这样就删除了当前目录下所有 morning 开头的 jpg 文件，使用 rm 命令时一定要注意确认

### 输出重定向
`>` 字符可以将一个命令的输出重定向到一个文件或者另一个命令的输入，一般情况下命令会有一些输出结果

    tree . > file.txt

可以将当前文件目录结构输出到文件 file.txt 中。

`>` 会覆盖输出的文件 `>>` 用来追加到文件末尾。

### 后台执行
Bash 默认情况下会立即执行当前键入的每一条命令，通常我们就是这样要求终端的，但是如果想要某一些应用在后台长时间执行，可以使用 `&` 操作符，当然更加推荐 `screen` 或者 `tmux` 这类的工具。

    ./long_time_task.sh &

可以在后台执行一个长时间任务。

## 显示监控和终止进程
使用 htop 来查看系统资源，以及对进程进行管理，当然如果熟悉 ps 也可以使用 ps 来查看

## 使用高效的编辑器
大型 Java 项目可以考虑使用 JetBrains 系列产品，对于 Python, Bash 等脚本语言可以考虑使用 vim

## Other

- RedShift：在电脑屏幕上放上这个会让你睡得更好。
- Self Control：这个可以帮助你控制你自己的习惯，避免在 FB，Twitter 上流连忘返。

## reference

- <http://www.trysudo.com/7-tips-for-a-productive-development-setup-on-linux/>
