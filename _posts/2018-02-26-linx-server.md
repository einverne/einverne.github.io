---
layout: post
title: "搭建自己的文件共享服务 linx server"
tagline: ""
description: ""
category: 经验总结
tags: [linux, server, file, media, sharing, photo, linx-server,]
last_updated:
---

之前用过 https://sm.ms 这个非常好用的图片共享站，界面非常简洁，延迟也低，就想着是不是自己也能够搭建一套这样的服务私用，然而 sm.ms 并没有开源，连其 Android/iOS 客户端也并没有开源，所以只能在网上寻觅代替品，幸而遇到了 [linx server](https://github.com/andreimarcu/linx-server)。

同样是一个文件分享的站点，通过 Docker 搭建一套服务非常简单，他也能够支持使用 API 上传，界面也同样非常简洁。具体的使用可以参考 [Docker 页面](https://hub.docker.com/r/einverne/linx-server/)

    docker pull einverne/linx-server
    docker run -p 8080:8080 -d -v /media/meta:/data/meta -v /media/files:/data/files einverne/linx-server


## 源码

源码中使用的框架和工具：

- flag 标准库中的命令行参数
- [Goji](https://github.com/zenazn/goji) ，一个简单的 Web 框架。
- [pongo2](https://github.com/flosch/pongo2) Django 语法类似的模板引擎
- [bencode](https://github.com/zeebo/bencode) bencode 编码解码库
