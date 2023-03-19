---
layout: post
title: "Tailscale 简单使用"
aliases: 
- "Tailscale 简单使用"
tagline: ""
description: ""
category: 学习笔记
tags: [tailscale, vpn, virtual-networks, linux, ubuntu]
last_updated: 2023-03-19 09:58:32
create_time: 2022-04-28 11:45:13
---

Tailscale 是一种用于构建安全、私有的网络的软件工具，可以在不同设备之间创建虚拟专用网络（VPN），并允许这些设备之间的安全通信。与传统的 VPN 不同，Tailscale 不需要使用 IP 地址或端口转发来实现网络连接。相反，Tailscale 使用每个设备上的唯一身份验证密钥来实现点对点的直接连接，从而提供了更高的安全性和便捷性。

Tailscale 可以在多种操作系统和设备上使用，包括 Windows、macOS、Linux、iOS、Android 和路由器等。它还提供了许多其他功能，如内网穿透、跨设备的文件共享、远程访问和身份验证等，可以帮助用户更轻松地管理和连接其设备和网络。

在接触到 Tailscale 之前，也用过一段时间的 [ZeroTier](/post/2018/06/zerotier.html) 和 [OmniEdge](/post/2021/11/omniedge-usage.html) ，ZeroTier 其实到现在未知还一直在用，但是在中国大陆的速度确实不是很快，大部分的时间我只能连个 SSH 查看一下，其他的网络访问都比较慢，并且还丢包。OminiEdge 则是感觉安装的方式还略微有点麻烦，不如现在要介绍的 Tailscale 方便，并且 Tailscale 还有对应的 Ansible Playbook，我配置好之后基本上，如果有新节点的加入只需要跑一下 [[Ansible]] 即可。

## Install

Debian/Ubuntu 下安装：

```
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/bionic.gpg | sudo apt-key add -
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/bionic.list | sudo tee /etc/apt/sources.list.d/tailscale.list
sudo apt update && sudo apt install tailscale
```

启动：

```
sudo tailscale up
```

查看 Tailscale IP 地址：

```
ip addr show tailscale0
```

或者

```
tailscale ip -4
```

需要注意的是目前是没有方法自定义 Tailscale 分配的 IP 地址。如果想要改变被分配的 IP 地址，可以通过如下方式强制分配新的：

- 在 [管理面板](https://login.tailscale.com/admin/machines) 中移除节点
- 在节点上重置并[重新安装](https://tailscale.com/kb/1069/uninstall/)

## reference

- [[2018-06-14-zerotier]]
- [[2021-11-29-omniedge-usage]]
