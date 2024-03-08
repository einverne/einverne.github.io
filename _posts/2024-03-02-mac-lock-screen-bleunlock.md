---
layout: post
title: "借助 BLEUnlock 实现 macOS 自动锁定"
aliases:
- "借助 BLEUnlock 实现 macOS 自动锁定"
tagline: ""
description: ""
category: 产品体验
tags: [ mac, macos, mac-application, bluetooth, ble-device, apple-watch ]
create_time: 2024-03-04 18:05:09
last_updated: 2024-03-04 18:05:09
dg-home: false
dg-publish: false
---

[BLEUnlock](https://github.com/ts1/BLEUnlock) 是一款 macOS 上的自动化锁屏工具，可以通过 iPhone 或者 Apple Watch 和 macOS 的距离来锁定和解锁 macOS。

借助这款开源的工具，就可以非常方便地解决离开 macOS 忘记锁屏的问题。

## BLE devices

BLE devices 指的是低功耗蓝牙设备。

BLEUnlock 的原理就是通过周期性发送信号的 BLE 设备，当蓝牙设备，比如 iPhone 设备，接近 macOS 系统时就会解锁，当发现 iPhone 远离的时候就会自动锁定。

## 安装

直接通过 Homebrew 安装

```
brew install bleunlock
```

安装完成之后，可以在状态栏进行设定

- 是否靠近时唤醒
- 唤醒时是否直接解锁
- 锁定时是否暂停播放
- 等等

## 缺点

BLEUnlock 毕竟是通过蓝牙来进行通信的，所以可能会存在一定的不精确，尤其是在电脑附近行走时可能会对 macOS 产生干扰。