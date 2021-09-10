---
layout: post
title: "rTorrent 和 ruTorrent 使用"
tagline: ""
description: ""
category:
tags: [bittorrent, tmux, rtorrent, rutorrent, linux, command-line, command, ]
last_updated:
---

在之前文章总结的[常见的 BitTorrent 客户端](/post/2018/04/bittorrent-client.html) 中就曾经提及过 rTorrent， rTorrent 是一个 C++ 编写的 BitTorrent 客户端，ruTorrent 是它的其中一个 Web 界面，其他的还有 Flood 等等。

这篇文章就主要总结一下 rTorrent 和 ruTorrent 的使用和一些我使用的主题和插件。

## Docker

### 2021年8月更新

这些天去看 LinuxServer 突然发现它们不再维护更新 rutorrent 的镜像，可以转用 [crazy-max](https://github.com/crazy-max/docker-rtorrent-rutorrent) 编译的镜像。

或者直接使用我的 [docker-compose.yml](https://github.com/einverne/dockerfile/tree/master/rtorrent-rutorrent)。先参考 README 修改对应的配置之后，`docker-compose up -d`，然后如果要使用 MaterialDesign ，和下面方法一样，因为已经映射到了机器的路径，

    ~/rtorrent/data/rutorrent/themes

所以，直接在该目录中 clone 项目即可。

    git clone git://github.com/phlooo/ruTorrent-MaterialDesign.git MaterialDesign

不过需要注意的是，只有重启了 Container 之后才会生效。

    docker-compose restart

然后在设置中就可以切换主题了。


### 失效方法
linuxserver 提供的 [ruTorrent](https://hub.docker.com/r/linuxserver/rutorrent/) 很好用的。

	docker pull linuxserver/rutorrent

如果想在该镜像的基础上增加 MaterialDesign 主题可以：

	sudo docker exec -it rutorrent /bin/sh
	cd /app/rutorrent/plugins/theme/themes/
	git clone git://github.com/phlooo/ruTorrent-MaterialDesign.git MaterialDesign
	chown -R abc:users MaterialDesign

最近有时间的话给 [linuxserver](https://github.com/linuxserver/docker-rutorrent/issues/152) 提一个 PR，先把 issue [提了](https://github.com/linuxserver/docker-rutorrent/issues/152)


## ruTorrent themes

MaterialDesign 是当时用 QNAP 上 [rtorrent-Pro](https://forum.qnap.net.pl/download/rtorrent-pro-x86_64.17/) 的[默认主题](https://forum.qnap.net.pl/gallery/photos/rtorrent-pro_ux_ui_rutorrent.4094/)，配色非常舒服就一直用着了。

MaterialDesign

- <https://github.com/themightykitten/ruTorrent-MaterialDesign>

![ruTorrent Web UI Material Design](/assets/rutorrent-material-design-web-ui.png)

![ruTorrent Web UI Material Design Settings](/assets/rutorrent-material-design-web-ui-settings.png)
如果还选择其他的主题可以看看这个[合集](https://github.com/artyuum/3rd-party-ruTorrent-Themes)

## Plugins

### File Manager
ruTorrent 还有一些很好用的第三插件，比如 File Manager，可以直接在网页中对文件进行复制，移动，压缩，重命名等。

- <https://github.com/nelu/rutorrent-thirdparty-plugins>

## 对 linuxserver rutorrent 的修改

LinuxServer 的 ruTorrent 镜像提供了最基本的 rtorrent 和 ruTorrent 功能，能用，但是不合心意。本来是提了 issue 和 PR 想把 MaterialDesign 主题提交进去的，后来发现 LinuxServer 本来的目的也并不是大二全，而成提供基础，任何人想要个性化或者扩展功能都可以以他们提供的镜像作为基础来扩展。[^ref]

[^ref]: <https://raw.githubusercontent.com/linuxserver/docker-rutorrent/master/.github/PULL_REQUEST_TEMPLATE.md>

所以我想的是在 LinuxServer 提供的 [rutorrent](https://github.com/linuxserver/docker-rutorrent/) 镜像基础上把我常用的功能给集成进去。

### MaterialDesign 主题


### autodl-irssi
首先要说一下 [Irssi](https://irssi.org/)， Irssi 是一个发明于 1999 年的基于文本的聊天应用。

[autodl-irssi](https://github.com/autodl-community/autodl-irssi) 是一个可以根据 filters 从 IRC announce channel 中自动下载 torrents 的工具。

而 [autodl-rutorrent](https://github.com/autodl-community/autodl-rutorrent) 则是在 rutorrent 之上的一个插件，但是配置则沿用了 autodl-irssi。


所有的过滤器都定义在 `~/.autodl/autodl.cfg` 中。

### filemanager

### fileshare

### rutorrentMobile
适配移动界面：

- <https://github.com/xombiemp/rutorrentMobile>
