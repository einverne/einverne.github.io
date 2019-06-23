---
layout: post
title: "OnePlus 7 pro Oxygen OS 设置"
tagline: ""
description: ""
category: 经验总结
tags: [oneplus7-pro, oxygen-os, rom, tweak, ]
last_updated:
---

这些年用 Android 下来总是最喜欢原生的系统，但是却总觉得缺少一些什么，而这些东西在用 Oxygen OS（后简称 OOS）之后发现竟然如此的贴心好用，甚至有一定程度上要超越 Google 原生的系统。比如一些非常不错的小功能，状态来显示网速，三指截屏等。


## OOS 自带

- 内置录屏，虽然是一个使用频率不高的功能，但需要起来就能使用还是很不错的
- 三指截屏，滚动获取长截图，以前多屏长截图需要额外的软件支持，自带还是很贴心的
- 翻转静音
- 可选虚拟按键，本人一直喜欢虚拟按键，但是用过 OOS 的 Navigation 手势之后发现原来真的可以不用常驻的虚拟键，虽然 OOS 的返回依然有些难用，但是也是一个不错的选择。

## 界面 Tweak

- 电量显示百分比，默认情况下电量只会显示一个电池，并不会显示百分比，可以在设置中开启
- 状态栏显示网络速度，设置开启

使用 GravatyBox 调整

- Statue Bar 支持滑动调整亮度，OnePlus 7 Pro 的自动调亮似乎总是把屏幕亮度调低
- 状态栏显示下载进度条
- 显示上传下载网速，可选，和 OOS 原生类似


## Android 9.0 uses xposed solutions


- https://github.com/solohsu/EdXposed/releases
- https://github.com/RikkaApps/Riru/releases
- https://github.com/ElderDrivers/EdXp...nager/releases
- https://github.com/solohsu/XposedInstaller/releases

Use Magisk order to install

1. Flash magisk-riru-core-arm-arm64-v10.zip
2. Flash magisk-EdXposed-arm-arm64-v x.x_beta-release.zip
3. Installation XposedInstaller_by_dvdandroid_19_10_18. apk

Reboot the device

Android Pie 在 EdXposed 下可用的模块列表

- <https://forum.xda-developers.com/xposed/list-xposed-modules-android-pie-ed-t3892768>


## reference

- <https://forum.xda-developers.com/xposed/android-9-0-xposed-solutions-t3889513>
