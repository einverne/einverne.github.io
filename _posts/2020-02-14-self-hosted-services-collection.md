---
layout: post
title: "自架的服务整理"
aliases: "自架的服务整理"
tagline: ""
description: ""
category: 整理合集
tags: [collection, self-hosting, self-hosted, file-manager, rss, rss-reader, ]
last_updated:
---

这篇文章主要整理比较流行的可以自建的服务，按照功能分类，我并没有每一个服务都尝试，但基本上每个功能下都有一个服务在跑着。

很多搭建教程都已经在之前的文章中有提到，所以这篇文章不会具体展开搭建过程，主要用来记录一下，并在各个服务之间做一个简单的比较，以及我选择的理由。

本文不可能囊括很多内容，GitHub 上有一个 [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) repo, 里面详细记录着开源的许许多多的优秀自建项目，本文为涉及到的内容可以自行参考该项目。另外这个项目也是一个学习的好地方，每一个开源项目都标注着实现语言，如果想要系统的学习某一个实现这里也是不错的选择。

有很多自建成本比较高，比如自建 SMTP 邮件服务，虽然也有比较成熟的方案，MailCow,Mailu 等等，但本文不再展开。

## DNS
自建家用的 DNS 服务，有两个不错的开源选择：

- Pi-hole
- AdGuard Home

Pi-hole 相较于普通用户使用稍微复杂一些，但是功能强大。

Pi-hole, A black hole for Internet advertisements

- <https://pi-hole.net/>

而 AdGuard Home 是 AdGuard 推出的开源的 DNS 去广告系统。

- <https://github.com/AdguardTeam/AdGuardHome>

## 博客类
具体来说，是 CMS，内容管理平台

### Lektor
Python 编写的静态网站生成器。

- <https://www.getlektor.com/>

#### Lektor Atom Plugin

- <https://github.com/nixjdm/lektor-atom>

### WordPress
WordPress 自然不用多说，PHP 编写。

### Jekyll
Jekyll 算是静态页面生成器，不过也能用来当作博客系统。

### Typecho
Php 站的又一个选择，比较轻量小巧，但是功能强大。

- <https://github.com/typecho/typecho>

## RSS 阅读器
自从 Google Reader 关闭后，就一直用的 InoReader，完全没有任何问题，不过因为买了 NAS，就索性把 RSS 也自建了一个。数据在自己的数据库里面还是很安心的。我选用的是时间最久，功能比较稳定的 Tiny Tiny RSS. 当然也还有 FreshRSS，miniflux，NewsBlur 等可以选择。

Tiny Tiny RSS 和 FreshRSS 都是 PHP 编写的，[[miniflux]] 比较新是 Go 写的，NewsBlur 则是 Python.

更多自建的方案可以参考[这篇文章](/post/2020/02/self-hosted-rss-reader.html)。

## 代码托管
代码托管除了非常著名的 GitLab，其实还有很多选择，比如 Go 编写的 Gogs，以及它的 fork, [Gitea](https://gitea.io/)。个人在 NAS 上用的 Gogs，不过要我现在再选，我可能会用 Gitea.

## CI

- [drone](https://drone.io/)

## 容器管理

- [portainer](https://www.portainer.io/)

## 文件管理
文件管理及同步，我使用 NextCloud，没使用 NextCloud 之前，我使用 Dropbox 作为同步工具。

和 NextCloud(ownCloud) 类似的也还有 FileRun, seaFile 等

和 NextCloud 中心化不同的另一个文件同步 [Syncthing](/post/2019/10/syncthing.html) 也要强烈推荐，自己架设都比较简单。

### 下载类
下面这些工具都因为可以下载种子而被人所知，不过也可以用来分享文件的。

- Transmission
- qTorrent
- ruTorrent

上面这几个都能找到对应的 Docker image.

### ruTorrent

- <https://hub.docker.com/r/linuxserver/rutorrent>
- <https://github.com/romancin/rutorrent-flood-docker>

### YouTube 视频下载
youtube-dl

## Self host IFTTT

n8n.io

- <https://n8n.io/>

Huginn 也是一个不错的 IFTTT 开源代替品。
[[2019-01-11-huginn]]


## 稍后阅读
开源版本的稍后阅读，[wallabag](https://wallabag.org/en) 。

可以用来代替 Pocket 和 Instapaper。


## 网站收藏

- [shaarli](https://github.com/shaarli/Shaarli)

## Anki 同步服务器

- [anki-sync](https://github.com/matbb/docker-anki-sync-server)

## 电子书管理

### Calibre-web
Calibre-web

- <https://github.com/janeczku/calibre-web>
- <https://github.com/Technosoft2000/docker-calibre-web>

### LazyLibrarian

- <https://lazylibrarian.gitlab.io/rss/>

## 图片管理类
主要是对图片的管理，比较著名的是 [Chevereto](/post/2018/01/chevereto-self-hosted-photo-sharing.html)。

其他图床

- [lsky-pro](https://github.com/wisp-x/lsky-pro) PHP
- [auxpi](https://github.com/aimerforreimu/auxpi) Go

### Lychee

官网地址：

- <https://lychee.electerious.com/>
- <https://hub.docker.com/r/80x86/lychee>

## 备份

### Duplicati
通过 FTP, SSH, WebDAV 协议备份，或者将文件备份到云端 Backblaze B2, Microsoft OneDrive, Amazon S3, Google Drive, box.com, Mega, hubiC 等。

- <https://www.duplicati.com/>

### Syncthing
Syncthing 是我对比了一系列的同步工具之后选择的，基本上已经满足了我日常所有的需求。

## Translate tool

### Weblate

- <https://weblate.org/en/>

Docker composte 安装

- <https://github.com/WeblateOrg/docker-compose>

## 搜索导航类
anyi 导航、聚合搜索、webstack

### geek-navigation

- <https://github.com/geekape/geek-navigation>

### onenav

- <https://github.com/helloxz/onenav>

## 服务器监控
雅黑探针、云探针、[netdata](https://github.com/netdata/netdata)


## Other

### Instagram scraper
批量下载 Instagram
 
	touch ig_args.txt ig_users.txt
	docker run -d \
		-v $(pwd)/download:/download \
		-v $(pwd)/ig_args.txt:ig_args.txt \
		-v $(pwd)/ig_users.txt:ig_users.txt \
		shyd/instagram-scraper


### youtube-dl

- <https://hub.docker.com/r/kmb32123/youtube-dl-server>