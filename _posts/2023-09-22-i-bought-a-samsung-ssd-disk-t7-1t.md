---
layout: post
title: "我买了一块 1TB 的便携移动硬盘 三星 T7"
aliases:
- "我买了一块 1TB 的便携移动硬盘 三星 T7"
tagline: ""
description: ""
category: 产品体验
tags: [ samsung, ssd, t7, hard-disk ]
create_time: 2023-09-23 14:07:11
last_updated: 2023-09-23 14:07:11
---

笔记本电脑用了 3 年多，各种媒体材料，尤其是音乐我喜欢放在本地，以及各种应用程序基本上已经把磁盘自带的空间占满了，这两天刚好看到日亚有促销活动，可能是看我之前搜索过 SanDisk E61，E81 ，所以推荐里面直接推送了一个三星的 T7，看了一下价格只要 10600 JPY，用 [Keepa](https://japan.einverne.info/p/107.html) 对比了一下历史价格，以及京东上的价格，感觉还挺合适的，就下了单。

## 外观

我原本预想就很小，但是到手发现是真的小，和信用卡比了一下，正好是一张信用卡大小，感觉是产品设计的时候特意的，因为和信用卡放在一起也几乎看不出来。

![UeO8.jpg](https://photo.einverne.info/images/2023/09/23/UeO8.jpg)
外观

![Uryn.jpg](https://photo.einverne.info/images/2023/09/23/Uryn.jpg)
几乎只有 1/3 的硬币直径。

![UQx6.jpg](https://photo.einverne.info/images/2023/09/23/UQx6.jpg)

可以看到 T7 的厚度几乎和 iPhone 13 一致。

![UH39.jpg](https://photo.einverne.info/images/2023/09/23/UH39.jpg)
和 iPhone 相比，大小也非常小。

![UBA0.jpg](https://photo.einverne.info/images/2023/09/23/UBA0.jpg)

![XT1c.jpg](https://photo.einverne.info/images/2023/09/23/XT1c.jpg)
手持大小。

## 说明

直接看网上的 [电子说明书](https://download.semiconductor.samsung.com/resources/user-manual/Samsung_Portable_SSD_T7_Shield_User_Manual_Chinese_ver_1-1_10129203010539.pdf)

T7 默认情况下已经格式化成 exFAT 格式，兼容 Windows，macOS，Android 系统。用户也可以根据自己的常用系统自行格式化。

| 文件格式      | Windows 系统 | macOS      |
| ------------- | ------------ | ---------- |
| exFAT         | 读取和写入   | 读取和写入 |
| NTFS          | 读取和写入   | 仅读取     |
| HFS/HFS+/APFS | 无法读取     | 读取和写入 |

Samsung T7 可以用自带的软件实现磁盘加密。

## 测速

使用 Disk Speed Test 在 macOS 下测试速度，虽然没有达到理论速度 1050 MB/s ，但日常使用也够了。

![XVzy](https://photo.einverne.info/images/2023/09/23/XVzy.png)

## 总结

买这一块 1T 的固态也只是用来做一下应急处理，主要是家里的 NAS 没有带在身边，而使用普通的硬盘处理 Lightroom 中的照片也略慢，所以临时用这一块固态硬盘来应急一下。如果是存储重要的资料，我个人还是会用类似 [Duplicacy](/post/2021/06/duplicacy-backup-tool-usage.html) 等增量备份工具多地备份一下的。更具体的可以参考之前的[备份方案](/post/2020/01/backup-data-and-system.html)。
