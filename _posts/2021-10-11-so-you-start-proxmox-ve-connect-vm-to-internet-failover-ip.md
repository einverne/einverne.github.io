---
layout: post
title: "So you Start 独服 Proxmox VE 虚拟机配置 Failover IP"
aliases:
- "So you Start 独服 Proxmox VE 虚拟机配置 Failover IP"
tagline: ""
description: ""
category: [ 经验总结, Proxmox-VE ]
tags: [ so-you-start, proxmox, proxmox-ve, pve, linux, ubuntu, failover-ip, network, ip ]
last_updated:
---

最近买了一台 [[so-you-start]] 的独立服务器，开始的时候安装了 Ubuntu 没有充分利用独立服务器的优势，所以这两天把系统重新安装成了 [[Proxmox VE]]，然后在上面又安装了 Ubuntu 20.04，So you Start 提供了额外 16 个可以以 1.5 美元购买的 [[Failover IPs]]，Failover IP 本来是为了可以将服务器迁移到另外的服务器而提供的机制，但在 Proxmox VE 虚拟化技术系统下，可以给虚拟机也分配不同的 IP，这样就实现了从一台服务器虚拟化多个 VPS 的操作。

安装 Proxmox VE 的过程就不多说了，在 So you Start 或者 OVH 后台直接使用模板安装即可，我使用的 6.x 版本，没有升级到最新的 7 版本。

安装完成后使用 Ubuntu Server 的 ISO 镜像完成虚拟机的安装。

## 前提准备工作

- 一台安装好 Proxmox VE 的独立主机
- 新建一台可以登录的虚拟机，操作系统不限 (推荐 Debian/Ubuntu)
- 购买好至少一个额外的 Failover IP

## 配置 Failover IP 到虚拟机

### Create a Virtual MAC Address
首先到 So you Start 后台 IP，然后选择购买的 Failover IP，新增 virtual MAC 地址，然后复制该 MAC 地址备用。

比如：

    02:01:00:78:95:aa

新增 MAC 地址可能有一点延迟，等待一小会儿生效即可。

### Add virtual MAC to the NIC of a VM
然后需要在 Proxmox VE 虚拟机配置中将上述 MAC 地址配置。如果还没有安装虚拟机，可以参考 [Proxmox VE 官网的教程](https://pve.proxmox.com/wiki/Qemu/KVM_Virtual_Machines) 。

VM 配置前需要是关闭状态。

在 Proxmox VE 中，找到虚拟机的 Hardware

![](/assets/proxmox-ve-vm-hardward-20211019134831.png)

找到 Network Device 选项，默认情况下是一个随机生成的 MAC 地址：

![](/assets/proxmox-ve-vm-network-device-20211019134924.png)

点击 Edit，然后在 MAC address 一栏将上一步的虚拟 MAC 地址填入，并保存。

然后启动 VM，接下来需要配置虚拟机的网络接口。

### Configuring Network Settings
配置虚拟机网络。

#### Debian 10

首先查看一下接口：

    ip addr

除了一个 `lo` 应该能看到类似 `ens18` 这样的接口。

Debian 的网络接口配置在 `vi /etc/network/interfaces`:

```
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto ens18
iface ens18 inet static
address 192.0.2.1
netmask 255.255.255.0
gateway 203.0.113.254
dns-nameservers 208.67.222.222 208.67.220.220
```

说明：

- 修改其中的 ens18 为自己的相应的配置
- address 一行：`192.0.2.1` 修改为自己的 Failover IP
- gateway 一行： `203.0.113.254` 前 3 个字节的数字，修改成独立服务器 IP 地址的前三个字节 IP 地址，最后添加 254，比如独立服务器的 IP 是 `1.2.3.4`，那么使用 `1.2.3.254` 作为网关
- 最后一行是 DNS 设置，可以使用上面使用的 OpenDNS，也可以使用任何其他的，比如 Cloudflare 的 1.1.1.1, 或者 Google 的 8.8.8.8

然后使得接口生效：

    ip link set ens18 up

最后重启 networking:

    systemctl restart networking

然后可以测试连通性：

    ping 8.8.8.8

能够 ping，表示已经可以联网。

    ping google.com

然后看一下 DNS 解析，如果域名无法解析，我这边情况是少了 `/etc/resolv.conf`，手工创建文件并写入：

    nameserver 8.8.8.8

即可。

#### Ubuntu 18.04
Ubuntu 从 17 版本开始就使用 [Netplan](https://netplan.io/) 来管理网络配置，所以和 Debian 有一些区别。

修改 netplan 配置文件，根据不同的系统可能配置文件路径不一样，请注意一下：

    vi /etc/netplan/01-netcfg.yaml
    vi /etc/netplan/00-installer-config.yaml

然后使用：

```
# This is the network config written by 'subiquity'
network:
  version: 2
  renderer: networkd
  ethernets:
    ens18:
      dhcp4: no
      dhcp6: no
      addresses:
        - 192.0.2.1/32  # 这里填写 failover ip（vMAC 地址需要提前配好)
        - 1111:2222:3333:6666::2/64 # 如果有 IPv6 地址也可以配上，an ipv6 from your server allocation
      gateway4: 1.2.3.254
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
      routes:
      - to: 1.2.3.254/32
        via: 0.0.0.0
        scope: link
```

和上面的配置类似，对应替换即可。

然后使之生效：

    sudo netplan apply

注意在配置 Ubuntu 22.04 的时候 Netplan 可能会有一 WARNING：

> `gateway4` has been deprecated, use default routes instead. See the 'Default routes' section of the documentation for more details.

简单的查了一下 Netplan 的配置格式发生了改变。如果不修改理论上也没有关系，不过为了之后兼容，可以改用 Netplan 最新的配置。[^netplan]

[^netplan]: <https://netplan.io/examples/>



## reference

- [[Proxmox VE]]
- <https://support.us.ovhcloud.com/hc/en-us/articles/360002394324-How-to-Connect-a-VM-to-the-Internet-Using-Proxmox-VE>
- [Proxmox VE 配置 NAT 与虚拟机共享一个公网 IP](/post/2021/10/proxmox-ve-config-nat-vm-use-same-public-ip.html)
- <https://docs.ovh.com/gb/en/dedicated/network-ipaliasing/>