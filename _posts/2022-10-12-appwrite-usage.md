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

在 Twitter 的时间线上能看到越来越多的 Backend-as-a-Service 的产品发布，包括 [[Firebase]], [[Supabase]], [[Railway]], [[Fly.io]], [[Okteto]], [[Nhost]] 等等，这两天又发现一款叫做 [[Appwrite]]。Appwrite 宣称自己的是 Firebase 的开源辅助，可以代替大部分的 Firebase 功能。

看来创始人起名字的时候也非常直截了当，Appwrite 就是一款为前端和移动开发人员提供的可以自行搭建的后端服务，使用 PHP 编写，提供了构建一款应用需要的最基础的一些功能，比如注册，登录，K-V 数据存储，云函数等等功能。并且 Appwrite 提供了非常多的客户端支持，包括常用的 iOS，Flutter，Android，Swift 等等，也包括了大部分的后端常用语言的 SDK，Python，Php，Ruby 等等。

Appwrite 是一个开源的、自托管的，Backend-as-a-Service（BaaS，后端即服务），可以快速构建安全的、现代的应用程序。Appwrite 提供了用户身份验证，授权，会话管理，角色访问控制，数据库，对象存储等等基础组件。

![appwrite](https://photo.einverne.info/images/2023/02/24/kCGN.jpg)

## Installation

Appwrite 官方提供了直接通过 Docker 命令来安装 Appwrite 的方法，见[这里](https://appwrite.io/docs/installation)。但本人觉得 docker-compose 的方式执行扩展性和可配置性都比较好，所以这里就使用 docker-compose 来安装 Appwrite。

- <https://github.com/einverne/dockerfile/tree/master/appwrite>

环境变量的含义见[官网](https://appwrite.io/docs/environment-variables)。

功能

- 数据库
- 存储
- 本地化
- 功能
- 控制台

为什么用 appwrite 替代 Firebase?

- 是开源的
- 开发者社区不断扩张
- 专注于 Web/Flutter 开发者
- 简洁

## 功能

### Appwrite OAuth

通过 Appwrite 提供的身份验证功能，可以轻松地集成三方的登录服务，包括 Facebook, GitHub, LinkedIn 等等。

借助 Appwrite 可以快速构建一个用户账户登录系统，并且 Appwrite 支持用户使用邮箱密码，Magic 链接等等方式来验证登录自己的账户。

### Appwrite Tasks

Tasks 服务提供了定期执行任务的能力，不管是 contabs 或者长时间运行的守护程序都可以实现。

Appwrite Task 服务是设置定期计划作业的方法。无需使用复杂的 crontabs 或长时间运行的守护程序进行处理，不必担心诸如容错，监视和错误日志记录之类的事情，您所要做的就是提交带有任务的表单作为 HTTP 端点和类似 cron 的语法，以指示如何通常应该执行它。

### Appwrite Webhooks

Webhooks 允许快速集成后端任务的触发，比如在新用户注册的时候发送邮件通知，或者在应用文档更新时清除缓存都可以通过 Webhooks 方式实现。

### 存储

Appwrite 存储服务是让您或您的应用程序用户，安全、简单地上传和管理文件的最简单方法。Appwrite Storage API 利用了与 Appwrite 数据库相同的简单读写权限机制。这使您可以轻松地决定是否所有用户，特定用户甚至用户团队都可以访问您的文件。
Appwrite Storage 服务提供的最有用的功能之一是能够预览文件内容并将其显示为应用程序或网站中的缩略图的功能。您还可以动态更改缩略图的大小，在不同的图像格式之间转换它们（支持 webp 格式），并更改其质量以改善网络性能。

### 团队管理

Appwrite Teams 服务允许您和您的用户创建团队并共享对不同 API 资源（如文件或文档）的许可。每个团队成员还可以担任不同的角色，以使开发者拥有更大的灵活性。


## API

### Account API vs Users API

Account API 在当前登录的用户下，通常是客户端集成。而 Users API 通常是集成到服务端，在管理员的权限下，用来操作所有用户。

当通过 JWT 验证的时候，Account API 中有一些方法也可以被服务端使用。这可以允许服务端来以用户的身份执行某些行为。


## related

