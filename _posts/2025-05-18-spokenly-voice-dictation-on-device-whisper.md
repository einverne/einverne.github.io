---
layout: post
title: "Spokenly macOS 上的语音转文字工具"
aliases:
- "Spokenly macOS 上的语音转文字工具"
tagline: ""
description: ""
category: 产品体验
tags: [voice-to-text, tts, whisper, mac-whisper, faster-whisper]
create_time: 2025-05-18 22:30:12
last_updated: 2025-05-18 22:30:12
dg-home: false
dg-publish: false
---

前几天我介绍了一款 macOS 下的语音转文字应用 [Aqua Voice](https://blog.einverne.info/post/2025/05/aqua-voice-voice-to-text.html) 用语音的方式提升输入效率，但是 Aqua Voice 它有使用的限制，但是今天我很[偶然](https://www.reddit.com/r/macapps/comments/1kfffhc/spokenly_tiny_29mb_voice_dictation_with_ondevice/)地发现了一款完全免费的，并且可以直接离线使用的语音转文字工具 [[Spokenly]]。

Spokenly 来自一个独立开发者 Vadim Akhmerov，在 macOS 下应用只有 3.3 MB 大小，作者直接利用了本地集成的 Whisper 模型来提升识别准确度和效率，如果用户想使用 GPT-4o 的模型，也可以自己输入 API Key 来使用联网的模型。

## Spokenly 是什么

[Spokenly](https://spokenly.app) 是一个本地的语音转文字应用，可以口述任何的文字，代码，笔记等等。

![nQD3LqMD69](https://pic.einverne.info/images/nQD3LqMD69.png)

## 特性

- 注重隐私，音频不会离开 Mac，调用本地 Whisper 模型
- 可以选择调用 GPT-4o 进行转写
- 内置标点符号和语音控制
- 可以语音打开应用，链接，快捷方式等
- 文件转录，支持 mp3, m4a, wav, flac 以及 mp4, mov 等等格式
- 完全免费，无需登录，本地模型永久免费
- 语音快捷指令，可以设置语音触发调用 macOS 自带的快捷指令

## 使用

初次使用需要设置好权限。

![Pv2g](https://photo.einverne.info/images/2025/05/19/Pv2g.png)
然后可以根据自己的习惯设置触发的快捷键，以及选择适当的模型。我推荐，如果想要使用云端的转录，可以直接用默认的 GPT-4o mini Transcribe 模型。

![PMbw](https://photo.einverne.info/images/2025/05/19/PMbw.png)

如果不想使用在线的模型，可以直接下载本地的 Whisper Large V3 Turbo(Quantized) 模型，这个兼顾了识别速度和准确度。

![PyVc](https://photo.einverne.info/images/2025/05/19/PyVc.png)

Spokenly 使用起来非常简单，通过快捷键触发录制音频，松开快捷键就可以进行转录。

## related

- [[Voicenotes]]
- [[Aqua Voice]]
- [[superwhisper]]
- [[VoiceInk]]
- [[Willow Voice]]
- [[Voice Type]]
