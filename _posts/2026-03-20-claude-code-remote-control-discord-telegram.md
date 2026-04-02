---
layout: post
title: "用 Claude Code 的 Remote Control 和 Channels 从手机和聊天软件操控你的终端"
aliases:
  - "Claude Code Remote Control"
  - "Claude Code Channels"
tagline: "让 Claude Code 突破终端的限制"
description: "介绍 Claude Code 的 Remote Control 和 Channels 两个功能，实现从手机浏览器远程操控本地会话，以及通过 Discord 和 Telegram 向 Claude Code 发送指令"
category: 产品体验
tags:
  - claude-code
  - remote-control
  - discord
  - telegram
  - ai
  - anthropic
create_time: 2026-03-20 20:00:00
last_updated: 2026-03-20 20:00:00
---

![Claude Code Remote Control](https://pic.einverne.info/images/2026-03-20-claude-code-remote-control.png)

我平时写代码基本离不开 [[Claude Code]]，但有一个场景一直让我觉得不方便：电脑上跑着一个长任务，人已经离开工位了，想用手机看看进度或者追加一句指令，做不到。最近 Anthropic 连续发布了两个功能，把这个问题解决得相当干净——Remote Control 让你从手机浏览器或 Claude App 直接接管本地会话，Channels 则更进一步，让你通过 [[Telegram]] 或 [[Discord]] 给 Claude Code 发消息，它收到后在本地执行并把结果回复到聊天里。

Channels 这个功能是 Claude Code 团队的工程师 Thariq 在推特上宣布的，配了一段演示视频：在 Telegram 里发一条消息，电脑终端里的 Claude Code 立刻收到并开始执行任务。看完视频的第一反应是，这不是那种用 SSH 或者远程桌面粗糙地操控电脑的方案，而是 Claude Code 会话本身通过 [[MCP]]（Model Context Protocol）把自己变成了一个可以接收外部消息的服务端。

这篇文章把这两个功能的设置方法和实际使用体验整理一下。

## Remote Control：手机接管本地会话

Remote Control 的思路很直接：你的 Claude Code 会话跑在本地电脑上，通过 Anthropic 的 API 做中转，让你从任何浏览器或 Claude 移动端 App 连上去继续对话。代码执行、文件读写、MCP 工具调用这些全部还是在本地跑，只有聊天消息经过云端中转。

### 启动方式

最简单的方式是在已有的 Claude Code 会话里输入：

```
/remote-control
```

终端会打印一个 URL 和一个二维码。用手机扫码或者在浏览器打开这个 URL，就能看到完整的对话界面，可以继续发消息、看工具调用的结果、审批权限请求。

如果你想启动一个专门用于远程接入的服务，可以用服务器模式：

```bash
claude remote-control --name "My Project"
```

这个模式下 Claude Code 会一直运行等待远程连接，支持多个会话同时接入。加上 `--spawn worktree` 参数还能让每个新会话自动在独立的 git worktree 里运行，互不干扰。

还有一种方式是启动交互式会话的时候直接带上参数：

```bash
claude --remote-control "帮我跑一下测试"
# 或者用缩写
claude --rc "帮我跑一下测试"
```

### 实际体验

连接速度很快，手机上打开 URL 之后基本秒连。对话是实时同步的，电脑终端和手机上看到的内容完全一样。我试过电脑合盖之后用手机继续操作，网络断开大概十秒之后会自动重连，体验比较流畅。

有一个细节设计得不错：权限审批可以在手机上完成。比如 Claude Code 要执行一个 bash 命令需要你确认，手机上会弹出审批按钮，点一下就行。这样即使人不在电脑前，长任务中间碰到需要审批的步骤也不会卡住。

### 前提条件

- Claude Code 版本 v2.1.51 或更高
- 需要 Pro、Max、Team 或 Enterprise 订阅
- 必须用 claude.ai 账号登录，API key 方式不支持
- Team 和 Enterprise 用户需要管理员在后台开启这个功能

### 安全方面

Remote Control 只走出站 HTTPS 连接，本地不开任何端口。所有流量通过 Anthropic 的 API 中转并且全程 TLS 加密。凭证是短期的、单一用途的，不存在一个长期有效的 token 被泄露的风险。对于在公司网络环境下使用的人来说，不需要改防火墙规则，这一点比较方便。

## Channels：让 Discord 和 Telegram 成为你的遥控器

Remote Control 解决的是"我在另一台设备上想继续操作"的问题，而 Channels 解决的是另一个场景——Claude Code 在后台跑着，你希望通过聊天软件给它发指令，它自动执行完把结果发回来。

### 它到底是什么

Channel 本质上是一个 MCP 服务器，职责是把外部平台（Telegram/Discord）的消息推送到正在运行的 Claude Code 会话里。这是一个双向通道——Claude 收到消息、处理任务，然后把结果回传到同一个聊天 app 里。不是简单的消息转发，Claude Code 在本地拥有完整的文件系统访问、命令执行能力和所有已配置的 MCP 工具，只不过触发它工作的入口从终端键盘变成了聊天消息。

Channels 目前是 Research Preview 状态，支持 [[Telegram]] 和 [[Discord]] 两个平台，每个平台对应一个官方插件。需要 Claude Code v2.1.80 以上版本，必须用 claude.ai 账号登录（不支持 API key 方式）。Research Preview 意味着功能还不稳定，接口和协议随时可能调整，Team 和 Enterprise 版本需要管理员显式开启才能用。

还有一个容易忽略的前提：会话必须保持活跃。事件只在 Claude Code 会话开着的时候才会送达，如果终端关了消息就收不到。想让它全天候响应，需要把 Claude Code 跑在后台进程里，比如用 `tmux` 或 `screen` 托管。

Channels 插件依赖 [[Bun]] 运行时，如果还没装过，先执行：

```bash
curl -fsSL https://bun.sh/install | bash
```

![HnsH97VmbB](https://pic.einverne.info/images/HnsH97VmbB.png)

### 连接 Telegram

第一步是在 Telegram 里创建 Bot。找 [@BotFather](https://t.me/BotFather) 发送 `/newbot`，它会让你依次输入 Bot 的显示名称（随便起，可以有空格）和用户名（必须唯一，必须以 `bot` 结尾）。创建成功后 BotFather 会返回一个形如 `123456789:AAHfiqksKZ8...` 的 token，完整复制下来。

然后在 Claude Code 里安装插件并配置：

```bash
# 安装 Telegram 插件
/plugin install telegram@claude-plugins-official

# 用你的 Bot token 配置
/telegram:configure 123456789:AAHfiqksKZ8...
```

token 会存储在 `.claude/channels/telegram/.env` 文件里。如果你不想用 configure 命令，也可以直接在 shell 环境变量里设置 `TELEGRAM_BOT_TOKEN`。

配置完成后，退出当前会话，用 `--channels` 参数重新启动：

```bash
claude --channels plugin:telegram@claude-plugins-official
```

这时候去 Telegram 给你的 Bot 发一条消息，Bot 会回复一个 6 位配对码。回到终端执行：

```bash
/telegram:access pair <配对码>
/telegram:access policy allowlist
```

第一条命令完成配对，第二条把访问策略从默认的 `pairing`（任何人发消息都能拿到配对码）切换为 `allowlist`（只有已配对的用户才能发指令）。安全起见，这一步不要跳过。如果需要查自己或别人的 Telegram 数字 ID，可以给 [@userinfobot](https://t.me/userinfobot) 发消息获取。

配置完成后，你在 Telegram 里给 Bot 发的消息会被转发到本地的 Claude Code 会话，Claude 处理完之后把回复发回 Telegram。处理过程中 Bot 会自动显示"正在输入"的状态提示，所以你能知道 Claude 正在工作。

Telegram 插件还支持图片：你在聊天里发送的照片会自动下载到 `~/.claude/channels/telegram/inbox/` 目录，Claude 可以读取并处理。不过 Telegram Bot API 有一个限制——无法获取历史消息记录，Bot 只能接收配置之后新发送的消息。

### 连接 Discord

Discord 的流程比 Telegram 多几步，主要是创建应用和设置权限的部分。

先去 [Discord Developer Portal](https://discord.com/developers/applications) 创建一个 Application，然后进入 Bot 设置页面，有两件事必须做：第一，点 Reset Token 生成 Bot Token（只显示一次，马上复制保存）；第二，在 Privileged Gateway Intents 里开启 Message Content Intent，否则 Bot 读不到消息内容。

接下来用 OAuth2 → URL Generator 生成邀请链接，scope 选 `bot`，Integration type 设为 Guild Install，权限至少勾选这几项：View Channels、Send Messages、Send Messages in Threads、Read Message History、Attach Files、Add Reactions。用生成的链接把 Bot 邀请到你的服务器。

然后在 Claude Code 里安装和配置：

```bash
# 安装 Discord 插件
/plugin install discord@claude-plugins-official

# 配置 Bot Token
/discord:configure <你的Bot Token>
```

token 同样存储在 `.claude/channels/discord/.env` 文件里。退出重启：

```bash
claude --channels plugin:discord@claude-plugins-official
```

在 Discord 里私信你的 Bot，拿到配对码，回终端配对：

```bash
/discord:access pair <配对码>
/discord:access policy allowlist
```

之后就可以在 Discord 里给 Bot 发消息来操控 Claude Code 了。

和 Telegram 不同的是，Discord 插件可以主动获取频道的历史消息（最多 100 条），这意味着 Claude 能回头看之前的对话上下文。附件下载也支持，文件会保存到 `~/.claude/channels/discord/inbox/` 目录。

### 同时连接多个平台

Telegram 和 Discord 可以同时启用，用逗号分隔：

```bash
claude --channels plugin:telegram@claude-plugins-official,plugin:discord@claude-plugins-official
```

### 先用 fakechat 试一下

如果你不想一上来就配置 Telegram 或 Discord，官方提供了一个 fakechat 插件用于本地测试：

```bash
/plugin install fakechat@claude-plugins-official
claude --channels plugin:fakechat@claude-plugins-official
```

启动后打开 `http://localhost:8787`，会看到一个简单的聊天界面，可以模拟外部消息发送到 Claude Code，用来验证整个流程是否通畅。

### 插件提供的工具

安装 Telegram 或 Discord 插件之后，Claude Code 会多出几个可用的工具。两个平台共有的是 `reply`（向聊天发送回复，支持附件，最大 50MB）、`react`（给消息加 emoji 表情回应）和 `edit_message`（编辑 Bot 之前发送的消息，适合更新进度状态）。Discord 插件额外有 `fetch_messages`（获取频道最近最多 100 条历史消息）和 `download_attachment`（下载聊天中的附件文件）。

这些工具 Claude 会根据上下文自动调用，不需要你手动指定。比如你在 Telegram 里问"帮我看看 README 的内容"，Claude 会读取文件然后用 `reply` 工具把内容发回来。

### 无人值守模式

如果你想让 Claude Code 完全自动处理收到的消息，不需要手动审批每个工具调用，可以加上权限跳过参数：

```bash
claude --channels plugin:telegram@claude-plugins-official --dangerously-skip-permissions
```

参数名字里带 `dangerously` 是有原因的——这意味着 Claude Code 收到消息后会自动执行所有操作，包括文件写入和命令执行，不会问你。只在你信任所有配对用户并且了解风险的情况下使用。

### Channels 的前提条件

- Claude Code 版本 v2.1.80 或更高
- 需要安装 [[Bun]] 运行时（插件用 Bun 构建）
- 必须用 claude.ai 账号登录
- Team 和 Enterprise 用户需要管理员在 managed settings 里开启

## Remote Control 和 Channels 的区别

这两个功能看起来都是"远程操控 Claude Code"，但思路不同：

Remote Control 是你主动连接到一个正在运行的会话，获得完整的对话界面，可以像在终端里一样正常交互。适合"人在外面想看看进度、追加几句指令"的场景。

Channels 是事件驱动的。外部平台的消息被推送到 Claude Code，Claude 处理完把结果发回去。更适合"Claude Code 在后台长期运行，我偶尔通过聊天软件给它派活"的场景。两者可以同时使用。

## 我的使用场景

我目前主要在两个场景下用这两个功能。

第一个是代码审查和部署。我在电脑上启动 Claude Code 让它跑一个比较长的任务（比如重构一个模块、跑完整的测试套件），然后人去做别的事。用手机 Remote Control 偶尔看一眼进度，碰到需要确认的权限请求直接在手机上审批。

第二个是通过 Telegram 做一些轻量的查询和操作。比如我在外面突然想查一下某个文件的内容、看看 git log、或者让 Claude Code 帮我改一个小问题，直接在 Telegram 里发一条消息就行，不用打开电脑。

## 和 OpenClaw 的关系

熟悉 AI 工具生态的人可能注意到了，Claude Code Channels 的设计和 [[OpenClaw]]（一个开源的个人 AI 助手框架）的 channels 机制高度相似。OpenClaw 本来就是通过 Discord 等即时通讯平台跟 AI 会话交互的，Anthropic 团队显然观察了用户实际上是怎么用 AI 工具的，然后快速把这种模式移植到了 Claude Code 里。

这种"AI 团队用 AI 工具，观察自己怎么用，再把使用模式做成功能"的循环，可能才是 AI 编程工具迭代速度远超传统 IDE 的原因。传统 IDE 的功能规划靠产品经理收集需求，Claude Code 这边是工程师自己就是最重度的用户，痛点感知到功能上线的链路短得多。

## 最后

Remote Control 和 Channels 这两个功能把 Claude Code 从"只能在终端前面用"变成了"走到哪里都能用"。Remote Control 的完成度已经很高，日常使用没什么问题。Channels 还在 Research Preview 阶段，偶尔会碰到插件安装或配对上的小问题，但核心功能是通的。

如果你已经在用 Claude Code，Remote Control 基本没有不开的理由，一行 `/remote-control` 就能从手机接管会话。Channels 适合对自动化有需求的用户，配置稍微复杂一点，但配好之后用 Telegram 给 Claude Code 发消息的体验确实很方便。

## 相关链接

- [Remote Control 官方文档](https://code.claude.com/docs/en/remote-control)
- [Channels 官方文档](https://code.claude.com/docs/en/channels)
- [[Claude Code]]
- [[Telegram]]
- [[Discord]]
