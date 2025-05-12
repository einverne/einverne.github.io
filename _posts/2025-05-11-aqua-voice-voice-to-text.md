---
layout: post
title: "Aqua Voice 利用语音转文字提升产出效率"
aliases:
- "Aqua Voice 利用语音转文字提升产出效率"
tagline: ""
description: ""
category: 产品体验
tags: [voice-to-text, ai, ai-transcript, audio-transcript, pytranscriber, memoai, mac-whisper, whisper, openai, chatgpt, voice, voicenotes]
create_time: 2025-05-11 10:00:46
last_updated: 2025-05-11 10:00:46
dg-home: false
dg-publish: false
---

之前我介绍过 [[MacWhisper]]，[[MemoAI]] ，[[VideoLingo]]，[[pyTranscriber]] 等等语音转文字的 AI 工具，但当时我的需求只是将视频中的音频转为文字，或者字幕，但是，随着现在语音转文字技术的发展 ，我越来越意识到手工通过输入法来输入文字的效率非常低。 所以我一直在寻找有没有可能在电脑上直接通过语音来编写文章。

## macOS

所以我找到的最初的解决方法就是使用 macOS 它默认的语音转文字功能， 在系统设置上中，搜索 Dictation， 就可以找到关于语音转文字的设置。 在其中可以设置快捷键，默认识别的语言是否自动添加标点符号等等。

当我双击 Ctrl （我自己设置的快捷键）的时候，macOS 会自动进入 Dictation 模式，此时 macOS 会自动收录麦克风识别到的语音，并自动实时进行语音转文字。macOS 上面的 Dictation 虽然是可用的，但是我自己使用的过程中也遇到过一些问题，比如无法自动添加标点符号，有些时候相近发音的字词会识别有误，同样的 Dictation 也只能按照语音内容逐字的翻译。
![RT0NhslutT](https://pic.einverne.info/images/RT0NhslutT.png)

## Aqua Voice

上面也提到了，虽然 macOS 上的 Dictation 是可用的，但是识别率会飘，另外就是只能逐字进行转换，但是现在要介绍的这一款 Aqua Voice 就将这些问题都进行了很好的解决。

Aqua Voice 是一款先进的语音转文字的应用程序，可以通过语音输入来提升用户在 macOS 和 Windows 平台上的生产力。

![t-a8UsxoBT](https://pic.einverne.info/images/t-a8UsxoBT.png)

Aqua Voice 主要功能

- 极低的延迟和高准确率，语音识别只需要几百毫秒
- 针对复杂任务的流式模式只需要 800 毫秒左右
- 深度理解对话上下文，通过 macOS 的屏幕共享可以识别用户屏幕的内容，文档的上下文，智能补充信息
- 用户可以直接使用口语来调整文本格式和内容，比如可以说出「改成列表」，「插入表格」等来改变文本结构，通过指令来缩短句子，调整语气，清楚多余的填充词
- Aqua Voice 可以在常用的任何文档工具中使用，不依赖特定的运行环境
- 可以自动格式化以及内容纠正，自动修正拼写，语法错误，添加标点符号等
- 针对开发者优化，可以提供代码高亮，支持术语纠正，比如说创建函数 getUserData 接受 ID 参数，返回 User 对象
- 自定义字典，可以添加专有词汇，比如人名，特定技术术语等
- 多语言支持，Aqua Voice 支持 49 种语言识别和文本生成

## 使用案例

### 编写笔记

比如在使用 Obsidian、Notion 等笔记应用的时候，可以快速通过语音来输入文字。

Cursor 等等一些代码工具编辑的时候，也可以利用这一个 Aqua Voice 进行一个文字的输入或者是代码的输入。因为 Aqua 对代码编辑也做了一定的优化，可以很好的帮助用户输入代码。

### 创意构思

Aqua 非常适合当我们产生灵感，想要快速记录的时候，可以直接调用出 Aqua ，然后和它进行语音交互，并且可以像和 AI 对话一样，让其帮助整理思路，并转成文字记录下来。

Aqua Voice 可以实现逐字转换，但是 Aqua Voice 也可以根据用户的语音输入进行调整。

我在之前的博客上也介绍过另外一款语音笔记软件 [[Voicenotes]]，这也是一个很好的灵感构思记录工具，最近也发布了 macOS 版本。

### 编写回复邮件

因为 Aqua Voice 不仅能够进行语音转录，也支持通过屏幕共享的方式来理解上下文，所以特别适合像编写回复邮件等等场景，因为 Aqua 可以理解屏幕中的内容，所以可以很好的根据用户的语音编写一个合适的邮件回复。

当然 Aqua Voice 还有非常多的使用场景，也欢迎大家在评论区探讨，交流。
