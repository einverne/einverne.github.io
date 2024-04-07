---
layout: post
title: "AI Shell 让 AI 在命令行下提供 Shell 命令"
aliases:
- "AI Shell 让 AI 在命令行下提供 Shell 命令"
tagline: ""
description: ""
category: 学习笔记
tags: [ai-shell, ai, github, github-copilot, github-copilot-cli, openai, chatgpt, shell, bash, zsh]
create_time: 2024-04-06 21:36:41
last_updated: 2024-04-06 21:36:41
dg-home: false
dg-publish: false
---

[AI Shell](https://github.com/BuilderIO/ai-shell) 是一款在命令行下的 AI 自动补全工具，当你想要实现一个功能，敲一大段命令又记不住的时候，使用自然语言让 AI 给你生成一个可执行的命令，然后确认之后执行。

之前介绍过 [GitHub Copilot CLI](https://blog.einverne.info/post/2023/03/github-copilot-cli.html)，这个作者受到此启发，做了一个开源版本的命令行工具。

## 安装

安装

```
npm install -g @builder.io/ai-shell
```

设置 API KEY

```
ai config set OPENAI_KEY=<your token>
```

会创建一个 `.ai-shell` 文件在 home 根目录。

## 用法

用法就非常简单

```
ai <prompt>
```

或者开启对话模式

```
ai chat
```
