---
layout: post
title: "BitRemote iOS 上的 BT/PT 下载管理新选择"
aliases:
- "BitRemote iOS 上的 BT/PT 下载管理新选择"
tagline: ""
description: ""
category: 产品体验
tags: [ios, bt, pt, bt-client, bittorrent, qbittorrent-bot, qbittorrent, transmission, rutorrent, rtorrent,]
create_time: 2024-07-25 16:35:58
last_updated: 2024-07-25 16:35:58
dg-home: false
dg-publish: false
---

[BitRemote](https://github.com/BitRemote-Team/BitRemote) 是一款专为 Apple 平台设计的 BT/PT 下载任务管理工具，作为一款原生应用，BitRemote 旨在为 iOS 和 macOS 用户提供全面的下载管理体验，填补了苹果生态系统中这一领域的空白。我个人之前在 Android 上使用一款开源的 [[Transdroid]]，支持非常多的客户端，但是转移到 iOS 之后很久都没有找到类似的代替品，我在去年内测的时候就使用了 BitRemote，但是看过我之前[文章](https://blog.einverne.info/post/2020/03/rtorrent-and-rutorrent.html)，都知道我使用 ruTorrent 和 rTorrent 这两个比较小众的客户端，Transdroid 是支持的，但是 BitRemote 截止目前也还是不支持的，但是如果使用 [[qBittorrent]]，[[Transmission]]，[[Aria2]] 的用户不妨试一试。

## 功能

BitRemote 可以在 Mac、iPhone、iPad 上 管理 BT、PT 下载任务 ，支持 iPhone，iPad，macOS 等。

支持客户端

- Aria2
- qBittorrent
- Transmission
- 群晖 Synology Download Station
- 威联通 QNAP Download Station

![MLuR](https://photo.einverne.info/images/2024/07/25/MLuR.jpg)

BitRemote 使用原生技术开发，提供流畅的使用体验。

## 和 Android 平台对比

在 Android 下 BT 客户端 Transdroid 一款应用即可搞定，并且还有很多代替的应用。反而在 iOS 平台下，BT 客户端应用相对来说比较少。如果你在寻找一款能够在 iOS 下管理 BT 客户端的应用，那么不妨考虑一下 BitRemote。

## 价格

目前 BitRemote 正式版本，提供 14 天免费试用，之后 200 日元一个月，一年是 2000 日元。因为我在日区，就直接使用日元计价了，其他区可以自行查看一下。

## More

另外如果你的 BT 客户端是部署在局域网内的，不妨考虑通过 [frp](https://einverne.github.io/post/2018/06/qnap-frp-usage.html)， [ZeroTier](https://blog.einverne.info/post/2018/06/zerotier.html) 或者 [Tailscale](https://blog.einverne.info/post/2022/04/tailscale-usage.html) 等[[内网穿透工具]] 来组件虚拟局域网，然后安全的进行访问。
