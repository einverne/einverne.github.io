---
layout: post
title: "Whispering 开源离线的语音转文字应用"
aliases:
- "Whispering 开源离线的语音转文字应用"
tagline: ""
description: ""
category: 经验总结
tags: [ whisper, open-source, tauri, svelte5, nodejs, web, html, voice-to-text, speech-to-text, ]
create_time: 2025-08-22 15:16:43
last_updated: 2025-08-22 15:16:43
dg-home: false
dg-publish: false
---

在之前的视频和文章当中，我给大家介绍过非常多语音转文字的应用， 有订阅制的 [[Aqua Voice]] ，[[Wispr Flow]] ，[[Voicenotes]]，[[VoiceInk]] ，[[superwhisper]] ，也有免费的 [[Spokenly]] ，在本地完全离线运行的 [[Tok]] 。 今天要为大家介绍的**Whispering**，正是这一领域的颠覆性产品——一个真正的开源、本地优先的语音转文字应用。

[Whispering](https://github.com/epicenter-so/epicenter/tree/main/apps/whispering) 它符合了我之前选择软件的所有的准则，开放源代码，Local First 支持本地转译，大大减少了隐私暴露的风险。

## Whispering 是什么

Whispering 是一款完全免费，开源的桌面语音转文字应用，基于 Svelte 5 与 Tauri 构建的， 支持本地和云端转录、LLM 驱动文本转换（Transformation）、语音激活模式（VAD）等功能。 即使有这么多功能，Whispering 体积只有 22M， 可以在 macOS、Windows、Linux 以及浏览器当中运行。

![O7JUe1Xorz](https://pic.einverne.info/images/O7JUe1Xorz.png)

现在在日常生活当中， 我越来越依赖于语音输入进行文字的录入，大部分订阅式的语音转写工具都是闭源的或者是黑盒式的。 我们无法知道我们的录音被发送到了什么地方进行了转写。 与此同时，造成的隐私泄露我们也无法估计。Whispering 遵循本地优先的设计理念， 让用户真正掌握自己的数据。

核心的特性包括：

- 开源 MIT 许可，所有的代码都可审计。音频与文本数据均存在于本地，用户可以完全掌握录音数据。
- 本地优先， 支持本地的 Whisper C++（Speaches）转录， 无需联网即可使用。
- 可扩展的文本后处理， 可以兼容任意的外部大模型， 用户可以自定义 Prompt， 进行自动矫正， 翻译或者是格式转换。
- 轻量，Svelte 5 和 Tauri 实现，应用响应非常快

Whispering 通过本地 IndexedDB 存储了语音的记录和转写的文本， 会保存在浏览器或者桌面端的数据库当中。 如果用户使用外部服务的话， 可以直接将音频或者是文本内容发送至外部的服务器， 没有中间服务器， 确保了用户 API Key 的安全。

## 核心功能

### 本地和云端转录

当然，在本地模式的基础之上， Whispering 还支持云端模式， 可以支持 Groq， OpenAI， 11Labs 等云端转写的场景。 用户可以自己配置 API Key， 按需付费。

### 语音激活 VAD 模式

传统的语音转录应用都需要我们按下特定的快捷键， 或者是长按某些快捷键来进行触发。 Whispering 最具创新的功能就是**语音激活模式**。 用户只需要按一次就可开始会话, 应用会自动检测语音的开始和结束, 无需持续按住按钮或者反复切换。

### AI 驱动的文本转换 Transformations

Whispering 可以和任意的 LLM 集成， 可以做语法纠正、翻译、简化文本，结构化摘要等。

### 快捷键和粘贴板集成

Whispering 也可以通过全局的快捷键进行触发， 转写的结果会自动粘贴到当前光标的位置。

## 成本对比

Whispering 的官方文档上面也给出了一个性能和成本的对比。 我们使用不同的云端服务和模型， 都有不同的价格， 大家也可以进行一个参考。 从成本上来看，Whisperin 可以以最小的支出， 就可以满足日常数小时的转录需求， 实现了与闭源工具成本显著的差异化。

| 服务与模型                        | 成本（每小时） | 轻量使用（20 分/天） | 中度使用（1 小时/天） | 重度使用（3 小时/天） | 传统闭源工具 |
| --------------------------------- | -------------- | -------------------- | --------------------- | --------------------- | ------------ |
| distil-whisper-large-v3-en (Groq) | $0.02          | $0.20/月             | $0.60/月              | $1.80/月              | $15–30/月    |
| whisper-large-v3-turbo (Groq)     | $0.04          | $0.40/月             | $1.20/月              | $3.60/月              | $15–30/月    |
| gpt-4o-mini-transcribe (OpenAI)   | $0.18          | $1.80/月             | $5.40/月              | $16.20/月             | $15–30/月    |
| 本地转录（Speaches/Whisper C++）  | $0.00          | $0.00/月             | $0.00/月              | $0.00/月              | $15–30/月    |

开源的应用也确保了用户永远不会锁定在特定的厂商生态中，即使原开发团队停止维护，社区也可以继续地开发和改进。

## 实现架构

Whispering 采用了现代化的三层架构技术栈， 在桌面和 web 端实现了 90%的代码复用，确保了应用的性能和用户体验。

- 服务层（Service Layer），是平台无关的业务逻辑，使用 well-crafted result 类型处理错误。
- 查询层 Query Layer 基于 TanStack Query 实现响应式数据的获取和缓存。
- UI 层 ，采用 Svelte 5 组件搭配 Tailwind CSS 和 shadcn-svelte， 打造了可访问的交互界面

主要技术栈：Svelte 5、SvelteKit、Tauri、Rust、IndexedDB/Dexie.js、TanStack Query、TailwindCSS、WellCrafted、shadcn-svelte、Turborepo 等。

- Svelte 5 提供了响应式的 UI 和高效的状态管理。
- Tauri 实现了原生桌面性能,同时保持了应用的小巧，Rust 为原生桌面功能提供了最佳性能。
- IndexedDB + Dexie.js 可靠的本地数据存储。

## 最后

Whispering 以其开源透明本地优先的设计理念 以及高效轻量的实现手段， 为音频转文字提供了一个强有力的开源替代方案。 无论是隐私敏感的个人用户， 还是需要定制化 AI 处理的开发者， Whispering 都能够以低成本高可控性满足需求， 并在开源社区中持续迭代和发展。

Whispering 不仅仅是一个独立的语音转录应用，它是 Epicenter 生态系统的重要组成部分。Epicenter 的愿景是将用户的所有数据——笔记、转录、聊天记录——存储在一个包含纯文本和 SQLite 的文件夹中。所有工具共享这个内存，形成一个开放、可调整的个人数据生态。在这个生态系统中，Whispering 转录的文本可以无缝集成到其他 Epicenter 应用中，如本地 AI 助手 epicenter.sh。这种设计避免了应用间的数据孤岛问题。

## related

- [[Speaches]]