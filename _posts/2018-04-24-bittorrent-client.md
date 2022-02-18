---
layout: post
title: "BitTorrent 客户端简单比较"
aliases: "BitTorrent 客户端简单比较"
tagline: ""
description: ""
category: 经验总结
tags: [bittorrent, transmission, linux, docker,]
last_updated:
---

横向比较一下 BitTorrent 客户端。

## Transmission
开源地址：

- <https://github.com/transmission/transmission>

特性：

- 占用资源少
- 跨平台支持，三大桌面端（Windows/Linux/Mac）、GTK+、QT版本，还有 Daemon 版本等等
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

## VUZE
看到有推荐，支持三大主流桌面平台。

- <http://www.vuze.com/>
