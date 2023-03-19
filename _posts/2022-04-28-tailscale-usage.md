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

Tailscale 是一种用于构建安全、私有的网络的软件工具，可以在不同设备之间创建虚拟专用网络（VPN），并允许这些设备之间的安全通信。与传统的 VPN 不同，Tailscale 不需要使用 IP 地址或端口转发来实现网络连接。相反，Tailscale 使用每个设备上的唯一身份验证密钥来实现点对点的直接连接，从而提供了更高的安全性和便捷性。Tailscale 使用更高级的 [[WireGuard]] 协议来进行节点和节点之间的通信。

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

## ACL

Tailscale ACL（Access Control List），访问控制列表，可以严格限制特定用户或设备在 Tailscale 网络上访问的内容。

Tailscale/Headscale 的默认访问规则是 default deny，也就是黑名单模式，只有在访问规则明确允许的情况下设备之间才能通信。所以 Tailscale/Headscale 默认会使用 allowall 访问策略进行初始化，该策略允许加入到 Tailscale 网络的所有设备之间可以相互访问。

Tailscale/Headscale 通过使用 group 这种概念，可以只用非常少的规则就能表达大部分安全策略。除了 group 之外，还可以为设备打 tag 来进一步扩展访问策略。结合 group 和 tag 就可以构建出强大的基于角色的访问控制（RBAC）策略。

Tailscale 的访问控制权限借鉴了 [[RBAC]] 基于角色的访问控制。

Headscale 的 ACL 策略主要包含以下几个部分：

- `acls`：ACL 策略定义。
- `groups`：用户的集合。Tailscale 官方控制器的“用户”指的是登录名，必须是邮箱格式。而  **Headscale 的用户就是 namesapce**。
- `hosts`：定义 IP 地址或者 CIDR 的别名。
- `tagOwners`：指定哪些用户有权限给设备打 tag。
- `autoApprovers`：允许哪些用户不需要控制端确认就可以宣告 Subnet 路由和 Exit Node。

### ACL 规则

acls 部分是 ACL 规则主体，每个规则都是一个 HuJSON 对象，它授予从一组访问来源到一组访问目标的访问权限。

所有的 ACL 规则最终表示的都是**允许从特定源 IP 地址到特定目标 IP 地址和端口的流量**。虽然可以直接使用 IP 地址来编写 ACL 规则，但为了可读性以及方便维护，建议使用用户、Group 以及 tag 来编写规则，Tailscale 最终会将其转换为具体的 IP 地址和端口。

每一个 ACL 访问规则长这个样子：

```text
  - action: accept
    src:
      - xxx
      - xxx
      - ...
    dst:
      - xxx
      - xxx
      - ...
    proto: protocol # 可选参数
```

Tailscale/Headscale 的默认访问规则是 `default deny`，也就是黑名单模式，只有在访问规则明确允许的情况下设备之间才能通信。所以 ACL 规则中的 `action` 值一般都写 `accept`，毕竟默认是 deny 嘛。

`src` 字段表示访问来源列表，该字段可以填的值都在这个表格里：

## 高级功能

- route 功能，通过虚拟路由实现通过一个节点访问到节点所在局域网内的所有内网设备
- [[Tailscale Exit Nodes]] 出口节点功能实现设备的异地出口访问，让设备通过指定的节点作为出口

## reference

- [[2018-06-14-zerotier]]
- [[2021-11-29-omniedge-usage]]
