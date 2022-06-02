---
layout: post
title: "威联通折腾篇十七：Docker 安装的 NextCloud 升级、备份及恢复"
aliases: "威联通折腾篇十七：Docker 安装的 NextCloud 升级、备份及恢复"
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

## 从 17 升级到 18 版本

使用同样的方式，将 NextCloud 从 17 版本升级到 18 版本。

访问 ip/status.php 会看到：

	{"installed":true,"maintenance":true,"needsDbUpgrade":true,"version":"18.0.11.2","versionstring":"18.0.11","edition":"","productname":"Nextcloud","extendedSupport":false}

### 升级过程中发现数据库表字段问题

报错内容：

> InvalidArgumentException: Column name "oc_flow_operations"."entity" is NotNull, but has empty string or null as default.

解决方法，见 [issue](https://github.com/nextcloud/server/issues/23174)，因为我使用的是 MariaDB  所以：

	alter table oc_flow_operations add column entity character varying(256) not null;

如果是其他数据库可能需要对应的 SQL 语句。

## 从 18 版本升级到 19 版本

从 NextCloud 18 升级到 NextCloud 19 没有遇到什么坑。


## 从 19 版本升级到 20.0

将 Nextcloud docker 镜像升级到 20.0 没有遇到问题。

## 从 20.0 升级到 21

同样也没有遇到问题。

