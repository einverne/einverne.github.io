---
layout: post
title: "Yarn Workspaces 工作区"
aliases:
- "Yarn Workspaces 工作区"
tagline: ""
description: ""
category: 经验总结
tags: [yarn, yarn-workspace, package, package-management, npm, javascript, frontend]
create_time: 2024-09-07 14:40:54
last_updated: 2024-09-07 14:40:54
dg-home: false
dg-publish: false
---

[Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) 工作区是一种新的包管理方法，从 1.0 开始默认可用，它允许用户已工作区的方式只需要运行一次 `yarn install` 就可以安装所有的包。

Yarn Workspaces 是 Yarn 提供的 Monorepository 的管理机制，这使得我们可以在同一个代码库中管理多个项目，并且允许这些项目之间相互依赖，交叉引用。

## 为什么要有工作区的概念

## 如何使用

根目录下的 `package.json`

```
{
  "private": true,
  "workspaces": ["workspace-a", "workspace-b"]
}
```

注意 `private: true` 是必须的，工作区不应该被发布。

创建此文件后，创建两个名为 workspace-a 和 workspace-b 的新子文件夹。在每个文件夹中，可以创建单独的 package.json 文件。

比如工作区 a 中的 `package.json`

```
{
  "name": "workspace-a",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5"
  }
}
```

以及工作区 b 中的

```
{
  "name": "workspace-b",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5",
    "workspace-a": "1.0.0"
  }
}
```

最后运行 `yarn install` ，这样 workspace-b 中对 workspace-a 的依赖会直接使用本地的代码。

使用如下的命令可以获取整个 workspaces 的目录结构

```
yarn workspaces info [--json]
```

## 常用命令

在指定的 workspace 下执行命令

```
yarn workspaces <workspace_name> <command>
```

在每一个工作区中运行命令

```
yarn workspaces run <command>
```

在 yarn 2.4.3 中引入新的命令。

首先需要安装 workspace-tools 插件

```
yarn plugin import workspace-tools
```

安装单个工作区依赖

```
yarn workspaces focus
```
