---
layout: post
title: "Github Actions 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [github, github-actions, ci-cd, continuous-integration, ]
last_updated:
---

GitHub Actions 是 GitHub 推出的 CI/CD 工具，通过简单的语法可以做一些 build, deploy 等等的事情。

## 核心功能与用途

- 自动执行构建、测试、部署等流程，实现开发流程自动化。
- 可以根据代码仓库中的事件（如 push、pull request、issue 创建等）自动触发预设的工作流（Workflow）。
- 支持多种操作系统（Linux、Windows、macOS）的虚拟机环境，也可以使用自托管 Runner。
- 通过 GitHub Marketplace 可复用和共享他人编写的 Action，减少重复劳动

## 基本概念

- Workflow，工作流，定义自动化流程的整体
- Job，任务，Workflow 中的执行单元，可并行或串行，Job 可以单独在独立的 Runner 上运行
- Step，步骤，每个 Job 包含多个 Step，负责具体的命令或 Action 执行
- Action，动作，预定义的可复用任务单元，可以自己编写或者引用他人分享的 Action
- Runner，运行环境，负责实际执行 Job 的虚拟机或者自托管服务器。

## 工作原理

1. 在仓库的 `.github/workflows` 目录下添加 YAML 配置文件，定义 Workflow。
2. 通过 `on` 字段指定触发条件（如 `push`、`pull_request` 等）。
3. 每当触发事件发生时，GitHub Actions 会自动分配 Runner 执行对应的 Job 和 Step。
4. Step 可以直接写命令，也可以调用 Action（如代码检出、依赖安装、测试、部署等）。

一个简单的示例

```
name: CI
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest
```

## Workflow

放在仓库根目录 `.github/workflows` 文件夹下。yaml 格式。语法规则见：

- <https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions>

## 寻找 Actions

官方的 Actions 都放在 <https://github.com/actions> 仓库中。

- 官方的市场 <https://github.com/marketplace?type=actions>
- Awesome actions <https://github.com/sdras/awesome-actions>
