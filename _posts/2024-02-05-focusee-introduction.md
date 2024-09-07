---
layout: post
title: "macOS 屏幕录制应用 FocuSee 使用体验"
aliases:
- "FocuSee 屏幕录制工具使用体验"
- "macOS 屏幕录制应用 FocuSee 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [focusee, screen-recorder, video-cut, video-editor, ]
create_time: 2024-02-05 21:20:07
last_updated: 2024-02-05 21:20:07
---

在 macOS 下录制屏幕的工具有很多，可以使用系统自带的，也可以使用自带的 QuickTime Player，但是这两个自带的工具，可能都有一些限制，比如不能录制系统自带的声音。

后来我找到了一款用来起来比较舒服的录屏工具，也能够录制系统声音，Screen Recorder by Omi，但 Omi 在导出高清视频的时候有限制，当然如果比较愿意折腾也可以尝试一下 [[Open Broadcaster Software(OBS)]]，但今天我来介绍一款新的，操作和使用都比较简单的录屏工具 ---- [[FocuSee]]。

## 2024 年 8 月更新

深度使用 FocuSee 之后发现了 FocuSee 当前版本存在的一些致命的问题，那就是导出会造成的内存膨胀，以及莫名其妙的崩溃。

在使用的几次中，几乎有一半的视频导出存在问题，后来发现只要是我使用 FocuSee 自带的建议的剪辑工具，如果剪辑的内容比较碎片，或者是剪辑成片段之后调整过前后的时长，那么导出的时候极有可能无法完成，我遇到过一次将 macOS 内存用尽，一次到 14% 左右无条件应用退出的情况。

![yeV0](https://photo.einverne.info/images/2024/09/06/yeV0.png)
内存问题

![yrd9](https://photo.einverne.info/images/2024/09/06/yrd9.png)

虽然这两次都没有实质性地对我的数据产生损坏，但是剪辑花费的时间以及调整，向官方询问解决方案的时间我觉得都是浪费。所以后两次我基本上录制完成稍微做一下调整就会立即将视频导出。

FocuSee 录制的视频本地会存储一份 FocuSee 自身的格式，只能通过 FocuSee 读取，并且导出只能会员才能导出，这一点的话，目前来看是我的主要问题。

在遇到了两次问题之后，我需要考虑之后还是回归 OBS 和 Screen Recorder by Omi，或者等活动购买一下 [[Screen Studio]] 好了。

## FocoSee

[FocuSee](https://gemoo.com/focusee/?ref=blog.einverne.info) 是一款专注于屏幕录制的工具，之前有一款支持点击放大效果的录屏软件 [[ScreenFlow]]，FocuSee 同样也能达到。

![4kLX](https://photo.einverne.info/images/2024/02/05/4kLX.png)

特点：

- 自定义缩放特效，根据点击自动进行画面缩放
- 高亮内容，抓住用户的注意力
- 不同的点击特效
- 内置简易的视频剪辑以及速度编辑工具
- 自定义摄像头相框和滤镜
- 调整录制窗口的边距，圆角等
- 支持根据不同的社交媒体，导出不同的格式

启用权限

![42qi](https://photo.einverne.info/images/2024/02/05/42qi.png)

当完成录制之后会出现一个视频编辑器，在这个编辑器中可以做简单的编辑，还可以定义鼠标样式。

![4OP0](https://photo.einverne.info/images/2024/02/05/4OP0.png)

## 价格

FocuSee 的价格不低，但好在是买断制的。

![u1Sl](https://photo.einverne.info/images/2023/12/14/u1Sl.png)

相较于 [[Screen Studio]] 稍微便宜一点点。

平时有活动的时候可以以 34.9 USD 的价格购入。

## more

FocuSee 是一款收费的软件，你可以在[荔枝商城](https://gtk.pw/DzEs0)购买，如果你可以折腾那么，OBS 也有一个插件可以实现视频的缩放，可以使用 [Python 脚本](<[https://github.com/tryptech/obs-zoom-and-follow](https://github.com/tryptech/obs-zoom-and-follow)>)。可以参考这个[教程](https://www.youtube.com/watch?v=TUMpjm9lsGs)。

## related

- [[Screen Studio]]
- [[ScreenFlow]]
- [[Open Broadcaster Software(OBS)]]
- [[QuickRec]] 一款小巧的录屏应用，只有 1.5MB，还可以 iPad/iPhone 投屏录制。
