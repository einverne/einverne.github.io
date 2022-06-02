---
layout: post
title: "使用 FFmpeg 将 webm 格式转成 mp4"
aliases:
- "使用 FFmpeg 将 webm 格式转成 mp4"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, ffmpeg, mp4, webm, google, youtube, vp9, opus ]
last_updated:
---

记录一下使用 [[FFmpeg]] 将 YouTube 下载的 WebM 格式视频转码成 Adobe Premiere 可以处理的 MP4 格式。

## 基础知识

### WebM 格式
[[WebM]] 是 Google 开源的一个，免版权费用视频文件格式。该格式可以提供高质量的视频压缩以在 HTML5 页面上使用。BSD 许可开源。[^wiki]

[^wiki]: <https://zh.wikipedia.org/wiki/WebM>

WebM 采用 On2 Technologies 公司开发的 [[VP8]] 和后续的 [[VP9]] 作为视频解码器，使用 Xiph.Org 基金会开发的 Vorbis，[[Opus]] 作为音频编码器，以 [[Matroska]] 格式作为封装格式。

### FFmpeg
FFmpeg 是一系列有关多媒体，包括音频、视频，字幕等等相关元数据处理的编程库和处理工具。可以非常方便地用来对视频内容编解码，转码等等操作。FFmpeg 是一个开放源代码的项目，是一个命令行工具，如果你想要一个 GUI，可以尝试一下 [[HandBrake]]。

FFmpeg 支持非常多的编码格式，包括 VP8，VP9，H.264，Opus，Vorbis，AAC 等等。

## 处理

查看一下下载的视频：

```
ffmpeg -i \[놀면\ 뭐하니\ 후공개\]\ WSG\ 워너비\ 블라인드\ 오디션\ 풀영상\ \[엠마스톤\ -\ 그런\ 일은\]\ \(Hangout\ with\ Yoo\ -\ WSG\ Wannabe\ YooPalBong\)\ \[n2eVz5IIu-Y\].webm
ffmpeg version 5.0.1 Copyright (c) 2000-2022 the FFmpeg developers
  built with Apple clang version 13.1.6 (clang-1316.0.21.2)
  configuration: --prefix=/usr/local/Cellar/ffmpeg/5.0.1 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags= --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libbluray --enable-libdav1d --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librist --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-videotoolbox
  libavutil      57. 17.100 / 57. 17.100
  libavcodec     59. 18.100 / 59. 18.100
  libavformat    59. 16.100 / 59. 16.100
  libavdevice    59.  4.100 / 59.  4.100
  libavfilter     8. 24.100 /  8. 24.100
  libswscale      6.  4.100 /  6.  4.100
  libswresample   4.  3.100 /  4.  3.100
  libpostproc    56.  3.100 / 56.  3.100
Input #0, matroska,webm, from '[놀면 뭐하니 후공개] WSG 워너비 블라인드 오디션 풀영상 [엠마스톤 - 그런 일은] (Hangout with Yoo - WSG Wannabe YooPalBong) [n2eVz5IIu-Y].webm':
  Metadata:
    ENCODER         : Lavf58.29.100
  Duration: 00:04:22.52, start: -0.007000, bitrate: 547 kb/s
  Stream #0:0(eng): Video: vp9 (Profile 0), yuv420p(tv, bt709), 1920x1080, SAR 1:1 DAR 16:9, 29.97 fps, 29.97 tbr, 1k tbn (default)
    Metadata:
      DURATION        : 00:04:22.495000000
  Stream #0:1(eng): Audio: opus, 48000 Hz, stereo, fltp (default)
    Metadata:
      DURATION        : 00:04:22.521000000
```

可以清楚的看到其中有两条数据，Video 使用 vp9 编码，而音频则是 opus 编码的。

使用命令转码：

    ffmpeg -i origin.webm newfile.mp4

更多 ffmpeg 的选项可以参考之前的 [FFmpeg 入门](/post/2015/12/ffmpeg-first.html) 。

转码过后：

```
❯ ffmpeg -i \[놀면\ 뭐하니\ 후공개\]\ WSG\ 워너비\ 블라인드\ 오디션\ 풀영상\ \[엠마스톤\ -\ 그런\ 일은\]\ \(Hangout\ with\ Yoo\ -\ WSG\ Wannabe\ YooPalBong\)\ \[n2eVz5IIu-Y\].mp4
ffmpeg version 5.0.1 Copyright (c) 2000-2022 the FFmpeg developers
  built with Apple clang version 13.1.6 (clang-1316.0.21.2)
  configuration: --prefix=/usr/local/Cellar/ffmpeg/5.0.1 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags= --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libbluray --enable-libdav1d --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librist --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-videotoolbox
  libavutil      57. 17.100 / 57. 17.100
  libavcodec     59. 18.100 / 59. 18.100
  libavformat    59. 16.100 / 59. 16.100
  libavdevice    59.  4.100 / 59.  4.100
  libavfilter     8. 24.100 /  8. 24.100
  libswscale      6.  4.100 /  6.  4.100
  libswresample   4.  3.100 /  4.  3.100
  libpostproc    56.  3.100 / 56.  3.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '[놀면 뭐하니 후공개] WSG 워너비 블라인드 오디션 풀영상 [엠마스톤 - 그런 일은] (Hangout with Yoo - WSG Wannabe YooPalBong) [n2eVz5IIu-Y].mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.16.100
  Duration: 00:04:22.58, start: 0.000000, bitrate: 599 kb/s
  Stream #0:0[0x1](eng): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 1920x1080 [SAR 1:1 DAR 16:9], 465 kb/s, 24 fps, 24 tbr, 12288 tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 129 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
```

可以看到视频流已经变成 h264 编码，而音频也变成了 aac。
