---
layout: post
title: "HostHatch 私有网络配置记录"
aliases:
- "HostHatch 私有网络配置记录"
tagline: ""
description: ""
category: 经验总结
tags: [ hosthatch, vps, private-networking, networking, ubuntu ]
create_time: 2025-04-17 14:49:57
last_updated: 2025-04-17 14:49:57
dg-home: false
dg-publish: false
---

我一直有使用 [HostHatch](https://gtk.pw/hh) 的 VPS，这也是我人生中购买的第一台新加坡的服务器，HostHatch 的服务一直比较稳定，可惜的是到国内的网络不太行，延迟比较高。但好在 2 核 8G 内存，40 G 存储，两年只要 68 美元，所以也就又续费了。

但是在续费的过程中点开后台发现 HostHatch 更新了一个私有网络（Private Networking）的功能，根据官方的说法，需要在 VM 上开启私有网络，那么就可以获得一个额外的网络接口，可以通过该网络接口和同一个区域中的其他 VM 之间通信。但是无法通过此接口访问任何外部网络。

## Private Networking

如果 VPS（VM）开启私有网络之后，会与自己唯一的 VLAN/VXLAN 隔离，可以为其分配任何的 IPv4 或 IPv6 地址，HostHatch 不会在这些网络上提供任何自动地址分配或者 DHCP，如果将所有的主机配置到同一个子网中，就无需设置任何手动路由或者网关，比如 192.168.10.1/24 和 192.168.10.2/24。

如果在 VM 创建时添加，或者在启用 VM 之后重新安装，此接口将自动重命名为 eth1，可以通过其 MAC 地址来识别，以 `00:22` 开头，可以在这些接口上使用 MTU 9000 以实现最大吞吐量。

此接口的带宽是无限的，不计入服务器每个月的带宽使用。

## 配置

这里我自己只使用 Ubuntu/Debian 系统，所以只以此为例，如果您使用 CentOS 或者 AlmaLinux 可以自行参考官方文档设置。

首先识别接口名字

```
ip -o link | grep 00:22
```

创建新的 interfaces.d 文件，如果不相同，将 eth1 更改为接口名。创建 `/etc/network/interfaces.d/90-private`

```
auto eth1
iface eth1 inet static
    address 192.168.10.1/24
```

然后重启网络服务

```
sudo systemctl restart networking
```
