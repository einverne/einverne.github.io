---
layout: post
title: "IP 信息查询网站合集"
aliases:
- "IP 信息查询网站合集"
tagline: ""
description: ""
category: 整理合集
tags: [ ip, ipinfo, ip-query, IP 信息, IP 地址信息, 住宅 IP]
create_time: 2024-11-08 10:05:25
last_updated: 2024-11-08 10:05:25
dg-home: false
dg-publish: false
---

如果是经常需要使用代理服务器，那么对 IP 这个次肯定不陌生，作为一个每天在互联网上冲浪的人来说，如果只知道 IP 地址肯定是不行的，那这篇文章就着 IP 这个主题，来总结整理一下，如何查询 IP 地址相关的信息，以及什么是住宅 IP，什么是数据中心 IP，以及我们通过 IP 地址可以获取哪些信息。

## 什么是 IP

IP 地址的全称是 Internet Protocol Address，互联网协议地址的缩写，这是用来标记一个设备在网络中的地址，IP 本质上是一个标识网络设备的数字标签，IP 地址包含了设备ㅈㄷㄷ网络中的位置，用于数据包的路由和传递。

在人类刚刚发明 IP 协议的时候，制定了一个 IPv4 协议，使用 32 个 bit 位表示，通常以 8 位一组，以点分十进制表示，比如 192.168.10.2

但是随着互联网的发展，接入网络的设备越来越多，就逐渐发现 IP 地址不够用了，所以又制定了 IPv6 协议，用 128 bit 记录，以冒号分割 8 组十六进制数表示，比如 2001:db8:0:1234:0:567:8:1

## IP 分类

### 私有 IP 和公网 IP

私有 IP 通常也称为局域网 IP，指的是 IP 协议中被保留用来作为局域使用的地址。而公网 IP 指的是网络设备在互联网上联网需要的 IP 地址。

### 静态 IP 和动态 IP

本质上来说这不算是 IP 的分类，只是在使用的时候的不同表现形式，静态 IP 指的是固定不变的 IP，动态 IP 指的是每次联网的时候随机分配的 IP，在局域网中通常会有 DHCP 服务器进行分配，而在公网中可能由 ISP 分配动态的公网 IP。

### 住宅 IP 和数据中心 IP

严格意义上来说这也不能算是 IP 的分类，只是在使用的时候作为区分，住宅 IP 通常指的是 ISP 分配给家庭客户的 IP 地址，而数据中心 IP 通常是分配给数据中心，网络机房使用的 IP 地址。

国内的一些跨境电商，或者申请国外的银行卡等风控部门比较严格的业务时，通常会采用一些住宅 IP 来规避风控。当然现在也有很多的住宅 IP 提供商，IP 质量参差不齐。

### 原生 IP 和广播 IP

原生 IP（Native IP） 指的是注册地址和机房所在国家地区一致的 IP，通常通常由当地的 ISP 或 IDC 运营商直接分配，归属于本地。

广播 IP（Broadcast IP），IP 注册地址和实际使用地不一样，通过广播将其他地区的 IP 分配到目标地区。一些大型的公司 Google，Amazon，Netflix 等通常会购买大量的 IP 段，根据自己的业务需要来分配。

一些视频串流网站通常会要求用户使用原生 IP。

## 什么是住宅 IP

住宅 IP 通常是指互联网服务提供商 （ISP）分配给家庭用户的 IP，和数据中心 IP 不一样的是，住宅 IP 通常

- 具有更好的隐匿性，使用住宅 IP 的请求更像是普通用户的正常访问，所以当用来一些服务申请的时候更不容易被封控
- 更高的信任度，目标网站更信任这些 IP，通常不会出现验证码等
- 更好的地理位置分布，通常会分布在不同的住宅网络中，分散在全球各地

## 如何查询自己的 IP 地址

在 Linux 下

```
ip addr show
ifconfig
hostname -I
```

在 macOS 下

```
# WiFi 接口
ipconfig getifaddr en0
# 有线网
ipconfig getifaddr en1
```

在 Windows 下

```
ipconfig
```

## 终端查询 IP

直接通过 curl 来查询。

```
curl ip.gs
curl ip.sb
curl ipinfo.io/ip
curl ifconfig.me
```

## IP 地址查询

### Whoer

[Whoer](https://whoer.net/) 是一个可以查看当前 IP 地址的网站，展示了 IP 提供商，主机名，DNS，地理位置，代理服务器检查，匿名服务，黑名单检查等等检测。

![Ken3](https://photo.einverne.info/images/2024/11/08/Ken3.png)

### IPinfo

[IPinfo](https://ipinfo.io) 可以查看 IP 地址的 ASN，hostname，地理位置，国家，经纬度，邮编，时区，对应的公司（包括公司名，网络，是否是 ISP），以及隐私信息，还提供了 abuse 的信息。

![KQ6L](https://photo.einverne.info/images/2024/11/08/KQ6L.png)

### Ping0

[Ping0](https://ping0.cc/) 也是一个可以查询 IP 信息的网站，可以查询地理位置，ASN，企业，经纬度，风控值，原生 IP 等信息。
