---
layout: post
title: "使用 pyVideoTrans 自动进行视频翻译及配音"
aliases:
- "使用 pyVideoTrans 自动进行视频翻译及配音"
tagline: ""
description: ""
category: 经验总结
tags: [pyvideotrans, python, audio-to-text, audio-transcript, tts, subtitle, subtitle-transcript, ai-translation, translation, subtitle-translation]
create_time: 2024-09-14 08:33:07
last_updated: 2024-09-14 08:33:07
dg-home: false
dg-publish: false
---

前两天分享过一款通过 macOS 本地芯片实时生成字幕的 [[YPlayer]] 播放器，也分享过通过 [[MemoAI]] 来生成双语字幕，后来来发现了一款叫做 Fig Player 的播放器，也可以通过 Whisper 模型来生成双语字幕，但是这一些工具的底层原理基本上都是通过 OpenAI 发布的 Whisper，以及其[衍生的模型](https://blog.einverne.info/post/2024/09/whisper-and-related.html)来完成音频转字幕的，这一个过程叫做 Transcript，但是今天要介绍一个更加强大的工具 [[pyVideoTrans]]，这一款开源，免费的项目完全实现了上述所有的产品的功能，并且更加强大。

[pyVideoTrans](https://pyvideotrans.com/) 是一款开源的视频翻译及配音的工具，可以一键生成字幕，翻译字幕，创建配音，最后合成，可以一键获得一个带字幕和配音的新视频。

一步步分析来看 pyVideoTrans 能够

- 使用多种模型将视频音频转写成文字（字幕）
- 使用多种翻译引擎将文字翻译成目标语言
- 通过多种 TTS 引擎将文字变成音频
- 将音频和视频进行合成，生成最终的视频

功能

- 自动 Transcript 支持 faster openai-whisper，支持自定义的 Hugging Face 模型
- 集成语音识别，文字配音，字幕翻译等等小工具
- 配音支持 edgeTTS, AzureTTS , OpenAI, GPT-SoVITS
- 翻译支持 Google, ChatGPT, DeepL, Gemini, 百度腾讯，本地模型
- 识别支持 faster-whisper，豆包模型，阿里中文模型
- 完全离线
- 开源协议 GPLv3

## 视频演示

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=113131116370625&bvid=BV16S4feZE2G&cid=25652107637&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
[YouTube](https://youtu.be/R3kMWBs_1H0?si=qd530-y32QmzSMFU)

## 语音识别

语音识别支持 faster-whisper 模型 openai-whisper 模型 和 GoogleSpeech zh_recogn 阿里中文语音识别模型.

## 文字翻译

文字翻译支持 微软翻译|Google 翻译|百度翻译|腾讯翻译|ChatGPT|AzureAI|Gemini|DeepL|DeepLX|字节火山|离线翻译 OTT

## 语音合成

文字合成语音支持 Microsoft Edge tts Google tts Azure AI TTS Openai TTS Elevenlabs TTS 自定义 TTS 服务器 api GPT-SoVITS clone-voice ChatTTS-ui Fish TTS CosyVoice

允许保留背景伴奏音乐等(基于 uvr5)

## 支持的语言

支持的语言：中文简繁、英语、韩语、日语、俄语、法语、德语、意大利语、西班牙语、葡萄牙语、越南语、泰国语、阿拉伯语、土耳其语、匈牙利语、印度语、乌克兰语、哈萨克语、印尼语、马来语、捷克语、波兰语

![YjXoJt5NZj](https://pic.einverne.info/images/YjXoJt5NZj.png)

## macOS 安装

根据官网的教程，安装必要的组件

但是我个人在尝试的过程中，发现执行报错 

```
OSError: cannot load library '/Users/einverne/.pyenv/versions/pyvideotrans/lib/python3.10/site-packages/_soundfile_data/libsndfile.dylib': dlopen(/Users/einverne/.pyenv/versions/pyvideotrans/lib/python3.10/site-packages/_soundfile_data/libsndfile.dylib, 0x0002): tried: 
```

这个问题就是 libsndfile 的包没有安装好

首先安装

```
brew install libsndfile
```

然后配置

```
export LIBRARY_PATH=$LIBRARY_PATH:/opt/homebrew/lib/
export CPATH=$CPATH:/opt/homebrew/include/
```

最后重新安装

```
pip uninstall soundfile
pip install soundfile
```