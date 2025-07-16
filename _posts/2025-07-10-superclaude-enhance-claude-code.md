---
layout: post
title: "SuperClaude 让 Claude Code 更专业更顺手"
aliases:
- "SuperClaude 让 Claude Code 更专业更顺手"
tagline: ""
description: ""
category: 经验总结
tags: [ claude-code, claude, anthropic, superclaude, gemini-cli, ai-editor, ai-agent, code-agent, personas ]
create_time: 2025-07-15 09:26:44
last_updated: 2025-07-15 09:26:44
dg-home: false
dg-publish: false
---

[SuperClaude](https://github.com/NomenAK/SuperClaude) 是一个 开源的 Claude Code 增强工具，提供了额外的命令，人物角色（Personas），以及更好的 MCP 服务集成。

本文将系统性介绍 SuperClaude 是什么，如何安装和使用，以及如何使用增强的命令，如果还没有安装 Claude Code，可以先阅读之前的[文章](https://blog.einverne.info/post/2025/07/claude-code.html)。

## SuperClaude 诞生的背景

尽管 Claude Code 拥有 200K 的上下文和自主执行能力，但是在大型项目中仍然存在上下文漂移，指令重复，输出冗长以及巨大的成本（Token）消耗等问题。

SuperClaude 并不是二次开发 CLI，而是通过配置增强，将 CLAUDE.md / RULES.md / PERSONAS.md / MCP.md 等等内容配置到 `~/.claude` 中，开箱即用，并不需要额外的依赖。

## 功能

SuperClaude 尝试给 Claude Code 提供更好的命令

- 增加了 16 种新的命令，在通常的编码任务上可能比 Claude Code 更好
- 更智能的人物（Smart Personas）为不同的领域选择更好的专家
- 集成了 MCP 服务器，可以用于文档，UI 组件，浏览器自动化等等
    - 集成了 Context7，Sequential，Magic，Playwright
- 可以跟踪任务进度，并进行管理
- 优化了 Token 使用，可以进行更长时间的对话

SuperClaude 通过家配置安装到 `~/.claude` 目录下，指导 Claude Code 更好的响应用户的需求。

### 新增 16 种常见任务命令

新增加了如下的命令

- **开发** ： `/sc:implement` 、 `/sc:build` 、 `/sc:design`
- **分析** ： `/sc:analyze` 、 `/sc:troubleshoot` 、 `/sc:explain`
- **质量** ： `/sc:improve` 、 `/sc:test` 、 `/sc:cleanup`
- **其他** ： `/sc:document` 、 `/sc:git` 、 `/sc:estimate` 、 `/sc:task` 、 `/sc:index` 、 `/sc:load` 、 `/sc:spawn`

### 智能角色

SuperClaude 增加了如下的角色，当发现用户的输入符合这些领域的时候，会尝试介入

- 架构师 - 系统设计和架构
- 前端 - UI/UX 和可访问性
- 后端 - API 和基础设施
- 分析器 - 调试并解决问题
- 安全 - 安全问题和漏洞
- scribe - 文档和写作
- 还有其他 5 为专家角色

但是需要注意，SuperClaude 并不能保证每次都能完美匹配上这些角色。

### MCP
内置了 MCP 集成

- Context7，获取官方库文档和模式
- Sequential，有助于复杂的多步骤思考
- Magic，生成现代 UI 组件
- Playwright，浏览器自动化和测试

```
claude mcp add --transport http context7 https://mcp.context7.com/mcp
claude mcp add sequential-thinking npx @modelcontextprotocol/server-sequential-thinking
# https://21st.dev/magic/console
claude mcp add magic npx @21st-dev/magic@latest --env API_KEY=XX
claude mcp add playwright npx @playwright/mcp@latest
```

## 安装使用

确保本地有 Python 执行环境

```
# Clone the repo
git clone git@github.com:NomenAK/SuperClaude.git
cd SuperClaude

# Install with our unified CLI
python3 SuperClaude.py install --quick
```

安装完成之后，可以到 `~/.claude` 目录中查看到新追加的配置。

可以运行 `claude` 进入 Claude Code，然后可以在其中验证，比如说执行 `/analyze` 命令，就可能看到有显示 `/sc:analyze` 这样的内容，表示安装成功。

## 使用心得

- 很多 Viber Coding 的先辈都推荐，先让 AI 给出思路，然后执行，所以我们可以让 SuperClaude 执行 `/design` 给出步骤，人工确认之后使用 `/build` 降低误改风险。
- 利用 `/git --checkpoint` 来暂存修改无误的内容，小步快跑，防止上下文污染以及 AI 修改错误后的回滚
- 开发阶段可以指定角色
- 利用 ccusage 或 `/cost` 实时监控用量

