---
layout: post
title: "支持对象存储的开源存储系统"
tagline: ""
description: ""
category: 整理合集
tags: [object-storage, cloud-drive, open-source,  ]
last_updated:
---

最近整理文档，想起来自己的腾讯云，和 Google 云，好几十 G 的对象存储都空着，虽然腾讯云填了一部分同步的书籍，但是还是没有好好利用起来，然后就突然想起来之前看到过有人自己写了一份网盘同步程序，将对象存储作为同步工具来使用，这么一想确实可以尝试一下，毕竟现在 Dropbox 容量渐渐不够用了，如果能作为一份扩充也倒是不错的选择。所以这里就整理一下目前可用的一些方案，然后再做一下决择。

## Cloudreve
这是一款 PHP 所写的云盘系统，支持多家对象存储，设计采用 Material Design ，看起来也不错。

- <https://github.com/cloudreve/Cloudreve>

## ZFile
[[ZFile]] 是一款 Java 编写的在线文档分享工具。

- <https://github.com/zhaojun1998/zfile>

## lsky-pro
[[lsky-pro]] 是一款用 PHP 框架 [[laravel]] 编写的图片管理系统。

- <https://github.com/wisp-x/lsky-pro>

## OneList
基于 Python 的 OneDrive 网盘目录列表

- <https://github.com/0oVicero0/OneList>

## oneindex
[[oneindex]] 是一款用来展示 One Drive 列表的项目，PHP 编写。

- <https://github.com/donwa/oneindex>

## PyOne

基于 Python 的 onedrive 文件本地化浏览系统，使用 [[MongoDB]] 缓存文件

- <https://github.com/abbeyokgo/PyOne>

## minio
用 Go 实现了一套对象存储的服务端，兼容 AWS S3。

- <https://github.com/minio/minio>

## Piwigo
一款在线相册

- <https://piwigo.org/>


在调查的过程中，还发现了日本的一个云存储服务，[TeraCLOUD](https://teracloud.jp)，提供 10G 空间，还支持 WebDAV ，果断注册一个。如果你也想注册可以注册完之后，用我的 [CODE](https://teracloud.jp/en/modules/mypage/usage/) ：`NDMSQ`

支持 [[WebDAV]] ，那么我就可以直接在我的 [nemo 文件管理器](/post/2018/08/nemo-file-manager.html) 中 connect 到这个服务，在 File -> Connect to Server 中选择 Secure WebDAV（HTTPS），然后输入 TeraCLOUD 提供的 WebDAV 地址，以及用户名和密码来登录该服务，既不用多安装一个客户端，也可以非常方便的映射到本地文件管理器中。简单的测试了一下，发现上传速度，在我这里竟然达到了惊人的 800 kB/s

![tera cloud speed](/assets/screenshot-teracloud-webdav-2019-09-27-123117.png)

其他桌面版，或者移动客户端，只要支持 WebDAV 协议，那么都可以非常方便的使用该服务。官方也提供了一系列的选择[方案](https://teracloud.jp/en/clients.html)。
