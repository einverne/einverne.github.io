---
layout: post
title: "macOS 上强大的窗口管理工具 1Piece"
aliases:
- "macOS 上强大的窗口管理工具 1Piece"
tagline: ""
description: ""
category: 产品体验
tags: [1piece, window-manager, contexts, mac-app, macos, mac-application]
create_time: 2024-11-20 16:54:03
last_updated: 2024-11-20 16:54:03
dg-home: false
dg-publish: false
---

之前的[视频](https://www.youtube.com/@einverne)和文章大部分都是介绍 AI 相关的工具，今天来介绍一点不一样的效率工具，就是一款 macOS 上的窗口管理工具。

但说实话 macOS 上的窗口管理工具其实以及非常多了，比如我之前一直使用的收费的 [[Contexts]]， [[Lasso]]，还有开源的仿 Windows 切换的 [[AltTab]]，纯 Swift 实现的 [[Loop]]，还有一些分屏的应用，比如 [Moom](https://manytricks.com/moom/), [Rectangle](https://rectangleapp.com/)等等，

- 还有一些比如 [Swish](https://highlyopinionated.co/swish/) 是通过触摸板来控制窗口的分屏，全屏，关闭等操作
- 或者有些人还会使用 Raycast 等一些工具来解决窗口管理的简单需求。
- 如果熟悉 Linux 上的平铺式窗口管理的方式，可能还会了解到 [[Amethyst]] ，[[yabai]] 这样的一些解决方案
- 更进阶一些的用户会使用 Hammerspoon 配合 Lua 脚本来实现窗口管理。

但是今天要介绍的不需要高强度的配置，也不需要死记很多的快捷键，几乎就是上手就可以使用，今天的主角就是 1Piece。

[1Piece](https://app1piece.com/) 是一个 macOS 上的窗口管理工具，但是 1Piece 免费，并且设定非常丰富，完全可以代替 Contexts。

## 功能

- 窗口列表管理，可以通过自定义快捷键切换窗口，关闭窗口，移动窗口到另外的屏幕
- 显示窗口缩略图，可以调整窗口大小，重新定位，或者移动窗口
- 屏幕热角，鼠标移动到屏幕角落可以触发
- 特定位置设置鼠标操作，比如在窗口标题栏和选项卡等地方
- 可以快速切换到上一个窗口
- 设置最喜欢的窗口，一键切换
- 可以通过快捷键后移窗口
- 设置快捷键可以实现焦点窗口的移动，比如在并排的两个窗口之间切换定位光标
- 应用程序菜单栏快捷键
- 隐藏显示 Dock
- 调整窗口大小和位置
- 可以通过双击修饰键来快速启动任务，配合 Apple Script 或者 Automator 工作
- 支持 QuickTime 播放器扩展，屏幕截图扩展，隐藏所有程序扩展等等

## 使用

从 [1Piece](https://app1piece.com/) 官网下载应用并安装，在应用的设置中配置自己熟悉的触发快捷键。

### Windows List

1Piece 提供了比 macOS 系统默认切换更好用的窗口切换列表，不仅标记了所在桌面，Space，还可以快速通过搜索来定位需要切换的应用。

![PBpL](https://photo.einverne.info/images/2025/05/27/PBpL.png)

### Desktop Windows

可以通过 Option + Cmd + Tab 来切换窗口，还可以将窗口直接移动到另外的显示器中。

![PH23](https://photo.einverne.info/images/2025/05/27/PH23.png)

### 窗口管理

可以通过快捷键来管理窗口，1Piece 提供了非常多的窗口管理

![PmbY](https://photo.einverne.info/images/2025/05/27/PmbY.png)

### Hot Corner

1Piece 还增强了系统的 Hot Corner 功能，可以自定义成任何动作。

![Pewp](https://photo.einverne.info/images/2025/05/27/Pewp.png)
