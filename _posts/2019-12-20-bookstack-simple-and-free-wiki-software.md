---
layout: post
title: "优秀开源项目推荐：BookStack 一款高效简单的 Wiki 系统"
aliases: "优秀开源项目推荐：BookStack 一款高效简单的 Wiki 系统"
tagline: ""
description: ""
category: 开源项目
tags: [qnap, qnap-tutorial, github, bookstack, docker, open-source, self-host, wiki, ]
last_updated:
---

已经忘记了什么契机，BookStack 就存在了我的 ToDo List 中，一直想要找一款能够快速记录一些常用到的，但是却不太容易记住的东西，原来的方法就是用 markdown + git, 或者如果手边有笔记本，或者手机就记录在 WizNote 中，但这样一来很多内容都散布在各个不同的软件或者应用中，以前也整理过 [gitbook](https://einverne.github.io/gitbook-tutorial/) 但是一直没有那么系统的想要说整理出一本书这样，所以一直依赖还是用这个博客，记录点点滴滴的[学习笔记](/categories.html#学习笔记)。

## Info

GitHub 地址：

- <https://github.com/BookStackApp/BookStack>

开源协议： MIT license

安装依赖条件：

- PHP & Laravel
- MySQL

浏览 BookStack 的[官网](https://www.bookstackapp.com/) 主页上列举了一些 Feature 都是一些非常贴心的功能。

- 完整的权限管理
- WYSIWYG 编辑器，避免了每次我都要 Vim 打开，也使得图片等其他资源管理比较方便
- 搜索，索引，不用每次都要我 [rg](/post/2019/09/ripgrep-recursively-searches-directories-using-regex-pattern.html) 先搜索下在编辑了
- 可订制化，从名字到 Logo，到注册选项，虽然我个人用并用不到
- Optional Markdown Editor，这一点非常舒服
- Multi-lingual, 其实我自己用 EN 就够了，不过有时间也给这个项目翻译一下好了
- 支持不同格式的文件导出，赞

这一些功能集合到一起就像是整合版本的 GitBook，支持多人编辑，还有权限管理，完美的解决了使用 markdown + git 管理当文件太多的情况下管理的不便。基于这些理由，所以就在我的 NAS 上，用 Docker 搞了一个。目前先自己用着记录一些暂时未整理好，或者暂时不能公开的内容吧。

安装的过程也非常简单了，官网给出的教程非常详细了，请参考[官网](https://www.bookstackapp.com/docs/admin/installation/).

## QNAP 上使用 Docker 安装
首先开启 QNAP 上的 MySQL 服务，然后给 bookstack 新建一个数据库 bookstack，并且给 bookstack 这个数据单独创建一个用户 bookstack。然后因为我的 Docker 配置的网关地址是 10.0.3.1 所以就写了宿主机的地址。然后就不用上面提到的教程单独给 BookStack 开一个 MySQL 实例了，共享宿主机的 MySQL 就行了。

使用命令行：

```bash
docker run -d \
  --name=bookstack \
  -e PUID=1000 \
  -e PGID=1000 \
  -e APP_URL=${APP_URL} \
  -e DB_HOST=${DB_HOST} \
  -e DB_USER=${DB_USER} \
  -e DB_PASS=${DB_PASS} \
  -e DB_DATABASE=${DB_DATABASE} \
  -p 6875:80 \
  -v ~/path/to/bookstack_config:/config \
  --restart unless-stopped \
  linuxserver/bookstack
```

使用 `docker-compose`:


	version: "2"
	services:
	  bookstack:
		image: linuxserver/bookstack
		container_name: bookstack
		environment:
		  - PUID=1000
		  - PGID=1000
		  - DB_HOST=10.0.3.1:3306
		  - DB_USER=bookstack
		  - DB_PASS=<password>
		  - DB_DATABASE=bookstack
		volumes:
		  - /share/Container/bookstack_config:/config
		ports:
		  - 6875:80
		restart: unless-stopped

然后等待启动即可。

如果遇到这个问题：

> nc: getaddrinfo: Name does not resolve

可以参考 [stackoverflow](https://stackoverflow.com/questions/54433522/docker-compose-and-postgres-name-does-not-resolve)


