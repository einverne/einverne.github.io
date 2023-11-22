---
layout: post
title: "一键将本地的照片展示在网页 Photoview 使用"
aliases:
- "一键将本地的照片展示在网页 Photoview 使用"
tagline: ""
description: ""
category: 产品体验
tags: [photo, docker, photo, photo-management]
create_time: 2022-06-20 20:55:14
last_updated: 2023-11-22 20:55:14
---

在调研个人的照片托管方案的时候，发现了一款不错的，很简洁的，开源照片展示程序 Photoview。下面就简单的介绍一下。

[Photoview](https://photoview.github.io/) 是一款可以在线展示相册的应用，使用 Go 和 TypeScript 编写。

Photoview 可以将本地的文件夹变成一个在线的相册，Photoview 会定期扫描本地的文件，包括照片，视频，然后将起展示在 Web 中，Photoview 还还有一个手机客户端。

- GitHub: <https://github.com/photoview/photoview>

Photoview 的特性：

- 和文件系统同步，自动扫描发现，可以在 [[Samba]]，[[FTP]] 甚至可以和 [[NextCloud]] 一起使用
- 多用户支持
- 支持共享
- 可以提取照片中的地理位置信息，并使用 [[Mapbox]] 来在地图中展示照片
- 支持 Raw
- EXIF Metadata
- 共享照片

![photoview overview](https://photo.einverne.info/images/2023/11/22/fr5y.png)

## 使用

如果不想自己安装，那么可以通过之前我介绍的 [PikaPods](/post/2022/01/pikapods-docker-container-as-service.html) 来安装体验一下。注册登录之后，找到 Photoview，然后一件安装即可。

## 缺点

在使用的过程中，发现唯一不足的是，Photoview 正如其名，只能查看，没有任何上传和编辑的功能。
