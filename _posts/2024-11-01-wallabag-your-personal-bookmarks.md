---
layout: post
title: "Wallabag 个人的网站收藏工具"
aliases:
- "Wallabag 个人的网站收藏工具"
tagline: ""
description: ""
category: 产品体验
tags: [self-hosted, docker, docker-compose, bookmark, chrome-extension, read-it-later, omnivore, readwise, pocket, instapaper]
create_time: 2024-11-15 21:05:17
last_updated: 2024-11-15 21:05:17
dg-home: false
dg-publish: false
---

Wallabag 是一款开源的 PHP 编写的稍后阅读应用，我自己使用了很多年了，但是忘记在博客里面记录一下了，虽然本地 Obsidian 中还有很多笔记，但是忘记整理发出来了，正好这两天分享发现的新一款稍候阅读和书签管理工具 [hoarder](https://blog.einverne.info/post/2024/11/hoarder.html)，然后就顺带提到了 Wallabag。

在视频中也提到了目前 Wallabag 使用的过程中没有遇到任何的问题，唯一可能不满意的就是其百年不变的界面，但是这个对我而言不算是问题。

Wallabag 可以自托管，配置完了之后可以非常轻松地保存网页的内容，并且 Wallabag 允许将文字图片都离线备份下来，这样不管以后文章被删除了，或者地址变更了，我都可以在 Wallabag 中找到我想要的内容。

## 功能

- Wallabag 会自动将网页正文内容提取，并且去除掉广告等无关的信息
- 跨平台支持，提供 Web 界面，移动应用，丰富的 API 接口，还有各种语言的 SDK [[wallabag-python-client]]
- 同步和分享功能，支持跨设备同步
- 通过 RSS 订阅源来分享阅读列表
- 标签和检索功能
- 离线阅读模式，可以在完全离线的情况下阅读文章
- 数据隐私和安全，完全掌握自己的数据，可以自行部署在服务器

## 安装

Wallabag 提供了多种安装方式，包括 Docker 容器化安装，支持 SQLite，MariaDB/MySQL，PostgreSQL 等等数据库。

我推荐直接使用 docker-compose 安装，可以访问我的[配置](https://github.com/einverne/dockerfile/tree/master/wallabag)

```
git clone https://github.com/einverne/dockerfile.git
cd wallabag
# cp env .env
docker-compose up -d
```

## 使用注意

### 禁止用户注册

为了防止实例泄漏被恶意注册，可以禁止新用户注册。在 Docker 安装的时候增加环境变量

```
- SYMFONY__ENV__FOSUSER_REGISTRATION=false
```

### 本地图片文件

如果发现收藏的文章图片无法加载，可以查看一下 Wallabag 的日志，如果发现权限问题，那么需要调整一下挂载本地的文件夹权限：

```
sudo chown -R nobody:nogroup ~/wallabag/
```

### 升级后无法登录

如果升级之后无法登录，报错

> Authentication request could not be processed due to some problem

可以执行如下的命令来迁移数据库。

```
docker-compose exec wallabag /var/www/wallabag/bin/console doctrine:migrations:migrate --env=prod --no-interaction
```
