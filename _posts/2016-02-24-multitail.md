---
layout: post
title: "每天学习一个命令：multitail 同时监控多个日志"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [multitail, tail, linux, command, log]
last_updated: 
---

MultiTail是一个开源的ncurses的实用工具，可用于在一个窗口或单一外壳，显示实时一样的尾巴命令，该命令拆分控制台为更多子窗口的日志文件的最后几行（很像显示多个日志文件到标准输出屏幕命令 ）。 它还支持颜色突出显示，过滤，添加和删除窗口等。

他和tail的区别就是他会在控制台中打开多个窗口，这样可以同时监控多个日志。

## 安装

    apt install multitail

如果要在 CentOS，基于 Red Hat 的发行版中使用，需要[开启 EPEL repository](https://www.tecmint.com/how-to-enable-epel-repository-for-rhel-centos-6-5/)，然后安装

    yum install -y multitail

## 使用

监控两个日志文件，窗口上下

    multitail /var/log/syslog /var/log/auth.log

如果要让窗口左右排布

    multitail -s 2 /var/log/syslog /var/log/auth.log
    
同理，`-s num` 来表示后接多少个文件

进入 multitail 之后，有一些交互式命令

- `h` 来打开帮助
- 使用 `b` 来选择打开的文件，使用上下键选择文件，一旦选择文件 multitail 会显示文件最后 100 行，使用 jk 移动光标，或者 gg/G 来快速移动到文件顶部或者最后，q 退出
- `a` 用来添加另外的监控日志文件


## reference

- <https://www.tecmint.com/view-multiple-files-in-linux/>
