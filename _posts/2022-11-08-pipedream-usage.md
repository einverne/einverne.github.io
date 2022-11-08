---
layout: post
title: "在线工作流 Pipedream 使用记录"
aliases:
- "在线工作流 Pipedream 使用记录"
tagline: ""
description: ""
category: 产品体验
tags: [ pipedream, ifttt, workflow, email, rss, telegram , serverless, saas ]
create_time: 2022-11-08 11:32:36
last_updated: 2022-11-08 11:32:36
---

今天在看 Grafana 入门 [教程](https://grafana.com/tutorials/grafana-fundamentals/) 的时候偶然间发现了 Pipedream 这个网站，在 Grafana 的演示中利用 Pipedream 创建 Workflows，然后在 Alert Manager 中通过 Webhook 想 Pipedream 发起调用，然后利用 Pipedream 的能力就可以向集成的应用（Telegram，Email，Slack）等等发送告警通知了。

## 什么是 Pipedream

Pipedream 是一个可以定义自己的在线自动化工作流的 SaaS 工具，Pipedream 允许用户创建并运行一个工作流，这个工作流可以串联多个不同的应用，可以执行用户代码定义的逻辑。可以认为是一个更高级，可编程的 [[IFTTT]]，[[Zapier]]。

- <https://pipedream.com/>
- Docs: <https://pipedream.com/docs/>

Pipedream 可以定义不同的触发器（HTTP，Webhook，定时，收到邮件，RSS，Telegram 消息，Discord Channel 等等）来触发工作流的执行。因为 Pipedream 工作流程允许编程，所以一个 Pipedream Workflow 就相当于直接运行了一个 在线的 serverless 的服务。

特性：

- 每个月提供 10000 次免费调用，每条 333 次，对集成的应用，事件源没有任何限制
- 支持超过 [1000 多个外部 APP](https://pipedream.com/apps) ，Google，GitHub，Netlify，Twilio，Slack，Discord，等等
- 并且因为支持编程，并且可以通过环境变量将 API keys 或验证等传入给代码，所以 Pipedream 几乎可以连接任意的应用
- 可以编写代码完全控制工作流
- serverless 架构，完全不需要自己的服务器

Pipedream 的用途：

- 新用户注册，发送通知到 Slack
- 定时检测网站（RSS，Twitter）更新，发送消息通知，可以通过 Slack，Telegram，Email 等等
- 调用某个服务器 API，并发送通知
- 检测自己的服务是否宕机，即使每 5 分钟检查一次，一个月最多也只用了免费方案的 8%

## Workflows

Workflows 工作流，集成应用，数据，APIs。

- Workflows 由代码组成，是代码组织和执行的顺序，包含多个 steps
- 通过 Event（事件）触发，可以是 HTTP Requests，或者定时触发
- 添加 steps 来执行 Node.js， Python，Go，Bash 等等，或者使用内置的 actions
- Steps 按照 Workflow 中定义的顺序执行
- 每一个 step 产生的数据可以通过 `step` 对象获取



