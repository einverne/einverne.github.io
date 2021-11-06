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

## zfile
一款基于 Java 的在线网盘程序，支持对接 S3，OneDrive，SharePoint，又拍云，本地存储，FTP 等等，支持在线浏览图片、播放音视频、文本文件等等。

```
docker run -d --name=zfile --restart=always \
    -p 8080:8080 \
    -v /root/zfile/db:/root/.zfile/db \
    -v /root/zfile/logs:/root/.zfile/logs \
    zhaojun1998/zfile
```



## FileBrowser Enhanced

- <https://hub.docker.com/r/80x86/filebrowser>

## Nginx docker
Nginx index 套了一层皮肤

- <https://hub.docker.com/r/80x86/nginx-fancyindex>

## PanIndex
网盘目录列表，支持天翼云、teambition, 阿里云盘，OneDrive 等等

- <https://github.com/libsgh/PanIndex>

演示：

![[screenshot-area-2021-10-28-111720.png]]

## OLAINDEX
OLAINDEX 是一个可以将 OneDrive 中的内容分享到网站的工具。使用 PHP 编写，界面也不错。

OneDrive directory listing application

从DockerHub拉取Docker镜像：

```
docker run -d --init --name olaindex -p 80:8000 xczh/olaindex:6.0
```

现在，访问`http://YOUR_SERVER_IP/`，可以看到你的OLAINDEX应用了。

当然你也可以选择从 Dockerfile 自行编译Docker镜像，切换到项目根目录执行：

```
docker build -t xczh/olaindex:dev .

docker run -d --init --name olaindex -p 80:8000 xczh/olaindex:dev
```

或者也可以使用这个镜像：

- <https://hub.docker.com/r/80x86/olaindex>

OneDrive 的目录程序还有 PyOne，OneIndex, [[OneList]]

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
