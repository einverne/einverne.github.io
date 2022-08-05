---
layout: post
title: "使用 HandBrake 压缩转码视频"
aliases:
- "使用 HandBrake 压缩转码视频"
tagline: ""
description: ""
category: 学习笔记
tags: [ handbrake, video, ffmpeg, codec, open-source, transcoder,  ]
last_updated: 2022-08-05 06:14:11
create_time: 2022-05-30 04:11:34
---

HandBrake 是一款开源的全平台的视频转码压制工具，基于 [[FFmpeg]]，可以算作一个 GUI 版本的 FFmpeg。

官网： <https://handbrake.fr/>

## 安装

macOS:

    brew install --cask handbrake

## 基础知识复习

### 分辨率 resolution
分辨率，也称为解析度，指的是视频中像素点的个数。

### 帧率 frame rate
帧率指的是每秒在屏幕上刷新的画面个数。

需要显示器硬件支持，大多数屏幕的刷新率在 60Hz 左右。

通常情况下 30FPS 已经能够保证流畅。

### 码率 bit rate
码率指的是单位时间内文件包含的数据量。

相同分辨率，码率越高约清晰。但是超过一定范围之后，清晰度变不会显著提高。

文件体积 = 总码率 * 时长。

### 媒体封装格式
通常见到的媒体封装格式包括：

- MKV
- MP4
- WebM

### 编解码格式
视频、音频数据的压缩方式。

常见的有：

- H.264 / H.265(HEVC)

## 预估文件的大小
通常可以通过分辨率大小、码率、帧率来预估一个视频文件的大小：

- 720P / 1 Mbps / 30 FPS / x264 / AAC = 1 小时视频大小在 450M 左右
- 1080P / 2 Mbps / 30 FPS / x264 / AAC = 1 小时视频大小在 900M 左右

## 使用
当了解了视频编解码的基本信息之后再去使用 HandBrake 就简单很多了。

使用 HandBrake 的使用场景通常有：

- 压缩原始文件，如果想要在互联网上分发音视频文件，可以通过 HandBrake 压缩到一个合适的大小之后再分发
- 视频转码，将视频文件转码成各个平台都兼容的格式，比如 MP4 等
- 给视频文件增加字幕，音轨

软件界面：

![handbrake ui](https://photo.einverne.info/images/2022/05/30/zZO2.png)
