---
layout: post
title: "iPhone 15 Pro Max 初始化及单手操作设置"
aliases:
- "iPhone 15 Pro Max 初始化及单手操作设置"
tagline: ""
description: ""
category: 产品体验
tags: [ iphone, iphone15,  ]
create_time: 2024-10-25 11:19:40
last_updated: 2024-10-25 11:19:40
dg-home: false
dg-publish: false
---

虽然 iPhone 发售了 16，但是看了一圈测评，所以感觉并没有太大的必要升级，所以在大家换机的时候，收了一台二手的台版 iPhone 15 Pro Max 512GB，花了 13.5 万日元。这篇文章就记录一下初始化以及在大屏的 iPhone 上的一些方便单手操作的设置，因为之前一直使用都是[小屏幕](https://blog.einverne.info/post/2022/07/iphone-13-review-and-setup.html)手机，所以一拿到之后，还感觉有一点陌生，6.7 英寸的屏幕在单手操作方面确实是有一点不方便，大部分情况都需要两手握持。

## iPhone 初始化

因为所有的应用已经在之前的设备上安装了，所以在新设备上就直接通过「快速迁移」来初始化，但是我实际操作，以及[对比了 iPhone 迁移的几个方案](https://www.einverne.info/post/641.html)之后，发现 iPhone 自带的，iPhone 到 iPhone 点对点数据迁移，可用性有一点低 ，因为之前不太清楚手机到手机迁移，以及 iCloud 云端恢复的差异，所以就直接选择了点对点传输，但是尝试的第一次，在传输的过程中连接断开了，新的 iPhone 直接进入不了系统，然后屏幕上只有抹除数据重新再来，然后又尝试了第二遍，同样发生了错误，「无法完成数据传输」，只能「还原 iPhone 以重新开始设置」。

![mv9baNdj4t](https://pic.einverne.info/images/mv9baNdj4t.png)

重试了两次「从另一台 iPhone 恢复」失败之后，我开始研究 iPhone 快速开始的[方案](https://www.einverne.info/post/641.html)，总体有

- 手机点对点，WiFi 传输
- 通过 iCloud 云端恢复 iPhone 资料
- 通过数据线连接
- 或者通过 iTunes 备份和恢复

而我尝试第一种从附近的 iPhone 传输两次均失败，所以尝试从 iCloud 云端恢复，好在睡觉前放着恢复，早上起来已经可以进入系统了，但是下载 50+GB 的数据却用了一整个白天。下次一定要试试直接使用数据线连接，不知道会不会快一些。

### Wallet 迁移

在迁移的过程中，会自动识别之前手机绑定的 Apple Pay 中的卡片，但是所有的卡片都需要重新进行验证，包括 CVV 安全码，以及绑定的手机号。不过 Suica 和 Pasmo 可以无缝的迁移。

### eSIM 迁移

我之前手机是使用的 SoftBank 实体 SIM 卡，但是在迁移的过程中，因为新手机支持 eSIM，惊喜的发现，自动将实体卡迁移成了 eSIM 卡，过程也非常简单，直接点点点，同意就完成了。

## iOS 系统自带的单手操作设置

虽然 iPhone 本身就自带半屏幕的单手操作模式，直接在屏幕下方屏幕底部边缘（小横条附近）向下轻扫就可以让屏幕下降半屏，但是说实话这个下滑的操作在单手操作下本身就不是很方便，并且对于我这样手比较小，手指比较短的人来说，即使下降半屏，我的大拇指去够到左边提一个图标也很费劲。

另外 iOS 的返回只能从左边屏幕边缘向右滑动，而我个人通常都是习惯使用右手，单手操作的情况下又是一个非常困难的操作。

但是仔细地检索和了解了一下之后，发现 iOS 在系统级别的返回还是很难实现，所以只能勉强通过如下的方式来弥补一些。

- 因为目前 iPhone 已经取消了 Home 键，所以改成了「屏幕底部边缘（小横条附近）向下轻扫」将屏幕内容下移,方便触及顶部区域。
- 系统设置，AssistiveTouch，可以在屏幕上添加一个虚拟 Home 键，并自定义快捷操作，比如我添加了点击打开「通知中心」，双击打开「控制中心」，长按截图
- Back Tap，可以通过轻拍手机背面来触发某些操作，双击后背，或者三击后背，但是这个操作实际上使用起来也不是非常方便。
- 单手键盘模式:长按键盘上的地球图标可以激活单手键盘。
