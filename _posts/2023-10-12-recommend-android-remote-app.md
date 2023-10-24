---
layout: post
title: "推荐几个 Android 远程控制应用"
aliases:
- "推荐几个 Android 远程控制应用"
tagline: ""
description: ""
category: 整理合集
tags: [ android, remote-control, remote, remote-desktop, vnc, mac ]
create_time: 2023-10-12 13:01:59
last_updated: 2023-10-12 13:01:59
---

过年回家的时候给老妈的手机安装上了 [[AnyDesk]]，为的就是防止她不知道在手机上如何操作的时候，我可以给她远程操作，或者指导她自己操作完成。现在快过去一年了，正好也来总结一下，顺便再推荐几个可以尝试的方案。

## 首推 AnyDesk

AnyDesk 是我继 [[TeamViewer]] 商业化太严重之后一直用到现在的远程桌面控制的方案，最初的时候我只是想在 Linux 上完成运行，就发现了 AnyDesk，但是使用之后发现全平台的使用体验都非常不错。

- 不需要帐号，每个设备会有一个唯一的编码（一串数字）
- 通过输入数字就可以连接到另外一台安装了 AnyDesk 的设备

我自己体验过从 macOS 连接 Linux（Ubuntu），Windows，画质和操作都未出现过明显的问题。

## 其他远程桌面应用

- 向日葵
- [[TeamViewer]]
- [[AirDroid]] [AirDroid](https://www.airdroid.com/)

## 共享会议

如果是稍微懂得一些计算机的用户，不妨可以尝试一下会议软件，比如

- 腾讯会议
- Zoom
- Teams

这些会议软件一般设置比较麻烦，也只能共享桌面，少部分能进行远程控制的，也经常出现卡顿的情况。

## 其他

## 开源方案

- [[Scrcpy]] [scrcpy](https://github.com/Genymobile/scrcpy) 是一个 Android 屏幕镜像，以及控制的开源应用，借助 adb shell，可以远程进行控制。
  - [ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy) 直接在浏览器中操作，不需要依赖于客户端
- [[RustDesk]] [RustDesk](https://rustdesk.com/zh/) 是一个远程控制的开源项目。
