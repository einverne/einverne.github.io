---
layout: post
title: "认识 Linux 下 btmp 日志文件"
aliases: 
- "认识 Linux 下 btmp 日志文件"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, log, btmp, fail2ban, security, vps, ]
last_updated: 2022-02-18 12:26:07
create_time: 2022-02-18 11:29:08
---

查看 VPS 日志的时候发现 `/var/log/` 下存在一个 100M+ 大小的 btmp 文件，我知道 `/var/log` 目录下一般都是 Linux 系统的日志存放路径，通常 auth.log 会记录登录相关的日志，其他的 Nginx，PHP，dpkg，syslog 等等都比较熟悉，唯一没见过的就是 btmp 文件。所以简单记录一下。

btmp 文件也是日志文件，不过仅仅记录失败的登录。这也就意味着有人尝试暴力登录我的服务器。

和 btmp 相关的日志文件还有两个：

- utmp 文件记录用户登录信息，包括用户登录的终端，登出状态，系统时间，当前系统的状态，系统启动的时间（被 uptime 命令使用）等等
- wtmp 会记录 utmp 文件的历史记录，包括了当前登录用户信息和历史用户登录信息

以上三个文件都是二进制数据。

## 查看 btmp 文件
btmp 文件不是一个纯文本的文件，所以不能直接使用 less, cat 查看，需要借助 `last` 命令：

    last -f /var/log/btmp
    last -f /var/log/wtmp
    last -f /var/log/utmp

如果直接执行 `last` 不带任何参数，则会展现用户什么时候登录，什么时候登出的。

也可以使用 `lastb` 命令，默认会读取 `/var/log/btmp` 文件。

另外也可以使用 `utmpdump` 命令将二进制文件转成文本文件查看。

    utmpdump /var/log/btmp

## 遇到 btmp 文件过大的情况下的安全措施
上文提到过 btmp 只会记录失败的登录，如果这个文件增长很快那么也就意味着有人在不断尝试登录，可能就是在暴力尝试，在上面的日志文件中也能看到很多 root 尝试登录，也有很多默认的用户在不停尝试。这个时候就需要特别注意一下系统的安全。

通常情况下，在刚初始化系统的时候[这些安全措施](/post/2018/03/vps-security.html)就需要补全。

通常在配置了 [[fail2ban]] 之后就会好很多了。

## reference

- <https://www.thegeekdiary.com/what-is-the-purpose-of-utmp-wtmp-and-btmp-files-in-linux/>