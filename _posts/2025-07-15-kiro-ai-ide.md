---
layout: post
title: "Amazon 推出 Kiro AI IDE 新一代 AI 辅助集成开发环境"
aliases:
- "Amazon 推出 Kiro AI IDE 新一代 AI 辅助集成开发环境"
tagline: ""
description: ""
category: 产品体验
tags: [ kiro, amazon, aws, amazon-q, ai-agent, ide, jetbrain, gemini-cli]
create_time: 2025-07-15 16:09:17
last_updated: 2025-07-15 16:09:17
dg-home: false
dg-publish: false
---

在 AI 辅助代码生成领域，从来不缺竞争者，现在 Amazon 正式加入了战争推出 [Kiro AI IDE](https://kiro.dev/)，Amazon 在之前就推出过智能助手 Amazon Q，以及代码补全插件 CodeWhisperer，但是在激烈的代码生成领域依然没有竞争过 Cursor，Windsurf，Claude Code 等一众的领跑者，甚至声量都没超过 Gemini CLI。现在推出的 Kiro 是一个集成的开发环境，至此互联网巨头中除了苹果没有推出 AI 辅助编码的工具之外所有的公司都已经有了对应的产品。

## Kiro

Kiro 的核心在于 Spec Driven Development，设计驱动开发，其他的 AI 编程工具虽然能快速生成代码，但是往往缺乏系统性的设计和思考，Kiro 通过将开发过程结构化，确保每个功能都是经过完整的需求分析，设计规划的。

![8P7Q](https://photo.einverne.info/images/2025/07/15/8P7Q.png)

“Vibe Coding” 指通过自然语言提示迅速生成可运行 Demo 的开发风潮，但随之产生的技术债务与文档缺失让企业难以直接上线。AWS 发现，开发者需要一种工具，既保留快速迭代的愉悦，又强制输出可审计的需求、设计与测试工件。Kiro 正是在此诉求下诞生，目标是把“vibe”转化为“viable code”，并同 Cursor、Windsurf 等新兴 IDE 形成差异化竞争。

Vibe Coding 过程的痛点

- 设计决策不透明，AI 生成代码时的假设和决策过程无法追踪
- 设计文档，开发过程中的关键决策没有记录，虽然使用我之前介绍过的 [SpecStory](https://blog.einverne.info/post/2025/06/specstory-save-ai-chat-history.html) 可以部分解决
- 需求模糊，无法最终确定产品是否满足初始要求
- 维护困难，缺乏系统设计，难以进行后续维护和扩展

## Spec-Driven Development

在 Kiro 中，“Spec” 是由三份 Markdown 文件组成的规范集合：requirements.md 承载 EARS 需求条目，design.md 记录技术架构与序列图，tasks.md 拆解可跟踪任务。通过把自然语言提示转译为结构化规格，Kiro 使 AI 代理具备可验证的实施边界，降低多轮对话歧义。

Specs 是 Kiro 的核心功能，它将开发者的简单提示转化为结构化的规格文档，包括：

- **需求文档**（requirements.md）：使用 EARS 格式的用户故事和验收标准
- **设计文档**（design.md）：包含数据流图、TypeScript 接口、数据库架构和 API 端点
- **任务清单**（tasks.md）：按依赖关系排序的具体实现任务

标准流程分四步：

- 开发者输入高层 Prompt；
- Kiro 生成带 EARS 验收标准的用户故事；
- 依据代码基与规格产出数据流图、接口定义和数据库模式；
- 完成任务排序并生成含单元/集成测试的代码补丁。该链路保证了从需求到实现的全程可追溯性。

任何修改都会触发差异视图与回滚选项，确保文档与实现一致。

### Hooks（钩子自动化）

Hooks 功能提供事件驱动的自动化任务，类似于经验丰富的开发者在后台协助：

- **自动更新测试**：保存 React 组件时自动更新相应的测试文件
- **文档同步**：修改 API 端点时自动更新 README 文件
- **安全检查**：提交代码前自动扫描敏感信息泄露
- **代码规范检查**：确保新组件符合单一职责原则等编码标准

Hooks 是一组事件驱动自动化，可在保存、创建、删除文件或手动触发时启动代理执行任务。典型场景包括保存 React 组件时同步生成测试、提交前扫描敏感信息。

### Agent Steering（智能体导向）

Steering 文件存放于 `.kiro/steering/`，为代理注入持久上下文，如技术栈、命名规范。

通过创建 steering 文件，开发者可以为项目提供上下文信息，包括架构、技术栈和编码规范，确保 AI 智能体始终按照项目特定的要求工作。

### MCP

Kiro 支持 MCP 本地或远程服务调用，可以在 `mcp.json` 文件中声明。

### Autopilot vs Supervised

- Autopilot：代理可在无需逐步确认的情况下批量创建、修改、删除文件，适合熟悉流程的资深用户。
- Supervised：每个动作需手动批准，适用于关键代码库或新用户上手。两种模式可随时切换，并提供查看/回滚全量改动的权限钩子，保证可控性。

## 订阅和价格

预览版本 Kiro 完全免费，正式版本规划

- Free，每个月 50 次交互
- Pro，每个月 1000 次，19 美元/月
- Pro+，每个月 3000 次，39 美元，超额 0.04 美元一次

### AI 模型支持

- **主模型**：Anthropic Claude Sonnet 4.0，具备先进的编码能力和推理性能
- **备用模型**：Claude Sonnet 3.7
- **未来扩展**：计划支持更多 AI 模型

Kiro 集成多模型对话，支持 Claude Sonnet 4/3.7 及其他 Bedrock 模型，具备上下文感知的代码补全、重构与测试生成能力。

### 兼容性与集成

- **VS Code 兼容**：基于 Code OSS 构建，完全兼容 VS Code 设置、主题和 Open VSX 扩展
- **跨平台支持**：支持 macOS、Windows 和 Linux
- **MCP 协议**：支持 Model Context Protocol，可连接外部工具和服务

### 多模态支持

Kiro 支持多种输入格式，包括文件、代码库、文档、图像、Git 差异、终端输出等，构建全面的项目理解能力。

## 与竞品对比

### VS Cursor

- **Kiro**：专注于结构化开发流程，强调规格驱动
- **Cursor**：更注重快速代码生成和 VS Code 兼容性

### VS Windsurf

- **Kiro**：通过 Specs 和 Hooks 实现系统化开发
- **Windsurf**：强调智能体自主操作和最小化用户干预

### VS GitHub Copilot

- **Kiro**：提供完整的开发生命周期支持
- **GitHub Copilot**：主要专注于代码补全和生成

