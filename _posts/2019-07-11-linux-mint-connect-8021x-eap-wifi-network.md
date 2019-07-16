---
layout: post
title: "Linux Mint 连接 802.1x EAP wifi network"
tagline: ""
description: ""
category: 经验总结
tags: [linux-mint, wifi, wifi-network, eap, wifi-authentication, ]
last_updated:
---

Linux Mint 在连接 802.1x EAP 网络时，一直无法弹出用户名密码弹窗，导致一直无法连接这些网络。今天查了一下，需要手动进行连接。

打开 Network Manager，选择 **Connect to Hidden Network**.

- Wi-Fi security 中选择 WAP & WPA2 Enterprise
- 在弹出的复杂的对话框中
- Authentication 选择 Protected EAP(PEAP)
- 然后输入 Username 和 Password ，证书可选

选择连接即可。

## reference

- <https://forums.linuxmint.com/viewtopic.php?t=23893>
- <https://forums.linuxmint.com/viewtopic.php?f=150&t=18606&p=111082&hilit=PEAP%2FMSCHAPv2#p111082>
