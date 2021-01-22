---
layout: post
title: "Android 电视盒子可用的应用备份"
tagline: ""
description: ""
category: 整理合集
tags: [android, tv, adb, packages, apk, applications, ]
last_updated:
---

用盒子也已经很多年了，几年来家里，自己用，也积累了一些常用的应用。这两天又拿到了 T1 盒子，又才想起来整理这样一份单子，这样不用每一次都一遍一遍的尝试了。记得以前 VST ，泰捷视频都还很不错的时候，再后来广电发了禁令，再后来这片市场混乱发展，各家大型网站优酷，爱奇艺又不敢公开大搞，却又在背后偷偷摸摸。再到现在几乎被什么芒果，CIBN 垄断，内容没什么可看，却什么都要收费。我始终抱有一个观点，如果电视盒子这一块开放发展，国内的厂家完全能够占领全世界的盒子市场，好几年前用的 Android 盒子就已经能够满足我的大部分需求，并且应用设计也早 Google 自己推出 Android TV 盒子以及规范 Android TV 应用好多年。可惜这一块市场被一道禁令打到了地下。

Android 盒子安装应用的方法，大概可以分为这几个：

- 局域网拷贝 APK
- 用 U 盘连接电视
- 沙发管家，或者当贝市场中安装
- 局域网 adb 安装

当然对于一个新的设备，通过 adb 安装一个应用市场，然后通过应用市场下载其他应用是最简单的方式。

## 市场
Apple 有 App Store， Google 有 Play Store，电视盒子直到现在依然还在乱斗：

- 奇珀市场 http://down.7po.com/
- 沙发管家 http://www.shafa.com/
- 当贝市场 智能电视应用市场
- 欢视商店
- 蜜蜂市场

地址就不都给了，Google 搜一下很快。

## 直播
电视直播的应用，以前用 VST 和 泰捷还行，不过现在已经废了，然后现在 HDP 做的也还不错。

2018 年 3 月 3 号更新，发现了一款叫做 **超级直播** 的应用，非常好用。使用超级直播的时候，在播放页面点击设置，然后选择 “二维码扫一扫开启更多功能”，并在二维码显示之后，连续多次点击出现的二维码多次，即可解锁隐藏功能。隐藏功能开启 6000 以后的频道，包括可以查看多个台湾、香港的频道，频道范围在 6xxx  可能上下有些偏差，65xx 开始会有抢先观看的电影。

一下排名按照易用程度：

- 超级直播
- HDP 直播
- 直播狗
- 小薇直播
- 电视家 3.0
- 枫蜜直播

放一张截图

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/J06gea" title="斐讯 t1_直播"><img src="https://farm1.staticflickr.com/898/41398289612_b34704693f_z.jpg" alt="斐讯 t1_直播"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## 网络视频
网络视频是我用的最多的了，我本人用 哔哩哔哩 最多

- bilibili，哔哩哔哩 tv 版本有两个，其中一个叫做云视听小电视，这个是无法观看 UP 主上传的视频的，你需要一个超级老的版本才可以，后文自行寻找
- 人人影视 TV 版
- 云视听小电视
- 银河奇异果
- 云视听极光
- CIBN 高清影视
- CIBN 聚精彩
- VST
- 泰捷
- 南瓜电影
- 蜜蜂视频

## 本地视频
盒子带 samba ，能读局域网内 samba 共享的视频，那就需要一个本地播放器，最好支持的解码格式越多越好，在 Android 手机上我买过 MX Player Pro，不过免费的 KMPlayer 也不错。

- Kodi，不得不请出这个大杀器了，All in one 既能作为本地播放器，也能使用 Samba，NFS 等等协议播放局域网中的视频，同样能够作为 DLNA 服务端作为投屏工具
- ES 文件管理器
- 小白文件管理器 v1.2 版本
- MX Player Pro

## 系统工具
说到乐播投屏这个应用，还是我去实体店，然后有一个店员向我展示一个只有魔方大小的投影仪时，用的应用，将手机的屏幕投影到投影仪上，我就记住了这个投屏应用，回来发现，iOS 投屏还是不错的。

- 当贝桌面
- 乐播投屏，老版本无广告，非常清爽
- 悟空遥控

## 其他
其他体验还不错的应用：

- Keep TV
- 小鸡模拟器 TV 版

## 在 Android TV 上使用 YouTube
今天突然想到，我平时看的最多的 YouTube ，是有电视版的啊，最近又把路由器更新了一下，局域网使用 YouTube 完全没问题啊，然后就下载了几个 YouTube for TV 的应用，发现只有下面这一个不需要依赖 Play Service，然后，在侧边栏设置中，有一个关联码，和手机关联，然后就可以非常轻松的将手机上的 YouTube 视频投送到电视盒子上，然后再到投影仪上。太舒服了。

YouTube for TV

版本：1.12.10
发布时间：2018-01-12

下载地址： <https://apkpure.com/youtube-tv-watch-record-live-tv/com.google.android.apps.youtube.unplugged>


## 网上下载不到的应用备份

- bilibili 等 <https://app.box.com/s/vgvjeptnzg0ubnkeb6urku93xsafk28b>
