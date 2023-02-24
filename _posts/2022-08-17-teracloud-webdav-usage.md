---
layout: post
title: "介绍一款支持 WebDAV 的网盘 teraCLOUD"
aliases:
- "介绍一款支持 WebDAV 的网盘 teraCLOUD"
tagline: ""
description: ""
category: 产品体验
tags: [ teracloud, cloud-drive, webdav, finder, macos, ]
create_time: 2023-02-24 18:15:11
last_updated: 2023-02-24 18:15:11
---

teraCLOUD 是一家日本云存储服务提供商，提供基于云端的文件存储、同步和分享功能。用户可以使用 teraCLOUD 上传、下载、同步和分享文件，这些文件可以随时随地在各种设备上进行访问，包括电脑、手机和平板电脑等。

teraCLOUD 提供了多种存储计划，用户可以选择合适的存储空间和价格方案。除了基本的文件存储和同步功能外，teraCLOUD 还提供了一些高级功能，如文件共享、文件夹共享、外部链接共享等，方便用户与他人共享文件和合作工作。

teraCLOUD 采用了高度安全的技术保护用户数据的安全性和隐私。所有文件都会经过加密处理，同时，teraCLOUD 也提供了多种身份验证方式和安全设置，以确保用户数据的安全性和保密性。

teraCLOUD 是一款功能强大且安全可靠的云存储服务，适用于各种个人和商业用途。

但是在所有的特性中 teraCLOUD 的独特之处在于支持 [[WebDAV]]。

## 什么是 WebDAV

WebDAV（Web Distributed Authoring and Versioning）是一种基于 HTTP 协议的扩展协议，用于在 web 服务器上进行文件管理和协同编辑。WebDAV 可以让用户在 web 服务器上读取、写入和修改文件，并提供了一些高级功能，如文件锁定、版本控制、属性管理等。

通过 WebDAV，用户可以像在本地计算机上编辑文件一样在 web 服务器上编辑文件，这使得 WebDAV 成为一种非常方便的远程协作工具。例如，用户可以通过 WebDAV 在多个地点访问、编辑和共享文件，这对于团队协作、文件共享和远程访问非常有用。

## 使用场景

teraCloud 支持了 WebDAV 之后就诞生了很多的使用场景，比如可以作为配置文件的存储，可以编程直接访问 WebDAV，也可以直接在系统中挂载网盘当作一个本地硬盘使用。

## 在 macOS Finder 中添加 WebDAV

打开 Finder，然后按下 Cmd+k (或者菜单栏 Go-> Connect to server)，然后在弹出的对话框中填入 TeraCLOUD 的连接内容。点击连接之后，输入 TeraCLOUD 后台提供的用户名和密码（注意这里不是 TeraCLOUD 的登录密码）。然后就可以直接在 Finder 中像本地挂在的磁盘一样使用 TeraCLOUD。
![mac finder webdav](https://photo.einverne.info/images/2023/02/24/kWcG.png)

## Referral

注册完成之后，可以访问 [My Page](https://teracloud.jp/en/modules/mypage/usage/) 在其中输入我的邀请码 NDMSQ ，可以活得额外的 1GB 空间。

![teracloud referral](https://photo.einverne.info/images/2023/02/24/kEZ2.png)
