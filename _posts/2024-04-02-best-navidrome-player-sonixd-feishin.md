---
layout: post
title: "最棒的 Navidrome 音乐客户端 Sonixd(Feishin)"
aliases:
- "最棒的 Navidrome 音乐客户端 Sonixd(Feishin)"
tagline: ""
description: ""
category: 经验总结
tags: [sonixd, music-player, navidrome, jellyfin, airsonic, subsonic, ]
create_time: 2024-04-07 22:12:17
last_updated: 2024-04-07 22:12:17
dg-home: false
dg-publish: false
---

[Sonixd](https://github.com/jeffvli/sonixd) 是一款跨平台的音乐播放器，可以使用 [[Subsonic API]]，兼容 Jellyfin，[[Navidrome]]，Airsonic，Airsonic-Advanced，Gonic，Astiga 等等服务端。

Sonixd 是一款非常优秀的云端音乐播放器软件，播放在云端储存的音乐。支持各种格式音乐文件，支持 Windows、MacOS、Linux 系统。打造自己的网易云音乐 PC 客户端，不再为付费及版权所困扰。

Sonixd 作者将 Sonixd 重写，并且重命名为 Feishin。

## 问题

安装的时候，如果遇到如下的问题，解决方案如下。

> Sonixd.app is damaged and can't be opened.
> ![4XHg](https://photo.einverne.info/images/2024/02/13/4XHg.png)

在终端执行

```
xattr -cr /Applications/Sonixd.app
```

然后重新打开即可。

Sonixd 是一款非常优秀的云端音乐播放器软件，播放在云端储存的音乐。支持各种格式音乐文件，支持 Windows、MacOS、Linux 系统。打造自己的网易云音乐 PC 客户端，不再为付费及版权所困扰。

Sonixd 作者将 Sonixd 重写，并且重命名为 Feishin。

## 问题

安装的时候，如果遇到如下的问题，解决方案如下。

> Sonixd.app is damaged and can't be opened.
> ![4XHg](https://photo.einverne.info/images/2024/02/13/4XHg.png)

在终端执行

```
xattr -cr /Applications/Sonixd.app
```

然后重新打开即可。
