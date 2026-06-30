---
layout: post
title: "用 New API 打造个人 AI 网关：统一管理所有大语言模型接口"
aliases:
  - "为什么我要用 New API 统一管理大语言模型 API"
  - "New API 使用介绍"
tagline: "一个入口，管理所有大语言模型调用"
description: "介绍 New API 这款开源 API 网关工具，以及如何用它统一调度 OpenAI、Claude、DeepSeek 等多个大语言模型 API，解决接口不统一、费用分散、Key 管理混乱等痛点"
category: 经验总结
tags: [ai, llm, api, new-api, open-source]
create_time: 2026-06-08 00:00:00
last_updated: 2026-06-09 00:00:00
---

这段时间我同时用着好几个大语言模型服务：日常写作和代码靠 [[Claude]]，轻量任务交给 [[Codex]]，搜索增强用 [[Antigravity]]，还有几个本地跑着 [[Ollama]] 的小模型供离线场景使用。每个平台各自的 API Key 散落在项目环境变量里，月底要去好几个后台分别对账，想横向对比两个模型的输出还得打开不同的网页或客户端来回切换，很费事。

用这种方式折腾了一段时间之后，我开始认真找一个能统一管理这些 API 的工具。最终落在了 [[New API]] 上，用下来解决了不少痛点，今天把使用心得记录一下。

![New API 统一管理多个大语言模型接口](https://pic.einverne.info/images/2026-06-09-14-00-00-new-api-gateway.png)

## 什么是 New API

[[New API]] 是基于 [[One API]] 二次开发的开源 API 网关，可以将多个大语言模型的 API 统一封装成 [[OpenAI]] 兼容接口对外提供服务。简单来说，它在你的服务器上充当一个中间层，所有 AI 调用先到达这里，再由它转发到真正的模型服务商。对调用方而言，无论底层是 GPT、Claude 还是 DeepSeek，统一都是 [[OpenAI]] 格式的接口，切换模型不需要改任何代码逻辑。

项目持续在活跃开发中，功能比原版 One API 扩展了不少，对 Anthropic Claude、Google Gemini 等非 OpenAI 系模型的支持也更完善。项目地址：[Calcium-Ion/new-api](https://github.com/Calcium-Ion/new-api)

## 为什么用 New API

### 内置 Playground，随时对比不同模型

我日常需要测试和对比不同大语言模型的效果，如果每次都要打开不同平台的网页或启动客户端，切换成本很高。[[New API]] 内置了 Playground，可以直接在浏览器里对任意已配置的模型发起对话，调整 temperature、system prompt 等参数，不需要安装额外的客户端，在同一个界面里就能横向对比不同模型的输出质量和响应速度。对于需要经常评估新模型的场景，这个功能省了不少时间。

### 项目接入成本极低，切换模型只改一行

在自己的项目里，如果直接调用各家的 SDK，换一个模型就需要修改代码、更换 API Key、调整参数格式，有时候还要重写部分逻辑。[[New API]] 对外暴露统一的 OpenAI 兼容接口，项目里只需要设置一个 `base_url` 指向自己的 New API 实例，通过 `model` 参数的名称来切换底层模型。想从 `gpt-4o` 换到 `claude-sonnet-4-5`，只改一行配置就够了，代码逻辑完全不用动。

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-new-api-instance/v1",
    api_key="your-new-api-token"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5",  # 只需改这里就能切换底层模型
    messages=[{"role": "user", "content": "你好"}]
)
```

### 统一记录 API 调用费用

接入多个 AI 服务之后，费用分散在各个平台，很难统计实际花了多少钱，也不清楚哪些项目、哪些模型消耗最多。[[New API]] 会记录每一次 API 调用的 token 消耗和折算成本，可以按渠道、按模型、按用户 Token 分别查看使用量和费用。月底对账不再需要逐个平台登录，一个后台就能看清所有支出，哪里烧钱最多一目了然，预算控制也更有据可依。

### 分享给朋友，精细控制额度

如果有朋友想体验某个模型，不需要让他们自己去注册账号、购买 API Key。直接在 [[New API]] 里给他们创建一个令牌，设置额度上限和可访问的模型列表，他们用自己熟悉的客户端接入即可。用完额度自动停止，吊销某个令牌也不影响其他用户的正常使用，管理起来比直接分享原始 API Key 安全方便得多。

### 负载均衡与自动故障转移

同一个模型可以同时配置多个渠道，例如同时配置 [[OpenAI]] 官方渠道和备用中转渠道。[[New API]] 默认以负载均衡方式在多个渠道间分发请求，当某个渠道返回错误或余额耗尽时，系统会自动切换到下一个可用渠道，整个过程对调用方完全透明。对于自己的项目来说，这意味着不需要在代码里写任何重试逻辑，网关层已经帮你处理好了，可用性和稳定性都有保障。

### 隐藏真实 API Key，安全分发访问权限

直接把 [[OpenAI]] 或 Anthropic 的 API Key 写进项目环境变量或交给他人，一旦泄漏就需要立刻去官网吊销并重新申请，影响所有使用该 Key 的地方。通过 [[New API]]，对外发放的是自己生成的令牌（Token），真实的上游 API Key 只存在网关服务器上。令牌还支持设置过期时间、最大额度、允许访问的模型列表和 IP 白名单，可以做到精细的权限控制，吊销某个令牌不会波及其他用户。

### 模型名称映射，灵活调度渠道

[[New API]] 支持将自定义模型名映射到任意底层模型。例如可以把 `gpt-4` 映射到 [[DeepSeek]]，在成本较低的情况下处理大部分请求，只在需要时才真正调用 OpenAI。结合渠道优先级配置，可以实现「优先用便宜渠道，失败后自动回退到正式渠道」的调度策略，在保证可用性的同时有效控制成本，对于 API 调用量较大的场景尤其实用。

### 本地模型与云端模型统一调度

通过 [[Ollama]] 或其他本地推理框架运行的模型，可以作为一个渠道添加进 [[New API]]，与 GPT、Claude 等云端模型并列管理。项目代码只需改 `model` 参数就能在本地模型和云端模型之间切换，开发测试阶段用免费的本地模型，上线后切到云端，一套代码适配两种场景，既节省了开发期间的 API 费用，也保持了代码的一致性。

## 部署方式

[[New API]] 支持 [[Docker]] 一键部署，是最推荐的方式：

```bash
docker run --name new-api \
  -d \
  --restart always \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v /data/new-api:/data \
  calciumion/new-api:latest
```

部署完成后访问 `http://localhost:3000`，默认管理员账号密码为 `root` / `123456`，首次登录后务必立即修改。如果需要长期稳定运行，也可以使用 [[Docker Compose]] 配合 [[MySQL]] 或 [[PostgreSQL]] 作为数据库后端，数据持久性更有保障。

## 基本配置流程

1. 登录后台，进入「渠道」页面，添加各个 AI 服务的 API Key
2. 进入「令牌」页面，创建一个 Token 供自己或他人使用
3. 在「模型」页面确认各渠道对应的模型名称映射
4. 在 Playground 或自己的项目里，将 `base_url` 指向 New API 实例，使用创建的 Token 作为 API Key

配置逻辑很清晰：「渠道」对应上游 AI 服务，「令牌」对应下游使用方，通过模型名称将两者关联起来。整个结构理解一次之后就很好上手，后续新增渠道或调整额度也都是几步操作的事。

## 在 OpenClaw 中使用

[[OpenClaw]] 是一款支持接入 WhatsApp、Telegram、iMessage 等多个平台的本地 AI Agent 客户端，支持通过自定义 provider 接入任何 OpenAI 兼容协议的接口，[[New API]] 恰好满足这个条件，配置起来也比较简单。

### 找到配置文件

OpenClaw 的模型配置存放在 `openclaw.json` 中，不同系统路径不同：

- macOS：`~/Library/Application Support/OpenClaw/openclaw.json`
- Linux：`~/.config/openclaw/openclaw.json`
- Windows：`%APPDATA%\OpenClaw\openclaw.json`

修改前先备份原文件，以便出问题时可以回滚。

### 添加 New API 作为自定义 Provider

在 `openclaw.json` 的 providers 列表中添加一个条目，`api` 类型选择 `openai-completions`，`base_url` 填写 New API 实例地址加 `/v1`：

```json
{
  "providers": [
    {
      "provider": "newapi",
      "base_url": "https://your-newapi-host/v1",
      "api": "openai-completions",
      "api_key": "sk-your-newapi-token",
      "model": [
        { "id": "gpt-4o-mini", "name": "GPT-4o mini" },
        { "id": "claude-3-5-sonnet", "name": "Claude 3.5 Sonnet（中转）" },
        { "id": "deepseek-chat", "name": "DeepSeek V3" }
      ]
    }
  ]
}
```

`model.id` 必须与 New API 渠道中登记的模型名称完全一致，`base_url` 只写到 `/v1` 这一级，不要加 `/chat/completions`，OpenClaw 会自动拼接。

### 重载配置并验证

修改完成后执行 `openclaw restart` 重新加载配置，或在桌面端托盘菜单中选择 Restart Gateway。验证时先在 OpenClaw 模型选择列表中确认新 provider 出现，发送一条简单消息确认能收到流式响应，再到 New API 后台日志页面确认请求命中了正确的渠道。

### 常见问题

- 报错 `model not found`：`model.id` 与 New API 渠道里的名称大小写不一致，按渠道实际值修改。
- 响应超时转圈：New API 前置了 Nginx 或 Cloudflare 时，需要关闭响应缓冲（`proxy_buffering off;`），否则流式响应会被截断。
- 工具调用异常：通过 OpenAI 兼容端点访问 Claude 模型时，部分 Skill 依赖原生 Anthropic 协议，可将 `api` 类型改为 `anthropic-messages` 并指向 New API 的 `/v1/messages` 路径。

完整配置说明可参考：[[如何在 OpenClaw 中配置 New API 接口]]

## 最后

[[New API]] 本质上解决的是「多模型时代的接口碎片化」问题。接入的模型越多，统一入口的价值就越明显——费用聚合、权限管理、负载均衡这些能力在单一模型场景下感受不深，但一旦同时维护三四个以上的 AI 服务，有一个网关层会省心很多。

自建一个实例的成本很低，一台小服务器跑 Docker 就够了，运维负担几乎可以忽略。对我来说最大的收获是代码里再也不用散落各种 API Key，所有 AI 调用都经过同一个入口，调试和排查问题都清晰了不少。如果你也在同时使用多个大语言模型，不妨试试用 [[New API]] 把它们统一管理起来。
