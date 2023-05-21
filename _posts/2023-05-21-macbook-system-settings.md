---
layout: post
title: "macOS 自定义系统设置记录"
aliases:
- "macOS 自定义系统设置记录"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, macbook ]
create_time: 2023-05-21 14:40:00
last_updated: 2023-05-21 14:40:00
---

因为电脑空间告警，所以用 Clean Me 这个应用对系统进行了一次清理，没想到的是，可能在我误操作的情况下把我系统的设置和全部软件的设置都给清空了。我所有的系统配置都恢复了初始的状态，让我使用起来非常变扭，我在之前有写过一篇 [MacBook 初始化和应用安装](/post/2020/07/macbook-pro-initial-setup.html) 的文章，但是那篇文章写的比较啰嗦，索性就重新整理一下。

下面的内容会按照常用的功能来划分。

## Keyboard

首先在 Input Sources 中添加 Rime 输入法。

Touch Bar 设置成默认 Fn 键

Touch Bar shows -> F1, F2, etc. Keys

在 Shortcut 中将 Spotlight 的快捷键取消，因为我使用 [[Raycast]]。

## Desktop & Dock

- Reduce size
- Automatically hide and show the Dock

在设置 Desktop & Dock 设置的时候看到了一个新的设置 Stage Manager，查了一下是 macOS 最早在 iPad 上引入的多窗口管理方式。

Stage Manager 基本是一个单窗口模式，点击一个应用就会集中到该窗口上，其他的应用会被移动到左边。用户可以将应用拖入到当前的工作区中，然后形成多个应用窗口的组合。

说实话我不知道 Apple 在 macOS 桌面版引入这样的窗口管理模式的目的，只是为了配合 iPad 触摸屏的操作方式？虽然我承认 macOS 上的窗口切换本来就有很多问题，我是通过

![](https://photo.einverne.info/images/2023/05/21/9Si9.png)
