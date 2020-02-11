---
layout: post
title: "目录列表程序"
tagline: ""
description: ""
category: 整理合集
tags: [nginx, server, php, linux, index ]
last_updated:
---

最简单的 index 就是开启 Apache，或者 Nginx 的 Directory Index Listing。

	location /somedirectory/ {
		autoindex on;
	}

不过有些简陋而已。

## FileBrowser Enhanced

- <https://hub.docker.com/r/80x86/filebrowser>

## Nginx docker
Nginx index 套了一层皮肤

- <https://hub.docker.com/r/80x86/nginx-fancyindex>

## olaindex
OneDrive directory listing application

- <https://hub.docker.com/r/80x86/olaindex>


## h5ai
h5ai 比较简单，放到目录下就能使用，不过源码已经很久没有更新了。

- <https://larsjung.de/h5ai/>

## zdir
依赖：

- PHP

特色功能：

- 文件搜索
- Office 文件在线预览
- 文件二维码

- <https://github.com/helloxz/zdir>
- 帮助文档：<https://doc.xiaoz.me/#/zdir/>
