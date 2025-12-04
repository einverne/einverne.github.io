---
layout: post
title: "Docker 安装 PicHome"
aliases:
- "Docker 安装 PicHome"
tagline: ""
description: ""
category: 产品体验
tags: [open-source, php, ]
create_time: 2024-06-25 10:06:01
last_updated: 2024-06-25 10:06:01
dg-home: false
dg-publish: false
---

之前在使用 [[Eagle]] 的时候就想过如果能够一键将本地的素材库分享到网络上就好了，但后面因为 [[Eagle]] 使用的频率不是那么高，我自己也在用 [Chevereto](https://photo.einverne.info) 所以就搁置了。这两天发现一个 PHP 编写的开源的在线图库 [[PicHome]]，看展示界面不错，所以来分享一下。

[PicHome](https://github.com/zyx0814/Pichome) 是一款 PHP 编写的，开源的图片展示网站，可以将电脑中的媒体文件展示在网页中。

## 功能

- 用来展示本地目录中的图片，但不支持编辑
- 比如展示通过 [[Eagle]] ，[[Billfish]] 管理的素材库
- AI 相关的功能
  - AI 修改文件名
  - AI 打标签
  - AI 描述
  - AI 批量标注
  - AI 文件问答

## 要求

- PHP > 7.3
- MySQL
- 磁盘空间 > 10 GB

## Docker 安装

快速尝试

```
docker run -d -p 80:80 --restart=always oaooa/pichome
```

使用 Docker compose 启动

```
git clone https://github.com/zyx0814/Pichome-docker.git
cd ./Pichome-docker/compose/
修改docker-compose.yaml，设置数据库root密码（MYSQL_ROOT_PASSWORD=密码）
docker-compose up -d
```
