---
layout: post
title: "BaaS 应用 Appwrite 体验和使用"
aliases:
- "BaaS 应用 Appwrite 体验和使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ appwrite, baas, self-hosted, php, flutter,  ]
create_time: 2022-10-09 10:36:42
last_updated: 2022-11-08 03:06:38
---

在 Twitter 的时间线上能看到越来越多的 Backend-as-a-Service 的产品发布，包括 [[Firebase]], [[supabase]], [[Railway]], [[Fly.io]], [[Okteto]], [[Nhost]] 等等，这两天又发现一款叫做 [[Appwrite]]。Appwrite 宣称自己的是 Firebase 的开源辅助，可以代替大部分的 Firebase 功能。

看来创始人起名字的时候也非常直截了当，Appwrite 就是一款为前端和移动开发人员提供的可以自行搭建的后端服务，使用 PHP 编写，提供了构建一款应用需要的最基础的一些功能，比如注册，登录，K-V数据存储，云函数等等功能。并且 Appwrite 提供了非常多的客户端支持，包括常用的 iOS，Flutter，Android，Swift 等等，也包括了大部分的后端常用语言的 SDK，Python，Php，Ruby 等等。

## Installation
Appwrite 官方提供了直接通过 Docker 命令来安装 Appwrite 的方法，见[这里](https://appwrite.io/docs/installation)。但本人觉得 docker-compose 的方式执行扩展性和可配置性都比较好，所以这里就使用 docker-compose 来安装 Appwrite。

- <https://github.com/einverne/dockerfile/tree/master/appwrite>

环境变量的含义见[官网](https://appwrite.io/docs/environment-variables)。

## Appwrite OAuth
通过 Appwrite 提供的身份验证功能，可以轻松地集成三方的登录服务，包括 Facebook, GitHub, LinkedIn 等等。

## Appwrite Tasks

Tasks 服务提供了定期执行任务的能力，不管是 contabs 或者长时间运行的守护程序都可以实现。

## Appwrite Webhooks
Webhooks 允许快速集成后端任务的触发，比如在新用户注册的时候发送邮件通知，或者在应用文档更新时清除缓存都可以通过 Webhooks 方式实现。


