---
layout: post
title: "Vibe Kanban：当 AI 开始并行协作，我们的开发方式变了"
aliases: 
- Vibe Kanban：当 AI 开始并行协作，我们的开发方式变了
tagline: "利用 Git Worktree 实现 AI 团队并行开发"
description: "深度体验 Vibe Kanban，探索如何利用独立的 Git worktree 让多个 AI Agent 并行处理前端、后端和测试任务，从单兵作战转向指挥官模式。"
category: 产品体验
tags: [ai, git-worktree, productivity, workflow, agent, kanban, vibe, devops, automation, collaboration, claude-code, codex, gemini-cli]
last_updated: 2026-01-02
---

在我之前的视频当中，我介绍过在 Claude Code 中使用子代理（Subagents）机制和 Git Worktree 来实现并行工作流。我们可以创建子代理来并行执行任务，但是 Subagents 的配置和使用都还需要我们在 Claude Code 中等待。那如果我们有完全独立的两个任务要执行呢，我们可以开两个 Claude Code 分别在两个 Claude Code 中提交任务，然后让 Claude Code 完成。此时我们依然会遇到一些问题，比如说两个 Claude Code 的代码可能产生冲突。并且如果我们有超过两个独立任务时，我们在管理 Claude Code 的成本就会指数级上升。

那么今天要介绍的这个工具就是为了解决上述的问题而诞生的，它的名字叫做 [[Vibe Kanban]]。

![GA7PBp0Jy2](https://pic.einverne.info/images/GA7PBp0Jy2.png)

### Vibe Kanban 是什么？

简单来说，**Vibe Kanban** 是一种将 AI Agent（如 Claude Code、Codex、Aider 等）与 [Git Worktree](https://blog.einverne.info/post/2019/03/git-worktree.html) 技术深度结合的开发工作流方案。

它的核心理念是将“看板管理”引入 AI 开发：

- **任务看板**：将复杂的开发需求拆解为独立的子任务（前端、后端、测试等）。
- **并行执行**：利用 Git Worktree 为每个任务创建独立的临时工作目录。
- **Agent 协作**：为每个目录分配一个独立的 AI Agent，让它们在各自的“平行时空”中同时开工，互不干扰。

这让开发者从“写代码的人”转变为“指挥官”，从排队等待 AI 生成代码，进化到多线程并行推进项目进度。

传统的 Claude Code，Codex 使用本质上还是「结对编程」（Pair Programming）的概念，也就是和 AI 同坐在同一台电脑前，如果 AI 不结束当前的任务，就没有办法开始下一个。Claude Code 虽然已经非常强大可以快速实现代码，但在同一个时间窗口内只能等待。

而 **Vibe Kanban** 的引入，通过一种巧妙的方式解决了这个问题：**完全并行**。

我可以在看板中创建多个任务，例如：

1. 将任务 A 分配给 Claude Code 去修改后端代码
2. 将任务 B 分配给 Codex 去修改前端样式
3. 将任务 C 分配给 Gemini CLI 去生成代码文档

它们相互不干扰，可以同时进行。这不仅是效率的提升，更是工作流的质变。

其实在我之前的文章当中，我也介绍过非常多的 Claude Code 实例管理器，比如 [Claudia](https://blog.einverne.info/post/2025/08/claudia-gui-claude-code.html)，[Crystal](https://blog.einverne.info/post/2025/08/crystal-multi-session-claude-code-manager.html)，但每一个用起来都或多或少有一些小问题，使用体验远远不如 Vibe Kanban。

那么接下来我们就详细介绍一下 Vibe Kanban。

### 传统开发流程

在传统的软件开发流程中，我们习惯了线性工作。改完代码 -> 跑测试 -> 提交。即使是人类团队协作，也往往需要通过 Git 分支来隔离工作，避免互相踩脚。

而目前的 AI 编程工具，大多是基于单个上下文的。你打开一个 IDE 窗口，AI 就只能"看到"和"操作"这个窗口里的文件。如果你想让它同时干两件事，通常得打开两个 IDE 窗口，分别手动切换分支，还得小心翼翼地管理它们，非常麻烦。

**Vibe Kanban**（或者说这类理念）的核心在于结合了两个关键技术：

1.  **AI Agent（智能体）**：具备独立完成特定任务能力的 AI。
2.  **Git Worktree**：Git 的一项被低估的特性，允许你在同一个仓库中同时检出（check out）多个分支到不同的文件夹。

通过将每一个 AI Agent 分配到一个独立的 Git Worktree 中，我们实际上是为每一个 AI 创造了一个"平行的时空"。它们共享同一个 `.git` 历史，但拥有完全独立的文件系统工作区。

### 深度分析

#### 真正的并行架构

Vibe Kanban 的核心优势在于**环境隔离**。

以往我们尝试让 AI 并行，最大的痛点是文件锁冲突或者 Git 索引冲突。但在 Vibe Kanban 的架构下：

- **Agent A (前端)** 工作在 `/workspace/frontend-feature` 目录（对应 git worktree A）
- **Agent B (后端)** 工作在 `/workspace/backend-api` 目录（对应 git worktree B）
- **Agent C (测试)** 工作在 `/workspace/test-runner` 目录（对应 git worktree C）

它们可以在同一时间修改同一个项目，而不会因为文件被占用而报错。

#### 看板式指挥

之所以叫 "Kanban"（看板），是因为这种模式通常配套一个可视化的任务管理界面。

在这个界面上，你不再是写代码的人，你是 **Product Manager (PM)** 兼 **Tech Lead**。

- 你创建一个任务卡片："增加用户登录页面"。
- 这一大任务被拆解为子任务：前端 UI、后端 Auth 接口、集成测试。
- 你将子任务分别拖拽给不同的 Agent。
- 你在看板上看着它们的状态从 "Todo" 变为 "In Progress"，最后变成 "Review Needed"。

这种感觉非常奇妙，你是在指挥一场战役，而不是在亲自拼刺刀。

#### 实际体验的冲击

刚开始尝试这种模式时，最直观的感受是**速度**。不是代码生成速度变快了，而是**等待时间被填满了**。

以前 AI 写后端逻辑时，我只能干等着。现在，我把它丢给 Backend Agent，转头就去告诉 Frontend Agent 页面该怎么画。等我布置完前端任务，后端代码可能已经写好提交了。

### 具体使用流程

想自己动手尝试一下？虽然 Vibe Coding 还没有完全普及的开箱即用工具，但我们可以通过手动组合现有工具来复刻这个流程。

#### 第一步：初始化工作区

首先，不要在主目录直接干活，我们要为不同的角色创建各自的"办公室"（Worktree）。

假设你的项目叫 `my-app`，你可以这样组织目录：

```bash
# 1. 创建主项目目录
mkdir my-app-vibe
cd my-app-vibe

# 2. 克隆你的项目到 base 目录
git clone git@github.com:username/my-app.git base
cd base
```

#### 第二步：创建并行分支与 Worktree

现在，我们要分配任务了。假设你要开发一个"用户评论功能"，需要同时动前端和后端。

```bash
# 为后端任务创建分支和 worktree
git worktree add ../backend-task feature/comments-api

# 为前端任务创建分支和 worktree
git worktree add ../frontend-task feature/comments-ui
```

此时，你的 `my-app-vibe` 目录下会有三个文件夹：

- `base/`：主仓库，用于合并代码。
- `backend-task/`：给后端 AI 用的独立工作区。
- `frontend-task/`：给前端 AI 用的独立工作区。

#### 第三步：并行指挥 AI

现在是最酷的部分。你可以打开两个终端窗口，或者两个 IDE 实例（VS Code 支持 `code folder_path`）。

**对于后端 AI (在 `backend-task` 目录)：**

> "请基于当前的数据库结构，在 `src/api` 中添加评论相关的 CRUD 接口。请确保遵循 RESTful 规范，并添加单元测试。"

**对于前端 AI (在 `frontend-task` 目录)：**

> "我需要一个评论组件，请在 `src/components` 下创建。API 接口假设为 `POST /api/comments`，具体字段参考我给你的这个 JSON 结构..."

这时候，两个 AI 就像两个坐在不同工位的同事，互不干扰地修改代码。Git Worktree 保证了后端 AI 修改 API 文件时，前端 AI 的目录里文件并不会变，避免了实时的冲突。

#### 第四步：合并与验收

当两个 AI 都汇报"任务完成"后：

1.  **后端验收**：在 `backend-task` 跑测试，确认 API 正常，提交代码 (`git commit`)。
2.  **前端验收**：在 `frontend-task` 运行 Storybook 或 dev server，确认 UI 正常，提交代码。
3.  **最终合并**：

```bash
cd ../base
git merge feature/comments-api
git merge feature/comments-ui
```

如果有冲突（通常在 `routes` 注册或公共配置文件上），这时候才是你这个 Tech Lead 出手解决冲突的时候。

### 实践经验

要实现或者模拟 Vibe Kanban 的工作流，其实不一定非要等到成熟的商业软件，我们利用现有的工具也可以尝试这种 workflow。

这里分享几个我在实践中的具体操作建议：

#### 善用 Git Worktree

如果你也是命令行重度用户，可以先习惯 Git Worktree。比如，当你需要修复一个 Bug，但当前分支的工作还没做完：

```bash
# 以前的做法：git stash -> git checkout -> fix -> commit -> git checkout -> git stash pop
# 现在的做法：
git worktree add ../hotfix-branch hotfix/login-bug
cd ../hotfix-branch
# 在这个新目录里让 AI 尽情修改，原目录不受任何影响
```

对于 AI Agent 工具，确保它们能指定"工作目录"（Working Directory）。

#### 明确契约 (Contract First)

并行开发最大的挑战是前后端协作。如果 Frontend Agent 和 Backend Agent 同时开工，它们怎么知道 API 长什么样？

我的经验是：**先定接口，再并行。**

1.  先让 AI 起草一个 `api-spec.json` 或者 Swagger 文档。
2.  人工确认这个接口定义。
3.  然后分别发指令：
    - 对前端 AI："根据这个 api-spec 编写调用逻辑。"
    - 对后端 AI："实现这个 api-spec 定义的接口。"

这样两个 AI 才能在最后顺利会师（Merge）。

#### 独立的测试环境

给负责测试的 AI 分配 Worktree 时，要注意数据库等外部依赖的隔离。如果所有 Agent 都连同一个本地数据库，跑测试的 AI 可能会把开发 AI 刚写入的数据清空，导致混乱。使用 Docker 容器为每个 Worktree 起独立的数据库实例是一个好办法。

## 缺点
因为使用了可视化的 Vibe Kanban，这也就意味着放弃了在 CLI 当中的一些优势。比如说，我们可以在 Claude Code 当中：使用 Slash Commands，或者调用增强的 Plan 模式，在Vibe Kanban 当中是不能执行的。
### 最后

Vibe Kanban 给我们展示的不仅仅是一个新工具，而是一种新的**人机协作形态**。

在这个形态下，程序员的职责发生了根本性的转移：

- 从 **Writer** 变成了 **Reviewer**。
- 从 **Worker** 变成了 **Manager**。

我们不再纠结于具体的语法细节，而是专注于架构设计、任务拆解和质量把控。每一个独立的 Git Worktree 里，都有一个不知疲倦的数字员工在为你工作。这种"指挥千军万马"的感觉，或许就是 AI 时代赋予开发者的终极浪漫。这仅仅是个开始，期待未来能有更多原生支持这种模式的 IDE 出现。
