---
layout: post
title: "语音转文字技术方案以及应用整理"
aliases:
  - "语音转文字技术方案以及应用整理"
tagline: ""
description: ""
category: 整理合集
tags: [ whisper, fast-whisper, voice-to-text, tts, spokenly, aqua-voice, voicenotes, obsidian, stt, ]
create_time: 2025-11-27 16:19:12
last_updated: 2025-11-27 16:19:12
dg-home: false
dg-publish: false
---

在过去一年的博客当中，我介绍了不少和语音转文字相关的应用，有一些主打的是语音转文字的延迟低，有一些则以语音笔记为卖点，还有一些是语音输入法，我还介绍过很多[开源项目](https://space.bilibili.com/4849599)，主打的是将视频内容转成文字。

- [Aqua Voice 利用语音转文字提升产出效率](https://blog.einverne.info/post/2025/05/aqua-voice-voice-to-text.html) ，这是一款语音转文字输入法
- [Spokenly](https://blog.einverne.info/post/2025/05/spokenly-voice-dictation-on-device-whisper.html) 这是一款非常轻量的语音转文字工具。
- [Voicenotes 一款 AI 语音笔记应用](https://blog.einverne.info/post/2024/06/voicenotes.html) 这是一款笔语音笔记软件
- [Dinox 又一款 AI 语音转录笔记](https://blog.einverne.info/post/2024/07/dinox-voice-memo.html) 这也是一款语音笔记软件
- [Emote 又一款 AI 语音笔记应用](https://blog.einverne.info/post/2024/07/emote-voice-notes.html) 这还是一款语音笔记软键
- [Wispr Flow: AI 语音听写应用 提升输入效率](https://blog.einverne.info/post/2025/07/wispr-flow.html)
- [闪电说 高效输入中文 面向未来的工作方式](https://blog.einverne.info/post/2025/10/shandianuo.html)
- [小凹语音输入法 又一款语音转文字应用](https://blog.einverne.info/post/2025/11/autotyper-autoglm-zhipu.html) 智谱推出的语音输入法

![ahWZs3we9Z](https://pic.einverne.info/images/ahWZs3we9Z.png)

## 专业术语

[[ASR]] （Automatic Speech Recognition），自动语音识别技术，其目标是将人类语音中的词汇内容转成书面文字。

Streaming ASR model，流式语音识别模型是指可以在处理音频流的过程中支持实时返回识别结果的一类 ASR 模型。相对于非流式模型，必须在处理完整之后才能返回结果。流式 ASR 可以更好的用于需要实时获取识别结果的场景。例如直播实时字幕、会议实时记录、语音输入、语音唤醒等场景。

## 语音转文字的技术 Speech-to-Text

本地语音转文字 STT，技术上已经形成了非常成熟的开源生态。

Whisper、wav2vec 2.0、Vosk、ESPnet、PaddleSpeech 和 FunASR。

| 模型           | 特点                            | 精度 | 速度 | 中文支持 | 资源占用 | 适用场景                  |
| -------------- | ------------------------------- | ---- | ---- | -------- | -------- | ------------------------- |
| Whisper        | OpenAI 开源，多语言 95%精度     | 极高 | 中等 | 优秀     | 中等     | 通用转录、字幕生成        |
| Faster-Whisper | 基于 CTranslate2 优化，4 倍加速 | 相同 | 快速 | 优秀     | 低       | 实时转录、资源受限场景    |
| Vosk           | 离线轻量级，支持 20+语言        | 中等 | 快速 | 支持     | 极低     | 嵌入式设备、IoT、隐私应用 |
| wav2vec 2.0    | Meta 自监督学习模型             | 中等 | 中等 | 需微调   | 中等     | 研究、定制化场景          |
| PaddleSpeech   | 百度中文优化工具包              | 高   | 快   | 优秀     | 中等     | 中文会议、企业应用        |
| Silero STT     | 企业级简洁 API                  | 中等 | 很快 | 有限     | 低       | 快速集成应用              |
| SeamlessM4T    | Meta 多语言翻译+转录，100 语言  | 高   | 中等 | 支持     | 高       | 多语言翻译场景            |

### Whisper 及其优化版本

OpenAI Whisper 是 OpenAI 于 2022 年首次开源的端到端 ASR 模型，2023 年发布 Large-V3，支持超过 99 种语言，准确率非常高。提供 5 个不同规模模型（tiny、base、small、medium、large），满足不同硬件需求。支持音频转入、语音翻译标点生成长音频分段处理等。支持本地部署，无需网络连接。

模型采用 encoder-decoder Transformer 架构，在 68 万小时的多语种，多任务弱监督语音数据上训练。

| 模型大小 | 参数量 | 内存占用 | CPU 推理时间(48 秒音频) |
| -------- | ------ | -------- | ----------------------- |
| tiny     | ~39M   | ~1GB     | 快速                    |
| base     | ~74M   | ~1.5GB   | 较快                    |
| small    | ~244M  | ~3GB     | 中等                    |
| medium   | ~769M  | ~5GB     | 较慢                    |
| large    | ~1.5B  | ~10GB    | 很慢                    |

### Faster Whisper （推荐）

基于 CTranslate2 框架重写，速度比原版 Whisper 快 4 倍，精度完全相同。内存占用显著降低（最多可降低 50%）。 GPU 加速时最快达到原速 20+倍（GPU 情况下 5 秒处理）。 完全兼容 Whisper API。

```
from faster_whisper import WhisperModel

# 支持量化选项以降低内存
model = WhisperModel("medium", device="cuda", compute_type="float16")

segments, info = model.transcribe("audio.wav", language="zh")
for segment in segments:
    print(f"[{segment.start:.2f}s - {segment.end:.2f}s] {segment.text}")
```

### SenseVoice

SenseVoice 是由阿里云通义千问团队开源的音频理解基础模型，作为 FunAudioLLM 生态的核心组件之一。2024 年 7 月正式开源，与 CosyVoice（语音生成）和 FunASR 工具包共同构成阿里云的完整语音 AI 解决方案。相比 Whisper 模型，SenseVoice 在中文和粤语识别上具有明显优势。

### Vosk 轻量离线方案

Alpha Cephei 的 Vosk 是最轻量的离线语音识别模型，建立在 Kaldi 基础之上，可运行在嵌入式设备上（Android，iOS，树莓派）。支持 20 多种语言，包括中文。低延迟，适合隐私敏感或网络受限的场景。

模型体积小只有 50 到 300 兆，支持多种编程语言绑定，提供流式识别 API。

### Kaldi

Kaldi 是 Daniel Povey 等学者开发的一款经典的开源 AR 研究工具包，自 2011 年发布，在 C 加加架构基础上，集成了完整的声学特征提取、语言模型训练。Apache 2.0 开源许可。

### PaddleSpeech（百度）

PaddleSpeech 单独针对中文进行了优化。支持多种 ASR 模型（DeepSpeech2、Conformer 等）

### kotoba-whisper 日语优化

针对日本语进行了优化，比 Whisper Large V3 快 6.3 倍，完全兼容 faster-whisper

### SeamlessM4T

SeemlessM4T ，Meta 公司发布，支持 100 种语言，支持语音到语音文本的多种翻译任务，可以保留语音的风格、韵律和情感。

支持如下 4 种任务

1. 语音到语音翻译（Speech-to-speech）
2. 语音到文本翻译（Speech-to-text）
3. 文本到文本翻译（Text-to-text）
4. 自动语音识别（ASR）

输入音频支持101种语言，音频输出支持35种语言，文本支持96种语言。


## Whisper 相关软件包

- [[WhisperX]]
- [[WhisperKit]]
- [[whisper.cpp]]

## 语音识别相关应用

语音识别相关的应用可以分成如下几类。

- 语音转文字输入法
    - [[VoiceInk]]
    - [[VoiceTypr]]
    - [[Voice Type]]
    - [[Whispering]]，开源，Whisper 模型
    - [[Wispr Flow]]
    - [[superwhisper]]
    - [[Spokenly]]
    - [[闪电说]]，利用阿里的 [[SenseVoice]] 模型
    - [[小凹输入法]]
    - [[豆包输入法]]
    - [[Ququ 蛐蛐]] ，开源
- 语音转文字笔记软件
    - [[Voicenotes]]
    - [[Emote]]
    - [[Dinox]]
- 视频音频转文字
    - [[MacWhisper]] 一款专为 macOS 系统设计的音频转文字工具，基于 OpenAI 的 Whisper 技术开发。它能够快速、准确地将音频文件转录为文本，同时支持超过 100 种语言，包括中文、英文、德语、西班牙语等。
    - [[pyTranscriber]] 开源项目，视频音频生成字幕
    - [[KlicStudio]] 开源，视频配字幕
    - [[VideoLingo]]，开源
    - [[Video Captioner]] 开源，基于 LLM 的智能字幕助手 - 视频字幕生成、断句、校正、字幕翻译全流程处理
    - [[MemoAI]] 闭源，视频生成字幕
    - [[BiliNote]]，视频生成字幕
    - [[YouDub-webui]]，开源

