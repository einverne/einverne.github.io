---
layout: post
title: "搭建 Claude Code 中转服务"
aliases:
  - "搭建 Claude Code 中转服务"
tagline: ""
description: ""
category: 经验总结
tags: [ claude-code, claude, codex, gemini, google-gemini, relay-service, self-hosted, ]
create_time: 2025-09-23 23:03:36
last_updated: 2025-09-23 23:03:36
dg-home: false
dg-publish: false
---

用过 [[Claude Code]] 的人都知道，单个 Claude Max 账号的配额在重度使用下很容易触顶，一旦达到速率限制（rate limit）就只能干等。如果是团队协作或者多设备使用的场景，这个问题更加明显。我之前尝试过手动在多个账号之间切换，但每次都要改配置、重新认证，体验很差。后来发现了 [Claude Relay Service](https://github.com/Wei-Shaw/claude-relay-service) 这个开源项目，自建之后彻底解决了这个痛点。

## Claude Relay Service 是什么

Claude Relay Service 是一个开源的 Claude Code 中转（relay）服务，核心思路很简单：把多个 Claude 账号放进一个「账号池」，通过统一入口自动进行负载均衡和账号切换。当一个账号触发速率限制时，自动切换到下一个可用账号，开发者无需手动干预，从而最大化利用每个账号的配额。

你可以把它理解为一个放在你自己服务器上的 Claude API 代理网关，所有请求经过它中转后再发送到 Anthropic 的 API。

## 为什么要自建中转服务

自建相比直接使用第三方中转服务有几个明显的优势：

- 隐私安全：所有请求数据只经过自己的服务器，直连 [[Anthropic]] API，不会被第三方截获或记录
- 费用透明：每个账号的用量一目了然，方便和朋友分摊订阅成本
- 性能可控：没有第三方节点带来的额外延迟
- 稳定性高：多账号自动轮换，单一账号的限制不会导致整体服务中断

这个项目适合以下几类用户：

- 重度 Claude Code 用户，单账号配额不够用
- 团队开发场景，需要多人共享 Claude 服务
- 希望分摊订阅成本的朋友
- 对隐私和数据安全有要求的开发者

## 核心功能

Claude Relay Service 的功能比较完善，除了基础的多账号轮换之外，还有不少实用的特性：

- 多账户自动轮换：账号池中的账号按策略自动切换，单个账号达到限额后无缝切到下一个
- 自定义 API Key：可以生成自己的 API Key 分发给不同用户，方便管理和控制访问权限
- 多协议兼容：同时支持 Claude API 格式和 [[OpenAI]] API 格式，意味着你可以用它来对接大部分 AI 工具
- 工具兼容性好：除了 Claude Code 之外，还兼容 [[Gemini]]-cli、[[Codex]]-cli 等多种 CLI 工具
- OAuth 集成：通过 OAuth 可以便捷地将新账号添加到账号池，不需要手动复制 token
- 使用统计：提供详细的用量统计和监控面板，清楚知道每个账号、每个 Key 的使用情况
- Webhook 通知：账号异常时可以自动推送通知到企业微信、钉钉或 [[Slack]]
- 客户端限制：通过 User-Agent 可以精细管控每个 API Key 允许的客户端类型

## 部署要求

这个服务对硬件要求很低：

- CPU：1 核即可
- 内存：512MB 起步
- 系统：推荐 Linux，当然 macOS 用来测试也没问题
- 软件依赖：[[Node.js]] 18+ 和 [[Redis]] 6+
- 如果使用 [[Docker]] 部署，只需要安装好 Docker 和 Docker Compose

## 使用 Docker Compose 部署

我推荐使用 Docker Compose 的方式来部署，管理和升级都很方便。官方虽然提供了一键安装脚本，但本质上也是对 Docker Compose 的封装，不如直接用 Compose 来得清晰可控。

可以参考我的 [docker compose 配置](https://github.com/einverne/dockerfile)，克隆之后进入对应目录。

### 配置环境变量

先复制一份环境变量模板，然后根据自己的情况修改：

```bash
cp env .env
```

`.env` 文件中需要关注的几个关键配置：

- 管理员密码：用于登录管理面板
- Redis 连接信息：如果使用外部 Redis 需要修改
- 端口：默认端口可以根据需要调整

### 启动服务

配置完成后，一行命令启动：

```bash
docker compose up -d
```

启动之后可以通过 `docker compose logs -f` 查看日志，确认服务是否正常运行。

### 配置反向代理

服务启动后默认监听在本地端口，为了从外部安全访问，建议配置反向代理并启用 HTTPS。我这里用的是 [[Nginx Proxy Manager]]，配置一个域名指向对应端口即可。如果你更喜欢 [[Caddy]]，它可以自动申请和续期 SSL 证书，配置也更简洁。

### 添加账号

服务跑起来之后，打开管理面板，通过 OAuth 流程把你的 Claude 账号添加到账号池中。支持同时添加多个账号，服务会自动在这些账号之间进行负载均衡。

## 客户端配置

在客户端（比如 Claude Code）中使用时，只需要把 API 地址指向你的中转服务地址，然后使用你在管理面板中生成的自定义 API Key 即可。由于同时兼容 OpenAI 格式，像 [[Cursor]]、[[Cline]] 这类工具也可以通过配置 OpenAI 兼容接口的方式接入。

## 拼车

如果大家购买 Claude 或者 Codex 不方便，也可以直接联系[我](https://gtk.pw/wechat)一起拼车，几个人分摊下来成本会低很多。

## 相关项目

- [Claude Code Relay](https://github.com/RipperTs/claude-code-relay) 另外一个使用 Go 和 Vue 实现的 Claude Code 代理转发服务，如果你更偏好 Go 技术栈可以看看这个
- [[Claude Code Router]] 将 Claude Code 请求路由到不同渠道的模型，可以自定义任何请求的转发规则，适合更复杂的多模型调度场景
