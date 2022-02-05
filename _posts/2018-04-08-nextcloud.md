---
layout: post
title: "私人网盘 NextCloud"
aliases: 
- "私人网盘 NextCloud"
tagline: ""
description: ""
category: 经验总结
tags: [linux, nextcloud, dropbox, file-sharing, file-syncing, self-host]
last_updated:
---

NextCloud 就不多介绍了，把他看成一个 Dropbox 的私人托管版本，相比于将数据交给 Dropbox ，NextCloud 则需要自己负责自己数据的安全。这里记录下使用过程中的一些问题吧。

## 安装
推荐使用 Docker compose 来[安装](https://github.com/einverne/dockerfile/tree/master/nextcloud) 熟悉 Docker 的情况下，基本上是一键安装的。

    docker-compose up -d

然后享受 NextCloud 带来的极速体验吧。

## 关于调试
NextCloud 的日志可以在这里查看：

	tail nextcloud/data/nextcloud.log

## 关于插件
虽然默认 NextCloud 自带的插件已经非常丰富了，但是有些功能还是需要一些插件才能完成，幸好 NextCloud 的插件库已经非常丰富，直接 admin 后台点击安装即可。我在使用过程中，发现视频，文档都可以预览，而 mp3 文件点击之后竟然直接给下载了，所以找到了 audioplayer 这样一个插件，可以让我在线预览歌曲。

而关于其他的安全的，媒体的很多插件都可以在插件库或者应用库中找到。二步验证的推荐安装。

## 关于使用
NextCloud 的权限管理已经非常详细了，公开分享，私密密码分享，过期时间，完全能够满足所有的分享需求，在看使用 Manual 的时候，发现 NextCloud 和 Dropbox 一样可以设置一个公开文件夹，然后别人可以通过该文件夹来给你上传文件，这个也是非常不错的了。

## 关于客户端
除了 Dropbox 那么良心，所有平台都提供客户端之外，我也只有见到 NextCloud 那么良心提供全平台的同步客户端了。

    sudo add-apt-repository ppa:nextcloud-devs/client
    sudo apt-get update
    sudo apt install nextcloud-client

PPA 中安装，也可以直接下载 [AppImage](https://nextcloud.com/install/#install-clients)。其他两个平台就直接安装就行。

来最后给大家分享一首歌：<https://nc.einverne.info/s/SbN7zYBKiHMeWs5>

## 手动安装

如果要手动安装，那么就需要依赖一些服务：

- nginx
- PHP 7.0+
- MySQL 5.7

	sudo apt install php7.2 php7.2-cli php7.2-common php7.2-curl php7.2-fpm php7.2-gd php7.2-zip php7.2-mbstring php7.2-mysql

### 下载合适的版本

- <https://download.nextcloud.com/server/releases/>

## 监控
NextCloud 提供一个监控的地址，可以用来外部监控 NextCloud 运行状态：

	http://[ip]:[port]/ocs/v2.php/apps/serverinfo/api/v1/info?format=json

返回信息中包含很多有用信息，比如服务器当前状态，运行的 NextCloud 版本，存储剩余空间，分享数据， web 服务器版本，数据库版本等等。

## 延伸阅读
同类型的工具还有 OwnCloud，Seafile, CloudReve 可以根据自己的偏好选择一个即可。

## 总结
因为所有的数据都需要自己来保管安全，所以一方面要做到服务器的安全，另一方面也要保证 NextCloud 的安全，到目前为止，我还是依然使用 Dropbox 作为主要个人存储同步，NextCloud 作为 backup。如果你从来没有听说过 Dropbox 那么可以使用我的邀请 <https://db.tt/isyvu6ny> 来注册，你我都可以多得 500M 空间。对我而言这 500M 的空间远比某盘 1T 的空间要重要的多。如果你认为 Dropbox 仅仅是一个同步盘的话，请参考下[这篇](/post/2015/07/dropbox-tips.html) 文章，你不仅能够拿 Dropbox 来托管静态文件，甚至可以借用 IFTTT 来完成很多意想不到的事情。

## reference

- <https://docs.nextcloud.com/server/13/admin_manual/installation/source_installation.html#ubuntu-installation-label>
