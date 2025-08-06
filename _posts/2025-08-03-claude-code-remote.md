---
layout: post
title: "远程控制 Claude Code 让 AI 一刻不停"
aliases:
- "远程控制 Claude Code 让 AI 一刻不停"
tagline: ""
description: ""
category: 经验总结
tags: [ claude-code， ai， claude， remote-control， remote-desktop ]
create_time: 2025-08-03 16:23:06
last_updated: 2025-08-03 16:23:06
dg-home: false
dg-publish: false
---

日常都是在终端里面使用 Claude Code 进行代码的编写，但是因为 Cloud Code 每一次执行都要花费很长的时间等待，那我想着有没有一种方法可以让我们进行远程的控制，比如说在 Cloud Code 完成大段代码的编写之后，即使我们不在电脑旁，我们也可以继续让 Cloud Code 进行下一个需求的编写。

## 初步尝试

### SSH + Tmux

能想到的最简单的方法就是开一台服务器，让 Claude Code 在服务器上运行，为了维持长时间可以使用 Tmux，然后本地可以通过 SSH 方式远程来访问 Claude Code，attatch 到 Tmux 上。但是这个方案依赖于一个好的 SSH 客户端，好在 SSH 客户端有非常多的选择，如果在桌面端，那么随便找一个顺手的就行，比如我推荐过的 [Warp](https://blog.einverne.info/post/2022/03/warp-terminal-usage.html)，[Ghostty](https://blog.einverne.info/post/2025/05/ghostty.html)，[Kitty](https://blog.einverne.info/post/2020/08/cross-platform-gpu-based-terminal-emulator-kitty.html) 等等，或者在 Linux 上也可以用 [[Guake]] 等等。

如果是在移动平台上，比如 Android 上可以使用 [Termux](https://blog.einverne.info/post/2019/06/termux-app.html) ，在 iOS 上可以使用 [[Termius]] ，[[ServerCat]] 等等，不过 iOS 上我还没有找到一个比较完美的 SSH 客户端，如果大家有在使用的，也欢迎告诉我。

[[iOS SSH 客户端]]

### Tailscale + SSH

更进一步，我们要让 Claude Code 运行只需要一台机器就行，那么我在家里放上一台 Mac Mini，正好我也有[一台](https://blog.einverne.info/post/2023/11/i-bought-mac-mini-and-setup.html)。然后我只需要确认我能连上这一台 Mac mini 即可，那不是很容易通过 Tailscale 来实现嘛。打开 macOS 的远程 SSH 访问，确保只能通过 SSH Key 访问，确保安全性。这样就可以利用 SSH 客户端连上了。

### Telegram + 邮件

在检索的过程中发现了一个新的项目叫做 Claude Code Remote ，这是一个开源项目，允许开发者通过邮件远程/Telegram/Discord/ 等来控制 Claude Code，实现启动任务后离开，完成时收到通知，回复即可触发新任务。

调查一番之后发现，这个方案可能是比较好的方案，并且只依赖邮件和 Telegram，这两个都是手机上日常已经装好的应用。

## Claude Code Remote 核心功能

- 邮件通知，当 Claude 完成任务时，系统会自动发送包含完整结果的邮件通知，用户无需持续监控任务状态。通知邮件包括了任务的描述，Claude 的完整响应以及明确的操作提示。
- 邮件命令控制用户可以直接回复邮件、发送新命令、无需登录特定的设备或软件、系统支持多行命令格式化内容和复杂的指令能够完整保留邮件证文的内容结构
- 验证白名单机制，只有预设的可信邮箱才可以发送控制命令。

## 使用

安装和配置

```
git clone https://github.com/JessyTsui/Claude-Code-Remote.git
cd Claude-Code-Remote
npm install
```

需要在 `.env` 文件中配置 Gmail 或者 SMTP 服务，如果大家想要搭建自己的域名邮箱也可以访问我构建的[邮箱服务 EV Hosting](https://client.einverne.info)。

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password
EMAIL_TO=your-notification-email@gmail.com
ALLOWED_SENDERS=your-notification-email@gmail.com
```

在  `~/.claude/settings.json`  中添加钩子配置，实现任务完成时的自动通知。

除了邮件通知，项目还支持 Discord、Telegram、LINE 等即时通讯平台的集成。开发者可以配置机器人账户，通过聊天消息发送命令并接受 Claude Code 的通知结果。

## related

- [[Greptile]] 是一个有 AI 驱动的代码审查服务，提供无限制的代码库连接和审查，每月固定费用 30 美元，GitHub 和 GitLab 集成。
- [[vibetunnel]]
