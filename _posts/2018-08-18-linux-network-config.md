---
layout: post
title: "Linux 网络配置"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, network, command, ifconfig, ]
last_updated:
---

昨天升级 Ubuntu ，不知为何将网卡配置覆盖了，导致一时间无法上网，然后看了一些网络配置的文章，感觉自己需要补习一下相关知识，所以有了这篇文章。

下面就按照命令分别展开吧

## ifconfig
这个命令是查看本地网络端口最常见的命令了，略

## 设置网卡及 IP
`/etc/network/interfaces` 文件中保存着本地网络网卡的相关配置

配置 DHCP 自动获取 IP

    auto eth0
    iface eth0 inet dhcp

假如要配置静态 IP

    auto eth0               # 要设置的网卡
    iface eth0 inet static  # 设置静态 IP；如果是使用自动 IP 用 dhcp，后面的不用设置，一般少用
    address xxx.xxx.xxx.xxx  # IP 地址
    netmask xxx.xxx.xxx.xxx  # 子网掩码
    gateway xxx.xxx.xxx.xxx  # 网关

修改保存，之后使用 `sudo /etc/init.d/networking restart` 来使其生效。

## 设置 DNS

DNS 相关的配置在 `/etc/resolv.conf` 文件中。如果希望永久生效可以修改 `/etc/resolvconf/resolv.conf.d/base` 文件中

    nameserver 8.8.8.8   # 希望修改成的 DNS
    nameserver 8.8.4.4

然后使用 `sudo /etc/init.d/resolvconf restart` 来使得 DNS 生效。


