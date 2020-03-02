---
layout: post
title: "自架的服务整理"
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

Pi-hole, A black hole for Internet advertisements

- <https://pi-hole.net/>

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

Tiny Tiny RSS 和 FreshRSS 都是 PHP 编写的，miniflux 比较新是 Go 写的，NewsBlur 则是 Python.

## 代码托管
代码托管除了非常著名的 GitLab，其实还有很多选择，比如 Go 编写的 Gogs，以及它的 fork, Gitea。个人在 NAS 上用的 Gogs，不过要我现在再选，我可能会用 Gitea.

## 文件管理
文件管理及同步，我使用 NextCloud，没使用 NextCloud 之前，我使用 Dropbox 作为同步工具。

和 NextCloud(ownCloud) 类似的也还有 FileRun, seaFile 等

和 NextCloud 中心化不同的另一个文件同步 SyncThing 也要强烈推荐，自己架设都比较简单。

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


## 稍后阅读
开源版本的稍后阅读，wallabag .

## 电子书管理

### Calibre-web
Calibre-web

- <https://github.com/janeczku/calibre-web>

### LazyLibrarian

- <https://lazylibrarian.gitlab.io/rss/>

## 图片管理类
主要是对图片的管理，比较著名的是 Chevereto。

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

## Translate tool

### Weblate

- <https://weblate.org/en/>

Docker composte 安装

- <https://github.com/WeblateOrg/docker-compose>

## 搜索导航类
anyi 导航、聚合搜索、webstack

### geek-navigation

- <https://github.com/geekape/geek-navigation>

## 服务器监控
雅黑探针、云探针、[netdata](https://github.com/netdata/netdata)



