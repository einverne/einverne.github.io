---
layout: post
title: "自建 RSS Reader"
tagline: ""
description: ""
category: 经验总结
tags: [rss, reader, self-hosted, linux, docker, qnap, qnap-tutorial, 威联通 , ]
last_updated:
---

## Stringer
[[stringer]] 是一个可以自行搭建的 RSS Reader，Ruby 编写。Stringer 没有任何社交媒体分享，没有机器学习算法。但有一套快捷键。非常适合构建一个个人的在线阅读体验。

- <https://github.com/stringer-rss/stringer>

## Tiny Tiny RSS
Php 5.6, Postgresql or MySQL

- <https://tt-rss.org/>

Docker 安装，虽然 ttrss 官方给了自己的[解决方案](https://git.tt-rss.org/fox/ttrss-docker-compose)，但似乎刚刚起步，而 [linuxserver/tt-rss](https://github.com/linuxserver/docker-tt-rss) 的镜像因为拿不到 tt-rss tarball 所以也停止更新了。所以最后折中的方案就是用了 [这个镜像](https://github.com/HenryQW/Awesome-TTRSS)

### QNAP 下的 PostgreSQL
App store 中可以直接安装，但实际上 QNAP 只是帮用户默认用 docker-compose 安装好了，不过也还行了，连 phpPgAdmin 也安装了。

查看下文件内容：

	version: '3'

	services:
	  db:
		image: postgres:11.4
		restart: on-failure
		ports:
		  - 5432:5432
		volumes:
		  - ./data:/var/lib/postgresql/data
		environment:
		  - POSTGRES_PASSWORD=postgres

	  web:
		image: edhongcy/phppgadmin:latest
		restart: on-failure
		ports:
		  - 7070:80
		  - 7443:443
		depends_on:
		  - db
		environment:
		  - PHP_PG_ADMIN_SERVER_DESC=PostgreSQL
		  - PHP_PG_ADMIN_SERVER_HOST=db
		  - PHP_PG_ADMIN_SERVER_PORT=5432
		  - PHP_PG_ADMIN_SERVER_SSL_MODE=allow
		  - PHP_PG_ADMIN_SERVER_DEFAULT_DB=template1
		  - PHP_PG_ADMIN_SERVER_PG_DUMP_PATH=/usr/bin/pg_dump
		  - PHP_PG_ADMIN_SERVER_PG_DUMPALL_PATH=/usr/bin/pg_dumpall

		  - PHP_PG_ADMIN_DEFAULT_LANG=auto
		  - PHP_PG_ADMIN_AUTO_COMPLETE=default on
		  - PHP_PG_ADMIN_EXTRA_LOGIN_SECURITY=false
		  - PHP_PG_ADMIN_OWNED_ONLY=false
		  - PHP_PG_ADMIN_SHOW_COMMENTS=true
		  - PHP_PG_ADMIN_SHOW_ADVANCED=false
		  - PHP_PG_ADMIN_SHOW_SYSTEM=false
		  - PHP_PG_ADMIN_MIN_PASSWORD_LENGTH=1
		  - PHP_PG_ADMIN_LEFT_WIDTH=200
		  - PHP_PG_ADMIN_THEME=default
		  - PHP_PG_ADMIN_SHOW_OIDS=false
		  - PHP_PG_ADMIN_MAX_ROWS=30
		  - PHP_PG_ADMIN_MAX_CHARS=50
		  - PHP_PG_ADMIN_USE_XHTML_STRICT=false
		  - PHP_PG_ADMIN_HELP_BASE=http://www.postgresql.org/docs/%s/interactive/
		  - PHP_PG_ADMIN_AJAX_REFRESH=3

看到了默认密码了吧，QNAP 官方的页面都不写一下，让别人一键安装的去哪里找，还不如直接贴这个让用户自己到 Container 里面自己建呢。

如果安装后发现用默认的用户名：`postgres` 和默认密码：`postgres` 登录不了，尝试重启一下服务，然后 netstat -tupln 看看服务 5432 端口有没有启动。

	/etc/init.d/postgresql.sh restart

然后就开始安装 ttrss:

	docker run -d --name ttrss --restart=unless-stopped \
	-e SELF_URL_PATH=http://<your-nas-ip>:181 \
	-e DB_HOST=<your-nas-postgresql-host> \
	-e DB_PORT=5432 \
	-e DB_NAME=ttrss \
	-p 181:80 \
	wangqiru/ttrss

安装的时候有个坑，启用时遇到如下错误：

	PHP Fatal error: Uncaught PDOException: SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "ttrss_version" does not exist LINE 1

我一般习惯 MySQL 的做法，先到数据库中新建了一个 DB，新建一个用户，然后再用 `-e DB_USER=user -e DB_PASS=password` 来创建 Docker 容器，没想到遇到了 [Bug](https://github.com/HenryQW/Awesome-TTRSS/issues/75)，首次初始化的时候脚本里有着判断，如果 db 已经存在了就不初始化 sql 了，所以到数据库中把新建的数据库删掉，然后再来一次就好了。

其他说明：

- `--restart` 参数可以换成 `--restart=always`，这样系统重启容器也能重启
- `SELF_URL_PATH` 这里需要和启动时的 URL 配置完全一致，否则 ttrss 启动时会出错

其他插件安装可以[参考这里](https://ttrss.henry.wang/)，比如全文输出，主题之类，我只想用 ttrss 来订阅几个我日常关注的博主，其他的订阅源还是 [InoReader](/post/2013/11/inoreader-using-feelings.html) 所以也就不折腾全文不全文了，不全文输出的也就没有订阅的必要了。不过如果你想要实现全文输出也还是有办法的。

### Mercury Parser api

	docker run -d --name=mercury-parser-api \
	--restart=unless-stopped \
	-p 3000:3000 -d wangqiru/mercury-parser-api

## FreshRSS
FreshRSS 也是 PHP 编写，基本依赖也就是 PHP 和数据库，MySQL 5.5.3+ MariaDb, SQLite, PostgreSQL 9.5+. 界面也比较简洁大方。

- <https://github.com/FreshRSS/FreshRSS>

在线预览：<https://freshrss.org/>

用 Docker 安装也比较方便，可以[参考这里](https://github.com/FreshRSS/FreshRSS/tree/master/Docker)

### 安装

	docker run -d \
	  --name=freshrss \
	  -e PUID=1000 \
	  -e PGID=100 \
	  -e TZ=Asia/Shanghai \
	  -p 6080:80 \
	  -v /share/Container/freshrss:/config \
	  --restart unless-stopped \
	  linuxserver/freshrss


## NewsBlur
Python, Django, Celery etc

- <https://github.com/samuelclay/NewsBlur/>

NewsBlur 的在线预览可以点击[这里](http://www.newsblur.com/)，界面也还是很不错的。

## Selfoss
另一款 PHP 编写的 RSS 阅读器，Selfoss 比较简单，依赖也比较简单，PHP，WebServer，Database(sqlite, mysql, PostgreSQL) 就可以，所以安装起来也比较简单，甚至有环境的基础下，下载 zip, 解压，然后修改一下配置即可。

- <https://github.com/SSilence/selfoss>

需要注意的是，`config.ini` 配置文件中的 password 字段，需要访问 http://ip-selfoss-service/password，然后输入密码生成一个 hashcode，然后将该密码 hash 配置到 config.ini 文件中。

然后访问 http://ip-selfoss-service/opml，可以导入 opml 文件。

Android Reader

- <https://github.com/aminecmi/readerforselfoss>

### 总结
Selfoss 相对比较简单，定时抓取也要手工 crontab 来触发，但功能一点也不弱，日常用完全没有问题，并且依赖非常少。

### 排错
在我配置使用 SQLite 作为数据库时，Selfoss 没出现问题，但是当我配置 MySQL 作为数据库时，在日志中给我报了：

	[2020-02-10 16:04:21] selfoss.ERROR: PDOStatement: You do not have the SUPER privilege and binary logging
	 is enabled (you *might* want to use the less safe log_bin_trust_function_creators variable)

网上一查似乎是 MySQL 权限问题，但想想我已经给了 Selfoss 的用户整个 selfoss 数据库的权限了，后来一查看到有人和我相同的情况 [^q]，定位到应该就是 MySQL 中创建 Tigger 的权限不足导致。

	[2020-02-10 16:09:03] selfoss.ERROR: PDOStatement: Trigger does not exist

结合这个错误，所以我的解决方法就是在安装时临时给 selfoss 这个数据库用户超级权限，安装好后把权限取消。

- Selfoss 安装好后会在 phpMyAdmin 中能看到 Selfoss 创建了两个 Trigger，`insert_updatetime_trigger`和`update_updatetime_trigger`， 备份时记得备份，`mysqldump --triggers --no-create-info --no-data --no-create-db --skip-opt selfoss > selfoss.trigger`
- 删除 triggers from the selfoss database: drop trigger insert_updatetime_trigger; and drop trigger update_updatetime_trigger;
- replaced the selfoss user in the exported selfoss.trigger file with root (DEFINER=`root`@`localhost`)
- 导入 `mysql selfoss < selfoss.trigger`

[^q]: https://selfoss.aditu.de/forum/index.php?mode=thread&id=895

## miniflux
Go 编写，依赖 PostgreSQL。

- <https://github.com/miniflux/miniflux>


## stringer

Ruby 编写

- <https://github.com/swanson/stringer>

## Leed
Php/MySQL

- <https://github.com/LeedRSS/Leed#leed-english-documentation>

更多自建的 RSS 可以参考[这里](https://github.com/awesome-selfhosted/awesome-selfhosted#feed-readers) 大概还有几十种，不同语言，不同实现。

## Feedbin
Ruby & Postgres & Redis & Memcached & Elasticsearch

- <https://github.com/feedbin/feedbin>

## reference

- <https://www.reddit.com/r/selfhosted/comments/6yqmdo/rss_freshrss_vs_tiny_tiny_rss_vs_selfoss/>
- <https://sleele.com/2019/06/16/tiny-tiny-rss-%E9%83%A8%E7%BD%B2%E6%B5%81%E7%A8%8B/>
