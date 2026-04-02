---
layout: post
title: "Jina AI：为大语言模型而生的搜索基础设施"
aliases:
  - Jina AI 介绍
  - Jina.ai
tagline: "从 Reader 到 DeepSearch，一站式解决 LLM 数据获取难题"
description: "介绍 Jina AI 的核心产品线，包括 Reader API、Embedding API、Reranker、DeepSearch 等，以及实际使用体验和开发者视角的分析"
category: 产品体验
tags: [jina-ai, llm, embedding, reader-api, rag, ai-search, deep-search]
create_time: 2026-03-23 10:00:00
last_updated: 2026-04-02 10:00:00
---

![Jina AI Search Foundation](https://pic.einverne.info/images/2026-03-23-jina-ai-search-foundation.png)

最近在搭建一个基于 RAG 的知识库系统时，遇到了一个很常见的问题：怎么把网页内容干净地喂给大语言模型？原始的 HTML 里充斥着导航栏、广告、脚本等各种噪音，直接丢给 LLM 不仅浪费 token，还严重影响输出质量。在尝试了几种方案之后，我发现 [[Jina AI]] 提供了一套非常完整的工具链，从网页内容提取、文本向量化、到深度搜索，几乎覆盖了 LLM 数据处理链路上的每一个环节。

## Jina AI 是什么

Jina AI 是一家专注于搜索基础设施的 AI 公司，总部在柏林，在硅谷也有办公室。他们的定位很明确——为企业级搜索和检索提供基础模型（Search Foundation Models）。和那些提供通用大模型的公司不同，Jina AI 专注解决的是 LLM 生态中搜索、检索、数据处理这一层的问题。你可以把他们理解为 LLM 世界里的"水电煤"供应商，提供的是让 AI 应用真正跑起来所需要的基础能力。

目前 Jina AI 的产品线主要包括 Reader API、Embedding API、Reranker API、DeepSearch、Classifier 和 Segmenter 六大核心产品，所有产品共用一个 API Key，这一点在使用体验上非常友好。值得一提的是，Jina AI 在去年被 [[Elastic]] 收购并成为其旗下公司，这意味着 Jina 的模型现在可以原生运行在 Elastic 的推理服务（EIS）上，对于已经在用 [[Elasticsearch]] 的团队来说是个不错的消息。

## Reader API：最实用的 LLM 数据清洗工具

如果你只需要了解 Jina AI 的一个产品，那一定是 Reader API。它解决的问题非常直观：你给它一个 URL，它返回给你一段干净的 Markdown 文本，去掉了所有 HTML 标签、导航栏、广告、脚本等无关内容，只保留网页的核心信息。

使用方式简单到不可思议，只需要在任何 URL 前面加上 `r.jina.ai` 就行了。比如你想把一篇维基百科的文章转成 LLM 友好的格式，直接在浏览器里访问 `https://r.jina.ai/https://en.wikipedia.org/wiki/Artificial_intelligence` 就能看到结果。不需要 API Key，不需要注册，直接就能用，免费额度是每分钟二十个请求。如果你注册了免费的 API Key，速率限制会提升到每分钟五百个请求，对于大多数开发场景来说完全够用了。

Reader API 底层用的是 [[ReaderLM]] v2，这是一个专门为 HTML 到 Markdown 转换训练的十五亿参数的小语言模型，支持五十一万二千 token 的超长上下文窗口和二十九种语言。相比简单的正则表达式或 DOM 解析，这种基于语言模型的方式在处理复杂网页结构时效果要好得多，特别是那些大量使用 JavaScript 动态渲染的现代网页。

除了基本的 URL 转换，Reader API 还有一个搜索模式，通过 `s.jina.ai` 接口可以直接在网页上搜索并把结果转成 LLM 友好的文本。这对于需要实时获取互联网信息的 AI Agent 来说非常有用。

```bash
# 基本用法：URL 转 Markdown
curl https://r.jina.ai/https://example.com

# 带 API Key 的用法（更高速率）
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://r.jina.ai/https://example.com

# 搜索模式
curl https://s.jina.ai/latest+AI+news
```

## 本地开源方案：Defuddle

如果你的使用场景不需要云端 API，或者更偏好在本地处理网页内容，[[Obsidian]] 创始人 Steph Ango（GitHub ID 为 kepano）开源的 [[Defuddle]] 值得关注。Defuddle 解决的问题和 Reader API 非常相似——从网页中提取核心内容、去除导航栏和广告等干扰元素——但它是一个完全运行在本地的 JavaScript 库，不需要调用任何外部 API，目前在 GitHub 上已经获得了接近六千颗星。

Defuddle 最初是为 [[Obsidian Web Clipper]] 浏览器扩展而创建的，定位上可以看作是 Mozilla Readability 的增强替代品。相比 Readability，Defuddle 对页面元素的判断更为宽容，不会过度删除拿不准的内容；对脚注、数学公式、代码块等特殊元素的输出格式更加统一和规范；还能利用页面的移动端 CSS 样式来辅助判断哪些元素是装饰性的、可以去除。它同时支持浏览器环境、Node.js 和命令行三种使用方式，输出格式可以选择清理后的 HTML 或 Markdown。

```bash
# CLI 用法：直接解析 URL 输出 Markdown
npx defuddle parse https://example.com/article --md

# 保存到文件
npx defuddle parse https://example.com/article --md -o content.md
```

两者的选择逻辑其实很直观：如果你在构建需要大规模抓取的 RAG 系统，或者需要处理大量 JavaScript 渲染的动态页面（SPA），Jina Reader API 更合适，因为它在云端运行完整的浏览器环境来渲染页面。如果你只是在本地做一些内容提取和整理、不想依赖外部服务、或者更看重隐私和零成本（Defuddle 完全免费且 MIT 开源），那 Defuddle 是更轻量的选择。在我的日常工作流中，两者其实是互补的：快速剪藏网页文章到 Obsidian 用 Defuddle（Obsidian Web Clipper 底层就是它），批量数据预处理和 RAG 管线中用 Jina Reader API。

## Embedding API：多语言多模态向量化

Embedding API 是 Jina AI 的核心产品之一。简单来说，它把文本或图片转换成固定长度的向量，这些向量可以用来做语义搜索、聚类、分类等各种下游任务。如果你在做 RAG 系统，Embedding 模型基本上是必不可少的组件。

Jina 的 Embedding 模型目前已经迭代到了第五代。最新的 jina-embeddings-v5-text 在今年二月发布，提供了两个尺寸的选择：small 版本有六亿七千七百万参数，支持三万两千 token 的上下文和九十三种语言；nano 版本有两亿三千九百万参数，支持八千 token 上下文。在 MTEB 排行榜上，v5-text-small 是十亿参数以下表现最好的 Embedding 模型，排名第八。

如果你需要处理图片和文本混合的场景，可以看看 jina-embeddings-v4，这是一个三十八亿参数的多模态模型，能够同时处理文本和图片输入，在多模态检索任务上表现非常出色。

```bash
curl https://api.jina.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "jina-embeddings-v5-text-small",
    "task": "retrieval.query",
    "dimensions": 1024,
    "input": ["什么是知识蒸馏？"]
  }'
```

API 的接口设计遵循了 OpenAI 的风格，如果你之前用过 OpenAI 的 Embedding API，切换过来基本零学习成本。而且 Jina 的 Embedding API 已经原生集成了 [[Qdrant]]、[[Pinecone]]、[[Milvus]]、[[Chroma]]、[[Weaviate]] 等主流向量数据库，以及 [[LangChain]]、[[LlamaIndex]] 等 RAG 框架，直接把 API Key 填进去就能用。

## Reranker API：提升搜索相关性的关键一环

在搜索系统中，初次检索通常会返回大量候选结果，但排序不一定准确。Reranker 的作用就是对这些候选结果重新排序，把最相关的内容排到前面。Jina 目前最新的 Reranker 是 v3 版本，六亿参数，在多语言检索场景下表现非常强劲。

Reranker 在 RAG 系统中的价值常常被低估。很多人只关注 Embedding 模型的质量，却忽略了重排序这一步。实际上，加入 Reranker 之后，最终返回给 LLM 的上下文质量会显著提升，LLM 的回答准确度也会随之提高。Jina 官方的数据显示，在检索增强生成场景下，加入 Reranker 后的效果提升是非常明显的。

## DeepSearch：会思考的搜索引擎

DeepSearch 是 Jina AI 在今年推出的一个比较有意思的产品。它不是简单的搜索 API，而是一个会自主推理的搜索代理（Agent）。给它一个问题之后，它会反复执行搜索、阅读网页、推理分析的循环，直到找到满意的答案或者用完 token 预算为止。你可以把它想象成一个不知疲倦的研究助手，它会自己判断还需要搜索什么，还需要阅读哪些网页，直到彻底搞清楚一个问题。

DeepSearch 的 API 完全兼容 [[OpenAI]] 的 Chat API 格式，也就是说你只需要把 `api.openai.com` 换成 `deepsearch.jina.ai`，代码基本上不用改。它支持流式输出，可以看到推理过程中的每一步搜索和思考，这种透明性在调试和理解结果时非常有帮助。

```bash
curl https://deepsearch.jina.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "jina-deepsearch-v1",
    "messages": [
      {"role": "user", "content": "Jina AI 的 Embedding 模型和 OpenAI 的相比有什么优势？"}
    ],
    "stream": true
  }'
```

DeepSearch 的平均响应时间大约在五十七秒左右，比普通 LLM 调用慢很多，但它处理的是那些需要深度调研的复杂问题，在这个场景下这个响应时间是完全可以接受的。

## 定价策略

Jina AI 的定价模型在同类产品中算是比较透明和友好的。所有产品共用一个 token 池，不需要为每个产品单独付费。

- 免费额度：注册就送一千万 token，不需要绑定信用卡，适合评估和原型开发
- Prototype 套餐：50 美元买十亿 token（合每百万 token 0.05 美元）
- Production 套餐：500 美元买一百一十亿 token（合每百万 token 约 0.045 美元）

Reader API 甚至不需要 API Key 就能使用，每分钟二十个请求的免费额度对于个人开发者和小项目来说已经足够了。相比同类的云端产品如 [[Firecrawl]]、[[Crawl4AI]] 等，Jina 的 Reader API 在免费额度和易用性上都有明显优势；而和本地开源方案 [[Defuddle]] 相比，Jina 的优势在于能处理 JavaScript 渲染的动态页面，劣势则是需要网络请求且有速率限制。

如果你已经在用 AWS、Azure 或 Google Cloud，还可以直接通过云平台部署 Jina 的模型，走云平台的计费通道，这对于企业用户来说在合规和账单管理上更方便。

## 实际使用中的几点体会

在实际使用了几个月之后，我有一些比较切身的体会。Reader API 是我用得最多的产品，在构建 RAG 系统时它帮我省了大量的数据预处理工作。以前需要自己写爬虫、处理 HTML、去除噪音，现在一个 API 调用就搞定了。特别是遇到那种 JavaScript 渲染的单页面应用（SPA），传统的爬虫根本抓不到内容，Reader API 因为是在浏览器环境里渲染的，所以可以正确处理这些页面。

Embedding API 的多语言表现确实很好，我测试了中文、日语、英语的混合检索场景，结果都比较满意。v5 版本的 nano 模型在资源受限的场景下（比如边缘设备或者成本敏感的应用）是一个很好的选择，两亿多参数的模型在效果和效率之间找到了一个不错的平衡点。

DeepSearch 适合那些需要深度调研的场景，但日常简单的问答用不到它。我觉得它更适合作为研究助手的后端引擎，而不是实时对话系统的搜索组件。

有一个需要注意的点是 token 的消耗。虽然 Jina 的定价看起来很便宜，但如果你大量使用 Reader API 或 DeepSearch，token 消耗会比你预想的要快不少。Reader API 每次请求会消耗一个固定数量的 token（从一万 token 起步），DeepSearch 因为要经过多轮搜索和推理，一次调用可能消耗几十万 token。建议在正式接入之前先用免费额度充分测试，估算好用量再决定购买哪个套餐。

## 最后

Jina AI 给我的整体印象是一家非常专注的公司。他们没有试图做通用大模型，而是专注在搜索和检索这个垂直领域，把每个环节都做到了相当高的水准。从 Reader 到 Embedding 再到 DeepSearch，他们的产品线形成了一个完整的搜索基础设施栈，覆盖了从数据获取、向量化、重排序到深度搜索的全流程。

对于正在构建 RAG 系统或 AI Agent 的开发者来说，Jina AI 值得认真评估。特别是 Reader API，它可能是目前把网页内容转化为 LLM 友好格式的最简单方案。免费额度足够你充分体验，API 设计也足够简洁，基本上五分钟就能跑通第一个调用。如果你正在为 LLM 的数据输入环节发愁，不妨从 `r.jina.ai` 开始试试。
