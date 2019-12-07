---
layout: post
title: "每天学习一个命令：ip 处理网络管理任务"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [network, linux, command, ip, ifconfig,]
last_updated: 
---

linux中的ip命令和ifconfig类似，但前者功能更强大，并旨在取代后者。ifconfig是`net-tools`中已被废弃使用的一个命令。iproute2 套件里提供了许多增强功能的命令，ip命令即是其中之一。只需一个ip命令，就能很轻松地执行一些网络管理任务。

## 常见用法
给机器设置一个IP地址

    sudo ip addr add 192.168.0.193/24 dev wlan0

列出路由表条目

    ip route show

显示网络统计数据

    ip -s link

