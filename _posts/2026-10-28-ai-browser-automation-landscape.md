---
layout: post
title: "AI 浏览器自动化方案怎么选：从 Playwright、MCP 到 Agent 浏览器和 WebMCP 的全景梳理"
aliases: ["AI 浏览器自动化方案怎么选：从 Playwright、MCP 到 Agent 浏览器和 WebMCP 的全景梳理"]
tagline: "十条路线、三个问题，以及我对 Agent 使用浏览器这件事的几个判断"
description: "梳理 2026 年 AI 浏览器自动化的主流路线：传统脚本、CDP 加 MCP 或 CLI、浏览器插件、Agent 专用浏览器、内置 Agent 的 AI 浏览器、自主 Agent 框架、云端浏览器、数据采集、Computer Use 和 WebMCP，用谁在指挥、用哪个浏览器、AI 怎么看网页三个问题重新归类，并分享选型建议、安全风险和我的判断。"
category: 整理合集
tags: [ai-agent, browser-automation, playwright, mcp, webmcp, ego-lite, browseros, browser-use, stagehand, claude-code, prompt-injection, gemini-in-chrome, cebian]
create_time: 2026-10-28 10:00:00
last_updated: 2026-10-29 15:51:32
---

最近我一直在研究「让 AI 用浏览器」这件事。起因是看到 Nowledge 写了一个 browse-now Skill，可以直接让 Claude 控制浏览器，紧接着又偶然发现了 [[Ego Lite]] 这款专门为 Agent 设计的浏览器。顺着这条线，我把 [Aside](https://myaltbox.com/en/BDOqQbPjJlW-aside)、[BrowserOS](https://myaltbox.com/en/i2lSjZzI1lp-browseros-neo)、[Deta Surf](https://myaltbox.com/en/HmB2LwcVzZq-deta-surf) 这几款 AI 浏览器挨个调研了一遍，越看越发现它们的侧重点和实现方式差别很大：有人在做测试框架，有人在做浏览器插件，有人从 Chromium 内核开始为 Agent 改造浏览器，还有人在推动新的 Web 标准。它们看起来都在「让 AI 操作网页」，解决的却根本不是同一个问题。

![AI 浏览器自动化的多条路线汇聚到浏览器](https://pic.einverne.info/images/2026-10-28-09-51-45-ai-browser-automation-routes.png)

这篇文章是我这一轮调研的阶段性总结。截至 2026 年 10 月，让 AI 操作浏览器的方案大致可以分成十条路线：传统脚本、CDP 加 MCP 或 CLI、浏览器插件、Agent 专用浏览器、内置 Agent 的 AI 浏览器、自主 Agent 框架、云端浏览器、数据采集、Computer Use 和 WebMCP。文章会先逐条介绍每条路线里的典型方案，再用三个问题把它们放在一起比较，最后分享我的判断和选型建议。

## 结论

如果你没时间看完全文，可以先看这几条：

- 没有「最好的那一个」。这些工具解决的问题不一样，有的负责给 AI 出主意，有的负责提供浏览器，有的负责在云端批量跑，很多时候是搭配着用，而不是二选一
- 能不让 AI 看网页，就别让它看。AI 每看一次页面都要花钱、花时间，还可能看错。网站有现成接口就用接口，流程固定就写脚本，只有遇到陌生的页面才让 AI 自己去点
- AI 适合探路，不适合天天跑同一条路。现在的普遍做法是先让 AI 把流程跑通一遍，再把它变成固定的脚本，以后重复执行就不用让 AI 一步步琢磨了
- 争论 MCP 好还是命令行好意义不大。真正影响速度和费用的，是工具每一步塞给 AI 多少页面内容，以及能不能一次做完好几步
- 让 AI 用你已经登录好的账号，最方便也最危险。一封藏着恶意指令的邮件，就可能让 AI 把你的数据发出去。最简单的保护办法是给 AI 单独开一个浏览器 Profile，只登录它需要的网站，付款、发消息之前必须由你确认
- 普通人不会为了 AI 换浏览器。OpenAI 的 Atlas 不到一年就关停了，Google 也选择把 Gemini 直接放进 Chrome。真正在快速增长的，是开发者给自己的 AI 助手配的专用浏览器

## 为什么大家都在抢浏览器入口

在现实世界里，API 能覆盖的只是很小一部分，即使加上 MCP，Agent 能访问和操作的数据也很有限，大量 SaaS 后台、内部系统、需要登录才能看的页面都没有开放接口，浏览器是 Agent 能接触这些系统的唯一入口。对开发者来说需求更直接，Claude Code 写完的前端页面，总得在真实浏览器里点一点、看一眼控制台，才知道到底对不对。

2026 年这个领域变化非常快，几乎每个月都有重量级的产品发布或者转向。我按时间简单列几个节点，你就能感受到这股热度：

- 1 月，Vercel Labs 开源 [[agent-browser]]，到现在已经有 4.5 万 Star；Google 把 Gemini 做成 Chrome 的常驻侧边栏，并推出基于 Gemini 3 的 auto browse
- 3 月，个人开发者 jackwener 开源 [[OpenCLI]]，把网站封装成命令行工具，现在 3 万多 Star
- 4 月，Cloudflare 把 Browser Rendering 改名为 [[Cloudflare Browser Run]]；Codex 桌面版加入内置浏览器和后台电脑操作；Ego Lite 和 Browser Use 团队的 [[Browser Harness]] 先后开源
- 5 月，OpenAI 推出 Codex for Chrome 扩展，Moonshot 推出 Kimi WebBridge，Chrome 发布 [[WebMCP]] 开发文档，随后在 Chrome 149 开启 Origin Trial
- 6 月，YC F25 的 Aside 发布
- 7 月，OpenAI 发布合并了 Codex 的 ChatGPT 桌面 App 和新的 [[ChatGPT Chrome Extension]]，同时宣布弃用 Atlas，8 月 9 日 Atlas 正式关停
- 8 月，Zenity 在 Black Hat 上演示了针对 Claude in Chrome、Gemini in Chrome、Comet、Atlas 和 Copilot Edge 的零点击劫持
- 9 月，Browser Use 和 TypeSafe 开源 [[Jev Ultrafast]]，6 周拿到 2.4 万 Star
- 10 月，[[Playwright]] 1.64 加入 `page.webmcp`

一年前大家讨论的还是「给人用的 AI 浏览器」，比如我写过的 [AI 浏览器 Comet 初体验](https://blog.einverne.info/post/2025/09/comet-browser.html) 和 [Dia 浏览器初体验](https://blog.einverne.info/post/2025/08/dia-browser.html)；到了 2026 年，增长最快的反而是「给 AI 用的浏览器」，主角从人换成了 Agent。大厂在收缩自己的独立浏览器，开源社区却在疯狂地给 Agent 造浏览器。

## 十条路线逐一看

下面按开头的分类逐条来看。每条路线先列出几个典型方案，让你知道它们大概是做什么的，再聊这条路线的特点和我的看法。其中「内置 Agent 的 AI 浏览器」和「Computer Use」在很多梳理里会被漏掉，但前者是普通用户最先接触到的形态，后者是所有基于网页代码的方案都失效时的最后兜底，所以我也把它们放了进来。

### 传统脚本：最成熟稳定，也是一切的地基

典型方案：

- [[Playwright]]：微软出品，支持 Chromium、Firefox 和 WebKit，现在还内置了测试 Agent、MCP 和命令行工具
- [[Puppeteer]]：Google 维护的 Node.js 库，主要用来控制 Chrome，Chrome DevTools MCP 的底层就是它
- [[Selenium]]：历史最久的浏览器自动化工具，支持多种编程语言和浏览器，企业测试里用得最多

[[Playwright]]、[[Puppeteer]]、[[Selenium]] 最成熟，控制精准、可测试、可复现。只要业务路径是确定的，脚本的单步操作是毫秒级，运行时不消耗任何 Token，永远比让大模型每走一步想一次更快更便宜。当然「零 Token」只在运行时成立，现在越来越多的脚本本身就是 AI 写的。

更有意思的是，这几个老牌工具都在主动拥抱 Agent。Playwright 从 1.56 开始内置 Planner、Generator、Healer 三个测试 Agent，1.62 把 MCP 和 playwright-cli 直接打包进来，10 月 14 日发布的 1.64 甚至加了 `page.webmcp`。Puppeteer 在 Firefox 上默认改用 WebDriver BiDi，Google 的 Chrome DevTools MCP 底层用的就是它。Selenium 官方博客在 9 月专门写了一篇文章，承认现在大量 Selenium 代码是编程 Agent 写的，而且总在同样几个地方出错，文档里也新增了配合 AI 编程 Agent 使用的章节。传统脚本不是 AI 的对立面，而是 AI 探索之后的「编译产物」，后面几乎所有 AI 方案的底层都还是它们。

### CDP 加 MCP 或 CLI：接入最快，Token 最难控

典型方案：

- [[Chrome DevTools MCP]]：Google Chrome DevTools 团队出品，擅长网络请求、控制台和性能调试
- [[Playwright MCP]] 和 playwright-cli：微软出品，前者给支持 MCP 的 AI 工具用，后者给编程 Agent 用，更省 Token
- [[agent-browser]]：Vercel Labs 用 Rust 写的命令行工具，主打返回给 AI 的页面信息足够精简
- [[Browser Harness]]：Browser Use 团队出品，直接连上你正在用的 Chrome，让 Agent 边干活边给自己写工具函数

这条路线的逻辑是借力打力，把现成浏览器的调试和控制能力包装成 Agent 能调用的接口。[[Chrome DevTools MCP]] 是 Google Chrome DevTools 团队做的，强项是网络、控制台和性能调试，全量大约 60 个工具，也提供只保留 3 个工具的 `--slim` 模式和 `chrome-devtools` 命令行。[[Playwright MCP]] 依靠无障碍树快照操作页面，但微软自己又推出了 playwright-cli：给编程 Agent 用的话，CLI 加 Skill 更省 Token，因为它不会把页面数据强行塞进模型上下文。[[agent-browser]] 是 Vercel Labs 用 Rust 写的 CLI 加常驻守护进程，直连 CDP，快照用 `@e1` 这样的引用标记元素，官方说一次快照只有 200 到 400 个 Token。[[Browser Harness]] 来自 Browser Use 团队，MIT 协议，通过 CDP 连接你正在运行的、已登录的 Chrome，特别之处是让 Agent 在任务中自己编写辅助函数。

关于 Token 消耗，各家都有数字，但都很乱。agent-browser 宣称比 Playwright MCP 少用 93% 的上下文，却没给出原始计数，第三方测出来有 82% 的，也有整个任务只少 37% 的；还有人重测发现 Playwright MCP 和 CLI 单步消耗几乎一样。相对完整的是 Browser Use 在 10 月 14 日做的一次评测：100 个任务，用 Codex 驱动云端浏览器，输入 Token 中位数分别是 Browser Harness 210 万、agent-browser 330 万、Playwright MCP 440 万、Chrome DevTools MCP 670 万，而成功率的差异在统计上并不显著。这是 Browser Use 自家的评测，要打个折扣看，但方向和我的体感一致：能力差不多，差别主要在每一步往上下文里塞了多少东西。我之前写过一篇 [给 MCP 工具描述瘦身 减少 AI 上下文消耗的实践](https://blog.einverne.info/post/2026/07/optimize-mcp-tool-descriptions-reduce-context.html)，浏览器场景是这个问题最严重的地方。

从 Chrome 144 开始，在 Chrome 里打开远程调试开关、点一下允许，外部工具就能连接你正在用的浏览器，Chrome DevTools MCP 的 `--autoConnect` 和 Browser Harness 都依赖这个能力。在提供了巨大方便的同时，我们也得注意，因为授权的范围是整个浏览器的 profile，所以特别需要注意安全问题。

### 浏览器插件：借用你的日常 Chrome

典型方案：

- [[Claude in Chrome]]：Anthropic 官方扩展，Claude Code 也能通过它操作你的 Chrome
- [[ChatGPT Chrome Extension]]：OpenAI 官方扩展，前身是 Codex for Chrome，只给 ChatGPT 和 Codex 自己用
- [[Kimi Browser Extension]]：Moonshot 出品，可以把你的 Chrome 交给 Claude Code、Codex 这类外部 Agent
- [[OpenCLI]]：开源项目，把 170 多个网站封装成命令行工具，复用你已登录的 Chrome
- [[Nanobrowser]]、[[Cebian]]：开源的纯扩展 Agent，填上自己的 API Key 就能用

浏览器插件的思路很聪明：日常 Chrome 早就登录好了各种网站，何必再开一个沙箱重新登录？三家大模型厂商都选了这条路。[[Claude in Chrome]] 从 2025 年 8 月发布预览版，12 月向所有付费计划开放，可以用 `claude --chrome` 让 Claude Code 通过 Native Messaging 操作你的 Chrome。OpenAI 在 2026 年 5 月推出 Codex for Chrome，7 月合并成新的 ChatGPT Chrome 扩展，同样通过桌面 App 的 Native Messaging 连接，但只给 ChatGPT 和 Codex 自己用。Moonshot 的 [[Kimi Browser Extension]] 原名 Kimi WebBridge，是扩展加本地服务的结构，走 CDP，可以把你的 Chrome 交给 Claude Code、Codex 这些外部 Agent，9 月改名后还加了操作录制，录下来可以存成 Skill 重放。Google 是个例外，它不需要做扩展，Gemini 直接集成在 Chrome 里，后面讲内置 Agent 的浏览器时再单独说。

开源项目里，[[OpenCLI]] 确实值得特别留意。它是扩展加本地 daemon，复用你已登录的 Chrome，已经有 170 多个站点适配器，比如 B 站、知乎、小红书、Twitter、Reddit。每个适配器会声明认证策略（公开、Cookie、拦截网络请求、操作界面、本地），作者写适配器时的推荐顺序是先看网络请求，再看页面初始状态，然后搜索前端 bundle，最后才用拦截器。仓库里还带了专门写适配器、自动修复失效适配器的 Skill。这意味着 Agent 不必每次重新「看」页面，而是直接调用沉淀好的网站能力。需要说明的是，「优先读网络请求」是写适配器的推荐路径，并不是所有命令都这样，界面操作类的命令仍然是在点击和输入。

[[Nanobrowser]] 是纯浏览器扩展，没有本地 Bridge，模型请求由扩展直接发出；10 月 15 日发布的 v0.3.0 已经用单一 Agent 取代了旧的 Planner 和 Navigator，网上很多介绍还停留在旧架构。

同样是纯扩展路线的还有 [[Cebian]]，作者是国内开发者猫头猫（maotoumao），名字就是「侧边」的拼音。它是一个住在浏览器侧边栏里的 Agent，不需要注册账号，也没有后端服务器，填入 OpenAI、Anthropic、Google、DeepSeek 或任何 OpenAI 兼容接口的 API Key 就能用，对话和文件都留在本地浏览器里，只有你发出的消息会直接发给你选的模型服务商。能力上，它可以读取当前页面、把选中的元素或截图作为上下文，也能点击按钮、填写表单、操作标签页；还能把一遍浏览器操作录下来让 Agent 自动重放，适合定期重复的任务。扩展该有的周边也比较齐全：内置 MCP 客户端可以接入外部工具，支持 Skills，跨对话的记忆以本地 Markdown 文件保存，默认关闭。项目 2026 年 4 月开源，AGPL-3.0 协议，支持 Chrome、Edge 和 Firefox，10 月 24 日发布了 v1.8.2。它目前还很小众，更适合自己在侧边栏里用；但如果你想要一个开源、自带 Key、不绑定任何厂商的侧边栏 Agent，它值得一试。

这类插件的短板也很明显：扩展权限很大，Claude in Chrome 的 service worker 空闲后会断连，没有无头模式，不适合高并发和长期无人值守。最重要的一条是，它们操作的是你最核心的那个浏览器 Profile，安全风险最高。

### Agent 专用浏览器：从内核开始为 Agent 设计

典型方案：

- [[Ego Lite]]：每个 Agent 有自己独立的空间，在后台并行干活，不和你抢标签页和鼠标
- [[BrowserOS]] neo：完全开源，通过 MCP 接入 Claude Code、Codex、Cursor，每次会话都能回放

这类产品不满足于给 Chrome 套插件，而是直接改 Chromium，做一个面向 Agent 的运行时。Ego Lite 的设计包括：每个 Agent 一个独立的 Space，你在前台浏览，Agent 在后台并行工作，互不抢标签页和鼠标；在浏览器引擎内部生成页面快照，能处理跨域 iframe 和 Shadow DOM；Agent 不是一条条调命令，而是写一段 JavaScript，由 `ego-browser nodejs` 一次执行多个步骤。常见的「内嵌 Node.js」说法不太准确，实际上是 App 打包了一个 Node 运行时，脚本跑在 Node 里而不是页面里。开源策略上，浏览器本体闭源，harness 和 Skill 用 MIT 协议开源。

[[BrowserOS]] neo 则是 YC S24 团队 Felafax 做的，Chromium 补丁都以 AGPL 开源。它走标准 MCP，本地端点是 `127.0.0.1:9200/mcp`，能一键写入 Claude Code、Codex、Cursor 等工具的配置；每个 Agent 的标签放进一个彩色标签组，每个会话都录成可回放的 DOM 录像，存在本地。两者的哲学差别很有意思：Ego Lite 希望你和 Agent 共用一个浏览器，neo 明确说自己「不是 Chrome 的替代品」，而是放在 Chrome 旁边的第二个浏览器。

这两个产品让我确信一件事：隔离、可观测性、快照质量这几件事，靠插件很难做好，必须在浏览器层面原生支持。Ego Lite 自测的 Real-World Bench（31 个任务）里，它平均 398 秒、成功率 93.5%、每任务 1.64 美元，Browser Harness 是 615 秒和 77.4%。这同样是自测数据，但说明在同一个 Agent、同一个模型下，换一个浏览器工具层，效率差距可以非常大。

### 内置 Agent 的 AI 浏览器：独立产品在退潮，Chrome 亲自下场

典型方案：

- [[Aside]]：YC 孵化，能直接在你已登录的网站里干活，还有一个专为 Agent 设计的密码管理器
- [[Comet]]：Perplexity 出品，以 AI 搜索为核心
- [[Dia Browser]]：Arc 浏览器团队出品，偏向围绕网页对话和辅助写作
- BrowserOS：开源浏览器，除了给外部 Agent 用的 neo，本身也内置了 Agent
- [[Gemini in Chrome]]：Google 直接集成在 Chrome 里，不用换浏览器
- ChatGPT Atlas：OpenAI 出品，已于 2026 年 8 月关停

这是普通用户最先接触到的形态：浏览器自带一个 Agent，你在侧边栏或地址栏里下指令。Aside、[[Comet]]、[[Dia Browser]]、BrowserOS 都属于这一类。最值得一提的是 Aside 的 Aside Vault，它把「Agent 能登录」和「Agent 能看到密码」拆开了：凭据直接自动填进网页，模型拿不到明文，还有按任务的访问策略和审计日志，这是我在这一轮调研中见到的最用心的安全设计。Aside 还宣称在 Online-Mind2Web 上拿到了 99.0% 的成绩，不过是自测自评。它同时提供 CLI 和 MCP，也能给 Claude Code 当浏览器后端，详细介绍可以看我单独写的 [Aside AI 浏览器介绍](https://blog.einverne.info/post/2026/10/aside-ai-browser.html)。

还有一个特殊的成员是 Google 的 [[Gemini in Chrome]]。Google 不需要说服任何人换浏览器，它直接把 Gemini 集成进了 Chrome 本身。2026 年 1 月 28 日，Gemini 从原来的浮动窗口变成常驻右侧的侧边栏，同时推出基于 Gemini 3 的 auto browse，可以替你滚动、点击、输入，完成多日期比价、填写表单、收集报税文件这类多步骤的杂事。获得你的授权后，它能调用 Google 密码管理器处理需要登录的任务，还能连接 Gmail、日历、地图、Google Flights 这些 Google 自家应用；遇到购买、发帖这类操作，它会停下来让你确认，或者让你自己完成最后一步。目前 auto browse 只在美国以预览形式向 Google AI Pro 和 Ultra 订阅用户开放，5 月宣布登陆 Android 版 Chrome，I/O 2026 上又宣布要和 Gemini Spark 打通。它和浏览器插件最大的区别是不需要安装任何东西，Agent 就是浏览器本身的一部分。

但独立的 AI 浏览器这条路正在退潮。ChatGPT Atlas 从 2025 年 10 月 21 日发布到 2026 年 8 月 9 日关停，只活了 292 天，始终只有 macOS 版本，它的能力被拆进了 ChatGPT 桌面 App 的内置浏览器和 Chrome 扩展里。我的理解是，让用户为了 AI 换掉日常浏览器的成本太高了。OpenAI 退回到「扩展加桌面 App」，Google 则把 Agent 直接塞进了用户最多的浏览器，两家走的路不同，结论却一样：Agent 应该去用户已经在的地方，而不是让用户为它搬家。

顺带一提 Deta Surf，它是这一组里的反例：内置了浏览器，但 AI 只读不动手，把网页、PDF、YouTube 收进本地资料库，生成带引用的笔记，更像一个本地版的 [[NotebookLM]]。它提醒我，不是所有「AI 加浏览器」的需求都应该用 Agent 来解决。

### 自主 Agent 框架：从全自主走向混合

典型方案：

- [[browser-use]]：最有名的开源自主 Agent 框架，给它一个目标，AI 自己一步步探索完成
- [[Stagehand]]：Browserbase 出品，已知的步骤写代码，不确定的部分交给 AI
- [[Skyvern]]：面向企业流程，靠看截图理解页面
- [[Jev Ultrafast]]：Browser Use 和 TypeSafe 的实验项目，把 AI 能做的操作压缩到 8 种，追求极致速度

[[browser-use]] 是端到端自主探索的代表，适应性强，但在复杂长链路任务里 Token 开销大、结果有波动。[[Stagehand]] 是 Browserbase 做的混合框架，已知步骤写代码，未知节点交给 `act`、`extract`、`observe` 这几个 AI 原语。它在 2025 年的 v3 就去掉了内置的 Playwright 依赖，改为直接走 CDP；2026 年 8 月 10 日发布的 v4 又重写了一次，不再需要任何外部驱动，把 CDP 调度放进浏览器扩展里，只支持 Chromium；`agent()` 被移除；缓存改成在 Browserbase 云端进行，用本地浏览器时没有缓存。[[Skyvern]] 偏企业级流程，用多模态模型看带标注的截图，拆成 Actor、Planner、Validator 三个角色，Skyvern 2.0 在 WebVoyager 上的成绩是 85.85%，协议是 AGPL-3.0。

[[Jev Ultrafast]] 是 Browser Use 和 TypeSafe 在 9 月开源的实验项目，把每个页面变成一张编号的元素表，只允许 8 种操作（点击、输入、选择、上下滚动、等待、完成、受阻），一次请求同时选操作和目标。README 里的例子是在 Google Flights 上查苏黎世到伦敦的航班，用时 7.1 秒，浏览器协议调用从 1092 次降到 101 次。代价是不支持 Shadow DOM、iframe、Canvas、文件上传和弹出新标签，而且依赖 TypeSafe 的专有决策模型 [[Jev]] 和 API Key。

这类框架最值得关注的是方向上的变化。Stagehand 删掉了 `agent()`，Skyvern 把成功的运行转成 Playwright 脚本缓存起来，下次直接重放、坏了再让 AI 重新生成，官方称能快 3 到 5 倍、便宜最多 70%。就连 Browser Use 自己，也在全自主框架之外又押了两个注：让编程 Agent 自己写辅助函数的 Browser Harness，以及极致压缩动作空间的 Jev Ultrafast。这些框架都在远离「每一步都让大模型想一想」。

### 云端浏览器：规模化之后的真问题

典型方案：

- [[Browserbase]]：全托管的云端浏览器服务，起步最早，功能也最完整
- [[Steel]]：开源，可以用 Docker 自己部署
- [[Cloudflare Browser Run]]：Cloudflare 出品，按小时计费，几家里价格最低

当任务从一台电脑走向服务器批量运行，问题就变成了并发调度、资源隔离、会话持久化、代理轮换、反爬和故障恢复。[[Browserbase]] 是全托管的代表，2025 年 6 月完成 4000 万美元 B 轮，估值 3 亿美元，开发者套餐每月 20 美元，包含 25 个并发浏览器和 100 小时，Contexts 可以持久化 Cookie 和本地存储，还有 Live View 和会话回放。[[Steel]] 用 Apache-2.0 开源，一条 `docker run` 就能自托管，云服务大约每浏览器小时 0.10 美元。Cloudflare Browser Run 在 4 月改名时加了公开的 CDP 端点、Live View、人工接管和录像，付费计划含每月 10 小时，超出后每小时 0.09 美元，是这几家里最便宜的。

不少介绍说 Cloudflare Browser Run「兼容 Stagehand」，这一点要打个问号：Cloudflare 文档里的示例还是 v2 风格，而 Stagehand 从 v3 开始不再基于 Playwright，在 Workers 里运行新版本的兼容问题还有 issue 在跟踪，从 Workers 外部通过 CDP 连接问题不大。另一个现实问题是数据中心 IP，X、LinkedIn 这类网站会直接把你当机器人拦下，需要登录态的个人任务放在云端很痛苦。Cloudflare 的 `/crawl` 是一个用 Web Bot Auth 签名的 Agent，遵守 robots.txt，不绕过机器人防护，我觉得这代表了另一种未来：网站不再和 Agent 斗智斗勇，而是识别它、给它放行或限流。

### 数据采集：能抓就别点

典型方案：

- [[Crawl4AI]]：开源爬虫，能把网页转成干净的 Markdown，可以自己部署
- [[Firecrawl]]：托管的网页抓取 API，也有开源版本
- [[Jina Reader]]：在网址前面加一个前缀，就能拿到这个页面的 Markdown 版本

如果目标只是把公开网页变成干净的 Markdown 或 JSON，完全没必要让 Agent 模拟点击。[[Crawl4AI]] 现在有 8.6 万 Star，Apache-2.0 协议，提供去噪后的 Fit Markdown、不调用 LLM 的 CSS/XPath 抽取、LLM 抽取和自适应爬取，Docker 服务自带 MCP。[[Firecrawl]] 是托管 API 路线（开源部分为 AGPL），我之前写过 [FireCrawl 强大的数据爬虫工具](https://blog.einverne.info/post/2024/08/firecrawl.html)。单页阅读的话 [[Jina Reader]] 最省事。我自己在 Claude Code 里做调研，读资料基本都走这类工具，只有遇到强交互或者需要登录的页面，才会动用浏览器 Agent。

### Computer Use：最通用也最昂贵的兜底

典型方案：

- Claude computer use：Anthropic 在 2024 年 10 月推出
- Gemini Computer Use：Google 在 2025 年 10 月发布预览
- Codex 后台电脑操作：OpenAI 在 2026 年 4 月加入 Codex 桌面版

这条路线不看 DOM，直接看屏幕截图，用坐标点击和键盘输入。Anthropic 在 2024 年 10 月推出 computer use，Google 在 2025 年 10 月发布 Gemini 2.5 Computer Use 预览，OpenAI 在 2026 年 4 月给 Codex 桌面版加入了后台电脑操作，可以用自己的光标操作 Mac 上的应用。它的优势是通用，Canvas 页面、桌面应用、远程桌面都能处理；劣势是每一步都要传截图，慢且贵。2026 年 6 月发布的 OSWorld 2.0 把任务换成跨网站和桌面应用的长流程之后，论文发布时最好的模型也只能完整完成约两成任务。我把它当作 DOM 方案失效时的最后一层兜底，而不是首选。

### WebMCP：让网站自己开口

这条路线目前只有一个方案，就是 Google 和微软正在推动的 Web 标准 [[WebMCP]]，Chrome 和 Edge 已经开始试验。

[[WebMCP]] 是我最看好的长期方向。它让网站通过标准接口直接把能力注册成工具，Agent 不用再去猜按钮在哪：

```js
await document.modelContext.registerTool({
  name: "add-todo",
  description: "Add a new item to the user's active todo list",
  inputSchema: {
    type: "object",
    properties: { text: { type: "string" } },
    required: ["text"]
  },
  async execute({ text }) {
    await addTodoItemToCollection(text);
    return { content: [{ type: "text", text: `Added: ${text}` }] };
  }
});
```

但它的成熟度需要说准确。它目前是 W3C Web 机器学习社区组的草案，还不是正式标准，编辑来自 Google 和微软；Chrome 149 和 Edge 150 以 Origin Trial 形式提供；入口 API 已经从 `navigator.modelContext` 改成了 `document.modelContext`，表单上的声明式写法在 10 月 8 日被移出了规格正文；Firefox 和 Safari 还没有任何承诺。Playwright 1.64 和 Cloudflare Browser Run 已经开始支持它。它还有一个天然的鸡生蛋问题：愿意被 Agent 使用的网站会接入，不愿意的网站（恰恰是反爬最严的那些）永远不会。所以在可预见的未来，WebMCP 会和 DOM 操作长期共存。

## 用三个问题给这些方案归类

看完这十条路线，你可能已经发现，路线之间的边界其实没那么清楚，真到选型时经常对不上号：Ego Lite 和 Claude in Chrome 都能用你的登录态，算不算一类？Browserbase 和 Stagehand 总是一起出现，又该归到哪边？问题在于，这些工具并不是在抢同一个位置，而是各自只负责「让 AI 用浏览器」这件事里的一部分。所以我换了个角度，拿下面三个问题去问每一个方案：

- 谁在指挥浏览器？可能是提前写好的脚本，运行时根本没有 AI 参与；可能是浏览器里自带的 AI，比如 Aside、Comet；也可能是你电脑上的 Claude Code、Codex 这类 AI 助手，浏览器只负责听命令
- 用的是哪个浏览器？可能是你平时上网用的 Chrome，里面登录着你所有的账号；可能是本机上一个专门给 AI 用的浏览器；可能是一个什么都没登录的空白浏览器；也可能是远程服务器上的浏览器
- AI 怎么看网页、怎么动手？可能是照着写好的代码找按钮；可能是读一份浏览器整理好的「页面元素清单」，再按编号点击；可能是像人一样看截图、按坐标点鼠标；也可能是网站直接把功能开放出来，AI 调用就行

用这三个问题把十条路线过一遍，就得到了下面这张表：

| 路线 | 谁在指挥 | 用哪个浏览器 | AI 怎么看网页、怎么动手 | 代表 |
| --- | --- | --- | --- | --- |
| 传统脚本 | 提前写好的代码，运行时没有 AI | 通常是什么都没登录的空白浏览器 | 照着代码找按钮 | Playwright、Puppeteer、Selenium |
| CDP 加 MCP 或 CLI | 你电脑上的 AI 助手 | 新开一个浏览器，或连上你正在用的 Chrome | 读页面元素清单，按编号点击 | Chrome DevTools MCP、Playwright MCP、agent-browser、Browser Harness |
| 浏览器插件 | 插件厂商的 AI，或你电脑上的 AI 助手 | 你平时用的 Chrome | 读元素清单、看截图，或直接调用网站接口 | Claude in Chrome、Kimi、ChatGPT 扩展、OpenCLI、Nanobrowser、Cebian |
| Agent 专用浏览器 | 你电脑上的 AI 助手 | 本机上专门给 AI 用的浏览器，导入你需要的登录状态 | 浏览器内部整理好的元素清单，或让 AI 写代码批量操作 | Ego Lite、BrowserOS neo |
| 内置 Agent 的 AI 浏览器 | 浏览器自带的 AI | 换一个日常浏览器，或直接用 Chrome 自带的 | 读元素清单加看截图 | Aside、Comet、Dia、BrowserOS、Gemini in Chrome |
| 自主 Agent 框架 | 框架里的 AI 自己一步步决定 | 本机或远程服务器 | 读网页代码或看截图 | browser-use、Stagehand、Skyvern、Jev Ultrafast |
| 云端浏览器 | 只提供浏览器，由搭配使用的其他工具指挥 | 远程服务器上的独立浏览器 | 取决于搭配的工具 | Browserbase、Steel、Cloudflare Browser Run |
| 数据采集 | 固定规则，或让 AI 从网页里提取信息 | 什么都没登录的空白浏览器 | 只读不点，把网页转成干净的文本和数据 | Crawl4AI、Firecrawl、Jina Reader |
| Computer Use | 能看懂屏幕的 AI | 整个电脑桌面，不限于浏览器 | 像人一样看截图、按坐标点鼠标 | Claude computer use、Codex 后台电脑操作、Gemini Computer Use |
| WebMCP | 任意 AI | 你平时用的浏览器 | 网站主动把功能开放给 AI 调用 | Chrome、Edge 实验中 |

回头再看上面那两个例子就清楚了。Ego Lite 和 Claude in Chrome 都能用你已经登录好的账号，区别在于前者是一个专门给 AI 用的浏览器，后者直接用你平时上网的那个 Chrome。Browserbase 和 Stagehand 则根本不是同一种东西：Stagehand 负责让 AI 判断下一步该点哪里，Browserbase 负责提供一台远程服务器上的浏览器，一个出脑子，一个出场地，所以它们经常搭配在一起用。同样，Playwright 既可以是你手写的测试脚本，也可以是 Playwright MCP 背后真正干活的那部分。很多方案并不互斥，而是可以叠在一起用。想明白这一点，选型时就不会再纠结「哪个最好」，而是分别想清楚：谁来指挥、用哪个浏览器、让 AI 用什么方式看网页。

## 我的几个判断

### 看懂网页这件事，正在从 AI 身上转移出去

把这些路线排成一排，我发现它们最本质的区别是：看懂网页这个活，到底由谁来干。最左边是 Computer Use，AI 像人一样盯着截图，自己判断按钮在哪、该点哪个坐标，所有的理解工作都压在 AI 身上；往右一步，浏览器先把页面整理成一份元素清单，AI 只要读文字、按编号点击；再往右是 Ego Lite、agent-browser 这样的工具，清单更精简，AI 还能一次写好几步操作批量执行；然后是 OpenCLI 的站点适配器，直接调用网站自己的数据接口，AI 几乎不用看页面；最右边是 WebMCP，网站主动把「搜索」「下单」这类功能交到 AI 手里。

越往右，花的钱越少、速度越快、结果越稳定，但能支持的网站也越少。所以我的选型原则很简单：在能用的方案里，尽量选最靠右的那个，左边的方案只在右边都用不了时兜底。

### 探索交给 AI，执行交给代码

这一轮调研里，我看到几乎所有方案都在收敛到同一个模式：第一次用 AI 探索，跑通之后沉淀成确定性的东西，以后重复执行。Playwright 的 Generator 和 Healer，Skyvern 的代码缓存，Stagehand 的缓存，OpenCLI 的适配器编写和自动修复，Ego Lite 的站点经验包，Kimi 的操作录制转 Skill，Browser Harness 让 Agent 自己写辅助函数，说的都是同一件事。大模型在这里更像一个编译器，把模糊的意图编译成可以重复运行的脚本，脚本失效了再重新编译一次。这其实和我在 [AI Coding Agent 语境下的 Harness Engineering](https://blog.einverne.info/post/2026/03/harness-engineering-for-ai-coding-agents.html) 里聊的思路一致，Agent 的价值不只是自己干活，更在于把经验变成可复用的工具。

### MCP 还是 CLI 不是关键

社区里经常争论浏览器工具该做成 MCP 还是 CLI。从上面那些数据看，协议本身不是关键，真正决定效率的是两件事：会不会把整页数据强行塞进上下文，以及能不能一次执行多个步骤。MCP 的优势是通用，任何支持 MCP 的工具填一个地址就能用，所以 BrowserOS neo 选了它；CLI 和代码对编程 Agent 更高效，所以微软在 Playwright MCP 之外又做了 playwright-cli，Ego Lite 干脆让 Agent 写脚本。两种形态会长期共存，选哪个取决于你的 Agent 是不是擅长写代码。

### 登录态是最值钱也最危险的资产

几乎所有方案的核心卖点都是「复用你的登录态」，这恰恰也是最大的风险。OpenAI 在 2025 年 12 月 22 日加固 Atlas 的文章里直说，提示注入就像网络诈骗和社会工程学一样，「unlikely to ever be fully solved」。Anthropic 公布的数据是，Claude in Chrome 在 123 个测试用例上的攻击成功率从无防护时的 23.6% 降到了 11.2%，支持页面上称 Opus 4.8 当前配置在内部测试中低于 0.08%。但 Zenity 在 2026 年 8 月的 Black Hat 上演示，只是让 Claude in Chrome 总结一封带恶意指令的邮件，就能导出 Gmail 数据、共享 Google Drive、接管 Slack 和 X 账号。他们的观点是，Agent 在一个会话里同时读取多个来源的内容，从根本上破坏了浏览器的同源策略，CTO 的原话是「This is not a bug we can patch away」。

对应的防御思路也很清楚，各家都在做一部分：隔离（Ego Lite 的 Space、neo 的标签组、单独的浏览器），凭据保险箱（Aside Vault），敏感操作人工审批，事后审计和回放（neo 的会话录像），以及网站端的签名 Agent（Web Bot Auth）。我给自己定的规矩是：Agent 永远不碰我主力 Chrome 的 Profile，单独建一个 Profile，只导入任务真正需要的几个网站，银行、主邮箱一律不导；新任务先用只读方式跑；涉及付款、发消息、发帖的操作，必须停在最后一步由我确认。

### 独立 AI 浏览器在退潮，给 Agent 的浏览器在崛起

Atlas 关停和一堆 Agent 浏览器工具的 Star 增长放在一起看，信号非常明显。普通用户不会为了 AI 换浏览器，就连 Google 也没有另做一个 AI 浏览器，而是把 Gemini 直接放进了 Chrome；但开发者很乐意给自己的 Agent 配一个浏览器：Ego Lite 半年 2 万 Star，agent-browser 9 个月 4.5 万，OpenCLI 7 个月 3 万，Jev Ultrafast 6 周 2.4 万。浏览器的角色正在从「给人用的产品」变成「给 Agent 用的运行时」，这可能是未来一两年这个领域最大的结构性变化。

## 我会怎么选

结合上面的分析，这是我自己的选型表，每个选择背后的注意事项也写在了最后一列：

| 场景 | 首选 | 备选 | 说明 |
| --- | --- | --- | --- |
| 端到端测试和固定流程 | Playwright | Puppeteer、Selenium | 让 AI 写和修脚本，运行时零 Token |
| 编程 Agent 验证本地开发的页面 | playwright-cli 或 agent-browser | Chrome DevTools MCP、Codex 内置浏览器 | localhost 不需要登录态，调性能和网络时用 DevTools MCP |
| 让 Agent 用我的登录态办事 | Ego Lite 或 BrowserOS neo | Browser Harness、Kimi 扩展、Claude in Chrome | 一定用单独的 Profile |
| 高频访问固定网站取数据 | OpenCLI 现成适配器 | 自己写适配器 | 走网站接口比点页面稳定得多 |
| 陌生网站的一次性探索 | browser-use | Claude in Chrome | 接受结果波动，跑通后固化成脚本 |
| 可维护的混合自动化 | Stagehand 加 Browserbase | Playwright 加少量 LLM 调用 | v4 只支持 Chromium，缓存在云端 |
| 企业内部长链路流程 | Skyvern | Playwright 加 AI 兜底 | 注意 AGPL 协议 |
| 服务器端高并发 | Cloudflare Browser Run 或 Browserbase | 自托管 Steel | 数据中心 IP 访问社交网站容易被拦 |
| 批量抓取公开网页 | Crawl4AI 或 Firecrawl | Jina Reader | 能抓就别点 |
| 普通用户想要 AI 帮忙浏览 | Aside | Gemini in Chrome、BrowserOS、Comet、Dia | 重视凭据安全选 Aside，重视开源选 BrowserOS，不想换浏览器且有 Google AI Pro 订阅可以直接用 Gemini in Chrome |
| 开源、自带 Key 的侧边栏 Agent | Cebian | Nanobrowser | AGPL 协议，只从官方渠道安装 |
| 读资料写研究笔记 | Deta Surf、NotebookLM | Jina Reader 加 Obsidian | 不需要 Agent 动手 |

我自己的日常组合是这样的：写代码时让 Claude Code 用 agent-browser 或 playwright-cli 去验证本地页面，跑通的流程让它顺手写成 Playwright 测试；需要登录态的个人杂事交给 Ego Lite，用一个只导入了必要网站的 Profile；查资料基本靠 Jina Reader 和 Firecrawl，很少让 Agent 真去点网页。这套组合的思路就是前面说的「尽量往右选」，真正需要 Agent 动手操作浏览器的场景，其实比想象中少得多。

## 几个容易踩的坑

下面是我自己踩过、或者在调研中反复看到的问题：

- 快照里的元素引用（`@e21` 这种）在页面变化后会失效，每次操作前重新取快照是最稳的做法
- 不要让 MCP 把整棵无障碍树都返回，agent-browser 的 `-i` 只看可交互元素、Chrome DevTools MCP 的 `--slim` 都能大幅减少上下文
- 遇到验证码和二次验证，正确的做法是交给人处理，而不是想办法绕过，这既是工程问题也是合规问题
- BrowserOS、Skyvern、Firecrawl 用的是 AGPL，想嵌进商业产品前先看清楚协议
- 文中几乎所有的性能数字（Ego Lite、Aside、agent-browser、Stagehand、Jev Ultrafast、Browser Use 的评测）都是厂商自测，最可靠的办法永远是拿你自己的真实任务跑一遍

## 最后

梳理完这一圈，我最大的收获是不再执着于找「最强的 AI 浏览器」。让 AI 用浏览器，其实要分开回答三件事：谁来指挥，用哪个浏览器，AI 用什么方式看网页。每件事都有成熟的工具可选，真正的功夫在于把它们搭配好，以及判断什么时候根本不需要 AI。确定性能解决的就用脚本，网站有接口就走接口，只有真正未知的部分才交给模型，这条原则在 2026 年比任何具体工具都更经得起时间。

展望一下，我觉得接下来一年有几件事值得关注：WebMCP 能不能在几个大型 SaaS 上真正落地；「AI 探索、代码执行」的经验沉淀能不能形成像插件市场一样的共享生态，比如 OpenCLI 的适配器、Ego Lite 的经验包；以及 Agent 专用浏览器会不会像当年的无头浏览器一样，变成每个开发者工具箱里的标配。安全问题短期内不会有银弹，在那之前，给 Agent 一个单独的 Profile 是最便宜也最有效的保护。
