---
layout: post
title: "Herdr 使用技巧，把一群 Coding Agent 用出花来"
aliases:
  - "Herdr 使用技巧，把一群 Coding Agent 用出花来"
tagline: "命名会话、CLI 编排、跨 Agent 派活、worktree 并行"
description: "总结两个月来使用 Herdr 管理多个 AI 编码 Agent 的实战技巧，包括命名会话隔离项目、用 CLI 脚本化搭建工作区、让 Agent 之间互相派活、Git worktree 并行开发、浮层命令、通知配置、中文输入法相关的实验性选项，用 herdr --remote 远程连接解决跨设备复制的问题，以及如何安全地重启长时间运行的 server。"
category: 经验总结
tags: [herdr, coding-agent, terminal, multiplexer, tmux, cli, automation, claude-code]
create_time: 2026-09-02 09:16:41
last_updated: 2026-11-02 16:40:00
---

两个月前我写过一篇 [herdr 一个窗口调度多个 Coding Agent](https://blog.einverne.info/post/2026/07/herdr.html)，介绍了这个面向 AI 编码 Agent 的终端多路复用器。这两个月里 Herdr 基本上取代了 [[tmux]] 成为我日常开的第一个窗口，[[Claude Code]]、[[Codex]]、Pi 这些 Agent 都收在里面跑。用得久了自然就需要系统性地再学习一下 Herdr，这篇文章就把这些经验整理出来。如果你还不知道 Herdr 是什么，建议先读上一篇介绍，这里就不再重复基础概念了，简单回顾一下层级结构：Session（会话）→ Workspace（工作区）→ Tab（标签页）→ Pane（窗格），Agent 跑在 Pane 里，Herdr 负责感知和汇总它们的状态。

![herdr tips](https://pic.einverne.info/images/2026-09-02-09-20-00-herdr-tips.png)

## 用命名会话隔离不同项目

刚开始用 Herdr 的时候我把所有项目都塞在默认会话里，Workspace 越开越多，侧边栏拉得老长。后来发现 Herdr 支持命名会话，每个命名会话有独立的 socket、独立的日志目录，甚至可以独立停止和删除，天然适合把工作彻底隔离开。

```bash
herdr --session wiki       # 使用或创建名为 wiki 的会话
herdr session list         # 列出所有会话及其状态
herdr session attach wiki  # 挂接到已存在的会话
herdr session stop wiki    # 停止会话
herdr session delete wiki  # 删除已停止的会话
```

我现在的用法是给长期项目各开一个命名会话，比如笔记库一个、博客一个、正在开发的项目一个。好处不只是视觉上清爽，更重要的是互不干扰：某个会话的 server 出问题需要重启时，其他会话里的 Agent 完全不受影响。`herdr session list` 会列出每个会话的运行状态、工作目录和 socket 路径，排查问题时非常直观。

每个会话的日志在 `~/.config/herdr/sessions/<session>/` 目录下，包含 `herdr.log`、`herdr-client.log` 和 `herdr-server.log` 三个文件，遇到诡异行为时先翻这里。

## 把 Herdr 当作可编程的工作台

Herdr 和 tmux 最大的不同，是它把所有内部对象都通过本地 socket 暴露成了 CLI 子命令。Workspace、Tab、Pane、Agent 全都可以用命令行创建和操作，这意味着你可以用一个 shell 脚本一键搭建整个开发环境：

```bash
# 创建工作区并指定目录
herdr workspace create --label myproj --cwd ~/code/myproj

# 在工作区里新建 tab
herdr tab create --workspace w1 --label dev

# 切分 pane 并跑起开发服务
herdr pane split --current --direction down --ratio 0.3
herdr pane run w1:p2 "npm run dev"
```

除了写入，还可以读取。`herdr pane read <id>` 能直接抓取某个 pane 的终端输出，配合 `--lines` 和 `--format` 控制范围和格式；`herdr api snapshot` 则一次性输出当前会话的完整 JSON 快照，包含所有 workspace、tab、pane 和 agent 的状态，拿 jq 一过滤就能做监控：

```bash
herdr api snapshot | jq '.snapshot.agents[] | {agent, agent_status, pane_id}'
```

我用这条命令写过一个简单的轮询脚本，定时检查有没有 Agent 进入 blocked 状态，有的话就推送提醒。在 Herdr 的模型里，一切皆可脚本化，这是它区别于传统多路复用器最有想象力的地方。

## 让 Agent 给 Agent 派活

这是我最喜欢的玩法。Herdr 提供了 `herdr agent prompt` 命令，可以把一段提示词直接发送给另一个 pane 里运行的 Agent 并自动提交执行，再配合 `--wait` 和 `--until` 参数等待对方进入目标状态：

```bash
# 给某个 agent 派活并等待完成，超时 3 分钟
herdr agent prompt <target> "重构 auth 模块并跑通测试" --wait --until done --timeout 180000

# 单独等待某个 agent 到达指定状态
herdr agent wait <target> --until idle --until blocked --timeout 30000
```

这里的 `<target>` 用来指定目标 Agent，可以写两种值：一种是运行该 Agent 的 pane ID，比如 `w3:p3H`；另一种是给 Agent 起的名字，比如 `reviewer`。terminal ID（`term_xxx`）和 `claude`、`codex` 这样的类型名都不行，毕竟同一种 Agent 往往同时开着好几个。pane ID 可以从 `herdr agent list` 里查：

```bash
herdr agent list | jq -r '.result.agents[] | "\(.pane_id)  \(.agent)  \(.agent_status)  \(.terminal_title_stripped)"'
```

经常要派活的 Agent，我更推荐起个名字。名字只能用小写字母开头，后面跟小写字母、数字、`-` 或 `_`，最长 32 个字符，并且在当前所有活着的 Agent 里唯一：

```bash
herdr agent start reviewer --kind codex --pane w3:p3H   # 启动时命名
herdr agent rename w3:p3H reviewer                       # 给已有的 Agent 改名
herdr agent prompt reviewer "review 一下最新的提交" --wait --until done
```

名字比 pane ID 稳当，原因是 `herdr pane move` 把 pane 挪到别的 workspace 后会分配新的 pane ID，脚本里写死的旧 ID 就失效了，名字则跟着 Agent 走。反过来，名字绑定的是 pane 里当前那个 Agent，它退出或被替换后名字会自动清掉，需要重新命名。另外 pane ID 和名字都只在一个 server 内有效，本地和远程机器上完全可能各有一个 `w1:p1` 或 `reviewer`，要控制远程机器上的 Agent，得在那台机器上执行命令。最后，如果目标 Agent 正处在 blocked 状态，`agent prompt` 会直接返回 `agent_blocked`，不会把提示词发过去，先去处理它的确认弹窗再说。

关键在于，这些命令不只是给人用的，Agent 自己也能调用。Herdr 给每个托管的 pane 注入了 `HERDR_ENV=1`、`HERDR_WORKSPACE_ID`、`HERDR_TAB_ID`、`HERDR_PANE_ID` 这些环境变量，Agent 读一下就知道自己身处 Herdr 之中、坐标是什么。再装上官方的 skill，Agent 就学会了切分 pane、启动别的 Agent、读取邻居输出、等待任务完成这一整套动作：

```bash
npx skills add herdrdev/herdr --skill herdr -g
```

装好之后可以直接对 Claude Code 说这样的话：

```
在右侧打开一个新 pane，启动一个 pi agent，并给它分发任务「调研 Herdr CLI 用法，
并保存到本地笔记中」，Pi Agent 完成任务之后，帮我总结 Pi 做了哪些事情。
```

Claude Code 会自己执行 `herdr pane split`、`herdr agent start`、`herdr agent prompt`、`herdr agent wait`，最后用 `herdr pane read` 读回 Pi 的输出做总结。虽然 Herdr 没有原生的共享上下文机制，但「读取对方输出、写入下一个 prompt」这个接力模式已经能覆盖大部分跨 Agent 协作场景。我常用的组合是让 Claude Code 写完代码后开一个 pane 调 Codex 做 code review，整个流程不需要我插手。

`herdr agent start` 支持的 Agent 种类相当多，`--kind` 参数接受 claude、codex、gemini、cursor、pi、opencode、copilot 等二十多种，基本上你叫得出名字的终端 Agent 都在列表里。

## 安装集成让状态检测更准

Herdr 对 Agent 状态的判断有两条路：一条是纯启发式检测，另一条是通过官方集成（hook 或 plugin）让 Agent 主动上报。后者要准确得多，强烈建议装上：

```bash
herdr integration install claude   # 给 Claude Code 装状态上报 hook
herdr integration status           # 查看各集成是 current 还是 outdated
herdr integration status --outdated-only
```

以 Claude Code 为例，集成会往 `~/.claude/hooks/` 写一个 `herdr-agent-state.sh`，状态翻转的瞬间就上报给 Herdr，侧边栏的 working、blocked、done 切换几乎没有延迟。集成的版本会随 Herdr 升级而更新，所以每次 `herdr update` 之后顺手跑一下 `integration status --outdated-only`，把过期的重装一遍。

如果发现某个 Agent 的状态显示不对，比如明明在干活却显示 idle，可以用 `herdr agent explain <target> --json` 查看检测的详细过程，加 `-v` 输出更详尽的判断依据，是排查误判的利器。

## 配合 Git worktree 并行开发

多 Agent 并行最怕的是它们在同一个工作目录里互相踩脚。Herdr 内置了 [[git worktree]] 集成，一条命令就能创建一个绑定独立 worktree 的工作区：

```bash
herdr worktree create --branch feat/agent-state --base master \
  --path ~/code/wiki.worktrees/agent-state --label "agent-state"

herdr worktree list     # 列出 worktree 工作区
herdr worktree open     # 打开已存在的 worktree
herdr worktree remove   # 移除 worktree 检出
```

我的典型用法是：主 Workspace 留给自己看代码和跑测试，要并行开两个功能分支时，用 `herdr worktree create` 各开一个工作区，每个工作区里丢一个 Agent 进去干活。分支之间物理隔离，Agent 改文件互不影响，最后分别提交合并。侧边栏还会按 Workspace 汇总 Agent 状态，哪条分支上的 Agent 卡住了一目了然。默认键位 `prefix+shift+g` 也可以直接新建 worktree，不用切出去敲命令。

## 浮层命令是效率放大器

Herdr 的 `[keys.command]` 配置支持三种自定义命令类型：shell（后台执行）、pane（临时 pane，退出即关）和 popup（会话级模态浮层）。其中 popup 是我用得最多的，把 [[lazygit]] 和 btop 绑定成浮层之后，看 git 状态和系统负载都不需要动布局：

```toml
[[keys.command]]
key     = "prefix+alt+g"
type    = "popup"
command = "lazygit"
width   = "92%"
height  = "90%"

[[keys.command]]
key     = "prefix+alt+m"
type    = "popup"
command = "btop"
width   = "92%"
height  = "90%"
```

按 `prefix+alt+g` 弹出全屏 lazygit，处理完提交按 q 退出，底下的 Agent 们照常干活，什么都没被打断。这个体验比 tmux 的 popup 顺滑不少，因为浮层是会话级的，在任何 Workspace 里都能唤出。

改完 `~/.config/herdr/config.toml` 不需要重启，`herdr server reload-config` 热重载立即生效。改配置前后可以用 `herdr config check` 校验语法，如果键位改乱了还有 `herdr config reset-keys` 兜底，它会先备份再移除自定义键位。想看全部默认配置，`herdr --default-config` 会完整打印出来，照着抄最省事。

## 通知和声音提醒不要错过

多 Agent 场景下最贵的是注意力，通知配置值得花几分钟调一下。配置文件里 `[ui.toast]` 控制通知交付通道，可选 off、herdr、terminal、system 四种，我设成 system 让 Agent 状态翻转直接弹 macOS 系统通知，人不在终端前也不会漏掉 blocked。`[ui.sound]` 还可以给 done 和 request 两类事件配自定义 mp3，甚至按 Agent 静音——比如让跑长任务的那个出声，跑杂活的保持安静。

`herdr notification show` 命令则可以在脚本里手动触发通知，我把它加在一些长时间构建脚本的结尾：

```bash
herdr notification show "构建完成" --body "wiki 全量构建结束" --sound done
```

## 中文输入法用户的救星选项

这一条对中文用户特别实用。在终端 Agent 里用中文输入法有两个经典烦恼：一是按前缀键 `ctrl+b` 之后如果输入法还在中文模式，后续按键会被输入法截走；二是某些 Agent 的输入框会把光标藏起来，导致输入法候选窗定位漂移。Herdr 在 `[experimental]` 一节里针对性地给了解决方案：

```toml
[experimental]
switch_ascii_input_source_in_prefix = true   # 进入 prefix 模式自动切到英文输入源
reveal_hidden_cursor_for_cjk_ime = true      # 为 CJK 输入法暴露隐藏光标
```

后者还可以通过 `cjk_ime_agents` 白名单指定只对哪些 Agent 生效，以及用 `cjk_ime_cursor_shape` 控制光标形状。这两个选项打开之后，在 Claude Code 里中英文混着输入的体验顺畅了很多，再也不会出现按完 `ctrl+b` 结果 v 被输入法吃掉的尴尬。

## 插件生态里值得一试的几个

Herdr 支持本地可执行的工作流插件，[插件市场](https://herdr.dev/plugins/) 已经能找到不少社区作品，我试下来觉得值得关注的有这么几个。herdr-remote 让你不用 SSH 就能通过手机、macOS 菜单栏或 [[Telegram]] 监控 Agent 并执行审批操作，出门在外给 blocked 的 Agent 放行特别方便。herdr-reviewer 在侧边栏里直接查看代码变更，还能把逐行评论发回 Agent 的聊天窗口。herdr-sessionizer 类似 tmuxinator，用模糊搜索打开项目或 worktree，并按配置里的布局批量构建工作区。vim-herdr-navigation 是 vim-tmux-navigator 的移植版，同一组按键在 Herdr pane 和 Vim 分屏之间无缝移动。还有 herdr-token-dashboard，实时显示每个 Agent Pane 的 token 消耗，跑多个 Claude Code 时看着还挺有压迫感的。

## 远程使用优先用 herdr --remote

很多人跑 Agent 的机器并不是手边这台，可能是家里的服务器、云上的开发机，或者像我一样是一台常年开着的 MacBook Air。连过去用 Herdr 有两种方式：先 `ssh` 上去再运行 `herdr`，或者直接在本地运行 `herdr --remote`。我两种都用过，结论是在电脑上优先用后者。

`herdr --remote <主机>` 会让本机的 Herdr 作为一个瘦客户端，通过 SSH 连到服务器，启动或接入服务器上的 Herdr server，再把界面传回本地终端。Agent 和 pane 依旧跑在服务器上，界面则由本地绘制。详细说明可以看官方文档的 [持久化与远程访问](https://herdr.dev/zh-cn/docs/persistence-remote/) 一节。

### 基本用法

```bash
herdr --remote workbox
herdr --remote ssh://you@server:2222
```

第一条用的是 `~/.ssh/config` 里的主机别名，第二条直接写 `ssh://` 地址，可以带上用户名和端口。建议把常用主机先写进 SSH 配置：

```
Host workbox
  HostName server.example.com
  User you
  Port 2222
```

之后只需要 `herdr --remote workbox`。如果私钥设了口令，记得先 `ssh-add` 加进 agent。

ssh 连接由 Herdr 托管，它会在你的 SSH 配置之外补上 `ServerAliveInterval` 等保活参数，并复用第一次认证的连接，网络闲置时不容易断线。你自己在 SSH 配置里写的保活参数优先级更高；如果不想让 Herdr 插手，可以在 `[remote]` 里设 `manage_ssh_config = false`。

### 常用选项

- `--session <名称>`：接入远程主机上的命名会话，比如 `herdr --remote workbox --session agents`，和本地的命名会话用法一致。
- `--remote-keybindings server`：默认用的是本地的快捷键配置，加这个参数改用服务器上的配置。本地 `[[keys.command]]` 定义的自定义命令快捷键不会带过去，因为这些命令要在远程主机上执行。
- `--handoff`：attach 时启用实验性的热切换（live handoff），和前面 `herdr update --handoff` 是同一套机制。

`--remote-keybindings` 这一条我踩过坑。前面配置的 lazygit 和 btop 浮层，在本地按 `prefix+alt+g`、`prefix+alt+m` 都能正常弹出，可一旦用 `herdr --remote` 连上去，按下去就毫无反应。我一度以为是 macOS 下 Option 键没有当作 Alt 发送，排查了一圈才发现，是默认的 `local` 模式把 `[[keys.command]]` 整个丢掉了。加上参数之后浮层就回来了：

```bash
herdr --remote workbox --session agents --remote-keybindings server
```

这时快捷键全部以服务器上的配置为准，浮层里的 lazygit、btop 也在服务器上运行，所以要确认服务器上也装了这些命令。我两台机器的 Herdr 配置都由 dotfiles 同步，内容一致，切成 `server` 没有任何损失。

改了本地快捷键之后，在界面里执行 reload config（默认 `prefix+shift+r`）就能生效。较早的版本需要先分离再重新接入。

### 用 herdr machine 管理多台机器

`--remote` 一次只能接一台机器，如果手上有好几台跑 Agent 的机器，每次换机器都要退出重连。`herdr machine` 可以把常用的 SSH 机器保存下来，之后本地的 Local 和多台远程机器会一起出现在同一个窗口的侧边栏里，像切换 Workspace 一样点一下就能切到另一台机器。可以把它理解成「保存下来、可以同时开多台的 `herdr --remote`」。

```bash
# 保存一台机器，--remote-session 指定接入远端的哪个会话，不写就用 default
herdr machine add workbox --label workbox --remote-session agents
herdr machine add ser8ubuntu2404 --label homelab

herdr machine list            # 列出保存的机器，加 --json 方便脚本处理
herdr machine rename --label gpu-box <ID>
herdr machine disable <ID>    # 暂时停用，配置保留，不再自动连接
herdr machine enable <ID>
herdr machine remove <ID>     # 删除配置
```

除了 `add`，其他子命令都要传 `machine list` 里显示的 ID（一串 32 位的 hash），而不是 label。使用时有几点值得注意：

- `machine add` 不只是记一条配置，还会到远端准备好匹配版本的 Herdr server。如果远端已经跑着一个不兼容的 server，它会先询问是否停掉，默认选「否」，正在跑的 Agent 不会被误杀。
- `machine remove` 只会断开连接、删掉本地的配置，远端的会话和里面的 Agent 照常运行，下次重新 add 回来还能接上。
- 在侧边栏里切到某台远程机器，只是切换了界面上看到的内容。pane 里执行的 `herdr agent prompt` 这类 CLI 命令，发往的仍是这个 pane 所属的 server。pane ID 和 Agent 名字也只在各自的 server 内有效，两台机器上完全可以各有一个 `w1:p1`。`machine list` 列出的也只是连接配置，不是跨机器的 pane 清单。
- 同一个目标重复执行 `machine add`，会留下多条一模一样的记录。我就在侧边栏里发现过三条重复的 `ser8ubuntu2404`，而且都显示 `! error`。遇到这种情况先用 `machine list` 找出重复的 ID，删到只剩一条，再看是否还报错。如果还报错，手动跑一次 `herdr --remote <主机>`，看看具体提示是什么。

### 跨设备复制的坑

`--remote` 和先 ssh 再开 Herdr，最直观的差别在剪贴板上，我就是在这里踩的坑。

之前我习惯在主力 MacBook 上 `ssh` 到 Air，再在 Air 上执行 `herdr --session wiki`。用了一段时间发现，在远端 Herdr 里选中的文字，粘贴到本地时始终没有内容。

排查下来，问题不在 Herdr。先 ssh 再运行 Herdr 时，Herdr 整个跑在服务器上，复制时它会发出一段 OSC 52 转义序列，经 SSH 送回本地终端，再由本地终端写进系统剪贴板。这条链路要求本地终端支持 OSC 52 写剪贴板。[[Ghostty]] 默认支持，但我日常用的 [[Muxy]] 2.1.0 不处理这段序列，内容就在最后一步丢掉了。判断是不是终端的问题很简单，ssh 上去之后先别开 Herdr，直接执行：

```bash
printf '\033]52;c;%s\a' "$(printf osc52-test | base64)"
```

然后在本地执行 `pbpaste`。如果拿不到 `osc52-test`，就说明本地终端不认 OSC 52，远端 Herdr 怎么配置都没用。

换成 `--remote` 之后，客户端在本地，复制直接写本机剪贴板，不再依赖终端支持 OSC 52，在 Muxy 里也能正常复制。除此之外还有几个好处：

- 远端程序（比如 Claude Code 的 `/copy`）发出的 OSC 52 会由 server 转发给本地 client，同样能进本地剪贴板。
- 图片粘贴可以桥接到远端：按 `ctrl+v`（配置项 `remote_image_paste`），Herdr 会把本地剪贴板里的图片复制到远程主机的临时文件，再把文件路径粘贴给 Agent。先 ssh 再运行 Herdr 时，Herdr 读不到本地剪贴板，做不到这一点。
- 主题、copy mode 这些界面设置用的是本地配置，本地用 gruvbox、远端用 catppuccin 也互不影响。

还有一个小坑：Herdr 接管了鼠标（`mouse_capture = true`），拖选产生的是 Herdr 的选区，默认松开鼠标就复制好了（`copy_on_select`）。如果终端里把 `cmd+c` 绑成了终端自己的复制，按下去复制的是终端的选区，而终端此时并没有选区，等于什么都没复制。所以在 Herdr 里拖选完直接粘贴就行，不要再按 `cmd+c`。

### 我的远程工作流

两种方式并不互斥，按设备选就好。在 Mac 上我一律用 `herdr --remote workbox`，开几个 Claude Code 并行跑任务；要离开电脑时按 `prefix+q` 分离，服务器上的 Agent 继续干活；回来之后再 `--remote` 接回，现场原封不动。在手机上就反过来，用 SSH 客户端 `ssh workbox` 之后再执行 `herdr`，这也是官方文档对手机端的建议，看一眼 Agent 的状态、给 blocked 的任务放行就够了。

## 升级与排错

Herdr 更新很勤快，几条命令值得记住。`herdr update --handoff` 在升级时启用热切换（live handoff），替换 server 进程的过程中 pane 的 PTY 依然存活，长任务不中断，这对跑着几个小时任务的 Agent 来说是保命功能。想尝鲜的话 `herdr channel set preview` 切到预览通道，`herdr channel show` 查看当前通道。

server 一跑就是几周，难免会遇到需要重启的时候。Herdr 没有单独的 restart 命令，不过很多场景其实不必重启：只是改了配置，`herdr server reload-config`（界面里默认 `prefix+shift+r`）热重载就够了；要升级版本，用上面的 `herdr update --handoff`。重启之前可以先看一眼 `herdr status` 里的 `restart_needed` 和 `server_binary_stale`，两项都是 `no` 就说明版本层面没必要重启。

确实要重启时，做法是先停掉 server，再重新 attach，Herdr 会自动拉起一个新的 server：

```bash
# 默认会话
herdr server stop
herdr

# 命名会话
herdr session stop wiki
herdr --session wiki

# 远程机器上的会话
ssh workbox 'herdr session stop wiki'
herdr --remote workbox --session wiki
```

重启之后，Workspace、Tab、Pane 的布局会从会话目录下的 `session.json` 恢复；如果开了 `[session]` 里的 `resume_agents_on_restore = true`（默认开启），装了官方集成、会上报会话 ID 的 Agent（比如 Claude Code）还会自动接回原来的对话。但 pane 里普通 shell 跑着的进程，比如 `npm run dev`、长时间构建或者 ssh 连接，会随 server 一起结束，需要手动重新启动。所以重启前先扫一眼侧边栏，等正在 working 或 blocked 的 Agent 告一段落再动手。用了命名会话的好处这时也体现出来了，只停出问题的那个会话就行，其他会话里的 Agent 照常干活。

排错三板斧：`herdr status` 看 client 与 server 的版本、协议和 socket 路径是否匹配；`herdr agent explain` 查状态检测；日志目录 `~/.config/herdr/sessions/<session>/` 翻详细记录。如果 server 彻底起不来，还有一个逃生通道 `herdr --no-session`，以单进程模式运行，不依赖 server/client 架构，至少能先干活。

## 最后

从人盯着一个 Agent 干活，变成人调度一群 Agent 干活。命名会话和 worktree 解决了隔离问题，CLI 和 socket API 解决了编排问题，状态集成和通知解决了注意力问题——这三层加起来，多 Agent 并行才真正变成了一个可持续的日常工作流。

当然它还年轻，插件生态刚起步，Windows 支持还在预览阶段，偶尔也会遇到状态误判需要 `agent explain` 去排查。但项目迭代速度很快，几乎每次 `herdr update` 都能看到新东西。如果你也已经在同时跑多个编码 Agent，我的建议是别把它当成另一个 tmux 来用，把 CLI 和 Agent 集成玩起来，让 Agent 学会操作 Herdr 本身，那才是这个工具真正的价值所在。
