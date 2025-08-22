---
layout: post
title: "Crystal: 多 Claude Code 实例管理器"
aliases:
- "Crystal: 多 Claude Code 实例管理器"
tagline: ""
description: ""
category: 经验总结
tags: [ claude-code, claude, electron, gui, git-worktree, session, session-isolation ]
create_time: 2025-08-19 15:53:04
last_updated: 2025-08-19 15:53:04
dg-home: false
dg-publish: false
---

之前的视频当中介绍过了 Claudia，它是一个 Claude Code 的桌面管理器，它将很多 Claude Code 的终端功能迁移到了桌面版当中，它也支持在应用内直接和 Claude Code 进行对话，但是它缺少了一个核心的功能，那就是当我在同一个项目中开启不同的 Session 时，有可能产生冲突，为了避免这个问题，官方的解决办法是使用 Git worktree，在开发不同的功能时，使用不同的 Worktree 来隔离每一个 Cloud Code 的环境。 今天要介绍的 Crystal 就是这样的一款可以支持多个 Cloud Code 的桌面客户端，并且每一个会话之间相互隔离。

[Crystal](https://github.com/stravu/crystal) 是一个 Electron 桌面客户端，可以让用户运行，审查，以及测试多个 Claude Code 实例，并且使用 Git worktrees 来隔离多个任务。Crystal 是有 Stravu 创建的独立项目，Stravu 提供了可编辑，可协作的 AI 笔记库，支持文字，表格，图表等。

## 工作流

使用 Crystal 可以按如下的流程

- 通过提示词创建 session，每一个都通过 git worktree 隔离
- 在独立的 session 中迭代任务，每一个迭代都会产生一个提交，方便随时返回
- 审查内容的变更，或者做一些人工的编辑
- 然后将提交合并成一个（Squash），将其提交到 main 分支

## 核心功能

- 并行的 Sessions，可以一次执行多个 Claude Code 任务
- Git Worktree 隔离，每一个 Session 之间都拥有独立的分支和环境
- Session 持久化，每一个对话都可以随时恢复
- Git 集成，集成了 rebase 和 squash 操作，简化 Git
- 追踪修改，可以查看变更，追踪修改
- 通知，当 Session 需要输入时桌面通知
- 执行脚本，可以直接在 Crystal 中测试修改

## 使用

在使用之前确保

- Claude Code 安装并且登录
- Git 安装
- 既存的 Git 仓库

在项目的 [release](https://github.com/stravu/crystal/releases/latest) 中下载 dmg 文件，并完成安装。

然后就可以在 Crystal 中通过 Prompt 来创建 Sessions

随时监控以及测试变更，当 Session 完成之后

- 可以执行脚本，进行测试
- 查看变更
- 继续对话，修改

最后当一些都没有问题时，

- 点击 「Rebase to main」，将所有的提交合并成一个提交，然后合并到 main 分支
- 这使得 main 分支比较干净清晰

## 从代码构建

```
# Clone the repository
git clone https://github.com/stravu/crystal.git
cd crystal

# One-time setup
pnpm run setup

# Run in development
pnpm run electron-dev
```

构建生产应用

```
pnpm build:mac
```

## related

- [[Conductor]] <https://conductor.build/>
