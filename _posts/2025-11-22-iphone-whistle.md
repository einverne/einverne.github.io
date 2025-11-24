---
layout: post
title: "iPhone/iOS 利用 Whistle 代理抓包"
aliases:
  - "iPhone/iOS 利用 Whistle 代理抓包"
tagline: ""
description: ""
category: 经验总结
tags: [经验总结, whistle, iphone, ios, ]
create_time: 2025-11-23 21:43:28
last_updated: 2025-11-23 21:43:28
dg-home: false
dg-publish: false
---

之前的一篇文章当中介绍过 [Whistle](https://blog.einverne.info/post/2023/04/whistle-debugging-proxy.html) 这样一款非常强大的网络代理和抓包工具，我们可以轻松的利用 Whistle 实现系统级别的抓包。在之前的一篇视频当中，我介绍过如何在桌面版，比如说 macOS 和 windows 当中利用 Whistle。本文再来介绍一下如何在 iOS/iPhone 上利用 Whistle 进行抓包。

## 必要条件

如果要使用 Whistle 进行抓包，必须满足如下的条件：

- iPhone 和桌面端必须在同一局域网
- 需要手机设置 WiFi 代理
- 手机上需要下载 安装 root CA 证书

## 操作步骤

首先，按照我上一篇文章当中介绍的[内容](https://blog.einverne.info/post/2023/04/whistle-debugging-proxy.html)，在本地安装并打开 Whistle。

使用 `ifconfig` 查看 macOS 的本地 IPv4 地址，或者在电脑的网络偏好设置，查看本机的 IP。

比如电脑的 IP 为 `192.168.2.100` (举例，根据自身的情况有所不同)。

然后检查 Whistle 代理设置

![S3eAClWiOA](https://pic.einverne.info/images/S3eAClWiOA.png)

比如我默认的配置是 8888，那么我们就需要设置 iPhone 的 WiFi 代理为 192.168.2.100:8888

设置了 WiFi 代理之后，我们需要在 Safari 中输入 rootca.pro 下载并安装证书。

Safari 中访问 rootca.pro 之后，会下载证书，然后提醒用户到系统设置中配置 Profile。

打开系统设置，会看到用户的信息下方出现新的 Profile，设置信任。然后在系统的证书信任设置当中，就会有一个 Whistle 的信任证书。

我们在手机上任意访问一个网站，就可以在 Whistle 上看到请求了。

然后我们需要在电脑上安装证书。在 macOS 上访问 http://localhost:8888/  然后根据提示下载证书。将下载的证书拖到 Keychain 中。我们要让该证书成为受信任的根证书。找到拖入的证书（以 whistle 开头的那个），右键，显示简介，信任，始终信任。

做好了上面的设置之后，iOS 上安装的证书还不是受信任的根证书，虽然证书显示已验证，但是我们需要到设置 -> 关于本机 -> 证书信任设置里对针对根证书启用完全信任。