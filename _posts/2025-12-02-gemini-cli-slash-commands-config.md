---
layout: post
title: "让 AI 更懂你的工作流：Gemini CLI 自定义 Slash Commands 配置指南"
aliases: 
- "让 AI 更懂你的工作流：Gemini CLI 自定义 Slash Commands 配置指南"
tagline: "告别重复 Prompt，打造专属 AI 助手"
description: "深入探索如何在 Gemini CLI 中通过 slash commands 封装常用提示词，将复杂的 AI 交互简化为一行命令，大幅提升工作效率。"
category: 经验总结
tags: [gemini-cli, slash-commands, efficiency, prompt-engineering, automation, workflow, ai-tools, cli, configuration, productivity]
last_updated:
---

看过我博客的人会发现，我过去分享了非常多 Claude Code 下的使用小技巧，Claude Code 提供了非常好用的 Clash Commands，可以让我们直接通过快捷方式调用我们预先定义好的 prompt。最近我在使用 Gemini CLI 时，也发现我需要类似的功能。但幸好，Gemini CLI 已经帮我们实现了 slash commands，我们只需要定义好一个函数，就可以非常轻松地通过斜杠命令来调用。

今天就来聊聊怎么配置这套"快捷指令"。

## 什么是 Slash Commands？

简单来说，Slash Commands 就是你在聊天窗口输入 `/` 时弹出的那些快捷指令。在 Slack、Discord 甚至现在的 ChatGPT 中都很常见。但在 Gemini CLI 这样的本地终端环境中，它的意义更进了一步：**它允许你将复杂的系统提示词（System Prompt）和参数模板化，并以配置文件的形式持久化保存。**

这就好比你给 AI 预设了无数个"分身"。输入 `/translator`，它就是精通多语言的翻译官；输入 `/code-review`，它就变成了严厉的代码审查员。你不需要每次都啰嗦一大堆背景设定，一个命令，它就懂了。

## 为什么要自定义？

既然市面上有很多现成的 AI 工具，为什么还要自己在 CLI 里折腾这个？

1.  **Context 掌控权**：你的配置文件就在本地 `.gemini/` 目录下，版本控制、备份迁移都随你，不用担心云端服务改版把你的习惯改没了。
2.  **极速启动**：在终端里，手指不需要离开键盘。`/research` 加上关键字，直接回车，调研任务就开始了。
3.  **参数化模版**：这是最强大的地方。你可以用 `{{args}}` 占位符把你的输入动态嵌入到 Prompt 中，这比单纯的文本替换要灵活得多。

## 动手实践：打造你的第一个指令

接下来，我以我常用的"代码审查助手"为例，带大家手把手配置一个 Slash Command。

### 找到配置基地

Gemini CLI 的所有自定义命令都存放在项目根目录下的 `.gemini/commands/` 文件夹中。如果没有，你可以手动创建它：

```bash
mkdir -p .gemini/commands
```

### 创建命令文件

命令的名称就是文件名的前缀。比如我想用 `/code-review` 来触发，我就需要创建一个 `code-review.toml` 文件。注意，这里使用的是 **TOML** 格式，非常清晰易读。

```bash
touch .gemini/commands/code-review.toml
```

### 编写配置

打开这个文件，我们需要填入两部分核心内容：`description`（描述）和 `prompt`（提示词模板）。

看看我是怎么配置我的代码审查助手的：

```toml
# .gemini/commands/code-review.toml

description = "对输入的代码进行 Code Review"

prompt = """
你是一位资深的软件工程师和代码审计专家。
请对以下代码进行审查：

{{args}}

关注点：
1. 潜在的 Bug 和安全漏洞
2. 代码可读性和命名规范
3. 性能优化建议

请用中文列出具体的修改建议。
"""
```

这里有个关键点：**`{{args}}`**。

当我在终端输入 `/code-review` 并粘贴一段代码时，Gemini CLI 会自动把这段代码填入 `{{args}}` 的位置。这样，一段通用的 Prompt 就瞬间变成了针对特定代码的指令。

### 实际体验

配置保存后，重启，然后在 Gemini CLI 中输入 `/`，你应该就能看到 `code-review` 出现在自动补全列表里了。

我试着输入了：

`> /code-review function add(a, b) { return a + b; }`

AI 立马进入了角色："这段代码虽然简单，但缺乏类型检查..." 看着它按照我预设的标准给出反馈，那种掌控感真的很棒。

除了代码 Review，我还配置了一个 `/research` 命令，专门用来做技术调研。我希望它不仅是回答问题，而是帮我搜索、整理、生成一份带有引用的 Draft。

在 `.gemini/commands/research.toml` 中，我结合了工具调用的逻辑：

```toml
description = "深度调研指定关键字并生成报告"

prompt = """
你是一位技术研究员。请对关键字 "{{args}}" 进行调研。

步骤：
1. 使用 google_web_search 搜索相关定义、最新趋势。
2. 整合信息，对比同类技术。
3. 将结果保存为 Markdown 文件到 Draft/ 目录下。
"""
```

这样，当我遇到不懂的名词，直接 `/research 向量数据库`，就可以去喝杯咖啡，回来就能在 `Draft/` 目录下看到一份整理好的文档。

## 更强大的上下文注入

除了基础的 `{{args}}` 参数传递，Gemini CLI 还支持两种更强大的上下文注入方式，这在官方文档中被称为 **Magic Placeholders**。

### 执行 Shell 命令 !{...}

你可以在 Prompt 中直接嵌入 Shell 命令，Gemini CLI 会先执行这些命令，然后把输出结果填入 Prompt。这对于需要动态获取系统状态的场景非常有用。

比如，我们可以升级上面的 `/code-review`，让它直接读取 Git 暂存区的变动，而不需要手动粘贴代码：

```toml
description = "审查 Git 暂存区的代码变动"
prompt = """
请审查以下 Git 变更：
!{git diff --staged}
"""
```

当你输入 `/code-review` 时，CLI 会先运行 `git diff --staged`，把 diff 结果抓取过来，再发送给 AI。不用担心安全问题，执行前 CLI 会要求你确认。

### 读取文件内容 @{...}

如果你需要把某个文件（比如 README 或 配置文件）作为上下文发给 AI，可以使用 `@{path/to/file}`。

```toml
prompt = """
根据 @{README.md} 的内容，为我生成一份发布日志。
"""
```

甚至支持文件夹 `@{src/}`（会读取目录下所有文件）以及图片等多模态文件！

## 总结与思考

Slash Commands 看似只是一个小功能，但它体现了一种"将 AI 能力代码化"的趋势。通过 `.gemini/commands` 目录，我们实际上是在构建自己的 **Prompt Library（提示词库）**。

这种方式让我从繁琐的 Prompt 搬运工中解脱出来，专注于思考"我要解决什么问题"，而不是"我要怎么跟 AI 说话"。

如果你也在使用 Gemini CLI，我强烈建议你花点时间审视一下自己的日常工作流，把那些高频出现的对话场景，都封装成一个个 `.toml` 文件。
