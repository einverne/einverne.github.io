---
layout: post
title: "Google Labs 出品的 NotebookLM：和你的文档对话"
aliases:
- "Google Labs 出品的 NotebookLM：和你的文档对话"
tagline: ""
description: ""
category: 产品体验
tags: [notebooklm, google, gemini, google-gemini, ai, ai-chat, research]
create_time: 2024-08-29 13:43:10
last_updated: 2024-08-29 13:43:10
dg-home: false
dg-publish: false
---

[NotebookLM](https://notebooklm.google/) 是一款由谷歌开发的 AI 驱动的笔记应用和研究应用，可以帮助用户提高研究效率和快速获取文档信息。它能够处理多种格式的文档，如 Google Docs、PDF 和文本文件，粘贴板内容，网页地址，Markdown 文档，并提供智能摘要、创意生成和个性化 AI 助手功能。

在 OpenAI 开放 API 不久之后就出现过 ChatPDG 这样的项目，通过 OpenAI 的语言理解能力使得我们可以使用自然语言和 PDF 进行对话，而 NotebookLM 就是 Google 实验室给出来的大语言模型的一个具体的使用案例。

使用起来最舒服的就是把 PDF 文档，网页内容等全部拉到网页中，然后就可以直接在网页中和文档进行对话，非常适合科研，阅读等场景。想要快速在文档信息中找到自己想要的内容。

NotebookLM 由 Google Gemini 1.5 Pro 提供支持，~~但是目前只对英文支持比较好，其他语言支持一般。~~ 经过 Google 多次迭代，目前已经支持了非常多的语言，包括中文。

## 视频演示

<iframe src="//player.bilibili.com/player.html?bvid=BV1qCHkecEDM&page=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

[YouTube 链接](https://youtu.be/W-mO0vAzKbY?si=sUR9fMuwI6NaC__A)

## 功能

![y394](https://photo.einverne.info/images/2024/08/27/y394.png)

传统的笔记应用，比如 Notion，Obsidian 等更专注于笔记的整理，分类，搜索，但是无法根据既有的笔记内容进行归纳总结，或者产生新的想法，或者回答用户的问题。而 NotebookLM 恰恰好解决了这些问题。

大语言模型最擅长的领域，自然语言处理能力，生成能力，对话能力，数据分析和信息提取能力，多任务处理。

## 应用案例一：快速总结长文

当前的大语言模型最擅长的事情就是通过文本推理产生新的文本，而从长文总结归纳就是大语言模型的长处之一。对于一份长达几十页的 PDF 文档，大语言模型也可以在几十秒甚至更短的时间内分细完成。

那这样一个功能有什么用处呢？可能很多人第一个反应就是让 AI 阅读论文，书籍，那直接就可以生成一论文摘要，读书笔记了。当然这是可行的。

但是我个人更倾向于让 AI 来帮助我实现我想要实现的事情，而不是让 AI 来代替我实现，比如以前研究某一个专业领域的内容的时候我回收集很多材料，包括很多的文字，但是精力有限，所以这些书和文档我可能看不完，但是如果有 NotebookLM，就可以快速让我知道这些材料大致讲述的内容是什么，我可以针对性的根据这些文档的总结来判断我自己阅读的优先级。

## 应用案例二：回答复杂问题

对于大语言模型而言，相较于传统的搜索引擎，在使用体验上有了很大的改善，终于可以用自然语言来进行提问了，NotebookLM 可以根据用户上传的文档，以及外部的知识库，回答用户的提问，并且可以在回答中直接引用资料原文。

在初学新知识的时候，最头疼的就是需要搞明白各个专业名词的含义。通过 NotebookLM，遇到不懂的概念可以直接问 NotebookLM，NotebookLM 会以对话的形式给出通俗易懂的解释。对于不理解的内容可以反复询问 NotebookLM，NotebookLM 也会给出更进一步的答案。

NotebookLM 也可以根据文本内容生成表格，通过整理可视化可以让知识记忆得更加牢固。

## 应用案例三：激发新的灵感

如果不知道怎么开始写自己的论文，或者没有灵感的时候，可以让 NotebookLM 梳理思路，列出大纲，给出一些新的想法，这个也是大语言模型在行的事情。

## 应用案例四：整理资料

NotebookLM 可以分类，标记重点，添加注释，创建连接和提取内容。将资料提供给 NotebookLM 就解放了我们本地整理打标签的过程，让 AI 作为私人秘书。
