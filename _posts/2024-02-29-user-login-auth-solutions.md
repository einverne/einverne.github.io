---
layout: post
title: "几个用户登录验证方案"
aliases:
- "几个用户登录验证方案"
tagline: ""
description: ""
category: 经验总结
tags: [ login, auth, user-login, saas, clerk ]
create_time: 2024-03-02 08:27:33
last_updated: 2024-03-02 08:27:33
dg-home: false
dg-publish: false
---

用户系统，登录验证几乎是每一个 SaaS 系统必备的入口功能，前两天在 Twitter 上看到有人自己设计的用户登录验证系统，因为瞬时使用的人太多，直接把登录入口打挂掉了，所以我就整理一下这篇文章，来看看如何快速的设计并使用用户登录验证系统。

我所了解的几个方案：

- 使用成熟的 [[BaaS]] （Backend-as-a-Service）方案，比如商业的 [[Firebase]]，或者开源的 [[Supabase]]，以及我之前介绍并在使用的 [[Appwrite]] 等等
- [[Clerk]] 最全面的用户管理平台
- React Next.js 下的方案 [[NextAuth.js]]

## BaaS

关于 BaaS 之前在我的笔记中其实也整理过一些，比如 PHP 编写的 [Appwrite](https://blog.einverne.info/post/2022/10/appwrite-usage.html)， Go 语言编写的 [PocketBase](https://blog.einverne.info/post/2023/01/pocketbase-baas-with-litestream-build-webapp.html) ，这一些都是可以自行托管，并且完全开源的项目，如果你寻求一些更商业化的项目，也可以考虑 Google 的 [[Firebase]] 或者社区商业化维护的 [[Supabase]]。

并且如果以 BaaS 或者 Firebase alternative 为关键字去搜索，也能找到非常多的实现方案，几乎每个语言都实现了一遍用户登录验证的方案。

## Clerk

[Clerk](https://clerk.com/) 给自己打的广告就是「最全面的用户管理方案」，作为一个创业公司，Clerk 给出的免费额度还是非常充足的。

免费一档的套餐，可以每个月有 10000 个活跃用户，这里的活跃用户指的是登录 24 小时之后再次登录的用户，如果用户没有再访问就不会记录为活跃用户。

![2yfDn9jp_v](https://pic.einverne.info/images/2yfDn9jp_v.png)

## NextAuth.js

[NextAuth.js](https://next-auth.js.org/) 是一个专门为 Next.js 而设计开发的用户登录验证系统，提供了前后端的实现，并且可以托管在 Serverless ，后端也可以搭配多个数据库使用，比如 MySQL，PostgreSQL，MSSQL，Mongo 等等，直接利用我之前介绍过的 [PlanetScale](https://blog.einverne.info/post/2022/08/planetscale-mysql-service.html) 也是可以的。

NextAuth 是一套完全开源的解决方案，借助一些 Serverless 的平台和 Cloud Database 也可以做到非常低的成本实现用户登录方案。
