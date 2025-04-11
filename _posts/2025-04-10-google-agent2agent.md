---
layout: post
title: "Google Agent2Agent 协议"
aliases:
- "Google Agent2Agent 协议"
tagline: ""
description: ""
category: 经验总结
tags: [ google, google-agent2agent, a2a, ai, mcp, anthropic, openai, ai-chat ]
create_time: 2025-04-11 11:53:23
last_updated: 2025-04-11 11:53:23
dg-home: false
dg-publish: false
---

## 什么是 AI Agent

[[AI Agent]] 是一个能自主感知，并进行决策，执行任务的智能系统，核心是利用 AI，尤其是大语言模型 LLM，完成复杂任务，模仿人类的智能行为。

现如今，AI Agent 已经能够自主处理非常多重复和复杂的任务，并且越来越多的企业也正在构建和部署 AI Agent。

## MCP 是什么

MCP（Model Context Protocol，[模型上下文协议](https://blog.einverne.info/post/2024/12/anthropic-model-context-protocol.html)）是由 Anthropic 于 2024 年推出的一种开放标准，通过统一的协议，将大型语言模型（LLM）与外部数据源、工具和功能连接起来，以实现更高效的交互和扩展能力。

## Agent2Agent 是什么？

Google 开源了首个标准智能体交互协议——Agent2Agent Protocol（简称 A2A）。

A2A 将彻底打破系统孤岛，对智能体的能力、跨平台、执行效率产生质的改变，支持 Atlassian、Box、Cohere、Intuit、Langchain、MongoDB、PayPal、Salesforce、SAP、ServiceNow、UKG 和 Workday 等主流企业应用平台。

谷歌还效仿 OpenAI 开源了 Agent 开发套件 ADK，内部测试工具 Agent Engine，新的 Agent 市场等。下面「AIGC 开放社区」先为大家解读 A2A 的重点内容。

A2A 是对 Anthropic MCP 协议的补充，MCP 为 Agent 提供了使用的工具和上下文，A2A 协议则是在 Agent 之间构建了一个开放的协议。

### A2A 设计原则

A2A 是一种开放协议，为 Agent 提供一种标准的交互形式，不受底层框架或供应商的限制。

举一个简单的例子，比如一家互联网公司内部使用多个企业协作服务，比如利用 Atlassian 作为项目管理，Slack 作为企业内部沟通工具，Dropbox 作为文件存储和共享，在此之前这些平台上的 AI Agent 是无法自由通信的，如果要实现沟通只能通过 API 调用或者花费额外的开发，但是通过 A2A 协议，这些平台可以自由地安全地交互数据。

五个关键原则：

- 多代理，A2A 专注于 Agent 在自然，非结构化的模式下协作，不共享内存，工具和上下文
- 基于现有，流行的标准构建，包括 HTTP，服务器端事件（[[Server Sent Events]])，JSON-RPC 等
- A2A 支持企业级认证和授权，A2A 协议可以快速通过身份验证，安全地获取数据
- 支持长时间任务，支持快速任务或者可能需要很长时间的深入研究，A2A 可以向用户提供实时反馈，通知，状态更新
- Agent 不仅限于文本，支持各种模态，包括音频，图像，视频

### 工作原理

客户端 Agent （Client Agent）和远程 Agent （Remote Agent ）通信，客户端 Agent 负责制定和传达任务，远程 Agent 则根据这些任务采取行动，提供信息或执行操作。

![PCl3](https://photo.einverne.info/images/2025/04/11/PCl3.png)

关键点

- **能力发现**，Agent 利用 JSON 形式来定义其能力，称为 Agent Card，让客户端 Agent 识别哪个远程 Agent 最适合执行特定任务，一旦确定了合适的远程 Agent，客户端 Agent 就会利用 A2A 协议进行通信，将任务分配给它。
- **任务管理**，对于一些简单的任务，可以立即完成，对于复杂，长期的任务，Agent 可以保持沟通，并更新状态，完成时，输出称为「Artifact」
- **协作**，A2A 支持 Agent 之间协作，Agent 之间可以相互发送信息，包含上下文信息，回复，工件或用户指令。
- **用户协商**，每一条消息包含 `parts`，即完成形成的内容片段，例如生成的图像，每个 part 都有指定的内容类型，允许客户端和远程 Agent 协商所需要的正确格式。

Google 在官方博客中还给出了一个真实的 A2A 案例，比如要招聘软件工程师，那么在统一的界面中，比如 Agentspace，用户可以直接委托 Agent 寻找符合职位，工作地点，技能要求的候选人。然后 Agent 会自动和其他专业 Agent 互动，寻找潜在的候选人。用户收到建议之后，可以指示 Agent 经一步安排面试等。

## Agent Development Kit

Google 在发布 A2A 协议草案的同时也公开了 [Agent Development Kit](https://cloud.google.com/blog/products/ai-machine-learning/build-and-manage-multi-system-agents-with-vertex-ai) （ADK） 这样的 Agent 开发套件。[^1]

[^1]: <https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/>

## reference

- <https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/>
- <https://github.com/google/A2A>
