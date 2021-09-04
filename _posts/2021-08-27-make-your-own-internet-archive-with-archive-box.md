---
layout: post
title: "使用 Archive Box 制作自己的互联网存档"
aliases: 
- "使用 Archive Box 制作自己的互联网存档"
tagline: ""
description: ""
category: 经验总结
tags: [ archive, web-archive, archive-box, docker, linux, notes ]
last_updated:
---

在很多年前，我经常听到一句话----互联网是有记忆的----当然这么多年过去了，见过了无数的网站关停，也见到了中文互联网上无处不在的删贴，而常常上一秒才看过的内容之后便再也找不到。我的 WizNote 笔记中曾经摘录的豆瓣书评、影评，当我想再去看一下作者的状态的时候，大多评论已经找不到了。有的时候拿着网页 URL，还能从 [Internet Archive](https://archive.org/) 找到有幸被保存下来的珍贵文字，但那些还没有被爬虫，或Google索引的文章就这样从互联网上消失了。而这些被删除的内容里面有一些内容却值得被记住，那些发人深省的话值得被再一次阅读。

而这两天正好买了[hosthatch](https://hosthatch.com/a?id=2135) 2核8G的VPS，在调查可以部署哪些服务的时候看到了 [Archive Box](https://github.com/ArchiveBox/ArchiveBox)。这是一个可供个人搭建的互联网存档，它可以用来记录网页链接、媒体资源等等，只需要提供一个链接便可以得到截图，PDF，影评，视频等等内容。完全可以还原当时的网页情况。

## Docker install
Archive Box 使用 Python 编写，所以可以直接用 pip 安装，不过个人还是推荐用官方提供的镜像 Docker 安装。

使用 Docker compose 来安装，可以参考[我的配置](https://github.com/einverne/dockerfile/blob/master/archivebox/docker-compose.yml) 或直接参考[官方的文档](https://github.com/ArchiveBox/ArchiveBox)。

## 添加存档

### 在网页中添加
Archive Box 在启动之后会提供一个 HTTP 服务，我配置了一个域名 <https://box.einverne.info> 在界面上使用 + 号即可添加。

### 在手机上快速添加网址
虽然官方已经提供了非常多的添加方式，包括命令行，网页，桌面版，甚至 Python API，但是目前 RESTful 的接口暂时还是 alpha 阶段，所以在手机上目前也只能用网页版来保存。

如果有发现更好的方法欢迎告知。

## 查看存档
我使用 Docker 安装，将其数据映射到了 `${DATA_PATH}` 目录中，然后使用 Syncthing 同步了，这样在这个目录中直接访问 `index.html` 即可在本地打开备份的网页。


## 延伸阅读

- [Hunchly](https://hunch.ly/)，这是一款可以自动记录访问过的所有网页的工具，非常强大但是需要付费。