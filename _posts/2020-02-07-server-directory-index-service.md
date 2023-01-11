---
layout: post
title: "在线目录列表程序"
aliases: "在线目录列表程序"
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

## ZFile
[[ZFile]] 是一款基于 Java 的在线网盘程序，支持对接 S3，OneDrive，SharePoint，又拍云，本地存储，FTP 等等，支持在线浏览图片、播放音视频、文本文件等等。

```
docker run -d --name=zfile --restart=always \
    -p 8080:8080 \
    -v /root/zfile/db:/root/.zfile/db \
    -v /root/zfile/logs:/root/.zfile/logs \
    zhaojun1998/zfile
```

或者参考我的 [docker-compose](https://github.com/einverne/dockerfile)。


## FileBrowser Enhanced

- <https://hub.docker.com/r/80x86/filebrowser>

## Nginx docker
Nginx index 套了一层皮肤

- <https://hub.docker.com/r/80x86/nginx-fancyindex>

## PanIndex
[[PanIndex]] 是一个使用 JavaScript 实现的网盘目录列表，支持天翼云、teambition, 阿里云盘，OneDrive 等等

- <https://github.com/libsgh/PanIndex>

演示：

![[screenshot-area-2021-10-28-111720.png]]

## OLAINDEX
[[OLAINDEX]] 是一个可以将 OneDrive 中的内容展示出来的目录列表程序。基于 PHP 框架 Laravel ，界面也不错。

- <https://github.com/WangNingkai/OLAINDEX>

OneDrive directory listing application

从 DockerHub 拉取Docker镜像：

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
h5ai 是一个 PHP 实现的简单在线列表程序，将源码放到目录下，使用 PHP 就能打开列表，不过源码已经很久没有更新了。

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

## GoIndex

[[GoIndex]] 是一个使用了 [Cloudflare Workers](https://workers.cloudflare.com/一个不需要) 的 Google Drive 列表程序。在不需要自己的服务器的情况下就可以使用 GoIndex 来展示 Google Drive 中的内容。

## onedrive-vercel-index


- <https://github.com/W4J1e/onedrive-vercel-index>


[样例](https://pan.hin.cool/)


## Snap2HTML
Snap2HTML 是一个生成一个静态 HTML 页面展示文件列表的程序。

- <https://www.rlvision.com/snap2html/about.php>

## filestash
[[filestash]]


## alist

[[alist-file-list]]


## DirectoryLister
[[DirectoryLister]] 是一个简洁的文件目录程序，需要依赖 PHP，Nginx。

- GitHub：<https://github.com/DirectoryLister/DirectoryLister>
- <https://www.directorylister.com/>


## 其他网盘程序

- [[2018-04-08-nextcloud|NextCloud]]
- [[CloudReve]]
- [[SeaFile]]
- [[KODExplorer]]
- [[OwnCloud]]