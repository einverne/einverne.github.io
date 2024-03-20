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

[Coolify](https://coolify.io/) 是一个可以自托管的，类似 [[Heroku]] / [[Netlify]] / [[Vercel]] 的 [[PaaS]] 服务。

- 源码：<https://github.com/coollabsio/coolify>

用户只需要在后台点击就可以托管应用，数据库，或其他开源服务。

- [[Coolify]] 支持非常多的语言，包括静态代码，Svelte，React，Vue，Next，Nuxt，Astro，PHP，Rust 等等
- 支持反向代理和免费的 SSL 证书（Let's Encrypt）
- 数据库支持 MongoDB，MySQL，PostgreSQL，CouchDB，Redis 等等
- 也支持一键安装常用的应用，包括 WordPress，Ghost，Plausible Analytics，NocoDB，Bitwarden/Vaultwarden，LanguageTool，[[n8n]]，VSCode Server 等服务
- 也天然支持 Docker

![4qv8](https://photo.einverne.info/images/2024/02/09/4qv8.png)

## Price

Coolify 是一个开放源代码的项目，但是如果你觉得 Coolify 很棒，也可以通过付费，或者捐赠来支持[作者](https://coolify.io/sponsorships)。

## Installation

为了安装 Coolify 需要满足最低的资源要求

- 2 CPU，因为编译部署任务比较繁重的时候看情况增加 CPU 计算能力
- 2 GB，如果部署的服务比较多，看情况增加内存
- 30 GB 以上的空间，镜像地址，以及数据库可能占用过多的磁盘空间，实时监控

在 root 下，一键安装脚本

```
apt install curl wget git jq jc
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

上述一键安装的脚本，会安装 Docker 并做一些配置，并启动 Coolify 容器。

注意容器启动之后会使用 8000 端口，注意在防火墙中放行。Coolify 还会用到如下的端口

- 80,443 反向代理
- 6001 websocket
- 9000~9100 公开端口（可选）

需要注意的是如果使用 Coolify 自带的应用安装，可能有一些应用需要提供域名，单纯的使用 IP 和端口无法正常访问。

安装之后，第一个注册的用户就是管理员，可以查看部署所有的资源，应用等等。

### 手动安装

因为 Coolify 是基于 Docker 的，所以也可以选择手动安装。

## 使用

之后每个注册的用户都拥有自己的团队，资源，只能访问自己的资源。

服务列表

![4AIn](https://photo.einverne.info/images/2024/02/09/4AIn.png)

支持服务列表包括并不局限于如下：

- WordPress
- Ghost
- Plausible Analytics
- NocoDB
- VSCode Server
- MinIO
- VaultWarden
- LanguageTool
- n8n
- Uptime Kuma
- MeiliSearch
- Umami
- Fider
- Hasura
- Appwrite
- Glitchtip

## sslip.io

sslip.io is a DNS server that maps specially-crafted DNS A records to IP addresses (e.g. "127-0-0-1.sslip.io" maps to 127.0.0.1).

## related

- [[Fider]]
- [[uptime-kuma]]
- [[Plausible Analytics]]
