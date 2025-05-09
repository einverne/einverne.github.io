---
layout: post
title: ""
aliases:
- ""
tagline: ""
description: ""
category: 
tags: [ google-translator, deepl, pot, easydict, goldendict, macos,  ]
create_time: 2023-05-09 09:16:26
last_updated: 2023-05-09 09:16:26
dg-home: false
dg-publish: false
---

[Pot](https://github.com/pot-app/pot-desktop) 是一款开源的，跨平台划词翻译软件，利用 [[tauri]] 和 JavaScript 实现，集成了 DeepL、彩云小译、OpenAI 等 7 家翻译引擎，整合 Anki、欧路词典生词本。

Pot 支持划词之后立即调用翻译，以独立窗口展示翻译结果。

## 功能

- 支持 Windows、macOS、Linux 划词翻译
- 支持多家翻译引擎，包括百度翻译、谷歌翻译、腾讯翻译君、DeepL、彩云小译、OpenAI、火山翻译等
- 整合 Anki 与欧陆词典的生词本
- 支持以 SnipDo(Windows)、PopClip(MacOS)、Starry(Linux) 插件的方式运行
- 支持自定义快捷键、动态翻译、翻译后自动复制等功能。

其中 DeepL 与谷歌翻译在网络允许的情况下可以直接使用，其他接口需要自行注册及配置 API。

## 安装

在 macOS 上安装

```
brew tap pot-app/homebrew-tap
brew install --cask pot
brew upgrade --cask pot
```

## 使用

首次打开应用，记住在 Accessibility 中打开 Pot 设置。

![PYkQ](https://photo.einverne.info/images/2025/05/09/PYkQ.png)

### 基础设置

打开 Pot 之后可以进行一些基础设置，包括语言，主题，快捷键等等。

![P29I](https://photo.einverne.info/images/2025/05/09/P29I.png)

### 使用

在快捷键中设置翻译的快捷键，然后选中单词或句子，就可以直接调用 Pot 翻译引擎，Pot 会自动调用多个翻译工具来展示结果。

![PqMX](https://photo.einverne.info/images/2025/05/09/PqMX.png)

### 整合 Anki、欧路词典生词本

因为 Anki 没有开放 API，只能通过 [Anki Connect](https://pot-app.com/docs/api/collection/anki.html) 这样一款插件，在 Anki 客户端暴露一个接口。可以通过官方的配置[文章](https://pot-app.com/docs/api/collection/anki.html)进行 Anki 配置，之后就可以一键添加到 Anki 生词本了。

![PsoW](https://photo.einverne.info/images/2025/05/09/PsoW.png)

### 备份到 WebDAV

支持将软件的设置备份到 WebDAV。

![PO84](https://photo.einverne.info/images/2025/05/09/PO84.png)

### 插件运行

如果你使用以下软件：

- SnipDo(Windows)
- PopClip(MacOS)
- Starry(Linux)

那么就可以以软件插件的形式[调用](https://pot.pylogmon.cn/docs/tutorial/config/plugin_config) Pot 了。

## related

- [[GoldenDict]] 开源的查词应用
- [[欧陆词典]] 支持多词典的查词应用
- [[Easydict]] Object-C 编写的开源集成翻译工具
