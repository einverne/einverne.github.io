---
layout: post
title: "BitTorrent 客户端简单比较"
aliases: "BitTorrent 客户端简单比较"
tagline: ""
description: ""
category: 经验总结
tags: [bittorrent, transmission, linux, docker, bt-client, pt, private-tracker]
last_updated:
---

本文会横向比较一下当前比较流行的 [[BitTorrent]] 客户端。

- [[Transmission]] 跨平台的客户端
- [[rTorrent]] 一款使用 C++ 编写的 BitTorrent 客户端，rTorrent 只提供命令行版本，可以配合 [[ruTorrent]] 界面来使用
- [[qBittorrent]]
- [[Deluge]]
- [[uTorrent]]
- [[Vuze]]
- [[BiglyBT]] 一款使用 Java 编写的跨平台开源 BT 客户端，功能非常丰富

## Transmission

开源地址：

- <https://github.com/transmission/transmission>

特性：

- 占用资源少
- 跨平台支持，三大桌面端（Windows/Linux/Mac）、GTK+、QT 版本，还有 Daemon 版本等等
- Daemon 守护进程方便在服务器，嵌入式系统，Headless（无 GUI) 运行
- 可以通过 Web 或者终端来进行控制
- Local peer discovery
- Full encryption, DHT, µTP, PEX and Magnet Link support [^1]

Transmission 在日常中使用完全没有问题，不过唯一的不足就是 Transmission 是无法制作 torrent 的。

[^1]: <https://transmissionbt.com/>

Transmission 的扩展，包括 Android 开源的 Remote control [Transdroid](http://www.transdroid.org/), RSS Tool FlexGet 等等。[^trans]

[^trans]: <https://transmissionbt.com/resources/>

### Docker

    docker create \
      --name=transmission \
      -e PUID=1000 \
      -e PGID=1000 \
      -e TZ=Europe/London \
      -e TRANSMISSION_WEB_HOME=/combustion-release/ `#optional` \
      -e USER=username `#optional` \
      -e PASS=password `#optional` \
      -p 9091:9091 \
      -p 51413:51413 \
      -p 51413:51413/udp \
      -v path to data:/config \
      -v path to downloads:/downloads \
      -v path to watch folder:/watch \
      --restart unless-stopped \
      linuxserver/transmission

更多参考[这里](https://hub.docker.com/r/linuxserver/transmission)

## rTorrent

[[rTorrent]] 是一个用 C++ 编写的纯文本 BitTorrent 客户端。rTorrent 适合在 Tmux, screen, dtach 中使用，配和 [ruTorrent](https://github.com/Novik/ruTorrent/) 作为 GUI。

- <https://github.com/rakshasa/rtorrent>

个人已经拿 rTorrent 作为主力的客户端使用多年，没有发现任何问题，成百上千的种子同时做种也没有发生任何问题。

### Docker

    docker create \
      --name=rutorrent \
      -e PUID=1000 \
      -e PGID=1000 \
      -p 80:80 \
      -p 5000:5000 \
      -p 51413:51413 \
      -p 6881:6881/udp \
      -v /path/to/rutorrent/config:/config \
      -v /path/to/rutorrent/downloads:/downloads \
      --restart unless-stopped \
      linuxserver/rutorrent

更多参考[这里](https://hub.docker.com/r/linuxserver/rutorrent)

### ruTorrent

[ruTorrent](https://github.com/Novik/ruTorrent) 是一款 PHP 写的 rTorrent 的 Web UI

### Flood

Flood 是 [rTorrent](https://github.com/rakshasa/rtorrent) 的一个 UI 界面，用 [[Node.js]] 实现。

- <https://github.com/Flood-UI/flood>

## qBitTorrent

官网：

- <https://github.com/qbittorrent/qBittorrent>

特性：

- 开源，跨平台
- RSS feed
- magnet links, DHT, PEX, LSD

### Docker

    docker create \
      --name=qbittorrent \
      -e PUID=1000 \
      -e PGID=1000 \
      -e TZ=Asia/Shanghai \
      -e UMASK_SET=022 \
      -e WEBUI_PORT=8080 \
      -p 6881:6881 \
      -p 6881:6881/udp \
      -p 8080:8080 \
      -v /path/to/appdata/config:/config \
      -v /path/to/downloads:/downloads \
      --restart unless-stopped \
      linuxserver/qbittorrent

更多参考[这里](https://hub.docker.com/r/linuxserver/qbittorrent/)

## Deluge

官网：

- <https://deluge-torrent.org/>

Deluge 比较优秀的一点是支持 Plugin，官网上有非常丰富的插件可供选择。

### Docker

    docker create \
      --name=deluge \
      --net=host \
      -e PUID=1000 \
      -e PGID=1000 \
      -e TZ=timezone \
      -e UMASK_SET=022 `#optional` \
      -e DELUGE_LOGLEVEL=error `#optional` \
      -v /path/to/deluge/config:/config \
      -v /path/to/your/downloads:/downloads \
      --restart unless-stopped \
      linuxserver/deluge

更多参考[这里](https://hub.docker.com/r/linuxserver/deluge/)

## uTorrent

支持平台：Windows, macOS, Android。

不支持 Linux, 不开源，就不说了。

## Vuze

[Vuze](http://www.vuze.com/) 是一款使用 Java 编写的 BT 客户端，支持三大主流桌面平台。

## BiglyBT

[BiglyBT](https://www.biglybt.com/) 是一款开源的，跨平台的 BT 客户端。BiglyBT 是 Vuze 开源项目的延续，由 Vuze/Azureus 开发，由两个原始开发人员和社区成员维护，从 2003 年至今已经维护超过 20 年

特性

- 快速下载 BT 种子
- 按 IP 地址过滤
- 限制上传和下载速度
- 多语言
- 通过下载，标签，网络（来对特定国家的 peers）进行全局限速
- 下载开始之前支持选择要下载的文件
- [[WebTorrent]] 支持，内置一个 WebTorrent tracker
- 局域网查找，允许同一个防火墙背后的普通网络中多个 BiglyBT 客户端通过端到端直接连接提高下载速度
- 通过 Android 等应用程序进行控制，支持 （Transmission RPC 的客户端）
- 订阅 RSS 源，还可以创建自己的订阅与他人共享
- 去中心化的公共和匿名聊天，带有默认频道
- I2P DHT 进行匿名下载
- 检测 VPN
- Tor 代理
- 媒体播放
- 媒体转换
- [[UPnP]] 服务器和 [[DLNA]] 支持，允许设备直接连接和浏览内容，允许 BiglyBT 将内容直接发送到设备

## Motrix

[Motrix](https://motrix.app) 是一款全能的下载管理器，跨平台，支持 HTTP，FTP，BT，磁力链接等等。

Motrix 使用 Vue 以及 Electron 技术构建。
