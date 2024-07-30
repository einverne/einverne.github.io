---
layout: post
title: "音流：一款支持 Navidrome 兼容 Subsonic 的跨平台音乐播放器"
aliases:
- "音流：一款支持 Navidrome 兼容 Subsonic 的跨平台音乐播放器"
tagline: ""
description: ""
category: 产品体验
tags: [music, navidrome, stream, music-platform, music-management, music-player, flutter, ios, android-app, android]
create_time: 2024-01-01 09:24:55
last_updated: 2024-02-01 09:24:55
---

之前一篇文章介绍了[Navidrome](https://blog.einverne.info/post/2023/12/navidrome.html)，搭建了一个自己在线音乐流媒体库，把我本地通过 [[Syncthing]] 同步的 80 G 音乐导入了。自己也尝试了 Navidrome 官网列出的 Subsonic 兼容客户端 [[substreamer]]，以及 macOS 上面的 [[Sonixd]]，体验都还不错。但是在了解的过程中又发现了一款中文名叫做「音流」（英文 Stream Music）的应用，初步体验了一下感觉还不错，所以分享出来。

[音流](https://aqzscn.cn/)是一款闭源的，跨平台音乐播放器，使用 Flutter 编写，部分功能（比如离线缓存）是收费功能。

目前音流发布了 V1.3.0 ，作者为了庆祝，所以开启了一轮优惠，最低可以 38 元价格购入。

![Mlpp](https://photo.einverne.info/images/2024/07/25/Mlpp.png)

## 特点

- 支持 Subsonic，Navidrome，Jelly，Emby，Audio Station，Plex 等
- 采用 Flutter 开发，跨平台，支持 Android，iOS，macOS，Windows 多平台，同时还适配了 Android TV，Apple TV 也在规划中。
- 界面美观，支持歌词 API

可以通过这两个项目来获取歌词

- [[LrcApi]]
- [[Lyric-Getter-Api]]
- <https://api.lrc.cx/lyrics>

## 功能演示

首页，可以展示最新专辑，每日推荐，最近播放，最常播放，随机专辑。

![Mo2N](https://photo.einverne.info/images/2024/07/25/Mo2N.png)

播放器页面

![Mpb2](https://photo.einverne.info/images/2024/07/25/Mpb2.png)

Navidrome 配置页

![M6wG](https://photo.einverne.info/images/2024/07/25/M6wG.png)

## 最后
如果有朋友感兴趣的话，我自己搭建了一个有 7000+ 音乐的曲库 [Navidrome](https://blog.einverne.info/post/2023/12/navidrome.html)，如果你也喜欢日韩音乐，可以加入我的群组一起讨论，如果你也愿意分享你的曲库，也欢迎联系我，我会给你开一个 Navidrome 帐号。

## related

- [[LMP 音乐]] 另外一款音乐播放器，可以导入 [[Navidrome]] 服务器歌曲，也可以通过 WebDAV/SMB，Emby，Plex 等导入
- [[Plex]] + [[Plexamp]]
- [[Light Player]]
- [[Ever Play]]
- [[One Player]]
