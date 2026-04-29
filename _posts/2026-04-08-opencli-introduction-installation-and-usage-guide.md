---
layout: post
title: "OpenCLI 是什么，如何安装和使用这个把网站变成命令行的项目"
aliases:
- "OpenCLI"
- "OpenCLI 是什么，如何安装和使用这个把网站变成命令行的项目"
tagline: "把网站、Electron App 和本地工具接成统一 CLI"
description: "介绍 OpenCLI 的定位、安装流程、常用命令和适用场景，帮助你快速理解这个面向 AI Agent 的 CLI Hub。"
category: 产品体验
tags: [opencli, cli, ai-agent, browser-automation, electron, nodejs, chrome]
create_time: 2026-04-08 15:10:00
last_updated: 2026-04-08 15:33:50
---

最近我越来越在意一个问题：我们已经有很多很强的 [[AI Agent]] 了，但真正能稳定调用的能力，还是主要集中在 shell、API 和本地文件系统里。至于网页上的功能，哪怕已经很成熟、很高频，到了 Agent 这里往往还是得重新“理解页面、点按钮、猜 DOM、处理登录态”。这类方式不是不能用，只是每次都像临场发挥，离稳定和可复用总差一口气。[[OpenCLI]] 让我觉得有意思的地方，就是它没有继续在“更聪明地看网页”这条路上内卷，而是换了一个角度，想办法把网页、[[Electron]] App 和本地工具都收编到统一的命令行入口里。

![OpenCLI 把网站和工具接成统一 CLI](https://pic.einverne.info/images/opencli-cover-2026-04-08.png)

这里说的 OpenCLI，指的是 [[GitHub]] 上 `jackwener/opencli` 这个项目，不是其他同名仓库。我查了一下官方仓库和 Releases，截至 2026 年 4 月 8 日，最新 release 是 2026 年 4 月 5 日发布的 `v1.6.5`。如果你平时就在用 [[Codex]]、[[Claude Code]]、[[Obsidian]]、[[Docker]]、[[GitHub CLI]] 这些工具，又希望把 [[Bilibili]]、[[Zhihu]]、[[Reddit]]、[[YouTube]]、[[X]] 这类站点能力也纳入同一套终端工作流，那 OpenCLI 确实值得了解一下。

## OpenCLI 是什么

先用一句话概括：OpenCLI 想做的是“把任何网站、Electron 应用或者本地 CLI 包装成统一的命令行接口”。它的核心不是单纯的浏览器自动化，而是一套更偏工程化的桥接层。官方的实现思路是用一个 Browser Bridge 浏览器扩展加上本地 daemon，把你当前 [[Chrome]] 里的登录状态复用出来，再配合已经写好的 adapter，把站点上的常见动作暴露成稳定命令。这样一来，终端、脚本、[[AI Agent]] 都不需要每次从零理解网页，而是直接调用明确的命令入口。

这个定位跟很多人熟悉的 LLM 驱动浏览器工具不太一样。OpenCLI 更像一个 CLI Hub，而不是一次性“代你上网”的浏览器助手。官方 README 里明确强调了几个点：一是运行时不消耗 LLM token，二是输出尽量结构化和确定，三是适合高频、重复、可以标准化的网站操作。你可以把它理解成：如果 Browser Use、Stagehand 这类工具更适合陌生页面上的一次性探索，那么 OpenCLI 更适合把已经跑通的网站能力沉淀成长期可复用的命令。

它目前覆盖的范围也挺广。官方 README 里列出来的 built-in adapters 已经包括 [[Bilibili]]、[[X]]、[[Reddit]]、[[Spotify]]、[[NotebookLM]]、小红书、贴吧等几十个站点；另一边，它还可以把现有本地 CLI 统一纳管，比如 `gh`、`docker`、`obsidian`、`vercel` 这些，都能通过 `opencli` 的统一入口去发现和调用。更特别的一点是，它还想把 [[Electron]] 桌面应用也 CLI 化，比如 [[Cursor]]、[[ChatGPT]]、[[Notion]]、[[Codex]] 这类 App。光看这个野心，你就能明白它为什么会吸引很多 Agent 工作流用户。

## 它和常见浏览器自动化工具有什么区别

我自己看完官方说明之后，最直接的感受是：OpenCLI 解决的不是“网页不会点”，而是“网页能力很难变成稳定的命令接口”。很多浏览器自动化工具当然也能做事，但它们的默认出发点往往是“给你一个浏览器，再让模型自己判断该怎么走”。这在探索未知站点时很灵活，但在日常工作流里未必划算，因为你真正需要的往往不是开放式探索，而是稳定地执行那几个重复动作。

OpenCLI 在这方面更偏向“先抽象，再复用”。如果一个网站的热门榜单、搜索、评论读取、下载、发布、个人资料这类动作已经被项目沉淀成 adapter，那么你得到的就是一个固定命令和一套比较稳定的输出格式。它支持 `table`、`json`、`yaml`、`md`、`csv` 这些输出形式，这对 shell 管道、`jq`、脚本和 [[AI Agent]] 都很友好。换句话说，它不追求每次都像真人一样重新理解页面，而是尽量把常见动作压缩成可组合的命令原语。

当然，这种路线也意味着它更依赖 adapter 的覆盖度。一个站点没有现成 adapter，或者站点内部接口大改，OpenCLI 的体验就会受影响。不过官方也给了面向开发者的 `explore`、`synthesize`、`generate` 这些命令，试图把“探索站点能力并生成适配器”这件事也工具化。对已经在折腾 Agent 和自动化工作流的人来说，这个方向其实挺对味的，因为它不是只给你一个能用的 demo，而是在尝试把适配过程本身也变成工程流水线。

## 如何安装 OpenCLI

如果你只是想先跑起来，官方给出的最小路径并不复杂。我建议第一次上手时按“先装扩展，再装 CLI，最后做诊断”这个顺序来，不要一上来就同时折腾插件、桌面应用和自定义 adapter，不然很容易把问题搅在一起。

### 先确认前提条件

在安装之前，先把两个前提条件确认好。第一，官方要求 [[Node.js]] `>= 20.0.0`，如果你不用 Node，也可以走 [[Bun]] `>= 1.0`。第二，浏览器侧的很多命令依赖你当前 [[Chrome]] 的登录态，所以目标网站需要提前在 Chrome 里登录好。README 里讲得很直白，如果你拿它去读 [[Bilibili]]、[[Zhihu]] 或者其他需要身份信息的站点，浏览器本身没登录，OpenCLI 也没法凭空替你拿到数据。

### 安装 Browser Bridge 扩展

OpenCLI 的浏览器能力不是直接“黑进”浏览器里，而是通过一个 Browser Bridge 扩展和本地微型 daemon 来完成通信。官方 quick start 里推荐的安装方式是：

1. 打开 OpenCLI 的 GitHub Releases 页面，下载最新的 `opencli-extension.zip`
2. 解压之后访问 `chrome://extensions`
3. 打开右上角的 Developer mode
4. 点击 Load unpacked，选择刚才解压出来的扩展目录

这一步看起来有点手工，但好处是透明。你能清楚知道扩展是怎么装上的，也容易在出问题的时候自己检查它到底有没有启用。

### 安装命令行本体

官方推荐的安装方式就是用 [[npm]] 全局安装：

```bash
npm install -g @jackwener/opencli
```

安装完成之后，先不要急着跑复杂命令，优先做一次健康检查：

```bash
opencli doctor
opencli daemon status
opencli list
```

`opencli doctor` 负责帮你检查扩展、daemon 和浏览器连接状态，`opencli daemon status` 则能看到本地 daemon 的基本情况，`opencli list` 会把当前可用的 adapters 和已注册工具列出来。对我来说，这三条命令是第一次安装时最有价值的，它们能快速帮你判断问题到底出在扩展没装好、浏览器没连上，还是 CLI 本体没装完整。

如果要升级到最新版，官方给的命令也很直接：

```bash
npm install -g @jackwener/opencli@latest
```

如果你更喜欢从源码安装，README 里的路径是：

```bash
git clone git@github.com:jackwener/opencli.git
cd opencli
npm install
npm run build
npm link
```

第一次上手我还是建议先用 npm 版本，等你确定自己真要研究 adapter 或给项目提 PR，再回到源码安装会更省心。

## 如何开始使用

安装完以后，我建议先分清楚两类命令：一类是公共数据命令，不依赖浏览器登录；另一类是站点命令，需要 Browser Bridge 和现成登录态。官方 README 自己就给了一个很好的最小路径，先拿公共命令测试，再试浏览器命令：

```bash
opencli list
opencli hackernews top --limit 5
opencli bilibili hot --limit 5
```

这里 `hackernews top` 属于不需要浏览器的公共接口调用，很适合拿来验证 CLI 本体是否正常；`bilibili hot` 则能帮你确认扩展、daemon 和浏览器链路是不是通的。如果你一上来就跑特别复杂的命令，出了问题反而不容易判断是哪个环节坏了。

等基础链路打通之后，OpenCLI 真正有意思的部分才会慢慢显现出来。比如它支持统一输出格式，这一点对脚本和 Agent 非常重要：

```bash
opencli bilibili hot -f json
opencli twitter search "open source ai" -f json
opencli reddit hot -f csv
```

我会特别推荐优先养成 `-f json` 的习惯。你只要开始把 OpenCLI 接进 shell 管道、`jq`、[[Python]] 脚本或者 Agent 工具链，就会明白结构化输出到底有多省事。很多网页工具的难点不在“能不能拿到数据”，而在“拿到的数据能不能继续自动处理”。OpenCLI 至少在这一步上是比较清醒的。

另一个很有意思的能力是 CLI Hub。它不只想接网站，还想把你本机已有的命令行工具统一纳管。例如官方 README 里就有这样的示例：

```bash
opencli gh pr list --limit 5
opencli docker ps
opencli obsidian search query="AI"
opencli register mycli
```

前面三条代表的是“通过 OpenCLI 发现并调用已有 CLI”，最后一条 `opencli register mycli` 则是把你自己的工具注册进来，让它出现在 `opencli list` 里。对于 [[AI Agent]] 用户来说，这件事意义很大，因为 Agent 只要先跑一遍 `opencli list`，就能知道这台机器上已经有哪些网站能力和本地工具可以直接用，而不是靠你每次手写长篇说明。

如果你已经在用 [[Codex]]、[[Claude Code]] 这类终端 Agent，我觉得一个很实用的做法就是在 [[AGENT.md]] 里加一句简单规则，告诉它优先运行 `opencli list` 来发现可用能力。这样后面不管是调网站 adapter，还是调你自己注册的本地工具，入口都会更统一。

## 进阶玩法和我会注意的边界

OpenCLI 还有一层更偏开发者的能力，就是 `explore`、`synthesize`、`generate`、`cascade` 这组命令。官方的定位是让你对未知网站做一次探索，然后自动生成 adapter，最后把它注册成 CLI。比如：

```bash
opencli explore https://example.com --site mysite
opencli synthesize mysite
opencli generate https://example.com --goal "hot"
```

如果你真的要把一个自己常用的网站长期接进工作流，这套命令会很值得研究。它代表的思路不是“让模型每次替你重新上网”，而是“先把网站能力沉淀成命令，再让模型调用命令”。从工程角度看，这显然是更稳的路线。

不过我也会提前提醒几个边界。第一，OpenCLI 再怎么强调确定性，本质上还是站在网站和桌面应用之上的一层适配层，站点接口、页面结构、登录逻辑只要变动，就有可能影响命令可用性。第二，它大量依赖浏览器登录态复用，所以最常见的问题通常不是程序崩了，而是你浏览器里其实已经掉登录了。第三，项目 README 里提到一些外部 CLI 可以自动安装，但这类能力我更愿意把它当作便利特性，而不是核心依赖，生产环境里还是尽量自己明确管理版本和依赖比较稳。

还有一点我觉得值得单独说一下。官方 README 提到它内建了不少 anti-detection 和风险规避处理，这在某些站点上可能确实提高成功率，但也意味着你最好对目标站点的使用条款和风险有基本判断。我的建议很简单：把它当成一个帮助你统一工作流的工程工具，而不是一个“什么都能自动搞定”的万能钥匙。越是涉及登录态、发帖、下载、批量操作，越要先明确自己在做什么。

## 最后

如果只用一句话来概括，我会说 OpenCLI 做的事情是：把原本散落在网页、桌面 App 和本地 CLI 里的能力，尽量压缩成一套可以被终端、脚本和 [[AI Agent]] 复用的命令接口。

我喜欢这个方向，是因为它抓住了现在很多 Agent 工作流真正缺的那一块。我们已经不缺“模型会不会思考”，也不缺“浏览器能不能自动点”，真正稀缺的是稳定、结构化、能持续接入现有工具链的能力层。OpenCLI 还远谈不上把这个问题彻底解决，但它至少给了一个很明确的方向：不要每次都让 AI 重新学会使用网页，而是尽量把网页能力先变成 CLI，再让 AI 去调用 CLI。

如果你平时就是终端重度用户，或者已经开始把 [[Codex]]、[[Claude Code]]、[[Obsidian]]、[[Docker]]、[[GitHub CLI]] 这些工具编进自己的工作流里，那 OpenCLI 值得你花一点时间试一下。哪怕最后你只用到了其中一小部分 adapter，它也很可能会改变你看待“网页能力如何进入本地自动化系统”这件事的方式。

## 参考链接

- 官方仓库：<https://github.com/jackwener/opencli>
- Releases：<https://github.com/jackwener/opencli/releases>
