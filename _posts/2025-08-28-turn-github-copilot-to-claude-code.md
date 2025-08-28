---
layout: post
title: "突破 Claude Code 5小时限制：利用 GitHub Copilot 代理 Claude Code 请求"
aliases:
- "突破 Claude Code 5小时限制：利用 GitHub Copilot 代理 Claude Code 请求"
tagline: ""
description: ""
category: 经验总结
tags: [ github-copilot, copilot, claude-code, sonnet-4, anthropic ]
create_time: 2025-08-28 09:32:05
last_updated: 2025-08-28 09:32:05
dg-home: false
dg-publish: false
---

如果大家高频使用 Claude Code 进行代码对话和生成工作的话， 经常会遇到 5 小时的限制。 幸运的是，如果你已经订阅了 GitHub Copilot，现在有一个巧妙的解决方案：通过本地代理将 GitHub Copilot 的 Claude Sonnet 4 模型转换为 Anthropic API 格式，从而绕过 Claude Code 的使用限制，继续享受顶级的 AI 编程体验。

## 基本原理

解决方案的核心思路非常直接：在本地搭建一个代理服务，将发送到 Anthropic API 的请求转发给 GitHub Copilot。

工作原理如下：

1. 本地启动 copilot-api 代理服务
2. 配置环境变量，将 Claude Code 的请求重定向到本地代理
3. 代理服务将 Anthropic API 格式的请求转换为 GitHub Copilot 兼容格式
4. GitHub Copilot 处理请求并返回结果
5. 代理将结果转换回 Anthropic API 格式返回给 Claude Code

## 前置条件

开始配置之前， 请确保自己满足以下条件。

- Node.js >=16.x
- GitHub 账户并订阅 GitHub Copilot
- 终端命令行

推荐使用 Tmux，Git 等工具配合使用。

## 使用教程

首先安装 copilot-api ，或直接执行，运行命令之后连接 GitHub Copilot 认证。认证过程会自动打开浏览器，并跳转到 GitHub 授权页面。 在浏览器当中输入、验证、完成授权之后，认证信息会自动保存到本地。

可以通过一下的命令直接运行，也可以全局安装之后执行

```
npx copilot-api@latest auth
```

全局安装

```
npm install -g copilot-api
copilot-api --version
```


然后需要启动代理服务。 需要确保这一个代理服务一直在后台运行， 不要关闭。

```
npx copilot-api@latest start --claude-code
```

接下来需要配置一下环境变量， 之后再启动 Claude。

```
ANTHROPIC_API_KEY=sk-dummy
ANTHROPIC_BASE_URL=http://localhost:4141
claude --dangerously-skip-permissions
```

启动 Cloud Code 之后， 会在界面当中显示当前请求的 API， 如果是 Localhost 则表明配置成功了。 那现在 Cloud Code 使用的就是你本地的代理， 而非 Anthropic 官方 API。

同样的，我们为了保持代理服务， 我们可以将代理服务的执行命令放在 Tmux 当中执行。

完成上述所有的配置之后， 我们就可以开心地使用 GitHub Copilot 提供的 Sonnet 4 模型进行 Web Coding 了。
