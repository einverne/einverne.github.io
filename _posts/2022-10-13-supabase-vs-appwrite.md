---
layout: post
title: "Supabase 和 Appwrite 区别"
aliases:
- "Supabase 和 Appwrite 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [ supabase, appwrite, baas, backend, serverless, function-compute  ]
create_time: 2022-10-13 09:47:54
last_updated: 2022-10-13 05:24:06
---

在 Twitter 的时间线以及经常去的论坛上，[[Supabase]]，[[Appwrite]]，等等 Backend as a Service 的服务出现的频率越来越多，

Supabase 和 Appwrite 都是将自己称为 [[BaaS]] 来作为 Firebase 的代替。

**Appwrite** 在 2019 年 9 月首次发布，使用 PHP，TypeScript 编写。Supabase 首次发布于 2022 年 6 月，使用 TypeScript 编写。

Supabase 优点：

- 可以自托管
- 构建在关系型数据库 [[PostgreSQL]] 之上，提供实时数据库，身份验证
- 支持对象存储 Object Storage
- 可以使用 PostgreSQL 的扩展和插件
- 拥有活跃的社区和丰富的生态系统

Appwrite 优点：

- 基于 PHP，支持多种数据库
- [[Appwrite]] 可以自托管，支持多租户。这也就意味着单一的 Appwrite 实例可以支持无数账户和项目
- 提供身份验证，数据库，存储，云函数，队列等多个功能
- 可以通过 Docker 镜像快速启动
- Appwrite 不是用来代替当前的技术栈而是设计用来辅助，所以可以和当前的后端很好的融合
- Appwrite SDK 支持很多语言，接口设计也非常简洁
- 支持云函数
- 支持很多客户端，包括 Flutter, Android, iOS, Kotlin, Python, php, JavaScript 等等
- 支持超过 20 个 OAuth
- 无状态架构，所以可以非常轻松水平扩展

## related

- [[Appsmith]]

## reference

- <https://news.ycombinator.com/item?id=29010484>
- <https://medium.com/geekculture/appwrite-frequently-asked-questions-374ce81513fe>
- <https://medium.com/geekculture/appwrite-frequently-asked-questions-374ce81513fe>
