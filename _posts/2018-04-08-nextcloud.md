---
layout: post
title: "私人网盘 NextCloud"
tagline: ""
description: ""
category: 经验总结
tags: [linux, nextcloud, dropbox, file-sharing, self-host]
last_updated: 
---

NextCloud 就不多介绍了，把他看成一个 Dropbox 的私人托管版本，相比于将数据交给 Dropbox ，NextCloud 则需要自己负责自己数据的安全。这里记录下使用过程中的一些问题吧。

## 安装
推荐使用 Docker compose 来[安装](https://github.com/einverne/dockerfile/tree/master/nextcloud) 熟悉 Docker 的情况下，基本上是一键安装的。

    docker-compose up -d

然后享受 NextCloud 带来的极速体验吧。

## 关于插件
虽然默认 NextCloud 自带的插件已经非常丰富了，但是有些功能还是需要一些插件才能完成，幸好 NextCloud 的插件库已经非常丰富，直接admin后台点击安装即可。我在使用过程中，发现视频，文档都可以预览，而 mp3 文件点击之后竟然直接给下载了，所以找到了 audioplayer 这样一个插件，可以让我在线预览歌曲。

而关于其他的安全的，媒体的很多插件都可以在插件库或者应用库中找到。二步验证的推荐按上。

## 关于客户端
除了 Dropbox 那么良心，所有平台都提供客户端之外，我也只有见到 NextCloud 那么良心提供全平台的同步客户端了。

    sudo add-apt-repository ppa:nextcloud-devs/client
    sudo apt-get update
    sudo apt install nextcloud-client

PPA 中安装，也可以直接下载 [AppImage](https://nextcloud.com/install/#install-clients)。其他两个平台就直接安装就行。

来最后给大家分享一首歌: <https://nc.einverne.info/s/SbN7zYBKiHMeWs5>


