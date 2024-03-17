---
layout: post
title: "绕过付费墙"
aliases:
- "绕过付费墙"
tagline: ""
description: ""
category: 经验总结
tags: [bypass-paywalls, chrome-extension, wsj, paywall,]
create_time: 2024-03-16 10:08:38
last_updated: 2024-03-16 10:08:38
dg-home: false
dg-publish: false
---

今天早上看到一篇 WSJ 的分享，但是点进去发现竟然只能看个开头，所以兴起整理一下这篇文章。

## bypass-paywalls

之前我就知道一个叫做 [bypass-paywalls](https://github.com/iamadamdev/bypass-paywalls-chrome) 的插件，但是因为因为[更换电脑](https://blog.einverne.info/post/2023/11/i-bought-mac-mini-and-setup.html) 所以 Chrome 上没有配置，所以立即设置起来。

```
git clone git@github.com:iamadamdev/bypass-paywalls-chrome.git
cd bypass-paywalls-chrome
cd build && sh build.sh
```

然后将此文件夹拖拽到 `chrome://extensions`。

但当我安装完成之后发现，WSJ 可能检测到了该插件，查看 Chrome 的请求，直接返回 401，感觉应该就是检测并且屏蔽了该插件。

## Bypass Paywalls Chrome Clean

于是我就又找了一个插件 [Bypass Paywalls Chrome Clean](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean)，这个插件在原来的插件基础上，增加了一个非常独特的功能，那就是当发现内容已经被 archive.is 等内容缓存的时候，就直接将网页内容替换为缓存的内容，间接实现了绕过付费墙的目的。

Bypass Paywalls Chrome Clean 的安装也非常简单，直接 clone 项目，然后拖拽到 Chrome 即可。

![WW38QjvCqg](https://pic.einverne.info/images/WW38QjvCqg.png)
