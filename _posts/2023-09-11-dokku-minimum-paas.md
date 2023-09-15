---
layout: post
title: "使用 Dokku 构建属于你自己的 PaaS"
aliases:
- "使用 Dokku 构建属于你自己的 PaaS"
tagline: ""
description: ""
category: 产品体验
tags: [open-source, paas, dokku, vps]
create_time: 2023-09-15 21:38:58
last_updated: 2023-09-15 21:38:58
---

[Dokku](https://dokku.com/) 是一个开源的 PaaS，用户可以非常轻松地构建自己的 PaaS 云平台。

## 什么是 PaaS

在深入了解 Dokku 之前，先来了解一下什么是 [[PaaS]]，PaaS 的全称是 Platform as a Service，平台即服务。典型的产品有 [[Heroku]]，[[Vercel]] 等等。

PaaS 作为一个平台提供给了开发者构建，部署，管理应用的能力，开发者不再需要关系复杂的基础设施，比如操作系统，网络，硬件等等。PaaS 提供商通常提供开发工具，运行时环境，应用管理后台等等。除了上面提到的 [[Heroku]] 之外，AWS Elastic Beanstalk，Google Apple Engine，Microsoft Azure App Service。

与之对应的概念还有

- [[IaaS]]，Infrastructure as a Service，基础设施即服务，通过虚拟化技术，提供了操作系统级别的服务，允许用户租用虚拟服务器，包括计算资源，存储，内存，网络等等。典型的 IaaS 提供商是 Amazon AWS（Amazon Web Services），Microsoft Azure，Google Cloud Platform，[[Oracle Cloud]]，阿里云等等
- [[BaaS]]，Backend-as-a-Service，一种托管的后端服务，比如提供托管的数据库，后端代码的运行时环境，通常也会提供能让开发者轻松构建移动应用或 Web 应用的后台服务，开发者无需自己维护后端数据库及应用程序运行时。BaaS 通常会提供数据存储，用户管理，文件存储，通知推送，第三方 API 集成等。借助 BaaS 开发者可以不用关心数据，只专注于前端，用户界面的体验。常见的提供商有 Google [[Firebase]]，Facebook Parse，AWS Amplify，[[supabase]] 等等。开源的代替也有我之前介绍过的 [Appwrite](/post/2022/10/appwrite-usage.html)。
- [[SaaS]]，Software-as-a-Service，软件即服务，通过互联网提供给用户软件产品。用户通过网络访问使用这些服务而不需要自己安装，配置和维护这些软件。
- [[FaaS]]，Function-as-a-Service，函数即服务，开发者专注于编写函数（片段的代码），配置触发器来指定函数何时触发。函数被触发时，自动分配计算资源，执行用户代码，并返回结果。开发者不用再关心除函数以外的其他资源。FaaS 提供商包括 AWS Lambda，Google Cloud Functions，Azure Functions。

传统的 IT 基础设施需要运维人员从下到上管理

- 应用程序
- 数据
- 运行时
- 中间件
- 操作系统
- 虚拟化
- 服务器
- 存储
- 网络

而上面提到的概念则是将不同的部分组合，一步一步简化了开发程序的过程。开发者关系的细节越来越少，与此同时可以在此基础上构建出丰富多彩的应用程序（SaaS）。

## 什么是 Dokku

Dokku 是一个使用 Go 语言编写的，开源的，最小化的 PaaS 平台。

## 如何安装 Dokku

环境要求：

- 全新安装的 Ubuntu 16.04 x64, Ubuntu 14.04 x64, Debian 8.2 x64
- 至少 1GB 内存

Dokku [官网文档](https://dokku.com/docs/getting-started/installation/)上有很多的安装方式。推荐的安装方式是直接用一台全新的 VPS，直接安装。我尝试使用 Docker Compose 来安装，发现端口映射以及 SSH Key 配置要麻烦很多。

### 数据库支持

Dokku 自身不支持数据库，但是可以通过插件的形式来支持。从传统的 MariaDB，[[PostgreSQL]]，到 [[CouchDB]]，[[Elasticsearch]] 等等，都可以从[这个链接](https://dokku.com/docs/community/plugins/#official-plugins-beta) 查看。

## 如何部署应用程序

因为 Dokku 是一个 Heroku 的最小化实现，所以 Heroku 在 GitHub 仓库中的所有例子都可以在 Dokku 这里使用。

- python: [python-django-sample](https://github.com/heroku/python-django-sample)
- java:[java-sample](https://github.com/heroku/java-sample)
- spring:[java-spring-sample](https://github.com/heroku/java-spring-sample)
- scala:[scala-sample](https://github.com/heroku/scala-sample)
- php:[php-getting-started](https://github.com/heroku/php-getting-started)
- go-kafaka:[heroku-kafka-demo-go](https://github.com/heroku/heroku-kafka-demo-go)

如果安装好 Dokku，之后部署应用的步骤基本上也就是分成两部分，在本地完成代码，然后添加 Dokku 为远程，直接将代码推送到远程。

```
mkdir my-app
cd my-app
npx create-react-app .

git remote add dokku dokku@example.com:my-app
git push dokku master
```

更具体的部署操作可以查看[这里](https://dokku.com/docs/deployment/application-deployment/)。

Dokku 默认会使用  [Heroku Buildpack](https://devcenter.heroku.com/articles/buildpacks)  方式部署应用。Buildpack 由一系列脚本组成，会自动完成检测、构建、编译、发布等工作。

目前已支持 Ruby, Node.js, Java, Python, PHP, Go 等众多类型的应用。

## 常用的命令

创建应用

```
dokku apps:create $APP_NAME
```

## 总结

借助 Dokku 可以让你不在受限于 Firebase，Amazon Elastic Beanstalk，或者 Heroku 的平台，并且 Dokku 和这些服务相比丝毫不差。但于此同时，你需要自己维护 Dokku，并自己管理 Dokku 扩容以及 Dokku 运行的环境。
