---
layout: post
title: "每天学习一个命令：nslookup 查询调试 DNS"
aliases: "每天学习一个命令：nslookup 查询调试 DNS"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, nslookup, dns, network, ]
last_updated:
---

最近[配置路由器 pdnsd](/post/2016/12/pdnsd.html)，经常需要调试 DNS 信息，就离不开调试工具了。 nslookup 用来查询 DNS 记录，查看域名解析是否正常，经常被用来在网络故障时诊断网络问题。


## 命令
在 Ubuntu 下可以使用如下命令安装：

    sudo apt install dnsutils

格式：

       nslookup [-option] [name | -] [server]

## 使用

`nslookup` 是一个查询 Internet domain name server 的工具，nslookup 有两种模式： 

- interactive 交互模式
- non-interactive 非交互模式

### 交互模式
进入交互模式，总共有两种方法。

第一种方法，直接输入 `nslookup` 命令，不加任何参数，则直接进入交互模式，此时 nslookup 会连接到默认的域名服务器（即 `/etc/resolv.conf` 的第一个 dns 地址）。

第二种方法，是支持选定不同域名服务器的。需要设置第一个参数为“-”，然后第二个参数是设置要连接的域名服务器主机名或 IP 地址。

如果你直接在 nslookup 命令后加上所要查询的 IP 或主机名，那么就进入了非交互模式。当然，这个时候你也可以在第二个参数位置设置所要连接的域名服务器。

## 例子

### 交互模式下查询域名

    nslookup
    > www.douban.com
    Server:	127.0.1.1   // 连接的 DNS 服务器
    Address:	127.0.1.1#53    // DNS 服务器 IP 地址与端口

    Non-authoritative answer:    // 非权威答案，从连接的 DNS 服务器本地缓存中读取，非实际查询得到
    Name:	www.douban.com
    Address: 115.182.201.6    // IP 地址
    Name:	www.douban.com
    Address: 115.182.201.7
    Name:	www.douban.com
    Address: 115.182.201.8

### 交互模式下更改 DNS

进入交互模式之后，使用  `server dns-server` 来改变上连 DNS 服务器地址

### 查询域名 IP 地址

    nslookup www.douban.com [dns-server]

如果没有指定 `dns-server`，使用系统默认的 DNS 服务器。

