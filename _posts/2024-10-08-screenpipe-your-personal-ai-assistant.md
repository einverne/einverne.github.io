---
layout: post
title: "Screenpipe 私人的 AI 助理 本地记录看到听到的一切"
aliases:
- "Screenpipe 私人的 AI 助理 本地记录看到听到的一切"
tagline: ""
description: ""
category: 产品体验
tags: [github, open-source, rewind, ollama, ai, desktop-app, macos, ai-assistant, ocr, screen-recording]
create_time: 2024-11-16 09:28:20
last_updated: 2024-11-16 09:28:20
dg-home: false
dg-publish: false
---

[screenpipe](https://github.com/mediar-ai/screenpipe) 是一款开源的，记录在本地的，屏幕录制，以及全文检索应用，可以和 [[Ollama]] 一起使用，可以作为 [[Rewind]] 的开源代替。很早之前接触 Rewind 的时候就感觉非常的神奇，在不联网的情况下，可以完全在本地记录屏幕上的所有内容，并且可以非常快得在本地检索，所有屏幕中的内容，要实现这个功能我能想到的要突破的技术点一个就是存储，另外一个就是 OCR 识别以及检索。

根据 Rewind 的官方的记录只能在 macOS 下运行，可想应该是使用了 M 系列芯片的机器学习能力，但是今天介绍的 screenpipe 则是将原来闭源的 Rewind 做出了一个开源实现版本，通过连续对用户屏幕和录音设备的记录，来记录用户一天 24 小时的内容。

不知道大家有没有遇到过一种情况，自己明明在几个月前在浏览器看过一篇文章，虽然能大概回忆起来几个关键字，但是就是怎么都找不回来，我自己是遇到过几次这样的事情，从 Chrome 历史纪录，从 Google History 里面都通过关键字找了一圈，但是我自己记住的关键字可能是文章正文的内容，在浏览记录里面完全找不到，这个时候 screenpipe 就派上了用场。

## 功能

- 持续的数据收集，记录所有屏幕活动以及语音输入
  - 支持中文 OCR
- 本地数据处理，所有的数据不会离开用户的设备，也不会发送到外部系统
- AI 自动化，利用 AI 分析收集的数据并自动执行各种任务
- 可定制的工作流，通过 JavaScript 创建 Pipe 来构建自己的工作流
- 跨平台，支持 Windows，macOS，Linux 等
- 自动会议记录，总结，根据在线会议的音频和演示内容，自动总结并创建摘要

## 安装

```
brew tap mediar-ai/screenpipe https://github.com/mediar-ai/screenpipe.git
brew install screenpipe
screenpipe
```

或者通过编译安装

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
brew install pkg-config ffmpeg jq tesseract cmake wget
git clone https://github.com/mediar-ai/screenpipe
cd screenpipe
cargo build --release --features metal
./target/release/screenpipe
```

## 缺点

目前运行 Screenpipe 还需要非常高的资源，会占用大量的 CPU 资源。

另外 Screenpipe 官方的站点如果输入了邮箱会被官方发送营销邮件，大家输入邮箱之前注意。

## related

- [[Rewind]]
- [[Ollama]]
