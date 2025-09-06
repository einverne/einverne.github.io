---
layout: post
title: "JetBrain AI Agent Junie 使用体验"
aliases:
- "JetBrain AI Agent Junie 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [jetbrains, claude-code, ai-assistant, junie-ai, junie, ai-agent, code-agent, ai-code-agent]
create_time: 2025-09-02 10:33:41
last_updated: 2025-09-02 10:33:41
dg-home: false
dg-publish: false
---

今天更新了一下 JetBrains IntelliJ IDEA 和 PyCharm，在更新日志中发现 JetBrains 新增了 [Junie](https://www.jetbrains.com/junie/) 代码助手的功能，就顺手安装了，虽然我一直在用 JetBrains AI Assistant，但 AI Assistant 更像是一个常驻 IDEA 侧边栏的代码问答，虽然可以辅助生成代码，但是更偏重代码的自动提示，回答用户的问题，对错误进行解释，以及相关的文档工作，更像是一个更偏向代码的 AI 聊天伴侣（Companion）。但是 Junie 则更像是一个全智能的 Coding Agent，适合用来处理更大规模的，支持多个步骤，可以独立完成编码任务的 AI Agent，功能上更偏向于 Claude Code，Gemini CLI 这样完全自助完成任务的智能体。

## 前置条件

如果想要体验 Junie，需要 IDEA 版本在 2024.3.2 以上。

## 界面

Junie 是作为 JetBrains 插件存在，直接在 IDE 中安装插件，界面类似于 AI Assistant，以及 GitHub Copilot，使用体验上也相差无几。

![seKLXiGyGv](https://pic.einverne.info/images/seKLXiGyGv.png)

整个界面上只有一个对话框，用户可以在输入框中输入任务，通过 + Code 可以添加上下文，以及 Brave Mode 则是类似于 Claude Code `--dangerously-skip-permissions` 模式，选择之后，Junie 可以在不征求用户确认的情况下执行命令。

实际使用来看，Junie 会对用户发出的任务进行拆分，分成多个步骤，这个和 Claude Code 类似。

![HRyp_q4Mps](https://pic.einverne.info/images/HRyp_q4Mps.png)

之后 Junie 会自动进行每个步骤的执行，并修改代码。每一个小任务完成都会更新状态，并给出修改内容的小总结。

![h8YQz2AwTN](https://pic.einverne.info/images/h8YQz2AwTN.png)

整体完成之后会给出一个通知提示，并告知用户修改的内容。

![PvNXd55Y1z](https://pic.einverne.info/images/PvNXd55Y1z.png)

因为所有的内容都是在 IDEA 或者 PyCharm 中执行，所以我们可以很好的利用 IDEA 的差异对比，Git 变更管理功能，或者 Rollback 等功能来检查 AI 的修改是否满足我们的需求。

## 收费

对个人来说，Junie 提供了两种不同的套餐 AI Pro 和 AI Ultimate

![zS9SebveD9](https://pic.einverne.info/images/zS9SebveD9.png)

其中的 1 AI Credit 约等于 1 美元的等价的 AI 使用额度。

## 配置

和 Claude Code，Gemini CLI 一样，Junie 也支持通过 markdown 文件来定义 Junie 的行为，可以将 AI 的行为准在放在 `.junie/guidelines.md` 文件中，那么 Junie 就会将这个准在加载到模型上下文中。

### 模型选择

在设置中可以选择 GPT-5 （默认），或者 Claude Sonnet 3.7 或者 Claude Sonnet 4.0 （Anthropic）。

### MCP 配置

在 Junie 设置中，可以配置 MCP 服务

![VRHDNgiYRh](https://pic.einverne.info/images/VRHDNgiYRh.png)
