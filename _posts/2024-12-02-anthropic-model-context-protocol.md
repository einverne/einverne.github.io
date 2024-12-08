---
layout: post
title: "Anthropic 开源 Model Context Protocol(MCP) 创建了 AI 和数据源的双向连接"
aliases:
- "Anthropic 开源 Model Context Protocol(MCP) 创建了 AI 和数据源的双向连接"
tagline: ""
description: "MCP 建立了 AI 和本地数据源的连接"
category: 经验总结
tags: [anthropic, claude, claude-ai, model-context-protocol, ai, artificial-intelligence, openai, chatgpt,]
create_time: 2024-12-06 21:12:58
last_updated: 2024-12-06 21:12:58
dg-home: false
dg-publish: false
---

Anthropic 开源了 [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) 简称 MCP 协议，是一种新的标准，用于将人工智能助手连接到数据所在的系统，包括内容存储，业务工具和开发环境。如果一句话来简单的介绍，就是 Anthropic 通过 MCP 协议将人工智能拓展到任意支持 MCP 协议的地方，而不仅仅局限于网络聊天对话，举一个例子就是如果通过 MCP 连接了本地文件夹，那么就可以让 Anthrpic 操作本地文件夹，比如让 AI 在本地生成一篇文章，创建一个项目模板；或者通过 MCP 连接 IDE，那么就可以让 AI 直接读取并修改本地代码。

Anthropic 在官方网站上说道，AI 助手在模型上投入了大量的资金，推理和质量得到了快速的进步，但是最复杂的模型也会受到数据隔离的限制，陷入信息孤岛（trapped behind information）和遗留系统（legacy system）的问题。每个数据源都需要自己的自定义实现，这使得系统之间的互联难以扩展。

## 为什么需要 MCP？

MCP 正是为了解决以上的问题，MCP 提供了一个开放的标准，链接 AI 和数据源，通过单一协议来实现 AI 对数据源的读取和扩展。通过更简单，更可靠的方式让 AI 能够访问到它们所需要的数据，并且根据这些数据来提供更精准详细的回答。Anthropic 提供了一种非入侵式的方式最大限度获取到数据来扩展 AI 能力的边界。

当前存在的痛点在于 AI 如果要获取特定数据源，就需要专门为其开发一个连接器（这个连接器专门适配这个数据源），如果想让 AI 处理 Google Drive 中的文件，那么就需要针对这个需求单独的编写一段适配代码，这样随着 AI 的发展，这一段适配器的维护将变得非常麻烦，并且代码不以灵活，难以扩展。

## Model Context Protocol 模型上下文协议

Model Context Protocol 是一种开放的协议，使得 AI 和数据源之间建立双向的连接，开发人员可以通过 MCP 服务公开数据，也可以构建连接到这些服务器 AI 应用程序（MCP 客户端）。

MCP 协议主要由三个组件组成

- The Model Context Protocol [specification and SDKs](https://github.com/modelcontextprotocol) 规范和 SDK
- [Claude 桌面应用程序](https://claude.ai/download)中的本地 MCP 服务器支持
- MCP 服务器的[开源仓库](https://github.com/modelcontextprotocol/servers)

Claude 3.5 Sonnet 非常容易构建 MCP 服务器，Anthropic 已经在和开发人员探索适用于企业的 MCP 集成，包括了 Google Drive，Slack，GitHub，Git，Postgres 和 Puppeteer。

Block 和 Apollo 等早期的使用者已经将 MCP 集成到了他们的系统中，包括 Zed，Replit，Codeium 和 Sourcegraph 在内的开发工具公司已经与 MCP 合作来实现了编程工具的集成，是的 AI 可以更好地通过上下文提供信息来辅助，比如最近介绍过的 Cursor，Windsurf 等等编辑器都是通过增加了 Claude 3.5 Sonnet 编程助手使得自家的产品易用度提高了不少。

开发人员现在可以根据标准协议进行构建，而不是为每个数据源单独维护一个连接器。而随着生态系统的成熟，人工智能系统可以在不同的工具和数据集之间切换时也保持上下文，使用更智能的架构来取代当前分散的信息。

### 架构

- MCP Hosts，包括 Claude Desktop，IDEs，各类工具，MCP 服务器交互的应用程序
- MCP 客户端（Clients），协议中的 Clients 会和服务器维持一个 1:1 的连接
- MCP 服务器，是一个轻量级的代码，用来通过标准的 MCP 协议暴露特定的能力，比如读写本地文件的能力，读写数据库的能力
- Local Resources 本地资源，包括文件系统，数据库，或者外部服务，MCP 服务器可以安全的访问
- Remote Resources，通过互联网提供的服务器，比如通过 API，MCP 服务器可以安全的连接

![uQUoDp-_fA](https://pic.einverne.info/images/uQUoDp-_fA.png)

### 运行流程

- MCP 客户端，比如 Claude Desktop 启动时自动检测配置 MCP 服务器
- 通过 MCP 协议，确认 MCP 服务器的能力，比如有访问本地 SQLite，并执行 SQL 的能力
- 通过执行命令，并获取结果

### Quickstart

这里我们使用 Anthropic [官方的 Quickstart](https://modelcontextprotocol.io/quickstart) 作为一个例子来介绍 MCP 的运行流程。

这里做三个步骤

- 创建一个本地数据库
- 将 Claude 客户端，通过 MCP 协议创建和本地 SQLite 的连接
- 直接在 Claude 中让 AI 查询并给出基于数据的分析

在这个例子中，会注重本地的 SQLite 访问。

- Claude Desktop 作为一个 MCP Client
- SQLite MCP Server 提供一个安全的数据库访问
- 本地的 SQLite 数据库保存实际的数据

![vFBYV4e85-](https://pic.einverne.info/images/vFBYV4e85-.png)

SQLite MCP 服务器和本地 SQLite 数据之间的通信都发生在本地，SQLite 数据库的数据没有对互联网开放，MCP 协议确保了 Claude Desktop 只能访问授权的数据操作。

### MCP 服务器的能力

- 操作本地文件
- 操作本地数据库，[[SQLite]]，[[PostgreSQL]]
- 控制本地浏览器，[[Puppeteer]]
- 调用搜索 API
- 调用本地服务，Slack，Google Drive 等

## 构建 MCP 连接器

所有的 Claude.ai 套餐都将支持 MCP 服务器连接到 [Claude Desktop](https://claude.ai/download) 应用。

- 通过[Claude Desktop 应用程序](https://claude.ai/download)安装预构建的 MCP 服务器
- 按照[快速入门指南](https://modelcontextprotocol.io/quickstart)构建您的第一个 MCP 服务器
- 为连接器和实现的[开源存储库](https://github.com/modelcontextprotocol)做出贡献

模型上下文协议（MCP）是 Anthropic 推出的开放标准，旨在通过统一的客户端-服务器架构解决 LLM 应用与数据源连接的难题。它支持通过同一协议访问本地资源（如数据库、文件）和远程资源（如 Slack、GitHub API），无需定制集成。MCP 不仅共享数据，还可公开工具和交互模板，且内置安全性，确保资源由服务器完全掌控。目前 MCP 支持本地运行，未来将引入企业级认证的远程支持，实现团队间的安全共享。通过 Claude 桌面应用，开发者可在短时间内集成 MCP，快速连接多种数据源，推动 AI 集成的标准化发展。

## 示例环境搭建

如果有了 Claude Desktop，只需要简单的配置一下 MCP，就可以让 Claude 直接连接外部数据或者服务，比如如果连接了 GitHub，就可以直接创建仓库，提交代码，创建 Pull Request，提交 Review 等等。

### 前提条件

- macOS 或者 Windows
- 安装最新的 [Claude Desktop](https://claude.ai/download)
- 安装 [uv](https://docs.astral.sh/uv/) 0.4.18 或以上的版本，可以使用 `uv --version` 来检查
- Git `git --version` 来检查
- SQLite `sqlite3 --version` 来检查

如果没有安装，可以使用 Homebrew 一键安装

```
brew install uv git sqlite3
```

然后在本地创建一个 SQLite 数据库，名叫 `test.db`

```
# Create a new SQLite database
sqlite3 ~/test.db <<EOF
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  price REAL
);

INSERT INTO products (name, price) VALUES
  ('Widget', 19.99),
  ('Gadget', 29.99),
  ('Gizmo', 39.99),
  ('Smart Watch', 199.99),
  ('Wireless Earbuds', 89.99),
  ('Portable Charger', 24.99),
  ('Bluetooth Speaker', 79.99),
  ('Phone Stand', 15.99),
  ('Laptop Sleeve', 34.99),
  ('Mini Drone', 299.99),
  ('LED Desk Lamp', 45.99),
  ('Keyboard', 129.99),
  ('Mouse Pad', 12.99),
  ('USB Hub', 49.99),
  ('Webcam', 69.99),
  ('Screen Protector', 9.99),
  ('Travel Adapter', 27.99),
  ('Gaming Headset', 159.99),
  ('Fitness Tracker', 119.99),
  ('Portable SSD', 179.99);
EOF
```

然后配置 Claude Desktop 连接，可以使用任意的编辑器，编辑 `~/Library/Application\ Support/Claude/claude_desktop_config.json`

```
# 比如使用 Vim
vi ~/Library/Application\ Support/Claude/claude_desktop_config.json
# 或者 Visual Studio Code
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

然后填入配置

```
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "/Users/YOUR_USERNAME/test.db"]
    }
  }
}
```

注意将配置中的地址修改为自己电脑本地的配置。

这个配置会高速 Claude Desktop

- 有一个叫做 sqlite 的 MCP 服务器
- 通过 `uvx mcp-server-sqlite` 命令来运行它
- 服务运行之后会连接到之前创建的 `test.db` 数据库

创建保存文件之后，重启 Claude Desktop。

最后让我们来试一试直接在 Claude 中询问关于数据库中相关的数据。

```
Can you connect to my SQLite database and tell me what products are available, and their prices?
```

直接在 Claude Desktop 中。Claude 会链接到 SQLite MCP Server ，然后查询本地的数据库，最后将结果以比较好的格式输出。

经过以上的尝试，我们更进一步来看看背后发生了什么。

当我们在 Claude Desktop 上使用 MCP 进行交互时

- Server Discovery 服务器发现，Claude Desktop 会在启动时通过配置连接 MCP 服务器
- Protocol Handshake，协议握手，当询问数据时，Claude Desktop 会
  - 首先识别哪一个 MCP server 有帮助，这个例子中就是 sqlite
  - 通过协议沟通 server 的能力
  - 向 MCP server 发送请求或执行动作

交互的流程如下图

![CV5R5VsYig](https://pic.einverne.info/images/CV5R5VsYig.png)

安全性通过如下的操作保证

- MCP servers 只会暴露特定的可控的能力
- MCP servers 在本地执行，数据不会通过互联网被访问
- Claude Desktop 对数据的操作会需要用户授权

当我知道上面的流程之后，我们可以对数据库有更多的查询，比如询问数据的平均价格

```
What's the average price of all products in the database?
```

更甚至可以对数据进行更加复杂的分析，并让 AI 给出优化

```
Can you analyze the price distribution and suggest any pricing optimizations?
```

或者根据数据让 AI 更进一步创建内容

```
Could you help me design and create a new table for storing customer orders?
```

## related

- [GitHub MCP 服务器](https://github.com/modelcontextprotocol/servers)
- <https://github.com/punkpeye/awesome-mcp-servers>
- <https://github.com/wong2/awesome-mcp-servers>
