---
layout: post
title: "EasyDict macOS 上的翻译利器"
aliases:
- "EasyDict macOS 上的翻译利器"
tagline: ""
description: ""
category: 产品体验
tags: [easydict, ai-translation, google-translator, translator, bob, saladict]
create_time: 2025-05-09 08:59:39
last_updated: 2025-05-09 08:59:39
dg-home: false
dg-publish: false
---

[Easydict](https://github.com/tisfeng/Easydict) 是一款使用 Objective C 编写的 macOS 上的开源一键翻译应用，集成了非常多的第三方接口。在我之前的文章中我也介绍过不少的翻译工具，包括查词翻译的 GoldenDict，欧陆词典等等，还有一些 Chrome 插件，之前还介绍过 [Pot](https://blog.einverne.info/post/2024/05/pot-cross-platform-translator.html) 这样一款开源的翻译工具，而今天介绍的这一款 Easydict 虽然没有跨平台，但是因为是使用 Objective C 和 Swift 编写，所以在使用体验和交互上要好不少。

## Easydict 是什么

`Easydict`  是一个简洁易用的翻译词典 macOS App，能够轻松优雅地查找单词或翻译文本。Easydict 开箱即用，能自动识别输入文本语言，支持输入翻译，划词翻译和 OCR 截图翻译，可同时查询多个翻译服务结果，目前支持[有道词典](https://www.youdao.com/)，**苹果系统翻译**，[DeepL](https://www.deepl.com/translator)，[谷歌](https://translate.google.com/)，[百度](https://fanyi.baidu.com/)和[火山翻译](https://translate.volcengine.com/translate)。

Easydict 作为一款开源软件，最初的灵感来源于 saladict 和 Bob，最初的版本也是以 Bob 为基础开发。作者[说过](https://github.com/tisfeng/Easydict) 这个世界上应该存在一款免费的开源的翻译软件。

Easydict 支持多种翻译工具，满足用户在不同场景下的使用需求

- 输入翻译，直接在应用中输入翻译
- 划词翻译，选中文本之后，进行翻译，这也是我使用最多的场景
- OCR 截图翻译 ，截取屏幕上的文字进行翻译

目前 Easydict 已经支持非常多的翻译引擎，包括了有道词典，苹果系统词典，苹果自带翻译，OpenAI，Gemini，DeepSeek，DeepL，Google 翻译，腾讯翻译，Bing 翻译，百度翻译，小牛翻译，彩云小译，阿里翻译，火山翻译。

Easydict 还集成了系统 TTS（文本转语音），支持 Bing，Google，有道，百度在线 TTS 服务。

## 安装

macOS 下非常简单：

```
brew install --cask easydict
```

## 使用

可以在基础设置中配置语言设置，自动查询，自动复制等等。
![PAVi](https://photo.einverne.info/images/2025/05/09/PAVi.png)

在服务中配置不同的翻译引擎。
![PD50](https://photo.einverne.info/images/2025/05/09/PD50.png)

### 调用系统自带的翻译

如果要在 Easydict 中调用系统自带的翻译，需要安装一个 [Shortcut](https://www.icloud.com/shortcuts/776f8a1d8e43471885e8a505eb9a9deb)
