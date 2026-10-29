---
layout: post
title: "给 MCP 工具描述瘦身 减少 AI 上下文消耗的实践"
aliases: ["给 MCP 工具描述瘦身 减少 AI 上下文消耗的实践", "优化 MCP 工具描述减少上下文消耗"]
tagline: "工具定义不是免费的，它在对话开始前就已经占掉了上下文"
description: "从 /context 的真实占用出发，讲清楚 MCP 工具描述如何消耗上下文，并分使用者和服务作者两个角度，整理延迟加载、去重、按项目启用、精简描述、收敛工具数量等实践方法。"
category: "经验总结"
tags: [mcp, context-optimization, claude-code, llm, ai-tools, prompt-engineering]
create_time: 2026-07-23 10:00:00
last_updated: 2026-07-23 10:00:00
---

![给 MCP 工具描述瘦身，为有限的上下文窗口腾出空间](https://pic.einverne.info/images/2026-07-23-10-00-00-mcp-tool-slimming.png)

最近在整理自己的 [[Claude Code]] 配置时，我做了一件以前一直没认真做过的事情，就是打开 `/context` 命令，把每一类内容到底吃掉多少 token 逐项看了一遍。结果有点出乎意料：在对话真正开始、我还一个字都没输入之前，光是各种工具定义就已经占掉了 3 万多 token。其中很大一块来自我这一两年陆陆续续接进来的十几个 [[MCP]] 服务，加起来 100 多个工具。每接入一个服务、每多写一行看似无害的描述，都是在往本就有限的上下文窗口里塞东西。

这篇文章记录 MCP 工具描述消耗上下文的方式，以及我实际用过的瘦身办法。办法分两类：一类是 MCP 的使用者在自己的客户端里就能做的，比如确认延迟加载、去重、按项目启用服务；另一类只有 MCP 服务的作者能做，比如精简 description 和 schema、收敛工具数量。第三方服务的描述使用者改不了，所以两类分开讲。

## 工具定义为什么会吃上下文

要理解优化的空间在哪，得先知道 [[Model Context Protocol]] 里一个工具是怎么被塞进模型上下文的。当客户端连接一个 MCP 服务时，它会调用 `tools/list` 拿到这个服务提供的全部工具，每个工具包含三部分：名字 name、自然语言描述 description，以及描述参数的 inputSchema。这个 inputSchema 是一份完整的 [[JSON Schema]]，里面每个参数都有类型，往往还配着一句甚至几句说明文字。这三部分合在一起，会被客户端注入到发给模型的请求里，成为系统提示的一部分。

在最朴素的实现里，这些定义不是用到才加载，而是每一轮请求都原样带上。哪怕你这次只想让模型改一行代码，它也得先把 100 多个工具的完整定义读一遍，然后才轮到你的问题。一个中等复杂度的工具，描述加上五六个参数的 schema，很容易就是 300 到 800 token，乘上几十个工具就是几万 token。[[Anthropic]] 在介绍 Tool Search Tool 的[文章](https://www.anthropic.com/engineering/advanced-tool-use)里举过一个例子：GitHub、Slack、Sentry、Grafana、Splunk 这 5 个服务一共 58 个工具，对话开始前就要占掉大约 55K token。

不过这笔账如果按钱来算，没有看上去那么夸张。工具定义排在 prompt caching 缓存前缀的最前面，顺序是 tools、system、messages，只要工具列表不变，后续每一轮都能命中缓存，而缓存读取的价格只有正常输入的一成左右，部分新模型还更低。真正绕不开的成本有两个：一是上下文窗口实打实被占掉了，留给代码、文档和对话的空间变少，也会更早触发自动压缩；二是工具列表一变缓存就整体失效，在工具全量加载的情况下，会话中途连上或断开一个 MCP 服务，前面缓存的前缀就得重新写一遍。

更隐蔽的代价是稀释模型的注意力。工具太多的时候，模型在该调哪个工具这件事上更容易出错：选错工具、编造不存在的参数、在几个功能重叠的工具之间反复横跳。Anthropic 在同一篇文章里给过内部测试数据：在工具库很大的 MCP 评测上，开启工具搜索之后，Opus 4 的准确率从 49% 提到 74%，Opus 4.5 从 79.5% 提到 88.1%。

## 上下文到底花在了哪里

在动手优化之前，去 [[Claude Code]] 里执行 `/context` 命令，System tools、MCP tools、每个自定义 agent、每个 memory 文件各占多少一目了然。我第一次认真看的时候，最扎眼的是同一个功能出现了两遍：列表里既有 `context7` 又有 `plugin_context7_context7`，两套几乎一样的文档查询工具同时占着位置。这种重复不是我故意的，只是插件和手动配置各引入了一次，平时根本不会注意到，直到把 context 打开才看见。

浪费通常集中在几个地方。一是重复的服务，同一类能力被不同来源引入了多次。二是描述里的客套话，"这个强大的工具可以帮助你方便地"这种前缀不传递任何信息，却实打实占字数。三是参数说明重复了类型已经表达的东西，比如一个字段类型已经是 boolean，说明里又写"传入 true 或 false 来控制是否启用"。四是超长的枚举和内联示例，有些工具把几十个可选值和好几段示例塞进 schema。五是 MCP 服务的 server instructions，也就是服务级别的说明文字，它和工具描述不一样，即使开了延迟加载也会在会话开始时全量加载，Claude Code 给每个服务的上限是 4096 个字符。

这几类里，重复的服务使用者自己就能处理；描述、参数说明、枚举和 server instructions 写成什么样，就只能完全看作者了。

## 先确认延迟加载真的开着

前面列的那些都是让每个工具变小，真正改变量级的，是让工具从默认全量加载变成按需加载，也就是延迟加载，Claude Code 里叫 tool search。它的思路是会话开始时只给模型一份工具名清单，完整的 description 和 schema 都不注入；模型判断需要某个工具时，先调用 `ToolSearch` 按关键词或名字把它找出来，这个工具的完整定义才会被拉进上下文。

在 Claude Code 里这个功能已经默认开启，在支持的模型上（Opus 4、Sonnet 4、Haiku 4.5 及之后的模型），所有 MCP 工具默认都是 deferred 状态。我现在的环境里挂着 100 多个 MCP 工具，`/context` 里它们都被标成 deferred，MCP tools 这一项的占用几乎是 0。不过它并不是完全免费，工具名和各个服务的 server instructions 仍然会在会话开始时加载，只是 schema 没有预先注入。延迟加载对缓存也更友好：Claude Code 会在整个会话里沿用第一轮请求的工具列表，搜到的工具以引用的形式追加进对话，中途连上或断开一个 MCP 服务都不会打断已有的缓存。

控制它的是 `ENABLE_TOOL_SEARCH` 环境变量：

- 不设置或设为 `true`：所有 MCP 工具延迟加载
- `auto`：阈值模式，工具定义合计不到上下文窗口的 10% 时全量加载，超过才启用工具搜索，也可以写成 `auto:5` 这样自定义百分比
- `false`：关闭工具搜索，所有 MCP 工具预加载

```bash
# 工具定义超过上下文窗口 5% 时才启用工具搜索
ENABLE_TOOL_SEARCH=auto:5 claude

# 完全关闭，所有 MCP 工具预加载
ENABLE_TOOL_SEARCH=false claude
```

也可以写进 `settings.json` 的 `env` 字段里。

既然默认就开着，使用者要做的其实是确认它没被意外关掉。有几种情况会让工具退回全量加载：设置了 `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`，用的模型太老，或者走了中转和自建网关。最后这一条最容易踩坑。我在 [Claude Code 环境变量完全指南](https://blog.einverne.info/post/2026/07/claude-code-environment-variables-guide.html)里提过，较早的版本只要 `ANTHROPIC_BASE_URL` 指向非官方地址，tool search 就默认关闭，需要手动设置 `ENABLE_TOOL_SEARCH=true`。从 v2.1.304 开始，网关场景下也默认开启了，但如果中转不支持 `defer_loading` 字段，v2.1.305 之后的 Claude Code 会在请求被拒之后静默退回全量加载，界面上没有任何提示。所以不管用的是什么版本，跑一遍 `/context`，看看 MCP 工具是不是标着 deferred 或 loaded on-demand，比任何推测都可靠。

反过来，有些工具确实每一轮都要用，搜索那一步反而多余。这时可以在服务配置里加上 `"alwaysLoad": true`，让这个服务的工具始终预加载。只是这个开关适合少数真正高频的工具，每多一个预加载的工具，就多占一份上下文。

延迟加载也不是没有代价。模型在使用工具前多了一次搜索的往返，会带来一点延迟，`ToolSearch` 本身也要花少量 token。工具很少的时候这笔交易不一定划算，Anthropic 的建议是工具定义超过 10K token，或者工具在 10 个以上时再用。但对挂了十几个服务的环境来说，用一次性的检索开销换掉每一轮都要背着的固定成本，几乎稳赚。

## 去重和按项目启用服务

开了延迟加载之后，重复的服务在启动时只多占一份工具名，token 上省不了多少，代价换了一种形式：模型搜索文档查询工具的时候，`context7` 和 `plugin_context7_context7` 两套几乎一样的工具会同时出现在结果里，模型得在里面再挑一次。所以去重仍然值得做，而且几乎无损，找出重复的那一份关掉就行。如果没开延迟加载，重复的服务就是实打实的双倍 token。

更彻底的办法是用不到的服务直接不连。很多 MCP 服务只在特定项目里才用得上，没必要全局常驻。Claude Code 的 MCP 配置分 3 个作用域：

- `local`：默认值，只在当前项目生效，配置存在 `~/.claude.json` 里
- `project`：写进项目根目录的 `.mcp.json`，可以跟着仓库共享给团队
- `user`：所有项目都生效

```bash
# 只在当前项目挂上 Playwright MCP，配置写进 .mcp.json
claude mcp add --scope project playwright -- npx @playwright/mcp@latest
```

已经全局装着、但当前项目用不上的服务，可以在 `/mcp` 面板里把它关掉，配置不会被删除，这个选择是按项目记录的。写代码的项目挂代码分析类的服务，写文章的项目挂搜索和知识库类的服务，各取所需。

## 写 MCP 服务时让描述服务于选择

接下来这几招是写 MCP 服务的人才能做的。如果你只是使用者，碰到描述写得特别臃肿的第三方服务，能做的是换一个实现，或者给作者提 issue。

工具描述的职责是帮模型选对工具，而不是当一份完整的使用手册，这两者需要的信息密度完全不同。一句好的描述，理想结构是一句话说清楚这个工具做什么，再加一句什么时候用。做什么让模型知道能力边界，什么时候用帮它在相似工具之间做区分。详细的用法、边角情况、返回字段的含义都可以延后，等模型真的调用了工具再从返回结果里获取，或者单独提供一个查文档的工具按需读取。

举个例子，一个知识库搜索工具，改之前是这样：

```json
{
  "name": "search_notes",
  "description": "This powerful tool allows you to easily search for notes in your knowledge base. You can use it whenever you need to find any information. It supports many options and returns detailed results including titles, paths, tags and content snippets.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "The query string to search for" },
      "include_archived": { "type": "boolean", "description": "Pass true or false to control whether archived notes should be included" }
    },
    "required": ["query"]
  }
}
```

改之后：

```json
{
  "name": "search_notes",
  "description": "Full-text search over knowledge base notes. Use get_note instead when the note path is already known.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "include_archived": { "type": "boolean", "description": "Default false." }
    },
    "required": ["query"]
  }
}
```

description 只留下做什么和什么时候用；`query` 的说明和字段名重复，直接删掉；`include_archived` 的类型已经说明了取值，只补一句默认值。参数说明都可以按这个标准来：类型和字段名已经表达清楚的不重复，只在有歧义、有默认值、或者取值有隐含约束的时候才写。

不过精简不等于删光。开了延迟加载之后，模型是靠工具名和描述搜到工具的，Claude Code 的文档也建议把模型可能会搜的关键词放在描述开头。描述写得太短、太抽象，工具可能根本搜不出来。

枚举和示例也要分情况看。把几十个可选值从 schema 里拿掉，等于放弃了参数校验，模型传错值就得多一次往返。比较稳妥的做法是取值少又常用的枚举留着；又长又冷门的，在参数说明里写清楚格式，传错时在错误信息里把合法值列出来，让模型下一次改对。

最后别忘了 server instructions。开了延迟加载之后，它是模型判断要不要去搜你这个服务的主要依据。Claude Code 的文档建议在里面写清楚这个服务处理哪类任务、什么时候应该来搜它的工具、有哪些关键能力，同时控制在 4096 个字符以内，超出的部分会被截掉。

## 收敛工具数量而不是无限堆叠

还有一个方向是从源头减少工具的数量，把多个细粒度的工具收敛成少数几个带参数的通用工具。比如与其提供 get_user、get_order、get_product 这 3 个几乎一样的读取工具，不如提供一个 query 工具，用一个 resource 参数来区分要读什么。3 份描述、3 份 schema 压成一份，模型也少了在几个相似工具之间纠结的机会。

不过这一招要拿捏分寸。收敛得太狠，工具会变得抽象，模型反而搞不清楚一个万能工具到底能干什么，延迟加载时也更难被搜到。我的经验是按语义是否真的同类来判断：功能高度重叠、只是操作对象不同的，合并；职责本质不同的，宁可保留成独立工具，让描述更清晰。目标始终是让模型更容易做对选择，而不是单纯把数字压小。

## 一套可以照着做的顺序

作为使用者，我自己的顺序大致是这样：

- 先用 `/context` 测一遍，看清楚哪些类别占大头，别凭感觉优化
- 确认 MCP 工具都标着 deferred，如果没有，检查 `ENABLE_TOOL_SEARCH` 的值，以及中转是否支持工具搜索，这一步收益最大
- 去重，把像 context7 那样挂了两遍的服务关掉一个
- 从项目维度审视，当前项目用不上的服务在 `/mcp` 里关掉，只在特定项目用的服务改成 `project` 或 `local` 作用域

作为 MCP 服务的作者：

- description 只写做什么和什么时候用，关键词放在前面
- 删掉和类型、字段名重复的参数说明
- 枚举和示例按调用频率和参数复杂度取舍，不要一刀切
- 写清楚 server instructions，告诉模型什么时候该来搜你的工具
- 功能高度重叠的工具合并，职责不同的保持独立

使用者这边先做的都是几乎没有副作用的确认和去重，项目级的调整需要想清楚哪些服务在哪里用，放在后面做。

## 最后

上下文管理是我们在使用 Agent 时非常容易忽略的部分，但这部分却是实打实会产生使用成本的，如果不主动打开 `/context` 经常会感受不到它的存在，我自己仔细研究了 Claude 上下文之后，按照上文的方法，打开了延迟加载和去重，并且我还使用 Executor 来集中管理我的远程 MCP，让我在一个地方配置好 MCP 就可以在不同的 Agent 中一键接入。

