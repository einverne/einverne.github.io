---
layout: post
title: "我买了一台打印机 TS3330"
aliases:
- "我买了一台打印机 TS3330"
tagline: ""
description: ""
category: 经验总结
tags: [printer, hardware, office, ]
create_time: 2023-11-22 17:02:37
last_updated: 2023-12-22 17:02:37
---

因为时不时需要有打印和复印的需求（日本政府总有一些奇怪的手续需要提供纸质的材料），之前看到有人出家用打印机就用 3000 JPY 买了一台，这是一台 Canon TS3330。下面记录一下我自己的初始化过程以及更换墨盒的过程，以备自己后续查看。

## 产品介绍

佳能打印机 A4 喷墨多功能 PIXUS TS3330 白色 Wi-Fi 兼容。

![u8N9](https://pic.einverne.info/images/2024/01/22/u8N9.png)

墨盒

- BC-345XL 黑
- BC-346XL 彩色

## 说明书

canon ts3330 説明書

或者访问 <https://ij.start.canon> 访问，然后查询型号，查看交互式教程。

或者直接访问 [TS3330](https://ij.manual.canon/ij/webmanual/Manual/All/TS3300%20series/SC/CNT/Top.html) 的手册。

以防万一，我也做了一个[备份](https://pic.einverne.info/images/d--eYFD5gG.pdf)。

## 安装墨盒

首先将打印机连接电源，然后按下电源键启动。等待启动完成，将打印机前部分的往下拉开。

![UgxBqxXkrN](https://pic.einverne.info/images/UgxBqxXkrN.jpg)

然后就能看到墨盒的位置

![YYHTclROSX](https://pic.einverne.info/images/YYHTclROSX.jpg)

左边是彩色的，右边是黑白的。

安装的时候有一定的倾角。

![t4VWBYm5Q_](https://pic.einverne.info/images/t4VWBYm5Q_.jpg)

安装的时候需要有一个向上的按压操作。

![vw0A83XezT](https://pic.einverne.info/images/vw0A83XezT.jpg)

直至两边对齐

![igvITLPQeI](https://pic.einverne.info/images/igvITLPQeI.jpg)

## 连接 WiFi 通过网络打印

### 使用 macOS/Windows 完成初始化

访问 <https://ij.start.canon> 下载桌面版的应用，根据应用上的提示完成 WiFi 初始化。

### 使用 iPhone 手机初始化连接

- 首先到应用市场中下载 Canon 打印
- 然后长按打印机上手机样子的按钮，直到屏幕中出现闪烁的 WiFi 图标

![xfEiARCT73](https://pic.einverne.info/images/xfEiARCT73.png)

- 等待出现 Canon 字样的 WiFi 热点，然后使用手机连接
- 打开 Canon 打印，根据提示完成 WiFi 密码的输入，完成设置

## 使用

当完成 WiFi 连接之后，打印机在本地网络中就会存在一个 IP 地址，直接通过浏览器访问这个 IP 地址，可以对打印机进行一些管理。比如

- 设置打印机名字
- 查看墨水的剩余量
- 清理
- 升级固件
- 设置语言
