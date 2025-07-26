---
layout: post
title: "Python 依赖管理工具 Poetry 使用笔记"
aliases: 
- "Python 依赖管理工具 Poetry 使用笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [ poetry, python, dependency-management, pyenv ]
last_updated: 2025-07-17 09:55:39
create_time: 2022-01-25 05:23:03
---

[Poetry](https://python-poetry.org/docs) 是一个现代的 Python 依赖和虚拟环境管理工具，集项目初始化、依赖管理、虚拟环境自动化、打包与发布于一体，极大简化了 Python 项目的开发流程

Poetry 需要 Python 2.7 或者 3.5+。

## 安装

推荐直接全局安装

```
pip install poetry
```

安装完成之后即可使用  `poetry` 命令，也可以参考使用官方的安装脚本（推荐使用 pip 安装）：

```
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
```

安装成功后执行 `poetry --version` 可以获取 Poetry 的版本，证明安装成功。

zsh 自动补全，因为我使用 [zinit](/post/2020/10/use-zinit-to-manage-zsh-plugins.html) 所以直接：

    poetry completions zsh > ~/.zinit/completions/_poetry

需要重启终端才能生效，可以使用 TAB 自动补全。

其他终端的配置可以参考官网。

## 使用

### 初始化新项目

可以通过如下方法初始化：

    poetry new poetry-demo

### 初始化已经存在的项目
如果项目已经存在，可以使用 `init`

    cd pre-existing-project
    poetry init

该命令会引导用户输入项目名，作者，依赖等等，并生成核心配置文件 `pyproject.toml`。

Poetry 会自动为每个项目创建独立虚拟环境，不需要手动操作。

```
poetry env use python3.12
```

进入 Shell，自动激活环境:

    poetry shell

退出直接使用 `exit`。

### 添加依赖
可以通过如下的方式添加依赖，会自动安装到虚拟环境并写入 pyproject.toml 配置

```
poetry add requests
```

只添加开发依赖

```
poetry add --dev pytest
```

移除

```
poetry remove requests
```

列出依赖树

```
poetry show --tree
```

### 项目环境安装

一键安装项目全部依赖

```
poetry install
```

### 在虚拟环境中运行Python脚本

```
poetry run python path/to/script.py
```

### 导出标准 pip 格式依赖清单
可以导出到 requirements.txt

```
poetry export -f requirements.txt --output requirements.txt
```

