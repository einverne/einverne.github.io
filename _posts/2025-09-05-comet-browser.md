---
layout: post
title: "AI 浏览器 Comet 初体验"
aliases:
- "AI 浏览器 Comet 初体验"
tagline: ""
description: ""
category: 产品体验
tags: [browser, dia, comet, perplexity, perplexity-ai, google-chrome, chrome, ]
create_time: 2025-09-06 21:43:36
last_updated: 2025-09-06 21:43:36
dg-home: false
dg-publish: false
---

前两天刚介绍完 Dia 浏览器，就听说了 Dia 浏览器的母公司 The Browser Company 被 Atlanssian 以 6.1 亿美元现金收购，而另外一边，Google 的反垄断案也告一段落，不需要拆分 Chrome 和 Android，这边，Perplexity 就推出了以 Perplexity AI 为核心的网页浏览器 Comet。

而就在前段时间，市值只有 140 亿美元的 Perplexity 还提议以 345 亿美元收购谷歌旗下的 Chrome，当然，站在现在的角度来看，这不失为一个非常精妙的营销活动。在 Google 反垄断案的最终阶段，Perplexity 没有花一分钱，就让自己的公司名曝光在了各大媒体的新闻面前。

我们知道，在 AIGC 的时代，Google 的搜索面临着非常大的挑战。而现在，Perplexity、ChatGPT、Claude（Anthropic）等纷纷去抢占用户的搜索入口，Google 虽然坐拥着 Chrome 和 Android 的两大平台（桌面和移动端），但是在这两年却一直缓步前行，虽然也在 Chrome 里面新增了很多功能，比如说内置的 Google Lens 图片搜索，以及在 Chrome 138 版本之后集成的小模型 Gemini Nano，可以直接在本地实现部分的 AI 功能，比如内容生成、文本分析等。但是，这些绝大部分的都没有落地成为真正的 Chrome 的功能。 反而是一些 Chrome 上的插件 [Monica](https://gtk.pw/monica)，[[Harpa AI]] 有着非常惊艳的功能，可以实现非常智能的浏览器自动化，更甚至，Claude 在最近也推出了 Chrome 浏览器插件。 我还没有拿到 Claude 浏览器插件的试用体验，那我们今天就先来介绍一下 Comet。

[YouTube](https://youtu.be/AUbWoh8CBtk)

## Comet 是什么

Comet 是 Perplexity 在 2025 年 7 月份推出的 AI 驱动的网页浏览器。在 Comet 发布之前，全球浏览器市场的格局已经相对稳定很多年。 Google Chrome 以 68%的市场份额牢牢占据了主导地位，远超 Apple Safari 的 18%和微软 Edge 的 5%。 并且 Chrome 给 Google 的营收贡献了非常大的一部分。

而现在，浏览器的市场正在经历从工具转向 AI agent 的转变。原生的跳跃 AI 技术已经从 L1 阶段的聊天机器人发展到了具备自主任务执行能力的智能体时代。 AI 技术的发展推动了浏览器从传统的信息展示工具升级，成为了在网页浏览器上构建的全新 AI 环境。我们可以在浏览器当中，从主动获取转变为由 AI 来帮忙执行。

从技术架构上，Comet 浏览器基于 Google 开源的 Chromium 内核，确保了它和 Chrome 的扩展程序有良好的兼容性。但在此基础上，Comet 构建了一套全新的 AI 驱动的模式，和 Dia 浏览器一样，Comet 也有一个右侧侧边栏，叫做 Comet Assistant。 这一个助手，可以同时读取并理解用户在多个标签页中的内容，包括网页文章、PDF 文档、YouTube 视频字幕，甚至是论坛讨论帖。 Commit Assistant 不仅能够理解信息，还能够根据用户的指令直接执行任务，包括自动填写表单、预定会议、发送电子邮件、管理日程等。

传统的浏览器，用户需要通过点击和导航来获取信息，而 Comet 则真正实现了对话式的浏览。用户可以直接询问并执行相应的任务。

## Comet 功能

### 网页内容理解和总结

因为 Comet 借助了 Perplexity 的能力，而 Perplexity 又集成了各大 AI 模型，所以在页面理解的能力上面非常厉害。而我们在平时使用 Perplexity 的时候，也可以惊讶地发现，Perplexity 可以帮我们检索数十个网页，然后给我们最终返回结果。 这个能力在 Comet 当中也非常容易实现。

### 代理执行和任务自动化

Command Assistant 不仅能够理解网页信息，还能够根据用户的指令直接执行任务。

代理能力包括了自动填写表单、预定会议、发送电子邮件、管理日历日程、执行复杂的多步骤购物流程等。 比如说，我就可以让 Comet 帮我总结我之前浏览过的相关网页，并总结一些推文，帮我自动填写到 X 的发布框当中。 我也可以让 Comet 帮我总结网页信息，编写成邮件。

### 深度整合 Google

与 Gmail 和 Google 日历无缝联动，可以自动生成邮件摘要，安排日程并同步提醒。

### 语音指令

Comet 支持了内置的语音识别功能。用户在不用双手的情况下，在多任务场景下也可以精准地执行指令。

## 缺点

### AI 幻觉

因为 Comet 的搜索是基于 Perplexity，而 AI 是会产生幻觉的，而 Comet 基于的 AI 代理在处理复杂任务的时候，仍然可能会出现错误。而另外就是 Perplexity 是引用的网页内容。  
而网页当中的内容参差不齐。 极有可能网页当中原始的文本就存在错误。 也需要我们自己小心甄别。

### 隐私担忧

我们都知道，Perplexity 都是调用大语言模型去帮我们处理一些任务的。而我们的浏览器当中，集中了我们个人隐私的绝大部分，包括了邮箱、个人信息、通讯录等等，虽然我们可能知道 Perplexity 并没有存储用户的个人信息，但是如果我们页面当中包含了一些敏感信息，极有可能通过 Perplexity 以及大语言模型的调用而泄露。
