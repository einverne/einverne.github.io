---
layout: post
title: "我的照片管理方案"
aliases:
- "我的照片管理方案"
tagline: ""
description: ""
category: 经验总结
tags: [photo-management, photo, google-photos, icloud-photo, icloud, nextcloud, 相册, 照片 ]
create_time: 2023-10-24 00:13:56
last_updated: 2023-10-24 00:13:56
---

虽然过去一直使用 Google Photos（从 Picasa 时代就开始使用），一个账户中也累积了也有 30G+ 的照片，另外还有一些相机拍摄的照片存储在硬盘上没有上传 Google Photos，但是最近越来越不想使用 Google Photos，之前也有写过文章，逐步从 Google 的服务中逃离。去年更换了低配版 [iPhone](/post/2022/07/iphone-13-review-and-setup.html) 之后因为存储空间有限，所以订阅了 iCloud 200G 版本，最初只是为了缓解一下手机的存储空间以及和 macOS 同步，这样想来也差不多用了近一年，但和 Google Photos 一样的问题，我想在本地（以文件的形式）管理我所有的照片（包括手机拍摄的，相机拍摄的）。之前用相机拍摄的很多照片都在本地离线备份着，并且可以通过非常清晰的日期标记来快速查询，唯一不方便的就是照片全部在本地，所以不能随时访问。

我为什么想要更换掉 Google Photos 或 iCloud Photos

- 想让 Google Photos 或者 iCloud Photos 作为备份的一种手段，因为单一的备份毕竟会出现问题
  - 比如之前发生过 [Google 封禁了一位父亲的 Google 账号](https://9to5google.com/2022/08/22/google-locked-account-medical-photo-story/)，只因为父亲因为需要和医生沟通拍摄了孩子敏感部位的照片，导致被标记为儿童色情，这位父亲丢失了十几年的照片和数据。
  - 而 iCloud 丢失数据，丢失照片，丢失文件的事情，我也不只一次看到，虽然我还没有遇到过，但是我天然的不相信任何「云」服务，因为我自己就丢失过 Evernote 的笔记
- 想要一个稳定的照片浏览的方式，可以随时随地安全地访问到
- 想要一个和家人一起共享的在线相册，这样就可以很方便的分享，当然 Google Photos 分享非常方便也非常灵活，但家人打不开， 使用 iCloud 分享，家人并不是 iPhone 手机
- 想要能够在不同的设备上共享，可以是 Android 也可以是 iOS，或者是通过电脑备份

## 调查方案

于是我基于上面的诉求开始了我的调查工作，首先是调查了市面上常常被人提及的照片自托管的方案。

- [[Photoview]]
- [[PhotoPrism]]
- [[immich]]
- [[NextCloud]]

之前就推荐过 [PikaPods](/post/2022/01/pikapods-docker-container-as-service.html) 这样一款可以一键部署的平台，所以非常适合我用来调查，创建之后，完整体验一下，就可以直接销毁掉了，大概也就是几美分。

### Photoview

[[Photoview]] 是一款可以将本地的目录展示成网络相册的应用，使用 Go 和 TypeScript 编写，非常适合共享和浏览，但是缺少上传以及必要的基于网页的图片管理。

### PhotoPrism

[[PhotoPrism]] 是一款比较成熟的自托管的照片管理应用，网页版体验比较好，也有 PhotoSync 这样的第三方应用来提供照片备份功能。

![](https://photo.einverne.info/images/2023/11/22/fthg.png)

我初步体验一下之后，一来感觉 PhotoPrism 消耗资源比较多，在用 [[PikaPods]] 安装时需要至少 8GB 的内存，二来它并不支持多用户隔离使用，虽然在设置中可以创建用户，但是也是共用的一套照片库。

### Immich

[[immich]] 是一个可以自托管的在线照片备份工具，也可以直接在线浏览网络相册，官方提供了 iOS 和 Android 客户端。

### Ente

[Ente](https://ente.io/) 是一个简单可以自动备份和整理照片和视频的应用。Ente 采用端到端的加密。Ente 拥有 Android，iOS，Web，Ente 按照存储容量收费。

### Google Pixel 1st generation

在研究的过程中，发现有人利用 Google Pixel 的相册上传无限容量，进行了一些 Hack，所以也写在这里作为备份 。

[Google Pixel 第一代](<https://en.wikipedia.org/wiki/Pixel_(1st_generation)>) 是 Google 2016 年发布的第一代自主品牌的 Android 手机，Google 当时承诺可以提供设备生命周期内的无限制原画质备份。这一条政策在 2021 年 6 月变更了 Google Photos 存储容量政策之后还依然有效。[^1]

[^1]: [Google Photos storage policy](https://blog.google/products/photos/storage-changes/)

![hImw](https://photo.einverne.info/images/2023/11/23/hImw.png)

历代 Pixel 的储存策略

![hwac](https://photo.einverne.info/images/2023/11/23/hwac.png)

### NextCloud

[[NextCloud]] 是一个可以自托管的在线存储，需要自己维护数据库以及 NextCloud 运行。

有人在 NextCloud 的基础之上开发了 [Memories](https://github.com/pulsejet/memories) ，是一个增强了照片管理的实例。支持

- 时间线
- 回到过去
- AI 标记
- 相册
- 分享
- 编辑 Metadata
- 存档
- 在地图上预览
- 轻松地从 Nextcloud Photos 或者 Google Takeout 导入

## 最省心的照片备份方案

综合考虑以上因素，以下是两个最省钱的照片同步方案：

1. Google Photos：Google Photos 提供免费无限量的高质量图片和视频存储。它可以自动压缩照片和视频以减少文件大小，节省存储空间。如果你需要更多的存储空间，可以选择付费的 Google One 服务进行升级。
2. iCloud Photos：iCloud Photos 提供 5GB 的免费存储空间，可以用于照片和视频的同步。如果你需要更多的存储空间，可以选择付费的 iCloud 存储方案进行升级。

Google One

| 存储空间 | 月费        | 年费          |
| -------- | ----------- | ------------- |
| 100 GB   | 1.99 美元   | 23.88 美元    |
| 200 GB   | 2.99 美元   | 35.88 美元    |
| 2 TB     | 9.99 美元   | 119.88 美元   |
| 10 TB    | 99.99 美元  | 1,199.88 美元 |
| 20 TB    | 199.99 美元 | 2,399.88 美元 |
| 30 TB    | 299.99 美元 | 3,599.88 美元 |

iCloud 土耳其价格 Türkiye3 (TRY)

| 存储空间 | 月费       |
| -------- | ---------- |
| 50GB     | 12.99 TL   |
| 200GB    | 39.99 TL   |
| 2TB<br>  | 129.99 TL  |
| 6TB      | 899.99 TL  |
| 12TB     | 1799.99 TL |

## 总结

在 Android 上我之前都是使用 Syncthing 同步到多设备上，但是也一直没有找到比较合适的能够像过去 Picasa 那样的本地照片浏览，或者基于网页的照片浏览服务。

我初步调查之后，可能有几个方案

- NextCloud 有各端的客户端，可以 iOS 备份
- PhotoPrism，备份和浏览

不知道大家还有没有什么更好的方案。

在选择最省钱的照片同步方案时，有几个关键因素需要考虑：

1. 免费存储空间：选择一个提供免费存储空间的方案可以节省成本。一些知名的云存储服务提供商如 Google Drive、Dropbox 和 OneDrive 都会提供一定数量的免费存储空间。
2. 低成本升级选项：如果你需要更多的存储空间，确保所选方案有低成本的升级选项。这将帮助你在未来扩展存储需求时节省费用。
3. 压缩照片选项：一些照片同步方案可以自动压缩照片以减少文件大小。这可以帮助节省存储空间和带宽使用量。
4. 多设备支持：确保所选方案可以在多个设备上进行同步，以便你可以随时随地访问你的照片。
5. 安全性和隐私保护：选择一个值得信赖的照片同步方案，确保你的照片得到安全地保存，并且你的隐私得到保护。

## 其他一些工具

- [iCloud Photos Downloader](https://github.com/icloud-photos-downloader/icloud_photos_downloader) 通过该工具备份 iCloud 中的照片
- [lespas](https://github.com/scubajeff/lespas) 是一个 Android 端管理照片的应用，可以和 Nextcloud 同步。
