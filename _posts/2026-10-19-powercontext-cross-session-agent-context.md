---
layout: post
title: "用 PowerContext 给多个 Coding Agent 做任务交接"
aliases:
- "用 PowerContext 给多个 Coding Agent 做任务交接"
- "PowerContext 介绍：让 Codex 和 Claude Code 共享跨会话上下文与记忆"
tagline: "OceanBase 开源的 AI Agent 上下文服务，PowerMem 的继任者"
description: "PowerContext 是 OceanBase 开源的 AI Agent 上下文服务，把决策、约束、进度和交接状态以带版本的 Artifact 形式保存在会话之外，让新会话、另一个 Agent 甚至另一个人可以从当前状态继续工作。本文介绍 PowerContext 的核心概念（Scope、Memory、Handoff、Experience、Skill）、安装方法、一个从 Claude Code 交接到 Codex 的完整使用场景，以及用 Docker 和 Cloudflare Tunnel 自托管部署的过程。"
category: 经验总结
tags: [powercontext, powermem, ai-agent, memory, context-engineering, codex, claude-code, mcp, oceanbase, nowledge-mem]
create_time: 2026-10-19 10:00:00
last_updated: 2026-11-02 16:00:00
---


现在我写代码基本是 [[Codex]] 和 [[Claude Code]] 轮着用。有时候是 Codex 的额度先用完了，有时候是某一步我觉得 Claude Code 更合适，于是一个任务经常要在两个 Agent 之间换手。真正麻烦的不是换工具本身，而是换手的那一刻：新会话对前面发生的事一无所知。之前选了哪个库、哪个旧接口不能动、改了哪些文件、测试跑没跑过，这些信息全都留在上一段对话里。我只能手动复述一遍，或者把一大段聊天记录贴回去，前者容易漏掉关键约束，后者浪费 Token，还会让模型在几千行历史里抓不住重点。说到底，我缺的不是一个更大的上下文窗口，而是一份能在 Agent 之间传递、而且接手方可以核对的「当前状态」。在写这篇文章的时候还出现了另外一个思路就是利用 [[magpie]] 将模型路由给充足额度的账号，这个之后再写文章说。

在 AI 记忆这件事上我已经试过不少方案。[claude-mem 为 AI Agent 提供持久化记忆](https://blog.einverne.info/post/2026/06/claude-mem-persistent-memory-for-ai-agents.html) 解决了单个 Agent 跨会话的问题，但记忆绑在 Claude Code 上，换一个 Agent 就用不了了。[[Nowledge Mem]] 我已经用了大半年，它让所有 Agent 共享同一份个人记忆，偏好、基础设施、长期决策都记得很牢，详细体验写在 [Nowledge Mem 使用半年体验：让所有 AI Agent 共享同一份记忆](https://blog.einverne.info/post/2026/11/nowledge-mem-review-after-half-year.html)。不过它记的是「我是谁、我习惯怎么做」，而不是「这个任务做到了哪一步、下一步该谁来做」。直到看到 [[OceanBase]] 开源的 [[PowerContext]]，我才找到专门补这一块的工具。它把决策、约束和工作进度从对话里剥离出来，存到一个独立的服务里，用 Handoff 的方式交给下一个会话、下一个 Agent，甚至下一个人。

这篇文章会先介绍 PowerContext 的核心概念和安装方法，然后用一个从 Claude Code 交接到 Codex 的完整场景把流程跑一遍，最后分享我用 Docker 把它部署到 Homelab、通过 Cloudflare Tunnel 远程访问的过程，以及中间踩到的 Dashboard 登录 403 的坑。

![PowerContext 跨会话跨 Agent 共享上下文](https://pic.einverne.info/images/2026-10-19-10-00-00-powercontext-cross-agent-context.png)

## PowerContext 是什么

[PowerContext](https://github.com/oceanbase/powercontext) 是一个开源的 AI Agent 上下文服务（context service），采用 Apache 2.0 协议，是 OceanBase 之前 [[PowerMem]] 项目的全面升级版。项目的 slogan 是「Not only memory but full story」，意思是它不只记住零散的事实，而是把工作中真正值得延续的部分——决策、约束、证据、进度——沉淀成可以检查、带版本的 Artifact，保存在任何单个对话之外。

重读聊天记录在新会话里只能靠手动，换 Agent 更是完全失效；对聊天记录做 RAG 能跨会话，但换了 Agent 一样找不到；Agent 自带的本地记忆文件（比如 `CLAUDE.md`、`AGENTS.md`）可以跨会话，但同样绑死在某一个宿主上。PowerContext 把这些信息放在服务端，Codex 和 Claude Code 只要连同一个 Server、同一个 Scope，看到的就是同一份上下文。这也是我认为它最核心的能力：构建跨会话、跨 Agent 的上下文和记忆。

从架构上看，PowerContext 分成三层。最底层是 Core 协议，定义了 `Source`、`Artifact`、`Trigger` 三类契约，方便嵌入到别的应用或者替换组件；中间是内置运行时，提供 Memory、Handoff、Experience、Skill 四类服务以及调度、推理和存储后端；最上层是 Server 和各种接入方式，包括 HTTP API、[[MCP]]、Python 异步客户端、CLI、Dashboard 以及各个 Agent 插件。这几种接口共享同一个 Server 和持久化存储，所以无论从哪个入口写进去的记录，从其他入口都能读出来。存储默认用本地 [[SQLite]]，也可以换成嵌入式的 [[seekdb]]，支持全文检索与向量检索的混合召回。

## 核心概念

理解 PowerContext 最重要的是先搞清楚 Scope。所有数据都属于某一个 Scope，一个 Scope 就是一套独立的 Source 日志、Memory 生命周期、审核收件箱和 Handoff 历史，结构大致如下：

```text
Scope
├── Source journal    # 证据：提示词、文档、工作契约、任务结果
├── Memory            # atomic-memory/ARTIFACT_ID@REVISION —— 决策、约束、下一步
├── Review Inbox      # 等待审核的 Experience 和 Skill 候选
├── Handoff history   # handoff/ARTIFACT_ID@REVISION —— 跨会话的工作延续
└── Topic Memory      # 后台从符合条件的 Source 中抽取
```

需要注意的是，Scope ID 只是用来选择数据的，它不代表用户身份，也不授予任何工具权限。换一个工作目录不会自动创建隔离，想让两个 Agent 共享上下文，就让它们使用同一个 Server 和同一个 Scope；想隔离，就显式建一个新的 Scope。

Memory 存放可以复用的决策、约束、事实、状态和下一步。每条记忆都有 `active`、`forgotten`、`merged`、`retired` 几种状态，「遗忘」一条记忆只是把它移出召回范围，内容和历史仍然保留，可以随时恢复。显式写入 Memory 不需要任何模型，只有从对话 Source 中自动抽取记忆时才需要配置生成模型。这一点继承自 PowerMem 时期的设计思路：PowerMem 就强调智能记忆处理，过滤低质量信息、检测并更新冲突记忆，并模拟艾宾浩斯遗忘曲线按访问频率和重要性调整权重。

Handoff 是我最喜欢的部分。它记录的不是整段对话，而是「当前状态」，按照一个四步闭环运作：

```text
Work Contract → Prepared Handoff → Acknowledgement → Task Outcome
```

Work Contract 记录被委派任务的目标和完成边界；Handoff 由交出方检查当前分支、改动文件、测试结果、阻塞点和下一步之后生成；接收方拿到之后要先核对证据，再记录一个 Acknowledgement，表明自己接受、需要澄清还是拒绝；任务结束时再记录 Task Outcome，保留最终状态和每一项检查结果，失败或跳过的检查不会被抹掉。这个流程比「把聊天记录复制过去」多了一层可验证性，接手的 Agent 不会盲目相信前任留下的描述。

Experience 和 Skill 则是更进一步的经验沉淀。Experience 记录一个情境、采取的动作、观察到的结果和可复用的教训，Skill 是一套经过审核的操作流程。这两者都要先进入 Review Inbox，审核通过后才会参与召回，模型只能「提议」，不能悄悄把自己的输出提升成规则。Skill 即使审核通过也不会自动安装，必须显式导出某个确切的 Revision，Agent 宿主才能发现它。

所有 Artifact 都按 `FAMILY/ARTIFACT_ID@REVISION` 寻址，ID 保持稳定，每次修订产生新的 Revision，读取某个确切引用时拿到的永远是当时的快照。召回时，PowerContext 会通过 `PreparedContext` 从活跃的 Memory 和已审核的 Experience 中挑选内容，再套用一个字节预算，返回 `ready` 或 `empty`，不会把所有历史一股脑倒给模型。

## 安装和启动

PowerContext 需要 Python 3.11 以上、Git 和 [[uv]]，支持 macOS 和 Linux，Windows 目前是实验性支持。1.3.0 版本开始提供了交互式配置向导，推荐的启动方式如下：

```bash
uv tool install --force "powercontext[cli,server]==1.3.0"
mkdir -p powercontext-config && cd powercontext-config
powercontext config init --language en --output .env
powercontext config validate --env-file .env
powercontext server run --env-file .env      # 保持这个终端开着
```

向导会询问存储后端、本地还是远程使用、记忆能力、Dashboard 和要接入的 Agent。存储第一次用直接选 SQLite 就好。记忆能力有两个选项：Basic memory 只支持显式保存和召回，不需要任何模型 API；Full memory 可以自动处理 Source、抽取 Topic Memory 并做语义检索，但需要单独配置生成模型和 Embedding 模型的 API 凭据。这里有个容易踩的坑：你的 Codex 或 Claude Code 订阅并不能当作 Server 的模型凭据，这两套是分开的。

向导会生成 `.env` 和 `.env.next-steps.md` 两个文件，里面可能包含凭据，千万不要提交到 Git 仓库。另开一个终端，加载环境变量并检查服务状态：

```bash
set -a
. ./.env
set +a
powercontext ready
powercontext capabilities
```

如果只是想快速体验，也可以不带任何配置直接运行 `powercontext server run`。此时服务监听 `127.0.0.1:8000`，在 `/mcp` 路径提供 Streamable HTTP 的 MCP 接口，自动创建默认 Scope，数据保存在系统用户数据目录下的 SQLite 文件中，可以通过 `POWERCONTEXT_HOME` 环境变量修改数据位置。Dashboard 默认关闭，在环境文件里设置 `POWERCONTEXT_SERVER_DASHBOARD_ENABLED=true` 后可以通过 `http://127.0.0.1:8000/dashboard/home` 查看记忆、Handoff 和版本历史。

## 接入 Agent

目前 [[Codex]] 的插件是官方维护的，[[Claude Code]]、DeepSeek Harness、Kimi Code、[[OpenCode]]、[[OpenClaw]]、Hermes Agent 等是社区维护，Python 框架方面支持 [[LangChain]]、[[LangGraph]] 和 Pydantic AI。官方特别强调，插件和 Server 要使用同一个版本，混用新旧版本可能导致召回静默失效。

接入 Codex：

```bash
powercontext setup codex --ref powercontext-v1.3.0
powercontext doctor codex
```

接入 Claude Code：

```bash
powercontext setup claude-code --ref powercontext-v1.3.0 --server-url "$POWERCONTEXT_CLAUDE_SERVER_URL"
powercontext doctor claude-code
```

`--ref` 不要省略，它的默认值是 `master`，会装上比 Server 新的插件。Codex 的 setup 也是同样的道理。

Claude Code 插件装好后，打开新会话，用 `/hooks` 确认 `SessionStart` 和 `UserPromptSubmit` 两个 Hook 已经生效，再用 `/mcp` 确认 `powercontext` 这个 MCP Server 已连接。这两条通路是分开的：Hook 负责在每次提交提示词时调用 `POST /v1/context/prepare` 召回上下文、同时把提示词作为 Source 证据保存；MCP 则提供显式的 Memory 读写和 Handoff 操作。两者都是 fail open 的设计，Server 挂了或者认证失败，Hook 只是不注入内容，不会阻塞 Claude Code 的正常工作。

## 使用场景：从 Claude Code 交接到 Codex

下面用一个具体场景把整个流程串起来。假设我在维护一个图床服务，打算给上传接口加上自动转 WebP 的功能。前半段在 Claude Code 里完成接口改造，后半段把补测试和写文档交给 Codex。

### 让两个 Agent 指向同一个 Scope

这是整个场景能成立的前提。按照 `.env.next-steps.md` 里给出的请求创建一个 Scope，记下返回的真实 `scope_id`。注意向导里规划的 `codex-...` 或 `claude-code-...` 这类名字只是标题，不是 ID。然后把 Claude Code 和 Codex 都绑定到这个 Scope。Claude Code 这边最简单的做法是在 `.env` 里写入 `POWERCONTEXT_CLAUDE_SCOPE_ID`，或者在项目目录下用插件自带的脚本把工作区绑定到这个 Scope：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/workspace_scope.py" \
  --cwd "$PWD" --bind-scope "SCOPE_ID"
```

Claude Code 解析 Scope 的优先级依次是：显式设置的 `POWERCONTEXT_CLAUDE_SCOPE_ID`、会话绑定、工作区绑定、Server 默认 Scope。如果你只是一个人在本机用，两个 Agent 都落到 Server 默认 Scope 也能共享，但我更建议按项目显式建 Scope，避免不同项目的记忆互相污染。

### 在 Claude Code 中沉淀决策

在 Claude Code 会话里讨论方案时，把那些「换个会话就会忘」的约束明确交代下来，并要求它保存为 Memory：

```text
记住这个项目的几个决策：转换使用 sharp 库；原图保留，WebP 作为额外版本生成；
旧的 /api/v0/upload 接口不要改，移动端还在用。把这些保存到 PowerContext Memory。
```

Claude Code 插件自带的 `powercontext-project-context` Skill 会调用 `remember_memory` 把这些决策写成当前 Scope 里的活跃 Memory。之后无论是 Claude Code 的新会话还是 Codex，只要提示词相关，召回时都会带上它们，不需要我再重复一遍。比如 Codex 写文档时，自然就会注明旧的 `/api/v0/upload` 接口保持不变。如果开启了 Full memory，普通对话也会作为 Source 被后台处理成 Topic Memory，但我的习惯是关键约束还是显式保存，更可控。

### 在 Claude Code 中提交 Handoff

接口改造完成、准备换人的时候，在 Claude Code 中用一句明确的祈使句触发交接：

```text
Hand off this work with PowerContext. Inspect the current objective, branch, worktree,
changed files, checks, blockers, omissions, and next action.
Commit the completed Handoff and give me its exact Revision.
```

Claude Code 会检查当前的实际状态，调用 `handoff_current_work` 生成 Prepared Handoff，并在同一轮里提交，最后返回 Scope 和确切的 Handoff Revision。这里要注意措辞：插件只把明确要求提交的请求当作持久里程碑，如果只说一句「交接当前工作」，生成的只是一个临时载体，不会写成可以跨 Agent 传递的 Revision。如果只想预览不写入，可以说「Preview a PowerContext Handoff and make no writes」。

在这个场景里，我会在交接前让 Claude Code 把「下一步」写得具体一些，比如「为 WebP 转换补单元测试，覆盖透明 PNG 和超大图片两种情况；更新 API 文档，说明新增的 WebP 字段」。Handoff 里的 `next_action` 越清楚，Codex 接手后越不用猜。

### 在 Codex 中接手

打开 Codex，在会话里让它主动接手刚才那个 Handoff，把 Claude Code 返回的 Revision 一起给它：

```text
Continue this PowerContext Handoff. Check its evidence against the current repository
and instructions, confirm live state, capabilities, and authorization, then record
whether it is accepted, needs clarification, or is declined.
```

Codex 会调用 `continue_handoff` 读取交接内容，把它当作「不可信的历史」去和当前仓库状态核对，比如分支是否一致、改动文件是否还在、Claude Code 声称跑过的测试是否真的通过，然后调用 `acknowledge_handoff` 记录一个回执。只有证据可读、三项核查都确认后，才能标记为 `accepted`。这一步我觉得设计得很好，它避免了接手的 Agent 盲信前任的描述，在分支被别人动过的情况下也能及时发现问题。

如果哪天反过来，要把任务从 Codex 交回给 Claude Code，还可以在启动 Claude Code 之前把 Handoff 指定为启动上下文：

```bash
export POWERCONTEXT_CLAUDE_BOOTSTRAP_CONTEXT=true
export POWERCONTEXT_CLAUDE_BOOTSTRAP_HANDOFF='{"artifact_id":"HANDOFF_ID","revision":1}'
claude
```

开启 bootstrap 后，会话启动、恢复、clear、compact 时会注入最多 6 条打了 `bootstrap-context` 标签的 Memory 以及指定的 Handoff，默认预算 4096 字节，可以在 512 到 8192 字节之间调整。PowerContext 不会自动挑选 Handoff，必须显式指定，这是为了避免误接了别的任务。这组环境变量是 Claude Code 插件提供的，Codex 这边我还是用上面在会话里接手的方式。

### 记录任务结果

Codex 补完测试和文档之后，让它记录 Task Outcome：

```text
Record the PowerContext Task Outcome. Keep the exact status and check results,
list produced Artifacts and remaining work, and link the accepted exact Handoff receipt.
```

`record_task_outcome` 会保存 `succeeded`、`partial`、`blocked`、`failed` 等状态和每一项检查结果，失败或跳过的测试会原样保留，不会被写成「全部通过」。这条记录本身也是 Source 证据，后续可以支撑新的 Handoff，也可以作为孵化 Experience 的素材。比如 Codex 在补测试时发现 sharp 在某个 Alpine 镜像里需要额外的依赖，就可以沉淀成一条 Experience，审核通过后下次任何 Agent 遇到类似场景都能召回。

整个过程下来，我没有复制过一次聊天记录，Codex 拿到的是一份经过核对的当前状态，而不是几千行对话历史。在 Dashboard 的 Handoff 页面还能看到完整的交接链条，并导出为 Markdown 归档。

## 用 Docker 部署到 Homelab

在笔记本上跑 `powercontext server run` 适合体验，但想长期使用就不太方便：笔记本合盖服务就停了，换一台电脑也连不上同一份上下文。我最后把 Server 部署到了家里 [[Proxmox VE]] 上的一台 Ubuntu 虚拟机里，用 [[Docker]] 运行，再通过 [[Cloudflare Tunnel]] 暴露成一个 HTTPS 域名，这样无论在哪台机器上开 Claude Code，连的都是同一个 Server。下文用 `context.example.com` 代指这个域名。

整体链路如下：

```text
Claude Code / CLI ──HTTPS──> Cloudflare ──> cloudflared
                                               │
                                               └─> 127.0.0.1:18000 ──> 容器 :8000 ──> /data (SQLite)
```

### 从源码构建镜像

仓库的 `docker/Dockerfile` 是一个多阶段构建，基于 `python:3.11-slim`，以 UID 10001 的非 root 用户运行，数据放在 `/data`，并且自带一个请求 `/health/ready` 的健康检查。README 里说发布 Release 时会推送镜像到 Docker Hub，但我写这篇文章时还查不到可用的官方镜像，所以只能自己构建。我的做法是把官方仓库作为 git submodule 放在部署目录的 `src/` 下，固定在发布 tag 对应的 commit：

```bash
mkdir -p ~/dockerfile/powercontext && cd ~/dockerfile/powercontext
git clone --depth 1 --branch powercontext-v1.4.1 https://github.com/oceanbase/powercontext.git src
```

如果部署目录本身就是一个 git 仓库，可以用 `git submodule add` 加进去，升级时只需要切换 tag 再提交新的 submodule 指针，版本记录一目了然。

官方只给了 `docker run` 的示例，我写了一个 [[Docker Compose]] 文件：

```yaml
services:
  powercontext:
    build:
      context: ./src
      dockerfile: docker/Dockerfile
      args:
        POWERCONTEXT_VERSION: ${PC_VERSION:-1.4.1}
    image: powercontext-server:${PC_VERSION:-1.4.1}
    container_name: powercontext
    restart: unless-stopped
    ports:
      - "${BIND_HOST:-127.0.0.1}:${PC_PORT:-18000}:8000"
    env_file:
      - path: .env
        required: true
    volumes:
      # 镜像以 10001:10001 运行，目录需同 UID 所有
      - "${PC_DATA_PATH:-./data}:/data"

# 固定子网，让网关 IP 稳定为 172.31.0.1，后面的 FORWARDED_ALLOW_IPS 依赖它
networks:
  default:
    ipam:
      config:
        - subnet: 172.31.0.0/16
          gateway: 172.31.0.1
```

`POWERCONTEXT_VERSION` 这个构建参数不能省，Dockerfile 会校验安装出来的包版本是否与它一致。compose 自己用的变量我特意加了 `PC_` 前缀，没有沿用 `POWERCONTEXT_`，免得和 Server 的配置项混在一起。端口只绑定在宿主机的回环地址上，外部访问全部走 Tunnel。我这台机器的 8000 端口已经被别的服务占了，所以换成了 18000。

### 配置鉴权

Server 要暴露到公网，必须开启鉴权。在部署目录下创建 `.env`，token 用 `openssl rand -hex 32` 生成，文件权限设为 600，并加进 `.gitignore`：

```bash
PC_VERSION=1.4.1
PC_PORT=18000
PC_DATA_PATH=~/powercontext-data

POWERCONTEXT_SERVER_ACCESS_MODE=enforced
POWERCONTEXT_SERVER_AUTH_TOKEN=<随机生成的 token>
POWERCONTEXT_SERVER_PUBLIC_URL=https://context.example.com
POWERCONTEXT_SERVER_DASHBOARD_ENABLED=true
POWERCONTEXT_SERVER_MCP_ENABLED=true

FORWARDED_ALLOW_IPS=172.31.0.1
```

最后一行的作用后面再解释。这里没有配置任何生成模型和 Embedding 模型，也就是 Basic memory 模式，启动日志里会出现一段 `Inference capability notice`，属于正常提示。

数据目录要先建好，并交给容器里的用户：

```bash
sudo mkdir -p ~/powercontext-data
sudo chown 10001:10001 ~/powercontext-data
docker compose up -d --build
curl -s http://127.0.0.1:18000/health/ready
```

返回的 `status` 是 `ready`，`access_mode` 是 `enforced`，就说明 Server 正常运行，并且鉴权已经生效。`/health/live` 和 `/health/ready` 不需要 token，方便做健康检查，其余的 API、MCP 和 Dashboard 不带 token 都会返回 401。所有持有 token 的人共享同一个管理员身份，没有多用户权限，个人使用够了。

### 通过 Cloudflare Tunnel 暴露

PowerContext 内置的只有 HTTP，没有 TLS 选项，HTTPS 需要在外面一层终结。我的虚拟机上已经有一个跑着其他服务的 cloudflared，只需要在 ingress 里加一条规则，放在最后的 404 兜底规则前面：

```yaml
ingress:
  - hostname: context.example.com
    service: http://localhost:18000
  - service: http_status:404
```

改完先用 `cloudflared tunnel ingress validate` 校验，再用 `cloudflared tunnel ingress rule https://context.example.com/` 确认请求会命中新规则，然后在 Cloudflare DNS 里给这个子域名加一条 CNAME，指向 `<tunnel-id>.cfargotunnel.com` 并开启代理，最后重启 cloudflared。注意重启会让同一个 Tunnel 上的其他服务中断几秒。

### Dashboard 登录 403 的坑

部署好以后，我在浏览器打开 Dashboard，输入 token 后直接得到一个 403，换成故意输错的 token，结果也一样。翻了源码才发现，登录接口在校验 token 之前，会先检查浏览器发来的 `Origin` 和 Server 看到的请求 scheme 是否一致，不一致就直接拒绝。

问题出在链路中间：Cloudflare 到 cloudflared 这一段是 HTTPS，cloudflared 到容器这一段已经是 HTTP，真实协议只能靠 `X-Forwarded-Proto: https` 这个头传进去。容器里的 [[uvicorn]] 默认只信任来自 `127.0.0.1` 的转发头，而对容器来说，请求来自 Docker 网关 `172.31.0.1`，于是这个头被忽略，scheme 被当成了 `http`，和浏览器的 `https` 对不上。

解决方法就是前面 `.env` 里的 `FORWARDED_ALLOW_IPS=172.31.0.1`，让 uvicorn 信任 Docker 网关传来的转发头。网关 IP 取决于 compose 网络的子网，所以我在 compose 里把子网固定了下来，避免以后重建网络后 IP 变化，这个修复又悄悄失效。如果你用 [[Nginx]] 或 [[Caddy]] 做反向代理，也会遇到同样的问题，处理思路是一样的。

另外一个小细节是 `/mcp` 会 307 重定向到 `/mcp/`。插件生成的地址不带斜杠，问题不大；如果要在其他 MCP 客户端里手动配置，直接写 `https://context.example.com/mcp/` 可以少一次跳转。

### 在 Claude Code 中连接远程 Server

客户端这边，先安装与 Server 相同版本的 CLI：

```bash
uv tool install --force "powercontext[cli,server]==1.4.1"
```

插件的 MCP 配置里，`Authorization` 头写的是 `${POWERCONTEXT_CLAUDE_AUTHORIZATION:-}`，hook 也从同一组环境变量读取 Server 地址和 token。官方不建议把 token 写进插件配置、`.mcp.json` 或者 URL 里，所以我单独建了一个只有自己可读的文件：

```bash
mkdir -p ~/.config/powercontext && chmod 700 ~/.config/powercontext
umask 077
cat > ~/.config/powercontext/client.env <<'EOF'
POWERCONTEXT_CLIENT_SERVER_URL=https://context.example.com
POWERCONTEXT_CLIENT_API_TOKEN=<token>
POWERCONTEXT_CLAUDE_SERVER_URL=https://context.example.com
POWERCONTEXT_CLAUDE_AUTHORIZATION="Bearer <token>"
EOF
```

再在 `~/.zshrc` 里加载它，保证启动 Claude Code 的 shell 里有这些变量：

```bash
[ -f ~/.config/powercontext/client.env ] && { set -a; . ~/.config/powercontext/client.env; set +a; }
```

`powercontext ready` 返回 `Status: ready`，就说明客户端和远程 Server 连通了。之后安装插件：

```bash
powercontext setup claude-code \
  --ref powercontext-v1.4.1 \
  --server-url https://context.example.com \
  --no-capture-prompts
powercontext doctor claude-code
```

`--no-capture-prompts` 的意思是不把每条提示词都存成 Source。在 Basic memory 模式下，Server 不会对这些 Source 做自动抽取，存下来也只是原始记录，所以我先关掉了，以后上了 Full memory 再打开也不迟。

如果想给某个项目单独建 Scope，又不想去找插件的安装目录，可以直接用 CLI 绑定。插件识别工作区的方式，是对 git 根目录的绝对路径取 sha256，按同样的算法算出来就能绑定：

```bash
powercontext scope create --title "my-project" --summary "图床服务"
cd ~/projects/my-project
WS=$(python3 -c 'import hashlib,os,pathlib,subprocess
r=subprocess.run(["git","rev-parse","--show-toplevel"],capture_output=True,text=True).stdout.strip() or os.getcwd()
print(hashlib.sha256(os.fsencode(pathlib.Path(r).resolve())).hexdigest())')
powercontext scope binding set "scp_xxx" --integration claude-code --kind workspace --external-id "$WS"
```

`scp_xxx` 换成 `scope create` 返回的真实 ID。

### 升级和备份

升级时切换 submodule 的 tag，修改 `.env` 里的 `PC_VERSION`，然后重新构建：

```bash
git -C src fetch --depth 1 origin tag powercontext-vX.Y.Z
git -C src checkout powercontext-vX.Y.Z
docker compose up -d --build
```

Server 升级之后，客户端的 CLI 和 Claude Code 插件要跟着升到同一个版本，否则召回可能静默失效。所有数据都在 `~/powercontext-data` 这一个目录里，备份 SQLite 文件前先停掉容器，避免拷到写了一半的数据：

```bash
docker compose stop
sudo tar czf powercontext-data-$(date +%F).tar.gz -C ~ powercontext-data
docker compose start
```

也可以用 `powercontext archive` 导出可移植的逻辑备份。

## 使用建议

用了一段时间，有几点体会可以分享。第一是先从 Basic memory 开始，不配置任何模型，只用显式保存和 Handoff，就已经能解决跨 Agent 交接的大部分痛点，等确实需要自动抽取再上 Full memory。第二是不要把密钥、Token 等敏感信息写进 Memory、Work Contract 或 Handoff，这些内容会在召回时注入到其他 Agent 的上下文里。第三是服务部署在远程机器上时，务必启用 `POWERCONTEXT_SERVER_ACCESS_MODE=enforced` 和 Token 认证，并走 HTTPS，客户端默认只允许回环地址上的明文 HTTP。第四是升级时 Server、插件、客户端要一起升级，1.3.0 对已有数据库还需要做离线的 Atomic Memory 迁移，升级前记得备份数据库。

另外，`powercontext doctor codex` 和 `doctor claude-code` 只检查安装和连接状态，并不能证明记忆真的在工作。比较靠谱的验证方法是：在一个会话里说一个具体决策，确认它在 Dashboard 中作为 Source 出现，然后开一个新会话（最好换一个 Agent），问它刚才的决策是什么，看能否带引用地答出来。

## 和 Nowledge Mem 怎么搭配

如果已经在用 Nowledge Mem，还有必要再装一个 PowerContext 吗？我的看法是两者的职责重叠不多，不用二选一。Nowledge Mem 围绕的是「人」，沉淀的是偏好、服务器配置、过去做过的决定这类跨项目通用的东西，网页上和 AI 的对话也能通过浏览器扩展同步进去；PowerContext 围绕的是「项目」，用 Scope 隔离不同项目，用 Handoff 解决换会话、换 Agent 之后接着干的问题。召回方式也正好相反：PowerContext 在每条提示词提交前通过 Hook 自动注入上下文，不容易漏，但每次都多一次请求，注入的内容也不一定相关；Nowledge Mem 只在会话开始时注入一份简报，其余交给 Agent 自己判断什么时候去搜，省 Token，代价是 Agent 没想到要查的时候就会漏掉。关于 Nowledge Mem 的完整使用体验，可以看 [Nowledge Mem 使用半年体验：让所有 AI Agent 共享同一份记忆](https://blog.einverne.info/post/2026/11/nowledge-mem-review-after-half-year.html)。

所以我的做法是让 Nowledge Mem 继续做个人长期记忆，PowerContext 只在少数长期项目里绑定 Scope，用来做交接。同时开启要注意一点：两个插件都会在 Claude Code 的 Hook 里注入内容，上下文会变重，也可能出现重复。建议先在一个项目里小范围试，观察一段时间，看 PowerContext 召回的内容是否有用、和 Nowledge Mem 的简报重复了多少，再决定要不要扩大范围。

## 最后

PowerContext 解决的问题很朴素：工作很少由开始它的那个会话完成。它的价值不在于又多了一个记忆数据库，而在于把「决策、约束、当前状态、下一步」这些真正贵的上下文从对话里剥离出来，变成带版本、可审核、可追溯的 Artifact，并且通过 Scope 让不同的 Agent 共享同一份。Handoff 的四步闭环和 Experience、Skill 的审核机制，体现的是一种克制的设计：模型可以提议，但不能悄悄替你做决定。

对我这种在多个 Coding Agent 之间来回切换的人来说，这比在每个 Agent 里各维护一份记忆文件要省心得多。目前项目迭代很快，Windows 支持还是实验性的，部分 Agent 集成也是社区维护，生产环境使用前最好先跑一遍官方的 Jupyter 教程。

