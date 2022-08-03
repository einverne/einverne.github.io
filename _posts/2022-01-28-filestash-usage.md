---
layout: post
title: "在线文件管理器 Filestash"
aliases:
- "在线文件管理器 Filestash"
tagline: ""
description: ""
category: 学习笔记
tags: [ selfhosted,  self-hosted, self-hosting, file-manage ]
last_updated: 2022-08-02 07:16:43
create_time: 2022-01-28 06:30:29
---

[[filestash]] 是一个在线的文件管理器，可以使用浏览器管理分布在各种服务，各种磁盘上的数据，支持包括 SFTP，FTP，S3，[[WebDAV]]，[[Dropbox]]，[[Google Drive]]，[[Gogs]] 存储的内容。

Filestash 的目的在给存储层增加一层抽象，这使得我们可以通过一个简单的界面来管理我们所有的后端数据。

支持：

- SFTP
- FTP
- [[WebDAV]]
- [[Git]]
- [[AWS S3]]
- Dropbox
- Google Drive

官网

- <https://www.filestash.app/docs/>

特性：

- 从浏览器管理各处文件
- 支持 Org mode[^1]
- 灵活的分享机制
- 视频播放器
- 视频转码（mov, mkv, avi, mpeg 等等）
- 图片预览
- 图片转码 (Nikon 和 Canon 的 raw 格式）
- 图片管理
- 音频播放器
- 全文检索
- 跨网络驱动器的分享链接
- 办公文档 (docx, xlsx 等等）
- 移动界面友好
- 速度快
- 上传文件或创建文件夹
- 支持多云存储提供商以及多协议
- Nyan cat loader
- 支持快速访问，频繁访问的文件夹会展示在首页
- Emacs, VIM 和 Sublime 快捷键绑定

[^1]: <https://www.filestash.app/2018/05/31/release-note-v0.1/>

## 费用
如果自己的安装是完全无需费用的。

如果使用官方的托管，Pro 需要 50$ 一个月。如果需要更好的支持可以到官网 [查看](https://www.filestash.app/pricing/) 。

## 安装

    docker run --restart=always --name filetash -d -p 8334:8334 machines/filestash

或者通过 `docker-compose`:

```
version: '3'

services:
  filestash:
    image: machines/filestash
    container_name: filestash
    restart: always
    ports:
      - "8334:8334"
```

更加详细的配置可以参考我的 [dockerfile](https://github.com/einverne/dockerfile) 。

运行成功之后，会设置初始密码，之后访问 `/admin` 可以进入管理后台。

## 启用 Google Drive

需要获取 Google Drive API，点击 [进入](https://console.developers.google.com/apis/api/drive.googleapis.com/overview) 管理后台。

 [点击](https://console.developers.google.com/apis/credentials/oauthclient) 创建 OAuth 客户端 ID，

## 相较于同类的优点

- 对图像支持比较友好，甚至支持 RAW 格式
- 支持时评，可以进行转码
- 可以进行全文检索
- 支持与 OnlyOffice 集成

## 存在的问题

空间占用太多

`/var/lib/docker/overlay2/`

## reference

- [[alist-file-list]]
