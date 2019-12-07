---
layout: post
title: "Ubuntu 系网络配置文件解析及说明"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, ubuntu, mint, cinnamon, network, eth0]
last_updated:
---

今天遇到一个奇怪的网络问题，记录一下研究过程和一些配置情况，顺便学习一下 Linux 下网络环境配置。

## 网络配置文件

该文件配置网卡信息 `vi /etc/network/interfaces`

    auto lo
    iface lo inet loopback
    # 配置 eth0 dhcp 获取 IP 地址
    auto eth0
    iface eth0 inet dhcp


### 配置的作用
在 `/etc/network/interfaces` 这个配置中可能原本就有一些配置，比如

    auto lo
    iface lo inet loopback

这两行表示的是 `auto lo` 系统启动时自动配置 `lo` 接口，然后对于 `lo` 接口配置一个本地回环（loopback) 地址。

如果要给网卡配置静态地址

    auto eth0
    iface eth0 inet static
        address 192.168.2.100
        network 192.168.2.0
        netmask 255.255.255.0
        broadcast 192.168.0.255
        gateway 192.168.0.1

下面几行分别表示 eth0 接口的 IP，网络号，掩码，广播地址和网关。

如果要配置自动获取 IP 地址 DHCP

    auto eth0
    iface eth0 inet dhcp

更多的配置内容可以查看 `man interfaces`

到 `/etc/network` 目录下一看会发现很多有趣的目录

- `if-down.d` 网络关闭前
- `if-post-down.d` 网络关闭后
- `if-pre-up.d` 网络建立前
- `if-up.d` 网络建立后

这些目录都是属于 Debian 实现的网络配置，当发生 if-up 时就会执行放在 `if-up.d` 目录下的脚本，这样就可以用来实现一些很有意思的事情，比如如果写了一个签到脚本，那么可以在笔记本联网时自动完成签到这样，或者联网之后启动 VPN 这样的事情。

添加执行权限

    chmod 755 /etc/network/if-up.d/YOUR_SCRIPT

注意的是脚本执行顺序是 lexicographic 字母序。

另外一种方式就是在 `/etc/NetworkManager/dispatcher.d/` 这里定义脚本，也可以做到一样的事情，不过这就需要依赖 NetworkManager 了。

## 配置 DNS

DNS 配置文件在 `/etc/resolv.conf` 文件中，一般为

    search domain
    nameserver 127.0.0.53


## 重启网卡

    sudo ifup eth0
    sudo ifdown eth0
    # or
    sudo ifconfig eth0 down
    sudo ifconfig eth0 up


## 重启网络

    sudo /etc/init.d/networking restart
    sudo /etc/init.d/network-manager restart
