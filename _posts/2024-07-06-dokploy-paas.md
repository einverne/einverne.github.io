---
layout: post
title: "Dokploy 又一个开源自托管的 PaaS 平台"
aliases:
- "Dokploy 又一个开源自托管的 PaaS 平台"
tagline: ""
description: ""
category: 产品体验
tags: [ dokploy, paas, saas, docker, traefik, heroku, vercel, netlify ]
create_time: 2024-08-02 10:52:14
last_updated: 2024-08-02 10:52:14
dg-home: false
dg-publish: false
---

[Dokploy](https://dokploy.com/) 是一个开源的，可以自托管的 PaaS 平台，Dokploy 可以一站式部署管理平台，简化应用程序和数据库的部署和管理。结合了 Docker 和 Traefik 的功能，为用户提供了一个经济高效的自托管平台即服务 PaaS 解决方案。

Dokploy 可以用来代替 [[Heroku]]，[[Vercel]]，[[Netlify]] 等平台。

## 功能

- Dokploy 深度集成了 Docker，支持创建，部署和更新 Docker 容器。用户可以轻松地将各种类型的应用（PHP，Python，Java，Go，Ruby 等）部署到 VPS 上，并确保应用处于最新状态。
- Traefik 负载均衡，自动整合 Traefik，提供了智能 HTTP 反向代理和负载均衡器，优化了网络流量分配
- 实时监控，提供了直观的实时监控，允许用户监控 CPU，内存，存储和网络使用情况
- 数据库管理，支持多种数据库服务，MySQL，PostgreSQL，MongoDB 等，并提供自动备份功能
- 易用性，用户只需要一条命令就可以在 VPS 上安装 Dokploy，快速启动部署流程

## 安装

要在 VPS 上安装 Dokploy，首先需要通过 SSH 登录到服务器，然后执行以下命令

```
curl -sSL https://dokploy.com/install.sh | sh
```

该命令会自动安装 Dokploy 及其所需的 Docker 环境。

## 使用

### 初始化设置

安装完成之后，系统会显示一个 URL，服务器 IP:3000 ，在浏览器访问 URL，用户进入注册页面，设置邮箱和密码完成注册。

### 域名设置

登录后，进入 Settings 标签页，在 Server Domain 中输入已设置 A 记录的管理域名（如 web.example.com）。在 Letsencrypt Email 中输入邮箱地址，并选择 Letsencrypt 作为证书提供商，然后点击 Save。系统会自动获取 SSL 证书，之后可以通过 https://web.example.com 访问管理界面。

### 应用程序部署

Dokploy 支持两种主要的部署方法：直接部署应用程序和使用 Docker Compose 部署。

- 直接通过源代码，编译部署，支持 GitHub，Git 等
- 选择构建类型，支持 Docker、Nixpacks、Heroku Buildpacks 和 Paketo Buildpacks。
- 添加环境变量，部署前配置环境变量
- 监控和日志，实时监控 CPU，内存，磁盘和网络使用情况

通过 Docker Compose 部署

- 创建 Dockerfiles 和 docker-compose.yml 文件
- 生命周期管理，部署，停止，删除等
- 源代码配置，选择代码
- 监控和日志

## 相较于 Dokku

之前也介绍过一款使用 Go 语言实现的最小的 PaaS 项目 [Dokku](https://blog.einverne.info/post/2023/09/dokku-minimum-paas.html)，开发者也是可以非常轻松地部署应用程序，Dokku 也是基于 Docker，非常轻量，可以安装在一台非常低配置的服务器中。

相较于 Dokku，Dokploy 则是提供了更有好的交互界面，并且支持 Docker Compose，还支持多节点部署。

Dokploy 的优势

- 用户界面
- Docker Compose 支持
- 多节点支持
- 用户权限管理
- 数据库支持
- 监控和日志
- 数据备份

## 相较于 Coolify

之前还介绍过一个叫做 [Coolify](https://blog.einverne.info/post/2023/11/coolify-self-hosted-vercel.html) 的 PaaS 应用，Coolify 同样非常的强大，相比于 Coolify，Dokploy 胜在内建的多节点部署支持，以及内建的监控。

但是 Coolify 更友好的一点是，Coolify 支持内建的应用市场，支持通过界面点击完成安装。另外 Coolify 拥有非常活跃的社区，文档相对丰富。

## related

- [[Dokku]]
- [[CapRover]]
- [[Coolify]]
- [[Tsuru]]
- [[Rancher]]
- [[Porter]]
