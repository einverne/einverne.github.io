---
layout: post
title: "我买了一个显示器：明基 EW2880U"
aliases:
- "我买了一个显示器：明基 EW2880U"
tagline: ""
description: ""
category: 产品体验
tags: [monitor, 4k-display, 4k-monitor, ]
create_time: 2023-11-23 16:09:34
last_updated: 2023-11-23 16:09:34
---

前段时间日亚会员日的时候，刚好看到一款显示器打折 Benq EW2880U 39800 日元，对比了一下之前调查的显示器，价格也比较合适，并且还自带音箱（虽然买的时候没有感觉有多么重要），但是后来不仅在 MacBook Pro 上使用，还购买了一台 Mac mini，相较于 Mac mini 自己的音箱，这个显示器的音箱至少好一些。

- Benq EW2880U 39800 JPY
- Dell S2722QC 39800 JPY
  - Dell U2720QM 140032 JPY - 16804pt
  - Dell U2723QX 49800
  - Dell U2723QE
- LG 27GN950
- ASUS PA279CV-J 45790 JPY

## 控制亮度和声音

Mac mini 连接外部显示器的时候，是不能直接通过系统的快捷键调整屏幕的亮度和声音的，但是通过这个开源的软件 [MonitorControl](https://github.com/MonitorControl/MonitorControl) 就可以实现。

```
brew install MonitorControl
```

![hG8r](https://photo.einverne.info/images/2023/11/23/hG8r.png)

## 色彩的问题

在我使用这款显示器最初的时候，因为本身用来办公比较多，大部分的时间都是看文字，所以还没有注意到起色彩的问题，基本上都是直接使用的默认设置。

![hloh](https://photo.einverne.info/images/2023/11/23/hloh.png)

直到有一天我打开了一个 [Bilibili 视频](https://www.bilibili.com/video/BV1Ny4y1c7Zz)。UP 主在室内拍摄的部分虽然是有一些暗，但是我在显示器上基本上只能看到一个人脸，而背后的房间基本上都是全黑的，我检查了一下显示器的设置，使用的标准色彩模式，然后开启了 HDR。我尝试关闭 HDR，调整色彩模式，然后去看 macOS 里面的 Color profile 设置的是否正确。

然后不断地对比 Benq EW2880U 显示器上的画面和 MacBook Pro 显示器上的画面，发现关闭 HDR，以及将显示器的色彩模式调整为 M-Book 的时候最接近 MacBook 上的颜色，并且此时也能模糊地看到那个视频中背后灰色的部分，不再是一片黑色，而是有不同灰度的黑，也能够看到背后的一些内容了。

虽然到目前为止还不知道哪里的问题，但好在先解决了这个色彩的问题。
