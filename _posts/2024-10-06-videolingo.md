---
layout: post
title: "VideoLingo：一键自动将视频翻译成中文字幕"
aliases:
- "VideoLingo：一键自动将视频翻译成中文字幕"
tagline: ""
description: ""
category: 经验总结
tags: [videolingo, anthropic, openai, ai-transcript, audio-transcript, translate, video-translate, text-to-speech, tts, subtitle, subtitle-transcript, subtitle-translation, memoai, pyvideotrans]
create_time: 2024-10-06 23:18:57
last_updated: 2024-10-06 23:18:57
dg-home: false
dg-publish: false
---

我之前的文章和视频中也介绍过好几款，或收费或开源的视频翻译工具，包括

- 收费的 [MemoAI](https://blog.einverne.info/post/2024/09/memo-ai-audio-transcript.html)
- 收费的 [YPlayer](https://blog.einverne.info/post/2024/08/yplayer-ai-transcript-player.html)
- macOS 下的客户端 [[MacWhisper]]
- 开源的 [pyVideoTrans](https://blog.einverne.info/post/2024/09/pyvideotrans-audio-to-text-to-audio.html)
- 以及许许多多 [Whisper 项目衍生](https://blog.einverne.info/post/2024/09/whisper-and-related.html)

今天再介绍另一款开源的视频字幕自动翻译项目---- VideoLingo。

[VideoLingo](https://github.com/Huanshere/VideoLingo) 是一款开源的视频自动翻译项目，可以将视频进行字幕切割，翻译，对齐，以及配音。

VideoLingo 可以接受 YouTube 链接或者本地视频，可以对视频进行自动转写，并且生成单词级别的转录文件，然后利用 LLM 对原始文本进行翻译，还可以利用 TTS 来生成配音

个人尝试了一下生成 Jensen Huang 的采访，因为使用了 Anthropic 的 AI，所以翻译质量非常高，并且达到了宣称的 Netflix 字幕标准，只有单行的长度，并且中文翻译非常信达雅。

![AJOB0r2lqP](https://pic.einverne.info/images/AJOB0r2lqP.png)

VideoLingo 还采用了多种 TTS 引擎，包括

- OpenAI
- Azure TTS
- [[GPT-SoVITS]]
- [[Fish Audio]] TTS

可以自行配置 API KEY 来生成中文配音，并自动合成到视频中。

## 相关的技术栈

- [[yt-dlp]] 实现 YouTube 视频下载
- [[WhisperX]] 语音转写，进行单词级时间轴字幕识别
- NLP 和 GPT 根据句意进行字幕分割
- GPT 总结提取术语知识库，上下文连贯翻译
- [[TTS]]
  - [[GPT-SoVITS]] 个性化配音，克隆声音并进行配音
- [[Streamlit]]

## 安装

```
# 获取源代码
git clone git@github.com:Huanshere/VideoLingo.git
cd VideoLingo
pyenv virtualenv 3.10.9 videolingo
pyenv local videolingo
pip install -r requirements.txt
python install.py
# 一键启动
streamlit run st.py
```

## 配置说明

### LLM 配置

LLM 配置中需要使用到 [[Anthropic]] 的 API，可以访问 https://gpt.einverne.info 获取 API KEY

### 转录和字幕设置

这里我选择了本地 WhisperX 方法。

### 配音设置

略过

## related

- [[Linly-Dubbing]]
