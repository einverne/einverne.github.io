---
layout: post
title: "Flowith 基于白板的 AI 工具"
aliases:
- "Flowith 基于白板的 AI 工具"
tagline: ""
description: ""
category: 产品体验
tags: [ ai, canvas, ai-tool, dify, coze, gemini, chatgpt, claude, ]
create_time: 2024-11-17 13:44:36
last_updated: 2024-11-17 13:44:36
dg-home: false
dg-publish: false
---

[Flowith](https://gtk.pw/flowith) 是一款基于二维画布、节点式、支持动态 UI 的 AI 内容生成工具。Flowith Oracle 想要打造一款 AI agent，自动帮助完成多个步骤，复杂的任务需求，可以自主规划、拆分和完成任务。年初的时候知道了这一款工具，但是一直没有用起来，现在就来再好好体验一番。

## 作者谈为什么要做 Flowith，解决了什么问题？

目前市场上的 AI 产品大多都是聊天式 UI，是一个纯线性结构，但是在生成内容时，通常需要反复修改，对比和测试，因此需要一个非线性的对话和生成方式。

而目前节点式 AI 产品均是针对搭建工作流打造，比如 [[Dify]]、[[Coze]] 等，这一类产品主要针对强调执行， 大部分面向 toB 的业务，而 Flowith 希望实现用户和 AI 日常的交互在节点上运行，日常生成内容便可以进行自然发散分支，延伸和收缩。

## 功能

- 基于画布的交互：不同于传统聊天式 UI，你可以在一个类 Figma 的画布上和 GPT4、Claude 3 进行互动，更加有利于内容生产如反复生成文案、生成代码等的场景。
- 多人协作和社区分享：可以随时分享一个 flow 给好友或社区、用户可以直接在画布上进行实时多人生成和讨论。
- 生成式 UI：在自动模式下 AI 会根据用户的输入命令自动调整使用的 AI 模型和 UI 交互界面，降低使用成本。
- 丰富的交互方式，二维画布
- 多线程对话，多个分支，适合生成长内容
- 丰富的模型，OpenAI: o1 Preview、GPT-4o、4o-mini、Claude 3.5 sonnet 等 AI 模型，Stable Diffusion、DALL·E 3 等图片生成模型
- 极具性价比的订阅方案、且支持 GPT 4 Turbo、Claude 3 Opus、Gemini、MidJourney、SDXL 等模型的使用... （ GPT 3.5 免费）
- 多人实时协作，基于画布的 AI 产品，意味着用户可以直接分享一个画布给好友，直接浏览生成的结果，加入创造，在聊天式 AI 的产品中，协作功能其实帮助不大，只能帮助用户共享聊天记录或复制 Prompt 。
- 自主规划、拆分完成复杂任务
- 支持文件上传分析，支持 PDF，DOC，Excel 等多种格式，支持 OCR 识别
- 图像和语音合成，内置图像生成和语音合成
- 引导式追问，通过主动追问，获得完整的必要信息，提供高质量有深度的结果
- 支持调用外部工具（插件），比如推特搜索，小红书搜索，总结和推理，生成思维导图、PPT、网页等

## 使用

在下方的输入设置中可以选择不同的模式（Mode）

### General Mode

General Mode，通常模式，可以手动选择不同的模型直接生成内容，适合于对 AI 模型比较熟悉以及高阶的使用者
![xO8YO7Dvd8](https://pic.einverne.info/images/xO8YO7Dvd8.png)

支持的模型列表如下

![KTH-lI2WGT](https://pic.einverne.info/images/KTH-lI2WGT.png)

### Online Search Mode

Online Search Mode，在线搜索模式，顾名思义，就是可以通过搜索互联网来整合知识。和 Perplexity 或者 ChatGPT search（SearchGPT） 一样，通过实时检索来获取最新的信息。

![nVkpGaQiHE](https://pic.einverne.info/images/nVkpGaQiHE.png)

### Image Generation Mode

Image Generation Mode，图片生成模式，这个模式下，可以选择一个图像生成模型，然后在输入框中键入描述或者想要的图片，然后 AI 模型会根据描述来生成图片

![ZzkDKlLgBV](https://pic.einverne.info/images/ZzkDKlLgBV.png)

目前支持三种模型

- Stable Diffusion XL
- Stable Diffusion 3
- DALL·E 3

### Prompt Generation Mode

Prompt Generation Mode，Prompt 生成模式，可以输入一个简单或复杂的 Prompt，这个模式会返还一个优化过后的提示词。

![h5hl8nYqCx](https://pic.einverne.info/images/h5hl8nYqCx.png)

### Comparison Mode

Comparison Mode，比较模式，允许用户同时对比多个模型的返回，使用这个模式可以快速获取 12 个模型的返回结果。

![VudJXROpsN](https://pic.einverne.info/images/VudJXROpsN.png)

### Plugin Mode

Plugin Mode，插件模式，可以通过插件来增强能力

现在提供的插件有

- online search
- generate image
- summarize and decide
- translate text
- search products
- search patents
- read website
- gen webpage
- get video subtitles
- search images
- search google scholar
- search youtube video
- search websites
- deep thinking
- search twitter
- generate posters
- generate voice assistant

### Oracle Mode

Oracle Mode，不知道怎么翻译这个模式了，「神」的模式？，在这个模式下会使用最先进的 AI，支持复杂的，多阶段的任务，AI 会持续不断地优化以及调整需求。

![anaIQ-tk7S](https://pic.einverne.info/images/anaIQ-tk7S.png)

[注册账号](https://gtk.pw/flowith) 体验，不久就可以获得一个视觉体验非常好的知识结构。

![2VPvrs8VoZ](https://pic.einverne.info/images/2VPvrs8VoZ.png)

## 价格

目前提供三种 Plan，Premium Plan，Unlimited Plan，Advanced Plan。

![0DkcqnNUX4](https://pic.einverne.info/images/0DkcqnNUX4.png)
