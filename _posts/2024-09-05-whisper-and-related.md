---
layout: post
title: "OpenAI 的 Whisper 以及相关模型和项目"
aliases:
- "OpenAI 的 Whisper 以及相关模型和项目"
- "OpenAI 的 Whisper 以及 Whisper.cpp Faster-Whisper FunASR distil-whisper 等"
tagline: ""
description: ""
category: 整理合集
tags: [ whisper, openai, whisper.cpp, faster-whisper, funasr, distil]
create_time: 2024-09-06 22:02:31
last_updated: 2024-09-06 22:02:31
dg-home: false
dg-publish: false
---

自动语音识别技术 （Automatic Speech Recognition，简称 ASR）最近得到了非常大的提升，这个技术允许计算机通过识别语音将其转录成文本，在日常生活中有着非常广泛的应用，比如各类语音助手，Siri，Google Now ，Alex 等等。 另外还有一项技术是通过文字生成语音（Text to Speech，简称 TTS），这一项技术在前两年听书的时候经常会用到，但是之前的语音合成的效果非常不好，但是这两年的发展越来越听不出来是机器了。

而现在要说的是 OpenAI 在语音识别技术上推出的 Whisper 模型，并且随着 Whisper 的发布，又诞生了很多衍生的项目和模型，这就是本文的重点。

- [[whisper.cpp]] 最早接触到的项目，使用 C++ 重写，速度相对较快
- [[faster-whisper]] 在 OpenAI Whisper 的基础上做了改进
- [[WhisperX]]，优化时间戳以及人声辨别
- [[distil-whisper]] 这是 Hugging Face 团队在 Whisper 核心的基础上开发的，经过优化和简化，体积减少了 50%，速度提高了 6 倍。

## Whisper

Whisper 是 OpenAI 开发的语音识别模型，采用编码器-解码器 Transformer 架构，Whisper 在 68 万小时的多语言和多任务监督数据上训练，包括 11.7 万小时 96 种语言的语音数据，12.5 万小时任意语言到英语的翻译数据。

Whisper 提供 5 种不同规模的模型，从 tiny 到 large，参数量从 39M 到 1.55B 不等，以平衡速度和准确性。

主要功能：

- 多语言语音识别
- 语音翻译
- 时间戳生成

Whisper 可以用于会议记录，字幕生成，内容创作等等场景。

## whisper.cpp

[whisper.cpp](https://github.com/ggerganov/whisper.cpp) 是 OpenAI 的 Whisper 语音识别模型的 C/C++ 移植版本，速度上快了不少。同样和 Whisper 一样支持多语言，并且使用 C++ 编写有更好的移植性

- [HuggingFace 模型链接](https://huggingface.co/ggerganov/whisper.cpp/tree/main)

它具有以下主要特点和优势:

1. 轻量级实现：整个模型实现仅包含在 whisper.h 和 whisper.cpp 两个文件中，便于集成到其他项目中
2. 高性能：使用 C/C++ 实现，相比 Python 版本的 Whisper 具有更快的识别速度
3. 跨平台支持：可以在 Windows、Mac OS、Linux、Android 等多种平台上运行
4. 低依赖性：不需要安装额外的第三方库，只需要一个 C/C++ 编译器即可编译和运行
5. API 友好：提供简单易用的 C 风格 API，方便开发者集成和使用
6. 模型量化：支持模型量化，可以减小模型大小并提高推理速度
7. GPU 加速：支持 CUDA 等 GPU 加速，可以进一步提升识别速度

## faster-whisper

[Faster Whisper](https://github.com/SYSTRAN/faster-whisper) 是基于 OpenAI 的 Whisper 模型的一个高效实现版本。同样支持多语言，并且因为经过了大量的改进，使用和部署起来更加方便。

它具有以下主要特点和优势:

1. 高效性能: Faster Whisper 利用 CTranslate2 推理引擎对 Whisper 模型进行了优化，使其推理速度比原始 Whisper 模型快 4 倍以上，同时使用的内存更少
2. 保持准确性: 在提高速度的同时，Faster Whisper 保持了与原始 Whisper 模型相同的准确性
3. 内存优化: 支持 8 位量化技术，可以在不牺牲太多准确度的情况下，进一步减少模型在 CPU 和 GPU 上的内存占用
4. 多语言支持: 与原始 Whisper 模型一样，Faster Whisper 支持多种语言的语音识别
5. 灵活部署: 可以在 CPU 或 GPU 上运行，适用于各种硬件环境
6. 应用场景广泛: 适用于需要快速、准确语音识别的多种场景，如实时会议记录、客户服务、医疗记录转写等
7. 开源可用: Faster Whisper 是开源项目，可以免费使用和进行二次开发
8. 易于使用: 提供了简单的 Python API，使得集成和使用变得相对容易

Faster Whisper 最适合本地部署尝试，并且通过 Python 调用也非常方便。

## whisperX

[whisperX](https://github.com/m-bain/whisperX) 是一个基于 OpenAI 的 Whisper 模型进行改进的开源项目,主要用于高精度的自动语音识别(ASR)和说话人分离。

1. 高精度时间戳: whisperX 通过使用强制对齐技术,显著提高了生成的文本时间戳的准确性。这对于需要精确时间同步的应用场景非常有用。
2. 说话人分离: 项目集成了说话人分离功能,可以识别并区分音频中的不同说话者。这在处理多人对话或访谈录音时特别有价值。
3. 多语言支持: 继承了 Whisper 的多语言能力,可以处理多种语言的语音识别任务。
4. GPU 加速: 利用 GPU 加速计算,提高了处理速度,特别适合处理大量或长时间的音频数据。
5. 易于使用: 提供了简单的命令行接口,使用者可以轻松地进行语音识别和转录。
6. whisperX 项目开源允许开发者自由使用、修改和贡献代码。
7. 灵活性: 可以与其他工具和库集成,扩展其功能或应用于特定领域。

## distil-whisper

[distil-whisper](https://github.com/huggingface/distil-whisper) 主要的特点就是快，语音识别速度提高了 5.8 倍，并且模型体积小，更适合资源有限的设备。Distil-Whisper 在 Whisper Large-v2 模型的基础上生成了一系列 soft targets ，然后复制 Whisper 网络的第一层和最后一层解码器，最后生成了一个更小、更快效果更好的蒸馏模型 Distil-Whisper。蒸馏模型指的是模型压缩和知识迁移技术，将大型复杂模型的知识转移到小型简单模型中。 论文地址 [arxiv](https://arxiv.org/abs/2311.00430) 。

特点

- 准确性上，词错误率 WER 和 Whisper 相比只有 1% 的差距
- 在嘈杂环境下依然能保持较高的识别准确率
- 减少了重复词组的出现，减少幻听

模型之所以效果不错，主要还是因为训练数据完备，结合了九个公开的语音模型数据，合并后包含 21170 小时的语音数据，涵盖超过 18260 个说话者以及 10 个不同的领域。

Distil-Whisper 目前开源在 Hugging Face 上，[模型地址](https://huggingface.co/distil-whisper/distil-large-v2)，[GitHub](https://github.com/huggingface/distil-whisper)，同时还提供了一个可在线测试的 [Demo](https://huggingface.co/spaces/Xenova/distil-whisper-web)，这个 Demo 会把模型下载到本地，然后通过 WebGPU 直接在网页上跑起来，测试了下效果，还是挺不错的。

目前仅支持英文，如果想让它支持中文，需要使用同样海量的中文语料数据，重新做一次知识蒸馏，但我觉得即便是这样做，效果也不一定好，因为 Whisper 本身对中文、韩语等支持就不太优秀，这个信息可以从 Whisper 的论文中找到数据支撑。

## FunSAR

[FunSAR](https://github.com/modelscope/FunASR/) 是阿里达摩院在 Whisper 的基础上推出的 ASR 模型，对中文支持比较好，但是在噪声多的场景表现不如 faster-whisper。

## 模型

- ggml-medium.bin，速度和正确率权衡下的选择


## related

- Hugging Face 上所有关于 [Whisper](https://huggingface.co/models?search=whisper) 的模型
- [[HeyGen]]
- [[so-vits-svc]]
- [[voicechat2]]
- [[whisper-cli-rs]] 是一款 Rust 编写的 CLI，直接调用 whisper.cpp，在 M1 芯片上更快
- [insanely-fast-whisper](https://github.com/Vaibhavs10/insanely-fast-whisper) 是一个开源的 Jupyter Notebook，也是一款 Whisper CLI，在高端显卡的加持下，2.5 小时的音频可以在 98 秒内完成转写。
- [[whisper-plus]] 是一个 Python 相关的库，集成了常用的方法，模型等。
- [[whisper-ctranslate2]]  是一个 Whisper CLI 客户端，兼容原版 OpenAI client。

## related app

- [[MemoAI]]
- [[MacWhisper]]
- [[BetterDictation]]
- [[superwhisper]]
- [[Flow]]
