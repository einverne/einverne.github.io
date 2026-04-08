---
layout: post
title: "Claude Code Agent Teams 是什么，如何使用"
aliases:
  - "Claude Code 多 Agent 协作团队"
tagline: "从单兵作战到团队协同的 AI 编程范式升级"
description: "Claude Code Agent Teams 是 Claude Code 的实验性多会话协作功能，允许多个独立 Claude 会话像团队一样共享任务、互相发消息并并行工作。本文结合官方文档补充启用方式、Subagent 对比、tmux 分栏模式与已知限制。"
category: 学习笔记
tags: [claude-code, agent-teams, anthropic, multi-agent, subagents, tmux, terminal, ai-workflow]
create_time: 2026-04-05 16:30:00
last_updated: 2026-04-08 09:44:42
dg-home: false
dg-publish: false
---

![Claude Code Agent Teams](https://pic.einverne.info/images/claude-code-agent-teams.png)

[[Anthropic]] 在 2026 年 2 月把 [[Claude Code]] Agent Teams 作为实验性能力推了出来。前两天我第一次写这篇文章的时候，更多还是从“概念上很酷”这个角度在理解它；但把官方那篇专门的 Agent Teams 文档完整看了一遍之后，我发现这个功能真正有意思的地方不只是“多个 Agent 并行”，而是它开始提供一套接近真实团队协作的运行机制：共享任务列表、队友之间直接通信、Lead 统一协调、以及在终端里把整个团队真正跑起来的显示模式。

这次我把文章重新补了一轮，尤其把之前略写带过的部分补实了：什么时候该用 Agent Teams，什么时候还是该用 Subagent；如何指定显示模式；tmux 在 split-pane 模式里到底扮演什么角色；以及实验性阶段那些容易踩坑的限制。如果你已经在用 [[Claude Code]]，这几个细节其实决定了 Agent Teams 到底是“炫技功能”，还是能稳定进入你工作流的工具。

## Agent Teams 到底是什么

Agent Teams 的基本结构并不复杂：一个主会话充当 Team Lead，负责创建团队、拆分任务、分配工作、汇总结果；其他会话作为 Teammate 独立运行，每个 Teammate 都是一个完整的 Claude Code 会话，拥有自己的上下文窗口、自己的工具调用过程、自己的中间推理轨迹。它们不是附着在 Lead 身上的轻量线程，而是真正意义上的多个并行 Claude Code 实例。

这个设计带来的变化是，团队成员之间不必凡事都经由 Lead 中转。官方文档明确提到，Teammate 可以直接互相发消息，共享同一份任务列表，并且根据任务依赖关系自主管理工作顺序。某个任务完成之后，依赖它的任务会自动解锁；某个队友空闲之后，也可以去认领下一个未被阻塞的任务。这套机制已经很接近一个小型工程团队，而不再只是“主 Agent 派几个 helper 去跑腿”。

另外一个很重要的点是，用户也可以直接和某个 Teammate 对话，而不一定每次都要通过 Lead。这一点把 Agent Teams 和传统的“主会话下面挂几个不可见 worker”拉开了距离。它不只是系统内部的并行化技巧，而是把并行工作的控制权开放给了用户。

## 什么场景值得用

官方把适用场景总结得很清楚，我觉得基本可以照着理解。Agent Teams 最适合那些“并行探索本身就能带来价值”的任务，而不是所有复杂任务都值得上团队模式。研究和审查类工作是最典型的场景：安全、性能、测试覆盖、可维护性，本来就是几条天然可以并行推进的线，让几个 Teammate 同时看，最后由 Lead 汇总，通常比一个 Agent 按顺序轮着看要快。

另一个很适合的场景是新模块或新功能的拆分实现。前端、后端、测试、文档，如果边界清楚，本来就可以由不同人各自负责，Agent Teams 在这种情况下会非常自然。再往前一步，对抗性调试也很适合团队模式。官方文档里专门强调了“用竞争性假设并行排查 bug”，我非常认同，因为单个 Agent 很容易在第一个看起来合理的解释上停下来，而多个 Teammate 被要求互相质疑时，反而更容易逼近真正的根因。

但反过来说，顺序性很强的任务、多人会频繁碰同一文件的任务、或者大量步骤互相依赖的任务，通常不值得上 Agent Teams。因为团队模式本身就有协调成本，而且每个队友都是独立上下文，Token 消耗也会显著上升。官方文档对此说得很坦率：如果任务本质上不能独立并行，单会话甚至 Subagent 往往更高效。

## Agent Teams 和 Subagent 的关键区别

很多人第一次看到这个功能，直觉都会问一句：这不就是 Claude Code 版的 Subagent 吗？但从官方定义看，这两者其实不是同一个抽象层。

| 维度 | Subagent | Agent Teams |
|---|---|---|
| 上下文 | 独立上下文，但结果回到主会话 | 完全独立上下文，彼此平行存在 |
| 通信 | 只能向主 Agent 汇报 | 队友之间可以直接发消息 |
| 协调 | 主 Agent 全程控制 | 共享任务列表，自主认领与协作 |
| 适用场景 | 结果导向、短平快的委派 | 需要讨论、质疑、协同推进的复杂任务 |
| Token 成本 | 较低 | 较高 |

如果你要的是“帮我查一下这个 API 文档”或者“帮我验证一个猜想”，Subagent 通常更合适，因为它便宜、快，而且结果只要回传给主会话就够了。但如果任务本身要求多个角色互相分享发现、挑战彼此结论，或者协同推动一张带依赖关系的任务列表，那就已经进入 Agent Teams 的适用范围了。

我自己的判断标准很简单：如果工作成果只需要回到主线程，那就用 Subagent；如果工作过程本身需要队友之间发生互动，才值得动用 Agent Teams。

## 如何启用与创建团队

Agent Teams 目前仍是实验性能力，默认关闭，而且要求 [[Claude Code]] 版本至少是 `v2.1.32`。第一步永远应该先确认版本：

```bash
claude --version
```

然后再打开实验开关。官方文档给了两种方式，一种是放到 `settings.json` 里，让它成为长期配置：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

另一种是直接在 shell 环境里临时打开：

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
```

打开之后，不需要你手工去创建某个固定格式的 team 配置。Agent Teams 的入口仍然是自然语言。你直接告诉 Claude 你想创建一支团队，并且说明任务目标和希望的团队结构，它会自己去建 team、拉起队友、创建共享任务列表，再协调大家开始干活。

比如官方文档里的示例就很典型：

```text
我在设计一个帮助开发者追踪代码库 TODO 注释的 CLI 工具。
请创建一个 Agent 团队：一个队友负责 UX，一个负责技术架构，
一个负责扮演反对者找潜在问题，最后由你整合结果。
```

这个例子为什么好用，是因为三条线相对独立，互相之间不需要频繁等待。Claude Code 可以让三个 Teammate 同时探索，再把结果收回来综合。官方也提到，除了你主动要求创建团队之外，Claude 在判断任务适合并行时也可能主动建议你建 team，但不会在没征求同意的情况下擅自创建。

## 如何控制团队

团队创建出来之后，Lead 仍然是总控入口。你跟 Lead 用自然语言交流，它去完成协调、委派、审批和综合，但这并不意味着你不能更细粒度地控制整个团队。官方文档其实给了不少可操作的细节，这部分比我一开始想象得完整。

### 选择显示模式

Agent Teams 有两种显示模式。一种是 in-process，也就是所有 Teammate 都运行在当前终端内部。你可以用 Shift+Down 在各个队友之间循环切换，按 Enter 进入某个队友会话，按 Escape 中断当前 turn，按 Ctrl+T 切换共享任务列表。这种模式不依赖额外软件，任何终端都能跑，是最稳妥的默认选择。

另一种是 split-pane，也就是每个 Teammate 占据一个独立 pane。它的优势不是功能更多，而是可见性更好。你可以同时看到所有队友的输出，哪个人在跑测试、哪个人在改文件、哪个人在空闲，一眼就能看出来。对三人以上的团队来说，这种可视化监控会比 in-process 模式舒服得多。

默认的 `auto` 会在检测到你已经处在 tmux 会话中时优先使用分栏，否则回到 in-process。如果你想长期固定某个模式，可以在全局配置 `~/.claude.json` 里设置：

```json
{
  "teammateMode": "in-process"
}
```

如果只是某一次会话想临时覆盖，也可以直接用：

```bash
claude --teammate-mode in-process
```

### 指定队友数量、角色和模型

Claude 会根据任务自动决定团队规模，但你也完全可以自己指定。比如你可以明确要求“创建 4 个队友并行重构不同模块”，或者指定全部使用 Sonnet。这个能力很实用，因为很多时候问题不在于 Claude 会不会建团队，而在于它是否恰好建出了你心里想要的角色结构。

对我来说，最稳的用法是直接在 prompt 里写清楚每个队友的职责，比如 researcher、reviewer、devil's advocate、test owner，而不是只说“建一个团队”。角色越清楚，后面的任务划分和结果整合就越稳定。

### 让队友先做计划再动手

官方文档还专门提到一个很有用的控制手段：你可以要求某个 Teammate 先进入 plan mode，在 Lead 审批通过之前不允许直接改代码。这个机制对高风险改动特别重要，比如认证模块重构、数据库结构调整、跨服务接口改造。它让团队模式不至于一上来就变成几个人同时往仓库里乱写，而是先把方案拿出来过一遍。

如果你想把这个原则说得更严格，还可以在 prompt 里告诉 Lead 自己的审批标准，例如“只有包含测试覆盖的方案才批准”或者“会改动数据库 schema 的计划一律驳回”。Lead 会按照你给的标准做判断，这一点其实比单纯说“谨慎一点”有用得多。

### 直接和队友对话

这也是 Agent Teams 最像“真实团队”的部分。你不是只能跟 Lead 聊，你也可以直接给某个 Teammate 发消息，追问他为什么这么判断、要求他换个方向、或者让他补某个缺掉的验证。in-process 模式下用 Shift+Down 切换过去直接输入；split-pane 模式下则是点进那个 pane，像操作一个独立的 Claude Code 会话一样操作它。

这一点会显著改变使用体验。很多时候 Lead 的总结已经足够，但一旦你感觉某个队友的方向特别关键，能够直接把手伸进去微调，会比反复要求 Lead 转述高效很多。

### 任务认领、关停与清理

Agent Teams 的共享任务列表是整个协作机制的中轴。任务有 pending、in progress、completed 这些状态，还可以声明依赖关系。Lead 可以显式把任务分配给某个队友，也可以让队友在完成当前任务之后自己去认领下一个可执行任务。官方文档提到，它底层用了文件锁来避免两个队友同时抢到同一个任务，这说明这套共享任务机制不是“UI 上看起来像有列表”，而是真的拿本地状态在做协调。

等某个队友不再需要时，可以让 Lead 去请求它 shutdown。等整个团队收尾时，再让 Lead 去执行 cleanup。这里有一个官方特别强调的点：清理动作一定要通过 Lead 做，不要让某个 Teammate 自己去跑 cleanup，因为它手里的 team context 可能不完整，容易把团队状态留在半残状态。

### 用 Hooks 加质量闸门

这是一个很容易被忽略但其实很强的点。官方文档说，Agent Teams 可以结合 Hooks 做质量闸门，比如在 Teammate 即将 idle 时跑 `TeammateIdle`，在任务创建和完成时跑 `TaskCreated`、`TaskCompleted`。如果 hook 返回特定退出码，还可以阻止任务创建或阻止任务被标记为完成，并把反馈送回给团队。

这意味着你完全可以给 Agent Teams 叠上一层团队规则，比如“测试没跑不准收工”“任务标题不符合格式不准创建”“没有写验证步骤不准标记完成”。一旦这些规则开始稳定，你会发现 Agent Teams 就不只是并行跑多个 Claude，而是在流程层面越来越接近一个真正能被治理的小团队。

## tmux 分栏模式为什么值得补这一课

官方文档里对 split-pane 模式说得不算少，但如果你本来不常用 tmux，很可能还是会觉得它只是“为了把屏幕分开看看”。其实在 Agent Teams 里，tmux 的价值远不止分屏这么简单。它提供的是一个持久的终端多路复用层，让每个 Teammate 都有独立 pane，输出互不覆盖，会话在网络抖动或窗口关闭之后也更容易被重新接回去。

官方的建议也很明确：split-pane 模式需要 tmux 或 [[iTerm2]]，而 `tmux -CC` 配合 iTerm2 是推荐入口。`-CC` 的意思是让 tmux 通过控制模式把 pane 和 window 映射到 iTerm2 的原生界面上。这样你既能享受 tmux 的会话管理能力，又不用完全退回纯字符界面的 pane 管理体验。对 macOS 用户来说，这个组合确实是目前最舒服的入口。

如果你只是想快速试试，可以先装好 tmux：

```bash
brew install tmux
```

然后在 iTerm2 里这样启动一个专门给 Agent Teams 用的 session：

```bash
tmux -CC new -s claude-team
claude
```

如果你不用 iTerm2，只想走普通终端，也可以直接：

```bash
tmux new -s claude-team
claude
```

接着再把 `teammateMode` 设成 `"tmux"`，或者在已经处于 tmux 会话里的情况下直接用默认的 `auto`。这样一来，当 Claude Code 创建 team 时，就会优先为各个 Teammate 分配 pane，而不是都塞进同一个进程内视图。

tmux 在这里还有一个很现实的好处：排障方便。官方文档专门提到，团队结束后有时会遗留 orphaned tmux session，这时候直接列出并删除即可：

```bash
tmux ls
tmux kill-session -t claude-team
```

如果会话还在，但你只是断开了当前终端，也可以随时接回去：

```bash
tmux attach -t claude-team
```

这个工作流非常适合长任务。比如你让一个团队去做多角度代码审查，自己中途需要切走去回消息或者关掉终端，tmux 会比纯 in-process 模式让人安心很多。

当然，官方也提醒了兼容性问题。tmux 在某些操作系统上有已知限制，而且 split-pane 模式并不是每个终端都支持得很好。文档里明确点名，VS Code 集成终端、Windows Terminal、Ghostty 目前都不支持这套 split-pane 体验。所以如果你想稳定玩 Agent Teams 的可视化分栏，我自己的建议也和文档一致：macOS 下优先 iTerm2 + `tmux -CC`。

## 它在本地到底怎么工作

Agent Teams 并不是“临时内存里跑几个角色”这么简单，它会在本地维护团队状态。官方文档给出的路径是：

- 团队配置：`~/.claude/teams/{team-name}/config.json`
- 任务列表：`~/.claude/tasks/{team-name}/`

这些文件不只是记录一下名字，而是持有运行时状态，比如 session ID、tmux pane ID、当前成员列表等。官方明确建议不要手工编辑这些文件，因为 Claude Code 在下一次状态更新时会直接覆盖。你真正应该自定义的，不是 team config，而是 subagent definitions、CLAUDE.md、权限策略、MCP 与 skills 这类可复用配置。

另一个很关键的机制是上下文加载。Teammate 在启动时会像普通 Claude Code 会话一样加载项目里的 `CLAUDE.md`、MCP servers 和 skills，但不会继承 Lead 已经聊过的全部对话历史。这个行为非常合理，因为它保证每个队友的上下文都是干净、独立的，但也意味着你不能假设“Lead 已经知道的东西，队友天然都知道”。任务特定的上下文，还是要在 spawn prompt 里讲清楚。

官方还提到一个高级用法：你可以把某个 subagent definition 作为 teammate 角色复用，比如 `security-reviewer` 或 `test-runner`。不过当它作为 teammate 运行时，subagent definition 里的 `skills` 和 `mcpServers` frontmatter 不会被套进来，Teammate 仍然使用项目和用户级的 skills、MCP 设置。这一点很容易踩坑，尤其是你以为自己给 subagent 配的 MCP 会自动带到 teammate 身上时。

## 我现在最看重的限制和最佳实践

官方把限制写得挺直白，我觉得这反而是好事。首先，in-process teammates 目前不能被 `/resume` 和 `/rewind` 正常恢复；恢复会话之后，Lead 有可能还试图给已经不存在的队友发消息。其次，任务状态有时会滞后，某些任务明明做完了却没被正确标成 completed，从而把后续依赖链堵住。再者，队友关闭时不会立刻停下，而是会先完成当前请求或当前工具调用，所以 shutdown 可能比你预期更慢。

还有几个边界也值得记住。一个 Lead 一次只能管理一支团队，不能在团队里再嵌套创建新团队；Lead 身份固定，不能把某个 Teammate 提升成新的 Lead；所有 Teammate 默认继承 Lead 的权限模式，也就是说如果 Lead 用了 `--dangerously-skip-permissions`，整个团队都会跟着放开权限。这些限制共同说明了一点：Agent Teams 已经能用，但还远远没到可以把一切都交给它自动运转的程度。

结合官方建议和我自己的感受，我现在的使用方法会保守一些。团队规模优先控制在 3 到 5 人，这样并行收益和协调成本最平衡；任务尽量切到每个队友各自拥有清晰的文件域，不让两个人碰同一个文件；如果看到 Lead 开始自己上手实现，而不是等队友先做完，我会直接告诉它“先等 teammates 完成当前任务再继续”；如果是第一次尝试 Agent Teams，我也会优先用研究、审查、排障这类边界更清楚的任务，而不是一上来就让它并行改核心代码。

## 最后

我现在对 Agent Teams 的看法，比第一次接触时更务实了一点。它当然不是“多开几个 Claude”这么简单，因为真正有价值的是那套协作机制：共享任务列表、队友直连通信、Lead 统一协调、计划审批、清理与关停、以及基于 tmux 或 iTerm2 的可视化分栏运行方式。这些东西加在一起，才让它像一个团队，而不是像一堆孤零零的并行会话。

但它也确实还在实验阶段，文档里写出来的限制几乎都是真限制，不是那种可有可无的免责声明。对我来说，最合适的姿势不是把它当万能生产机器，而是把它放进那些天然适合并行探索和多视角审查的任务里。用对场景，它会非常亮眼；用错场景，协调成本和 Token 开销会立刻反噬你。尤其如果你准备认真用 split-pane 模式，我会建议你顺手把 tmux 这一课补上，因为这层终端基础设施，会直接决定你对 Agent Teams 的第一印象到底是“真能用”，还是“看起来很先进但操作起来很乱”。
