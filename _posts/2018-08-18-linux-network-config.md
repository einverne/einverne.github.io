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

### resolv.conf 配置

`/etc/resolv.conf` 配置文件是客户端 DNS 配置，一般在该文件中配置了 DNS 服务器的 IP 地址和域名。
配置的参数格式非常简单，由关键字开头，后面接着是空格分隔的几个参数。`resolv.conf` 配置中主要的关键字有四个：

- domain
- nameserver
- search

一个基本的配置：

```
domain some-example.com
nameserver 8.8.8.8
nameserver 8.8.4.4
search exmaple.com example1.com
```

解释：

- domain: 指的是本地网络的名称，如果查询域名时没有包含点号，那么会自动加上网域的名称为结尾，再发送给 DNS 服务器
- nameserver: 指定客户端进行域名解析的时候要用到的**域名服务器 IP 地址**，因此可以指定多个地址，客户端会按照次序进行查询请求
- search: 非必填，举个例子来说明这个选项，当 search 设定为 `example.com` 时，在 DNS 解析的时候，无法对输入解析的时候，比如查询 blog，DNS 客户端会使用 search 指定的值加上需要查询的名称，即 `blog.example.com` 来进行解析，解析失败的时候会依次往后 blog.example1.com 查询

当设定了 domain 时，配置的地址会自动成为 `search` 的第一个搜索域名。

当去 `ping` 一个域名时，如果访问的域名无法被 DNS 解析，resolver 会将该域名加上 search 参数后面配置的内容，重新请求 DNS，知道被正确解析或尝试完 search 指定的所有列表为止。

## reference

- <https://man7.org/linux/man-pages/man5/resolv.conf.5.html>

