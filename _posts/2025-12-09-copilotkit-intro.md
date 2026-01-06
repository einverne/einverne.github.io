---
layout: post
title: "CopilotKit：让你的 React 应用 10 分钟拥有上下文感知的 AI Copilot"
aliases: 
- "CopilotKit：让你的 React 应用 10 分钟拥有上下文感知的 AI Copilot"
tagline: "不仅仅是聊天机器人，而是真正懂你应用状态的副驾驶"
description: "深度体验 CopilotKit，一个能让 AI 真正“读懂”应用状态并执行操作的开源框架。本文将从原理到实战，带你构建一个具备上下文感知的 AI Copilot。"
category: 产品体验
tags: [ai, copilot, react, nextjs, langchain, openai, agent, dev-tools, open-source, javascript]
last_updated:
---

最近我一直在思考一个问题：为什么我们现在的很多应用里的 AI "助手"还是那么"笨"？

你可能也有这种体验：你在一个 SaaS 平台上操作复杂的报表，遇到问题点开右下角的 AI 客服，问它"为什么我的数据对不上？"，它通常会礼貌地回复你一段通用的帮助文档，或者干脆让你去读手册。它不知道你当前看的是哪张表，不知道你选了什么筛选条件，更不知道你刚刚进行了什么操作。

这种割裂感让我非常难受。我们想要的不是一个挂在网页旁边的 ChatGPT 网页版，而是一个真正"住"在应用里的、能看见我所见、能帮我操作的 **Copilot（副驾驶）**。

前段时间我发现了一个非常有意思的开源项目 —— **CopilotKit**。在试用了一周末后，我感觉它可能就是我在寻找的那块拼图。它让开发者能以非常 React 的方式，把 AI 的"大脑"和应用的"身体"连接起来。

今天就来和大家聊聊这个工具，看看它是如何解决"上下文"这个难题的。

## 什么是 CopilotKit？

简单来说，[CopilotKit](https://www.copilotkit.ai/) 是一个专为 React（目前也支持 Angular 等）应用设计的开源框架，它的核心目标是**让 AI Agent 与应用的前端状态实现双向交互**。

它不只是给你一个漂亮的聊天气泡 UI（虽然它确实提供了），更重要的是它提供了一套 Hooks，让 LLM（大语言模型）能够：
1.  **"看到"（See）**：实时读取你的应用状态（比如当前的列表数据、用户信息、选中的 Tab）。
2.  **"行动"（Act）**：调用你前端定义的函数来修改状态（比如添加一条待办、跳转页面、更新配置）。

如果说传统的 Chatbot 是一个通过电话线指挥你的远程顾问，那么集成了 CopilotKit 的应用就像是坐在你旁边的老司机，它看得到你的屏幕，甚至能帮你握鼠标。

## 核心特性深度解析

在深入代码之前，我想先聊聊它最打动我的几个设计点。

### 1. `useCopilotReadable`：让 AI 戴上眼镜

这是我最喜欢的一个 Hook。在以往，要把网页内容传给 AI，我们通常需要手动抓取 DOM 或者把整个 JSON 丢给它，既麻烦又容易超长。

CopilotKit 引入了 `useCopilotReadable`。你只需要在你的 React 组件里用这个 Hook 声明一下："嘿，这个变量是用来存员工列表的"。

```javascript
useCopilotReadable({
  description: "当前展示的员工列表",
  value: employees, // 你的 state 变量
});
```

神奇的地方在于，这个上下文是**随着组件渲染树动态变化**的。当你进入详情页，详情页的 `useCopilotReadable` 生效，AI 就自动关注到了详情数据；当你退回列表页，上下文又切回了列表。这种符合 React 直觉的上下文管理，极大地降低了开发心智负担。

### 2. `useCopilotAction`：把 AI 变成操作员

光"看"不练假把式。CopilotKit 允许我们定义"前端工具"（Frontend Tools）。

你可以定义一个名为 `addTodo` 的动作，告诉 AI 它需要什么参数（比如任务名称）。当用户在聊天框说"帮我加个买牛奶的任务"时，AI 会解析意图，自动调用你写好的 `handler` 函数，直接修改你的 React State。

这实际上是在前端实现了类似 OpenAI Function Calling 的能力，但完全贴合了前端的事件循环。

### 3. Generative UI：不仅仅是文字

这是 CopilotKit 最"炫"的功能。通常 AI 回复只能是 Markdown 文本，但 CopilotKit 支持 **Generative UI**。

比如你让 AI "帮我生成一个营销活动的配置表单"，它不仅仅是列出字段，而是可以在聊天窗口里直接渲染出一个你可以点击、输入、交互的 React 组件。这意味着 AI 的输出可以是完全结构化、可视化的界面。

### 4. CoAgents：连接 LangGraph 的桥梁

如果你的业务逻辑非常复杂，需要在后端运行复杂的 Agent 流程（比如使用 LangGraph），CopilotKit 提供了 `useCoAgent`。它能让前端状态和后端的 Agent 状态实时同步。这意味着你可以把复杂的推理逻辑放在后端，而让前端专注于展示和简单的交互，两者通过 CopilotKit 无缝连接。

## 动手实践：给 ToDo 应用装个"大脑"

光说不练假把式。我们来模拟一个场景：在一个简单的待办事项应用中集成 CopilotKit。

### 第一步：安装与包裹

首先，我们需要安装核心库和 UI 库：

```bash
npm install @copilotkit/react-core @copilotkit/react-ui
```

然后，在应用的根目录下包裹 `CopilotKit` Provider。你需要配置一个后端端点（用于转发请求给 OpenAI 等模型，CopilotKit 提供了简单的 Runtime）。

```jsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <YourAppContent />
      {/* 直接使用官方提供的侧边栏 UI */}
      <CopilotSidebar 
        defaultOpen={true} 
        labels={{
            title: "我的 AI 助手",
            initial: "你好！我是你的任务管理助手，有什么可以帮你？"
        }}
      />
    </CopilotKit>
  );
}
```

### 第二步：提供上下文

在你的任务列表组件里，告诉 AI 当前有哪些任务：

```jsx
import { useCopilotReadable } from "@copilotkit/react-core";

function TaskList({ tasks }) {
  // 让 AI 实时感知当前的任务数据
  useCopilotReadable({
    description: "用户的待办事项列表状态",
    value: tasks,
  });

  return (
    // ... 你的渲染逻辑
  );
}
```

### 第三步：赋予行动能力

现在，让 AI 能够帮你添加任务。我们在同一个组件里加上 `useCopilotAction`：

```jsx
import { useCopilotAction } from "@copilotkit/react-core";

// ... Inside component
useCopilotAction({
  name: "addTask",
  description: "添加一个新的待办事项",
  parameters: [
    {
      name: "title",
      type: "string",
      description: "任务的标题",
      required: true,
    },
  ],
  handler: async ({ title }) => {
    // 调用你原本的添加任务逻辑
    addTask(title);
    return "任务已添加！";
  },
});
```

这就完事了！

现在，当你启动应用，在侧边栏输入："我明天要去超市买鸡蛋，帮我记一下。"

发生了什么？
1. CopilotKit 把用户的自然语言发给 LLM。
2. LLM 分析上下文，发现有一个 `addTask` 的工具。
3. LLM 提取出参数 `title: "去超市买鸡蛋"`。
4. CopilotKit 自动调用你的 `handler`。
5. 你的 React State 更新，界面上立马多了一条任务。

整个过程非常流畅，用户甚至不需要知道你在背后用了什么模型。

## 总结与思考

在使用 CopilotKit 的这段时间里，我最大的感受是：**它降低了"AI 原生应用"的门槛。**

以前我们要实现这种体验，需要自己处理 Prompt Engineering、维护上下文窗口、处理流式传输、编写复杂的 Function Calling 逻辑。而 CopilotKit 把这些脏活累活都封装在了几个简单的 Hooks 里。

当然，它也不是完美的。目前它的文档虽然丰富但在某些高级用法（如自定义 LLM 适配器）上还略显简略；而且引入这样一个 Runtime 层，对应用的性能影响也需要根据具体场景去评估。

但我认为，对于大多数想要快速给自己的 SaaS 或内部工具加上"AI 能力"的开发者来说，CopilotKit 是目前性价比最高的选择之一。它没有让你去重构整个应用，而是以"插件"的形式，渐进式地增强你的应用。

如果你也在做 React 开发，不妨花半小时试一试。或许，这就是你的应用从"功能型"迈向"智能型"的第一步。


**参考资料：**
- [CopilotKit 官方文档](https://docs.copilotkit.ai/)
- [CopilotKit GitHub 仓库](https://github.com/CopilotKit/CopilotKit)
