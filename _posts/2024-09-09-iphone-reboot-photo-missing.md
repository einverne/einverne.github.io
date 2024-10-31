---
layout: post
title: "iPhone 重启之后照片丢失及解决方案"
aliases:
- "iPhone 重启之后照片丢失及解决方案"
tagline: ""
description: ""
category: 经验总结
tags: [ iphone, iphone-bug, ios-bug, ios,  ]
create_time: 2024-09-10 09:35:52
last_updated: 2024-09-10 09:35:52
dg-home: false
dg-publish: false
---

昨天手机选择照片的时候一直都是转圈，怎么都选不出来，索性就重启了一下手机，但是没想到的是重启完手机，我发现最近的照片全部都找不到了，8 月 31 号之后的所有照片在我的本地相册中全部找不到了，最后一张照片就是 10 多天前拍摄的了，大叫不好。

然后我就去 Google 查了一下发现， iOS 17.4.1 确实存在系统级的 BUG，在官方的论坛里面，搜到了无数的人反馈相同的问题，触发的情况全部都是重启手机之后，最新的照片找不到，有一些是丢失了前半天拍摄的内容，有一些丢失了几天，也有像我这样丢失了接近 10 天照片的情况。

所以就开始寻找解决办法，我首先尝试了从 iCloud 中能不能恢复，但是不清楚为什么 iCloud 最近的照片没有备份，所以恢复也不存在。

然后我就去晚上搜索解决方案，所有的官方帖子，官方客服都没有任何有用的回复，但是在一个帖子下面，我看到有人留言，说可以通过一款叫做 ITOOLS 的管理软件，通过重置 photo meta 之类的重建 iPhone 的索引之类的，所以我就去试一下，因为 ITOOLS 没下载到，就使用了爱思助手，用 USB 连接手机之后，然后在文件管理器中，恰好被我看到了 DCIM，这个文件里面存储的全部都是手机拍摄的照片，然后我就按照最新的目录一个个打开看。

果不其然，Photo 应用中显示不出来的照片，在这个目录中全部存在，然后就利用 ITOOLS 提供的导出功能，先将照片导出到 Mac 的磁盘上，防止再出现意外。

## 教训

经过这一教训，虽然没有丢失什么重要的数据，但是也敲响了警钟，iPhone 虽然相对来说稳定，但也不是 100% 靠谱，这两年使用 Apple 的产品也遇到了奇奇怪怪的问题，比如，[休眠之后重新使用黑屏](https://blog.einverne.info/post/2021/03/repair-macos-smc-nvram.html)， [macOS 时区和时间错误](https://blog.einverne.info/post/2023/11/macos-wrong-datetime-zone.html), 所以最终还是需要自己做好重要数据的备份。

### iCloud

随时随地使用 iCloud 备份，虽然我买了 2T 的套餐，但是 iCloud 在手机上却还是会不定期的罢工。

### NextCloud

不久之前配置了一下 iOS 上使用 NextCloud 自动备份照片，虽然效果不错，但是在 iOS 上这些第三方应用始终不能很好的后台运行，所以经常需要打开应用手动进行同步，所以后面就怎么继续。

### Google Photos

在 Android ，iOS 都用过很长一段时间的 Google Photos，但是从去年购买了 iCloud 开始就冷落了 Google Photos，但看起来 Google Photos 还可以捡起来，当作一个备份也不错。
