---
layout: post
title: "解决 Claude Code 上下文丢失问题: claunch 项目会话管理"
aliases:
- "解决 Claude Code 上下文丢失问题: claunch 项目会话管理"
tagline: ""
description: ""
category: 经验总结
tags: [ claude-code, claunch, session-manager, claude-code-session, tmux, ]
create_time: 2025-08-19 17:27:25
last_updated: 2025-08-19 17:27:25
dg-home: false
dg-publish: false
---

今天在使用 Claude Code 的过程，发生了一件非常沮丧的事情，我远程控制的 Claude Code 电脑忘记插上充电器，平时都是依靠连接的显示器进行充电的，昨天晚上将显示器关闭，导致使用的时候一直都是用的电脑的电池，于是在中午的时候，我通过 [[VibeTunnel]] 连接不上我的 Claude Code 了。并且 Claude Code 中执行的内容也中断了，最关键的是有一些上下文，如果重新再来，极有可能造成很大的不一致。

我知道可以使用 `claude --continue` 来恢复最近一次的 Session，但是我进一步的想到，如果我开启了多个项目，`--continue` 的选项只能恢复最近的一个，其他项目的 Session 可能就丢失了，然后我想到了 [[Claudia]] 一个可视化管理 Claude Code 的界面工具，直接在界面中可以恢复之前的 Session。但是我自己 90% 的时间是在终端下，并且是通过 SSH，或者 [[VibeTunnel]] 来控制 Claude Code ，这种情况下，一旦电脑发生重启，我远程的情况下依然无法恢复刚刚的 Session。

所以为了解决这个问题，我又看到了一个叫做 [claunch](https://github.com/0xkaz/claunch) 的轻量级会话管理器，可以为每个项目提供持久化的 Session。

## 问题

```
$ claude
Human: 我需要帮助处理这个 React 应用的身份验证...
# 花费 10 分钟解释项目结构
# 1 小时后，切换到另一个项目
$ cd ../api-project
$ claude
Human: 正在处理 API 的数据库设计...
# 之前的 React 上下文完全丢失
# 回到 React 项目
$ cd ../react-project
$ claude --resume [session-id]
# 记不住会话 ID，或者 ID 已失效
Human: 我需要帮助处理这个 React 应用的身份验证...
# 又花费 10 分钟重新解释所有内容
```

每次重建上下文需要很长的时间，而每天在不同项目间多次切换，累积的重复解释时间相当可观。

## 解决方式

为了解决这个问题

```
$ cd ~/projects/react-app
$ claunch
# 直接 Claude 会话（轻量级，默认模式）

$ claunch --tmux
# 持久化 Claude 会话（终端崩溃后仍可恢复）

$ cd ~/projects/api-server
$ claunch --tmux
# 为 API 项目创建单独的持久化会话

# 系统重启后
$ cd ~/projects/react-app
$ claunch --tmux
# React 对话完美恢复
```

还可以使用 `claunch list` 查看会话列表。

这个工具的实现原理非常简单，Claude 每一个 Session 都存在一个 id，但是通常我们很难记忆这些 ID，所以我们可以借助脚本帮我们记忆。

```
#!/bin/bash
# 自动检测项目名称
PROJECT=$(basename "$PWD")
# 创建/连接 tmux 会话
tmux new-session -As "claude-$PROJECT" \
  "claude --resume $(cat ~/.claude_session_$PROJECT)"
```

通过对 Tmux 的封装，我们可以直接通过名字来恢复之前的工作状态。

## related

- [[Claude Squad]] 管理多个 Claude 实例的终端应用
