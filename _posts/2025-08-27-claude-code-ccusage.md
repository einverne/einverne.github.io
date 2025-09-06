---
layout: post
title: ""
aliases:
- ""
tagline: ""
description: ""
category: 
tags: [ claude-code, anthropic, ccusage, open-source, ]
create_time: 2025-08-28 10:48:04
last_updated: 2025-08-28 10:48:04
dg-home: false
dg-publish: false
---

在之前的视频和文章当中，我也经常提到 Cloud Code 5 小时的限制，那么我们在进行开发的时候，监控模型的消耗和使用成本是至关重要的。所以今天我想为大家介绍一款专为 Claude Code 设计的消耗统计工具——CC Usage。 它能帮助开发者掌控对 Claude Code token 消耗的使用情况，避免意外超出配额。

## 什么是 ccusage

ccusage 是一个轻量级的命令行工具，专门用于分析 Claude Code 的使用情况。它通过读取本地的 Claude Code 使用数据，提供详细的消耗统计报告，包括每日 Token 消耗、费用计算和使用趋势分析。与官方提供的基础统计相比，ccusage 提供了更加直观和详细的数据展示。

这个工具的核心优势在于它是纯本地的分析。它通过提取 home 目录下的 `~/.claude/projects` 目录下的文件来完成分析。 只能统计当前设备上的消耗，确保了用户数据的隐私安全。

## 安装

ccusage 提供多种安装方式，你可以根据自己的需求选择：

### 全局安装（推荐日常使用）

bash

```
sudo npm install -g ccusage
```

### 直接使用（无需安装）

bash

```
npx ccusage
```

### 使用 Bun（速度更快）


```bash
bunx ccusage
```

由于 ccusage 采用了极致的 bundle 优化，工具体积很小，启动速度极快，特别推荐使用`bunx`运行，比`npx`快 2-3 倍。

## 使用

### 查看日常消耗

安装完成后，最基本的使用方法是查看每日消耗统计：

bash

```
ccusage
```

这将显示最近几天的使用情况，按日期展示 Token 消耗和估算费用。

### 查看从特定日期开始的消耗

如果想查看从某一天开始的消耗统计，可以使用`-s`参数：

bash

```
ccusage -s 20250701
```

这个命令将显示从 2025 年 7 月 1 日开始的所有消耗记录。

### 实时监控消耗

对于需要实时掌握使用情况的场景，ccusage 提供了实时监控功能：

bash

```
ccusage blocks --live
```

该命令会持续更新显示当前的使用状况，包括活跃区块的消耗和剩余时间。

### 按项目查看消耗

如果你同时在多个项目中使用 Claude Code，可以按项目统计成本消耗：

bash

```
ccusage -i
```

这个功能对于需要分别核算不同项目成本的团队特别有用。

### 状态栏集成

ccusage 最实用的功能之一是与 Claude Code 状态栏的集成，让你在编码过程中随时掌握消耗情况。

只需要在 `~/.claude/settings.json` 文件下面加上如下的配置，就可以看到 Cloud Code 的实时消耗了。

```
{
  "statusLine": {
    "type": "command",
    "command": "bun x ccusage@latest statusline",
    "padding": 0
  }
}
```

当让如果更倾向使用 npm 也可以自己将配置中的 bun 修改为 npm。

配置完成后，Claude Code 的状态栏会实时显示：

- 当前使用的模型名称：正在使用的 Claude 模型类型
- 当前会话费用：正在进行的对话消耗
- 今日总费用：当天累计消耗金额
- 5 小时区块费用与剩余时间：当前活跃区块的使用情况
- 实时消耗速率：带颜色指示的消耗速度
- 状态栏会根据消耗速率变化颜色，帮助你直观了解当前的使用强度。

![HSyRBLX92T](https://pic.einverne.info/images/HSyRBLX92T.png)

## 更多

### 多项目管理

在 `~/.ccusage/config.json` 配置中添加多个项目

```
{
  "projects": {
    "frontend": "/Users/dev/projects/frontend/.claude",
    "backend": "/Users/dev/projects/backend/.claude",
    "mobile": "/Users/dev/projects/mobile/.claude"
  },
  "defaultCostMode": "calculate",
  "outputFormat": "table"
}
```

JSON 输出和数据集成

```
# 导出详细JSON报告
ccusage monthly --json --breakdown > monthly-report.json

# 结合jq进行数据处理
ccusage daily --json | jq '.sessions[] | select(.cost > 5.0) | {date, cost, tokens}'
```

## 替代工具

除了 ccusage 之外，还有 [CCSeva](https://github.com/Iamshankhadeep/ccseva) 这样的开源 macOS 的菜单栏应用，提供了更加图形化的监控界面。还有 Claude Code Usage Monitor ，通过 Python 编写的分析，更适合有 Python 环境的用户。
