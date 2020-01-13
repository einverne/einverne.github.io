---
layout: post
title: "Syncthing 又一款同步工具"
tagline: ""
description: ""
category: 产品体验
tags: [syncthing, sync, tools, linux, cross-platform, application, ]
last_updated:
---

昨天在整理同步工具的时候接触到了 Syncthing，简直秒杀了我现在使用的任何同步工具，所以不得不花一些篇幅来记录一下。

在看到 Syncthing 的介绍时，就非常好奇它的同步原理。也幸亏它的官方文档也有非常[详细的 QA](https://docs.syncthing.net/users/faq.html)

几个比较重要的点：

- 和 BitTorrent/Resilio Sync 的区别在于，Syncthing 开放源代码，使用开放协议，避免 Resilio Sync 闭源协议的安全问题
- Syncthing 的同步原理，和 BT 类似，会将文件分片传输，当越多设备在线，那么共享速度越快
- Syncthing 依赖于一个全局发现服务器，用来通过 Device ID 来发现设备 IP 和 端口，任何人都可以自己架设全局 Discovery 服务器，然后将自己的节点指向该服务器，这样就不必共享全局的服务器了，更甚至不需要依赖与因特网就能够实现局域网内文件同步
- 关于安全性的[说明](https://docs.syncthing.net/users/security.html) 已经列举的非常详细了，所有内容通过 TLS 加密传输

## 端口
Syncthing 有个端口需要注意一下

- 8384 端口是网页 GUI 监听端口，默认监听 127.0.0.1
- `tcp://0.0.0.0:22000` 服务监听地址
- `udp://0.0.0.0:21027` 本地发现服务端口

## 配置文件

在 Unix 下在 `$HOME/.config/syncthing` 下

	vi ~/.config/syncthing/config.xml

然后修改本地监听地址从 127.0.0.1 到 0.0.0.0.

## 开机启动
如果熟悉 supervisord 可以使用官方提供的文档配置，如果在 Linux 下可以尝试使用 Systemd

	sudo systemctl enable syncthing@yourname.service
	sudo systemctl start syncthing@yourname.service

记得把 yourname 替换成用户名。

服务端口是 8384.

## 推荐理由
推荐的理由：

- 无需额外的服务器资源，以前使用 NextCloud 的时候，有一个很不方便的便是需要保证服务器 24h 不停地在线，放在家里 NAS 如果遇到停电就很不方便
- 同步速度非常快，使用中心化的同步服务，中心服务器的网速限制了同步的速度，如果客户端越多速度越慢，但是 Syncthing 做到了点对点传输，也就意味着客户端越多那么同步速度越快，因为这一个节点的文件内容可以并行分片的从不同的节点获取
- 丰富的客户端，除了 iOS 没有官方支持，三大桌面端，Android，路由器，NAS 几乎都有支持，因为 Go 写的嘛
- Syncthing 完美的替换了 Dropbox 等等服务

## Syncthing 配置本地 Discovery 服务器
有一种情况是，加入只想要在本地局域网中传输数据，那么可以关闭全局 Discovery 服务器，然后在设置中手动指定某一态服务器的 IP 和 端口，而不是使用默认的 dynamic。这样所有的数据就会在本地传输。

## reference

- <https://docs.syncthing.net/intro/getting-started.html>
