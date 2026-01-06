---
layout: post
title: "让 AI 联网：Serper 极速 Google 搜索 API 使用指南"
alias:
- "让 AI 联网：Serper 极速 Google 搜索 API 使用指南"
tagline: "可能是目前最适合 LLM 集成的搜索工具"
description: "深度体验 Serper.dev，一个号称全球最快、最便宜的 Google 搜索 API。本文将介绍如何使用 Serper 为 LangChain 等 AI 应用赋予实时联网能力。"
category: 经验总结
tags: [ai, serper, google-search-api, langchain, llm, rag, dev-tools, python, api, web-scraping]
last_updated:
---

最近我在折腾一个基于 LangChain 的 AI 助手时，遇到了一个老生常谈的问题：**怎么让大模型获取最新的实时信息？**

虽然 ChatGPT 已经很强大了，但它的知识库永远是滞后的。当你问它"昨天发布的 iPhone 16 也是 60Hz 屏幕吗？"（假设场景），它大概率会一本正经地告诉你它不知道。为了解决这个问题，我们需要给 AI 装上"眼睛"，也就是联网搜索的能力。

我之前一直用 SerpApi，功能确实强大，覆盖了各大搜索引擎。但是，当我开始构建需要频繁调用搜索的 Agent 时，SerpApi 的响应速度（有时候需要 3-5 秒）和价格让我开始寻找替代品。

于是，我发现了 **Serper (serper.dev)**。

官方 Slogan 非常狂："The World's Fastest and Cheapest Google Search API"（世界上最快最便宜的 Google 搜索 API）。

用了两周下来，我发现它确实有点东西。今天就来和大家聊聊这个工具，特别是对于正在开发 AI 应用的朋友，这可能是一个性价比极高的选择。

## 什么是 Serper？

简单来说，[Serper](https://serper.dev/) 是一个专门提供 Google 搜索结果的 API 服务。

不同于那些通过模拟浏览器爬取页面的重型爬虫，Serper 似乎做了一些底层的优化，专注于返回结构化的 JSON 数据。它的核心卖点非常明确：

1.  **快**：官方宣称响应时间在 1 秒以内，实际体验也确实比 SerpApi 快不少。
2.  **便宜**：提供了非常慷慨的 Free Tier（前 2500 次搜索免费），这对于个人开发者和测试阶段的项目来说太友好了。
3.  **专为 LLM 优化**：它不仅被 LangChain 官方集成，而且返回的数据结构非常干净，不需要复杂的清洗就能直接塞给 GPT。

## 为什么选择 Serper？

在 AI Agent 的开发中，**速度**往往比**广度**更重要。

想象一下，用户问了一个问题，Agent 需要先去 Google 搜一下，然后阅读网页，最后生成答案。如果搜索这一步就卡了 5 秒，用户体验会非常糟糕。Serper 的极速响应（通常几百毫秒到 1 秒多）能显著减少 Agent 的"思考时间"。

此外，它的数据结构非常适合 RAG（检索增强生成）场景。它不仅返回标题和链接，还会自动提取出 Knowledge Graph（知识图谱）、Featured Snippets（精选摘要）以及 People Also Ask（相关提问），这些都是高质量的上下文信息。

## 深度体验：它能做什么？

Serper 目前主要支持以下几种搜索模式：

-   **Search (Web)**: 标准的网页搜索，类似你在 Google 搜索框输入关键词。
-   **Images**: 图片搜索。
-   **News**: 新闻搜索，获取最新资讯必备。
-   **Places**: 地点搜索，基于 Google Maps 数据。
-   **Videos**: 视频搜索。

对于绝大多数 AI 聊天机器人场景，标准的 Web Search 和 News Search 就足够覆盖 90% 的需求了。

## 动手实践：给 LangChain 装上"搜索引擎"

光说不练假把式。下面分享一下我是如何在一个 Python 项目中集成 Serper 的。

### 1. 获取 API Key

首先去 [serper.dev](https://serper.dev/) 注册一个账号。注册过程非常快，不需要绑卡（好评！），注册完直接能在 Dashboard 看到 API Key。

### 2. 最简单的调用方式 (cURL)

在写代码前，我们可以先用终端测试一下：

```bash
curl -X POST https://google.serper.dev/search \
  -H 'X-API-KEY: 你的API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"q": "最近的 AI 技术新闻"}'
```

你会收到一大串 JSON，里面包含了 organic 搜索结果、相关问题等。

### 3. 在 Python/LangChain 中使用

这才是重头戏。如果你在使用 LangChain，集成 Serper 简直易如反掌，因为官方已经内置了 Wrapper。

首先安装依赖：

```bash
pip install google-search-results langchain-community
# 其实 serper 不需要装 google-search-results，它是 http 请求，但 langchain 需要相关包
```

然后，设置环境变量并初始化工具：

```python
import os
from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_community.tools import Tool
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType

# 设置 API Key
os.environ["SERPER_API_KEY"] = "你的_SERPER_API_KEY"
os.environ["OPENAI_API_KEY"] = "你的_OPENAI_API_KEY"

# 初始化 Serper 包装器
search = GoogleSerperAPIWrapper()

# 我们可以直接测试一下搜索
# result = search.run("Elon Musk 最新动态")
# print(result)

# 将其封装为 Tool 给 Agent 使用
tools = [
    Tool(
        name="Current Search",
        func=search.run,
        description="用于回答关于时事、当前事件或你需要获取最新信息的问题。输入应该是搜索查询语句。"
    )
]

# 初始化 LLM 和 Agent
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

# 提问！
agent.run("现在的苹果公司股价是多少？")
```

当你运行这段代码时，你会看到 Agent 自动触发了 "Current Search" 工具，调用 Serper API，获取了最新的股价信息，然后整理成自然语言回答了你。整个过程非常丝滑。

### 遇到的小坑

虽然 Serper 很好用，但在使用过程中我也遇到过一些小问题：

1.  **中文搜索优化**：默认情况下，它会根据你的 IP 或通用设置返回结果。如果你专门针对中文内容，建议在 Payload 中加上 `gl: "cn"` (地理位置) 或 `hl: "zh-cn"` (语言) 参数，虽然 Wrapper 封装得比较死，但如果是自己封装 HTTP 请求时要注意这点。
2.  **Rate Limit**：虽然它是号称最快，但在极高并发下偶尔也会有波动。对于生产环境，建议做好重试机制。
3.  **结果截断**：Serper 返回的 snippet（摘要）通常比较短。如果你需要深入阅读网页内容来回答复杂问题，仅靠 Serper 的 snippet 可能不够，你可能还需要配合一个 Web Scraper（比如用 Firecrawl 或 Jina Reader）来抓取详情页。

## 总结与思考

在试用了 Serper 一段时间后，我把我的个人项目从 SerpApi 迁移过来了。

**核心价值点：**
- **快**：对于实时交互的 AI 应用，速度就是体验。
- **省**：2500 次免费额度对于个人开发者简直是做慈善，后续的定价也比竞品低不少。
- **简**：JSON 结构清晰，对 LLM 友好。

当然，如果你的需求是爬取百度、Bing 或者需要极其特殊的搜索参数，SerpApi 依然是老大哥。但如果你的目标仅仅是**"让基于 GPT 的应用能联网搜索 Google"**，那么 Serper 绝对是目前的最佳选择之一。

我越来越觉得，未来的 AI 开发，拼的不仅仅是模型能力，更是**工具链的组合能力**。像 Serper 这样专注于把"搜索"这一件事做到极致的 API，正是构建强大的 AI Agent 不可或缺的积木。

如果你也在做 AI 相关的开发，不妨去申请个 Key 试玩一下，给你的 AI 装上一双看世界的眼睛。

---

**参考资料：**
- [Serper 官方文档](https://serper.dev/playground)
- [LangChain Google Serper Wrapper](https://python.langchain.com/docs/integrations/tools/google_serper)
