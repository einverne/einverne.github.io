---
layout: post
title: "Google Gemini CLI 使用初体验：命令行上的 AI 工作流引擎"
aliases:
  - "Google Gemini CLI 使用初体验"
tagline: "一款连接本地文件与 Gemini 模型的命令行工具，重新定义开发者工作流。"
description: "本文深入探讨了 Google 最新发布的 Gemini CLI，一个开源的、运行于命令行的 AI 工具。文章不仅介绍了其安装和基本使用，还通过具体用例展示了它在代码解释、文件管理、自动化任务等方面的强大能力，并讨论了其独特的 GEMINI.md 配置文件和重要的隐私问题。"
category: 经验总结
tags: [ google, google-gemini, code-assistant, copilot, cli, workflow, ai ]
create_time: 2025-07-01 15:12:09
last_updated: 2025-07-01 15:12:09
---

在 AI 浪潮席卷行业的背景下，Google 终于推出了一款备受期待的命令行工具——Gemini CLI。尽管在代码生成和补全领域，Google 此前推出的 Gemini Code Assist 等产品在与 GitHub Copilot、Cursor、Claude 等竞品的较量中未能激起太大水花，但 Gemini CLI 的发布，标志着 Google 将竞争的焦点扩展到了一个新的维度。

![41qMv-cDhr](https://pic.einverne.info/images/41qMv-cDhr.png)

Gemini CLI 并未将自己仅仅定位为一个代码助手。根据官方介绍，它是一个 AI 工作流（AI workflow）命令行工具，旨在连接不同的本地工具、理解代码库，并最终加速开发者的工作流程。这种定位使其超越了单纯的代码生成，展现出更广阔的应用前景。从整理 Obsidian 笔记、智能管理文件，到作为免费的 Claude Code 替代品，社区已经涌现出许多富有创意的使用方式。

![8cDM](https://photo.einverne.info/images/2025/07/01/8cDM.png)

## 安装与使用

Gemini CLI 是一个基于 TypeScript 的开源项目，因此首先需要确保你的环境中已安装 Node.js。

推荐使用 `npx` 直接运行，这样可以始终体验到最新的功能，避免了本地安装可能带来的版本延迟问题：

```bash
npx https://github.com/google-gemini/gemini-cli
```

当然，你也可以选择全局安装：

```bash
npm install -g @google/gemini-cli
gemini
```

首次运行时，工具会引导你完成 Google 账户的登录授权。Google 为免费用户提供了相当慷慨的额度：每分钟最多 60 次调用，每日上限 1000 次。对于需要更高额度的用户，可以前往 Google AI Studio 生成个人 API Key 进行配置。

进入 Gemini CLI 后，你可以通过自然语言提问，并通过 `@` 符号引用本地文件，让 AI 理解你的项目上下文。

## 核心用例

Gemini CLI 的强大之处在于其工作流整合能力，以下是一些典型的应用场景：

### 1. 代码理解与生成

与所有 AI 编码助手类似，Gemini CLI 可以读取本地代码文件并提供帮助。你可以让它：

- **解释复杂代码**：`gemini explain @/path/to/complex-module.js`
- **生成单元测试**：`gemini "write a unit test for the function 'calculateTotal' in @/path/to/logic.ts"`
- **代码重构**：`gemini "refactor the following code in @/path/to/old-code.py to use a more efficient algorithm"`

### 2. 自动化工作流

这是 Gemini CLI 最具特色的功能。它可以调用系统中的其他命令行工具（如 `ffmpeg`, `git`, `awk`）来完成任务。

- **视频处理**：`gemini "using ffmpeg, crop the video @movie.mp4 to 1080x1080"`
- **Git 操作**：`gemini "summarize the changes in the current git diff and write a concise commit message"`
- **文件整理**：`gemini "find all markdown files in this directory that contain the tag 'obsolete' and move them to the /archives folder"`

### 3. 内容创作与管理

对于使用 Markdown 管理笔记和文档的用户，Gemini CLI 同样能派上用场。

- **关联笔记**：`gemini "read @note1.md and @note2.md, then create a new file @summary.md that links them and summarizes their connection"`
- **格式修正**：`gemini "fix the formatting and grammar in @draft.md"`

## 通过 `GEMINI.md` 定制你的 AI

为了让 Gemini CLI 的行为更符合你的偏好，你可以在项目根目录下创建一个 `GEMINI.md` 文件。这个文件扮演着系统提示词（System Prompt）的角色，用于指导 AI 的输出风格和行为准则。

例如，你可以在 `GEMINI.md` 中定义：

```markdown
# Gemini CLI Behavior Guidelines

- Your primary role is a senior software engineer.
- All code suggestions must follow the Google TypeScript Style Guide.
- When asked to write a commit message, follow the Conventional Commits specification.
- Respond in Chinese.
```

这样，每次在该目录中调用 `gemini` 时，它都会遵循这些预设的规则。

## 隐私问题：免费与付费的区别

一个必须注意的问题是数据隐私。当使用个人 Google 账户或免费 API Key 时，你的提示、代码片段和生成结果都可能被 Google 用于模型训练和产品改进。

![8vJR](https://photo.einverne.info/images/2025/07/01/8vJR.png)

Google 的隐私策略明确指出了免费版和付费版（如 Google Cloud Vertex AI）在数据处理上的区别。对于处理敏感代码或注重隐私的商业项目，强烈建议使用付费 API Key，因为付费服务通常提供更严格的数据保护承诺，不会将你的数据用于训练通用模型。

