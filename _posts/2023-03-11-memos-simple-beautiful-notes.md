---
layout: post
title: "Memos: 极简美观的自托管备忘录"
aliases:
- "Memos: 极简美观的自托管备忘录"
tagline: ""
description: ""
category: 产品体验
tags: [ memos, ios, notes, quick-note, self-hosted, obsidian, note-taking ]
create_time: 2023-03-11 23:09:03
last_updated: 2025-12-08 23:09:03
---

[memos](https://github.com/usememos/memos) 是一个开源的，可自行架设的知识管理备忘录。

虽然 memos 这一款自托管的备忘录已经部署很久了，但是一直没有找到机会用它。它所能提供的功能我基本上用 Obsidian，以及备忘录一类的工具取代了，但是最近又想起它是因为我需要一个跨平台的简易工具，以便我能够在移动端，桌面端，没有 Obsidian 的情况下也能快速记录一些想法。

![2ZIr](https://photo.einverne.info/images/2023/03/11/2ZIr.jpg)

## 核心特性

- **隐私优先**：自托管意味着数据完全掌握在自己手中，没有追踪和广告。
- **Markdown 原生**：支持完整的 Markdown 语法，内容以纯文本存储，方便迁移。
- **轻量高效**：后端使用 Go，前端使用 React，资源占用极低。
- **RESTful API**：开放的 API 使得第三方客户端和集成变得非常容易。
- **类似 Twitter 的体验**：以时间流的形式展示笔记，适合记录碎碎念和灵感。

## 客户端

虽然官方提供了 Web 界面 (PWA)，但社区也开发了优秀的第三方客户端，覆盖了各个平台：

### 移动端 (iOS/Android)

- **[Moe Memos](https://github.com/mudkipme/MoeMemosAndroid)**: (iOS/Android) 颜值极高，体验流畅，支持 Markdown、图片、标签和搜索。

### 浏览器扩展

- **[Memos-bber](https://github.com/lmm214/memos-bber)**: (Chrome/Edge) 极其方便的浏览器扩展，支持在任意网页快速摘录内容到 Memos。

## 和 Obsidian 集成

Memos 的一大优势是可以作为 Obsidian 的"灵感收集器"。通过插件，可以将 Memos 中的碎片想法自动同步到 Obsidian 的 Daily Notes 中，实现"收集-整理"的闭环。

### 常用插件

1.  **[Memos Sync](https://github.com/ravisses/obsidian-memos-sync)**: 这是一个专门用于将自托管 Memos 服务器的内容同步到 Obsidian 的插件。它支持增量同步，可以配置同步到 Daily Notes 的特定标题下。
2.  **Thino (原 Obsidian Memos)**: 如果你不想自托管 Memos，Thino 提供了一个在 Obsidian 内部的类似 Memos 的界面。虽然现在部分高级功能收费，但核心的"每日记录"体验依然很好。

## 部署

Memos 的部署非常简单，官方推荐使用 Docker Compose。

```yaml
version: "3.0"
services:
  memos:
    image: neosmemo/memos:latest
    container_name: memos
    volumes:
      - ./memos-data:/var/opt/memos
    ports:
      - 5230:5230
    restart: unless-stopped
```

只需要保存为 `docker-compose.yml` 然后运行 `docker-compose up -d` 即可在 `http://localhost:5230` 访问。

## related

- [memos.top](https://github.com/eallion/memos.top) 是一个可以借助 Memos API 来生成静态网页的项目。
