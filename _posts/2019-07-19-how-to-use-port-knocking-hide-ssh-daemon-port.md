---
layout: post
title: "使用 port knocking 隐藏 SSH daemon 端口"
tagline: ""
description: ""
category: 学习笔记
tags: [knocking, ssh, vps, security, ]
last_updated:
---

暴露在互联网上的服务器非常容易被恶意程序进行端口扫描，以前也整理过一篇 [VPS 安全设置](/post/2018/03/vps-security.html) 的文章，但都是一些比较基础的设置，能够绕过一些简单的端口扫描，但是并不能从根本上解决端口扫描的问题。

Port knocking 通过防火墙的帮助能够实现，只有你按照特定方式请求后才开放端口，增加了一层保护。主要防止恶意攻击者通过端口扫描来对机器进行攻击。

这篇文章就通过 `knockd` 的使用来介绍一下 Port knocking 。

Note: 本文只演示 IPV4 下的配置。

## Port knocking
Port knocking 类似于

## 准备工作

在配置 knockd 之前，首先需要了解 [iptables](/post/2017/01/iptables.html) 的基本使用。

允许本地回环地址，允许内部的网络访问

    sudo iptables -A INPUT -i lo -j ACCEPT

允许当前活跃的连接继续保持

    sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED, RELATED -j ACCEPT

允许本地 80 端口

    sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

除此之外组织所有的访问 (**需要特别注意，输入这行命令前一定要非常清楚你即将做的事情**)

    sudo iptables -A INPUT -j DROP

查看

    sudo iptables -S

持久化 iptables 设定

    sudo apt-get install iptables-persistent
    sudo service iptables-persistent start

## 安装 Knockd

    sudo apt install knockd

## 配置 {#config}

管理员打开

    sudo vim /etc/knockd.conf

编辑如下内容

    [options]
            UseSyslog

    [openSSH]
            sequence    = 7000,8000,9000
            seq_timeout = 5
            command     = /sbin/iptables -A INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
            tcpflags    = syn

    [closeSSH]
            sequence    = 9000,8000,7000
            seq_timeout = 5
            command     = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
            tcpflags    = syn

解释

在最上方 options 中可以看到 UseSyslog，表示的是 knockd 会将日志记录到系统的日志中，路径是 `/var/log/messages`

如果想要指定一个可以使用

    LogFile = /path/to/log/file

在下方是两块配置，名字可以是任意，例子中的两块配置分别是打开 SSH 默认端口，和关闭 SSH 端口。

敲门的顺序由 `sequence` 来指定。当然正常配置时请换用尽量随机的端口。

`seq_timeout` 和 `tcpflags` 分别用来做校验，请求包需要满足这两个条件，而 `command` 则是指定了满足条件后的动作。

在该例子中就是打开 SSH 默认的 22 端口。但是如果仔细看就会发现 iptables 中使用的是 `-A` 参数，会将这一条规则放到最后，那如果在 DROP 后面就不会有作用了，所以需要改成

    command = /sbin/iptables -I INPUT 1 -s %IP% -p tcp --dport 22 -j ACCEPT

使用 `-I` 来插入到规则列表开头。

## 启用 Knockd

修改配置

    sudo vi /etc/default/knockd

修改内容

    START_KNOCKD = 1

启动服务

    sudo service knockd start

此时去测试

    ssh root@server_ip_address

就会发现 22 端口被拒绝了。

然后在本地计算机上

    for x in 7000 8000 9000; do nmap -Pn --host_timeout 201 --max-retries 0 -p $x server_ip_address; done

然后在 ssh 连过去。

完事之后

    for x in 9000 8000 7000; do nmap -Pn --host_timeout 201 --max-retries 0 -p $x server_ip_address; done


当然你可以在客户端直接使用 knockd

    knock server_ip_address 7000 8000 9000

结束时


    knock server_ip_address 9000 8000 7000

## 配置自动断开

    [options]
        UseSyslog

    [SSH]
        sequence = 5438,3428,3280,4479
        tcpflags = syn
        seq_timeout = 15
        start_command = /sbin/iptables -I INPUT 1 -s %IP% -p tcp --dport 22 -j ACCEPT
        cmd_timeout = 10
        stop_command = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT


## reference

- <https://gtk.pw/T0Kym>
