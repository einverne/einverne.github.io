---
layout: post
title: "Claude Code 的 Dynamic Workflows 让模型自己写编排脚本"
aliases: ["Claude Code 的 Dynamic Workflows 让模型自己写编排脚本"]
tagline: "把编排逻辑从对话里搬到脚本里"
description: "介绍 Anthropic 在 2026 年 5 月底为 Claude Code 推出的 Dynamic Workflows 功能，分析它与 subagents、skills、agent teams 的差异，记录实际使用体验、适用场景以及在大型代码库改造中的应用方式。"
category: "学习笔记"
tags: [claude-code, anthropic, ai-agent, workflow, orchestration, dynamic-workflows, ultracode]
create_time: 2026-06-08 16:30:00
last_updated: 2026-06-08 16:30:00
---

最近 Anthropic 在五月底悄无声息地往 [[Claude Code]] 里塞了一个挺颠覆的功能，名字叫 Dynamic Workflows。我一开始没太当回事，以为又是某种新的 subagent 包装层，毕竟过去一年里这类"让多 agent 协同工作"的概念已经被各种框架翻来覆去地讲过。直到我看到 Bun 团队用它把整套代码从 [[Zig]] 移植到 [[Rust]] 的案例，11 天写了大约 75 万行代码，测试通过率 99.8%，才意识到这次的设计思路和之前的"agent 团队"完全不是一回事。

写这篇文章主要是把我这几天读官方文档、刷各种案例分析后的理解整理出来，顺便聊聊它和 subagent、skill、agent team 之间到底差在哪里，以及哪些场景下值得动用这个相对昂贵的工具。我并没有完整跑过一个超大规模的工作流，所以更多偏向架构层面的解读，实践细节会标注清楚来源。

![Claude Code Dynamic Workflows 工作机制示意图](https://pic.einverne.info/images/2026-06-08-claude-code-dynamic-workflows.png)

## 这玩意到底解决了什么问题

要理解 Dynamic Workflows 的定位，得先回顾一下过去 [[Claude Code]] 里几种并发执行的形态。最基础的是 subagent，每次对话里 Claude 可以临时派一个 worker 出去处理子任务，结果回到主对话的 context 里。再往上是 skill，本质上是一组可以复用的指令，Claude 按提示词跑就行。再上一层是 agent team，由一个 lead agent 监督多个长期运行的同级 session，靠共享任务列表协同。这三者有个共同点，编排的"决策权"始终握在 Claude 自己手里，每一步该派谁、该做什么，都是 Claude 在对话回合里临时判断的。

这种"模型即编排器"的模式跑小任务很顺手，但一旦任务体量上去就开始崩。一是 Claude 的 context 窗口装不下几百个 agent 的中间结果，二是每一次决策都要占用一个对话轮次，整体节奏被拖得很慢，三是同样的任务跑两次完全可能走出两条不同的路径，结果不可复现。Dynamic Workflows 的核心思路就是把编排逻辑从 Claude 的对话里搬到一段 JavaScript 脚本里，让脚本而不是模型来持有"接下来谁跑、跑什么、结果怎么合并"的决策权。Claude 负责写这段脚本，运行时负责执行它，整个过程中 Claude 的 context 只装最终结果，不再被中间产物淹没。

官方文档里有一张对比表把这层差异讲得很清楚。subagent、skill 和 agent team 的中间结果都活在 context window 或者共享任务列表里，而 workflow 的中间结果活在脚本变量里。前三者每一步都由 Claude 决定，workflow 每一步由脚本决定。前三者每次跑都是新一次推理，workflow 跑完留下一份脚本，可以直接重跑甚至改一改再跑。这是从"对话式编排"到"代码化编排"的根本转变。

## 与 subagent skill 和 agent team 的差异

我自己理解这几种方式的差别，喜欢用一个比喻。subagent 像是临时工，你今天派他去做某件事，明天再做就要重新交代一遍；skill 像是带着工作手册的临时工，手册可以复用，但执行细节还是要 Claude 当场判断；agent team 像是一个有 lead 的小组，组员之间会互相协调，但 lead 还是要靠对话来分派任务。workflow 不一样，它更像是一段固化下来的标准作业流程 SOP，谁在第一步跑、谁在第二步跑、谁负责对第一步的结果做交叉验证，全部写死在脚本里。一旦这个 SOP 被验证过有效，下次跑就不需要 Claude 再花算力去重新设计流程。

这个差异带来的最直接好处是规模可控。官方给出的并发上限是单机 16 个 agent，单次 workflow 总共最多 1000 个 agent。这个量级在过去靠对话编排是根本无法稳定运行的，因为 Claude 自己根本协调不过来这么多并行任务。但放在脚本里，循环、分支、聚合就是几行代码的事，agent 之间的依赖关系也可以显式建模。这也是为什么 workflow 适合做代码库扫描、超大规模迁移、多源研究这类任务，它不靠 Claude 的"耐心"，而靠脚本的纪律性。

另一个常被忽略但很关键的点是质量模式可以被脚本化。比如经典的"对抗式审查"模式，让一组 agent 独立得出结论，另一组 agent 专门尝试反驳前一组的结论，直到收敛。这种模式如果靠对话编排，Claude 自己很难严格遵守，因为它会倾向于"我已经分析过了那就这样吧"。但放在 workflow 里，反驳环节就是脚本里的一个固定阶段，每个发现都必须经过这一关，不存在偷懒空间。Klarna 团队反馈说他们用 workflow 做大型代码库的 dead code 识别，效果比传统静态分析工具好，本质上就是吃了这个交叉验证的红利。

## 触发方式与 ultracode 的关系

实际使用层面有两种启动方式。第一种是在 prompt 里显式带上 ultracode 关键词，或者直接说"跑一个 workflow"，Claude 会针对当前任务即时生成一段脚本并提交执行。第二种是把整个 session 的 effort 设为 ultracode（`/effort ultracode`），从这之后每一个有点分量的任务 Claude 都会自动判断是否要起一个 workflow，可能一个请求会被拆成三个连续 workflow，分别负责理解代码、修改代码、验证修改。Ultracode 这个等级背后是 xhigh 推理强度加上自动编排判断，token 消耗会显著上去。

值得注意的是触发关键词的演进。在 v2.1.160 之前，字面关键词是 workflow，从这个版本开始改成了 ultracode，但自然语言请求两个版本都能识别。Anthropic 把关键词改得更"专属"一些，应该是为了避免和日常用到的 workflow 一词冲突。这种细节在快速迭代的产品里挺常见，碰到老版本文档里的 workflow 关键词，要意识到它和现在的 ultracode 是同一个东西。

权限模型也有一些值得讲的地方。在默认权限模式下，每次启动 workflow 都要确认一次，可以选择"对当前 workflow 在当前项目里不再询问"。在 auto 模式下，只有第一次需要确认。在 bypass permissions、`claude -p` 以及 Agent SDK 下完全不询问。但有一点不论怎么配置都不会变，workflow 里 spawn 出来的 subagent 一律以 acceptEdits 模式运行，文件编辑被自动批准，只有不在 allowlist 里的 shell 命令、web fetch、MCP 工具调用还会在执行过程中弹确认。这意味着 workflow 一旦启动，文件层面的变更不会被中途打断，要么完整跑完，要么手动停掉。

## 把跑过一次的脚本保存下来

我觉得整个 workflow 设计里最聪明的一步，是它把"一次性任务"和"可复用流程"打通了。当 Claude 临时为你写了一段 workflow 脚本，跑完之后你如果觉得这套流程靠谱，可以在 `/workflows` 界面里按 s 把这次运行的脚本保存为一个命令。下次再要跑同样的事情，直接 `/yourcommand` 就行，连写 prompt 都省了。保存位置可以选项目级（`.claude/workflows/`）或者用户级（`~/.claude/workflows/`），项目级会跟随仓库分发给协作者，用户级只对自己可见。

保存下来的 workflow 还可以通过 args 参数接收输入，脚本里通过全局变量 args 读取，Claude 会把传入的数据自动结构化，比如传一个 issue 编号列表进去，脚本里就可以直接 `args.map(...)` 而不需要解析字符串。这套机制让 workflow 从一个临时编排工具，逐渐变成可以沉淀团队工程实践的载体。比如团队里每次发版前都要跑的 release readiness 检查，就可以做成一个 workflow，每个 release 经理直接 `/release-check v1.2.3` 触发，背后跑的就是统一的几十上百个并发检查。

Anthropic 还内置了一个叫 `/deep-research` 的 workflow，针对的是研究类问题。它会从多个角度并行发起 web 搜索，对每个找到的来源做交叉验证，给每条结论投票，最终输出一份带引用的报告，没通过交叉验证的结论会被自动过滤掉。这种模式我之前在自己写 agent 的时候也尝试过，但靠对话编排很难做到每条结论都被严格反驳一轮，workflow 是真的把这个流程做实了。

## 实际使用中要留意的地方

Token 消耗是绕不开的话题。官方明说一次 workflow 跑下来用的 token 会比同等任务在普通对话里高出一个量级，因为同时有几十甚至几百个 agent 在工作，每个 agent 都有自己的 context 和工具调用。文档里的建议是先在小范围跑一次（比如选一个目录而不是整个仓库，或者把问题缩窄一些），看 `/workflows` 视图里报告出来的实际 token 消耗，再决定要不要扩大规模。`/workflows` 界面下随时可以按 x 停掉某个 agent 或者整个 workflow，已经完成的 agent 结果会被缓存住，下次 resume 不会重跑。

模型选择上有个细节容易忽略。workflow 里每个 agent 默认用的是你当前 session 的模型，如果你平时用的是 [[Claude Sonnet 4.6]] 或者 [[Claude Haiku 4.5]] 这种相对便宜的模型，而想跑的 workflow 又涉及到一些需要重推理的环节，那要么提前在 `/model` 里切到 [[Claude Opus 4.7]]，要么在描述任务的时候明确告诉 Claude 哪些阶段可以用小模型、哪些阶段必须用大模型，让脚本里做模型路由。这个层面的细节如果不主动管，要么花冤枉钱，要么因为模型能力不够导致结果质量打折。

Resume 机制只在同一个 Claude Code session 内有效。如果你跑到一半退出 Claude Code，下次起来 workflow 会从头开始，已经完成的 agent 结果不会被保留。这点和 [[Temporal]] 那种真正意义上的 durable execution 还是有区别的，更像是会话内的检查点机制。所以跑超长时间任务的时候要留意，最好不要中途关掉客户端。文档里也有提醒，workflow 运行期间不允许中途接收用户输入，如果某个阶段需要人工 sign-off，正确的做法是把流程拆成多个独立 workflow，在阶段之间手动衔接。

## 哪些场景值得动用 workflow

读完官方文档和几篇早期使用者的复盘，我大致总结出几类适合用 workflow 的任务。第一类是代码库级别的扫描和审计，比如对所有 API 端点做认证检查的覆盖审计，或者扫整个仓库找输入校验缺失的地方。这种任务文件数多、每个文件分析逻辑独立，刚好适合并行。第二类是大规模迁移，比如框架版本升级、API 废弃替换、跨语言移植。Bun 从 Zig 到 Rust 那个案例之所以能跑通，关键在于他们用一个 workflow 先把每个 struct 的生命周期映射好，再用另一个 workflow 文件级地按行翻译，每个文件配两个 reviewer 做对抗式审查，最后用第三个 workflow 修构建错误。这种分阶段、可并行、有交叉验证的结构，正是 workflow 擅长的。

第三类是高风险或者高价值的决策类任务，比如重要架构方案的评估。让多个 agent 从不同角度独立起草方案，再让另一组 agent 互相挑刺，最后给出加权后的建议。这种"独立思考后对抗"的模式可以显著降低单一思路带来的盲点。第四类是深度研究类任务，`/deep-research` 就是为这种场景设计的，跨多源验证比单 agent 的搜索更可靠。

不太适合 workflow 的场景也要识别清楚。日常的小修小补、单文件改动、问答类任务，用普通对话或者一个 subagent 就够了，开 workflow 是杀鸡用牛刀，token 浪费严重还反应慢。需要人工反复介入的任务也不适合，因为 workflow 中途不允许接收用户输入，你只能等它跑完。还有就是预算紧张的场景，一次大型 workflow 可能直接吃掉你当天大半的 quota，Pro 用户跑两三次就要重新规划用量了。

## 最后

Dynamic Workflows 在我看来最大的价值不是"让 AI 跑得更快"，而是把编排的纪律性写进了代码，把可复用性从"提示词模板"提升到了"可执行脚本"。过去我们用 LLM 处理大任务的痛点，往往不是模型能力不够，而是编排逻辑没法稳定地约束模型行为。把这层逻辑下沉到脚本里之后，模型只需要专注于每个原子任务，整体的可靠性、可复现性都上了一个台阶。

我个人接下来会优先尝试把它用在自己平时手动做的几件大事上，比如代码库的安全审计、博客全站的死链扫描、知识库重复条目识别。这类任务过去靠脚本写起来太琐碎，靠 Claude 跑又因为 context 限制做不全，[[Dynamic Workflows]] 看起来是个相对均衡的解法。当然也要做好心理准备，研究预览阶段的功能难免会踩坑，token 消耗也需要预估清楚，不能一上来就拿整个生产仓库做实验。

如果你也在用 Claude Code 处理大型工程任务，建议先用 `/deep-research` 跑一两次熟悉运行体验，再逐步过渡到自己定义 workflow。这套设计哲学和过去几年 [[Temporal]]、[[LangGraph]] 这些工作流框架走的路其实殊途同归，只不过 Anthropic 这次把"让模型自己写编排"这件事做到了极致。对开发者来说，这意味着多了一个新的协作维度，而不是简单地让 AI 替代什么。
