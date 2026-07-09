---
layout: post
title: "claude-mem：让 AI 编程助手拥有持久记忆"
aliases:
- "claude-mem：让 AI 编程助手拥有持久记忆"
tagline: "每次新会话不再失忆，上下文跨会话持续积累"
description: "介绍 claude-mem 这款开源项目，它为 Claude Code 等 AI 编程助手提供持久记忆能力，让 AI 记住跨会话的上下文、决策和经验。"
category: 经验总结
tags: [claude-code, ai, memory, productivity, tool]
create_time: 2026-06-16 13:00:00
last_updated: 2026-06-16 13:00:00
---

用 [[Claude Code]] 已经有一段时间了，它作为 AI 编程助手确实好用，但有一个问题始终让我感到遗憾：每次开启新的会话，Claude 就像刚出生一样，对之前我们一起讨论过的架构决策、踩过的坑、做出的权衡，统统不记得了。我得重新介绍项目背景，重新解释上次解决的思路，重新建立起那个"默契"。直到我发现了 [claude-mem](https://github.com/thedotmack/claude-mem) 这个项目，才意识到这个问题有了相当优雅的解法。

![claude-mem AI 持久记忆示意图](https://pic.einverne.info/images/2026-06-16-13-00-00-claude-mem-ai-memory.png)

## AI 助手的"记忆缺失"问题

现代 AI 编程助手的上下文窗口虽然越来越大，但本质上仍是无状态的——每个会话独立，上一次的交流不会自动延续到下一次。对于临时性的任务，这没什么问题。但当你在一个持续数周甚至数月的项目上工作时，这种失忆就变成了真实的效率负担。

你曾经和 AI 一起讨论过"为什么选择 Redis 而非 Memcached"，讨论过数据库迁移的注意事项，讨论过某个 API 设计的取舍。这些"隐性知识"存在于过去的对话里，但下一次打开新会话，AI 对这一切一无所知。你要么花时间重新铺垫，要么 AI 给出的建议会与之前建立的项目约定相悖。claude-mem 就是为了解决这个问题而生的。

## claude-mem 是什么

claude-mem 是一个开源的 AI 会话持久记忆系统，专门为 [[Claude Code]] 设计，同时也支持 Gemini CLI、OpenCode、Copilot 等其他 AI 工具。它的核心思路很直接：在每次会话过程中自动捕获 AI 的活动与决策，用 AI 对这些内容进行压缩和摘要，然后在下一次会话开始时，将相关的历史上下文注入进来。

从用户的角度看，整个过程几乎是透明的。你不需要手动整理笔记，不需要维护一个"项目背景文档"让 AI 每次去读。claude-mem 在后台默默工作，让 AI 在新会话里能够"想起"过去的事情。

## 核心架构解析

claude-mem 的设计分为五个相互配合的组件，理解这些组件有助于判断它是否适合你的使用场景。

生命周期钩子（Lifecycle Hooks）是整个系统的触发器。它挂载在 Claude Code 的 SessionStart、UserPromptSubmit、PostToolUse、Stop 和 SessionEnd 五个生命周期事件上，在合适的时机自动记录和注入信息。安装之后这一切都是自动的，你不需要记住什么时候该手动触发。

工作服务（Worker Service）是一个运行在本地 37777 端口的 HTTP API 服务，由 Bun 管理进程生命周期。这个服务作为中间层，协调钩子、数据库和搜索之间的通信。它还提供了一个 Web Viewer UI，你可以在浏览器里访问 `localhost:37777` 实时查看记忆流的内容，这在排查问题或想了解 AI 记住了什么时特别有用。

存储层由两部分组成：SQLite 数据库负责存储会话记录、观察条目和摘要，Chroma 向量数据库则支撑了语义搜索能力。这种混合设计使得检索既能精确匹配关键词，又能理解语义相近的内容。

搜索接口通过 mem-search Skill 暴露给 AI，采用三层递进式查询设计：第一层 `search` 返回紧凑的索引结果（每条约 50-100 tokens），第二层 `timeline` 提供围绕结果的时序上下文，第三层 `get_observations` 才拉取特定 ID 的完整详情（每条约 500-1000 tokens）。这种设计据项目介绍可以实现约 10 倍的 token 节省，先用低成本的搜索确认相关性，再按需获取详情。

## 安装与配置

安装过程非常简洁，一条命令搞定：

```bash
npx claude-mem install
```

如果你使用的是 Gemini CLI 或 OpenCode，可以指定对应的 IDE 参数：

```bash
npx claude-mem install --ide gemini-cli
npx claude-mem install --ide opencode
```

需要注意的是，通过 `npm install -g claude-mem` 安装只会得到 SDK，不会注册钩子或启动工作服务，所以务必使用 `npx claude-mem install` 这种方式。

安装完成后，配置文件位于 `~/.claude-mem/settings.json`。对于中文用户，可以设置语言模式让 claude-mem 以中文处理和摘要记忆内容：

```json
{ "CLAUDE_MEM_MODE": "code--zh" }
```

模式格式遵循 `code--[ISO-639-1-code]` 的规则，中文是 `zh`，日文是 `ja`，以此类推。

## 几个值得关注的细节

隐私控制是我特别欣赏的一个设计。如果你在对话中提到了不希望被记录的敏感内容，比如 API Key、个人信息、临时性的测试数据，只需要用 `<private>` 标签包裹，claude-mem 就会自动排除这些内容，不会将其写入记忆库。这个设计简单但实用，尤其对于工作项目来说，控制什么被记住、什么被遗忘很重要。

引用机制（Citations）让 AI 可以通过 ID 引用具体的历史观察条目。这意味着当 AI 说"根据我们上次讨论的方案"时，背后有具体的记录可以追溯，而不只是模糊的印象，提高了历史上下文的可靠性。

系统要求方面，需要 Node.js 20 以上版本，Claude Code 保持最新，Bun 和 uv Python 包管理器会在安装时自动处理，SQLite 3 已捆绑在包内，不需要单独安装。

## 最后

AI 编程助手的"失忆"问题是一个被低估的效率损耗点。我们花了大量时间让 AI 理解项目，却在每次新会话时把这些努力清空重来。claude-mem 提供了一个低摩擦的解决方案，通过自动化的记忆捕获和语义搜索，让 AI 助手能够在跨会话的维度上积累对项目的理解。

对于长期维护同一个项目、或者频繁与 AI 协作进行复杂决策的开发者来说，这类工具的价值会随着使用时间的积累越来越明显——AI 记住的越多，每次对话的起点就越高，你需要重复解释的就越少。目前项目刚起步，社区还在成长，但这个方向本身是值得关注的。如果你已经是 Claude Code 的重度用户，不妨试试看。
