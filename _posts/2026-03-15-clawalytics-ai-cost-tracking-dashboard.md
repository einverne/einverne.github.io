---
layout: post
title: "Clawalytics：给你的 OpenClaw 花费装上一个仪表盘"
aliases:
- "Clawalytics：给你的 OpenClaw 花费装上一个仪表盘"
tagline: "一个专为 OpenClaw 用户打造的开源 Token 消耗统计工具"
description: "Clawalytics 是一个开源的 OpenClaw Token 消耗统计和可视化工具，支持用量监控、预算告警和多模型成本分析，帮你掌控 AI API 花费。"
category: 产品体验
tags: [clawalytics, claude-code, openclaw, ai-cost, token-tracking, open-source]
create_time: 2026-03-15 10:00:00
last_updated: 2026-03-15 10:00:00
---

自从安装使用 [OpenClaw](https://www.einverne.info/post/836.html) 之后，我一直没有找到一个好办法直接在 OpenClaw 里追踪 Token 的消耗情况。虽然我日常主要用的是月订阅套餐，但偶尔为了测试一些新模型或者跑特定任务，还是会走 API 调用。这部分花费是按量计费的，用多少扣多少，如果不注意很容易超额。之前也试过在 Anthropic 控制台手动查 Usage，但那个粒度太粗了，根本看不出来钱到底花在了哪些项目、哪些模型上。直到最近发现了 [[Clawalytics]] 这个项目，通过它的可视化仪表盘查看 Token 消耗的详细数据，才终于有了一种"心里有底"的感觉。

![Clawalytics Dashboard](https://pic.einverne.info/images/2026-03-15-clawalytics-dashboard-cover.png)

## Clawalytics 是什么

Clawalytics 是一个开源的 OpenClaw Token 消耗统计和可视化工具。简单来说，它会读取 OpenClaw 本地产生的 JSONL 会话日志文件，解析其中的 Token 用量数据，然后计算出每一次请求、每一个会话、每一天的实际花费，最终以一个漂亮的 Web 仪表盘呈现出来。对于像我这样既有月订阅又偶尔走 API 调用的用户来说，它能帮你清晰地看到 API 部分到底花了多少，从而避免不知不觉超额使用。

跟那些需要你把 API Key 交给第三方服务的方案不同，Clawalytics 完全在本地运行，数据存储在本地的 [[SQLite]] 数据库里，不会把你的任何信息上传到外部服务器。这一点对于在意隐私的开发者来说非常重要。

技术栈上，前端用的是 [[React]] 19 + [[TanStack Router]] + [[shadcn/ui]]，后端是 [[Express.js]] + better-sqlite3，用 [[Vite]] 构建，整体非常现代。图表部分用了 Recharts，动画用了 Framer Motion，状态管理选择了 Zustand，基本上是当下 React 生态里最主流的技术组合。

## 为什么需要这样一个工具

如果你经常使用 Claude Code 或者 OpenClaw，一定对"Token 消耗失控"这件事不陌生。社区里有人反馈过一个月 API 账单达到 3600 美元的情况，也有人因为一个心跳循环在夜间跑了一整晚，醒来发现多了 200 美元的账单。这些听起来像段子，但确实在发生。

问题的根源在于，每一次请求都会重新注入完整的工具列表、技能元数据和工作区文件，再加上完整的对话历史。这意味着你的第 20 轮对话的输入 Token 量是第一轮的 20 倍。不同模型的价格差异也非常大——在 Opus 上跑的任务如果切到 Haiku，成本可以降低到二十五分之一。

但如果你不做追踪，这些信息全都是模糊的。你可能只知道"这个月花了不少"，但根本说不出来钱花在了哪里、哪些模型最烧钱、缓存到底省了多少。Clawalytics 就是来解决这个问题的。

## 核心功能

### 成本概览仪表盘

打开 Clawalytics 的主页面，你能看到一个非常直观的成本概览。它按照今天、本周、本月和全部时间四个维度展示总花费，同时给出 Token 的详细拆分——输入 Token、输出 Token、缓存创建和缓存读取分别用了多少。最有价值的是缓存节省计算器，它会告诉你因为使用了 Prompt Caching 而省下了多少钱。

仪表盘上还有一个 30 天的每日花费趋势图和模型使用分布饼图，让你一眼就能看出最近的消费趋势和各个模型的占比情况。

![oxSgfqRugH](https://pic.einverne.info/images/oxSgfqRugH.png)

### 会话历史追踪

每一次编码会话都会被记录下来，包括项目路径、开始和结束时间、使用的模型、消耗的 Token 数量和对应的成本。你可以展开任意一个会话查看详细信息，也可以按项目分组来看不同项目的花费对比。对于同时维护多个项目的开发者来说，这个功能特别实用——终于能清楚地知道哪个项目是"吞金兽"了。

### 多模型分析

Clawalytics 支持几乎所有主流的 AI 提供商和模型，包括 Anthropic 的 Claude 全系列、OpenAI 的 GPT 系列、Google 的 Gemini 系列、DeepSeek、Moonshot/Kimi 等等。每个模型的花费、Token 消耗、使用趋势都有独立的图表展示。你可以在模型对比页面上一目了然地看出，比如 Claude Opus 4 的输入价格是每百万 Token 15 美元，而 Claude Haiku 只要 0.25 美元——差了 60 倍。这种直观的对比能帮你更理性地选择模型。

### 预算管理和告警

这可能是对钱包最友好的功能了。你可以分别设置每日、每周和每月的预算上限，当花费接近或超过阈值时，Clawalytics 会自动发出告警。在 CLI 界面上，预算进度会以进度条的形式展示，非常直观。虽然它本身不能阻止你继续花钱（那是 API 提供商的事），但至少能让你在失控之前收到提醒。

### Agent 和 Channel 分析

如果你使用 OpenClaw 的多 Agent 功能，Clawalytics 还能追踪每个 Agent 的独立花费，并按 Agent 维度做成本拆分。类似地，如果你的 OpenClaw 接入了 WhatsApp、Telegram、Slack 等消息渠道，也能看到每个渠道的消息量、成本和单条消息的平均花费。

### 安全监控

Clawalytics 还内置了一套安全监控功能，包括设备配对管理、连接事件日志、安全告警和完整的审计日志。考虑到 OpenClaw 之前爆出过不少安全问题（包括一个 CVSS 8.8 分的远程代码执行漏洞），有这样一个安全仪表盘确实能让人安心不少。

### MCP 集成

Clawalytics 还提供了一个 Model Context Protocol 服务器，暴露了十个工具，包括获取花费摘要、成本拆分、预算状态、安全告警等。这意味着你可以直接在 Claude Code 的对话里查询自己的花费情况，比如问一句"这周花了多少钱"，AI 就能通过 MCP 工具帮你查出来。

## 安装和使用

### 安装

安装非常简单，一行命令搞定：

```bash
npm install -g clawalytics
```

或者如果你用 pnpm：

```bash
pnpm add -g clawalytics
```

安装完成后，Clawalytics 会自动注册为系统后台服务。在 macOS 上它会创建一个 LaunchAgent，在 Linux 上会创建 systemd 用户服务，在 Windows 上则注册为任务计划。服务会随系统启动自动运行，你不需要手动去启动它。

### 基本使用

直接在终端输入 `clawalytics`（不带任何参数），会显示一个精简的状态面板，包括当前运行状态、花费概览和预算进度条。

要打开完整的 Web 仪表盘，服务默认运行在 9174 端口，用浏览器访问 `http://localhost:9174` 即可。

其他常用命令：

```bash
# 查看详细状态
clawalytics status

# 编辑配置文件
clawalytics config

# 设置预算
clawalytics budget --daily 10 --weekly 50 --monthly 200

# 查看日志
clawalytics logs -f

# 查看所有文件路径
clawalytics path

# 检查更新
clawalytics update --check

# 停止
clawalytics uninstall-service
```

### 配置

配置文件位于 `~/.clawalytics/config.yaml`，首次运行时会自动创建。你可以在里面自定义模型价格、设置预算阈值、配置 OpenClaw 的路径等。配置文件采用深度合并的方式，所以更新版本后新增的模型定价会自动生效，不会覆盖你的自定义设置。

一个典型的配置片段：

```yaml
# 预算告警阈值
alertThresholds:
  dailyBudget: 10
  weeklyBudget: 50
  monthlyBudget: 200

# OpenClaw 集成路径（通常自动检测）
openClawPath: ~/.openclaw
securityAlertsEnabled: true
```

### MCP 服务器配置

如果你想在 Claude Code 里直接查询花费数据，可以把 Clawalytics 的 MCP 服务器加到配置中：

```json
{
  "mcpServers": {
    "clawalytics": {
      "command": "clawalytics-mcp"
    }
  }
}
```

### 远程访问

如果你的 Clawalytics 跑在远程服务器上，可以通过 SSH 隧道访问：

```bash
clawalytics tunnel
```

这个命令会显示具体的 SSH 隧道建立说明。

## 数据存储

所有数据都存储在 `~/.clawalytics/` 目录下：

- `clawalytics.db` —— SQLite 数据库，使用 WAL 模式提供良好的并发读取性能
- `config.yaml` —— 配置文件
- `clawalytics.log` —— 运行日志
- `pricing-cache.json` —— 模型定价缓存（24 小时有效期）

数据库里总共有 13 张表，涵盖会话记录、请求详情、每日成本汇总、模型使用统计、Agent 和 Channel 数据、设备管理、安全告警和审计日志。数据导出支持 CSV 和 JSON 两种格式。

## 卸载

卸载同样简单：

```bash
npm uninstall -g clawalytics
```

卸载脚本会自动清理系统服务（LaunchAgent / systemd / 任务计划），但会保留 `~/.clawalytics/` 目录里的数据和配置。如果你想彻底清理，需要手动删除这个目录：

```bash
rm -rf ~/.clawalytics
```

如果只想移除系统服务但保留 Clawalytics 本身，可以用：

```bash
clawalytics uninstall-service
```

## 与其他方案的对比

社区里其实已经有一些 AI 成本监控的方案了。比如 TokPinch 是一个代理层方案，它能在请求层面做实时的预算限制和模型路由；ClawMetry 提供只读的统计数据；Tokscale 是一个纯 CLI 工具。

Clawalytics 的定位更偏向于"全功能本地仪表盘"。它不是一个代理，不会拦截你的请求，而是被动地读取日志文件来分析数据。这种方式的好处是零侵入——你的 AI 工具完全感知不到 Clawalytics 的存在，不会引入额外的延迟或故障点。缺点是它无法像代理方案那样主动阻止超支。所以最理想的做法可能是 Clawalytics 负责可视化和分析，API 提供商的原生限额功能负责兜底。

## 最后

在 AI 辅助编程成为日常的今天，Token 消耗就像水电费一样——你不去看的时候感觉不到，但账单到手的时候往往会吓一跳。Clawalytics 做的事情其实很朴素：把散落在日志文件里的数据收集起来，计算清楚，然后用可视化的方式呈现给你。但就是这样一个"朴素"的工具，让我第一次真正理解了自己的 AI 使用习惯。

比如我发现自己有 60% 以上的花费其实来自 Opus 模型处理一些完全可以用 Sonnet 甚至 Haiku 搞定的任务。又比如，缓存命中率的提升让我一个月省了将近 40% 的成本，而这些在没有数据的时候都只是模糊的猜测。

如果你也是 Claude Code 或 OpenClaw 的重度用户，强烈建议试试 Clawalytics。安装只需要一行命令，卸载也很干净，几乎没有试错成本。

项目地址：[clawalytics/clawalytics](https://github.com/clawalytics/clawalytics)
