---
layout: post
title: "SSH 端口转发"
tagline: ""
description: ""
category: 学习笔记
tags: [ssh, port, forward, linux]
last_updated: 
---

SSH 全称 Secure Shell，是一种加密的网络传输协议，可以在不安全的网络中为网络服务提供安全的传输环境。

几个 ssh 命令的参数

- `C` 压缩数据传输
- `-f` 后台登录用户名密码，如果省去该参数 ssh 会一直等待
- `-g` 允许打开的端口让远程主机访问
- `-N` 不执行shell
- `-T` 表示不为该连接分配TTY
- `-p` 后接端口

## 本地端口转发
本地端口转发，就是将发送到本地端口的请求，转发到目标主机端口。

    ssh -L 本地网络地址：本地端口：目标主机地址：目标端口 root@<主机地址>
    ssh -L localhost:3000:localhost:80 root@<ip>  # 将发送到本地3000端口的请求，转发到远程主机80端口
    ssh -L 3000:localhost:80 root@<ip>  # 将发送到本地3000端口的请求，转发到远程主机80端口，省略掉本地地址
    ssh -p port -C -f -NT -g -L 3000:localhost:80 root@<ip>


## 远程端口转发
远程端口转发，就是将发送到远程端口的请求，转发到目标端口，一般用来将公网主机端口请求转发到局域网内机器端口以实现外网访问。

    ssh -R 远程地址：远程端口：目标地址：目标端口 root@<主机地址>
    ssh -R localhost:3000:localhost:80 root@<ip>  # 将远程主机 80 端口的请求转发到本地3000端口
    ssh -p port -C -f -NT -g -R 3000:localhost:80 root@<ip>

## 动态端口转发
动态端口转发，则是绑定一个本地端口，目标地址，目标端口不固定，目标地址和目标端口由发起的请求决定。只有root才能转发特权，支持 Socks 5 本地。

    ssh -D 本地地址：本地端口 root@<主机地址>
    ssh -D localhost:5000 root@<ip>
    ssh -D 5000 root@<ip>           # 省略 localhost，监听本地5000端口
    ssh -p port -C -f -NT -g -D 8080 root@<ip>        # Sock监听本地 8080 端口，任何发给 8080 端口的内容都会被转发到远程主机

## reference

- <https://help.ubuntu.com/community/SSH/OpenSSH/PortForwarding>
- <https://www.ibm.com/developerworks/cn/linux/l-cn-sshforward/index.html>

