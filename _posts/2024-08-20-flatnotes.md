---
layout: post
title: "一款无数据库在线笔记 Flatnotes"
aliases:
- "一款无数据库在线笔记 Flatnotes"
tagline: ""
description: ""
category: 产品体验
tags: [ flatnotes, markdown, docker, obsidian, obsidian-vault ]
create_time: 2024-08-20 09:25:23
last_updated: 2024-08-20 09:25:23
dg-home: false
dg-publish: false
---

在我的 TODO List 里面很久之前记录了一下 Flatnotes，正好今天抽空整理了一下，

[Flatnotes](https://github.com/dullage/flatnotes) 是一个开源的，自托管的、无数据库的笔记 Web 应用程序，Flatnotes 使用 Python 和 Vue 的技术栈，利用文件夹存储 Markdown 文件。它提供了一个简洁高效的平台，适合个人知识管理项目。

## 什么是 Flatnotes？

Flatnotes 是一个轻量级的笔记应用，专为那些喜欢使用 Markdown 格式记录学习笔记、技术心得和读书感悟的用户设计。它的主要特点包括：

- 自托管：用户可以完全控制自己的数据，确保数据的安全性和私密性。
- 无数据库：Flatnotes 不需要数据库，所有笔记都以 Markdown 文件的形式存储在文件夹中，简化了数据管理。
- 移动响应式界面：支持在各种设备上访问，提供流畅的用户体验。

## 优点

- 简单易用：无需复杂的数据库配置，使用文件夹结构管理笔记。
- 高度可定制：用户可以根据需要自定义界面和功能。
- 安全性：自托管特性确保数据的完全控制。
- Markdown 支持：利用 Markdown 的简洁性和可读性记录笔记。

## 缺点

- 功能有限：只支持在线简单的 Markdown 或者 WYSIWYG 编辑器，相比一些复杂的笔记应用，Flatnotes 的功能较为简单。
- 不适合大规模协作：更适合小型团队或个人使用，大型团队可能需要更复杂的协作工具。
- 搜索不支持中文，Flatnotes 使用 [[Whoosh]] 作为全文搜索引擎，对英文的支持比较好，但是其他语言支持不行

## 如何使用 Docker Compose 搭建 Flatnotes？

Docker Compose 是一个用于定义和运行多容器 Docker 应用的工具。通过一个简单的 YAML 文件，用户可以快速部署和管理容器化应用。以下是使用 Docker Compose 搭建 Flatnotes 的步骤：

1. 安装 Docker 和 Docker Compose，确保系统上已安装 Docker 和 Docker Compose。可以通过包管理器或从 Docker 官方网站下载并安装。
2. 使用 docker-compose.yml 文件，在我的 [dockerfile](https://github.com/einverne/dockerfile) 中找到 flatnotes，然后配置 `.env` 文件
3. 启动 Flatnotes 服务：
   - 在命令行中导航到 `docker-compose.yml` 文件所在的目录，运行以下命令启动服务： `docker-compose up -d`
   - 该命令会在后台启动 Flatnotes 服务，并在本地的 8080 端口上提供访问。
4. 访问 Flatnotes 应用：
   - 打开浏览器，访问 `http://localhost:8080`，使用配置的用户名和密码登录。

之后可以使用 [[Nginx Proxy Manager]] 等等方法反代实现域名访问。
