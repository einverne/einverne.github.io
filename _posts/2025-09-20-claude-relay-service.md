---
layout: post
title: "搭建 Claude Code 中转服务"
aliases:
  - "搭建 Claude Code 中转服务"
tagline: ""
description: ""
category:
tags: [ claude-code, claude, codex, gemini, google-gemini, relay-service, ]
create_time: 2025-09-23 23:03:36
last_updated: 2025-09-23 23:03:36
dg-home: false
dg-publish: false
---

[Claude Relay Service](https://github.com/Wei-Shaw/claude-relay-service) 是一个开源服务的 Claude Code 镜像服务，主要用于“中转”（relay）和管理多个 Claude Code 账号，使开发团队或个人可以最大化每个账号的使用配额，通过统一入口自动进行负载均衡和账号切换，从而有效规避单一账号因速率限制或额度问题导致的服务中断。

Claude Relay Service 兼容 Gemini-cli、Codex-cli 等多种工具，支持多账户切换、自定义 API 密钥、Claude API 及 OpenAI 格式，能够有效规避封号风险，并集成 OAuth 便捷添加账号池。项目适合无法直接访问 Claude 服务、重视隐私、希望分摊订阅成本或对稳定性有高要求的用户。

通过自建，所有数据只经过自己的服务器，直连 Anthropic API，确保隐私安全和性能可控，费用透明。核心功能包括多账户自动轮换、自定义 API Key、详细使用统计、智能切换、性能优化、监控面板、安全控制、代理支持等。部署方式灵活，支持一键脚本安装、手动部署及 Docker 容器，最低硬件要求仅需 1 核 CPU、512MB 内存，软件依赖 Node.js 18+ 和 Redis 6+，推荐使用 Linux 系统。

Claude Relay Service 还支持 Webhook 通知，账号异常时可自动推送至企业微信、钉钉或 Slack，并提供详细的使用监控和日志管理。为生产环境部署，建议结合 Caddy 反向代理实现自动 HTTPS，提升安全性和访问速度。项目还具备客户端限制功能，通过 User-Agent 精细管控 API Key 的使用，提高系统安全。

## 部署

可以参考我的 [docker compose](https://github.com/einverne/dockerfile)，也可以直接使用官方的安装脚本， 不过更推荐自己通过 docker compose 进行安装，官方的脚本不过是在 docker compose 的基础之上封装了一层。

获取配置之后

```
cp env .env
# edit .env
docker compose up -d
```

然后可以使用 [[Nginx Proxy Manager]] 转发。

如果大家购买 Claude 或者 Codex 不方便也可以直接联系[我](https://gtk.pw/wechat)一起拼车。

## related

- [Claude Code Relay](https://github.com/RipperTs/claude-code-relay) 另外一个使用 Go 和 Vue 实现的 Claude Code 代理转发。
- [[Claude Code Router]] 将 Claude Code 请求路由到不同(渠道)的模型，并自定义任何请求。
