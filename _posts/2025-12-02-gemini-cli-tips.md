---
layout: post
title: "Gemini CLI 使用小技巧"
aliases:
  - "Gemini CLI 使用小技巧"
tagline: ""
description: ""
category: 经验总结
tags: [gemini-cli, gemini, codex, claude-code, antigravity]
create_time: 2025-12-02 14:23:07
last_updated: 2025-12-02 14:23:07
dg-home: false
dg-publish: false
---

本文记录 Gemini CLI 使用过程中一些容易被忽略的问题，以及使用小技巧。

对于常用的 Gemini CLI 命令比如操作符 `@` `/` 等，可以参考官方文档完成入门学习。

- 每分钟请求数 RPM : 60 次
- 每天请求数 RPD: 1000 次

## GEMINI.md 项目上下文定义

`GEMINI.md` 和 `CLAUDE.md` 文件作用类似，它们被设计用来存储项目特定的上下文信息。每次你在项目目录中启动 Gemini CLI 时，它都会自动加载这个文件的内容。这相当于给 AI 预设了一个“出厂设置”，让它迅速了解项目的规范、常用命令和注意事项。

你可以在 `GEMINI.md` 中定义以下内容：

1.  **项目概述**：简要说明项目的目的、架构和核心技术栈。
2.  **常用命令**：列出常用的构建、测试、部署命令，方便 AI 直接调用或推荐。
3.  **代码规范**：指定代码风格（如 naming convention）、使用的库版本以及特殊的架构模式。
4.  **目录结构**：解释关键目录的作用，特别是对于非标准结构的项目。

**示例 `GEMINI.md` 文件内容：**

```markdown
# Project Context for Gemini

## Build & Run

- Build: `npm run build`
- Dev Server: `npm run dev`
- Test: `npm test`
- Lint: `npm run lint`

## Coding Standards

- Use TypeScript for all new files.
- Prefer functional components with Hooks for React.
- Use `styled-components` for styling.
- Error handling: Wrap async calls in try/catch blocks.

## Architecture

- `/src/components`: Reusable UI components.
- `/src/pages`: Next.js pages.
- `/src/lib`: Utility functions and API clients.
```

有了这个文件，当你问“怎么运行测试？”或者“帮我写一个新组件”时，Gemini 就能根据预设的规范给出更准确的回答，而不需要你每次都重复一遍背景信息。

## 直接在 Gemini CLI 下执行命令

在 Gemini CLI 下，可以在命令前增加一个 `!` 来执行命令

```
!ls -al
!agy .

# 单个命令执行
!find . -name "*.tsx" -mtime -7

# 查看 git 差异
!git diff --stat

# 获取文件信息
!wc -l src/components/*.tsx

# 进入 Shell 模式（所有输入作为命令）
!
# 现在输入的都是 shell 命令
find . -type f -name "*.json" | head
git log --oneline -10
```

## Gemini CLI 中查看完整 Diff

Gemini CLI 中如果 Gemini 要写入文档，WriteFile 这个工具写入文档，写入之前会显示 Diff 让用户审批是否允许更改，但是 Gemini CLI 在终端中默认会截断过长的输出，导致 Diff 显示不全，无法 Review 具体的修改内容。

这里有三种方式可以解决这个问题：

### 方法一：禁用输出截断（推荐）

这是最直接的方法，通过修改 Gemini CLI 的配置文件，允许终端输出完整的 Diff 信息。

在配置文件（通常位于 `~/.gemini/settings.json` 全局配置或 `.gemini/settings.json`或通过命令修改）中调整以下设置：

| 配置项                              | 默认值     | 建议值  | 说明                           |
| ----------------------------------- | ---------- | ------- | ------------------------------ |
| `tools.enableToolOutputTruncation`  | `true`     | `false` | 彻底禁用截断功能，显示完整输出 |
| `tools.truncateToolOutputThreshold` | 10000 字符 | -1      | 设置为 -1 禁用字符数量限制     |
| `tools.truncateToolOutputLines`     | 100 行     | 10000   | 或者大幅增加允许显示的行数     |

可以直接在 Gemini CLI 中执行 `/settings`

### 方法二：集成 VS Code 查看 Diff

Gemini CLI 提供了与 VS Code 的深度集成，可以直接在编辑器中打开 Diff 视图，体验更好。

1.  在 Gemini CLI 中运行命令：
    ```bash
    /ide install
    /ide enable
    ```
2.  这会安装必要的辅助扩展。之后当 Gemini 提议修改代码时，会自动触发 VS Code 的 Diff 视图，让你在图形化界面中 Review 和修改代码，而不是仅在终端查看。

### 方法三：使用 Git 辅助

如果上述方法都不适用，或者你更习惯使用 Git 工具：

1.  在 Gemini 修改文件之前，确保工作区是干净的（`git status` clean）。
2.  允许 Gemini 写入文件。
3.  使用 `git diff` 查看修改内容。
4.  如果满意，提交更改；如果不满意，使用 `git checkout <file>` 撤销更改。

这种方法虽然不是“预览”，但利用版本控制系统作为安全网，是最稳妥的方式。

## 内存管理 跨会话上下文保持

添加持久化知识到全局上下文

```
# 添加到内存
/memory add "我们的 API 使用 GraphQL + Apollo Server，所有查询需要错误处理"

# 查看当前内存
/memory show

# 刷新重新加载所有 GEMINI.md
/memory refresh
```

## 自定义命令：使用 TOML 自动化重复工作

Gemini CLI 允许你通过 `.toml` 配置文件自定义 Slash Commands（如 `/my-command`），将复杂的 Prompt 和逻辑封装成简单的指令。这对于团队协作和个人工作流标准化非常有帮助。

### 命令定义位置

你可以定义两类命令：

1.  **全局命令**：存放在 `~/.gemini/commands/`。所有项目通用的指令，例如通用的代码解释或翻译命令。
2.  **项目命令**：存放在当前项目根目录的 `.gemini/commands/`。仅在该项目生效，适合项目特定的规范检查或部署指令。此目录建议提交到 Git。

**注意**：文件名即为命令名。例如 `commit.toml` 会生成 `/commit` 命令。

### TOML 文件结构

一个基本的命令文件至少包含 `prompt` 字段。

```toml
# 文件名: ~/.gemini/commands/hello.toml
# 调用方式: /hello

description = "一个简单的问候命令"
prompt = "你好，Gemini！请给我讲一个关于程序员的简短笑话。"
```

### 进阶用法：动态参数与 Shell 集成

Gemini CLI 的强大之处在于它支持动态参数和 Shell 命令注入。

1.  **动态参数 `{{args}}`**：捕获你在命令后输入的文本。
2.  **Shell 集成 `!{cmd}`**：执行系统命令并将结果插入 Prompt。

**实战示例：智能 Git Commit 生成器**

创建一个名为 `git/commit.toml` 的文件（支持子目录命名空间，调用时使用 `/git:commit`）：

```toml
# 文件名: .gemini/commands/git/commit.toml
# 调用方式: /git:commit

description = "根据暂存区的变更生成符合 Conventional Commit 规范的提交信息"
prompt = """
你是一个 Git 专家。请根据以下 `git diff --staged` 的输出，生成一个符合 Conventional Commits 规范的提交信息。

输出要求：
1. 第一行是简短的描述（<type>: <subject>）。
2. 空一行。
3. 详细的变更说明列表。

Diff 内容：
!{git diff --staged}
"""
```

当你运行 `/git:commit` 时，Gemini 会自动执行 `git diff --staged`，读取变更内容，然后按照你的要求生成 Commit Message。

**实战示例：需求拆解助手**

```toml
# 文件名: .gemini/commands/split.toml
# 调用方式: /split "用户登录功能"

description = "将一个大需求拆解为小的技术任务"
prompt = """
请将以下需求拆解为具体的开发任务列表。每个任务应包含简要的技术实现思路。

需求描述：
{{args}}
"""
```

通过这种方式，你可以将原本需要反复复制粘贴的 Prompt 变成一行简单的命令，极大地提升效率。

## 检查点和回滚

灵活运用 Checkpointing 与 `/restore`：

当你让 Gemini CLI 修改文件时，它会在执行前创建一个**检查点 (Checkpoint)**。这个功能允许你随时回溯到之前的状态，就像 Git 的版本控制一样，为你的操作提供了安全保障。

- **启用 Checkpointing**：默认情况下，此功能可能需要手动在 Gemini CLI 的 `settings.json` 配置文件中启用。具体设置请参考官方文档。
- **工作原理**：每当有文件修改工具（如 `write_file` 或 `replace`）即将被批准执行时，CLI 会自动拍摄一个项目文件的快照（存储在一个独立的 Git 仓库中，不影响你的项目 Git 仓库）、保存当前的对话历史以及即将执行的工具调用。
- **恢复操作**：
  - 输入 `/restore` 可以列出所有可用的检查点。
  - 输入 `/restore [tool_call_id]` 可以回溯到特定的检查点。
  - 恢复后，你的项目文件将回到检查点时的状态，CLI 对话历史也会恢复，并且原来的工具调用会再次弹出，让你有机会重新考虑或修改。

这个功能在你进行实验性修改、或者不确定 AI 提议是否最佳时，提供了强大的“撤销”能力。

## 添加多目录

在 Gemini CLI 中可以同时处理多个项目文件

```
/directory add src/backend,src/frontend,src/shared
/directory show  # 列出所有已添加目录

# 现在可以同时引用它们
@src/backend/api.ts @src/frontend/components.tsx
"保证后端 API 和前端组件的类型对齐"
```
