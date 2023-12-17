---
layout: post
title: "又一款支持 WebDAV 的网盘 Koofr"
aliases: 
- "又一款支持 WebDAV 的网盘 Koofr"
tagline: ""
description: ""
category: 产品体验
tags: [ cloud-drive, webdav, drive, google-drive ]
last_updated: 2023-12-17 09:57:24
create_time: 2023-08-16 07:22:07
---

[Koofr](https://gtk.pw/koofr) 是一家欧洲网络云盘运营商，成立于 2013 年。直接也介绍过一款日本服务商提供的，支持 WebDAV 的网盘 [TeraCLOUD](/post/2022/08/teracloud-webdav-usage.html) 后来改名成了 [[InfiniCLOUD]]，提供超大的初始容量(38 GB)。

Koofr 网盘提供了可靠的云存储和文件同步服务，同时也支持 WebDAV 协议。WebDAV（Web Distributed Authoring and Versioning）是一种用于在互联网上进行文档管理和共享的扩展标准。它允许用户通过 HTTP 协议来编辑和管理远程服务器上的文件。这里为什么要强调 WebDAV 呢，是因为支持这个协议之后，有很多同步工具都可以使用，而不需要依赖官方提供的开户端。比如同步 Obsidian 笔记，比如直接在 Finder 中挂载网盘等等。

## 价格

Koofr 免费 10 GB 的初始空间，每邀请 1 位用户会多增加 0.5GB 空间，最多增加 8GB，如果感兴趣可以使用[我的邀请](https://k00.fr/sbftilfc) 注册。本来还想放一个大文件可以测试一下速度，但是发现免费的用户生成的链接有限期只有 14 天。

官方最低[终身套餐](https://stacksocial.com/sales/koofr-cloud-storage-plans-lifetime-subscription-100gb) $29.99/100GB，史低有过 $18/100GB

![hXwn](https://photo.einverne.info/images/2023/11/29/hXwn.png)

## 优点

- 以连接并管理 Dropbox、Onedrive、GoogleDrive 文件
  - 支持分享 OneDrive/Google Drive 的文件，但只能邮件分享给 koofr 用户
- 支持 [[WebDAV]]
  - 挂载 WebDAV 为本地磁盘驱动器
  - 使用 Koofr 的 WebDAV 功能，可以像操作本地文件夹一样轻松地操作云存储中的文件
  - 在不同设备之间同步和共享文件
- 提供其他功能，如多设备同步、文件共享、版本控制、在线预览等
- 该平台还具有高级安全性措施，保护用户数据的隐私和安全
- 支持 [[rclone]]
- 可以链接/邮件分享文件、文件夹
- 分享文件接收者不需要注册账号
- 不限制单文件大小
- 有官方的各大平台的客户端

## 缺点

- 对于免费的账户 Dropbox/Onedrive/GoogleDrive 只能各连接 1 个账号
- 可以连接 Onedrive 商业/教育账号，不能连接 Google 团队盘
- 不支持直接在连接的网盘之间移动文件
