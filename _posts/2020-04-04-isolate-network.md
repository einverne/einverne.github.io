---
layout: post
title: "个人的局域网网络设置整理"
tagline: ""
description: ""
category: 经验总结
tags: [network, linux, dhcp, ip, ]
last_updated:
---

最近因为想要调查我屋里网络带宽的瓶颈，把整个家里的网络环境整理了一番，也把本来乱七八糟的各种 IP 也梳理了一下。纯粹整理，如果不关心的可以跳过。

现在我有两台路由器，准确来说是三台，一台主路由基本不动，负责接入互联网，稳定为主，千兆。一台房间的副路由，无线中继主路由，IP 由主路由分配，还有一台本来做了无线桥接，有一个新的网段，现在想逐渐弃用，转移到同一个网段，便于管理。


## 路由器设置 DHCP
主路由和副路由的网络设置，就不赘述，主路由没有什么设置，主要是副路由需要设置无线中继 +AP，我这里没有用主路由的 SSID，新产出了一个新的 SSID，如果在个人家中其实用同一个 SSID 即可，可以无缝切换。

## QNAP static ip
QNAP 设置静态地址

网络与虚拟环境中，找到之前设定的对应的接口，QNAP 中叫做虚拟交换机，直接通过 UI 界面修改即可。

## Proxmox static ip
Proxmox 的网络接口配置在 `/etc/network/interfaces` 文件中。

类似这样：

```
auto lo
iface lo inet loopback

iface enp3s0 inet manual

auto vmbr0
iface vmbr0 inet static
        address 192.168.2.100
        netmask 255.255.255.0
        gateway 192.168.2.1
        bridge_ports enp3s0
        bridge_stp off
        bridge_fd 0
```

修改其中的 address, netmask, gateway 即可。修改保存后重启，或者 `systemctl restart networking.service`
## Raspberry Pi static ip
树莓派是网线接入，所以需要设置 eth0 的静态地址。

如果是用网线，eth0 端口，编辑 `/etc/dhcpcd.conf`：

	interface eth0
	static ip_address=192.168.2.4/24
	static routers=192.168.2.1
	static domain_name_servers=192.168.2.1 8.8.8.8

重启：

	sudo reboot

如果使用的是无线网卡，那么需要设置 `wlan0` 网卡：

	# 查看当前配置
	ifconfig -a
	# 查看 wifi 配置
	less /etc/wpa_supplicant/wpa_supplicant.conf
	# 修改配置
	sudo vi /etc/dhcpcd.conf

修改内容，和上面类似，注意把 IP 替换成对应内网的地址，别直接复制使用：

	interface wlan0
	static ip_address=192.168.2.4/24
	static routers=192.168.2.1
	static domain_name_servers=192.168.2.1 8.8.8.8

注意配置 Raspberry Pi 网卡地址的时候千万要小心，否则一旦配置错误，如果又是作为服务器使用的话，可能造成无法获取局域网地址从而无法连接，那么就可能需要键盘和显示器来登录重新配置，所以谨慎。

## Other devices
其他的 Linux PC 可以选择 DHCP，也可以配一个静态的 IP，因为不需要连接所以不知道自动获取的 IP 也关系不大。


## 为什么路由器的设置地址都是 192.168 开头
IPv4 地址协议中预留了 3 个 IP 段，作为保留地址给专有网络使用。

- A 类地址：10.0.0.0--10.255.255.255
- B 类地址：172.16.0.0--172.31.255.255
- C 类地址：192.168.0.0--192.168.255.255

那么回到这个问题上，为什么家用的路由器默认分配的地址都是 192.168.1.x 或者 192.168.2.x 等等，举一个简单的例子，假如路由器使用 `192.168.1.1/24` 网段，那么在这个网络中可以容纳的机器数是 `192.168.1.2-255` 共 254 多个可用的 IP，一般家庭的设备连接足够。当然能够带动这么多设备的路由器性能也需要足够好了。

而假如你的局域网中可预期将会有几千几万太设备那么必然 192.168.1.x 的网段是不能用的，必须用到

- `172.16.0.0/12` 可容纳 1048576 个地址
- `10.0.0.0/8` 可容纳 16777216 个地址

下面两个地址自然个人是用不这么多的。

## reference

- [保留 IP 段](https://zh.wikipedia.org/wiki/%E4%BF%9D%E7%95%99IP%E5%9C%B0%E5%9D%80)
- <https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing>
- [CIDR 工具](https://www.ipaddressguide.com/cidr)
