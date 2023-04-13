---
layout: post
title: "利用 n8n 实现个人自动化工作流"
aliases: 
- "利用 n8n 实现个人自动化工作流"
tagline: ""
description: ""
category: 产品体验
tags: [open-source, automation, n8n, ifttt, slack, github, self-hosted, typescript]
last_updated: 2023-04-13 11:56:47
create_time: 2021-08-19 09:34:04
---

[n8n](https://n8n.io/) 是一个开源自动化工作流程序，类似 IFTTT，发音为 nodemation，模仿了 k8s 的命名规则。

n8n 可以互联的服务包括 Github、Google、RSS、Slack、Telegram、Gitlab、Redis、RabbitMq、数据库等等上百种服务[^1]。

[^1]: <https://n8n.io/integrations>

优点：

- 开源
- 可以自己架设
- 强大，可以和数百种服务对接
- Zapier / Tray.io / IFTTT 代替品

用过 IFTTT 的人都应该知道，IFTTT 可以非常方便的实现跨应用和服务的交互，我经常做的事情，比如在 Trello 中打开一个卡片，按一下空格，会自动加入该卡片，这个时候因为触发了加入卡片的动作，IFTTT 就会自动在我的 Google Calendar 上添加一个 Event，时间就是当下。

n8n 使用 TypeScript 编写，支持 npx 直接运行，安装 nodejs 运行以下命令即可运行。

## n8n 的应用场景

任何可以自动化的流程都可以用其连接起来：

- 定期备份任务
  - 自动将某些配置文件备份到另外的地方，或其他云服务
- 需要反复手工执行的操作
  - 导入导出数据
- 抓取聚合内容
  - 定时抓取内容，聚合之后发送到常用的通讯工具，比如 Telegram
- 监控网页或其他内容的变化
  - 当价格降低的时候通知

n8n 上集成了上百个不同的服务，其功能强大程度完全取决于你的想象力。

如果你还没有想到你想做的自动化的事情，[官方的 workflow](https://n8n.io/workflows) 页面提供了一大批的流程可以参考。

## Installation

使用 Docker 安装：

- <https://github.com/einverne/dockerfile>

## 概念

### 节点

在 n8n 中节点是自动化的关键，节点可以做一些事情，通过节点和节点的连接就产生了流。

### 连接 Connections

在节点和节点之间通过 Connections 连接到一起，通过连接可以传输数据。

### Start 节点

Start 节点是流程的第一个节点。

## 常用的工作流服务

### cron 定时任务

## reference

- <https://hub.docker.com/r/n8nio/n8n>
