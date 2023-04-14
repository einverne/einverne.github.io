---
layout: post
title: "Raycast AI 使用体验"
aliases:
- "Raycast AI 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [ raycast, launcher, macos, openai, ai, chatgpt, ]
create_time: 2023-04-11 18:13:57
last_updated: 2023-04-11 18:13:57
---

在之前的文章中就提到过 [Raycast](/post/2022/03/raycast-usage.html)，前不久看到 [[Raycast]] 快速跟进了 OpenAI，现在推出了 [Raycast AI](https://www.raycast.com/ai)，我没有想到的是，Raycast 的使用场景可以如此完美地和 AI 结合在一起。

Raycast 代替了如下我过去常常做的事情：

- 再不需要打开网页，或者 ChatGPT 客户端再输入问题
- 再不需要打开 Papago（或者 DeepL 等客户端）翻译段落（短句和单词基本靠 Chrome 插件和 [[GoldenDict]]）
- 再不需要打开 OpenAI Translator 对文本进行润色
- 直接在 Obsidian 中让 Raycast AI 进行语法检查，改写，并一键替换原文
- 代替 [[Cursor.so]] 编辑器的自然语言编程，Raycast AI 可以用来解释代码，生成代码并直接插入编辑器

## 直接提问

![sna8](https://photo.einverne.info/images/2023/04/11/sna8.gif)

## 翻译

选中文本，然后 Cmd+Space，translate 即可。
![ss9n](https://photo.einverne.info/images/2023/04/11/ss9n.gif)

## 润色文本

直接使用 Improve Writing，并将润色过的文本直接粘贴回 Obsidian。
![sYjl](https://photo.einverne.info/images/2023/04/11/sYjl.gif)

## 总结

如果在网上看到一段非常长的文章，可以直接选中，然后让 Raycast 总结。
![sA2g](https://photo.einverne.info/images/2023/04/11/sA2g.gif)

## Create AI Command

可以看到的是上面的所有的操作，大部分都是 Raycast AI 默认自己定义的，但是 Raycast AI 更强大的一点在于它可以自己创建 AI Command（prompt），也就是说可以利用 OpenAI 的上下文对话的能力，将一些固定的模式写道 Raycast 中，然后下次使用的时候就可以直接输入几个字母触发了。

## 一些小 Tip

- 如果不满意 Raycast AI 的结果，可以直接按 Cmd+R 重新生成。
- 生成内容之后可以使用 Cmd+k 来对结果进行更多的操作，比如复制，比如粘贴回选中的地方
- Raycast AI 可以设置快捷键，比如可以将常用的 Ask AI，translate 等等设置一个单独的快捷键

## alternative
如果还没有排到 Raycast AI，还可以试试 macOS 上的 [MacGPT](https://www.macgpt.com/)。

