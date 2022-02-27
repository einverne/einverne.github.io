---
layout: post
title: "自行搭建 ZeroTier Network Controller 组件虚拟局域网"
aliases: 
- "自行搭建 ZeroTier Network Controller 组件虚拟局域网"
tagline: ""
description: "一键快速搭建 ZeroTier 行星节点加速网络访问"
category: 学习笔记
tags: [ zerotier, linux, networking, ]
last_updated:
---

之前的一篇文章简单的通过内网穿透，异地组网的概念介绍过 [ZeroTier](/post/2018/06/zerotier.html)，过去几年里面几台设备也一直陆陆续续地在使用着，虽然中间也短暂切换成 frp，也尝试过 [[Tailscale]]，但 ZeroTier 一直是候选方案中排名在前的。

ZeroTier 官方默认免费的方案可以支持最多 50 台设备的连接，我陆陆续续也用不超过 20 台。所以使用官方提供的基本服务是丝毫没有任何问题的。但就是本着折腾的态度，也是学习一下 ZeroTier network controller 相关的内容，记录一下如何自建 ZeroTier network controller。

## 概念介绍

### ZeroTier
ZeroTier 是一个虚拟组网工具，他可以让设备和设备之间通过互联网的帮助，就像是在局域网（LAN）之间通信一样。通过 安装 ZeroTier One 客户端，并加入一个 16 位数字的 ZeroTier 网络就能实现。

### ZeroTier network controller
ZeroTier 网络是通过 ZeroTier network controller 来完成配置的。用户既可以使用 [ZeroTier 官方](https://my.zerotier.com/) 提供的 network controller，也可以使用自己搭建的独立网络控制器（standalone network controller）。


如何设置自己独立的网络控制器就是这篇文章的重点。

### ztncui
[ztncui](https://key-networks.com/ztncui/) 是一个开源的 ZeroTier 网络控制中心的用户界面。

代码地址：<https://github.com/key-networks/ztncui>

### ZeroTier 网络实现原理
ZeroTier 的网络 Controller 是一个控制节点，该节点会通过 roots （根节点）来发现彼此。可以和 DNS 根服务器类比。

ZeroTier 的 Network ID 由两部分组成：节点 ID + 其他字符。

每一个 ZeroTier 节点（Nodes）会通过 Network ID 的前10位来发现 network controller，然后通过 networking controller 来发现局域网中的其他节点。

然后每一个节点可以通过 `zerotier-cli peers` 来查看匹配网络中的节点。

如果 network controller 离线了，那些已经建立连接的节点会保持连线，但是无法再往网络中添加新的节点。

## 如何搭建独立的ZeroTier网络控制器
上文提及的 ztncui 就是一个开源的 ZeroTier 网络控制器界面，通过他可以快速搭建自己的 ZeroTier 网络控制器，这里我们使用 Docker 镜像快速搭建。如果需要手工搭建，可以直接参考[官网](https://key-networks.com/ztncui/)。

本文使用的镜像是：

- <https://github.com/key-networks/ztncui-containerized>

这里直接贴出 `docker-compose.yml` 文件：

```
version: '3.3'

services:
  ztncui:
    container_name: ztncui
    image: keynetworks/ztncui
    restart: always
    volumes:
      - ~/ztncui/ztncui:/opt/key-networks/ztncui/etc
      - ~/ztncui/zt1:/var/lib/zerotier-one
    environment:
      - NODE_ENV=${NODE_ENV}
      - HTTP_PORT=${HTTP_PORT}
      - HTTP_ALL_INTERFACES=yes
      - ZTNCUI_PASSWD=${ZTNCUI_PASSWORD}
      - MYADDR=${MYADDR}
    ports:
      - '3443:3443'
      - '3180:3180'
```

说明：

- `HTTP_PORT`：后台端口
- `ZTNCUI_PASSWD`：后台默认密码
- `MYADDR`: VPS 的网络地址，公网IP地址

然后在同级目录新建文件 `.env`:

```
# more https://github.com/key-networks/ztncui-aio
NODE_ENV=production
HTTP_PORT=3443
ZTNCUI_PASSWD=
MYADDR=your.ip
```

后续更新会在 [dockerfile](https://github.com/einverne/dockerfile)。

然后使用 `docker-compose up -d` 启动。

启动之后可以访问 `IP:3443` 可以访问管理后台。

## 独立网络控制器的优劣

### 优点
自建 ZeroTier network controller 可以提升节点建立连接的稳定性，同时也解除了官网的设备连接数限制。

但 network controller 自身并不能提升节点和节点之间的连接速度。


### 缺点
一旦使用了自建的 ZeroTier 网络，便需要一定精力去维护 network controller 的稳定性。

并且如果 network controller 挂掉可能无法再新增加节点。不过新增节点的操作也不是高频操作，对我个人使用而言问题不大。

## 外延

除了 ztncui 这一个用户界面，还有一些在逐渐发展的，可以根据自己需要挑选：

- [thedunston/bash_cli_zt](https://github.com/thedunston/bash_cli_zt) - Command Line interface for self-hosted ZeroTier.
-  [dec0dOS/zero-ui](https://github.com/dec0dOS/zero-ui) - GUI for self-hosted ZeroTier.
-  [mdplusplus/zerotier-network-controller-ui](https://hub.docker.com/r/mdplusplus/zerotier-network-controller-ui) - Docker image for self-hosted ZeroTier.


## reference

- [[2018-06-14-zerotier|使用 Zerotier 组建虚拟局域网实现内网穿透]]
- <https://docs.zerotier.com/self-hosting/network-controllers/>
- <https://blog.ogarcia.me/zerotier/>
- [ZeroTier Self-hosting ZeroTier Network Controllers 官网文档](https://docs.zerotier.com/self-hosting/network-controllers/)
- <https://github.com/zerotier/awesome-zerotier#self-hosting>
- <https://github.com/key-networks/ztncui-containerized>