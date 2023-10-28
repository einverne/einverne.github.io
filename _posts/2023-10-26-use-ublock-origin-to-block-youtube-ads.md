---
layout: post
title: "使用 uBlock Origin 拦截 YouTube 广告"
aliases:
- "使用 uBlock Origin 拦截 YouTube 广告"
tagline: ""
description: ""
category: 经验总结
tags: [youtube, ublock, ublock-origin, ads, chrome, chrome-extension]
create_time: 2023-10-28 14:40:14
last_updated: 2023-10-28 14:40:14
---

之前一直在 Chrome 下观看 YouTube， 通过广告屏蔽插件，基本上可以看不到 YouTube 的贴片广告， 但是最近 Google 更新了 YouTube 的广告屏蔽插件监测，应该是最新的 Chrome 上线了一些新的特性能让 Google 做到，所以一系列的广告拦截插件都纷纷失效了。但是简单的搜索了一下之后发现，uBlock Origin 还能正常拦截广告。

虽然我也一直安装了 uBlock Origin，之前也[推荐过](/post/2023/08/ublock-origin.html)，但是我忘记更新它的过滤规则，所以导致 YouTube 还是会出现广告弹窗，并且不让继续观看视频。

[uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm) 是一款广告拦截插件，可以帮助用户屏蔽 YouTube 上的广告。以下是使用 uBlock Origin 来屏蔽 YouTube 广告的步骤：

## 未安装的情况

如果未安装首先要 Chrome Extension Store 中安装 [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm) 。然后到插件设置中更新规则。

- 安装完成后，在 Chrome 浏览器的右上角会出现 uBlock Origin 的图标。点击该图标以打开 uBlock Origin 设置界面。
- 在 uBlock Origin 设置界面中，找到“我的过滤列表”选项卡，并确保启用了 EasyList、Peter Lowe's Ad server list 和 EasyPrivacy 等常用过滤列表。这些过滤列表将帮助屏蔽广告。

## 已经安装的情况

打开设置，然后按照下面截图中的步骤更新规则。

![X0cL](https://photo.einverne.info/images/2023/10/28/X0cL.png)

## 检查是否有效

可以通过如下的网站来检查当前是否可以拦截 YouTube 的广告。

- <https://drhyperion451.github.io/does-uBO-bypass-yt/>
