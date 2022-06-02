---
layout: post
title: "威联通折腾篇十：使用 aria2 下载百度云"
aliases: "威联通折腾篇十：使用 aria2 下载百度云"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, aria2, container-station, docker, ]
last_updated:
---

无奈现在还是很多人使用百度云，以前用一个 bcloud 在 linux 上还能解决 80% 的需求，但是后来封了，也就一直没有理。不过后来发现 aria2 也能够现在百度云的资源，所以想着 qnap 威联通上也应该是能够安装的，使用 docker 会更加容易些。

## 新建容器
在 Container Station 中搜索 `xujinkai/aria2-with-webui` 安装即可。镜像是开源的地址在：<https://github.com/XUJINKAI/aria2-with-webui>

在设置中，网络选项下需要注意

- 6080 端口映射容器 80 端口，这是 aria web 服务端口
- 6800 端口映射容器 6800 端口，该端口为 aria2 端口

其中容器的 8080 端口可以选择性映射，这个端口用来浏览下载的目录列表，对于暴露外网的服务千万小心。

所以映射完之后，威联通的 6800 端口是 webui 界面，6080 端口是 aria2 服务的端口。

在共享文件夹选项中，可以设置需要挂载的本机共享文件夹，镜像中有两个挂载路径

- `/data` 这个挂载点用来存放下载的文件目录
- `/conf` 这个挂载点是 aria2 的配置目录

分别在威联通上新建共享目录来挂载这两个目录即可。

    docker run -d \
        --name aria2-with-webui \
        -p 6800:6800 \
        -p 6080:80 \
        -v /share/aria2-data:/data \
        -v /share/aria2-conf:/conf \
        -e PUID=1000 \
        -e PGID=1000 \
        -e SECRET=NOBODYKNOWSME \
        xujinkai/aria2-with-webui


## 配置
在完成容器创建之后，可以访问 http://[qnap-ip]:6080 来浏览 aria2 webui，在界面中找到“设置”，“连接设置”

在 aria2 RPC 主机和端口设置中，设置主机地址为威联通的 IP 地址，或者远程域名，端口为 `6800`，如果设置了密码，需要在这里配置密码。

设置密码的过程，在 `/conf` 挂载点，找到 `aria2.conf` 文件，在文件中添加配置

    rpc-secret=123456

如果在外网访问，一定要设置这个密码，如果在内网，可以不用设置。

在保存配置文件之后，需要重启容器。

## baiduexporter
在完成 aria2 的安装之后，就是如何将百度云的内容导出到 aria2 下载，答案就是 [BaiduExport](https://github.com/acgotaku/BaiduExporter)

手动安装插件之后，重新刷新百度云网页，在选中文件之后就会看见多出来一个 “导出下载”的按钮，在 aria2 rpc 的设置中，填写 rpc 服务地址

    http://[qnap-ip]:6800/jsonrpc

如果设置了密码令牌，则需要

    http://token:123456@[qnap-ip]:6800/jsonrpc

此时，选中想要下载的文件，然后使用 `ARIA2 RPC` 导出下载，然后去 WEBUI 查看下载状态即可。

## reference

- http://www.nasyun.com/forum.php?mod=viewthread&tid=60274
