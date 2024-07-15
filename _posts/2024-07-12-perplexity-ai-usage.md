---
layout: post
title: "结合了 Google 和 AI 的对话搜索引擎：Perplexity AI"
aliases:
- "结合了 Google 和 AI 的对话搜索引擎：Perplexity AI"
tagline: ""
description: ""
category: 产品体验
tags: [ perplexity-ai, chatgpt, google-search, search-engine, ]
create_time: 2024-07-02 14:42:02
last_updated: 2024-07-14 14:42:02
dg-home: false
dg-publish: false
---

在日本，因为 SoftBank 和 Perplexity AI 开展了[合作](https://japan.einverne.info/p/195.html) ，所以最近大量的使用 Perplexity ，这一篇文章就总结一下 Perplexity 的优势和使用技巧。

## Perplexity AI 介绍

Perplexity AI 是一家成立于 2022 年的人工智能公司，总部位于美国加州旧金山。该公司由 Aravind Srinivas、Denis Yarats、Johnny Ho 和 Andy Konwinski 共同创立，致力于开发基于人工智能的对话式搜索引擎。如果简单的去理解，可以将 Perplexity AI 认为是一个结合了 Google 和 ChatGPT 等 AI 的对话式搜索引擎。以我最近的使用体验而言，基本上已经代替了 Google。

Perplexity AI 的主要产品是一款会话搜索引擎，能够理解和回应模糊或抽象的语言，提供准确的答案和相关链接。用户可以使用自然语言提问，Perplexity AI 会自动从互联网和其他数据源中收集、分析并呈现相关信息。

## 和传统搜索引擎的优势

### 自然语言搜索

我可以不再使用关键字，而使用自然语言进行搜索，Perplexity AI 会自动将自然语言转换提取关键字，然后进行搜索，然后使用大语言模型来组织结果进行返回，并且在右侧也会进行图片检索，返回最相关的一些图片。

![1i5hqvQAdR](https://pic.einverne.info/images/1i5hqvQAdR.png)

更甚至借助 AI 的识图能力，可以直接发送一张图片，然后询问图片中的内容，或者相关的问题，在之前的[文章](https://japan.einverne.info/p/195.html) 里面，我就举例，我发送了一张图片给 Perplexity AI，然后令我惊讶的是他返回的结果非常准确，从型号到使用方式完全正确，我创建了一个分享，也可以在[这里](https://www.perplexity.ai/search/a.d7lw2eTDS3LVelPkeWyw#0) 查看结果。

### 图片搜索及图片生成

传统搜索引擎只能返回互联网上既存的资源图片，但是 Perplexity 可以通过 Prompt 或者提问来生成一个相关的图片。

![xDw1uKlb8E](https://pic.einverne.info/images/xDw1uKlb8E.png)

但是这个生成图片的功能目前还是比较弱，相较于 [[Midjourney]] 等专业的图片生成工具还是有一定的差距。

## 相较于 ChatGPT 的优势

### 引用和可信度

使用 ChatGPT 或 Claud 等对话式 AI 的时候，我有一个非常大的担心，就是害怕他们创造不存在的，或者可能是错误的内容。而 Perplexity AI 则做到了每一条内容都有直接的引用，如果觉得内容存在问题，那么可以直接点击引用的内容来进行再次确认。这里就要吐槽一下 Google Gemini（Bard） 了，很多的情况下 Google 给出来的引用都是一些奇奇怪怪的链接，甚至在正文内容里面也会存在一些 「移除了无效网址」。

### 时效性

ChatGPT 的另外的一个缺点就是它的训练数据时效性问题，即使是最新的 4o 模型也做不到互联网上刚刚产生的信息就立即被索引，所以 ChatGPT 也需要一些插件和工具来实现最新内容的呈现，但是对于 Perplexity AI 而言，它天然就是实时的，因为他会根据搜索引擎的结果，整合之后在进行结果的返回。我甚至测试了一下我自己的博客，如果使用关键字甚至可以在几个小时之后索引到我自己的博客中的内容。

## 其他功能

### Collection 功能

在左侧 Library 中可以创建 Collection，Collection 是一个集合，在这个集合中提出的所有问题，都会默认带上创建时的 AI Prompt。
![afUvbeOvoQ](https://pic.einverne.info/images/afUvbeOvoQ.png)

创建 Collection。
![i7f3-hRFqW](https://pic.einverne.info/images/i7f3-hRFqW.png)

同样这个 Collection 还可以要请另外的用户进行一起检索。比如这里我创建了一个去台湾旅行的 Collection，那么就可以要请同行者一起来检索，计划旅行。所有的搜索和结果都会汇聚在一个 Collection 中。

### 分享搜索结果

就像上面我分享过的结果一样，所有的检索结果都可以一键分享出来，拿到链接就可以分享给所有的感兴趣的人。

### Pages

Perplexity AI 也可以将搜索结果一键转成 Page，那么 Perplexity AI 一下子就变成了一个在线笔记本，甚至这个笔记本也可以共享一起编辑，然后也可以通过分享将页面共享出来。

![d76xMsPgrh](https://pic.einverne.info/images/d76xMsPgrh.png)

## 缺点

### 速度稍慢

如果要说缺点的话，那么就是 Perplexity AI 的返回速度有点慢，相较于 Claude，Google Gemini，甚至 ChatGPT 来说等待的时间稍微有一点慢。

## 最后

Perplexity AI 在我最近的使用中确实是一部分代替了 Google，尤其是我想要直接的结果时，或者使用它来计划旅程等等情况下，Perplexity AI 在一定程度上也比 ChatGPT，Gemini 等 AI 返回结果更好一些。但是确实是比较慢，所以我会立即将搜索的内容再打开一个标签页放到 Claude 里面搜索。
