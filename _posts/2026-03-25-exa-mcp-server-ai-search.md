---
layout: post
title: "Exa MCP Server：让 AI 助手拥有实时搜索能力"
aliases:
- Exa MCP Server
tagline: "给 AI 编程助手接上互联网搜索引擎"
description: "介绍 Exa MCP Server 的功能、配置方法和实际使用体验，一个让 Claude、Cursor 等 AI 助手获得实时网页搜索能力的开源工具"
category: 产品体验
tags: [exa, mcp, mcp-server, ai-search, claude-code, cursor, web-search, semantic-search, coding-agent, developer-tools]
create_time: 2026-03-25 10:00:00
last_updated: 2026-03-25 10:00:00
---

![Exa MCP Server 概念图](https://pic.einverne.info/images/2026-03-25-exa-mcp-server-cover.png)

最近在用 [[Claude Code]] 写文章和做技术调研的时候，经常需要获取最新的网页信息。Claude 自带的 WebSearch 工具能用，但返回的结果有时候不够精准，特别是搜代码示例和技术文档的时候。后来发现了 [[Exa]] 的 MCP Server（<https://github.com/exa-labs/exa-mcp-server>），接入之后搜索体验有了质的提升——不管是查最新的 API 文档、找代码示例还是做竞品调研，都比之前顺畅很多。

## Exa 是什么

[Exa](https://exa.ai/)是一家专门为 AI 构建的搜索引擎公司。和 Google 这类面向人类用户的搜索引擎不同，Exa 从底层就是为大语言模型设计的——它的搜索结果经过结构化处理，返回的内容干净、紧凑，直接适合作为 LLM 的上下文输入。

传统搜索引擎返回的是一堆带广告的网页链接，你需要自己点进去阅读。Exa 返回的是提取好的纯文本内容、代码片段或结构化摘要，LLM 拿到就能直接用。这个区别在 AI Agent 场景下特别重要——Agent 不需要看网页长什么样，它只需要准确的信息。

Exa 的搜索引擎基于自研的神经网络模型，索引了超过 10 亿个网页。2025 年 11 月发布的 Exa 2.1 版本在低延迟搜索（sub 500ms）和深度搜索两个方向都做到了业界领先。根据他们 2026 年 3 月公布的 WebCode 评测，在代码搜索的完整性、准确性和召回率上都排名第一。

## MCP Server 解决了什么问题

[[MCP]]（Model Context Protocol）是 Anthropic 提出的一个开放协议，目的是标准化 AI 应用与外部工具之间的通信方式。你可以把 MCP 理解为 AI 助手的「USB 接口」——只要工具实现了 MCP 协议，任何支持 MCP 的 AI 客户端都能即插即用。

Exa MCP Server 就是这样一个「USB 设备」。它把 Exa 的搜索能力通过 MCP 协议暴露出来，让 Claude Desktop、Claude Code、Cursor、VS Code、Windsurf 等 AI 编程助手可以直接调用 Exa 搜索。

没有 MCP Server 的时候，AI 助手的知识截止到训练数据的日期。有了 MCP Server，AI 助手可以实时搜索网页、抓取页面内容、查找代码示例——相当于给一个闭卷考试的学生发了一台联网的电脑。

## 提供的搜索工具

Exa MCP Server 默认启用三个核心工具，另外还有一个高级工具可以手动开启。

### 默认启用

`web_search_exa` 是通用的网页搜索工具。输入自然语言描述你想找的页面（不是关键词，而是语义描述），它会返回最相关的搜索结果和提取好的内容。支持按分类过滤（新闻、公司、研究论文、个人网站等）、按时间范围过滤、按域名过滤。

`get_code_context_exa` 专门用于搜索代码相关的内容。它会从 GitHub、Stack Overflow 和技术文档中找到最相关的代码片段、API 用法示例和文档说明。对于编程 Agent 来说这是最实用的一个工具——当你让 Claude Code 帮你用一个不熟悉的库写代码时，它可以先用这个工具查到最新的 API 用法，然后再生成代码，大幅减少幻觉。

`crawling_exa` 用于抓取已知 URL 的完整页面内容。当你已经知道某个网页的地址，想让 AI 读取并分析其中的内容时用这个。支持批量抓取多个 URL。

### 手动开启

`web_search_advanced_exa` 是高级搜索，提供完整的过滤控制——域名过滤、日期范围、文本包含/排除、内容摘要等。适合需要精确控制搜索结果的场景，比如只搜索某几个网站的内容，或者只要最近一个月的结果。

## 配置方法

Exa 提供了托管的远程 MCP 服务器，不需要在本地安装任何东西。统一的服务器地址是：

```
https://mcp.exa.ai/mcp
```

### Claude Code

在终端执行一行命令：

```bash
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

### Cursor

在 `~/.cursor/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "exa": {
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

### VS Code

在项目根目录的 `.vscode/mcp.json` 中添加：

```json
{
  "servers": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

### Claude Desktop

编辑配置文件（macOS 路径为 `~/Library/Application Support/Claude/claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
    }
  }
}
```

除了上面列出的客户端，Exa MCP Server 还支持 Windsurf、Zed、Gemini CLI、Warp、v0 by Vercel、Codex、Roo Code 等十几个 AI 客户端。配置方式大同小异，基本都是指定那个远程 URL。

如果出于安全考虑想在本地运行，也可以通过 npm 包的方式安装，需要自己提供 API Key：

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "your_api_key"
      }
    }
  }
}
```

API Key 在 Exa 的 Dashboard（<https://dashboard.exa.ai/>）上获取。

## 搜索技巧

和传统搜索引擎用关键词不同，Exa 的搜索更适合用自然语言描述你想要的页面。

比如你想找 React 19 Server Components 的用法，不要搜「React Server Components」，而是搜「blog post explaining how to use React 19 Server Components with examples」。这种语义化的查询方式能让 Exa 的神经搜索引擎更准确地理解你的意图。

代码搜索时，带上编程语言和框架版本号效果更好。「Python requests library POST with JSON body」比「python http」能返回更精准的结果。

搜索支持按 category 过滤：company（公司主页）、news（新闻报道）、research paper（学术论文）、personal site（个人博客）、tweet（推文）、financial report（财报）等。不同分类的过滤参数支持程度不同，比如 tweet 分类不支持域名过滤和文本过滤。

## 定价

Exa 每月提供 1000 次免费搜索请求，对于个人开发者来说基本够用。

| 功能 | 价格 |
| --- | --- |
| 搜索（含 10 条结果的内容） | 7 美元/千次 |
| 额外结果（超过 10 条的部分） | 1 美元/千条 |
| 摘要 | 1 美元/千条 |
| 深度搜索（Exa Deep） | 12 美元/千次 |
| 深度搜索（含推理） | 15 美元/千次 |
| 页面内容抓取 | 1 美元/千页 |

2026 年 3 月 Exa 调整了定价策略，把搜索结果的内容提取打包到了搜索费用中（之前是分开收费的），实际上对大多数用户来说价格降低了。对比同类产品，Exa 的定价在行业内处于中等偏低的水平。

也有创业和教育优惠计划，可以申请 1000 美元额度的免费使用。

## 和其他搜索 MCP 的对比

目前市面上主流的搜索 MCP 服务包括 Exa、Tavily、Brave Search 和 Perplexity。

Exa 的优势在于它是真正从零构建的 AI 原生搜索引擎，不是在 Google 结果上做二次封装。这意味着它的延迟更低（快速搜索 sub 500ms，而很多套壳方案因为需要先调 Google 再处理，延迟超过 1000ms）、返回的内容更适合 LLM 消费。

代码搜索是 Exa 特别突出的领域。根据他们的 WebCode 评测基准，Exa 在代码片段的完整性（82.8 分）、信号质量（94.5 分）和代码召回率（96.7 分）上都领先于竞品。

深度搜索（Exa Deep）是另一个差异化能力——它会自动执行多轮搜索来获取最优结果，适合需要高质量答案的复杂查询。延迟在 4-30 秒，但质量更高。

不足之处在于 Exa 的中文内容索引覆盖不如 Google 全面，搜索中文内容时偶尔会出现结果不够丰富的情况。如果你的主要使用场景是中文内容检索，可能需要搭配其他搜索工具一起使用。

## 实际使用感受

在 Claude Code 中接入 Exa MCP 之后，最明显的改善是技术调研效率的提升。以前让 Claude 搜索一个话题，经常需要多轮对话才能找到准确信息。现在一次搜索就能拿到结构化的结果，包括页面内容、发布时间、作者等元数据，Claude 可以直接基于这些信息生成更准确的回答。

代码搜索方面，当我让 Claude Code 使用一个不熟悉的 API 时，它会自动调用 `get_code_context_exa` 去查最新的文档和示例代码，然后基于真实的 API 用法来写代码，而不是靠训练数据中可能已经过时的知识去猜。这在使用更新频繁的库（比如 Next.js、FastAPI 等）时特别有用。

GitHub 上这个项目有超过 4000 个 Star，最近一次更新就在 2026 年 3 月 24 日，维护非常活跃。项目采用 MIT 协议开源，用 TypeScript 编写。

## 最后

Exa MCP Server 解决了一个很实际的问题：让 AI 编程助手能够获取最新的网页信息，而不是只依赖训练时的静态知识。对于经常使用 Claude Code、Cursor 或其他 AI 编程工具的开发者来说，花几分钟配置一下 Exa MCP Server，日常的技术调研和代码编写效率会有明显提升。

每月 1000 次免费搜索对个人开发者来说基本够用，如果用量更大可以考虑付费方案。建议先用免费额度体验一下搜索质量，觉得值再决定是否付费。

## 相关链接

- Exa 官方文档：<https://docs.exa.ai/>
- GitHub 仓库：<https://github.com/exa-labs/exa-mcp-server>
- API Dashboard（获取 API Key）：<https://dashboard.exa.ai/>
- npm 包：<https://www.npmjs.com/package/exa-mcp-server>
- Exa 博客：<https://exa.ai/blog>
