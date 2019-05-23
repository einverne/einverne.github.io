---
layout: post
title: "Linux 下的 Android emulators"
tagline: ""
description: ""
category: 整理合集
tags: [android, linux, emulator, ]
last_updated:
---

待办事项中一直有一个 Genymotion 模拟器的处理，挂在待办已经好几个月了，终于有时间来找一找 Linux 的安卓模拟器了， Genymotion 曾经很好用，可惜的是如今似乎已经收费。

## Official
当然第一想到的就是 Android 开发者官网上提供的官方模拟器，虽然早先被诟病不少，但是似乎更新迭代很快速，现在几乎没有什么特别大的问题。

## Anbox
这是我 Google 出来的第二个结果，他官网的标语就是可以再 GNU/Linux 系统上运行任何 Android 应用程序。根据官网的介绍， Anbox 和 Genymotion 的虚拟化不一样， Genymotion 是在操作系统上完整的虚拟化整个系统，而 Anbox 直接使用宿主机的硬件和内核来运行 Android 程序。目前 Anbox 没有可视化界面可以安装 Apk，可以使用命令 `adb install path/to/app.apk` 来安装。

Anbox 这个项目还是属于起步阶段，但是体验还是非常不错的，如果遇到安装之后无法打开，或者无法安装 `Failure [INSTALL_FAILED_NO_MATCHING_ABIS: Failed to extract native libraries, res=-113]` 这种错误时，也不沮丧。

如果要在 Anbox 中安装 arm 和 Google Play 可以参考这个[项目](https://github.com/geeks-r-us/anbox-playstore-installer)

官网地址：<https://anbox.io/>

## Genymotion
很可惜的是他已经不再提供免费的开发者 License。

官网：<https://www.genymotion.com/>

## reference

- <https://www.linuxuprising.com/2018/07/anbox-how-to-install-google-play-store.html>
