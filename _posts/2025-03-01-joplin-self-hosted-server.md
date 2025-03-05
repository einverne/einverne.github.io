---
layout: post
title: "搭建 Joplin 同步服务器"
aliases:
- "搭建 Joplin 同步服务器"
tagline: ""
description: ""
category: 经验总结
tags: [joplin, self-hosted, file-syncing]
create_time: 2025-03-03 17:29:52
last_updated: 2025-03-03 17:29:52
dg-home: false
dg-publish: false
---

在我的博客上很久之前我介绍过 Joplin，不过我自己只在 Linux，Android 上用过一段时间，后来出现了 Obsidian ，就切换到 Obsidian 了，但是最近看到一篇文章介绍了如何自建一个 Joplin 同步服务器，这样就可以直接无缝地进行同步数据了。之前 Joplin 只是开放了 [[WebDAV]] 协议的访问协议用可以用来同步。

介于由于部分小伙伴嫌弃 Obsidian 闭源，那不妨试试这一款完全开源的 Joplin。

## 什么是 Joplin

Joplin 是一个开源的笔记，以及 Todo 管理应用，可以在 Windows，macOS，Linux ，Android 和 iOS 上使用。

本次要介绍的 Joplin Server 就是用来给 Joplin 提供同步服务，并且实现加密传输的一个方案。

一旦自己托管了 Joplin Server 之后，就可以直接一键分享笔记到网页上。

## 安装

可以使用 Docker Compose 来安装，可以根据我的[配置](https://github.com/einverne/dockerfile)。

```
version: '3'

services:
    db:
        image: postgres:15
        volumes:
            - /docker/joplindb:/var/lib/postgresql/data
        ports:
            - "5432:5432"
        restart: unless-stopped
        environment:
            - POSTGRES_PASSWORD=postgres
            - POSTGRES_USER=postgres
            - POSTGRES_DB=joplin
    app:
        image: joplin/server:latest
        depends_on:
            - db
        ports:
            - "22300:22300"
        restart: unless-stopped
        environment:
            - APP_PORT=22300
            - APP_BASE_URL=https://websiteurl.com
            - DB_CLIENT=pg
            - POSTGRES_PASSWORD=postgres
            - POSTGRES_DATABASE=joplin
            - POSTGRES_USER=postgres
            - POSTGRES_PORT=5432
            - POSTGRES_HOST=db
            - MAILER_ENABLED=1
            - MAILER_HOST=smtp.gmail.com
            - MAILER_PORT=465
            - MAILER_SECURE=1
            - MAILER_AUTH_USER=youremail@gmail.com
            - MAILER_AUTH_PASSWORD=Y0urP@ssw0rd
            - MAILER_NOREPLY_NAME=Joplin
            - MAILER_NOREPLY_EMAIL=email@email.com

volumes:
  joplindb:
```

## 优势

我之前也提到过我使用 [NextCloud](https://blog.einverne.info/post/2020/02/nextcloud-with-joplin-integration.html) 搭配 Joplin 使用，也可以同步笔记，但是相较于 Joplin Server，还是有一些缺陷。

Joplin Server

- 同步更快
- 可以分享一个链接，任何人都可以访问
- 可以直接和同一个 Server 上的人分享文档
- 可以管理 Joplin Server 上的用户
