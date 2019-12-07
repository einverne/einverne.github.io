---
layout: post
title: "每天学习一个命令：netcat 查看网络信息"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [netcat, nc, linux, tcp, udp, command, netcat, port-scan, security, ]
last_updated:
---


nc 是 netcat 的简称，nc 工具是一个 TCP/IP 的瑞士军刀类型的工具，netcat 可以使用 TCP 或者 UDP 协议来进行网络连接的读写诊断，nc 命令可以用于 TCP，UDP，Unix 套接字相关的任何事情，是一个非常强大的网络工具。

端口是 Linux 机器上的应用、服务、进程与网络进行通信的端点。常用的 netstat 或者 nmap 等也能够列出本地机器上的开放端口。但是 nc 可以用来确定远程主机端口是否开放。

## 安装

    sudo apt install netcat


## 使用实例


### 监听本地端口

    nc -l -p 80   # 开启本机 80 端口 TCP 监听
    nc -l -p 80 > /tmp/log

机器上运行该命令，端口 80 会被认为开放，可以用来欺骗扫描机

### 扫描端口

扫描端口

    nc -zv host.example.com 22           # 扫描 22 端口是否开放
    nc -zv host.example.com 22 80 443    # 扫描端口
    nc -zv host.example.com 20-30        # 扫描一个范围
    nc -zv -w 5 host.example.com 22-443  # -w 表示超时等待 5 秒

说明：

- `-z` 设置 nc 只是扫描侦听守护进程，实际不发送任何数据
- `-v` 开启 verbose，如果多加 `-vv` 会输出更多信息

上面的例子中，已经统计到了扫描一个端口，多个端口，或者指定端口范围。

### 作为简单的 Web Server

    nc -l 8080 < index.html

客户端请求

    curl localhost:8080


## reference

- <https://www.tecmint.com/check-remote-port-in-linux/>
- <https://www.poftut.com/netcat-nc-command-tutorial-examples/>
