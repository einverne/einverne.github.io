---
layout: post
title: "我的照片管理方案"
aliases:
- "我的照片管理方案"
tagline: "在云端与本地之间寻找平衡"
description: "从 Google Photos 到自托管方案，我调研和体验了多款照片管理工具，分享目前的照片管理思路与实践。"
category: 经验总结
tags: [photo-management, photo, google-photos, icloud-photo, icloud, nextcloud, 相册, 照片]
create_time: 2023-10-24 00:13:56
last_updated: 2023-10-24 00:13:56
---

从 Picasa 时代就开始用 [[Google Photos]]，一个账户里已经累积了 30G+ 的照片，另外还有不少相机拍摄的照片躺在硬盘里从未上传。但最近我越来越不想依赖 Google Photos 了——之前写过文章，记录了我逐步从 Google 服务生态中迁移出来的过程。去年换了低配版 [[iPhone]] 之后，因为存储空间有限，订阅了 iCloud 200G 方案，最初只是为了缓解手机存储压力并与 macOS 同步，不知不觉也用了将近一年。但和 Google Photos 一样，我始终有个心结：想以文件的形式在本地管理所有照片，包括手机拍的和相机拍的，而不是全部托付给某一家云服务。

用相机拍摄的照片之前一直在本地离线备份，按日期组织得很清晰，翻找起来也方便；唯一的不足是只能在固定设备上访问，出门在外没法随时打开。

## 为什么想换掉 Google Photos 和 iCloud Photos

把所有照片都托付给单一的云服务，我始终觉得是一件挺危险的事情。之前有个让人印象深刻的案例：[Google 封禁了一位父亲的账号](https://9to5google.com/2022/08/22/google-locked-account-medical-photo-story/)，只因为他为了与医生沟通，拍摄了孩子敏感部位的照片，被系统自动标记为儿童色情内容，导致这位父亲丢失了十几年积累的所有数据和照片。这类事情发生的概率或许不高，但一旦中招，完全没有申诉余地，代价无法承受。而 [[iCloud]] 丢失数据、照片、文件的事故，我也不止一次在论坛和社交媒体上看到，虽然自己还没遇到，但我天然对任何"云"服务持保留态度——毕竟我曾真实地丢失过 [[Evernote]] 里的笔记数据。

除此之外，我还有几个具体诉求：想要一个稳定的、可以随时随地安全访问的照片浏览方式；想要一个能与家人共享的在线相册，Google Photos 的分享功能确实好用，但家人在国内根本打不开；用 iCloud 分享又要求对方也是 iPhone 用户，我家里并不是人人都用苹果。另外我也希望这套方案能同时兼顾 Android、iOS 和电脑端，不被某一个平台锁死。

## 我调研的自托管方案

基于上面这些诉求，我开始调研市面上常被人提及的照片自托管方案。期间借助 [[PikaPods]] 这个一键部署平台逐一体验——每个实例创建、玩完再销毁，只需几美分，非常适合快速试用，不用担心浪费资源。

### Photoview

[[Photoview]] 是一款用 Go 和 TypeScript 编写的本地目录展示工具，可以把本地的文件夹直接呈现成一个网络相册，界面干净，浏览体验也不错，很适合只需要共享和浏览的场景。不过它更偏向"展示"而非"管理"，缺少网页端上传功能以及完整的图片管理能力，所以不太适合作为主力的照片备份与管理方案。

### PhotoPrism

[[PhotoPrism]] 是一款相对成熟的自托管照片管理应用，网页端体验相当不错，也有 [[PhotoSync]] 这类第三方应用提供照片备份支持。

![](https://photo.einverne.info/images/2023/11/22/fthg.png)

初步体验之后，我发现两个比较明显的问题：一是资源消耗偏高，用 PikaPods 安装时需要至少 8GB 内存，对于配置一般的 VPS 来说压力不小；二是它不支持真正意义上的多用户隔离，虽然可以在设置里创建用户账号，但本质上还是共用同一套照片库。如果只是自己用倒也无所谓，但如果想让家人各自独立管理自己的照片，就会比较别扭。

### Immich

[[Immich]] 是目前自托管照片方案里社区呼声最高的选项，可以理解为自托管版的 Google Photos。它有官方的 iOS 和 Android 客户端，操作逻辑和 Google Photos 高度相似，上手门槛很低。相比其他工具，Immich 在功能完整度、更新频率和社区活跃度上都更胜一筹，尤其适合想彻底替代 Google Photos 的用户。

### Ente

[Ente](https://ente.io/) 是一个支持端到端加密的照片备份与整理应用，拥有 Android、iOS 和 Web 客户端，按存储容量收费。如果你对隐私有比较高的要求，Ente 是个值得关注的选择——端到端加密意味着即便是服务提供商本身，也无法查看你存储的内容，这是大多数云服务做不到的。

### NextCloud

[[NextCloud]] 是功能强大的自托管在线存储平台，需要自行维护数据库和运行环境，门槛相对高一些。社区在 NextCloud 基础上开发了 [Memories](https://github.com/pulsejet/memories) 插件，大幅增强了照片管理体验，支持时间线浏览、"回到过去"、AI 自动标记、相册、分享、元数据编辑、存档、地图预览，以及从 Nextcloud Photos 或 Google Takeout 的便捷导入。对于已经在使用 NextCloud 的用户，这套组合可以省去额外部署一套独立系统的麻烦。

### Google Pixel 第一代的无限备份技巧

调研过程中还看到一个有意思的玩法：[Google Pixel 第一代](<https://en.wikipedia.org/wiki/Pixel_(1st_generation)>) 是 Google 2016 年发布的首款自主品牌 Android 手机，当时承诺提供设备生命周期内无限制的原画质备份，而这一政策在 2021 年 6 月 Google Photos 调整存储策略之后依然有效。[^1]

[^1]: [Google Photos storage policy](https://blog.google/products/photos/storage-changes/)

![hImw](https://photo.einverne.info/images/2023/11/23/hImw.png)

历代 Pixel 的储存策略对比：

![hwac](https://photo.einverne.info/images/2023/11/23/hwac.png)

有人利用这个特性，保留一台 Pixel 一代设备专门作为照片上传的中转，实现免费无限量的高质量存储。对于不想折腾自托管、但又想省掉存储费用的人来说，这是个颇为取巧的方案，算是一种"白嫖" Google 资源的路子。

## 最省心的云存储方案参考

如果暂时不想搭建自托管服务，直接用云存储也是合理的过渡选择。以下是两个主要方案的定价参考：

Google One

| 存储空间 | 月费       | 年费         |
| -------- | ---------- | ------------ |
| 100 GB   | 1.99 美元  | 23.88 美元   |
| 200 GB   | 2.99 美元  | 35.88 美元   |
| 2 TB     | 9.99 美元  | 119.88 美元  |
| 10 TB    | 99.99 美元 | 1199.88 美元 |
| 20 TB    | 199.99 美元 | 2399.88 美元 |
| 30 TB    | 299.99 美元 | 3599.88 美元 |

iCloud 土耳其区价格（TRY）

| 存储空间 | 月费       |
| -------- | ---------- |
| 50GB     | 12.99 TL   |
| 200GB    | 39.99 TL   |
| 2TB      | 129.99 TL  |
| 6TB      | 899.99 TL  |
| 12TB     | 1799.99 TL |

iCloud 的土耳其区订阅折合人民币后价格相当划算，是很多人在用的省钱方案，和 Google One 相比各有优劣，取决于你更习惯用哪个生态。

## 其他相关工具

- [iCloud Photos Downloader](https://github.com/icloud-photos-downloader/icloud_photos_downloader)：通过命令行备份 iCloud 中所有照片的工具，适合想把 iCloud 内容迁移到本地的用户。
- [lespas](https://github.com/scubajeff/lespas)：一个 Android 端的照片管理应用，可以与 [[Nextcloud]] 同步，适合 Android 用户搭配 Nextcloud 一起使用。

## 最后

折腾了一圈下来，最大的感受是：照片管理没有完美方案，关键是找到适合自己使用习惯和风险承受能力的组合。对我来说，理想状态是以本地文件为主、云端作为异地备份，而不是把所有鸡蛋放在某一家服务商的篮子里。

在 Android 上我之前一直用 [[Syncthing]] 在多设备之间同步，但一直没找到像当年 Picasa 那样顺手的本地照片浏览工具。自托管这条路还在探索中，目前来看 [[Immich]] 是最值得深入试用的方案，NextCloud + Memories 的组合也有不小的潜力。如果你有更好的思路或组合方式，欢迎留言交流。
