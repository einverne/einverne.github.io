---
layout: post
title: "Dokploy 又一个开源自托管的 PaaS 平台"
aliases:
- "Dokploy 又一个开源自托管的 PaaS 平台"
tagline: ""
description: "Dokploy 是基于 Docker 和 Traefik 的开源自托管 PaaS，可以替代 Heroku、Vercel、Netlify"
category: 产品体验
tags: [ dokploy, paas, saas, docker, traefik, heroku, vercel, netlify ]
create_time: 2024-08-02 10:52:14
last_updated: 2026-11-12 10:00:00
dg-home: false
dg-publish: false
---

[Dokploy](https://dokploy.com/) 是一个开源、可自托管的 [[PaaS]] 平台，把应用和数据库的部署、管理集中到一个界面里完成。它基于 [[Docker]] 和 [[Traefik]] 构建，适合想在自己的 VPS 上搭一套低成本 PaaS 的个人开发者和小团队。

简单来说，Dokploy 可以用来替代 [[Heroku]]、[[Vercel]]、[[Netlify]] 这类托管平台。之前介绍过的 [[Coolify]]、[[Dokku]] 等开源项目也能做到类似的事情，文末会简单做个对比。

## 功能

- Docker 集成：支持创建、部署和更新 Docker 容器，PHP、Python、Java、Go、Ruby 等各种语言的应用都可以部署到 VPS 上，并保持更新
- Traefik 反向代理：内置 Traefik 作为 HTTP 反向代理和负载均衡器，自动处理域名路由和流量分配
- 实时监控：可以直接在界面上查看 CPU、内存、磁盘和网络的使用情况
- 数据库管理：支持 MySQL、PostgreSQL、MongoDB、MariaDB、Redis、libsql 等数据库，可以定时备份到 S3 等外部存储
- 应用模板：内置 600 多个开源应用模板，比如 [[Plausible]]、[[PocketBase]]、[[Cal.com]]，一键就能部署
- 通知：部署成功或失败时可以推送到 Slack、Discord、Telegram、邮件等渠道
- CLI 和 API：除了 Web 界面，也可以通过命令行和 API 操作
- 安装简单：一条命令就能在 VPS 上装好，很快就能开始部署

在底层，Dokploy 使用 Docker Swarm 来编排和管理容器。Docker Swarm 是 Docker 原生的集群管理工具，这也是 Dokploy 能够支持多节点部署的基础。

![dtm3w1fSZw](https://pic.einverne.info/images/dtm3w1fSZw.png)

## 安装

官方文档要求服务器至少有 2GB 内存和 30GB 磁盘，并且 80、443、3000 端口没有被占用。80 和 443 给 Traefik 用，3000 是 Dokploy 的管理界面，任何一个端口被占用都会导致安装失败。

通过 SSH 登录服务器，在 root 用户下执行：

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

脚本会自动安装 Docker 以及 Dokploy 本身。执行完成后，终端会输出 `IP:3000` 的访问地址，等服务启动后在浏览器中打开即可。

## 使用

### 初始化设置

访问 `服务器 IP:3000` 会进入注册页面，填写邮箱和密码完成注册。第一个注册的用户默认就是管理员。

### 域名设置

登录后进入 Settings 页面：

- 在 Server Domain 中填入已经配置好 A 记录的管理域名，比如 `web.example.com`
- 在 Let's Encrypt Email 中填入邮箱，证书提供商选择 Let's Encrypt
- 点击 Save

系统会自动申请 SSL 证书，之后就可以通过 `https://web.example.com` 访问管理界面了。

### 部署应用

Dokploy 主要支持两种部署方式：直接部署应用，以及通过 Docker Compose 部署。

直接部署应用：

- 代码来源：支持从 GitHub 或任意 Git 仓库拉取源码，自动构建部署
- 构建方式：支持 Dockerfile、Nixpacks、Heroku Buildpacks 和 Paketo Buildpacks
- 环境变量：部署前可以在界面里配置
- 监控和日志：实时查看 CPU、内存、磁盘、网络占用以及应用日志

通过 Docker Compose 部署：

- 准备好 Dockerfile 和 `docker-compose.yml`
- 选择代码来源
- 在界面中管理整个生命周期，包括部署、停止、删除等
- 同样提供监控和日志

## 优点

以下情况截至 2026 年 11 月，最新版本是 v0.31.0。

- 多节点部署简单：安装时会自动启用 Docker Swarm 并配置好 overlay 网络，添加工作节点不需要手动配置 Swarm。副本、滚动更新和故障转移都可以直接用
- 构建与运行分离：可以单独指定构建服务器，镜像构建不占用跑应用的机器
- Docker Compose 支持好：现成的 `docker-compose.yml` 基本不用改就能部署，复杂的多服务项目也能处理
- 构建方式多：Dockerfile、Nixpacks、Heroku Buildpacks、Paketo Buildpacks 都支持，Coolify 不支持 Heroku Buildpacks
- PR 预览部署：每个 Pull Request 可以自动部署一个独立的预览环境，有单独的访问地址，体验接近 Vercel
- 备份范围更广：除了数据库备份，还可以备份 Docker 的 named volume
- 社区活跃：GitHub 上已经有 3.8 万 star，更新频率很高，提 issue 也比较容易得到维护者回复
- 技术栈对前端友好：使用 TypeScript、Next.js 和 tRPC 开发，熟悉 JavaScript 的开发者想改代码或者提 PR 门槛更低
- 成本低：自托管版本免费，没有按应用数量收费，一台 VPS 上可以跑很多应用。不想自己维护面板的话，官方的 Dokploy Cloud 每台服务器每月 4.5 美元起

## 缺点

- 不是纯开源：代码主体使用 Apache 2.0 协议，但 `proprietary` 目录下的代码使用 Dokploy Source Available License，在生产环境中使用需要和官方签商业协议。目前 SSO（OIDC、SAML）、SCIM、自定义角色、审计日志、应用前置登录（Forward Auth）、白标都属于企业版功能，价格没有公开，需要联系官方。相比之下 Coolify 的全部功能都是 Apache 2.0
- 安全漏洞较多：2026 年披露了一批高危漏洞，包括 WebSocket 终端越权获取任意容器 root shell、多处命令注入导致的远程代码执行，CVSS 评分最高 9.9，大部分在 v0.29.13 中修复。2025 年还有一个 CVE-2025-53825，公开仓库开启 PR 预览后，任何人提交 PR 就能在服务器上执行代码并读取环境变量。这些漏洞多数需要一个已登录的低权限账号，所以如果面板要分给多人使用，一定要及时升级
- 还没有 1.0：版本号仍然是 0.x，迭代快的同时也意味着升级可能带来变化，升级前最好先备份
- 部分监控功能只在 Cloud 版：自托管版可以在面板中实时查看各个资源的占用，但带告警阈值、数据保留设置的服务器监控模块，官方文档标注只在 Cloud 版本提供。自托管想要完整的监控告警，需要自己另外搭一套
- 资源占用不算低：官方要求至少 2GB 内存，1GB 内存的小鸡跑起来会比较吃力，这一点不如 [[CapRover]] 和 Dokku
- 只支持 Docker Swarm：不支持 [[Kubernetes]]，已经在用 K8s 的团队不适合
- 有一定门槛：界面里会直接暴露 Swarm 服务状态、Traefik 路由等细节，最好对 Docker 和 Traefik 有基本了解。文档也还有不少空白，遇到冷门问题时能搜到的教程比 Coolify 少
- Cloud 稳定性有争议：Hacker News 上有用户反映 Dokploy Cloud 出现过数小时的故障，而且官方没有公开 SLA。不过 Cloud 只托管控制面板，应用本身跑在用户自己的服务器上，面板宕机不影响应用运行

## 对比 Dokku

之前介绍过一款用 Go 语言实现的极简 PaaS 项目 [Dokku](https://blog.einverne.info/post/2023/09/dokku-minimum-paas.html)。Dokku 同样基于 Docker，非常轻量，低配置的服务器也能跑，开发者用起来也很方便。

和 Dokku 相比，Dokploy 的优势主要在于：

- 提供图形化的管理界面，Dokku 则以命令行为主
- 支持 Docker Compose
- 支持多节点部署
- 用户权限管理
- 内置数据库管理和数据备份
- 内置监控和日志

## 对比 Coolify

[Coolify](https://blog.einverne.info/post/2023/11/coolify-self-hosted-vercel.html) 是另一款我之前介绍过的 PaaS，功能同样强大。两者的底层思路不一样：Coolify 用 PHP 和 Laravel 开发，通过 SSH 在每台服务器上直接管理 Docker；Dokploy 则把服务器组成一个 Docker Swarm 集群来统一调度。

Dokploy 的优势在于原生的多节点部署、独立的构建服务器，以及对 Docker Compose 和 Heroku Buildpacks 的支持。

Coolify 的优势在于全部功能都是 Apache 2.0，SSO 之类的功能不用额外付费；项目更早，GitHub star 更多，社区和第三方教程也更丰富，还支持自动更新。2026 年发布的 Coolify v4.0 还内置了 MCP Server，可以直接让 AI Agent 操作。

早期 Coolify 的应用市场是一个明显的优势，不过现在 Dokploy 也有了 600 多个一键部署的模板，这方面的差距已经不大了。

如果只有一两台服务器，想要一个完全开源、上手简单的面板，选 Coolify 更省心；如果需要多节点集群、把构建和运行分开，并且能接受它的许可证，Dokploy 更合适。

## 应用

- [[Trigger]]

## related

- [[Dokku]]
- [[CapRover]]
- [[Coolify]]
- [[Tsuru]]
- [[Rancher]]，开源的容器管理平台
- [[Porter]]
- [[PocketBase]]
- [[Dockge]]
