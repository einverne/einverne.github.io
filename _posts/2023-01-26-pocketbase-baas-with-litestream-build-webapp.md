---
layout: post
title: "Go 语言编写的 BaaS：PocketBase 简单介绍"
aliases:
- "Go 语言编写的 BaaS：PocketBase 简单介绍"
tagline: ""
description: ""
category: 产品体验
tags: [ pocketbase, baas, self-hosted, litestream, linux ]
create_time: 2023-01-13 12:17:59
last_updated: 2023-03-13 04:19:29
---

[PocketBase](https://github.com/pocketbase/pocketbase) 是一个 Go 编写的开源后端 [[BaaS]] Backend-as-a-Service，只用了一个二进制文件就可以实现：

- 内嵌的 SQLite 数据库
- Auth 管理
- 内置的文件存储和用户管理
- 方便的 Admin 管理面板（Dashboard） 管理所有的资源
- 简单的 REST-ish API

官网：<https://pocketbase.io/>

所以基本上用户可以通过 PocketBase 来作为应用的后台，比如说要用[[Nuxt.js]] 写一个网站，可以不用写后端服务器代码，而直接使用 PocketBase。

![20in](https://photo.einverne.info/images/2023/03/13/20in.jpg)

PocketBase 的 SQLite 可以搭配 [[Litestream]] 一起使用。

[Litestream](https://litestream.io/) 是一个使用 Go 编写的，用于 SQLite 数据库流式复制的工具。它作为一个单独的后台进程运行，并不断地从磁盘上复制写前日志页到一个或多个副本。 这种异步复制提供了类似于 Postgres 或 MySQL 等数据库服务器的灾难恢复。 SQLite 有一个名为"WAL"（预写日志）的日志模式。

PocketBase 和 Litestream 都只需要非常少的资源，完全可以在 512 MB 内存的 VPS 上运行。
