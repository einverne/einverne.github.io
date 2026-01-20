---
layout: post
title: "推荐我使用的 Agent Skills"
aliases:
  - "推荐我使用的 Agent Skills"
  - "Agent Skills 推荐"
tagline: "提升 AI 编程助手能力的技能扩展合集"
description: "分享我在使用 Claude Code、Codex 等 AI 编程助手时常用的 Agent Skills，包括安装方法和使用技巧，帮助开发者充分发挥 AI 助手的潜力"
category: 经验总结
tags: [agent-skills, claude-code, codex, gemini-cli, antigravity, coding-agent, ai-tools]
create_time: 2026-01-19 16:12:06
last_updated: 2026-01-19 16:12:06
dg-home: false
dg-publish: false
---

随着 AI 编程助手的快速发展，[[Claude Code]]、[[Codex]]、[[Gemini CLI]] 等工具已经成为开发者日常工作中不可或缺的伙伴。然而，这些工具的默认功能往往只是冰山一角。通过安装和配置 Agent Skills，我们可以大幅扩展这些 AI 助手的能力，让它们更加智能、更加专业。

在使用 AI 编程助手的过程中，我发现 Anthropic 官方的 [Skills](https://github.com/anthropics/skills) 仓库提供了一个很好的学习起点。通过安装 skill-creator，我们可以学习如何创建自定义的 Skill，进而根据自己的需求定制专属的 AI 助手能力。

本文将分享我在日常开发中常用的 Agent Skills，并详细介绍它们的安装和使用方法。

## superpowers

[superpowers](https://github.com/obra/superpowers) 是我最常使用的 Agent Skills 集合，也是功能最全面的专业开发工作流增强套件。这个仓库的设计理念是将软件开发中的最佳实践融入到 AI 助手的行为模式中，让 AI 不仅能写代码，更能以专业开发者的思维方式工作。

该仓库包含了多个核心开发技能，涵盖了从代码编写、调试、测试到审查的完整开发生命周期。每个技能都经过精心设计，遵循行业标准和最佳实践。比如 systematic-debugging 技能实现了结构化的调试流程，test-driven-development 技能则引导 AI 助手先写测试再写实现代码。这些技能不是简单的提示词模板，而是完整的工作流程，能够确保代码质量和开发效率。

### 安装方法

在 [[Claude Code]] 中，使用插件市场安装：

```bash
/plugin marketplace add obra/superpowers
```

安装完成后，所有的 superpowers 技能都会自动加载。

### 使用说明

superpowers 提供了多个专业技能，每个技能都针对特定的开发场景：

- systematic-debugging：系统化调试流程，帮助你快速定位和解决问题
- test-driven-development：测试驱动开发工作流，确保代码质量
- code-review-ai：AI 驱动的代码审查，发现潜在问题
- using-superpowers：入门指南，介绍如何使用这些技能

使用时，只需在对话中提到相关场景，Claude Code 会自动激活对应的技能。例如，当你说"帮我调试这个问题"时，systematic-debugging 技能会自动启用。

## agents

[agents](https://github.com/wshobson/agents) 是一个功能全面的 Agent Skills 插件集合，采用了模块化的架构设计，涵盖了从前端到后端、从基础设施到安全的各个开发领域。这个仓库的特点是将不同技术栈和开发场景的专业知识封装成独立的插件，让开发者可以按需加载。

与 superpowers 注重开发流程不同，agents 更侧重于技术栈的深度。每个插件都包含了该领域的专业知识、最佳实践和常见问题的解决方案。比如 python-development 插件包含了 Python 的类型提示、异步编程、包管理等专业技能；kubernetes-operations 插件则涵盖了 K8s 的部署、配置、监控和故障排查。这种设计让 AI 助手能够在特定技术领域表现得像一个资深专家。

### 安装方法

首先添加插件市场：

```bash
/plugin marketplace add wshobson/agents
```

然后根据需要安装特定领域的插件：

```bash
# 基础开发插件
/plugin install python-development          # Python 开发，包含 5 个专业技能
/plugin install javascript-typescript       # JS/TS 开发，包含 4 个专业技能
/plugin install backend-development         # 后端 API 开发，包含 3 个架构技能

# 基础设施和运维
/plugin install kubernetes-operations       # K8s 部署，包含 4 个部署技能
/plugin install cloud-infrastructure        # AWS/Azure/GCP 云服务，包含 4 个云技能

# 安全和质量
/plugin install security-scanning           # SAST 安全扫描技能
/plugin install code-review-ai             # AI 代码审查

# 全栈编排
/plugin install full-stack-orchestration   # 多 Agent 工作流
```

### 使用说明

agents 采用模块化设计，你可以只安装需要的插件，避免加载不必要的功能。每个插件都是独立的，互不干扰。

建议根据你的技术栈选择相应的插件。例如，如果你主要做 Python 后端开发，可以安装 python-development 和 backend-development；如果涉及 DevOps 工作，则加装 kubernetes-operations 和 cloud-infrastructure。

## Obsidian Agent Skills

如果你和我一样使用 [[Obsidian]] 来管理知识库，那么 [Obsidian Agent Skills](https://github.com/kepano/obsidian-skills) 将是一个非常实用的扩展。这个技能集专门为 Obsidian 生态设计，让 AI 助手能够深度理解和操作 Obsidian 的特有语法和功能。

Obsidian 有自己独特的 Markdown 方言，包括双向链接（wikilinks）、可折叠的 callouts、YAML frontmatter properties、JSON Canvas 画布文件、Obsidian Bases 数据库等特性。这些功能虽然强大，但语法复杂，手动编辑容易出错。Obsidian Agent Skills 通过系统化的语法规则和示例，让 AI 助手能够正确生成和修改这些内容，相当于为 AI 配备了 Obsidian 专家的知识。无论是创建符合规范的笔记、建立知识网络，还是维护数据库视图，AI 都能准确完成。

### 安装方法

```bash
npx skills i kepano/obsidian-skills
```

### 使用说明

安装后，AI 助手将能够：

- 创建和编辑 Obsidian Flavored Markdown 文件
- 正确处理 wikilinks 双链语法
- 生成符合 Obsidian 规范的 frontmatter 属性
- 使用 callouts 语法创建漂亮的提示框
- 操作 JSON Canvas 文件和 Obsidian Bases 数据库

这对于维护 Obsidian 知识库的开发者来说非常方便，AI 助手能够直接帮你创建和编辑笔记，而不需要手动调整格式。

## Vercel Agent Skills

[Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) 专为使用 [[Vercel]] 平台的开发者设计，提供了部署、配置和优化 Vercel 项目的能力。作为目前最流行的前端应用部署平台之一，Vercel 有着丰富的配置选项和最佳实践。

这个技能集整合了 Vercel 官方文档中的关键知识点，包括 vercel.json 配置文件的各种选项、环境变量的管理、自定义域名的设置、边缘函数（Edge Functions）的使用、性能优化建议等。它特别针对 Next.js 应用进行了优化，因为 Vercel 是 Next.js 的母公司，两者的集成度最高。有了这个技能，AI 助手能够帮你快速解决部署问题，优化构建配置，甚至预测可能出现的部署错误。

### 安装方法

```bash
npx add-skill vercel-labs/agent-skills
```

### 使用说明

该技能集成了 Vercel 的最佳实践，能够帮助你：

- 快速配置 vercel.json 部署文件
- 优化 [[Next.js]] 项目的部署设置
- 处理环境变量和域名配置
- 解决常见的部署问题

特别适合使用 Next.js 和 Vercel 部署的项目。

## UI UX

[UI UX skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 是前端开发的利器，专门用于创建美观、可访问、符合现代设计标准的用户界面。这个技能将 UI/UX 设计的专业知识和前端开发的最佳实践结合在一起，让 AI 助手能够生成生产级别的界面代码。

该技能涵盖了现代 Web 开发中的多个关键领域：设计系统的实现、组件库的构建、响应式设计的最佳实践、无障碍访问（WCAG）标准的遵循、性能优化策略等。它不仅关注代码的功能性，更注重用户体验的细节，比如动画的流畅性、交互的反馈、布局的和谐等。对于需要频繁开发 UI 组件的前端工程师来说，这个技能能显著提升开发效率和代码质量。

### 安装方法

```bash
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

### 使用说明

这个技能非常适合前端开发，能够：

- 生成符合设计系统的 UI 组件
- 确保无障碍访问（a11y）最佳实践
- 创建响应式布局
- 实现现代化的交互效果

当你需要实现复杂的 UI 组件时，这个技能能够提供专业的指导和代码生成。它理解现代前端框架（[[React]]、[[Vue]]、[[Angular]]）的设计模式，并能生成高质量的组件代码。

## SEO

这是我自己维护的 [SEO 相关技能集合](https://github.com/einverne/agent-skills)，专注于帮助开发者优化网站的搜索引擎表现。作为一个技术型内容创作者，我深知 SEO 对于网站流量的重要性，因此整理了这套技能来自动化 SEO 优化工作。

这个技能集整合了搜索引擎优化的核心知识，包括语义化 HTML 的使用、meta 标签的优化、Open Graph 和 Twitter Card 的配置、结构化数据（JSON-LD）的生成、sitemap 的创建、robots.txt 的配置等。它还包含了针对不同类型网站（博客、电商、企业站）的 SEO 策略建议。通过这个技能，AI 助手能够在你开发网站时自动考虑 SEO 因素，从技术层面提升网站的搜索可见性。

### 安装方法

```bash
/plugin marketplace add einverne/agent-skills
```

### 使用说明

该技能能够：

- 分析网站的 SEO 问题
- 生成结构化数据（Schema.org）
- 优化网页的 meta 标签
- 提供 SEO 最佳实践建议

特别适合开发营销型网站或需要注重 SEO 的项目。

## Claude Code Templates

[Claude Code Templates](https://github.com/davila7/claude-code-templates) 提供了一系列实用的项目模板和工作流模板，是学习如何构建自定义 Agent Skills 的优秀范例集。这个仓库收集了各种场景下的最佳实践模板，展示了如何将具体的工作流程转化为可复用的技能。

仓库中的模板涵盖了软件开发的多个环节，从项目初始化、代码规范设置，到文档生成、代码审查流程。每个模板都经过实战检验，包含了详细的步骤说明和示例。特别值得一提的是 content-creator 模板，它展示了如何为内容创作这种非传统开发场景定制 AI 助手，包括文章结构规划、SEO 优化建议、多语言支持等功能。通过研究这些模板，你可以学会如何针对自己的工作流程创建专属技能。

### 使用说明

这个仓库中的 content-creator 模板特别值得参考，它展示了如何为内容创作工作流定制 AI 助手的能力。你可以基于这些模板创建自己的工作流。

模板涵盖了多种场景：

- 项目初始化模板
- 文档生成工作流
- 代码审查清单
- 测试用例生成

通过学习这些模板，你可以更好地理解如何定制 Agent Skills。

## Planning with Files

[Planning with Files](https://github.com/OthmanAdi/planning-with-files) 是一个独特的技能，它的核心理念是"文档驱动开发"，即为每个任务生成相应的规划文档，让开发过程更加透明和可追溯。与传统的敏捷开发方法不同，这个技能强调将计划以文件形式持久化保存。

这种方法特别适合复杂项目和团队协作场景。AI 助手在接到任务后，会首先创建一个详细的规划文档，包括任务背景、技术方案、实施步骤、风险评估等内容。随着项目推进，这些文档会不断更新，记录决策过程、遇到的问题和解决方案。这样不仅确保了开发的系统性，还为项目留下了完整的历史记录，方便日后回顾和知识传承。对于需要严格文档管理的项目（如企业应用、开源项目），这个技能尤为有价值。

### 安装方法

```bash
/plugin marketplace add OthmanAdi/planning-with-files
```

### 使用说明

使用这个技能后，AI 助手会：

- 在开始工作前创建详细的规划文档
- 将任务分解为可执行的步骤
- 跟踪任务进度和变更
- 生成项目文档

这种方法特别适合复杂的项目，能够确保开发过程有条不紊。规划文档也成为了项目的宝贵资料，方便日后回顾和维护。

## Prompt Generator

[Prompt Generator](https://github.com/huangserva/skill-prompt-generator) 是一个元技能（meta-skill），它的作用不是直接解决开发问题，而是帮助你更好地与 AI 助手交流，生成更高质量的提示词。可以把它理解为"教你如何提问的技能"。

提示词工程（Prompt Engineering）是使用 AI 工具的关键能力。一个好的提示词应该清晰、具体、包含必要的上下文，并能引导 AI 产生期望的输出。Prompt Generator 集成了提示词工程的最佳实践，包括如何构建清晰的指令、如何提供有效的示例、如何设置合适的约束条件等。它还能分析你的需求，识别模糊或不完整的地方，并建议如何改进。对于想要深入学习 AI 助手使用技巧的开发者来说，这个技能是一个很好的学习伙伴，能够帮助你逐步掌握与 AI 高效协作的艺术。

### 安装方法

```bash
/plugin marketplace add huangserva/skill-prompt-generator
```

### 使用说明

这个技能能够：

- 分析你的需求并生成优化的提示词
- 提供提示词工程的最佳实践
- 帮助你创建自定义的 Agent Skills
- 优化与 AI 助手的交互效果

对于想要深入学习如何更好地使用 AI 编程助手的开发者来说，这是一个很好的学习工具。

## 最后
Agent Skills 极大地扩展了 AI 编程助手的能力边界。通过合理选择和配置这些技能，我们可以将 AI 助手打造成真正的开发伙伴。

在选择 Agent Skills 时，我的建议是：

1. 从核心技能开始：`superpowers` 提供了最基础和最通用的能力增强
2. 根据技术栈选择：安装与你日常工作相关的技能（agents 系列）
3. 注重工具集成：如果使用特定工具（Obsidian、Vercel 等），相应的技能能显著提升效率
4. 学习和定制：通过 skill-creator 和 prompt-generator 学习如何创建自己的技能

最后，记住 Agent Skills 是一个不断发展的生态。关注这些仓库的更新，尝试新的技能，找到最适合自己工作流的组合。

如果你有其他好用的 Agent Skills 推荐，欢迎在评论区告诉我。
