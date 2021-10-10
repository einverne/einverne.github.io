---
layout: post
title: "VMware Workstation 虚拟机网络设置"
aliases: "VMware Workstation 虚拟机网络设置"
tagline: ""
description: ""
category: 经验总结
tags: [vmware, vmware-workstation, vm, virtual-machine, linux, ip, network ]
last_updated:
---


总结一下 VMware Workstation 和 Fusion 中的虚拟机网络设置的选项。

VMware 产生的虚拟机会有以下几种网络模式：

- Bridged
- NAT
- Host-only
- Custom

## VMware 虚拟机网络模式

### Bridged
虚拟机通过桥接，直接连接到物理网络。虚拟机会和主机在同一个子网中。比如你的宿主机的 IP 是 192.168.1.100，并且所在的网络中存在一个 HDCP 服务器（比如路由器等），那么虚拟机就会获得一个 192.168.1.x 的 IP 地址，表现成网络中的另外一台电脑一样。


### NAT
Used to share the host's IP address，这种模式给予了虚拟机连接到 Network Address Translation 网络的能力， 虚拟机会自动才 VMware Workstation DHCP 服务器获取一个 IP 地址，子网掩码。

这个 IP 和宿主机的网络不在同一个子网中，这个地址通过宿主机网络地址转化过。


### Host-only
一个和宿主机共享的私有的网络，虚拟机会被隔离在这个私有网络中，无法去访问宿主机本地网络和互联网。运行在 Host-only 网络下的虚拟机通过内部的 DHCP 服务器获取 IP 地址。你可以在这样的网络中运行一系列的虚拟机，他们之间可以网络通信。

事实上，如果禁用了和宿主机之间的网络和 DHCP，你就可以获得一个完全私有的网络。通常情况下，如果想要虚拟机访问互联网，你需要使用虚拟机的路由，比如 pfSense, VyOS 等等。


### Custom

指定虚拟网络。


- vmnet0 is bridged to eth0
- vmnet1 is a host-only network on subnet 172.16.220.0.  
- vmnet8 is NAT network on a private subnet 172.16.231.0.


## Virtual Network Editor
在 VMware Workstation 的 Edit 菜单中，可以看到 Virtual Network Editor 选项。在这个菜单中可以对虚拟网络进行管理。

在其中管理的虚拟网络，可以在虚拟机网络的 Custom 中进行使用。


## LAN Segments
LAN Segments 是 VMware Workstation 在 9 之后增加的功能。和其他网络设定不同，LAN Segments 只能通过每一个虚拟机的网络去管理。

LAN Segments 创建了一个没有 DHCP 的完全隔离的私有网络，这意味你必须给虚拟机分配一个 LAN segment。你必须要配置一个静态IP地址，或者使用自己的 DHCP 服务器。

相较于其他网络设置的好处是，你可以创建任意多个 LAN segments，并且可以指定你自己的名字来区别。这个功能在设置复杂的虚拟网络的时候尤其有用。


## reference

- <https://www.dtonias.com/vmware-workstation-network-types-settings/>