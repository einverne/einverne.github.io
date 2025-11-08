---
layout: post
title: "Claude Code Skills 功能介绍以及使用经验"
aliases:
  - "Claude Code Skills 功能介绍以及使用经验"
tagline: ""
description: ""
category: 经验总结
tags: [claude, claude-code, claude-code-tips, claude-ai, anthropic, ]
create_time: 2025-11-05 09:53:45
last_updated: 2025-11-05 09:53:45
dg-home: false
dg-publish: false
---

在我们进一步介绍 Skills 之前，先来回顾一下 Claude 已经给我提供的扩展：

- MCP（Model Context Protocol），这是 Claude 连接外部的协议，让 Claude 可以访问网络，文件，数据库等外部资源，通过 MCP 还可以调用浏览器自动化 Playwright 等。
- Slash Commands 快捷命令，这是手动配置的快捷命令，通过 `/` 就能触发
- [Subagents](https://docs.claude.com/en/docs/claude-code/sub-agents) 子代理，用来优化任务级别的工作流和上下文管理，通过可以自定义的系统提示词，工具以及单独的上下文窗口，就像是派生出一个你的分身去干具体的任务
- [Plugins](https://docs.claude.com/en/docs/claude-code/plugins) 插件，自定义命令行，Agents，hooks，Skills，MCP servers 等，将这些内容都打包到插件中，可以通过 [Plugin Marketplaces](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) 快速集成

## Agent Skills

在介绍 Claude Code Skills 之前首先要介绍一下 Claude 的 Agent Skills。Skills 是一组用来扩展 Claude 能力的模块，包括提示词，脚本，相关资源文件等等。

Agent Skills 可以用在任何 Claude 相关的产品，桌面客户端，Claude Developer Platform（API），Claude Code 等等产品。

## Skills

Claude 使用 Skills 来封装一组能力，Skills 本质上是磁盘上的一个文件夹，文件夹下可以保存完成特定任务所需要的文档（知识）和工具（脚本，工作流等）。

Skill 文件夹通常包括

- `SKILL.md` 核心的定义文件，YAML 格式，包含了 Skill 的名字，描述，Markdown 编写的详细指令，指导 Claude 在特定场景下执行的动作
- `scripts` 存放可执行 Python，Shell 脚本
- `references`，参考文档，比如 API 文档，数据库定义 Schema，公司代码规范，政策等，Claude 会参考
- `assets`，资源文件，包括 PPT 模板，Logo，项目脚手架等，Claude 如果使用该 Skill 会直接使用

## Skills 工作原理

在执行具体任务的时候，Claude 会扫描相关可用的 Skills，当匹配到可用的技能，会加载最少的信息和相关需要的文件，然后获取具体的能力。

- 可组合：技能堆叠在一起。Claude 会自动识别需要的技能并协调它们的使用。
- 可移植：技能在任何地方都使用相同的格式。构建一次，跨 Claude 应用程序、Claude 代码和 API 使用。
- 高效：只在需要的时候加载需要的内容。
- 强大：Skills 可以包括任务的可执行代码，传统编程比 token generation 更可靠。

Skills 的核心是为上下文窗口减负，通过层级递增的方式来匹配技能。官方将其称为 Progressive Disclosure（渐进式披露）的机制，通过层层递进的方式来扩大 Claude 的上下文，而不是一次性将所有的信息都放到上下文中。

- 对于 Skills 的名字和描述，通常会在 Claude 启动时就存在上下文，通过提问 Claude 会快速扫描所有 Skills 描述，快速作出筛选，是否有合适的技能，通常只需要几百 Token，成本极低
- 当 Claude 认为某个 Skill 技能可以用来解决当前的任务，才会去加载 SKILL.md 详细指令，通过指令来执行更具体的步骤和规则，通常会消耗更多的 Token
- 最后一步，只有 SKILL.md 文章的指令中明确要求使用脚本或者读取参考文档时，Claude 才会去读取脚本文件和参考文档。

这样分层的设计，极大的节省了宝贵的上下文窗口，避免了一次性将所有的东西都放到上下文导致成本消耗极大的问题。

## 使用经验

Anthropic 一开始就发布了很多 Skills，可以从这个 [skills](https://github.com/anthropics/skills) 项目中汲取灵感。

- docx - 创建正确的 Word 文档
- pptx - 带有布局、图表等的实际 PowerPoint 文件
- xlsx - 带有真实公式的 Excel
- pdf - 填充和操作
- canvas-design - PNG/PDF 中的视觉布局
- brand-guidelines - 保持一切符合品牌规范
- algorithmic-art - 使用 p5.js 的生成艺术
- slack-gif-creator - 制作适合 Slack 约束的 GIF

### Skill Creator

Anthropic 创造了一个为用户构建 Skills 的 Skill，叫做 [Skill Creator](https://github.com/anthropics/skills/blob/main/skill-creator/SKILL.md)，只需要使用简单的语言描述你想做什么，就会自动为你编写 SKILL.md 文件。

### 通过插件市场安装

可以使用如下的命令来添加插件市场。在 Claude Code 下执行

```
/plugin marketplace add anthropics/skills
```

输入 `/plugin` 可以进行安装卸载等管理。

可以直接通过如下的命令来快速安装 Skills

```
/plugin install document-skills@anthropic-agent-skills
```

官方提供了两个插件

- document-skills：文档相关，可以处理 Excel、Word、PPT、PDF 等文档。
- example-skills：示例技能包 ，可以处理技能创建、MCP 构建、视觉设计、算法艺术、网页测试、Slack 动图制作、主题样式等。

安装成功之后，需要重启 Claude Code 才能加载。

## 创建自己的 Skill

我们可以使用官方的 Skill Creator 的 Skill 来创建 SKILL.md 文件，当然也可以自己手动创建文件夹和文件。这里就带大家从零开始构建一个 Skills。

如果要创建一个可以在任何项目中使用的 Skill，将文件存储在 `~/.claude/skills/` 目录下。

```
mkdir -p ~/.claude/skills/my-skill-name
```

如果只想在项目中使用，存储在 `.claude/skills/` 目录下

```
mkdir -p .claude/skills/my-skill-name
```

### 编写 SKILL.md

SKILL.md 文件定义了技能的名字和描述，文件头 YAML 格式，以及 Markdown 正文。

```
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

说明

- name 是必须的，并且只支持小写字母，数字和连字符，最多 64 字符
- description 简要描述技能的作用，以及什么时候使用该技能，最多 1024 个字符

description 字段非常重要，Claude 会根据此字段来判断何时使用 Skills。可以参考 [最佳实践](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)

### 支持文件

和上面提到的一样，技能文件夹下可以包括其他的资源文件

```
my-skill/
├── SKILL.md (required)
├── reference.md (optional documentation)
├── examples.md (optional examples)
├── scripts/
│   └── helper.py (optional utility)
└── templates/
    └── template.txt (optional template)
```

这些文件可以直接在 SKILL.md 文件中引用，比如

````
    For advanced usage, see [reference.md](reference.md).

    Run the helper script:
    ```bash
    python scripts/helper.py input.txt
    ```
````

Claude 只有在需要的时候才会读取这些文件。

### allowed-tools 限制工具访问权限

可以使用 `allowed-tools` 字段来限制 Claude 在技能激活时可以使用的工具。

```
---
name: safe-file-reader
description: Read files without making changes. Use when you need read-only file access.
allowed-tools: Read, Grep, Glob
---

# Safe File Reader

This Skill provides read-only file access.

## Instructions
1. Use Read to view file contents
2. Use Grep to search within files
3. Use Glob to find files by pattern
```

Skill 激活之后，Claude 无需请求权限即可使用指定的工具（比如读取，搜索，全局搜索）。

### 查看并验证可用 Skills

Claude 会从如下的文件获取可用的 Skills

- 全局 `~/.claude/skills`
- 项目 `.claude/skills`
- 插件 Skills，和插件绑定

可以直接问 Claude

```
What Skills are available?
List all available Skills?
```

如果 Skills 没有被 Claude 调用，首先要检查的就是 description 中的描述是否更具体，以及 SKILL.md 文件格式是否正确。

## 其他的 Skills

- [superpowers](https://github.com/obra/superpowers)

## Skills vs MCP

MCP 要解决的问题是让 Claude 突破本地的限制，访问外部的资源，它本质上是定义了一个访问通信协议。

Skills 并不是用来替代 MCP，而是可以组合使用，Skills 是对 Agent 能力的封装，解决的是如何让 Claude 思考和作出行为。Skills 定义了知识，工作流，脚本工具。在 Skills 中也可以定义 MCP 服务来解决任务。通过 Skills 可以让通用的模型变成某个特定领域的专家。

Skills 是把特定任务的工作流转成可被自动调用的模块，而 MCP 则是将外部工具，文档，数据源等转成标准化可被 AI 调用的接口。

Skills 的重点在于完成任务，更像是一本操作手册，当遇到某项具体任务时，可以按照步骤，最佳实践以及注意事项来完成任务，更关注过程和方法。MCP 的重点则是在于「连接」，以前 AI 可能无法读取外部的数据，MCP 定义了连接外部的方式，可以让 AI 也可以读取操作外部数据（网络，文件，数据库等）MCP 关注的是实现访问和具体的行为。

在 Token 使用上也存在一些差异，Skills 通过渐进式方式提升了 Token 使用效率，而 MCP 的实现可能会不小心在提示词中去读取庞大的参考文档或数据定义，这会大量地消耗 Token。

## Skills vs Clash Command

Skills 由模型自动调用，Claude 会根据 Skill 描述和具体的任务自动匹配并使用 Skills，无需人工介入，Slash Commands 则是由用户主动发起。

## Skills 的应用场景

Skills 可以自动化有固定流程和规范的重复性任务，比如同一应用中的所有主题配色，比如确保文档中使用的 Logo 都是符合品牌要求的，比如统一代码审查标准，生成符合要求的样板代码等。

## Skills 带来的启发

Skills 给 Claude 带来了更多的扩展性，组合性也更好，可以任意地将多个技能组合在一起完成一个工作流，比如根据设计文档，生成模板代码，测试代码，代码审查，提交代码等。

- 从写提示词变成设计工作流，将提示词工程变成工作流工程，关注输入结构，工具链，状态管理和容错
- 从一次性产物变成可维护系统，每个 Skill 都是可版本化的流程模块，像软件一样测试，发布和回滚
- 从智能补充，到智能基建，将 Skills 视为组织的基础设施，承载标准， 权限，日志和治理。
