---
layout: post
title: "zlibrary 使用技巧"
aliases:
  - "zlibrary 使用技巧"
tagline: ""
description: ""
category: 经验总结
tags:
  - zlibrary
create_time: 2023-09-10 20:54:00
last_updated: 2023-09-10 20:54:00
---

之前 zlibrary 的域名被取缔也曾经是一度的热门，但是 zlibrary 并没有就此消失。这篇文章就介绍几个继续使用 zlibraray 的小技巧。

![USiN](https://photo.einverne.info/images/2023/09/10/USiN.png)

![UcA2](https://photo.einverne.info/images/2023/09/10/UcA2.png)

## 如何访问 zlibrary

zlibrary 的很多域名都被 sized 了，包括

- https://z-lib.org/ 曾经的站点
- https://singlelogin.me/ 入口登录网站

但是 zlibrary 似乎搜集了很多不同顶级域名，虽然一直在被取缔，但是还一直有可访问的网址。我之前的[文章](/post/2018/02/free-online-books.html) 其实一直再更新。这里就放两个，如果还有更新我一般会更新到之前的文章里面。

- https://singlelogin.re/
- https://z-library.sk/
- http://loginzlib2vrak5zzpcocc3ouizykn6k5qecgj2tzlnab5wcbqhembyd.onion
- https://zh.singlelogin.re/
- https://singlelogin.se
- 或者使用 [Tor 地址](http://loginzlib2vrak5zzpcocc3ouizykn6k5qecgj2tzlnab5wcbqhembyd.onion)
- 下载客户端 https://go-to-zlibrary.se/

如果网站的地址都无法访问了，那么可以通过 Telegram Bot 中的 /weblink 命令来获取最新的网站地址。

## Telegram Bot

在使用自己的账号登录 zlibrary 之后，在我的页面中，可以找到绑定 Telegram Bot 的地方，

登录 zlibrary 之后，点击右上角
![X5DN](https://photo.einverne.info/images/2023/09/25/X5DN.png)


![XR6G](https://photo.einverne.info/images/2023/09/25/XR6G.png)

找到这个 Telegram Bot ，根据这个提示，在 Telegram 中创建 Bot，然后获取 Bot 的 API 。将这个 API 粘贴到网页上。
![XZnM](https://photo.einverne.info/images/2023/09/25/XZnM.png)

或者直接编辑个人页面，找到页面下方的 Personal Telegram bot
![XdJ2](https://photo.einverne.info/images/2023/09/25/XdJ2.png)

## kindle bot

在绑定了 zlib Telegram bot 之后，只要发送书名，就可以返回搜索的书，然后可以将书转发到我写的 KindlePush bot 中，发到 Kindle

- <https://t.me/kindlepush_bot>

初次使用 KindlePush Bot 需要设置一下邮箱和帐户名密码。

## 私人访问链接

使用账号登录 zlibrary 登录之后可以获得两个私人的访问地址，可以保存到收藏夹然后就可以通过这个私人地址去访问了。

## userscript

也可以使用如下的脚本

- https://greasyfork.org/zh-CN/scripts/428894-downloadbookfromipfs

会在界面中添加一个按钮用来在 [[IPFS]] 网络中下载。

![Uv3G](https://photo.einverne.info/images/2023/09/10/Uv3G.png)

通过 IPFS 下载可以不占用 Zlibrary 的配额。

## reference

- [ZLibrary domains have been seized by the United States Postal Inspection Service](https://news.ycombinator.com/item?id=33460970)
- <https://news.ycombinator.com/item?id=32972923>
