---
layout: post
title: "Happy Engineering: 在手机上随时随地运行 Claude Code"
aliases:
- "Happy Engineering: 在手机上随时随地运行 Claude Code"
tagline: ""
description: ""
category: 经验总结
tags: [ happy, claude-code, mobile, ai-coding, ios, android, terminal ]
create_time: 2025-12-10 10:00:00
last_updated: 2025-12-10 10:00:00
dg-home: false
dg-publish: false
---

之前我介绍过使用 [VibeTunnel](https://blog.einverne.info/post/2025/08/vibetunnel.html) 将终端暴露到浏览器，从而实现移动端的 Vibe Coding。虽然 VibeTunnel 非常通用且强大，但如果你专注于使用 Claude Code，那么今天要介绍的这款工具 —— **Happy** (Happy.engineering)，可能会给你带来更极致的体验。

Happy 是一个专为 Claude Code 设计的移动端客户端，它允许你在手机或桌面上并行生成和控制多个 Claude Code 实例。最重要的是，它是完全[开源](https://github.com/slopus/happy)且免费的。

## Happy 是什么

Happy 是一个移动端应用（支持 iOS 和 Android），配合一个运行在你电脑上的 CLI 程序，让你能够远程控制和管理 Claude Code 会话。它不仅是一个简单的终端镜像，更是针对 Claude Code 的工作流进行了深度优化。

它由三部分组成：
1.  运行在你电脑上的 CLI 程序。
2.  手机上的移动应用。
3.  连接两者的中继服务器（传递端到端加密消息）。

## 核心优势

相比于通用的终端转发方案，Happy 针对 AI 编程场景做了很多优化：

-   **零干扰工作流 (Zero Workflow Disruption)**：Happy 直接集成到你现有的工具和开发环境中，不需要改变你习惯的工作方式。
-   **多任务并行 (Multiple Active Sessions)**：你可以同时运行多个 Claude Code 实例，在不同的项目之间无缝切换。这意味着你可以让一个 Agent 写代码，同时在另一个 Agent 中进行测试或规划。
-   **完全的移动端访问**：支持 Claude Code 的所有功能，包括 Plan 模式和自定义 Agent。
-   **安全隐私**：使用端到端加密（End-to-End Encryption），确保你的代码和消息只有你自己能看到。
-   **智能推送通知**：当 Claude Code 需要你输入、完成代码审查或遇到错误时，Happy 会直接向你的手机发送推送通知，让你不再需要时刻盯着屏幕。
-   **语音控制**：内置语音 Agent，支持免提控制编码、调试和项目管理，真正的 "Talk to your code"。

## 安装与使用

Happy 的使用非常简单，主要依赖于 npm 包管理器。

### 1. 安装 CLI

在你的电脑终端中执行以下命令全局安装 `happy-coder`：

```bash
npm i -g happy-coder
```

### 2. 启动服务

安装完成后，直接运行 `happy` 命令：

```bash
happy
```

启动后，它会生成一个连接码或二维码。

### 3. 连接移动端

打开 Happy 的 Web App 或移动应用，输入连接码，即可建立连接。此时，你就可以在手机上看到电脑上的 Claude Code 会话，并进行实时控制了。

如果你是 Claude Code 的重度用户，并且渴望从办公桌前解放出来，Happy 是一个非常值得尝试的方案。它相比通用的 VibeTunnel 更加轻量，且针对 Claude Code 的交互做了很多定制化（比如通知和多会话管理），能显著提升移动编程的效率。

## Related

- [Happy.engineering 官网](https://happy.engineering/)
- [Happy GitHub 仓库](https://github.com/happy-coder/happy)
- [VibeTunnel 将终端带到浏览器开启移动化 Vibe Coding](/post/2025/08/vibetunnel.html)

# Happy 应用对 Gemini CLI 的支持情况

**Happy 应用目前不支持 Gemini CLI**。根据官方信息，Happy（happy.engineers 提供的应用）专门为 **Claude Code 和 Codex** 设计，是这两个 AI 编程工具的移动端和网页客户端。

### Happy 应用的核心特性

Happy 应用的主要功能包括：

**支持的 AI 工具**：Happy 仅支持 Claude Code 和 Codex，不包括 Gemini 或 Gemini CLI。