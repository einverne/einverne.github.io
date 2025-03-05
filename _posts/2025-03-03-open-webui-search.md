---
layout: post
title: "Open WebUI 基于网页的大语言交互界面及联网搜索配置"
aliases:
- "Open WebUI 基于网页的大语言交互界面及联网搜索配置"
tagline: ""
description: ""
category: 经验总结
tags: [ open-webui, llm, openai, chatgpt, open-source, ollama, rag ]
create_time: 2025-03-03 19:27:42
last_updated: 2025-03-03 19:27:42
dg-home: false
dg-publish: false
---

之前的视频也介绍过，ChatWise，Cherry Studio，Chatbox 等大语言模型调用的本地客户端，虽然这些客户端都还是跨平台的，但是总还是需要占用本地的空间，今天我就来介绍一款基于网页的 LLM 交互客户端 Open WebUI，以及再介绍一下如何配置 Open WebUI 让其支持联网搜索。

## Open WebUI 是什么

Open WebUI 是一个功能丰富，用户友好的自托管大语言模型 Web 交互界面。Open WebUI 提供了一个类似 ChatGPT 的界面，但是允许用户与这种类型的 AI 交互

- 完全离线
- 本地环境可运行
- 多种模型支持，兼容 Ollama，ChatGPT 等多种 LLM
- 通过插件扩展能力
- 提供富文本输出能力
- 支持检索增强，本地 RAG 集成

<iframe width="560" height="315" src="https://www.youtube.com/embed/WKCGC2TU6nY?si=6Fs0LXWi_24o6Hw0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Bilibili](https://www.bilibili.com/video/BV1MS9BYaEa5/) | [YouTube](https://www.youtube.com/watch?v=WKCGC2TU6nY)

### Open WebUI 安装

可以直接通过 Docker compose 来安装，配置文件[参考](https://github.com/einverne/dockerfile)。

## 本地大语言模型

本地大语言模型通过 Ollama 来支持，可以参考之前我关于如果利用 Ollama 本地安装 DeepSeek 的[视频](https://www.bilibili.com/video/BV1m8KLeFEfJ/)。

## 配置联网搜索

在设置中，找到「联网搜索」配置，可以利用下方的在线服务，或者自己不熟 [[searxng]] 来实现联网搜索。

- Tavily，1000 积分
- Exa，80 USD，完成新手任务奖励
- SearXNG self-hosted，免费
