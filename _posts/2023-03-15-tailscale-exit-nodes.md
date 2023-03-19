---
layout: post
title: "Tailscale 出口节点功能配置流量出口"
aliases:
- "Tailscale 出口节点功能配置流量出口"
tagline: ""
description: ""
category: 经验总结
tags: [tailscale, linux, virtual-networks, vpn, tailscale-exit-nodes]
create_time: 2023-03-10 07:22:03
last_updated: 2023-03-19 08:45:33
---

之前的文章中介绍过 [Tailscale](/post/2022/04/tailscale-usage.html) ，是一个功能非常强大的虚拟组网的工具，底层使用更高级的 [[WireGuard]] 协议进行通信。之前的文章中只简单的介绍了一下 Tailscale 的使用，但是过去的时间里面 Tailscale 又更新了很多的新特性，这篇文章就介绍其中的一个特性 Exit Nodes。

Exit Nodes（出口节点）功能就是允许 Tailscale 组件的局域网中的节点通过一台 Exit Node（出口节点）来进行网络通信。路由流量的设备称为“出口节点”。

默认情况下，Tailscale 通常只会借助互联网进行节点和节点之间的通信，而用户正常的流量，比如访问 Google，Twitter 等的流量都是通过本机进行的，而存在部分情况，比如在一些对安全通信要求比较高的场景，需要加密访问，这个时候就可以让局域网中的节点经过一个可信的出口节点（Exit Node）来于外部互联网进行通信。

- 比如在咖啡厅，有一些敏感数据想要传输到公司，但是不想通过公共 WiFi 进行通信，那么就可以将电脑于公司网络中的一个节点组成 Tailscale 局域网，然后将公司的节点设置成 Exit Node，然后自己的电脑的通信通过公司节点作为出口。
- 再比如如果在国外不可信的网络中，想要自己的网络还是回到某个国家，就可以使用不同的国家的节点，然后设置出口节点来安全的访问；再比如在国内的节点，想要通过日本的节点来访问外部互联网，那就可以将日本的节点作为出口节点

## 如何配置出口节点

如果要配置出口节点，需要经过下面几步：

- 一个设备（节点）需要申明自己可以作为出口节点
- 网络管理员必须允许这个节点作为出口节点
- 然后网络中的其他设备才可以将此节点作为出口节点

## 出口节点使用的先决条件

如果要使用出口节点需要有一些必备的前提条件：

- Tailscale 网络中必须至少有两个节点
- 确保出口节点和使用出口节点的设备都在运行 Tailscale v1.20 或更高版本
- 确保出口节点是 Linux，macOS 或者是 Windows 设备
- 如果您的 tailnet 使用默认 ACL，则您的 tailnet 用户已经可以访问您配置的任何出口节点。如果您修改了 ACL，请确保您已创建一个 ACL 规则，该规则向您希望使用退出节点的用户授予对 autogroup:internet 的访问权限。他们不需要访问出口节点本身来使用出口节点。下面是添加到您的 ACL 的示例行，它允许所有用户通过出口节点访问互联网：

```
// All users can use exit nodes
// If you are using the default ACL, this rule is not needed because the
// default ACL allows all users access to the internet through an exit node
{ "action": "accept", "src": ["autogroup:members"], "dst": ["autogroup:internet:*"] },
```

### 将节点设置为出口节点

#### Linux 下

如果有 `/etc/sysctl.d` 目录：

```
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

如果没有：

```
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
```

启用 IP 转发时，确保您的防火墙设置为默认拒绝流量转发。这是常见防火墙（如 ufw 和 firewalld ）的默认设置，可确保您的设备不会路由您不想要的流量。

然后执行如下的命令将节点设置成出口节点：

```
sudo tailscale up --advertise-exit-node
```

#### 在管理面板设置节点为 Exit Node

访问 Tailscale [控制面板](https://login.tailscale.com/admin/machines)，点击 Exit Node 节点后的设置，点击  **Disable key expiry**，禁用密钥过期。然后点击 Edit route settings，勾选 Use as exit node，之后启用。

#### 使用出口节点

经过了上面两步网络中的其他节点就可以使用上面的出口节点，但是每个设备都需要单独启用出口节点。

其他节点需要运行：

```
sudo tailscale up --exit-node=<exit-node-ip>
```

可以从管理控制台或运行 tailscale status 找到设备的 IP 地址。

或者，将 `--exit-node-allow-lan-access` 设置为 true 以允许在通过出口节点路由流量时直接访问本地网络。

```
sudo tailscale up --exit-node=<exit-node-ip> --exit-node-allow-lan-access=true
```

然后就可以通过 [在线 IP 检测工具](https://www.whatismyip.com/) 来查看本地流量是否已经由出口节点路由。

如果在命令行下可以使用 `curl ip.gs` 来查看 IP 信息。

## reference

- <https://tailscale.com/kb/1103/exit-nodes/?tab=linux>
- 对于 macOS 的设置可以参考[这里](https://tailscale.com/kb/1103/exit-nodes/?tab=macos)，Windows 的设置参考[这里](https://tailscale.com/kb/1103/exit-nodes/?tab=windows)
- 如果想要同类型的产品，可以注册 [OmniEdge](https://omniedge.io?referral_code=omnied149476)
