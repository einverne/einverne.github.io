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

本文不可能囊括很多内容，GitHub 上有一个 [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) repo，里面详细记录着许许多多开源的优秀自建项目，本文为涉及到的内容可以自行参考该项目。另外这个项目也是一个学习的好地方，每一个开源项目都标注着实现语言，如果想要系统的学习某一个实现这里也是不错的选择。

有很多自建成本比较高，比如自建 SMTP 邮件服务，虽然也有比较成熟的方案，比如 MailCow，Mailu 等等，但因为涉及内容比较复杂本文不再展开。后续如果有机会的话再展开。

## DNS
自建家用的 DNS 服务，有两个不错的开源选择：

- [Pi-hole](https://pi-hole.net/)，A black hole for Internet advertisements
- [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome)，AdGuard Home 是 AdGuard 推出的开源的 DNS 去广告系统

Pi-hole 相较于普通用户使用稍微复杂一些，但是功能更强大。AdGuard Home 则在界面设计和使用使用层面更加便于使用。

## 代码

[code-server](https://github.com/cdr/code-server)

## 博客类
具体来说，是 CMS，内容管理平台

- [[WordPress]]，老牌的 CMS 管理平台，PHP 编写。
- [[Jekyll]]，Ruby 编写的静态页面生成器，也可以作为博客系统使用。
- [Lektor](https://www.getlektor.com/)，Python 编写的静态网站生成器。
    - [Lektor Atom Plugin](https://github.com/nixjdm/lektor-atom)
- [[Typecho]]，[Typecho](https://github.com/typecho/typecho) PHP 建站的又一个选择，比较轻量小巧，但是功能一样强大。

## RSS 相关

- [RSSHub](https://github.com/DIYgod/RSSHub) 将不带 RSS 输出的内容生成 RSS
- [RSS-Bridge](https://github.com/RSS-Bridge/rss-bridge)，一款 PHP 编写的转成 RSS 输出的工具
- [Full Text RSS](https://hub.docker.com/r/heussd/fivefilters-full-text-rss)

## RSS 阅读器
自从 Google Reader 关闭后，就一直用的 InoReader，完全没有任何问题，不过因为买了 NAS，就索性把 RSS 也自建了一个。数据在自己的数据库里面还是很安心的。我选用的是时间最久，功能比较稳定的 Tiny Tiny RSS. 当然也还有 FreshRSS，miniflux，NewsBlur 等可以选择。

Tiny Tiny RSS 和 FreshRSS 都是 PHP 编写的，[[miniflux]] 比较新是 Go 写的，NewsBlur 则是 Python.

更多自建的方案可以参考[这篇文章](/post/2020/02/self-hosted-rss-reader.html)。

## 代码托管
代码托管除了非常著名的 GitLab，其实还有很多选择，比如 Go 编写的 Gogs，以及它的 fork, [Gitea](https://gitea.io/)。个人在 NAS 上用的 Gogs，不过要我现在再选，我可能会用 Gitea。

- [[Gitea]]
- [[Gogs]]
- [[GitLab]] 更加重的选择

## CI

- [[Jenkins]]
- Gitea Action
- [drone](https://drone.io/)

## 容器管理

- [portainer](https://www.portainer.io/)

## 统计数据

- [[Umami]]
- [Plausible](https://plausible.io/)
- [[Matomo]]
- [[google-analytics-alternative]]

### Umami
[Umami](https://github.com/mikecao/umami) 是一个使用 Node.js 编写可以自建的网站统计系统，作为 CNZZ/Google Analytics 代替品。Umami 相对于 Matomo 较好的一点是没有那么消耗资源，非常轻量，100 M 左右内存就能运行。

### Matomo
- [Matomo](https://matomo.org/) 是一个类似 Google Analytics 的工具

## 邮件服务器
自建 [[邮件服务器]] 是一个比较复杂并且需要长期维护的工作，不仅需要有一个赶紧的 IP，而且需要特别注意多个和邮件相关的协议配置。

- [[mailcow]]，[使用 Mailcow 自建邮件服务器](/post/2022/04/mailcow-email-server.html)
- [[Mailu]]，[使用 Mailu 搭建邮件服务器](/post/2021/07/email-server-mailu.html)
- [[Poste]]
- [maddy](https://github.com/foxcpp/maddy) 是一个用 Go 语言实现的邮件服务器

## 在线粘贴板

- [[hastebin]] 是一个 Node.js 实现的开源版本 pastebin。
- [PrivateBin](https://github.com/PrivateBin/PrivateBin) 是一个开源的，使用 PHP 实现的 pastebin.

## Web archiving
提交链接自动存档页面内容。

- [ArchiveBox](https://github.com/ArchiveBox/ArchiveBox)

## 文件管理
文件管理及同步，我使用 [[NextCloud]]，没使用 NextCloud 之前，我使用 Dropbox 作为同步工具。

和 NextCloud(ownCloud) 类似的也还有 FileRun, seaFile 等

和 NextCloud 中心化不同的另一个文件同步 [Syncthing](/post/2019/10/syncthing.html) 也要强烈推荐，自己架设都比较简单。

多年的使用之后，我选择了 Syncthing 作为唯一的文件同步工具。

### 下载类
下面这些工具都因为可以下载种子而被人所知，不过也可以用来分享文件的。

- [[Transmission]]
- [[qTorrent]]
- [[ruTorrent]]

上面这几个都能找到对应的 Docker image.

### ruTorrent

- <https://hub.docker.com/r/linuxserver/rutorrent>
- <https://github.com/romancin/rutorrent-flood-docker>

### YouTube 视频下载
youtube-dl

这个项目在 youtube-dl 上实现了一个 Web 界面，可以方面的通过请求提交任务：

- <https://hub.docker.com/r/kmb32123/youtube-dl-server>

## 文件分享

### File Browser
File Browser 是一个使用 Go 语言和 Vue 实现的在线文档共享。只依赖于 SQLite 数据库存储最基本的数据。

- <https://github.com/filebrowser/filebrowser>

### FileRun
FileRun 是一个基于浏览器的文件分享和同步工具。兼容 NextCloud 客户端。

- <https://filerun.com/>

## Self host IFTTT

n8n.io 是一个可以自建的 IFTTT 类似的工具，可以实现发生什么之后触发动作，并且支持编程，非常强大。

- <https://n8n.io/>

[[Huginn]] 也是一个不错的 IFTTT 开源代替品。



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
LazyLibrarian is a program to follow authors and grab metadata for all your digital reading needs.

- <https://lazylibrarian.gitlab.io/>

### talebook
这是一个 Calibre 和 Vue 结合的在线图书站点

- <https://github.com/talebook/talebook>

![talebook-20210919083401.png](/assets/talebook-20210919083401.png)


## 图片管理类
主要是对图片的管理，比较著名的是 PHP 编写的 [Chevereto](/post/2018/01/chevereto-self-hosted-photo-sharing.html)。

其他图床

- [sapic](https://github.com/sapicd/sapic) 一款使用 Flask 编写的图床。可存储到又拍云、七牛云、阿里云OSS、腾讯云COS、GitHub、Gitee、S3等，支持自定义扩展。
- [lsky-pro](https://github.com/wisp-x/lsky-pro) PHP
- [auxpi](https://github.com/aimerforreimu/auxpi) Go
- EasyImage
- [Piwigo](https://github.com/Piwigo/Piwigo)
- [Ownphoto](https://github.com/hooram/ownphotos)
- [PhotoPrism](https://github.com/photoprism/photoprism)
- [Lychee](https://github.com/LycheeOrg/Lychee)

### Lychee

官网地址：

- <https://lychee.electerious.com/>
- <https://hub.docker.com/r/80x86/lychee>

### PhotoView


![self-hosted-photoview-20210831103724.png](https://photo.einverne.info/images/2023/01/16/gn4C.png)

- <https://github.com/photoview/photoview>

## 备份

### Duplicati
通过 FTP, SSH, WebDAV 协议备份，或者将文件备份到云端 Backblaze B2, Microsoft OneDrive, Amazon S3, Google Drive, box.com, Mega, hubiC 等。

- <https://www.duplicati.com/>

### Syncthing
Syncthing 是我对比了一系列的同步工具之后选择的，基本上已经满足了我日常所有的需求。

## Translate tool
翻译相关的自建服务，提供了上传文本，协同翻译的能力。

### Weblate

- <https://weblate.org/en/>

Docker composte 安装

- <https://github.com/WeblateOrg/docker-compose>

## VoIP

- teamspeak 3

## 阅后即焚

- [naiveboom](https://github.com/kchown/naiveboom)

## 搜索导航类
anyi 导航、聚合搜索、webstack


### Homer
[[Homer]] 是一个非常简单的静态页面导航网站，可以通过 yaml 配置生成一个漂亮的个人导航页。

![homer-20210826211247.png](/assets/homer-20210826211247.png)

- <https://github.com/bastienwirtz/homer>

### CF-Worker-Dir
这是一个基于 Cloudflare Worker 的导航页面。

![cf-worker-dir-20210831134208.png](/assets/cf-worker-dir-20210831134208.png)

- <https://github.com/sleepwood/cf-worker-dir>


### heimdall
一个非常漂亮的导航站

![heimdall-20210826210930.png](/assets/heimdall-20210826210930.png)

- <https://hub.docker.com/r/linuxserver/heimdall>


### geek-navigation

- <https://github.com/geekape/geek-navigation>

### onenav

- <https://github.com/helloxz/onenav>
- <https://gitee.com/baisucode/onenav>

## 服务器监控

雅黑探针、云探针、[netdata](https://github.com/netdata/netdata)

### nezha 监控（哪吒监控)
哪吒监控是使用 Go 语言和 Vue 实现的一个监控面板，可以轻松地监控 CPU，内存，网速等等。详情可见[文章](/post/2021/08/nezha-monitor.html)。


## 论坛

### Discourse
[[Discourse]] 是由 Stack Overflow 创始人之一的 Jeff Atwood 主导的开源论坛项目。摒弃了传统的话题讨论形式，可以无限加载内容，非常适合桌面端和客户端。Discourse 提供了非常丰富的配置方式，也支持插件扩展。



## Other

[[instagram-scraper]]

