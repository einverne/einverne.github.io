---
layout: post
title: "Claude Code 第三方 API 代理配置 Headroom"
aliases:
  - "Claude Code 第三方 API 代理配置 Headroom"
tagline: "两层代理的串联配置细节"
description: "当你已经为 Claude Code 或 Codex 配置了第三方 API 代理时，如何正确接入 Headroom 上下文压缩层，避免代理链路配置错误。"
category: 经验总结
tags: [claude-code, headroom, api-proxy, token-optimization, llm, codex]
create_time: 2026-06-30 13:49:47
last_updated: 2026-06-30 13:49:47
---

最近在给自己的 AI 编程工作流加入 [[Headroom]] 上下文压缩工具时，遇到了一个需要特别注意的配置问题。相信有不少人和我一样，为了降低成本或者改善访问体验，已经在 [[Claude Code]] 或 [[Codex]] 里配置了第三方 API 代理，比如一些第三方聚合平台或者自建的转发服务。这时候想再套上一层 Headroom 做 Token 压缩，就需要特别注意配置细节，不然两层代理会打架。

## 为什么要用第三方代理

先简单说一下背景。使用 Claude Code 或 Codex 的时候，默认走的是 Anthropic 或 OpenAI 的官方 API。但很多人会出于各种原因选择第三方代理服务：账单更透明、支持多种模型统一路由、某些地区访问更稳定，或者是公司统一管控 API 调用。配置方法很简单，只需要设置一个环境变量：

```bash
export ANTHROPIC_BASE_URL="https://your-third-party-proxy.com"
export ANTHROPIC_API_KEY="your-key"
```

Claude Code 启动后会把所有请求发到这个地址，就像在用官方 API 一样，体验没有任何差别。

## Headroom 是什么

Headroom 是一个开源的 AI Agent 上下文压缩层，它在把内容发给大模型之前先进行压缩，去掉冗余信息，只保留关键内容。官方数据显示能节省 60%~95% 的 Token，对日志、JSON 这类结构化数据效果尤其明显。我之前写过一篇详细介绍，感兴趣可以看看[利用 Headroom 压缩上下文减少 Token 消耗](https://blog.einverne.info/post/2026/06/headroom-ai-context-compression-tool.html)。

Headroom 的常见使用方式有几种，其中最简单的是 CLI 包装模式：

```bash
headroom wrap claude
```

或者启动一个独立的本地代理：

```bash
headroom proxy --port 8787
```

这两种方式的本质都一样：Headroom 在本地起一个服务，拦截 Claude Code 发出的请求，压缩之后再转发给真正的 API 端点。

## 两层代理的配置陷阱

问题就出在这里。当你已经配置了第三方 BASE URL，同时又想加入 Headroom 时，完整链路应该是这样的：

```
Claude Code → Headroom（本地）→ 第三方代理 → 模型服务商
```

![Headroom 代理架构示意](https://pic.einverne.info/images/2026-06-30-13-49-47-headroom-proxy-architecture.png)

但如果你只是简单地运行 `headroom wrap claude` 或者 `headroom proxy`，Headroom 默认会把压缩后的请求发给 Anthropic 的官方 API，而不是你的第三方代理。这样一来，要么请求失败（Key 不匹配），要么绕过了你原本精心配置的代理链路。

## 正确的配置方式

解决方案是额外设置一个环境变量 `ANTHROPIC_TARGET_API_URL`，把它指向你的第三方代理地址，告诉 Headroom 压缩完之后把请求发到哪里：

```bash
export ANTHROPIC_TARGET_API_URL="https://your-third-party-proxy.com"
export ANTHROPIC_API_KEY="your-key"
```

然后再启动 Headroom：

```bash
headroom wrap claude
# 或者
headroom proxy --port 8787
```

Headroom 启动时会自动把 `ANTHROPIC_BASE_URL` 设置成它自己的本地端口（比如 `http://localhost:8787`），而 `ANTHROPIC_TARGET_API_URL` 才是 Headroom 压缩完之后真正转发的目标地址。

这两个变量各司其职，不能搞混：

- `ANTHROPIC_BASE_URL`：Claude Code 连接的入口，Headroom 会自动管理这个值，指向自己的本地端口
- `ANTHROPIC_TARGET_API_URL`：Headroom 把压缩后的请求转发到哪里，也就是你的第三方代理或官方 API

## 几个容易踩坑的地方

在实际配置过程中，有几个细节需要特别留意。

第一个是环境变量覆盖问题。如果你在 `.zshrc` 或 `.bashrc` 里已经设置了 `ANTHROPIC_BASE_URL` 指向第三方代理，那么 Headroom 启动时会用自己的本地端口覆盖掉这个值。这是预期行为，Headroom 必须让 Claude Code 先把请求发给自己才能拦截。所以建议不要在 shell profile 里硬编码 `ANTHROPIC_BASE_URL`，而是只设置 `ANTHROPIC_TARGET_API_URL`，让 Headroom 动态管理入口地址：

```bash
# 在 .zshrc 中推荐的配置
export ANTHROPIC_TARGET_API_URL="https://your-third-party-proxy.com"
export ANTHROPIC_API_KEY="your-key"
# 不要设置 ANTHROPIC_BASE_URL，Headroom 会自动管理
```

第二个是验证配置是否生效。Headroom 的代理模式提供了一个本地 Dashboard，启动后可以访问 `http://localhost:8787/dashboard` 查看实时的请求拦截和压缩统计。如果看到有流量进来、Token 节省数字在增长，说明链路是通的。也可以用命令行快速查看累计数据：

```bash
headroom stats
```

如果 Dashboard 显示请求为 0，或者 Claude Code 直接报连接错误，优先检查 `ANTHROPIC_TARGET_API_URL` 是否设置正确，以及 Headroom 进程是否还在运行。

第三个是 `headroom wrap` 和 `headroom proxy` 的选择。`headroom wrap claude` 会直接包装 Claude Code 的进程，两者生命周期绑定，退出 Claude Code 时 Headroom 也会退出，适合临时使用或者快速测试。`headroom proxy --port 8787` 是独立的后台服务，适合长期运行，而且如果你同时使用 [[Cursor]]、[[Aider]] 等多个工具，代理模式更方便，只需要把它们的 BASE URL 都指向 `http://localhost:8787` 就能共享同一个压缩层。

第四个是 Headroom 未运行时的回退情况。如果 Headroom 进程意外退出，而 `ANTHROPIC_BASE_URL` 还停留在 `http://localhost:8787`，Claude Code 就会连接失败。这也是上面那条建议"不要在 shell profile 里硬编码 `ANTHROPIC_BASE_URL`"的原因——让 Headroom 在启动时动态设置它，退出后这个变量的值在新的 shell session 里不会保留。

第五个是关于 Codex 的情况。[[Codex]] CLI 使用的是 OpenAI 格式的 API，对应的环境变量是 `OPENAI_BASE_URL` 和 `OPENAI_API_KEY`。Headroom 对 OpenAI 协议同样支持代理模式，配置思路完全相同，只是变量名不同 `OPENAI_TARGET_API_URL` 。具体映射关系以 Headroom 当前版本的文档为准，因为不同版本可能略有差异。

## 最后

给 Claude Code 接入 Headroom 的核心概念其实并不复杂：两层代理串联，各自负责不同的工作。Headroom 负责压缩 Token，第三方代理负责转发到模型服务。配置的关键就是把两层 URL 分开设置，用 `ANTHROPIC_TARGET_API_URL` 告诉 Headroom 压缩完之后把请求发往何处，而不是让它去覆盖你已有的第三方代理配置。这个细节文档里没有特别突出，实际踩坑之后才会发现。实际用下来，在代码搜索、日志分析这类工具密集型任务中，Token 消耗确实能明显减少，长对话的质量也更稳定，值得折腾一下。
