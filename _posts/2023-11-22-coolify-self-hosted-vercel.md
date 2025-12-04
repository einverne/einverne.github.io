---
layout: post
title: "自托管的服务部署平台 Coolify"
aliases:
- "自托管的服务部署平台 Coolify"
tagline: ""
description: ""
category: 产品体验
tags: [coolify, open-source, pass, vercel, netlify, heroku, self-hosted]
create_time: 2024-02-09 19:50:28
last_updated: 2024-02-09 19:50:28
---

[Coolify](https://coolify.io/) 是一个可以自托管的，类似 [[Heroku]] / [[Netlify]] / [[Vercel]] 的 [[PaaS]] 服务。它提供了一个美观的仪表盘，让你能够轻松地管理应用、数据库和服务。

- 源码：<https://github.com/coollabsio/coolify>
- 官网：<https://coolify.io/>

用户只需要在后台点击就可以托管应用，数据库，或其他开源服务。

- **多语言支持**：[[Coolify]] 支持非常多的语言，包括静态代码，Svelte，React，Vue，Next，Nuxt，Astro，PHP，Rust，Golang 等等。
- **自动化 SSL**：支持自动申请和续期 Let's Encrypt SSL 证书。
- **数据库管理**：原生支持 MongoDB，MySQL，PostgreSQL，CouchDB，Redis，ClickHouse 等数据库的一键部署和备份。
- **服务市场**：一键安装常用的开源应用，包括 WordPress，Ghost，Plausible Analytics，NocoDB，Bitwarden/Vaultwarden，LanguageTool，[[n8n]]，[[Uptime Kuma]]，VSCode Server 等服务。
- **Docker 集成**：天然支持 Docker 和 Docker Compose 部署。

![Coolify Dashboard](https://photo.einverne.info/images/2024/02/09/4qv8.png)

## 价格 (Price)

Coolify 核心是一个开放源代码的项目（Self-hosted），你可以免费部署在自己的服务器上。

如果你不想自己维护服务器，也可以使用官方提供的托管云服务（Coolify Cloud），或者通过付费订阅/捐赠来支持[作者](https://coolify.io/sponsorships)。

## 安装 (Installation)

### 资源要求

为了流畅运行 Coolify，建议服务器满足最低资源要求：

- **CPU**: 2 核（编译部署任务较重时需要更多算力）。
- **内存**: 2 GB RAM（如果部署的服务较多，建议增加内存，Node.js 应用通常较吃内存）。
- **磁盘**: 30 GB 以上（镜像和数据库数据可能占用较多空间）。
- **系统**: 推荐 Ubuntu 22.04 LTS 或其他兼容 Docker 的 Linux 发行版。

### 一键安装

在 root 用户下执行以下命令：

```bash
apt install curl wget git jq jc
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

该脚本会自动安装 Docker Engine，配置环境，并启动 Coolify 容器。

**端口说明**：

- `8000`: Coolify 控制面板入口。
- `80`, `443`: Traefik 反向代理，用于应用的 HTTP/HTTPS 访问。
- `6001`: WebSocket 服务。
- `22`: SSH (用于 Git 操作和服务器管理)。

安装完成后，访问 `http://<服务器IP>:8000` 注册第一个用户，该用户将自动成为管理员。

## 核心功能与使用技巧

### 1. 部署应用 (Applications)

Coolify 提供了极其灵活的部署方式：

- **Public/Private Git Repository**: 直接连接 GitHub/GitLab 仓库。
  - 推荐在 GitHub 上安装 Coolify App 以获得最佳体验（自动 Webhook）。
  - 私有仓库也可以通过 SSH Key 方式连接。
- **构建包 (Build Packs)**:
  - **Nixpacks**: (默认) 自动检测语言和框架，零配置生成镜像。比 Buildpacks 更快更灵活。
  - **Dockerfile**: 如果项目根目录有 `Dockerfile`，直接使用它。
  - **Docker Compose**: 支持上传 `docker-compose.yml` 部署复杂的微服务栈。
  - **Static**: 针对纯静态网页（HTML/CSS/JS）的优化部署。

### 2. 预览部署 (Preview Deployments)

类似 Vercel 的 Pull Request 预览功能。在应用设置中开启后，每当有 PR 提交，Coolify 会自动部署一个临时的预览环境，并生成独立的 URL，方便团队 Review。

### 3. 环境变量管理

在 Coolify 面板中可以方便地管理 `.env` 环境变量。

- **Secrets**: 加密存储敏感信息。
- **Build Variables**: 某些变量（如 API_URL）如果在构建阶段就需要（比如前端构建），记得在设置中勾选 "Build Variable"。

### 4. 数据库与服务

Coolify 不仅能部署代码，还能一键启动数据库。

- 它会自动处理数据库的密码生成、连接字符串注入（链接到应用）。
- 支持定时备份到 S3 兼容的对象存储。

### 5. 多服务器架构 (Multi-Server)

这是 Coolify 的杀手级功能之一。你可以将 Coolify 部署在一台低配的“控制节点”上，然后通过 SSH 添加无限多的“工作节点”。

- **控制节点**：只运行 Coolify 面板，负责调度和发出指令。
- **工作节点**：运行实际的应用和数据库。
- **优势**：资源隔离，单点管理。

## 进阶配置

### 自定义域名与 HTTPS

Coolify 内置了 **Traefik** 作为反向代理。

- 在应用设置中填入域名（如 `app.example.com`），Coolify 会自动修改 Traefik 配置。
- 自动申请 Let's Encrypt 证书。
- **泛域名技巧**：建议配置泛域名解析（`*.example.com` -> 服务器 IP），这样在 Coolify 中新建应用时，可以随意填写子域名而无需每次去 DNS 提供商处添加记录。

### 魔法 DNS (sslip.io)

如果你没有域名，Coolify 默认支持 `sslip.io`。例如，如果你的服务器 IP 是 `1.2.3.4`，你可以使用 `http://app.1-2-3-4.sslip.io` 访问应用。这对于测试非常方便。

### 常用服务一键开通

以下服务均可在 Coolify 市场中一键部署，极大降低了自托管门槛：

- **[[Uptime Kuma]]**: 监控服务在线状态。
- **[[VaultWarden]]**: Bitwarden 的轻量级服务端，管理密码。
- **[[NocoDB]]**: 将数据库转化为 Airtable 风格的表格。
- **[[n8n]]**: 强大的工作流自动化工具。
- **MeiliSearch**: 轻量级全文搜索引擎。

## 竞品对比

| 特性         | Coolify                     | [[Dokku]]                  | [[CapRover]]               |
| :----------- | :-------------------------- | :------------------------- | :------------------------- |
| **交互方式** | 现代化 Web UI               | 主要是 CLI (命令行)        | Web UI (较简陋)            |
| **易用性**   | ⭐⭐⭐⭐⭐ (极高)           | ⭐⭐⭐ (需懂 Linux)        | ⭐⭐⭐⭐                   |
| **多服务器** | 原生支持                    | 单机 (多机需复杂配置)      | 支持 Docker Swarm          |
| **构建机制** | Nixpacks / Docker           | Heroku Buildpacks / Docker | Docker                     |
| **资源占用** | 中 (Node.js/PHP 后端)       | 低 (Bash 编写)             | 中                         |
| **适合场景** | 追求 Vercel 体验的个人/团队 | 极客，资源受限的小鸡       | 需要简单 UI 的 Docker 管理 |

## 最后

Coolify 是目前自托管 PaaS 领域中体验最接近 Vercel/Netlify 的产品。它极大地简化了 DevOps 的工作流，让开发者可以专注于代码本身，而不是服务器运维。如果你有一台闲置的 VPS，用 Coolify 把它变成自己的“私有云”是最好的选择。

## 相关阅读

- [[Fider]]
- [[uptime-kuma]]
- [[Plausible Analytics]]
- [[Dokploy]] - 另一个新兴的 Coolify 替代品
- [[Dokku]]
