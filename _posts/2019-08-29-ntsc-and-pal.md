---
layout: post
title: "NTSC 和 PAL"
tagline: ""
description: ""
category: 学习笔记
tags: [ntsc, pal, camera, frame, ]
last_updated:
---

之前折腾相机，剪视频的时候遇到这两个标准制式，就一直在待办事项中，这里就简单的记录一下。


## 制式

### NTSC

NTSC 是 National Television Standard Committee，美国电视播放标准。


### PAL

PAL 是 Phase Alternating Line，适用于其他国家的播放标准。

## 差异

播放速率

NTSC    		｜ PAL
----------|----------------
24 FPS    | 24 FPS
30 FPS    | 25 FPS
48 FPS    | 48 FPS
60 FPS    | 50 FPS

## 场
在搜索视频相关的内容时看到了有高场、地场的差别，联系到平时经常看到的一些词汇感觉到需要记录一下，这是两个经常能看到的词汇：

- 1080i
- 1080p

这里的 1080 都很熟悉就是视频分辨率，而这里的 `i` 和 `p` 分别指的是

- Interlace 隔行扫描
- Progressive 逐行扫描

在过去电视时代，要传输图像，根据人眼的视觉残留制定出 24 帧每秒的标准，当每秒有 24 帧及以上的静止图像连续出现时，人眼就认为是动影像，但是实现这个动影像效果，就需要电视画面传输时及考虑到传输带宽，也要考虑到画面质量。所以过去人们就发明了隔行扫描和逐行扫描，隔行扫描也就是画面在传输时，隔行传输，这样可以节省一半的带宽。

常见的帧率有：

- 24 frame/sec (film, ATSC, 2k, 4k, 6k)
- 25 frame/sec (PAL, used in Europe, Uruguay, Argentina, Australia), SECAM, DVB, ATSC)
- 29.97 (30 ÷ 1.001) frame/sec (NTSC American System (US, Canada, Mexico, Colombia, etc.), ATSC, PAL-M (Brazil))
- 30 frame/sec (ATSC)

为什么有这么多的帧率呢，这就要回到过去黑白电视时代，世界上不同地区的用电频率不一样，这就涉及到传输电视画面的频率问题，美国的电力是 60Hz 所以上面提到的 NTSC 用的是 30 FPS，而其他地区，欧洲， 中国等等用的是 50 Hz 电，所以是 25 FPS 的画面。当彩色电视被发明出来，电气工程师们为了向后兼容，所以他们把彩色信号做了一个小小的偏移，轻微地将帧率从 30 FPS 改成了 30 / 1.001 = 29.97 FPS，因此诞生了 NTSC 色彩标准。

## reference

- <https://blog.frame.io/2017/07/17/timecode-and-frame-rates/>
