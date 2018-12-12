---
layout: post
title: "Linux 下安装 openssh server"
tagline: ""
description: ""
category: Linux
tags: [linux, openssh, ssh, ]
last_updated:
---

一般服务器中会默认已经安装 SSH server，而个人版本的发行版，比如桌面版的 Ubuntu 或者我用的 Mint 可能默认没有安装，那么就需要自己安装配置。

> SSH is program and protocol for securely logging into remote machines across a network. It allows you to run programs, and do a variety of tasks as if you were sitting at the machine. SSH is very similar to telnet except for it is with encryption to protect the transferred information and authentication.

## 安装

可以通过下面命令查看安装包

    sudo apt search ssh

或者 

    sudo apt search openssh

通过下面命令安装

    sudo apt install openssh-server

配置

    sudo vim /etc/ssh/sshd_config

来修改 ssh 默认的配置，可以通过修改 `Port` 来指定 ssh 默认监听端口 22

然后使用如下命令重启 ssh 服务

    sudo /etc/init.d/ssh restart

在其他电脑上可以使用 `ssh name@address -p port` 来连接。

## openssh 和 ssh 包的区别

使用 `apt search` 的时候会发现，有 openssh 和 ssh 两个不同的 package

    i A openssh-client                  - secure shell (SSH) client, for secure acce
    p   openssh-server                  - secure shell (SSH) server, for secure acce
    p   ssh                             - secure shell client and server (metapackag
    v   ssh-client                      -                          
    v   ssh-server                      -      

openssh 的包中又分为 server 和 client ，对于只需要安装 server 的机器来说只需要安装 server，客户端也单独安装就可以。而如果直接安装 ssh 的话，client 和 server 都会安装。使用 `aptitude show ssh`  可以查看 package 的具体信息。

## reference

- <http://askubuntu.com/questions/814723/whats-the-difference-between-ssh-and-openssh-packages>
