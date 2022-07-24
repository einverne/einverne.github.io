---
layout: post
title: "威联通折腾篇十九：Calibre-web"
aliases: "威联通折腾篇十九：Calibre-web"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, calibre, calibre-web, linux, docker, qnap-tutorial]
last_updated:
---

借助 QNAP（威联通）的 Container Station 功能，可以展开无限想象，之前也已经[分享](/tags.html#qnap-tutorial) 过很多的使用 Docker 镜像来安装的教程了。所以今天不展开讲，主要就是来分享一下，最近安装的 calibre-web。因为之前七零八落的收集了很多电子书，文件分散在磁盘的各个地方，一直没有好好整理，正好趁着这个机会把所有的文件都放到一个地方了。

## docker

主要是用的镜像是 technosoft2000 制作的 calibre-web:

- <https://hub.docker.com/r/technosoft2000/calibre-web>

我尝试了 linuxserver 发布的 calibre-web，也不错，不过缺少了在线预览功能。然后还看到有几个中文的镜像，还没来得及尝试。

源码主要在 <https://github.com/janeczku/calibre-web> 这里。

	docker create --name=calibre-web --restart=always \
	-v <your Calibre books folder>:/books \
	[-v <your Calibre Web application folder>:/calibre-web/app] \
	[-v <your Calibre Web kindlegen folder>:/calibre-web/kindlegen`]
	[-v <your Calibre Web config folder>:/calibre-web/config \]
	[-e USE_CONFIG_DIR=true \]
	[-e APP_REPO=https://github.com/janeczku/calibre-web.git \]
	[-e APP_BRANCH=master \]
	[-e SET_CONTAINER_TIMEZONE=true \]
	[-e CONTAINER_TIMEZONE=<container timezone value> \]
	[-e PGID=<group ID (gid)> -e PUID=<user ID (uid)> \]
	-p <HTTP PORT>:8083 \
	technosoft2000/calibre-web

## 批量导入书籍

注意下方命令中的 `--library-path` 需要指定 Calibre 库的位置。

	calibredb add --library-path=/books -r /path/to/your/book_dir_you_want_to_add

使用该方法添加的书籍会在原始位置，而 metainfo 则会添加到 Calibre 库中，也就是上面一行的 `/books` 目录中。

更多关于 calibredb 命令的使用可以参考[官网](https://manual.calibre-ebook.com/generated/en/calibredb.html#calibredb)

## Goodreads API
获取 Goodreads API

- <https://www.goodreads.com/api>

## 批量导入 Calibre
在 Calibre 界面中可以快速的导入一个目录，但是在 Web UI 里面暂时不能做到，所以借用 Bash 命令 [^1]：

	if [ "$(ls -A /[autoaddfolder])" ]; then
		 calibredb add -r "/[autoaddfolder]" --library-path="/[calibrelibraryfolder]"
	fi

[^1]: https://github.com/janeczku/calibre-web/issues/412

## Others

### talebook
亮点是支持从豆瓣获取数据，不过我使用的 technosoft2000 的镜像也是支持的。

- <https://github.com/talebook/calibre-webserver>

![talebook-calibre-web](/assets/talebook-calibre-web.png)

### gshang2017

- <https://github.com/gshang2017/docker/tree/master/calibre-web>

## 豆瓣 API
在最早使用 Calibre-web 的时候还自带豆瓣图书的数据源，可以一键将图书的 metadata 信息补充完整，但后来豆瓣把 API 关闭了，所以可以借助如下的项目来将此部份模块替换，使用 Python 爬取豆瓣的数据。

- <https://github.com/fugary/simple-boot-douban-api>
- <https://github.com/fugary/calibre-web-douban-api>

## 延伸

- Komga 另一个可以自行搭建的图书管理