---
layout: post
title: "SyncTrain：让 iPhone 终于能用上 Syncthing 的开源客户端"
aliases:
  - SyncTrain
  - Synctrain
  - Sushitrain
tagline: "一位荷兰开发者用四周时间写出的 iOS Syncthing 客户端，比 Möbius Sync 好用太多"
description: "详细介绍 SyncTrain（Synctrain）这款开源免费的 iOS Syncthing 客户端，包括选择性同步、流媒体播放、照片备份等核心功能，以及与 Möbius Sync 的对比。"
category: 产品体验
tags:
  - syncthing
  - ios
  - sync
  - open-source
  - self-hosted
  - file-sync
  - synctrain
create_time: 2026-03-26 18:00:00
last_updated: 2026-03-26 18:00:00
---

![SyncTrain iOS Syncthing 客户端](https://pic.einverne.info/images/2026-03-26-synctrain-ios-syncthing-cover.png)

用了这么多年 [[Syncthing]]，一直有一个痛点——iOS 上始终没有一个真正好用的客户端。之前用过 [[Möbius Sync]]，说实话体验相当一般，本质上就是把 Syncthing 的 Web UI 包了一层壳，收费不说，功能也受限。直到最近发现了 SyncTrain 这个项目，试用之后只想说：iOS 上的 Syncthing 体验终于像样了。

## SyncTrain 是什么

[SyncTrain](https://apps.apple.com/us/app/synctrain/id6553985316)（在 GitHub 上叫 Sushitrain）是一款原生的 iOS 和 macOS [[Syncthing]] 客户端，由荷兰开发者 Tommy van der Vorst 开发。这个名字很有意思，Sushi Train 指的是日本回转寿司，一个高效传递小份食物的系统，和 Syncthing 的首字母缩写 ST 恰好一致。

和 Möbius Sync 不同，SyncTrain 不是简单地嵌入 Syncthing 的 Web 界面，而是用 SwiftUI 重新设计了一套以文件为中心的原生界面。底层通过 gomobile 桥接了一个完整的 Go 语言编写的 Syncthing 节点，也就是说你的 iPhone 上运行的是一个真正的 Syncthing 实例，而不是某种阉割版的代理。

开发者在博客中提到，他在开始这个项目之前既没写过 Go 也没用过 SwiftUI，整个开发周期只花了大约四周时间。项目最初是闭源的，但在 Syncthing 社区的反馈下很快以 MPLv2 协议开源，目前在 GitHub 上已经获得了超过 1400 颗 Star。

## 为什么选择 SyncTrain 而不是 Möbius Sync

在 SyncTrain 出现之前，iOS 上使用 Syncthing 基本只有 Möbius Sync 一个选择。两者的差距可以用一句话概括：SyncTrain 是一个重新思考过的 Syncthing 客户端，而 Möbius Sync 只是一个 Web UI 的壳。

具体来说，几个关键差异让我彻底转向了 SyncTrain。

选择性同步是最重要的功能差异。Möbius Sync 要么同步整个文件夹，要么不同步，没有中间选项。但 SyncTrain 支持精细的选择性同步——你可以只选择某个文件夹里的几个文件进行同步，其余的虽然能在界面上看到（因为全局索引是同步的），但不会占用手机存储。这个功能的实现很巧妙，利用了 Syncthing 的 `.stignore` 机制：在选择性同步模式下，默认用 `*` 忽略所有文件，当你选中某个文件时，会在前面添加一个例外规则（如 `!/some/file.txt`）。

流媒体播放是另一个杀手级功能。SyncTrain 内置了一个本地 HTTP 服务器，支持 HTTP Range 请求。当你想播放远程设备上的音频或视频时，不需要先把整个文件下载下来，App 会通过 Syncthing 协议按需拉取文件块，实现流式播放。这意味着你可以直接在手机上串流家里 NAS 上的电影或音乐，不需要 VPN，Syncthing 协议本身就处理了连接和加密。

照片备份功能也是 Möbius Sync 完全没有的。SyncTrain 可以自动将 iOS 相册中的照片导出到 Syncthing 文件夹，或者直接将相册设置为单向发送的文件夹。这对于想用自建方案替代 iCloud 照片同步的人来说非常实用。

| 对比项目 | SyncTrain | Möbius Sync |
|---------|-----------|-------------|
| 界面 | 原生 SwiftUI | 内嵌 Web UI |
| 开源 | 是（MPLv2） | 否 |
| 选择性同步 | 支持 | 不支持 |
| 流媒体播放 | 支持 | 不支持 |
| 远程缩略图 | 支持 | 不支持 |
| 照片备份 | 支持 | 不支持 |
| macOS 版本 | 有 | 无 |
| 价格 | 完全免费 | 免费版限 20MB |
| Apple Shortcuts | 支持 | 有限支持 |
| Files App 集成 | 支持 | 支持 |

## 核心功能详解

### 选择性同步

这是我使用频率最高的功能。我的 NAS 上有好几个 TB 的数据通过 Syncthing 同步，但手机上显然不可能也不需要存这么多东西。有了选择性同步，我可以浏览完整的文件目录，只把当前需要的文件拉到本地，用完了也不用担心占空间。

操作很简单：打开一个文件夹后，点击想要同步的文件即可。全局索引会显示所有远程设备上的文件列表，图标会区分哪些已经在本地、哪些还在远程。这个功能在出差或旅行时特别有用——临时需要某个文档，打开 SyncTrain 选中它，等几秒就同步过来了。

### 远程文件浏览和流媒体

即使不同步文件到本地，你也可以浏览远程设备上的所有文件，包括查看图片的缩略图。SyncTrain 会在后台生成并缓存远程图片和视频的缩略图，让你快速预览内容。

流媒体播放的体验出乎意料地流畅。我测试了从家里 NAS 上串流音乐和视频，只要网络连接稳定，几乎感受不到明显的缓冲。开发者在最新版本（v2.4）中还改进了不稳定连接下的流媒体表现。

### 照片自动备份

如果你像我一样不太信任 iCloud，更倾向于把照片存到自己的服务器上，SyncTrain 的照片备份功能可以帮你实现这个需求。设置好之后，新拍的照片会自动导出到指定的 Syncthing 文件夹，然后通过 Syncthing 的分布式同步网络传到你的其他设备上。配合 [[PhotoPrism]] 或者 Immich 这样的自托管相册服务，就是一套完整的去中心化照片管理方案。

### Apple Shortcuts 集成

iOS 的后台限制是所有 Syncthing 客户端绕不开的问题——App 不在前台时，同步就基本停了。SyncTrain 通过集成 Apple Shortcuts 提供了一个聪明的变通方案。你可以设置自动化规则，比如在每天早上连上 Wi-Fi 时自动打开 SyncTrain 触发同步，或者在特定时间点运行同步任务。虽然这不能完全替代 Android 上那种始终在线的同步体验，但已经是 iOS 平台上能做到的最好方案了。

### iOS Files App 集成

同步到本地的文件和文件夹会自动出现在 iOS 的文件 App 中。这意味着你可以从任何支持文件 App 的应用中直接访问 Syncthing 同步过来的文件，不需要先打开 SyncTrain。比如用 [[Obsidian]] 打开 Syncthing 同步的笔记库，或者用 PDF 阅读器直接打开同步过来的文档。

## 技术架构

对于关心底层实现的人来说，SyncTrain 的架构设计值得了解。App 前端用 Swift 和 SwiftUI 编写（占代码库的 65.5%），后端核心是一个叫 SushitrainCore 的 Go 语言框架（16.1%），这个框架直接嵌入了 Syncthing 的代码。Swift 和 Go 之间通过 gomobile 生成的 Objective-C 绑定进行通信。

由于 gomobile 不能桥接所有的 Go 类型（比如切片和数组），SushitrainCore 只暴露简单类型，复杂数据通过"字符串列表"类型进行迭代传递。这种设计虽然有些取巧，但在实际使用中运行稳定，开发者已经在生产环境中持续使用了一年多。

值得一提的是，开发者一直在努力将他对 Syncthing 的修改合并回上游代码库，避免维护一个单独的分支。这种对开源社区负责任的态度让人敬佩。

## 使用中的注意事项

### iOS 后台同步限制

这是最需要理解的一点。由于 iOS 系统的限制，SyncTrain 只有在前台运行时才能可靠地同步。后台同步大约每小时运行一次（充电时频率更高，电池供电时只有几分钟）。如果你需要实时同步，需要保持 App 在前台打开，或者利用前面提到的 Apple Shortcuts 来定期触发。

SyncTrain 提供了一个贴心的功能：如果后台同步在你设定的时间内没有运行，会发送通知提醒你手动打开 App。

### 选择性同步的重命名问题

当本地文件被重命名时，Syncthing 会将其视为"删除旧文件 + 创建新文件"。在选择性同步模式下，原来选中的文件会消失（被删除了），而新文件会被默认的 `*` 规则忽略。SyncTrain 会通过"多余文件"的提示来处理这种情况，但体验不够无缝。远程设备上的重命名也存在同样的问题。

### 不是备份工具

开发者明确提醒：不要把 SyncTrain 当作备份工具使用，始终保留你数据的备份。Syncthing 本身就是一个同步工具而非备份工具，这个原则在移动端同样适用。

## 安装和配置

SyncTrain 可以在 [App Store](https://apps.apple.com/us/app/synctrain/id6553985316) 上免费下载，支持 iOS 17.0 及以上版本，同时也有 macOS 版本（需要 macOS 15.0 以上）。

安装后的配置流程和标准 Syncthing 类似：

- 打开 App，会自动生成一个设备 ID
- 在你的其他 Syncthing 设备上添加这个设备 ID
- 选择要共享的文件夹
- 在 SyncTrain 上接受文件夹邀请
- 根据需要开启选择性同步

如果你已经在使用 Syncthing，整个过程几分钟就能搞定。新版本还增加了引导界面，对首次使用 Syncthing 的用户也很友好。

App 支持包括简体中文、日语、英语在内的多种语言，界面本地化做得不错。

## 我的使用场景

分享几个我日常使用 SyncTrain 的场景，也许能给你一些灵感。

我把 Obsidian 的笔记库通过 Syncthing 在多台设备间同步，SyncTrain 让我可以在 iPhone 上随时查看和编辑笔记，配合 iOS 的 Obsidian App 使用体验相当不错。之前用 Möbius Sync 时经常遇到同步冲突，换到 SyncTrain 之后基本没有再出现过这个问题。

音乐串流是另一个高频场景。我在 NAS 上用 [[Navidrome]] 管理音乐库，有时候也会直接用 SyncTrain 串流 NAS 上的 FLAC 文件，音质和体验都不错，省去了额外搭建流媒体服务的麻烦。

出差时，我会提前用选择性同步把需要的文档和资料拉到手机上，离线也能访问。回来后取消选择，文件自动清理，不浪费手机存储。

## 最后

SyncTrain 解决了困扰我多年的一个问题——在 iOS 上优雅地使用 Syncthing。它不仅仅是 Möbius Sync 的替代品，更是一次对"iOS 上的 Syncthing 体验应该是什么样"的重新思考。选择性同步、流媒体播放、照片备份这些功能的加入，让 Syncthing 在移动端的可用性有了质的飞跃。

更让人感动的是，这是一个完全免费、开源的项目。开发者明确表示无意从中盈利，纯粹是出于个人需求才做了这个 App。在一个到处充斥着订阅制和付费墙的时代，这种精神尤为可贵。如果你是 Syncthing 用户并且使用 iPhone，SyncTrain 几乎是目前唯一值得推荐的选择。如果你还不是 Syncthing 用户但对自托管文件同步感兴趣，SyncTrain 的出现也许正好是一个入坑的好时机。

## 相关链接

- [SyncTrain App Store](https://apps.apple.com/us/app/synctrain/id6553985316)
- [GitHub 仓库（Sushitrain）](https://github.com/pixelspark/sushitrain)
- [开发者博客](https://t-shaped.nl/posts/synctrain-a-rethought-ios-client-for-syncthing)
- [[Syncthing]]
- [[PhotoPrism]]
- [[Navidrome]]
