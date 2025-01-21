---
layout: post
title: "Cline 强大的 AI 辅助编程工具"
aliases:
- "Cline 强大的 AI 辅助编程工具"
tagline: ""
description: ""
category: 
tags: [ai, cli, sonnet, claude, vscode]
create_time: 2025-01-14 17:04:14
last_updated: 2025-01-14 17:04:14
dg-home: false
dg-publish: false
---

之前的文章中介绍过 [AI 支持的编辑器 Cursor](https://blog.einverne.info/post/2023/03/ai-powered-editor-cursor-so.html)，还介绍过 Codium 推出的 [AI 智能编辑器 Windsurf](https://blog.einverne.info/post/2024/11/windsurf.html)，很早之前也介绍过如何在 JetBrains IntelliJ IDEA 中使用 [GitHub Copilot](https://blog.einverne.info/post/2021/10/jetbrain-intellij-use-github-copilot.html) 以及如何在命令行终端下使用 [GitHub Copilot CLI](https://blog.einverne.info/post/2023/03/github-copilot-cli.html) 可以在终端下完成一些 AI 智能补全，提示等等操作。

今天我要来介绍另外一款基于终端，以及 VS Code 的 AI 编程辅助工具 [[Cline]]。

Cline 是一款 AI 辅助编程的，借助 Cline 可以实现 AI 自主编码，可以创建编辑文件，执行用户输入的指令，并且自动调用浏览器完成验证。

Cline 使用 TypeScript 编写，可以在 CLI 和 VS Code 中使用。和之前介绍过的 [[Cursor.so]] 和 [[Windsurf]] 一样，Cline 的背后也由 Claude 3.5 Sonnet 模型支持，但是 Cline 也可以自行指定背后的调用的模型。

<iframe width="560" height="315" src="https://www.youtube.com/embed/L5wFFkDx9LE?si=4Ty2qiQTG603coTq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[YouTube](https://www.youtube.com/watch?v=L5wFFkDx9LE) | [Bilibili](https://www.bilibili.com/video/BV19rc6ecEDk/)

## MCP

在我[之前的文章](https://blog.einverne.info/post/2024/12/anthropic-model-context-protocol.html)中也介绍过 Claude 的 Model Context Protocol （MCP 协议），在 Cline 中，用户也可以通过 MCP 协议来创建新的工具，扩展自己的任务。

自主 AI 会在沙箱环境中运行，但扩展提供了一个人性化的 GUI 用户界面来批准每个文件更改和终端命令，提供了一种安全且易于访问的方式来探索 Agent AI 的潜力。

## 特性

### 多 API 和模型支持

Cline 支持非常多的 API，包括 OpenRouter，Anthropic，OpenAI，Google Gemini，AWS Bedrock，Azure，GCP Vertex 等等。

用户也可以直接配置 OpenAI 兼容的 API，比如本地运行的 Ollmama/LM Studio 等。

如果使用 OpenRouter，也支持直接通过获取模型列表来获取最新可用的模型。Cline 的每一次执行都会追踪 Tokens 和 API 使用情况，让用户可以了解每一步的花费。

### 终端运行命令

[VSCode v1.93](https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api) 中引入 Shell 集成，这使得 Cline 可以直接在终端执行命令并获取输出，这使得 Cline 可以执行一系列的任务，包括安装依赖，执行 build 脚本，部署应用，管理数据库，执行测试，配置 dev 环境以及相关的工具链等等。

对于需要长时间执行的进程，比如 dev 开发服务器，可以使用「Proceed While Running」按钮，来让 Cline 持续在后台运行命令。当 Cline 工作的时候，会持续输出终端结果，Cline 也可以根据终端命令的内容，自行调整并修复编译错误等等。

### 创建和编辑文件

Cline 可以直接在编辑器中创建和编辑文件，并且可以给用户展示文件修改差别（Diff）。用户可以编辑或者撤回 Cline 的修改，或者根据修改的内容提供进一步的意见，直到满足自己的需求。

Cline 也会持续监控 linter 和 编译错误，包括确实 imports，语法错误等等，然后会根据错误来修复。

所有的修改都会被 Cline 记录，并且以时间轴的方式展示，用户可以随时查看追踪并且撤回相关的修改。

### 使用浏览器

借助 Claude 3.5 Sonnet 的新 [Computer Use](https://www.anthropic.com/news/3-5-models-and-computer-use) 能力，Cline 可以开启一个浏览器，并且执行点击，输入，滚动页面，截取图片获取 Console logs 等等。

这使得交互式 debugging 以及端到端测试，甚至更通用的网页需求变得可能。这也使得 Cline 可以自动去修复视觉画面上的错误，执行时的问题，而不需要手动地去复制粘贴错误日志。

直接和 Cline 说「test the app」，然后 Cline 会运行 `npm run dev` 然后在浏览器中开启一个本地 dev 服务器，并执行一系列的测试。

### add a tool

上面也提到 [Model Context Protocol](https://github.com/modelcontextprotocol)，Cline 可以通过该协议来扩展自己的能力，可以利用[社区已经创建的服务器](https://github.com/modelcontextprotocol/servers)，Cline 可以直接使用它们。

直接和 Cline 说「add a tool」，然后接下来 Cline 会处理剩下的事情，这些自定义的工具自动变成了 Cline 的工具链。

### 上下文

- `@url` 粘贴一个 URL，让 Cline 变成 Markdown，在让 Cline 理解最新的文档时非常有用
- `@problems` 添加工作区的错误和警告
- `@file` 添加文件到上下文，可以使用 `+` 来搜索文件
- `@folder` 一次性添加文件夹到上下文

### Checkpoints 比较和恢复

Cline 通过 task 来工作，extension 会在每一步给工作区一个快照。可以使用 Compare 按钮来展示区别，使用 Restore 暗流来回滚。

比如，当和一个本地 Web 服务器一起工作时，可以使用 Restore Workspace Only 来快速测试不同版本的应用，然后使用 Restore Task and Workspace 来恢复某个版本，继续构建。这个机能使得用户可以安全地在不同版本中切换，而不会丢失进度。

## Cline 执行的流程

- 用户通过自然语言输入任务详情
- Cline 开始分析文件结构以及源代码，执行搜索，阅读项目中相关的文件。Cline 会小心地将文件加入到上下文，并且借助超长的模型上下文，大型复杂的项目也可以很好的胜任
- 一旦 Cline 获取了必要的信息，就会开始
  - 创建或这编辑文件，并且会实时监控 linter 或者编译器的错误，并自动修复错误
  - 直接在终端在用户授权下执行命令，并且监控输出
  - 对于网页开发，Cline 会开启一个 headless 浏览器，然后通过点击，滚动，输入，截图，加上终端的日志等来调试
- 当任务完成，Cline 会自动将结果通过终端的命令来输出，用户可以通过简单的点击来查看。
