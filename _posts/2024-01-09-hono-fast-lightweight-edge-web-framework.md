---
layout: post
title: "Hono 一个快速轻量的运行在边缘节点的 Web 框架"
aliases:
- "Hono 一个快速轻量的运行在边缘节点的 Web 框架"
tagline: ""
description: ""
category: 学习笔记
tags: [ web, web-framework, edge, cloudflare, cloudfare-worker, deno, vercel, ]
create_time: 2024-02-10 11:56:16
last_updated: 2024-02-10 11:56:16
---

[Hono](https://hono.dev/) 是一个运行在边缘节点的 JavaScript Edges Web 框架，可以在任何支持 JavaScript 运行的服务上，包括 Cloudflare Workers，Fastly Compute@Edge，Deno，Bun，Vercel，Netlify，Lagon，AWS Lambda，Lambda@Edge 和 Node.js。

Hono 的特点就是简单，轻量，快。

- 快，RegExpRouter 快
- 轻，`hono/tiny` 只有 14kB，零依赖
- Multi-runtime，支持非常多的 JavaScript 运行时
- 完整，自带中间件，可以自定义中间件
  - 验证，缓存，Cookie，CORS，ETag 等等

## 使用场景

- 构建 Web API
- 后端服务代理
- CDN
- Edge 应用
- 基础服务
- 全栈应用

下面是一些具体的使用 Hono 的产品

- [drivly](https://driv.ly/) 通过数据驱动的电商平台构建工具
- [repeat.dev](https://repeat.dev/) 定时触发调用 webhook 的服务

## 使用

创建项目

```
pnpm create hono my-app
```

我创建了一个项目，接受上传图片，并生成一个随机的图片名称，然后上传到 Cloudflare R2。代码见[GitHub](https://github.com/einverne/hono-cloudflare-r2)。

然后配套 [uPic](https://blog.einverne.info/post/2022/05/upic-upload-images.html) 直接上传到 R2，然后获取 R2 的直接链接。

Head

```
Content_Type: multipart/form-data
Authorization: Bearer my-secret-token
```

采用 `form-data` 上传，文件 key 是 file。

![2PiP904C8H](https://pic.einverne.info/images/2PiP904C8H.png)
