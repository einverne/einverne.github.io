---
layout: post
title: "威联通折腾篇十七：Docker 安装的 NextCloud 升级、备份及恢复"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, nextcloud, file-sync, dropbox, backup, restore, mysql, sql]
last_updated:
---


之前有文章写过如何在 Qnap 上使用 Container Station 来安装 NextCloud，之前重度使用 NextCloud，里面已经存了近 70G 的文件内容，这次系统重建后，下载新的镜像，然后重新恢复，费了一番时间，主要是恢复数据库，然后还有本地挂载的文件，以及升级版本。

从备份的角度来看，也正是这三个部分比较重要：

- 数据库备份
- 本地数据备份，也就是 /var/www/html 挂载的目录，我的是 /share/NextCloud
- Docker 镜像备份

以上三个内容，前两个需要完全备份，否则会造成数据丢失。第三个则可以从 Docker Hub 上拉下来。

	docker pull nextcloud:latest

我是从 13.0.4 版本的镜像升级到 14.0.9 版本，升级后重启容器，出现了如下的错误：

	AH00169: caught SIGTERM, shutting down

调查发现，NextCloud 在升级过程中将自己变成了维护状态，这个配置在数据目录下的 `config/config.php` 文件中，打开该文件，搜索 `maintenance`:

	'maintenance' => true

将 true 改成 false, 然后重启容器，即可进入 NextCloud 应用。
