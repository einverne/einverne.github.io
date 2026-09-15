---
layout: post
title: "Claude Code 环境变量完全指南：解锁隐藏特性与效率配置"
aliases:
- "Claude Code 环境变量完全指南：解锁隐藏特性与效率配置"
tagline: "从认证代理到安全沙箱，那些真正值得设置的环境变量"
description: "系统梳理 Claude Code 目前支持的环境变量，涵盖认证模型、代理超时、遥测隐私、MCP 调优、安全沙箱与企业部署，并整理了一批鲜为人知但很实用的隐藏配置。"
category: 经验总结
tags: [ claude-code, environment-variables, cli-tools, developer-tools, ai-coding-assistant, mcp, anthropic, productivity, terminal, configuration, devops, ai-agent ]
create_time: 2026-07-23 16:00:00
last_updated: 2026-07-23 16:00:00
---

前段时间在给 [[Claude Code]] 配置多账号切换的时候，我翻了一圈官方文档，才发现它的环境变量参考页已经膨胀到了将近三百个条目，按字母顺序排下来长得吓人。大部分人日常用 Claude Code 可能只知道 `ANTHROPIC_API_KEY` 这一个变量，但实际上从模型选择、代理网络、超时时间，到遥测隐私、MCP 调优、安全沙箱，几乎每一个功能背后都藏着一批可以精细控制的开关。这篇文章就是我把这些变量重新梳理了一遍之后的笔记，挑出真正对日常开发有用的部分，也顺带记录几个我自己踩过坑之后才发现的隐藏配置。

![Claude Code 环境变量配置插图](https://pic.einverne.info/images/2026-07-23-claude-code-env-vars.png)

## 环境变量为什么值得研究

Claude Code 本质上是一个跑在终端里的 Agent，它需要连接 API、调度模型、管理工具权限、控制子进程行为，这些逻辑如果全部放到交互式的 `/config` 菜单，会让命令行体验变得臃肿。环境变量的好处在于它天然契合 Unix 的工作方式，可以写进 `.zshrc`、注入 CI 流水线、挂进 Docker 容器，也可以只在某一次命令前临时设置一次，不会污染全局状态。更重要的是，Claude Code 的官方文档里明确写着一条优先级规则，同一个行为如果既能通过环境变量控制，也能通过 `settings.json` 里的字段控制，环境变量的优先级更高，这意味着环境变量其实是最底层、最可靠的配置手段，适合放进那些需要跨机器、跨项目保持一致的规则里。

不同的 Claude Code 的使用场景对超时时间，代理配置，遥测策略的需求可能不同，如果每次都手动修改 `settings.json` 文件很容易出错，不如直接配置环境变量。

## 认证与模型选择

认证相关的变量 `ANTHROPIC_API_KEY` 是比较常见的，设置之后会覆盖 Claude Pro 或 Max 订阅登录态，在非交互模式下始终生效，交互模式下第一次使用会弹出确认提示，如果你想切回订阅账号，直接 `unset ANTHROPIC_API_KEY` 就行。如果你走的是自建网关而不是直连 Anthropic 的 API，`ANTHROPIC_AUTH_TOKEN` 会更合适，它的值会被自动加上 `Bearer` 前缀塞进 `Authorization` 头。

多账号场景下 `CLAUDE_CONFIG_DIR` 是我觉得被低估的一个变量，它可以把配置目录从默认的 `~/.claude` 挪到任意路径，里面包含了 settings、会话历史和插件配置。可以给工作账号单独创建 `~/.claude-work` 目录，写了一条 `alias claude-work='CLAUDE_CONFIG_DIR=~/.claude-work claude'`，这样工作和个人的会话历史、MCP 配置完全隔离，不会串到一起。

`ANTHROPIC_MODEL` 可以直接指定要用的模型，不过它的优先级低于 `/model` 命令和 `--model` 参数，算是一个默认值兜底。更细一点的是 `CLAUDE_CODE_EFFORT_LEVEL`，它控制支持 effort 参数模型的推理力度，可选 `low`、`medium`、`high`、`xhigh`、`max`、`auto` 几档，优先级比 `/effort` 命令更高，适合写进项目级配置里统一团队的推理成本预算。`MAX_THINKING_TOKENS` 用来覆盖 extended thinking 的 token 预算，设成 `0` 可以在 Anthropic API 上彻底关闭思考过程，对一些不需要深度推理、追求响应速度的简单任务很有用。企业合规场景下如果不希望模型选择器里出现超大上下文窗口选项，`CLAUDE_CODE_DISABLE_1M_CONTEXT` 可以把这个选项直接隐藏掉。

## 网络代理与超时控制

在公司网络里跑 Claude Code，最先要解决的往往是代理问题。`HTTPS_PROXY` 和 `HTTP_PROXY` 是标准的代理变量，`NO_PROXY` 用来指定不走代理的域名和 IP 段。如果你的团队搭了自建 LLM 网关，`ANTHROPIC_BASE_URL` 可以把请求整个指向自己的端点，但要注意一点，官方文档里写着如果这个地址不是 `api.anthropic.com`，Claude Code 默认会关闭 MCP tool search 功能，想保留就得额外设置 `ENABLE_TOOL_SEARCH=true`。企业自签证书环境下，`CLAUDE_CODE_CERT_STORE` 可以控制信任的 CA 证书来源，默认是 `bundled,system`，也就是同时信任内置的 Mozilla CA 集和系统信任库，如果公司注入了自签证书，通常只需要确保 `system` 在列表里就够了。

默认的 API 请求超时是十分钟，由 `API_TIMEOUT_MS` 控制，在网络不稳定或者走多层代理转发的场景下，十分钟经常不够用，尤其是模型在做长链条工具调用的时候。`API_FORCE_IDLE_TIMEOUT` 则是针对流式响应的空闲超时，默认五分钟，如果你接的是自托管模型网关，偶尔响应会卡顿超过这个阈值，设成 `0` 可以直接禁用这个看门狗。Bash 工具本身也有一套独立的超时体系，`BASH_DEFAULT_TIMEOUT_MS` 控制普通命令的默认超时，`BASH_MAX_TIMEOUT_MS` 则是模型能为单条命令申请的超时上限，默认是十分钟，如果你的项目里有编译时间很长的构建脚本，提前把这个上限调大能省掉不少来回重试的时间。另外 `BASH_MAX_OUTPUT_LENGTH` 值得一提，命令输出超过这个字符数会被存成文件，Claude 只拿到路径和简短预览，这对避免长日志把上下文窗口撑爆很有帮助。

## 遥测隐私与自动更新

对隐私比较敏感的开发者，`DISABLE_TELEMETRY` 和它的通用别名 `DO_NOT_TRACK` 可以关闭遥测数据上报，官方说明里强调这部分数据不包含代码、路径或命令内容，但如果你的公司政策要求彻底断开，这两个变量任选一个设置即可。需要留意的是，关闭遥测的同时也会关闭 GrowthBook 特性标志的拉取，一部分实验性功能可能因此无法生效，如果只是想单独关闭特性标志拉取而不影响遥测，可以单独设置 `DISABLE_GROWTHBOOK`。企业分发场景下 `DISABLE_AUTOUPDATER` 只是关闭后台自动更新，`claude update` 依然可以手动执行，而 `DISABLE_UPDATES` 更彻底，连手动更新和安装命令都会一并禁止，通常是打包成企业内部分发镜像时才会用到。

如果你在跑一个完全离线或者对网络请求特别敏感的环境，`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` 是个一次性的总开关，它会同时关掉自动更新、遥测、错误上报、发布说明拉取等一系列非必要的网络请求，比逐个设置省心很多。团队如果需要接入可观测性平台，[[OpenTelemetry]] 相关的变量组也值得了解，`CLAUDE_CODE_ENABLE_TELEMETRY` 配合 `OTEL_METRICS_EXPORTER` 可以启用指标采集，而 `OTEL_LOG_USER_PROMPTS`、`OTEL_LOG_TOOL_CONTENT` 这一组变量默认全部关闭，是为了避免用户提示词和工具调用的敏感内容被意外记录进日志系统，需要调试的时候再按需打开。

## MCP 与工具调用调优

我自己的 Claude Code 环境里挂了不少 [[MCP]] server，包括做代码图谱分析的 gitnexus、文档查询的 context7、上下文压缩的 headroom，还有做代码搜索的 tokensave。MCP server 一多，启动速度和超时问题就会开始变得明显。`MCP_TIMEOUT` 控制 server 启动阶段的超时，默认三十秒，一些依赖较重的 stdio server 启动可能需要更长时间。`MCP_TOOL_TIMEOUT` 是工具执行本身的超时，默认长达约二十八小时，几乎不会触发，但对 HTTP 或 SSE 类型的 connector server，单次请求另外有六十秒的默认上限，如果需要跑更久的任务，得把 server 配置里的 `timeout` 字段或者这个环境变量都调大到超过六十秒才能真正生效。`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` 则专门针对空闲超时，也就是既没有响应也没有进度通知的情况，网络型 server 默认五分钟，本地 stdio server 默认三十分钟，设成 `0` 可以彻底禁用。

启动体验上，`MCP_CONNECTION_NONBLOCKING` 从某个版本开始默认就是非阻塞的，意味着 Claude Code 会在后台连接 MCP server，工具逐步变得可用，而不是卡在启动阶段等全部连接完成。如果你更习惯旧版本那种阻塞式的确定性行为，设成 `0` 可以恢复，配合 `MCP_CONNECT_TIMEOUT_MS` 控制愿意等待的时长。工具数量多起来之后上下文消耗也会跟着上涨，`ENABLE_TOOL_SEARCH` 控制的工具延迟加载功能，本质上就是这篇文章开头我自己 CLAUDE.md 里配置 tokensave 时会用到的机制，把工具定义先隐藏起来，需要的时候再按需检索加载，能省下相当可观的系统提示词 token 消耗。

## 安全沙箱与子进程隔离

Claude Code 的 Bash 工具在执行子进程的时候，默认会完整继承父进程的环境变量，这其中当然也包括你的 `ANTHROPIC_API_KEY` 或者云厂商凭证。如果项目里存在恶意构造的 prompt injection，理论上是有可能诱导模型执行命令把这些凭证读出来的。`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` 这个变量设成 `1` 之后，Bash 工具、hooks、MCP stdio server 等子进程环境里会被剥离掉 Anthropic 和主流云厂商的凭证，父进程本身依然保留用于正常的 API 调用，这是一种纵深防御而不是完全的硬边界，但在处理不受信任的代码仓库时，这个开关我建议直接打开。配套的 `CLAUDE_CODE_SCRIPT_CAPS` 可以用 JSON 对象限制特定脚本每个会话最多被调用的次数，比如 `{"deploy.sh": 2}`，防止某个部署脚本在一次会话里被反复误触发。

排查配置问题的时候，`CLAUDE_CODE_SAFE_MODE` 是个很实用的应急开关，启动时会跳过 CLAUDE.md、skills、plugins、hooks、MCP server、自定义命令和 agent 的加载，相当于把 Claude Code 打回最原始的状态，如果怀疑是某个插件或者 hook 导致启动异常甚至卡死，先用这个模式启动一次基本能快速定位问题范围。

## 企业部署相关的变量

如果你的组织走的是云厂商托管路线而不是直连 Anthropic API，`CLAUDE_CODE_USE_BEDROCK`、`CLAUDE_CODE_USE_VERTEX`、`CLAUDE_CODE_USE_FOUNDRY` 分别对应切换到 [[Bedrock]]、Google Cloud 的 Vertex AI、微软的 Foundry 作为后端。每一种部署方式都配了一套对应的端点覆盖变量，比如 `ANTHROPIC_BEDROCK_BASE_URL`、`ANTHROPIC_VERTEX_BASE_URL`，以及跳过客户端侧鉴权、交给网关自行签名请求的 `CLAUDE_CODE_SKIP_BEDROCK_AUTH` 这一类变量。这部分内容对个人开发者用处不大，但如果你所在的公司走的是企业采购路线，这些变量基本就是运维团队搭建内部网关时绕不开的配置项，值得提前了解一下命名规律，方便对照官方文档排查连接问题。

## 那些没人告诉你的隐藏变量

翻文档的过程中我特意留意了几个不太起眼但实际用起来很顺手的变量。第一个是 `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS`，它会禁用 Claude Code 内置的 Explore 和 Plan 子代理，让模型直接用搜索工具或者通用子代理去探索代码库。这一点对我来说特别有共鸣，因为我自己在全局 CLAUDE.md 里写了一条强制规则，要求代码研究优先用 tokensave 这类代码图谱工具，而不是启动 Explore agent，本质上就是想避免子代理探索带来的额外 token 开销。这个环境变量相当于把同样的诉求从提示词层面下沉到了系统配置层面，更加可靠，不依赖模型是否严格遵循 CLAUDE.md 里的文字规则。

第二个是 `CLAUDE_ENV_FILE`，指定一个 shell 脚本之后，Claude Code 会在同一个 shell 进程里，每次执行 Bash 命令前先 source 一遍这个文件，拿来在多条命令之间保持 virtualenv 或者 conda 环境的激活状态非常合适，不用每次都在命令前面拼一遍 `source venv/bin/activate`。第三个是 `USE_BUILTIN_RIPGREP`，设成 `0` 之后会改用系统装的 `rg` 而不是 Claude Code 内置打包的 ripgrep 二进制，如果你的系统环境比较特殊，内置的二进制跑不起来，这个开关能救急。还有 `CLAUDE_CODE_ATTRIBUTION_HEADER`，设成 `0` 可以去掉系统提示词开头附带的客户端版本和 prompt 指纹信息，如果你走的是第三方 LLM 网关，这样做能提高 prompt cache 的命中率，直连 Anthropic API 的话则没有实质影响。最后一个我觉得值得记一笔的是 `CLAUDE_CODE_RETRY_WATCHDOG`，专门为无人值守场景设计，遇到限流或者容量错误的时候会无限重试而不是达到重试上限就直接失败，跑 CI 或者远程批处理任务的时候打开它能省掉不少半夜爬起来重跑任务的麻烦。

## 最后

官方没有把所有东西都塞进交互式菜单里追求易用性，而是把大部分深层配置留在环境变量层面，交给真正有需要的人自己去发现和组合。近三百个变量里，大多数确实是给企业部署和 SDK 场景准备的边缘配置，普通开发者日常真正会用到的可能也就是认证、模型、超时、代理这几类，但了解得越全，遇到问题时排查的思路就越清晰，不至于卡在一个网络超时或者权限报错上无从下手。

我自己接下来打算把日常最常用的那几组变量，连同项目相关的 MCP 超时配置，一起写进团队共享的 `settings.json` 模板里，这样新同事接入的时候不用再自己去翻文档试错。这份清单会随着 Claude Code 版本迭代持续变化，如果你在读到这篇文章的时候发现某个变量的行为对不上，大概率是官方又调整过了，直接查官方的环境变量参考页最靠谱。
