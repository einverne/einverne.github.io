---
layout: post
title: "pipenv 使用"
aliases: "pipenv 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [python, virtualenv, pyenv, pipenv, ]
last_updated:
---

[pipenv](https://github.com/pypa/pipenv) 是目前[官方](https://packaging.python.org/tutorials/managing-dependencies/#managing-dependencies) 推荐使用的包管理工具。

- 能够为项目创建和管理虚拟环境，从 `Pipfile` 文件添加或删除安装的包，`Pipfile.lock` 来锁定安装包的版本和依赖信息。
- 不用再维护 `requirements.txt`, 使用 `Pipfile` 和 `Pipfile.lock` 来代替
- 在安装了 `pyenv` 的条件下，可以自动安装需要的 Python 版本

这里就不得不提到 [pyenv](/post/2017/04/pyenv.html) 了，`pyenv` 能用来管理不同的 Python 版本，结合 `pyenv-virtualenv` 也能够快速创建虚拟环境，不过这个 `pipenv` 提供了另外一种思路。

## 安装 {#installation}
安装：

    pip install pipenv

基本使用

- 虚拟环境如果不存在的话，会自动创建
- `--three / --two     Use Python 3/2 when creating virtualenv.`

如果在 macOS 下：

    brew install pipenv


## 常用命令

- `pipenv install package`
- `pipenv update package` 升级包

### 指定 Python 版本信息
在创建虚拟环境时，我们可以使用 python 版本信息

    pipenv --python 3
    pipenv --python 3.6.1
    pipenv --python 2.7.13

pipenv 会自动扫描系统寻找合适的版本信息，如果找不到的话，同时又安装了 pyenv, 它会自动调用 pyenv 下载对应的版本的 python


### 安装包
类似 pip

    pipenv install requests
    pipenv install requests==2.19.1
    pipenv install --dev requests       # 安装开发环境依赖

如果 install 后面没有任何 package 会自动安装所有，第一次安装包会自动生成 lock 文件

兼容 `requirements.txt`

    pipenv install -r path/to/requirements.txt

同样可以使用 `Pipfile` 和 `Pipfile.lock` 文件来生成 requirements.txt

    pipenv lock -r
    pipenv lock -r -d       # 生成 dev requirements

所以一个基本流程就是，对于 pipenv 管理的项目，使用 `pipenv lock` 来冻结管理，在分享给别人之后使用 `pipenv install` 来安装依赖。

### 指定安装包源
直接修改 `Pipfile` 文件

```
[[source]]
url = "https://pypi.python.org/simple"
verify_ssl = true
name = "pypi"

[[source]]
url = "http://pypi.home.kennethreitz.org/simple"
verify_ssl = false
name = "home"

[dev-packages]

[packages]
requests = {version="*", index="home"}
maya = {version="*", index="pypi"}
records = "*"
```

### 激活和退出当前虚拟环境

    pipenv shell
    exit

### 图形显示包依赖关系

    pipenv graph
    requests==2.19.1
      - certifi [required: >=2017.4.17, installed: 2018.8.13]
      - chardet [required: >=3.0.2,<3.1.0, installed: 3.0.4]
      - idna [required: >=2.5,<2.8, installed: 2.7]
      - urllib3 [required: >=1.21.1,<1.24, installed: 1.23]

### 删除所有的安装包

    pipenv uninstall --all


### 检查代码

pipenv 默认集成了 flake8

    pipenv check --style hello.py

## 区别
关于 pipenv 和 pyenv 等等其他的区别，可以看[这个回答](https://stackoverflow.com/a/41573588/1820217) ，如果想要在 IntelliJ 中使用 pipenv ，2018.2 更新的版本中，也已经[支持](https://www.jetbrains.com/help/idea/pipenv.html) 了。

pipenv 也使用 [pyenv](https://pipenv.readthedocs.io/en/latest/advanced/#automatic-python-installation) 来做 Python 的版本管理，所以基本上，分工明确了，pyenv 用来区分 Python 版本，pipenv 用来管理包依赖。

## reference

- <https://pipenv.readthedocs.io/en/latest/advanced/>
