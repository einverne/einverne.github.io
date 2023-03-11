---
layout: post
title: "GitHub Codespaces 使用"
aliases: 
- "GitHub Codespaces 使用"
tagline: ""
description: ""
category: 产品体验
tags: [ github, github-codespaces, visual-code ]
last_updated:
create_time: 2022-05-16 09:59:42
last_updated: 2022-10-20 05:27:37
---

很早以前就收到 GitHub 邮件说可以使用 Codespaces Beta 了。但当时没有怎么在意，最近在想要修改一些项目中个别配置的时候不想将整个项目都拉到本地然后再提交，就尝试了一下网页端的 Codespaces，没想到的是整个体验过程非常顺畅，并且自动同步了之前在 VSCode 上的所有配置。

![GitHub Codespaces](https://photo.einverne.info/images/2022/05/16/z7my.png)

点击下图中的 Create codespace 可以快速地创建。

![kMcr](https://photo.einverne.info/images/2023/03/02/kMcr.png)

默认会使用 4 核 8G 内存 32 GB 磁盘的 Codespaces。

GitHub Codespaces 已经正式发布了，免费的用户也可以拥有一个 2 核 15GB 空间，一个月 60 分钟的 Space 空间。如果选择 4 核的空间，相应的就只能免费使用 30 分钟；选择 8 核的空间就只能免费使用 15 分钟。

默认的 Codespaces 包括了常用的工具，包括 Python，Node.js，Docker 等等。[^1] 如果要使用自定义的镜像，那么可以参考 [这里](https://aka.ms/ghcs-default-image)

[^1]: <https://aka.ms/ghcs-default-image>

GitHub Codespaces 提供了一个在线的编程环境，GitHub 会创建一个在线的 Codespace，一个虚拟的容器。用户可以直接在浏览器中，或者通过本地的 Visual Studio Code 远程连接到该 Space，直接进行文件的修改。

用户所有创建的 Codespaces 都可以在[这里](https://github.com/codespaces) 找到。
