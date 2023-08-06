---
layout: post
title: "Blaze 一个在局域网中点对点传输的网站"
aliases:
- "Blaze 一个在局域网中点对点传输的网站"
tagline: ""
description: ""
category: 产品体验
tags: [ blaze, preact, javascript, webtorrent, websockets, p2p, file-sharing, ]
create_time: 2023-07-26 13:39:55
last_updated: 2023-07-26 13:39:55
---

今天在了解一个根据英语搜索日语的网站 ---- [hiki](https://hikibiki.app/) 的时候，发现这个网站是使用一个叫做 [[Preact]] 的非常轻量的框架写的，然后我就沿着 Preact 的线索去查了一下那些网站是用 Preact 实现的，然后就发现了本文的主人公 ---- [[blaze]]。

[blaze](https://blaze.vercel.app/) 是一个基于 P2P 技术的文件共享 Web 应用程序。它允许用户通过直接连接和共享文件，而无需通过云存储服务或中央服务器。使用 blaze，用户可以轻松地共享大型文件、照片、视频等，并与其他用户进行实时的 P2P 传输。该应用程序提供了一个简单直观的界面，使用户能够快速上传和下载文件。blaze 利用 WebRTC 技术实现点对点连接，并使用 WebTorrent 协议进行文件传输。这种去中心化的方法不仅提高了速度和效率，同时也增强了隐私和安全性。

我简单的试用了一下 blaze ，发现真的太神奇了，它是一个文件分享的网站，但是不需要任何的注册，验证，而只需要设备在同一个局域网中就可以相互分享文件。于是为了测试我在 macOS 上打开了 blaze，然后起一个昵称，之后会得到一个链接，然后我在 Android 平板上打开同样的链接，网站就自动找到了局域网中的设备，我测试直接从 macOS 上发送文件，在 Android 上立即就收到了发送的文件。

我测试发送一个大文件，虽然没有跑满全部的局域网带宽，但因为 WiFi 传输的原因，也能维持在 3+M/s 的速度，一个 600+M 的文件，传输的时间也在接受的范围内。

![D3qh](https://photo.einverne.info/images/2023/07/26/D3qh.png)

## 技术原理

好奇这个网站是如何实现的，但好在这个网站是[开源](https://github.com/blenderskool/blaze)的，并且作者在 README 中也提到了网站使用的技术 ---- [[WebTorrent]] 和 [[WebSocket]]，文件分享通过 WebTorrent 建立点对点的连接（内部使用 WebRTC）这意味着文件的传输是不需要经过中间服务器的，直接在发送者传输到接受者。需要注意的是这个地方 WebTorrent 其中有一个 Torrent，如果看过我之前的 [BitTorrent 协议](https://blog.einverne.info/post/2020/02/everything-related-about-bittorrent-and-pt.html) 一文的读者应该会对这个协议比较了解，WebTorrent 是一个纯 Web 的实现，但是和 BitTorrent 协议一样 tracker 服务器不存储任何文件，只存储 metadata 和必要的文件描述，节点信息等。
