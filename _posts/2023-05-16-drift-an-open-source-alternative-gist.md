---
layout: post
title: "Drift 一个开源可以自托管的 Gist"
aliases:
- "Drift 一个开源可以自托管的 Gist"
tagline: ""
description: ""
category: 产品体验
tags: [self-hosted, open-source, nextjs, react, typescript, docker, ]
create_time: 2023-05-16 09:46:49
last_updated: 2023-05-16 10:45:07
---

[Drift](https://github.com/MaxLeiter/drift) 是一个可以自行架设的 Gist 代替。使用 [[Next.js]] 13 和 React Server Components 编写。

Drift 发布了一个官方的 [Demo](https://drift.lol/)

![](https://photo.einverne.info/images/2023/05/16/95oD.png)

分享的文件页面内容

![](https://photo.einverne.info/images/2023/05/16/9d2L.png)

## 特性

- 支持 GitHub 扩展的 Markdown 渲染
- 支持用户登录，可以使用 GitHub OAuth
- 支持公开的，私有的，密码保护的内容
- 语法高亮和代码语言检查
- 拖拽的文件上传

## 安装

目前官方还没有发布编译好的 Docker 镜像，需要自己编译部署。但是也非常简单。

拉取官方的代码

```
git clone https://github.com/MaxLeiter/Drift.git
cd Drift
docker-compose build
```

目前为止因为项目还在开发过程中，编译过程可能会出现一些问题。

编译完成直接运行下面的命令即可。

```
docker-compose up -d
```
