---
layout: post
title: "呆呆面板 MCP 配置教程：让 Claude、Cursor 用自然语言管理定时任务"
aliases:
- "呆呆面板 MCP 配置教程：让 Claude、Cursor 用自然语言管理定时任务"
tagline: "从开启开关、创建 Open API 应用到 HTTP 与 stdio 两种接入方式的完整实践"
description: "呆呆面板（daidai-panel）内置了 MCP 服务，可以让 Claude Desktop、Claude Code、Cursor、Cherry Studio 等 AI 客户端直接查询任务、巡检失败日志、管理环境变量和脚本。本文详细介绍 MCP 的开启方式、Open API 应用权限设计、HTTP 与 stdio 两种接入配置、工具清单、实际使用场景以及安全上的注意事项。"
category: 经验总结
tags: [daidai-panel, mcp, claude, cursor, executor, self-hosted, cron, ai-agent, homelab]
create_time: 2026-10-19 13:54:12
last_updated: 2026-10-24 14:43:53
---

前两天写了一篇 [呆呆面板 daidai-panel：轻量级青龙面板替代品介绍与 Docker 部署教程](https://blog.einverne.info/post/2026/10/daidai-panel.html)，在那篇文章里我提到呆呆面板和 [[qinglong|青龙面板]] 最明显的代差是内置了 [[MCP]] 服务，但只是简单带过。面板搭起来、脚本陆续迁移进来之后，我每天早上要做的第一件事就变成了打开面板，挨个看昨晚哪些任务失败了、报的什么错、是 Cookie 过期还是网站改版。这种重复又琐碎的巡检，恰好是 AI 最擅长替人做的事情。所以这一篇就专门聊聊呆呆面板的 MCP 怎么配置、怎么接入不同的客户端，以及在权限上应该怎么取舍。

![呆呆面板 MCP](https://pic.einverne.info/images/2026-10-19-13-58-00-daidai-panel-mcp.png)

## MCP 能给面板带来什么

[[MCP]]（Model Context Protocol）是 [[Anthropic]] 提出的一套开放协议，用来让大模型客户端以统一的方式调用外部工具。以前想让 AI 帮你操作某个系统，要么自己写 Function Calling 的胶水代码，要么把 API 文档贴给它让它生成 curl 命令，再自己复制粘贴执行。有了 MCP 之后，服务端只需要把能力声明成一组工具，[[Claude Desktop]]、[[Claude Code]]、[[Cursor]]、[[Cherry Studio]]、[[AstrBot]] 这些客户端连上之后就能自己发现并调用这些工具，用户只需要用自然语言描述想做的事。

呆呆面板的 MCP 服务是直接内置在面板里的，不需要额外部署任何东西。它的工具集和面板的 Open API 能力是对齐的，日常运维里能通过开放 API 做的事情，基本都能在 MCP 里找到对应的工具。只读模式下，AI 可以分页查询任务、查看任务配置、读取最近一次的执行日志、按结果筛选执行记录、浏览脚本目录、读取脚本内容、查看订阅和备份列表以及系统资源占用。管理员放开写入之后，AI 还能运行和停止任务、新建和修改任务、增删改环境变量、保存和回滚脚本、直接执行一段代码片段、管理订阅、发送通知，甚至创建和恢复备份。

我觉得这个设计最聪明的地方在于，所有 MCP 工具最终都是经过面板的开放 API 执行的。这意味着 MCP 并没有引入一套新的权限体系，AI 能碰哪些模块完全由 Open API 应用勾选的权限范围决定，每一次工具调用都会记进「Open API」页面的调用日志，并且计入应用的调用频率限制。对于一个能在服务器上执行任意代码的面板来说，这种「复用已有边界」的做法比单独再造一套鉴权要让人放心得多。

## 开启 MCP 服务

MCP 默认是关闭的，需要在面板的「系统设置」→「MCP 服务」里手动打开。这里有两个开关，第一个是「启用 MCP 服务」，不打开的话 HTTP 接口一律返回 403，容器里的 `ddp mcp` 命令也会直接报错退出。第二个是「允许写入与执行工具」，默认同样关闭，此时 AI 只能看到和调用查询类工具，写入类工具在工具清单里是完全不出现的，而不是出现了再拒绝。打开之后才会提供运行任务、修改环境变量、保存与运行脚本这些能力。

两个开关修改后立即生效，不需要重启面板。比较贴心的一点是，已经连着的 `ddp mcp` 进程在每次调用工具之前都会重新检查开关状态，所以如果你发现 AI 在做一些不该做的事，直接去设置里把开关关掉，下一次调用就会拿到错误，不需要去找客户端那边的进程把它杀掉。我的建议是先只开第一个开关，用只读模式跑一段时间，确认客户端的行为符合预期之后，再考虑要不要放开写入。

## 创建 Open API 应用并分配权限

MCP 的凭据来自 Open API 应用。在面板的「Open API」页面新建一个应用，记下 `app_key` 和 `app_secret`，注意密钥只会显示这一次，关掉弹窗就再也看不到了。然后按需要勾选权限范围，每个范围对应一组 MCP 工具：

| 权限范围 | 对应的工具 |
| --- | --- |
| `tasks` | list_tasks、get_task、get_task_log、list_task_labels、run_task、stop_task、set_task_enabled、batch_task_action、create_task、update_task、batch_set_task_notify |
| `logs` | list_logs、get_log |
| `envs` | list_envs、export_envs、create_env、update_env、delete_env、batch_env_action、import_envs |
| `scripts` | list_scripts、get_script_tree、read_script、list_script_versions、save_script、run_script、run_code、delete_script、rename_script、move_script、copy_script、batch_delete_scripts、rollback_script |
| `subscriptions` | list_subscriptions、pull_subscription、create_subscription、update_subscription、delete_subscription、set_subscription_enabled |
| `system` | get_system_info、get_dashboard |
| `notifications` | send_notification |
| `backup` | list_backups、create_backup、delete_backup、restore_backup |

没有勾选的模块，对应工具被调用时会返回「应用无权访问此资源」。这里需要特别注意几个高危权限。`scripts` 权限等同于可以在面板上执行任意代码，因为 `run_code` 可以直接执行代码片段，或者保存一个脚本再运行它；`tasks` 权限可以新建和修改任务的命令，本质上也是任意代码执行；`envs` 能改写所有凭据；`backup` 则可以用一份备份覆盖整个面板。

我的做法是按用途建多个应用，而不是一个应用勾满所有权限。比如给日常巡检用的应用只勾 `tasks`、`logs`、`system`，即使「允许写入」开关打开了，它最多也就是能运行和停止任务，碰不到脚本和环境变量。真要让 AI 帮忙改脚本的时候，再单独用另一个带 `scripts` 权限的应用，用完把这个应用禁用掉，禁用会立即生效。如果用面板的登录令牌而不是应用凭据来连接，权限会按账号角色来限制，其中备份类工具要求管理员身份。

## HTTP 方式接入

HTTP 方式走的是 MCP 的 Streamable HTTP 传输，地址就是你在浏览器里访问面板的地址后面加上 `/api/v1/mcp`，例如 `http://192.168.1.10:5700/api/v1/mcp`。这是适用面最广的方式，大多数客户端都支持，而且如果你的面板是跑在手机上的 Magisk 模块版，这是唯一可用的方式。

鉴权有两种选择。一种是 `Authorization: Basic <base64(app_key:app_secret)>`，直接用应用凭据，最省事；另一种是 `Authorization: Bearer <令牌>`，令牌可以是通过 `POST /api/v1/open-api/token` 换来的应用令牌（有效期 24 小时），也可以是面板的登录令牌。对于 MCP 客户端这种长期配置的场景，Basic 显然更合适，不用担心令牌一天后过期。

生成 Basic 凭据的方法如下，注意 `echo` 一定要带 `-n`，否则末尾多出来的换行符也会被编码进去，导致鉴权失败：

```bash
# Linux / macOS
echo -n 'app_key:app_secret' | base64
```

```powershell
# Windows PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('app_key:app_secret'))
```

### 先用 curl 测一下

在配置任何客户端之前，我习惯先用 curl 确认服务是通的。下面这条命令会请求 MCP 的 `tools/list` 方法，正常情况下应该返回一份工具清单：

```bash
curl -s http://192.168.1.10:5700/api/v1/mcp \
  -u 'app_key:app_secret' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

`-u` 参数会让 curl 自己处理 Basic 编码，比手动拼 header 方便。如果返回 403，先去确认「启用 MCP 服务」的开关有没有打开；如果返回的工具清单里只有查询类工具，说明「允许写入与执行工具」还没开，这是正常的。顺便可以观察一下，返回的工具数量会随着「允许写入」开关的状态变化，这也印证了前面说的写入类工具在只读模式下是完全隐藏的。

### 配置 Cursor 等支持远程地址的客户端

支持远程 MCP 地址的客户端，比如 [[Cursor]]，直接在 MCP 配置文件里填 URL 和 header 即可：

```json
{
  "mcpServers": {
    "daidai-panel": {
      "url": "http://192.168.1.10:5700/api/v1/mcp",
      "headers": {
        "Authorization": "Basic <上面生成的 base64>"
      }
    }
  }
}
```

如果你和我一样主要在终端里用 [[Claude Code]]，可以用一条命令添加，`--transport http` 指定 Streamable HTTP，`--header` 带上鉴权信息，`--scope user` 让它在所有项目里都可用：

```bash
claude mcp add --transport http --scope user daidai-panel \
  http://192.168.1.10:5700/api/v1/mcp \
  --header "Authorization: Basic <上面生成的 base64>"
```

添加完成后在 Claude Code 里输入 `/mcp` 可以看到连接状态和可用的工具列表。

### 只支持 stdio 的客户端

有些客户端只支持拉起本地进程的 stdio 方式，比如 [[Claude Desktop]] 的本地配置文件。这时可以借助 [mcp-remote](https://www.npmjs.com/package/mcp-remote) 把远程的 HTTP 服务转成本地的 stdio，前提是本机装了 Node.js：

```json
{
  "mcpServers": {
    "daidai-panel": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "http://192.168.1.10:5700/api/v1/mcp",
        "--header", "Authorization:Basic <上面生成的 base64>"
      ]
    }
  }
}
```

注意这里 `Authorization:` 和 `Basic` 之间没有空格，这是 mcp-remote 的写法。在 Windows 上，部分客户端传参时对空格的处理有问题，mcp-remote 官方文档也提到过这个坑，用这种不带空格的写法可以规避。

### HTTP 方式的几个细节

呆呆面板的 MCP 服务是无状态的，每个 POST 请求独立处理、直接返回 JSON，不会开 SSE 长连接，`GET` 和 `DELETE` 请求会返回 405。这意味着它对反向代理非常友好，不需要像日志流那样专门去关 `proxy_buffering`，套在 Nginx 或 [[Cloudflare Tunnel]] 后面都不会有断流的问题。

如果请求带有 `Origin` 头（也就是从浏览器里发起的），面板会要求来源与面板同源、来自局域网 IP，或者已经写在 `config.yaml` 的 `cors.origins` 里，否则返回 403。这是为了防止恶意网页在你浏览时偷偷调用局域网里的面板。

最重要的一点是，如果要从公网访问，一定要套 HTTPS。Basic 凭据只是 base64 编码，不是加密，在明文 HTTP 上传输时同一个网络里的人可以直接看到并解码，而这串凭据背后可能是一个能执行任意代码的应用。我自己的做法是不把面板暴露到公网，在外面通过 [[Tailscale]] 连回家里的网络再访问 MCP，这样配置里的地址也可以继续用内网 IP。

## stdio 方式接入

另一种方式是在面板所在的机器或容器里运行 `ddp mcp` 命令，它以 stdio 的方式和客户端通信，内部再通过本机 HTTP 调用正在运行的面板。所以面板本身必须是运行状态，`ddp mcp` 自己不会直接去改数据库。命令格式如下：

```text
ddp mcp --app-key <app_key> --app-secret <app_secret> [--url http://127.0.0.1:5701]
```

三个参数都有对应的环境变量，不想把密钥写在命令行里的话可以用环境变量传：

| 参数 | 环境变量 | 说明 |
| --- | --- | --- |
| `--url` | `DDP_MCP_URL` | 面板后端地址，默认 `http://127.0.0.1:<面板后端端口>` |
| `--app-key` | `DDP_MCP_APP_KEY` | 应用的 app_key |
| `--app-secret` | `DDP_MCP_APP_SECRET` | 应用的 app_secret |

`ddp mcp` 的 stdout 只输出 MCP 协议消息，就绪提示和错误信息都写到 stderr，所以如果客户端连不上，去看客户端记录的 stderr 日志就能找到原因。

对于 Docker 部署、客户端装在宿主机上的情况，可以用 `docker exec` 把命令转进容器：

```json
{
  "mcpServers": {
    "daidai-panel": {
      "command": "docker",
      "args": [
        "exec", "-i", "daidai-panel",
        "ddp", "mcp", "--app-key", "<app_key>", "--app-secret", "<app_secret>"
      ]
    }
  }
}
```

`daidai-panel` 换成你自己的容器名。这里的 `-i` 参数千万不能少，stdio 传输依赖标准输入，没有 `-i` 的话 stdin 接不上，客户端会一直卡在初始化阶段，也不会有明显的报错，排查起来很费劲。另外不要加 `-t`，分配 TTY 会让输出里混进控制字符，破坏 JSON-RPC 消息。如果是二进制部署，`command` 直接写 `ddp` 的完整路径，`args` 写成 `["mcp", "--app-key", "…", "--app-secret", "…"]` 即可。

那么 HTTP 和 stdio 该怎么选？我的看法是，只要客户端支持远程地址，优先用 HTTP。stdio 方式要求客户端和面板在同一台机器上，或者至少能 `docker exec` 进容器，而大多数人的面板是跑在 NAS 或 VPS 上的，AI 客户端则在自己的笔记本上，这种情况下 stdio 反而要多绕一层 SSH。stdio 更适合面板和客户端在同一台机器上的场景，好处是不用经过网络，也就不用操心 HTTPS 的问题。Magisk 模块版的面板跑在手机的容器里，电脑上的客户端进不去这个容器，只能用 HTTP。

## 通过 Executor 统一接入

上面的几种配置方式有一个共同的麻烦：每个客户端都要单独配一遍。Cursor 写一份 JSON，Claude Code 跑一条 `claude mcp add`，Claude Desktop 再套一层 mcp-remote，同一串 Basic 凭据被复制到好几个配置文件里。哪天轮换了 `app_secret`，又得挨个去改。我之前写过一篇 [Executor：多 Agents 和外部世界之间的统一代理层](https://blog.einverne.info/post/2026/09/executor-integration-layer-for-ai-agents.html)，[[Executor]] 正好解决这个问题：把呆呆面板的 MCP 作为一个上游集成加到 Executor 里，各个 Agent 只连 Executor 这一个端点，面板的工具就会自动出现在所有客户端里。

配置方式很直接。在 Executor 的 Web 控制台点 Add Integration，填入面板的 MCP 地址 `http://192.168.1.10:5700/api/v1/mcp`，Executor 会识别出这是一个远程 MCP server 并索引出工具清单。鉴权有两个地方可以放：一个是集成上的 Request headers，填进去的 header 会原样附加在每次请求上；另一个是认证方式里的 API Key 类型，把位置设成名为 `Authorization` 的 header、前缀设成 `Basic `，值填前面生成的 base64，凭据就会挂在 connection 上。Executor 自己的说明是 Request headers 适合放端点级别的访问令牌（比如 Cloudflare Access 的 service token），每个账号自己的凭据应该放到认证方式里。呆呆面板的 `app_key:app_secret` 属于后者，所以我选了第二种。保存之后用 `executor tools search` 搜一下 `list_tasks`，能搜到就说明通了。

这样做除了省掉重复配置，还有几个和呆呆面板的权限设计很契合的地方。

第一是凭据不再出现在任何客户端的配置文件里。Basic 凭据存在 Executor 的 connection 上，只在真正向面板发请求的时候才附加上去，Agent 从头到尾看不到它。对于一个能执行任意代码的面板来说，凭据少散落一个地方，就少一分泄露的可能。

第二是前面说的「按用途建多个 Open API 应用」可以直接对应到 Executor 的 connection 上。同一个呆呆面板集成可以建两个 connection，一个用只勾了 `tasks`、`logs`、`system` 的巡检应用，另一个用带 `scripts` 权限的应用，需要改脚本时才用后者。如果你在好几台机器上都跑了面板，也可以每台建一个 connection，各自指向不同的地址。

第三是补上了工具级别的审批。呆呆面板的「允许写入」开关是一刀切的，打开之后 `run_task` 和 `restore_backup` 对 AI 来说同样可以直接调用。在 Executor 里可以给每个工具单独设策略，比如查询类工具设成 allow，`run_task`、`update_env` 设成 require approval，`run_code`、`delete_script`、`import_envs`、`restore_backup` 这类高危工具直接 block。这样即使面板那边放开了写入，危险操作也还要经过一道人工确认。

网络上也顺便简化了。我的 Executor 是在家里的服务器上用 Docker 自托管的，和呆呆面板在同一个局域网，Executor 直接用内网 IP 访问面板就行。在外面的时候，Agent 连的是 Executor 的端点，面板本身依然不需要暴露到公网。不过这也意味着 Executor 成了一个集中存放凭据的服务，它自己的入口一定要做好 HTTPS 和认证。另外大部分 MCP 客户端只在启动时加载工具列表，第一次在 Executor 里加完集成之后，记得重启客户端或者开一个新会话。

## 实际怎么用

配置好之后，就可以直接用自然语言和面板对话了。下面是我觉得最有价值的几类用法。

第一类是每日巡检。直接问「昨天晚上有哪些任务失败了？把失败原因按类型归一下类」，AI 会调用 `list_logs` 按结果筛选出失败的执行记录，再逐个用 `get_log` 读日志正文，最后把 Cookie 失效、网络超时、脚本报错分开列出来。以前我要在网页上一个个点开日志翻，现在一句话就能拿到一份整理好的结论。如果再给应用勾上 `notifications`，还可以让 AI 把巡检结果通过 `send_notification` 推送到 Telegram 或 Bark，不指定渠道的话会发给所有标记为「默认推送」的渠道。

第二类是排查单个任务。比如「京东签到这个任务最近为什么一直失败？看看脚本和最近的日志」，AI 会先用 `list_tasks` 按关键词找到任务，`get_task` 看配置，`get_task_log` 读日志，再用 `read_script` 把脚本读出来对照分析。`read_script` 支持按字节分段读取，大文件不会被静默截断，返回里有 `truncated` 和 `next_offset` 字段，AI 会自动续读，而且分段一定落在 UTF-8 字符边界上，中文注释不会被切成乱码。

第三类是批量整理，这类操作需要放开写入。比如「把所有标签是签到的任务都打开失败通知」，AI 会用 `list_task_labels` 和 `list_tasks` 找到这些任务，再调用 `batch_set_task_notify` 批量修改，它只改传入的开关、不会动通知渠道。又比如脚本改名或者移动之后，引用它的任务命令不会自动更新，这时可以让 AI 找出所有受影响的任务，再用 `update_task` 逐个同步命令。这种机械但容易漏的活交给 AI 非常合适。

还有一个小技巧，`get_system_info` 返回的 `machine_code` 是面板首次启动时生成的，重启和升级都不会变，如果你和我一样在好几台机器上都跑了面板，可以用它作为实例的唯一标识，让 AI 区分「这份日志来自哪一台」。不过要注意，用另一个实例的备份恢复「配置」之后，机器码会变成那个实例的。

## 需要注意的限制和坑

单次工具调用的输出上限大约是 64KB，超出的部分会被截断并注明。任务和日志比较多的时候，可以提示 AI 减小 `page_size` 或者加关键词缩小范围。`get_task_log` 和 `get_log` 遇到过长的日志也只会保留末尾，好在报错信息通常就在末尾，影响不大。

脚本相关的工具对一些目录是一律拒绝访问的，包括 `.git`、`.svn`、`.hg`、`.bzr` 这类版本库元数据目录，以及 `node_modules`、`__pycache__` 这类依赖和缓存目录，路径中任意一段命中都算，不区分大小写。拦截 `.git` 的原因很有意思：订阅如果用 Token 鉴权，仓库的 `.git/config` 里存着带访问令牌的远程地址，能读这个文件就等于把令牌交给了任何有脚本权限的人，所以这条规则是写死的、不可配置。如果 AI 返回「该路径不可访问」，不要让它反复重试，这是有意的安全限制。确实需要清理 `__pycache__` 之类的目录，可以让 AI 用 `run_code` 执行 `rm -rf "$DAIDAI_SCRIPTS_DIR/某个子目录/__pycache__"`，`run_code` 的工作目录是临时目录，脚本目录的绝对路径在环境变量 `DAIDAI_SCRIPTS_DIR` 里。

环境变量的遮蔽规则和网页端一致，名称里含 TOKEN、SECRET、PASSWORD、COOKIE，或者某一段是 KEY、PWD、PASS、AUTH、CK 的变量，在 MCP 的输出里都会被遮蔽成星号，目的是不把真实凭据送进 AI 的上下文，毕竟这些内容最终是要发给模型服务商的。`list_envs` 的关键词搜索也不会去匹配这些变量的值，避免被拿来逐字符试出凭据。反过来，`import_envs` 会拒绝把遮蔽后的值（比如 `pt_******zz;`）导回敏感变量，防止真实凭据被一串星号覆盖。不过要清楚，这层遮蔽只作用于 MCP，拥有 `envs` 权限的应用直接调开放 API 仍然能读到明文。

另外，带有「重要」标记的环境变量在 `list_envs` 和 `export_envs` 的输出里会带 `important` 字段，按设计 AI 在删除或替换导入这些变量之前应该先向用户确认，但面板本身并不拦截删除操作，所以这条防线其实取决于 AI 客户端是否遵守。`import_envs` 的 `replace` 模式会先删除全部现有变量再导入，重要变量也不例外，这一点值得在让 AI 批量导入之前心里有数。

`run_script` 和 `run_code` 最多会等待大约 50 秒，脚本还没跑完的话会返回一个 `run_id`，用同一个 `run_id` 再调用就能继续取输出，加上 `stop: true` 可以停止。需要注意的是，这段等待期间的轮询也会计入调用频率限制，如果你给应用设的频率比较低，跑长脚本时可能会先撞上限流。

最后是备份恢复。`restore_backup` 会用备份覆盖当前数据，备份里包含的每一项都会先被清空再写入，恢复配置还会替换开放 API 应用，也就是说 AI 正在用的这个凭据可能在恢复之后直接失效。网页端恢复后面板会自动重启，而通过 MCP 恢复不会，恢复后需要手动重启一次面板。工具清单里所有会删除或覆盖数据的工具都带有 `destructiveHint: true` 注解，支持这个注解的客户端会在调用前弹出确认，但我还是建议在让 AI 执行 `restore_backup` 之前，先让它 `create_backup` 留一份当前状态。

## 最后

呆呆面板的 MCP 实现给我的感觉是很克制。默认关闭、开启后默认只读、写入要单独授权、权限完全复用 Open API 的应用范围、每次调用都有日志、凭据类变量在 AI 上下文里自动遮蔽，这几层叠在一起，基本上把「让 AI 操作一个能执行任意代码的面板」这件事的风险控制在了可以接受的范围内。它没有为了 AI 另造一套体系，而是把已有的开放 API 包装成工具，这种做法既降低了维护成本，也让熟悉 Open API 的人几乎零学习成本就能上手。

写入权限我目前只在整理任务、批量改通知这类场景里临时打开，用完就关掉。如果你也在用呆呆面板，不妨先从一个只勾 `tasks` 和 `logs` 的只读应用开始试试，体验一下用自然语言管理定时任务是什么感觉。至于上一篇最后说到的各种脚本玩法，我会在下一篇里继续展开。

## 参考链接

- [呆呆面板 MCP 使用说明](https://github.com/linzixuanzz/daidai-panel/blob/main/docs/mcp.md)
- [linzixuanzz/daidai-panel](https://github.com/linzixuanzz/daidai-panel)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [mcp-remote](https://www.npmjs.com/package/mcp-remote)
- [Executor MCP Proxy](https://github.com/UsefulSoftwareCo/executor/blob/main/apps/docs/mcp-proxy.mdx)
