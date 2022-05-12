---
layout: post
title: "图片压缩工具 Squoosh 离线版"
aliases: 
- "图片压缩工具 Squoosh 离线版"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, linux, application, squoosh, google, electron, google-chrome, image, image-compress, ]
last_updated:
---

[Squoosh](https://squoosh.app/) 是 Google 推出的一个图片压缩工具。之前整理[macOS 初始化设置](/post/2020/07/macbook-pro-initial-setup.html) 的时候就说过，基本上算是必不可少的一个压缩工具了。

如果要大批量压缩图片，之前也介绍过 [jpegoptim 和 optipng](/post/2018/06/optimize-and-compress-jpeg-and-png-using-command.html)。

如果要实现更加高阶的图片操作，比如 resize, blur, crop, despeckle, dither, drow on, flip, join, re-sample 等等，也可以了解一下 [[ImageMagick]]。

但使用 Squoosh 的过程中有一点不方便的就是 Google 只提供了在线版，之前也在 issue 中提过，官方回复是本来这个工具就是命令行的一个在线化，没有必要再搞一个离线的版本。

但最近发现 GitHub 上有人做出了一个离线版本的 Squoosh。

- <https://github.com/matiasbenedetto/squoosh-desktop-app>

离线版本的 Squoosh 基于 Electron，并使用了 GoogleChromeLabs 之前开源的在线版。

