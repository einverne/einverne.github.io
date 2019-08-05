---
layout: post
title: "jbpm 流程"
tagline: ""
description: ""
category: 学习笔记
tags: [jbpm, business-process-model,]
last_updated:
---

BPMN 中可执行的工作流包含一系列不同类型的节点，这些节点可以被用来连接生成有序的工作流。BPMN 2.0 规范定义了三种主要的类型：

- **Events**, 用来定义特定事件的发生。可以是起始事件（用来表示工作流的开始），结束事件（用来表示工作流的结束，或者子流程结束），中间事件（表示发生在工作流执行过程中的事件）
- **Avtivities**, 定义了在工作流执行过程中需要执行的不同动作。依据不同类型的内容，存在不同类型的 tasks，并且 activities 可以被嵌套
- **Gateways**, 用来定义不同路径，根据不同类型的 Gateway，这可能是 parallel.

jBPM6 并没有实现 BPMN 2.0 规范中的所有元素和属性，但是提供了大部分重要的子集。

## 节点
Events

- Start Event (None, Conditional, Signal, Message, Timer)
- End Event (None, Terminate, Error, Escalation, Signal, Message, Compensation)
- Intermediate Catch Event (Signal, Timer, Conditional, Message)
- Intermediate Throw Event (None, Signal, Escalation, Message, Compensation)
- Non-interrupting Boundary Event (Escalation, Signal, Timer, Conditional, Message)
- Interrupting Boundary Event (Escalation, Error, Signal, Timer, Conditional, Message, Compensation)

Activities

- Script Task
- Task
- Service Task
- User Task
- Business Rule Task
- Manual Task
- Send Task
- Receive Task
- Reusable Sub-Process (Call Activity)
- Embedded Sub-Process
- Event Sub-Process
- Ad-Hoc Sub-Process
- Data-Object

Gateways

- Exclusive
- Inclusive
- Parallel
- Event-Based

本文主要内容总结自 jboss jbpm 官方文档的第 8 章内容。


## reference

- <https://docs.jboss.org/jbpm/release/7.23.0.Final/jbpm-docs/html_single/>
