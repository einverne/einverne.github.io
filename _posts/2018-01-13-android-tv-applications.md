---
layout: post
title: "Android 电视盒子可用的应用备份"
tagline: ""
description: ""
category: 整理合集
tags: [android, adb, packages,]
last_updated: 
---

用盒子也已经很多年了，几年来家里，自己用，也积累了一些常用的应用。这两天又拿到了 T1 盒子，又才想起来整理这样一份单子，这样不用每一次都一遍一遍的尝试了。记得以前 VST ，泰捷视频都还很不错的时候，再后来广电发了禁令，再后来这片市场混乱发展，各家大型网站优酷，爱奇艺又不敢公开大搞，却又在背后偷偷摸摸。再到现在几乎被什么芒果，CIBN垄断，内容没什么可看，却什么都要收费。我始终抱有一个观点，如果电视盒子这一块开放发展，国内的厂家完全能够占领全世界的盒子市场，好几年前用的 Android 盒子就已经能够满足我的大部分需求，并且应用设计也早 Google 自己推出 Android TV 盒子以及规范 Android TV 应用好多年。可惜这一块市场被一道禁令打到了地下。

Android 盒子安装应用的方法，大概可以分为这几个：

- 局域网拷贝 APK
- 用 U 盘
- 沙发管家，或者当贝市场中安装
- 局域网 adb 安装

当然对于一个新的设备，通过 adb 安装一个应用市场，然后通过应用市场下载其他应用是最简单的方式。

## 市场
Apple 有 App Store， Google 有 Play Store，电视盒子直到现在依然还在乱斗：

- 奇珀市场 http://down.7po.com/
- 沙发管家 http://www.shafa.com/
- 当贝市场 智能电视应用市场 

地址就不都给了，Google 搜一下很快。

## 直播
电视直播的应用，以前用 VST 和 泰捷还行，不过现在已经废了，然后现在 HDP 做的也还不错。

- HDP直播
- 小薇直播
- 电视家3.0

## 网络视频
网络视频是我用的最多的了，我本人用 哔哩哔哩 最多

- bilibili 
- 银河奇异果
- 云视听极光
- CIBN 高清影视
- CIBN 聚精彩
- VST
- 泰捷

## 本地视频
盒子带 samba ，能读局域网内 samba 共享的视频，那就需要一个本地播放器，最好支持的解码格式越多越好，在 Android 手机上我买过 MX Player Pro，不过免费的 KMPlayer 也不错。

- ES 文件管理器
- 小白文件管理器
- MX Player Pro

## 系统工具
说到乐播投屏这个应用，还是我去实体店，然后有一个店员向我展示一个只有魔方大小的投影仪时，用的应用，将手机的屏幕投影到投影仪上，我就记住了这个投屏应用，回来发现，iOS 投屏还是不错的。

- 乐播投屏
- 悟空遥控

## 在 Android TV 上使用 YouTube
今天突然想到，我平时看的最多的 YouTube ，是有电视版的啊，最近又把路由器更新了一下，局域网使用 YouTube 完全没问题啊，然后就下载了几个 YouTube for TV 的应用，发现只有下面这一个不需要依赖 Play Service，然后，在侧边栏设置中，有一个关联码，和手机关联，然后就可以非常轻松的将手机上的 YouTube 视频投送到电视盒子上，然后再到投影仪上。太舒服了。

YouTube for TV

版本：1.12.10
发布时间：2018-01-12

下载地址： <https://apkpure.com/youtube-tv-watch-record-live-tv/com.google.android.apps.youtube.unplugged>

