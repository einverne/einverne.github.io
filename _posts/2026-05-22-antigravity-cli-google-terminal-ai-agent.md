---
layout: post
title: "Antigravity CLI：Google 推出的下一代终端 AI 编程智能体"
aliases:
  - "Antigravity CLI：Google 推出的下一代终端 AI 编程智能体"
tagline: "Gemini CLI 的进化版本，用异步多智能体重新定义终端开发体验"
description: "Google 在 2026 年 Google I/O 发布了 Antigravity CLI，作为 Gemini CLI 的官方继任者。本文介绍其核心特性、安装使用方式，以及与 Claude Code 等工具的对比分析。"
category: 产品体验
tags: [ai, cli, terminal, google, gemini, antigravity, ai-agent]
create_time: 2026-05-22 12:00:00
last_updated: 2026-05-22 12:00:00
---

最近在关注 Google I/O 2026 的动态时，看到了一个让我颇感兴趣的发布——[[Antigravity CLI]]，Google 官方宣布用它来取代已经积累了超过 10 万 GitHub Stars 的 [[Gemini CLI]]。这个时机有点微妙：个人版 Gemini CLI 用户必须在 2026 年 6 月 18 日前完成迁移，否则将失去模型访问权限。作为一个长期在终端里工作、也在持续关注 AI 编程工具演进的开发者，我觉得有必要认真研究一下这个新工具到底带来了什么改变。

![Antigravity CLI cover](https://pic.einverne.info/images/antigravity-cli-cover.png)

## Gemini CLI 为什么需要被替代

要理解 Antigravity CLI 的价值，首先得弄清楚 Gemini CLI 为什么走到了被替代这一步。Gemini CLI 诞生于 AI 助手的早期，那时候人们对 AI 编程工具的期待还停留在"能帮我写代码、能帮我解释函数"这个层面，一个对话框加上文件上下文，基本就够用了。

但随着时间推移，开发者们开始尝试更复杂的工作流：跨多个文件的大规模重构、同时推进多个独立任务、在 CI 流水线里嵌入自动化代理……Gemini CLI 底层是 Node.js，在这些场景下暴露出了性能瓶颈；而更根本的问题是，它的架构根本没为多智能体协作设计。代码库越来越臃肿，扩展也越来越难。所以与其打补丁，Google 选择了从头重建。

Antigravity CLI 的背后是一个更大的平台——Antigravity 2.0，这是 Google 重新定义的"智能体优先"开发环境，核心理念是把 AI 智能体从"回答问题的助手"升级为"主动参与开发的协作者"。CLI 只是这个平台的终端入口。

## 核心特性深度解析

### 从 Node.js 到 Go：不只是语言的替换

Antigravity CLI 用 Go 重写了整个二进制文件，命令从 `gemini` 变成了 `agy`。这个变化带来的不只是启动速度的提升，更重要的是并发模型的根本性改变。Go 的 goroutine 天然适合异步任务调度，这为下面要说的异步子智能体模式奠定了基础。

在实际使用中，`agy` 的冷启动明显比 Node.js 版本快，在 SSH 远程会话或资源受限的环境里感知尤为明显。对于需要频繁启动 CLI 的自动化脚本来说，这个差异会随着调用次数累积成相当可观的效率提升。

### 异步子智能体：最值得关注的新能力

如果说 Antigravity CLI 有一个让我眼前一亮的特性，那一定是异步子智能体模式（Async Subagent Mode）。在 TUI 界面里，你可以用 `/agent` 命令启动一个后台智能体，它会在不阻塞主会话的情况下并行执行任务：

```bash
/agent refactor "Convert all callback-based handlers in @internal/api to use context.Context"
```

这意味着你可以同时跑多个独立的大型任务——一个在重构 API 层，另一个在整理测试文件，第三个在查找潜在的安全漏洞，你则继续在主会话里做其他工作。对于中大型代码库来说，这种并行化能力能显著压缩整体完成时间。当然，副作用是多个并行智能体会同时消耗 API 配额，在免费层用户那里需要注意别烧得太快。

### 三种操作模式覆盖不同场景

工具设计得很务实，提供了三种明确定位的操作模式。交互式智能体模式（直接运行 `agy`）是完整的 TUI 界面，支持 `@filename` 和 `@**/*.ts` 这样的 glob 模式向上下文注入文件，适合日常的对话式开发。

无头脚本模式适合自动化集成：

```bash
agy -p "List all TODOs in this codebase" --output-format json
```

加上 `--output-format json` 后，输出可以直接被下游脚本解析，嵌进 CI/CD 流水线里毫无压力。

异步子智能体模式前面已经说过，是最有差异化的能力，适合那些"扔进去、等结果"的大型任务。

### AGENTS.md：项目级的智能体行为定制

这个设计思路和我在用 [[Claude Code]] 时见到的 `CLAUDE.md` 非常相似。在项目根目录放一个 `AGENTS.md` 文件，里面用自然语言描述项目规范，智能体在每次启动时会自动读取并遵循：

```markdown
Always use TypeScript. Prefer functional patterns over class-based ones.
Run `npm test` after every file modification.
```

更进一步，你还可以在 `.agents/skills/` 目录下创建 Markdown 文件，它们会自动变成 TUI 里的 `/slash` 命令，相当于把常用的操作流程封装成了可复用的技能。全局技能则放在 `~/.gemini/antigravity-cli/skills/` 下跨项目复用。

### Hooks 和 MCP：深度集成开发工作流

Hooks 是 JSON 格式的生命周期拦截器，可以在工具调用前、文件编辑后或会话开始时触发自定义脚本。比如每次写完 Go 文件后自动运行 `gofmt`，或者在每次会话开始时加载最新的项目文档——这类需求过去要靠额外的包装脚本实现，现在内置支持了。

MCP（Model Context Protocol）服务器通过 `mcp_config.json` 配置，支持本地 stdio 和远程 HTTP 两种接入方式，和目前主流的 AI 工具生态对接没有障碍。

### 多模型支持

Antigravity CLI 不再局限于 Gemini 模型家族，内置支持了：

- Gemini 3.5 Flash
- Gemini 3.1 Pro  
- Claude Sonnet / Opus
- GPT-OSS 120B

在 TUI 里用 `/model` 命令可以随时切换，这对需要根据任务类型选择最优模型的开发者来说很友好。

## 安装和初上手

安装很简单，官方提供了一键脚本：

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex

# 验证安装
agy --version
```

认证方面，桌面环境会自动打开浏览器完成 Google OAuth；SSH/无头环境会打印授权 URL 和一次性验证码，在本地完成授权后远程会话自动激活。也支持直接设置 API Key：

```bash
export ANTIGRAVITY_API_KEY=your_api_key_here
```

安装完成后，运行 `agy inspect` 可以查看当前加载的配置、技能、插件、Hooks 和已连接的 MCP 服务器，相当于一个配置状态的快速诊断命令。如果你原来是 Gemini CLI 用户，官方提供了迁移命令：

```bash
agy plugin import gemini
```

它会把旧版扩展转换为新的 Plugin 格式，同时保留原始文件备份，迁移过程相对安全。

## 和 Claude Code 以及其他工具的对比

从我目前的使用体验来看，这几个工具的定位其实各有侧重，很难说谁全面碾压谁。

Antigravity CLI 的核心优势在于异步并行子智能体和与 Antigravity 2.0 桌面端的无缝同步——你可以把一个终端会话直接推送到桌面 GUI 里继续处理，这种跨界面的上下文保留是独家的。对于需要批量处理大型任务、或者在 SSH 环境里重度工作的开发者，它有不可替代的价值。

[[Claude Code]] 在我这边用得最多的场景是需要深度推理的复杂任务。Opus 4.7 的推理能力、百万 token 上下文窗口、加上精细的用户审批工作流，在处理需要仔细思考的架构决策或微妙的 Bug 时更让人放心。

[[Cursor]] 则继续是日常快节奏开发的首选——IDE 集成太紧密了，补全速度快，对普通的功能开发来说效率最高。

我现在的模式基本是：日常功能开发用 Cursor，复杂推理任务用 Claude Code，需要并行跑多个大型重构任务时用 Antigravity CLI。三个工具并不互斥，反而能形成互补。

## 最后

Antigravity CLI 的出现标志着 AI 终端工具从"单线程对话"向"多智能体并发编排"的明确转变。Google 用 Go 重写、引入异步子智能体、打通桌面端，这些选择都指向同一个判断：未来的开发工作流是多个智能体协作完成的，不是一个智能体串行执行的。

对于个人开发者来说，如果你现在还在用 Gemini CLI，迁移截止日期是 6 月 18 日，建议尽早完成迁移以免影响日常工作。如果你对多智能体并发这个方向感兴趣，Antigravity CLI 值得认真试用一段时间，特别是那个异步子智能体模式，一旦用顺了，回不去了。
