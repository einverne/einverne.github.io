---
layout: post
title: "Claudia 可视化管理 Claude Code"
aliases:
- "Claudia 可视化管理 Claude Code"
tagline: ""
description: ""
category: 经验总结
tags: [ claude-code, claudia, tauri, rust, typescript, vite, react, open-source ]
create_time: 2025-08-05 15:41:24
last_updated: 2025-08-05 15:41:24
dg-home: false
dg-publish: false
---

Claudia 是一款专为 Anthropic  的 Claude Code 设计的开源图形用户界面（GUI）桌面应用，可以创建自定义代理，交互式管理，以及在后台运行。它将命令行形式的 Claude Code 转换为直观的可视化操作界面，显著提升了  AI 辅助编程的用户体验。

## 核心功能

可以将 Claudia 看作一个功能强大的桌面应用程序，彻底改变 Claude Code 的交互方式。

基于 Tauri2 构建 GUI，结合了 React 18 和 TypeScript 构建前端界面，采用 Vite 6 作为构建工具，Tailwind CSS 实现 UI 设计，SQLite 作为数据本地化存储，确保了安全性。

Claudia 弥补了命令行工具和本地可视化程序之间的差别。

### 项目与会话管理

Claudia 提供了可视化的项目浏览器，用户可以轻松浏览和管理  `~/.claude/projects/`  中的所有 Claude Code 项目，支持会话历史记录的查看和恢复，通过智能搜索功能快速定位项目，以及提供会话洞察来了解初始信息、时间戳和元数据。

![jFNL](https://photo.einverne.info/images/2025/08/05/jFNL.png)

### 自定义 AI 智能体

用户可以创建具有自定义系统提示和行为的专用智能体，建立智能体库用于存储不同任务的专用智能体。这些智能体在安全沙箱环境中运行，具备细粒度的权限控制，并详细记录运行历史、日志和性能指标。

![j6sD](https://photo.einverne.info/images/2025/08/05/j6sD.png)

### 使用分析仪表盘

Claudia 提供实时监控 Claude API 使用情况和成本的功能，详细分析按模型、项目和时间段的 Token 使用情况。通过可视化图表展示使用趋势和模式，支持数据导出进行综合分析。

![jaG3](https://photo.einverne.info/images/2025/08/05/jaG3.png)

### 高级沙箱安全

采用操作系统级别的安全沙箱（如 Linux 上的 seccomp 和 macOS 上的 Seatbelt），提供可重用安全配置文件的创建和精细访问控制。实时监控和记录所有安全违规行为，确保开发环境的安全性。

### 时间线与检查点

支持在编码会话中的任何时间点创建检查点，使用分支时间线浏览会话历史记录。用户可以一键恢复到任何检查点，并从现有检查点创建新分支，类似于 Git 的版本控制机制。

### MCP 服务器管理

从中央用户界面管理模型上下文协议（MCP）服务器，支持通过用户界面或导入现有配置轻松添加服务器。在使用前验证服务器连接，简化 MCP 服务器的配置和管理过程。

## 安装

目前 Claudia 没有提供二进制执行文件，所以需要从源码进行构建。

确保自己的系统满足

- Windows 10/11 ，macOS 11+，或 Linux Ubuntu 20.04+
- 最低 4 GB 内存，建议 8GB
- 至少 1 GB 可用空间

### 工具

- Rust 1.70.0 或以后
- Bun 最新版本
- Git
- Claude Code CLI，并确保在 PATH 中

在 macOS 下需要

```
# Install Xcode Command Line Tools
xcode-select --install

# Install additional dependencies via Homebrew (optional)
brew install pkg-config
```

Linux 下需要

```
# Install system dependencies
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libxdo-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

Windows 可以参考[官网](https://github.com/getAsterisk/claudia?tab=readme-ov-file#-installation)

### 构建

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# install dependencies
bun install
# build dev
bun run tauri dev
# build production
bun run tauri build
```

构建完了之后在 `src-tauri/target/release`

构建 macOS M 系列

```
bun run tauri build --target aarch64-apple-darwin
```

构建适用于 macOS 的通用二进制文件

```
bun run tauri build --target universal-apple-darwin
```

构建之后可以执行

```
./src-tauri/target/release/claudia
```
