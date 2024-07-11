---
layout: post
title: "在阅读时借助 Yomichan 将日语单词一键保存到 Anki"
aliases:
- "在阅读时借助 Yomichan 将日语单词一键保存到 Anki"
tagline: ""
description: ""
category: 经验总结
tags: [github, open-source, japanese, anki, chrome-extension, japanese-language, japanese-learning, language-learning]
create_time: 2020-07-01 16:02:53
last_updated: 2024-07-11 16:02:53
dg-home: false
dg-publish: false
---

我一直都有这样的需求就是将不认识的日语单词查询字典之后，立即自动存入 Anki，以便于复习。在学习日语之前，学习英语的时候也有类似的需求，虽然之前借助字典应用部分解决了这个需求，但是问题一直还存在，因为 Anki 毕竟还是比字典自带的背诵记忆要强大很多，并且可自定义的部分很多。

那么今天介绍的这一款 [Yomichan](https://github.com/FooSoft/yomichan) 就是这样的一个解决方案，Yomichan 是一个开源的日语查词插件，但是它有一个强大的地方就是他可以连结 Anki，在查询完成之后可以一键将查询内容以及结果保存到 Anki 中，完美地解决了我当前的问题，唯一的遗憾就是 Yomichan 这一款插件已经不再更新，作者也在自己的官方主页上说了，之后不在维护，但好在代码是开源的，并且截止目前为止依然还可以在我本地完美的工作。

## 编译安装 Yomichan 插件

可以从 Yomichan 的 GitHub 页面拉取[代码](https://github.com/FooSoft/yomichan) ，然后根据官方的教程编译 Chrome 插件，然后通过 Chrome 安装插件。

## 借助 AnkiConnect 完成和 Anki 连接

AnkiConnect 是一个 Anki 插件，它给 Anki 暴露了一个本地的 RESTful 接口，这使得外部的应用可以通过 API 来和 Anki 交互，在 Anki 上安装此扩展，并启用。

在 Yomichan 的设置中和 Anki 进行关联。然后打开 Yomichan 的监听粘贴板。在使用连接之前还需要在 Yomichan 中设置发送到 Anki 的字段，比如在 Anki 中想要有多个字段，比如日语，ふりがな，日语解释，英语解释，例句等，可以分别在 Yomichan 中做关联，那么 Yomichan 会根据查询的内容，将这些字段发送到 Anki 模板对应的字段中。

![vPml](https://photo.einverne.info/images/2024/07/11/vPml.png)

那么如果遇到想要查询的日语词，直接复制，就会弹出一个查询的结果框，点击上面的 + 号就可以直接将查询的内容发送到 Anki 中。

## 一些小遗憾

初步的使用体验已经非常完美的接近了我的工作流，但是还是存在一些小的遗憾，我通常在桌面端会使用 [GoldenDict](https://blog.einverne.info/post/2018/08/goldendict.html)，GoldenDict 中有一些我非常喜欢的日中字典，比如说小学馆等，但是这些字典都无法在 Yomichan 上使用。
