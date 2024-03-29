---
layout: post
title: "Lossless Cut 使用记录"
aliases:
- "Lossless Cut 使用记录"
tagline: ""
description: ""
category: 产品体验
tags: [ losslesscut, video, video-manage, ffmpeg, video-cut, ]
create_time: 2023-07-22 11:57:55
last_updated: 2023-07-22 11:57:55
---

[Lossless Cut](https://github.com/mifi/lossless-cut) 一款跨平台的 [[FFmpeg]] 的 GUI，可以用来快速、无损地剪辑视频，音频。使用 Lossless Cut，用户可以轻松地选择视频或音频文件并进行剪辑操作。该工具支持各种常见的视频和音频格式，并且能够在不重新编码的情况下进行快速剪辑。

![D4P8](https://photo.einverne.info/images/2023/07/22/D4P8.png)

除了基本的剪辑功能之外，Lossless Cut 还提供了其他一些高级功能。例如，它允许用户选择特定的时间段进行裁剪，并且还支持批量处理多个文件。此外，它还提供了一些实用的工具，如帧精确切分、截图等。

Lossless Cut 的界面简洁易用，使得即使对于没有编码经验的用户也能够轻松上手。它还提供了一些预设选项，以便用户能够快速应用常见的剪辑设置。

我经常会有一些简单的视频剪辑需求，比如一个长视频中剪辑部分内容，或者从一个音频文件剪辑部分，之前我都是用 Adobe Premiere 去处理，但是 Adobe Premiere 一方面非常重，另一方面即使是简单地剪辑导出也非常慢，因为会需要进行编码。

功能：

- 开源、免费、跨平台
- 由于 LosslessCut 基于 Chromium，并且使用 HTML5 视频播放器，因此不支持 [[FFmpeg]] 支持的所有格式
- 支持编解码格式，MP4，MOV，WebM，MKV，OGG，WAV，MP3，AAC，H264，Theora，VP8，VP9。
- 无损地修剪或剪切视频/音频的部分
- 合并相同编码的文件
- 组合来自多个文件的多个轨道
- 无损提取文件中的音频
- 重新混合为兼容格式输出
- 缩放关键帧

## Lossless Cut 使用

### 剪辑

Lossless Cut 的使用非常简单，可以直接将视频拖入应用，或者在应用中打开要处理的视频文件（Ctrl+o）。

![Dcln](https://photo.einverne.info/images/2023/07/22/Dcln.png)
点击下方的时间轴，然后 「，」和 「。」 可以对选择点进行微调。

找到剪切点，按下「i」选择开头，然后按下 「o」结束。然后使用右下方的 Export 即可到处视频，此时会发现 LosslessCut 的到处处理几乎是瞬间完成的，因为并不需要重新编码，所以磁盘读写的速度就是导出的速度。

对于音频文件，则是如下的样式。

![Dvkl](https://photo.einverne.info/images/2023/07/22/Dvkl.png)

### 合并视频

Lossless Cut 还支持将多个视频文件合并成一个。只需将要合并的视频文件拖入应用中，然后点击左上角的「+」按钮来添加更多的视频文件。在选择完所有要合并的文件后，点击右上角的「Merge」按钮即可开始合并。

但需要注意的是 Lossless Cut 在合并视频时最好保证视频的编解码是一致的。

### 关键帧

在视频下方的时间轴上能看到一些自动识别的竖线，这些线是 Lossless Cut 自动识别的关键帧，方便用户定位视频。

### 缩略图

展开高级菜单，然后在倒数第二行的工具栏中的第三个图标就是自动显示视频的缩略图。

![DMvy](https://photo.einverne.info/images/2023/07/22/DMvy.png)

## 快捷键

- `Space` 暂停播放
- `j/l` 降低或加快播放速度
- `</>` 往前或往后 1 秒
- `,/.` 小幅度（帧）调整时间
- `i` 标记开始
- `o` 标记结束
- `e` 导出选取的区段
- `c` 导出快照

## 相关软件

- [[HandBrake]] 是一款免费的视频转码软件，支持将视频转换为不同的格式。它具有用户友好的界面和强大的功能，同时还支持批量转码和多线程处理。无论您是想将视频转换为手机、平板电脑、游戏机或其他设备可播放的格式，HandBrake 都能满足您的需求。
- [[FFmpeg]] 是一个强大的开源多媒体框架，提供了音频、视频和图像处理的功能。它可以用来进行视频剪辑、分割、合并等操作，并且支持各种常用的音视频格式。FFmpeg 具有命令行界面，因此对于熟悉命令行操作的用户来说非常方便。
- [[Avidemux]] 是一款简单易用的视频剪辑软件，适合初学者使用。它提供了基本的剪辑、分割和合并功能，并支持多种常见的音视频格式。Avidemux 还可以进行简单的滤镜和特效处理，如亮度调整、色彩校正等。同时 Avidemux 支持的格式也非常多。
- [[MKVToolNix]] 是一款免费的多媒体工具，其中一个功能是 MKV 文件的剪辑和编辑。
- [[mVideoPlayer]] 一个开源的视频素材管理工具。
- 其他一些收费的软件 [[BandiCut]]、[[SolveigMM Video Splitter]]
