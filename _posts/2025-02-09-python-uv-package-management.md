---
layout: post
title: "使用 uv 作为 Python 包和项目管理工具"
aliases:
- "使用 uv 作为 Python 包和项目管理工具"
tagline: ""
description: ""
category: 经验总结
tags: [ python, pip, uv, pyenv, poetry, python-package, pip-install, fastapi, ]
create_time: 2025-03-25 09:29:34
last_updated: 2025-03-25 09:29:34
dg-home: false
dg-publish: false
---

之前在使用一个 FastAPI 的模板项目的时候，很偶然获知了 uv 这样一个 Python 的包管理工具，简单的查询了一下之后发现这一工具是使用 Rust 编写，已经慢慢获得了社区的认可，被越来越多人推荐了，所以今天我也好好地学习一下 uv。

## uv 是什么

uv 是 [astral-sh](https://github.com/astral-sh) 社区利用 Rust 编写的 Python 包和项目管理工具，可以作为  `pip`、`pip-tools`、`pipx`、`poetry`、`pyenv`、`virtualenv`  等工具的代替。在没有 uv 之前，你可能需要使用 pyenv 来管理 Python 的不同版本，使用 venv 或者 pipenv 来管理虚拟环境，还需要使用 poetry 来管理包依赖，但是拥有了 uv 之后，你就拥有了全部。

- Python 项目管理
- 安装和管理不同版本的 Python
- 比 pip 快 10 倍

## 安装

在 macOS 下可以直接 Homebrew

```
brew install uv
```

## 使用

### 管理多版本

管理多版本，查看可用的 Python 版本

```
uv python list
```

默认情况下，list 命令只会显示次版本号的版本，如果需要查看全部版本可以

```
uv python list --all-versions
```

利用如下的命令安装，也可以同时指定多个版本

```
uv python install
uv python install 3.10
uv python install 3.10 3.11
```

查看本地安装路径

```
uv python dir
```

移除安装的版本

```
uv python uninstall 3.10
uv python uninstall 3.10 3.11
```

### 执行命令

uv 可以代替 Python 或 pip 命令来直接执行 Python 文件。

```
uv run path/to/some.py
```

uv 会自动根据它所能找到的 Python 来执行脚本

- 资料下的 `.python-version` 指定的版本
- 当前启用的虚拟环境
- 当前 `.venv` 文件中的虚拟环境版本
- nv 自己安装的 Python
- 系统环境变量指定的 Python 版本

或者也可以通过手动指定版本来运行

```
uv run --python 3.10 path/to/some.py
```

如果指定的版本不存在，nv 会自动安装符合的版本。

也可以直接从标准输入执行

```
echo 'print("hello world")' | uv run -
```

### 虚拟环境

如果临时使用一些依赖可以使用 `--with` 选项，但是如果要批量进行管理，还可以利用 uv 自带的虚拟环境管理。

```
uv venv
```

### 管理依赖

```
uv pip install flask
```

uv pip 和 pip 使用一致。

可以利用如下的命令查看包依赖关系

```
uv pip tree
```

### 创建项目

可以利用 init 命令来创建项目

```
uv init test
```

新项目的目录下会生成  `pyproject.toml`、`.python-version`  文件。

添加依赖

```
uv add httpie
```

移除

```
uv remove httpie
```

`pyproject.toml` 文件中会记录项目依赖的包版本。

也可以手动修改 dependencies 中的依赖，然后执行 `uv lock`，让 `uv.lock` 和 `pyproject.toml` 一致。

然后利用 `uv sync` 来实际的环境中的包和 uv.lock 一致。

更新特定包

```
uv lock --upgrade-package flask
```

或者更新所有包

```
uv lock --upgrade
```

### 将包提供的命令安装到系统

uv 可以通过 tool 的命令将包中提供的命令暴露给操作系统调用。

```
uv tool install httpie
```

nv 会建立一个独立的虚拟环境来安装，这样就可以直接在命令行执行 http 命令

命令的位置可以通过 `uv tool dir` 来查看，可以通过如下的命令更新

```
uv tool upgrade httpie
```

如果不需要也可以卸载

```
uv tool uninstall httpie
```

## related

- [[pip]]
- [[rye]]
- [[pipx]]
- [[poetry]]
- [[pyenv]]
