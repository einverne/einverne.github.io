---
layout: post
title: "使用命令行远程网络唤起主机"
tagline: ""
description: ""
category: 学习笔记
tags: [cli, wake-on-lan, linux, etherwake, ethernet, network ]
last_updated:
---

在 Linux 下可以通过 etherwake 命令来网络唤醒设备。

	sudo apt install etherwake

## 检查主机是否支持网络远程唤醒
首先检查 BIOS 中设置，Wake on LAN 是否开启。一般在 BIOS > Power Management > “Wake On LAN” 这个选项下。然后重启进入系统，用如下命令查看网卡 `eth0` 是否开启了 Wake on LAN:

	ethtool eth0

输出：

	Settings for eth0:
			Supported ports: [ TP ]
			Supported link modes:   10baseT/Half 10baseT/Full
									100baseT/Half 100baseT/Full
									1000baseT/Full
			Supported pause frame use: Symmetric
			Supports auto-negotiation: Yes
			Supported FEC modes: Not reported
			Advertised link modes:  1000baseT/Full
			Advertised pause frame use: Symmetric
			Advertised auto-negotiation: Yes
			Advertised FEC modes: Not reported
			Speed: 1000Mb/s
			Duplex: Full
			Port: Twisted Pair
			PHYAD: 1
			Transceiver: internal
			Auto-negotiation: on
			MDI-X: off (auto)
			Supports Wake-on: pumbg
			Wake-on: g
			Current message level: 0x00000007 (7)
								   drv probe link
			Link detected: yes

结果中可以一眼就看到：

	Supports Wake-on: pumbg
	Wake-on: g

如果没有看到这个字样，或者是 off 状态，需要手动启动一下：

	ethtool -s eth0 wol g

说明：

- `-s NIC`, 我这里的 eth0 是网络接口的设备名，根据不同的设备填写不同，可以通过 `ifconfig`  来查看
- `wol g` 表示设置 Wake-on-LAN 选项使用 MagicPacket.

## 使用命令远程唤醒

在 Linux 下执行如下命令唤醒设备：

	sudo apt install wakeonlan
	wakeonlan MAC_ADDRESS

或者

	etherwake MAC_ADDRESS

可以通过 ping 命令和 arp 命令来获取局域网中的设备 MAC 地址：

	ping -c 4 SERVER_IP && arp -n

## reference

- <https://www.cyberciti.biz/tips/linux-send-wake-on-lan-wol-magic-packets.html>
