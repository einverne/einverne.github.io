---
layout: post
title: "解决 Adobe Premiere 不支持 mkv 问题"
aliases: 
- "解决 Adobe Premiere 不支持 mkv 问题"
tagline: ""
description: ""
category: 学习笔记
tags: [ adobe, adobe-premiere, mkv, ffmpeg, macos, handbrake ]
last_updated:
---

一直想学习一下视频剪辑，这两天正好拿一个韩剧试一下，但没想到第一步导入就被拦在了外面，不过还好，正好可以学习一下 mkv 格式，以及基本的视频格式。

我在将 mkv 格式的文件导入到 Adobe Premiere 的时候报错：

> File format not supported.

## mkv 格式
mkv 的全称是 Matroska Video File，是一种开放的多媒体档案封装格式，可以将不同编码的影片，音轨，字幕封装到同一个档案中。通常的扩展名是 `.mkv`, `.mka` , `.mks` 等等。[^wiki]
    
[^wiki]: <https://zh.wikipedia.org/wiki/Matroska>

### 为什么 Adobe 不支持 mkv 格式

Adobe 从 2019.1.5 版本开始就放弃支持 mkv 格式了[^q]。

[^q]: <https://theblog.adobe.com/changes-to-mkv-format-support-in-premiere-pro-and-adobe-media-encoder/>

本质上 mkv 是一个封装格式，Adobe Premiere 还是支持编辑其中封装的视频内容的。

## 使用 ffmpeg 提取 mp4 格式

首先安装 ffmpeg，然后执行：

    ffmpeg -i "original_filename.mkv" -codec copy output_name.mp4
    
这一行命令不会进行转码，所以提取速度约等于文件拷贝的速度，非常快。

## 容器和编码方式
上面提到过 mkv 是一种媒体容器，可以将不同编码类型的数据包含到一起。而编码方式则是决定了视频、音频的压缩算法。

可以通过 `ffmpeg -i filename.mkv` 来查看文件的具体详情。

以一个最简单的例子，为方便学习输出内容有省略：

```
❯ ffmpeg -i Going.to.You.at.a.Speed.of.493km.S01E04.1080p.DSNP.WEB-DL.AAC2.0.H.264-NYH.mkv
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
Input #0, matroska,webm, from 'Going.to.You.at.a.Speed.of.493km.S01E04.1080p.DSNP.WEB-DL.AAC2.0.H.264-NYH.mkv':
  Metadata:
    encoder         : libebml v1.4.2 + libmatroska v1.6.4
  Duration: 01:03:10.83, start: 0.000000, bitrate: 5704 kb/s
  Chapters:
    Chapter #0:0: start 1.001000, end 40.999000
      Metadata:
        title           : Intro
    Chapter #0:1: start 40.999000, end 3748.957000
      Metadata:
        title           : Scene 1
    Chapter #0:2: start 3748.957000, end 3790.826000
      Metadata:
        title           : Credits
  Stream #0:0: Video: h264 (High), yuv420p(tv, bt709, progressive), 1920x1080 [SAR 1:1 DAR 16:9], 23.98 fps, 23.98 tbr, 1k tbn (default)
    Metadata:
      BPS             : 5575824
      DURATION        : 01:03:10.787000000
      NUMBER_OF_FRAMES: 90888
      NUMBER_OF_BYTES : 2642095527
      _STATISTICS_WRITING_APP: mkvmerge v67.0.0 ('Under Stars') 64-bit
      _STATISTICS_TAGS: BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES
  Stream #0:1(kor): Audio: aac (LC), 48000 Hz, stereo, fltp (default)
    Metadata:
      BPS             : 125375
      DURATION        : 01:03:10.826000000
      NUMBER_OF_FRAMES: 177695
      NUMBER_OF_BYTES : 59409362
      _STATISTICS_WRITING_APP: mkvmerge v67.0.0 ('Under Stars') 64-bit
      _STATISTICS_TAGS: BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES
  Stream #0:2(kor): Subtitle: subrip
    Metadata:
      title           : SDH
      BPS             : 74
      DURATION        : 01:03:00.359000000
      NUMBER_OF_FRAMES: 1167
      NUMBER_OF_BYTES : 35163
      _STATISTICS_WRITING_APP: mkvmerge v67.0.0 ('Under Stars') 64-bit
      _STATISTI
```

可以看到其中有三段 Stream，可以看到第一段是视频，第二段是音频，而第三段则是字幕，为了方便这里省略了后面还有的多语言字幕。

在每一段中可以看到其编码方案比如视频是 h264, 音频是 aac。

H.264 是一种视频编码，H.264 标准制定的目的就是为了创建一个更好的视频压缩标准，可以在更低的比特率的情况下可以提供更好的视频质量。

