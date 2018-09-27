---
layout: post
title: "让网站在分享时预览更美观"
tagline: ""
description: ""
category: 学习笔记
tags: [website, html, meta, share, preview]
last_updated:
---

在最近用 Telegram 分享网页的时候，Telegram 会预先抓取网页形成一个缩略预览，但是如果是自己的网站没有适配一些 meta 信息，抓取出来的信息就非常不堪入目。所以优化一下网站在分享的时候的预览图，这个术语叫做 `Rich Previews`，想查看网站是否已经优化好，可以查看下面的网站：

- <http://richpreview.com/>

想要好看的预览需要如下的标签

- `Title` 最长 65 个字符，否则 Google 结果就会被截断
- `Meta description` 最好小于 155 字符
- `og:title` 最好不超过 35 个字符，否则预览会截断
- `og:description` 65 字符
- `og:url` 页面 url
- `og: image` JPG 或者 PNG，最小分辨率 300 × 200 像素
- `favicon` 网站 logo， 32 × 32 像素

上面的网站目前支持很多聊天工具，比如 WhatsApp, Telegram, Skype ，还有社交网站 Facebook，Twitter 等等。

举例

    <title>Rich Link Preview</title>
    <meta name="description" content="Also want these pretty website previews?" />
    <meta property="og:title" content="Rich Link Preview" />
    <meta property="og:description" content="Also want these pretty website previews?" />
    <meta property="og:url" content="http://richpreview.com/" />
    <meta property="og:image" content="http://richpreview.com/richpreview.jpg" />
    <link rel="shortcut icon" href="http://richpreview.com/favicon.ico" type="image/x-icon" />

这些标签的定义都在 <http://ogp.me/> 这个网站上，只要遵循这个 The Open Graph protocol 协议基本上能搞定大部分的网站。

## reference

- <https://medium.com/@richardoosterhof/how-to-optimize-your-site-for-rich-previews-527ed13a6d69>
