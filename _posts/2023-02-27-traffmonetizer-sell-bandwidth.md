---
layout: post
title: "使用 Traffmonetizer 来售卖闲置流量"
aliases:
- "使用 Traffmonetizer 来售卖闲置流量"
tagline: ""
description: ""
category: 产品体验
tags: [ traffmonetizer, bandwidth, usdt, vps ]
create_time: 2023-06-08 22:35:17
last_updated: 2023-06-08 22:35:17
---

[Traffmonetizer](https://gtk.pw/traff) 是一个售卖流量的平台，闲置的流量可以售卖给该网站赚取利润。同样该网站售卖的流量也可以兑换成 USDT。

在 Traffmonetizer 之前我还用过一段时间 [[nanowire]] ，用一台废弃的 [[OpenVZ]] 的机器挂了不知道多久，然后还兑换了几个 XNO 代币。

当时的宣传语还是

> Earn Nano currency in seconds by selling your unused bandwidth, or rent thousands of private proxies and pay using Nano

但是如今在去看 nanowire.com 连官网都打不开了。

同类型的产品还有 [peer2profit](https://t.me/peer2profit_app_bot?start=163297288361553053e883f)，链接到其官方的 Telegram Bot，也提供售卖流量的服务，但似乎做得也不是很好。

于是现在又出现了一家 Traffmonetizer，似乎对于闲置流量的售卖服务大家都没有一个正向的模式，一段时间之后就会陷入消沉。不过如果自己手上也不用的机器，或者本来 IP 信誉就不是很好的话，拿来挂挂机器也还是不错的。

## 安装

Traffmonetizer 支持 [Docker](https://hub.docker.com/r/traffmonetizer/cli) 安装，那么只需要运行下面的命令即可一键安装。

需要注意的是 Traffmonetizer 提供的 Docker 也是可以运行在 ARM CPU 环境下的，注意拉取的镜像版本。

amd64

```
docker run -d --restart always --name tm traffmonetizer/cli start accept --token token --device-name 自定义设备名称
```

arm64

```
docker run -d --restart always --name tm traffmonetizer/cli:arm64v8 start accept --token token --device-name 自定义设备名称
```

arm32

```
docker run -d --restart always --name tm traffmonetizer/cli:arm32v7 start accept --token token --device-name 自定义设备名称
```

## 支付方式 Payout

售卖出的钱可以通过如下的方式接受：

- USDT（TRC20）
- BTC
- [[Payoneer]]
- [[WebMoney]]
- [[Skrill]]
- Payeer

## related

- [[nanowire]]
- [[peer2profit]]
- [[honeygain]]
