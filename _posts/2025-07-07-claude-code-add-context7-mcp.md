---
layout: post
title: "Claude Code 添加 Context7 MCP 支持"
aliases:
- "Claude Code 添加 Context7 MCP 支持"
tagline: ""
description: ""
category: 经验总结
tags: [ mcp, claude, claude-code, claude-code-tips, mcp-server ]
create_time: 2025-07-07 21:58:31
last_updated: 2025-07-07 21:58:31
dg-home: false
dg-publish: false
---

Context7 MCP（Model Context Protocol）是一个开源的 MCP 服务器，可以为 AI 编程助手提供最新的官方文档和代码示例。通过配置 Context7 MCP，您可以在 Claude Code 中获得实时的、版本特定的技术文档，从而避免 AI 产生"幻觉"或使用过时的 API。

## 命令行配置

使用命令行配置

```
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

指定作用域

```
# 全局配置（在所有项目中可用）
claude mcp add -s user context7 -- npx -y @upstash/context7-mcp@latest

# 项目配置（仅在当前项目中可用）
claude mcp add -s project context7 -- npx -y @upstash/context7-mcp@latest

# 本地配置（默认，仅在当前目录中可用）
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

验证配置

```
claude mcp list

claude mcp get context7
```

## 手动编辑配置文件

如果熟悉 Claude 本地的配置文件，也可以手动编辑，全局配置文件位于 `~/.claude.json`，项目的配置文件在项目根目录的 `.mcp.json` 文件中。

```
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

## 使用

配置完成之后，只需要在提示中添加 `use context7` 就可以激活文档获取功能。Context7 会自动检测提示词中的框架和库，然后获取相关的最新文档，可以

- 指定特定版本
- 询问最新的 API 变更
- 获取官方代码失利
- 查询最佳实践

## 配置文件的位置与作用域

Claude 支持多种配置文件作用域，从最小范围到全局依次为：

- **项目根目录**：`.mcp.json`  或  `.claude/settings.local.json`
- **项目特定**：`.claude/settings.local.json`
- **用户本地**：`~/.claude/settings.local.json`
- **用户全局**：`~/.claude/settings.json`  或  `~/.claude.json`
- **Dedicated MCP 文件**：`~/.claude/mcp_servers.json`

其中，推荐在项目根目录放置  `.mcp.json`，以便版本控制与团队共享。
