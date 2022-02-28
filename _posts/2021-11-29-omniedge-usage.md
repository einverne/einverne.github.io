---
layout: post
title: "OmniEdge 虚拟组网工具使用及原理简介"
aliases: 
- "OmniEdge 虚拟组网工具使用及原理简介"
tagline: ""
description: ""
category: 学习笔记
tags: [ omniedge, tailscale, network, private-network, n2n, mesh-network ]
last_updated:
---

[[OmniEdge]] 是一个可以用来快速组建点对点私有网络的工具，也可以用来做内网穿透。

- <https://omniedge.io/>

官方提供 Starter 套餐，可以供一个用户，最多创建 1 个虚拟网络，连接 20台设备。

## 安装

一键安装脚本：

    curl https://omniedge.io/install/omniedge-install.sh | bash

### Linux

    curl https://omniedge.io/install/omniedge-install.sh | bash
    omniedge login -u yourname@youremail.com
    omniedge login -s yoursecuritykey
    omniedge join -n 'virtual-network-id'

### Run OmniEdge as a Service
在用 CLI 登录 OmniEdge 之后，推荐在后台运行。

创建 service:

    vi /etc/systemd/system/omniedge.service

填入信息：

```
#/etc/systemd/system/omniedge.service
[Unit]
Description=omniedge process
After=network-online.target syslog.target nfw.target
Wants=network-online.target

[Service]
Type=simple
ExecStartPre=
#Replace to your real virtual network id(can be found by run omniedge join) and auth.json path
ExecStart=/usr/local/bin/omniedge join -n "your_virtual_network_id" -f your_auth_file_path
Restart=on-abnormal
RestartSec=5

[Install]
WantedBy=multi-user.target
Alias=
```

上面的配置中有两个地方需要修改一下：

- 一个是网络ID，可以通过命令 `omniedge join` 获取，或者直接在管理后台获取
- 一个是 `auth.json` 在登录成功之后会在 `/root/.omniedge/auth.json` 目录中


激活服务：

```
systemctl daemon-reload
systemctl enable omniedge.service
systemctl enable omniedge.service
```


## 为什么不使用 WireGuard
[[WireGuard]] 作为一个现代的 VPN 解决方案，简单，快速，并且易于维护，OmniEdge 官方的[博客](https://omniedge.medium.com/how-omniedge-works-792499a8c2d) 也说过曾经尝试过使用 WireGuard，但是 WireGuard 存在的一个问题是，当构建一个具有庞大数量节点的网络的时候，管理和维护成本会成倍增加。

## 为什么不选择 n2n
[[n2n]] [^2] 是一个轻量、开源的用来组件点对点网络的工具，n2n 让 Super Node 处理节点的管理工作，这也就意味着这些节点可能需要处理大量流量，并且可能影响网络的性能。这使得 n2n 不适合构建一个完善的稳定的企业网络。

[^2]: <https://github.com/ntop/n2n>

## 架构
OmniEdge 为了解决上面的问题，指定了一些基本的原则：

- 足够简单，对于用户和网络管理都要足够简单
- 基于 Zero-trust security model，用户可以通过类似于 [Okta](https://www.okta.com/)， G Suite 等等的验证工具来组件安全的网络
- 使用 Peer-to-peer 网络通信，提升网络速度，避免单点故障

基于上面的设计目标，收到 n2n 架构的影响，设计了如下的 OmniEdge 架构。

![](/assets/omniedge-main-architecture-20220124150553.png)

Super Node: 用来协调虚拟网络节点和节点之间的通信

- 协调节点和节点之间的网络通信
- 舱室在节点和节点之间建立直接连接；如果不行，则作为节点和节点通信的 relay 节点

Node: 虚拟网络中的具体的节点

- 保存、管理虚拟网络的信息，比如 keys, network node public keys 等等
- 在虚拟网络上直接或间接转发 TCP 和 UDP 流量
- 提供本地的 DNS 解析

Manager: 管理虚拟网络

- 管理网络节点数据，包括设备ID，公钥，IP 数据，网关，路由表等等其他信息
- 验证节点，返回网络信息给节点
- 管理网络的改变，比如节点加入，节点删除
- 管理节点的生命周期
- 和用户验证服务交互，管理 ACL 信息

Client: 这是用户用来管理虚拟网络的工具

- 和节点通信，配置管理节点
- 处理用户注册，登录流程

## 利用 supernode 加速
前两天看到 omniedge GitHub 发布了 supernode ，可以用来加速虚拟网络的网络状况。

有兴趣可以自行编译 Docker 镜像：

- <https://github.com/omniedgeio/docker-customize-supernode>

需要注意的是如果要使用 Sueprnode 必须使用 Pro 或者 Team 套餐。

## reference

- <https://omniedge.medium.com/how-omniedge-works-792499a8c2d>
- <https://omniedge.io/blog/OpenSource-OmniEdge-Evalutiona-version-and-Introduce-the-OmniEdge-1-0-plan>
- <https://dev.omniedge.io/docs/article/Install#5-installing-on-linux>