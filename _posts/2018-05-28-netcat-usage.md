---
layout: post
title: "每天学习一个命令：netcat 查看网络信息"
tagline: ""
description: ""
category: 学习笔记
tags: [netcat, nc, linux, tcp, udp]
last_updated: 
---

nc 全称 netcat，是一个强大的网络工具，可以在网络中对 TCP UDP 读写。

### 监听本地端口

    nc -l -p 80   # 开启本机80端口TCP监听
    nc -l -p 80 > /tmp/log

机器上运行该命令，端口80会被认为开饭，可以用来欺骗扫描机

### 扫描端口

扫描端口

    nc -zv host.example.com 22 80 443    # 扫描端口
    nc -zv host.example.com 20-30        # 扫描一个范围
    nc -zv -w 5 host.example.com 22-443  # -w 表示超时等待5秒


### 作为简单的Web Server

    nc -l 8080 < index.html

客户端请求

    curl localhost:8080

    

## reference

- <https://www.poftut.com/netcat-nc-command-tutorial-examples/>
