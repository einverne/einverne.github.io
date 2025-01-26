---
layout: post
title: "Trae 字节推出的一款本地 AI 代码编辑器"
aliases:
- "Trae 字节推出的一款本地 AI 代码编辑器"
tagline: ""
description: ""
category: 产品体验
tags: [trae, vscode, windsurf, cursor, ide, code-editor, code, tool, editor, cloud-editor, editor]
create_time: 2025-01-26 10:19:28
last_updated: 2025-01-26 10:19:28
dg-home: false
dg-publish: false
---

前两天看到字节也发布了一款基于 Claude Sonnet 3.5 的 IDE，起名叫做 Trae（这个名字是 The Real AI Engineer 的缩写），对标我之前介绍过的 [Cursor](https://blog.einverne.info/post/2023/03/ai-powered-editor-cursor-so.html)，[Windsurf](https://blog.einverne.info/post/2024/11/windsurf.html) 等等代码编辑器，都是以 AI 为切入点，辅助进行编码，不仅可以进行自动代码生成补全，还可以理解上下文，通过超长的 Context 提供多文件生成修改的能力。

字节在 AI 上的布局不仅包括了经常被提起的豆包（聊天助手，对标 ChatGPT 等），还扣子（对标 Coze，Dify 等），即创剪映等视频内容生成功能，而现在通过 Trae 补齐了在代码生成领域的空缺，可以在 GitHub Copilot，Cursor，Windsurf 等工具中展开竞争。

## Trae 是什么

[Trae](https://www.trae.ai/) 官方的介绍说是一款智能协作的 AI Native IDE，也就是一款代码编程工具，从下载体验来看，也是基于 Visual Studio Code，而底层模型则是使用的 Claude 3.5 Sonnet，和之前介绍的其他编辑器一样。

![Mqjkq5b4n-](https://pic.einverne.info/images/Mqjkq5b4n-.png)

## UI

Trae 整体的观感和 VS Code 以及其他 IDE 无二，左侧是代码导航，以及插件等配置，中间主题部分是编辑器，右侧默认则是一个 AI 对话模式。

![yGx1WbQTfx](https://pic.einverne.info/images/yGx1WbQTfx.png)

## 特性

### 导入配置

![XAwf5OtYon](https://pic.einverne.info/images/XAwf5OtYon.png)

在使用引导的时候可以快速导入 VS Code 或者 Cursor 的配置。

### 代码生成

内置了 Claude 3.5 Sonnet 和 GPT-4o 两个大语言模型，可以工具用户的输入生成代码片段或完整的项目文件。

在 Chat 模式下，可以回答相关的代码问题，解释代码片段等。

![T_z8Y3XflG](https://pic.einverne.info/images/T_z8Y3XflG.png)

### 实时代码建议

在编码的过程中，Trae 会分析用户的上下文，并提供补全建议。

![Aq0Rpz03eH](https://pic.einverne.info/images/Aq0Rpz03eH.png)

## Trae vs MarsCode

其实在 Trae 之前字节还推出过一款基于浏览器的 IDE，叫做 [MarsCode](https://www.marscode.com/)，但是 MarsCode 更像是一款 Cloud IDE，类似于 Github Codespaces，[[Replit]] 以及刚刚介绍过的 [Google Project IDX](https://blog.einverne.info/post/2024/12/google-project-idx-cloud-ide.html)，等项目，都是想给用户提供一个云端，基于浏览器的编程体验。

![28gQjq7RWH](https://pic.einverne.info/images/28gQjq7RWH.png)

但是显然 Trae 是一款本地 Native 的编辑器，对标的是当前火热的 Cursor 等。在产品形态上有一些区别。

## 缺点

在使用过程中的一些问题。

### 代码补全问题

在 AI 已经给出建议的时候，按 Tab 却是完成了模块导入，并没有采用 AI 提示的内容。

### 插件市场

Trae 虽然是 VS Code 套壳，但是却自建了一套内置的插件商城，相较于 VS Code 成熟完善的插件生态，Trae 在处理时却将插件原始来源，反馈链接，作者链接等等隐藏了。

对比 Trae 以及 VS Code

![P6P_VEEZz-](https://pic.einverne.info/images/P6P_VEEZz-.png)

VS Code

![ZhrBqg7oUa](https://pic.einverne.info/images/ZhrBqg7oUa.png)

不知道是无心之举还是有意为之。

## 总结

总体来说 Trae 和 Cursor、Windsurf 等相比并没有太多使用上的差异，并且因为使用的底层模型都是类似的，所以能提供的 AI 智能相差也不是很大，可能的优势就是在本地化（中文语言），以及当前推广阶段还能免费使用。但是在这个编辑器竞争的领域下，能多一个有利的竞争对手，对我们用户来说倒也不算什么坏事。
