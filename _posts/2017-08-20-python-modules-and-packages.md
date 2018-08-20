---
layout: post
title: "Python modules and package"
tagline: ""
description: ""
category: 学习笔记
tags: [python, modules, import, pythonpath, library, ]
last_updated:
---

Python 很重要的一个概念 module，用来组织代码结构。


## import 导入搜索的路径

- 代码的 home 路径
- PYTHONPATH 目录（如果存在的话）
- 标准库路径
- .pth 文件中配置的路径（如果存在的话）

最终，这些路径都会存在 `sys.path` 中，是一个保存着一系列搜索路径的 list。

    >>> import sys
    >>> sys.path

## 导入工作流程

- 在路径中找到导入的模块
- 编译
- 运行

## Package
一个目录的 Python code 被称为 package，这样的导入被成为 package import。

    import dir1.dir2.mod
    from dir1.dir2.mod import x

文件目录结构可能是

    dir0\dir1\dir2\mod.py

每一个 package 被定义时都会产生一个 `__init__.py` 的文件，该文件可以像普通文件一样包含 Python 代码，也可以为空。

Package 初始化

    当 Python 导入 Package 时，会自动跑 `__init__.py` 下的内容，所以 `__init__.py` 文件下是天然的存放初始化内容的地方，比如初始化数据库连接等等。

如果定义了 `__all__` ，在 `from *` 时导入，就会选择性导入指定内容

    __all__ = ["Error", "encode", "decode"]


