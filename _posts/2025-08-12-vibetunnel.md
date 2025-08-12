---
layout: post
title: "VibeTunnel 将终端带到浏览器 开启移动化 Vibe Coding"
aliases:
- "VibeTunnel 将终端带到浏览器 开启移动化 Vibe Coding"
tagline: ""
description: ""
category: 经验总结
tags: [ vube-coding, vibetunnel, vpn, tunnel, tailscale, macos, linux, terminal, websocket, browser ]
create_time: 2025-08-12 09:59:10
last_updated: 2025-08-12 09:59:10
dg-home: false
dg-publish: false
---

这两天在调研如何在移动设备上也能随时随地给 Claude Code 布置任务，自己也尝试了不少的方案，从 Tailscale，到 Remote-Code.com 到 VS Code 插件（Claude Autopilot）添加任务到队列。但是每个方案或多或少有一些缺点，比如 Remote-Code 虽然使用比较便捷，但是不支持中文。Claude Autopilot 体验也非常不错，但是我自己尝试的过程中发现长时间运行 VS Code 崩溃了两次，再到 Tailscale + 手机终端的方案，依赖于一个非常好用的 iOS 终端，虽然选择很多，但还是没有找到一款顺手的。

于是我就继续在寻找，然后我就看到了一款叫做 VibeTunnel 的开源方案，简单的看了一下项目的介绍，将系统的终端暴露到浏览器中，这样，我们只需要打开网页，就可以远程控制我们电脑上的终端，实现无论在哪个地方都可以进行 Vibe Coding。项目的介绍是非常符合我的使用场景，那我们就一起来体验一下。

## VibeTunnel 是什么

VibeTunnel 是一款将本地终端会话代理到任意现代浏览器中的工具，借助它，无论在 macOS、Linux 还是移动设备上，都能随时随地以网页形式访问并操作终端。

![jiZY](https://photo.einverne.info/images/2025/08/12/jiZY.png)

下文会分阶段介绍项目的核心原理、功能、安装与使用、深度使用场景。

## 核心原理

VibeTunnel 是通过本地守护进程建立 HTTP/WebSocket 服务，将终端 I/O 双向映射到浏览器中；用户可在网页中实时查看终端输出、输入新命令并动态生成会话。

VibeTunnel 会抓取终端应用的输入输出，只需要执行 `vt` 命令。比如要执行 claude 就只需要输入 `vt claude`

![j1cp](https://photo.einverne.info/images/2025/08/12/j1cp.png)

技术栈包括：

- **原生 macOS 客户端**：基于 Swift/SwiftUI 打造，深度集成 zsh/pwsh 等 shell
- **跨平台支持**：Linux 可通过 npm 发布的命令行包安装；任何设备只需浏览器即可接入
- **Web 前端**：实时同步、多标签会话管理，并提供简洁复古风格 UI

VibeTunnel 的运行依赖于系统权限。

![jCrN](https://photo.einverne.info/images/2025/08/12/jCrN.png)

VibeTunnel 依赖于终端执行特定的动作。

![jWE2](https://photo.einverne.info/images/2025/08/12/jWE2.png)

启动之后 VibeTunnel 默认使用 4020 端口。在 VibeTunenl 中还集成了 Tailscale，ngrok，Cloudflare 等暴露局域网的服务，同时也不会将你的终端暴露给公开互联网。

![j5XG](https://photo.einverne.info/images/2025/08/12/j5XG.png)

## 主要功能

- 零配置即用
  VibeTunel 真正做到了下载，安装就能使用，启动后自动开放本地端口：无需复杂 VPN、SSH 配置，即可立刻进入网页终端
- 支持任何基于终端的 AI Agent
  - 可以监控 Claude Code，ChatGPT，Gemini CLI 等等
- 实时同步  
   输出滚动与命令输入均实时生效，多端可共享同一会话，AI 编码、远程协作更流畅
- 跨平台与多设备
  macOS、Linux、iPadOS、iOS、Android 等均可使用，仅需浏览器。
- 安全加密
  支持与 Tailscale、ngrok 、Cloudflare 等零信任隧道结合，实现端到端加密与访问控制
- Headless 模式
  可在无 GUI 的服务器或云实例中运行，适用于 CI/CD、远程运维场景。
- 推送通知与 Git Worktree 管理（1.0.0-beta.15）
  · 命令完成、会话结束、错误警告等事件可触发原生推送通知  
   · 智能识别 Claude CLI 会话，并在 AI 回复完毕时通知用户  
   · 内建 Git worktree 的创建、管理与会话切换命令，支持 `/api/git/status` 等 HTTP 接口

## 快速安装与启动指南

### macOS

macOS 下可以直接使用安装包，或者通过 Homebrew

```bash
# Homebrew 安装
brew install --cask vibetunnel

# 启动服务
vibetunnel start
```

安装成功之后可以执行 `vt claude` 命令。

随后在浏览器打开 `http://localhost:4020`，即可进入终端界面。

### Linux & Headless

如果本地有 Node.js 开发环境也可以直接使用 npm 安装

```bash
# npm 安装
npm install -g vibetunnel

# 启动服务器
vibetunnel-server
```

访问 `http://<服务器IP>:4020`，即可远程操作终端；结合 Tailscale 时，直接使用分配的 100.x.x.x 地址访问更便捷。

## 应用场景

我本来是为了 Vibe Coding 而找到了这样一款工具，但是实际思考之后发现 VibeTunnel 还有非常多的实际应用场景，比如我们在局域网中运行的一些节点，HomeLab 等，就可以直接通过浏览器暴露终端来查看运行日志，执行诊断命令，而不需要受到 SSH 配置的限制。在一些自己不熟悉的环境中，比如演讲或者教育培训视频录制的过程中，我们可以通过 Web 一键连接到自己熟悉的终端环境中，仅仅需要通过 URL 就可以避免再配置一套环境。

## 安全与最佳实践

在深度使用 VibeTunnel 之前，一定要注意自己的网络安全问题，推荐使用 Tailscale 零信任的网络，或者开启 ngrok HTTPS 隧道，并禁止公网访问。

另外 4020 端口网页一定要开启密码认证或者 IP 白名单，防止不可信的访问。

启用密码认证或 IP 白名单：

```bash
vibetunnel --auth password
vibetunnel --allow-ip 192.168.1.0/24
```

另外就是定期检查 `vibetunnel logs`，并对会话事件开启推送通知预警，时刻注意访问安全。

如果遇到连接不稳定的情况，可以执行 `vibetunnel restart` 并检查隧道工具状态。

## related

- provision.ai 可以让用户将 Claude Code 添加到 Slack 频道并实现远程控制，但是该项目需要加入等待列表
- [omnara.com](https://omnara.com/) 是一个使用 Python 实现的远程控制 Claude Code 项目，并且获得了 Y Combinator 支持
- Claude Autopilot 是一款 VS Code 插件，可以通过队列的形式提交任务给 Claude Code
- [Claude-Code-Remote](https://github.com/JessyTsui/Claude-Code-Remote) 是一款可以通过邮件，Telegram，Discord 等来远程控制 Claude Code 的开源项目
