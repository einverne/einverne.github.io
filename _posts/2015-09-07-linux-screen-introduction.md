---
layout: post
title: "每天学习一个命令：Linux screen 使用介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [screen, tmux, linux, commands, ]
last_updated:
---

Screen 是用另一个比较轻便的终端复用工具，tmux 可以参考另外一篇文章。Screen 让用户可以在一个终端中开启单独不同的 “screen” 终端窗口来使用。我们都知道使用 ssh 连上服务器之后如果因为网络问题终端了当前连接，那么正在执行的任务也会因此中断，所以我们可以将长时间的任务放到 Screen 中执行，即使因为网络问题断开了 SSH 连接，再次使用 SSH 连上之后也可以轻松的恢复之前的任务。

Screen 让用户之前也可以分享 Session，只要 Screen 状态存在，其他用户也可以 detach/attach 到相关的 terminal Session 中来实现分享。

至于为什么有了这篇文章呢，是因为之前登录要一些机器上，发现并没安装软件的权限，所以安装不了 tmux，而发现系统中自带了 screen ，所以就学习一下。如果使用过 tmux 那么 screen 也是非常简单的。

## 安装

    sudo apt install screen

## 使用

使用 Screen 非常简单

    screen

这是会进入 Screen 创建好的环境。使用 Ctrl-a 在加上 ？ 可以查看所有的快捷方式。

下面介绍比较重要的几个快捷键

### 新建 screen
通常情况下只需要 screen 新建匿名的 screen 即可，如果需要给 screen 命名可以使用

    screen -S name


### detach / attach Screen

    Ctrl-a  d          detach screen 用来从 Screen 中脱离

需要重新连接则使用 `screen -r`

如果有多个 Screen，则需要使用 `screen -ls` 来查看 Session 的 ID。然后 `screen -r id` 来 attach。

### 修改 screen session name
如果在 screen session 内部，使用：

    Ctrl + a 然后按下 :sessionname new_name

注意这里的 Ctrl + a 是 screen 的 prefix, 还有命令之前的冒号一定要加。

如果在 screen 外

    screen -S old_name -X sessionname new_session_name

上面两个方法可以修改真正的 session name 但是在并不会修改窗口的名字，如果要修改界面窗口的名字则需要

    Ctrl + a 然后使用 Shift + a 再输入名字，则能够修改窗口显示的名字

### 切换多个 Screens

    Ctrl-a n        下一个 screen
    Ctrl-a p        上一个
    Ctrl-a 0-9
    Ctrl-a space    按 0 - 9 顺序切换
    Ctrl-a w        显示所有窗口列表
    Ctrl-a c        创建新的
    Ctrl-a k        杀掉 screen

### Copy 模式

类似 Tmux ，使用 `Ctrl-a [` 进入 copy 模式，在 copy mode 下可以复制，搜索等等，类似 vim

    Ctrl-b      PageUp
    Ctrl-f      PageDown
    0           行首
    $           行尾
    Space       标记起点，第二次标记结束
    Esc         结束 Copy 模式

`Ctrl-a ]` 粘贴，可以将 Copy 模式中选定的内容粘贴上。

## 高阶
screen 可以在 `/etc/screenrc` 和 `$HOME/.screenrc` 两个文件中添加更多的配置。比如绑定快捷键，设定启动窗口，用户控制等等。

## reference

- <https://www.tecmint.com/screen-command-examples-to-manage-linux-terminals/>
- <https://unix.stackexchange.com/q/27780/115007>
