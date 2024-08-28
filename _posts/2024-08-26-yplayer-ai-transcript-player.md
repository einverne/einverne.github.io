---
layout: post
title: "YPlayer 一款支持本地生成字幕的播放器"
aliases:
- "YPlayer 一款支持本地生成字幕的播放器"
tagline: ""
description: ""
category: 产品体验
tags: [yplayer, macos, ios, swiftui, speech-recognition, ai, ai-model, ai-transcript, transcript, subtitle, subtitle-transcript]
create_time: 2024-08-28 09:23:23
last_updated: 2024-08-28 09:23:23
dg-home: false
dg-publish: false
---

[YPlayer](https://www.engineerdraft.com/yplayer/) 是一款创新的视频播放器，专注于本地实时生成字幕，充分尊重用户的隐私。它不采集任何用户数据，也不会对外发送数据，确保用户的隐私安全。YPlayer 利用 macOS 的 Speech Recognition 和苹果的 CoreML 机器学习框架，实现了高效的语音识别和字幕生成功能。由于采用了 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 的新特性，该播放器目前仅支持 macOS Big Sur (11.0) 及以上版本。

## 功能亮点

- **实时字幕生成**：YPlayer 能够为每个视频本地实时生成字幕文件，支持多种语言，包括汉语（简体、繁体）、英语、日语、德语、意大利语、葡萄牙语、波兰语等。
- **离线识别**：即使在没有网络的情况下，YPlayer 也能快速进行语音转文字，识别更为准确。
- **静音识别**，即使播放器静音, 也可以实时生成字幕
- **视频书签**：用户可以为视频内容添加书签，方便后续快速跳转。
- **字幕翻译和导出**：支持多语言字幕翻译（如中文、英语、德语等），并能将字幕导出为 TXT、SRT、PDF、LRC 格式。
- **字幕搜索**，快速定位印象中视频内容
- **批量处理**：支持批量转录文件和字幕翻译，提升处理效率。
- **字幕复读和遮挡**：提供复读功能帮助英语学习者精听，并支持遮挡硬字幕。
- **双语识别**，识别中英文夹杂的视频，特别适合语言学习，或观看技术视频
- **静音识别**：即使在静音状态下，播放器也能实时生成字幕。
- **多客户端支持**：YPlayer 可在 MacBook、iPhone、iPad 等设备上使用。
- **旁白支持**：iOS 版本专门优化了旁白功能，方便视障人士使用。
- **视频实况文本**，在暂停的时候可以直接复制文字出来, 方便大家做笔记 (macOS 13, iOS 16.0 支持)
- **批量转录文件**，高效完成目录下批量文件转录为字幕或 TXT 格式文件, 满足大量文件转录的需求
- **批量字幕翻译**，高效完成目录下批量字幕翻译, 提高字幕翻译效率. 翻译目前支持云服务: DeepL 和 腾讯翻译
- **字幕复读**，支持复读一行字幕, 帮助英语精听
- **字幕遮挡**，满足部分英语学习者想要盖住硬字幕的需求
- **录音转写文字**，录音同时实时显示文字

### 主界面

YPlayer 主界面提供了播放，转写，录制三大功能入口。

![woJT0NYhx0](https://pic.einverne.info/images/woJT0NYhx0.png)

### 提供多种语言模型

YPlayer 提供多种 AI 语言模型，可以根据自己的硬件配置选择合适的模型。

![IdMM-vRY7I](https://pic.einverne.info/images/IdMM-vRY7I.png)

### 批量翻译

YPlayer 支持通过 DeepL，或腾讯翻译君批量翻译字幕文件。但是需要自己提供 API KEY。

![87HxVnLgp5](https://pic.einverne.info/images/87HxVnLgp5.png)

### 录音实时显示

YPlayer 支持录音，并实时转写成文字，目前支持中文和英文，但是需要注意的是，准确率还是有提升的空间。

![X9ycKpajhm](https://pic.einverne.info/images/X9ycKpajhm.png)

## 局限性

尽管 YPlayer 功能强大，但目前仍存在一些局限性：

- **格式支持有限**：仅支持 aiff、3gp、aac、ac3、flac、mp3、mp4、m4a、m4v、wav、au、mov 格式，不支持常用的 mkv 格式。
- **缺乏实时翻译**：目前不支持本地实时翻译功能。

## 使用场景

YPlayer 特别适合以下用户群体：

- **学生**：在网络条件不佳的环境中，如图书馆，复习视频资料。
- **字幕学习者**：希望导出视频中的字幕用于笔记和学习，还可以通过后期自动翻译制作完整的双语字幕。
- **美剧爱好者**：观看无字幕的生肉资源。
- **听障人士**：需要观看没有字幕的视频资源。
