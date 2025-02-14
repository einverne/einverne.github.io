---
layout: post
title: ""
aliases:
  - ""
tagline: ""
description: ""
category: 
tags:
  - ai
  - google
  - google-gemini
  - google-ai
  - deepmind
create_time: 2024-12-20 20:37:52
last_updated: 2024-12-20 20:37:52
dg-home: false
dg-publish: false
profileName: blog
postId: 659
postType: post
categories:
  - 49
---

今天要来介绍一下 Google Gemini 刚刚推出的一个推理模型 Gemini 2.0 Flash Thinking model，这个是 Gemini 版本的 GPT o1 模型，这个模型会首先思考一下，然后再回复。

这个 AI 模型基于最近发布的 Gemini 2.0 Flash 模型，设计上与 OpenAI o1 一类的推理模型非常类似。

但是和 OpenAI o1 不一样的是，Gemini 的模型思考的过程会直接直接展示出来，因为模型「思考」（推理）的过程本身就非常有趣，现在在 AI Studio 中可以直接使用，可以直接看到模型的推理过程。

这一类的推理模型能够有效地进行事实检查。这个模型和 Gemini 2 一样支持多模态推理，所以也就支持图片、文字等混合输入。

目前可以在 Google AI Studio 中免费试用这一款会思考的 AI 模型。

Google DeepMind 首席科学家 Jeff Dean 说，Gemini 2.0 Flash Thinking 经过特殊的训练，能够利用其思考来强化推理，并且速度非常快。

这一款模型刚一推出，就在 Chatbot Arena LLM 排上了榜首，成为了各项指标的第一。

![vv3bcRoqS_](https://pic.einverne.info/images/vv3bcRoqS_.png)

## 限制

虽然 Gemini 2.0 Flash Thinking 支持多模态，并且可以处理非常复杂的问题，但是在目前使用上仍然有一些需要注意。

目前 Gemini 2.0 Flash Thinking 模型最大支持 32767 个 Token，每次输出最多只能产生 8192 个 Token 文本，当前的模型还不能与 Google 搜索以及其他第三方应用集成。

## 测试

先来测试一个简单的问题，在单词 strawberry 中有几个 r? 我已经分别问过 ChatGPT，Claude 都可以回答正确。

- How many letter 'r's in word 'strawberry'?
- 单词 strawberry 中有几个 r

再来一道常识题。

- If you're running a race and you pass the person in second place, what place are you in now?
- 如果在一个比赛从你超过了第二名，你现在的

再来一道找规律题，下面序列的数字，下一个数字是什么？

- What is the next number in this sequence: 1, 11, 21, 1211, 111221, ...?

我们再来看看一道真实出现在韩综《血之游戏 第二季》中的第一个出现的题目。节目组给出如下的题目，要求回答出四个数字解开绑住玩家的数字锁。大家先来猜猜正确答案是什么。

![yIN0P1pUIv](https://pic.einverne.info/images/yIN0P1pUIv.png)

- I have two lines of numbers, the first line is 06 68 88 ?? 98 and second line is ?? 91 11 90 10, help to find the two numbers at the mark ??

这道题目的正确答案是 8721，官方给出的解法是，将整个图片做一个 180 度旋转，就变成了

```
01 06 11 16 ??
86 ?? 88 89 90
```

第一行是一个等差数列，差 5 ，所以 16 + 5 答案是 21。第二行就是一个差 1 的等差数列，自然就是 87。

编程题

```
Given an array of numbers and an index i, return the index of the nearest larger number of the number at index i, where distance is measured in array indices.

For example, given [4, 1, 3, 5, 6] and index 0, you should return 3.

If two distances to larger numbers are the equal, then return any one of them. If the array at i doesn't have a nearest larger integer, then return null.

Follow-up: If you can preprocess the array, can you do this in constant time?
```
