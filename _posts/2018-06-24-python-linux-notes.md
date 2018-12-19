---
layout: post
title: "Python Linux 系统管理与自动化运维读书笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [python, linux, notes, deploy, ]
last_updated:
---



## 小工具

### HTTP Server

    python -m SimpleHTTPServer

    python -m http.server

### JSON 格式化

    echo '<json string>' | python -m json.tool

### 验证第三方库安装

    python -c "import paramiko"

### pip 用法

源码安装

    python setup.py install

pip 子命令

子命令      | 说明
------------|-------------
search  | 搜索 `pip search flask`
install | 安装 `pip install flask==0.8` , `pip install -r requirements.txt`
uninstall | 卸载
show    | 查看包详情
check   | pip 9.0.1 之后提供，检查包是否完整
list    | 列出已安装
freeze  | 导出已安装包列表 `pip freeze > requirements.txt`
completion  | 生成命令补全配置 `pip completion -z >> ~/.zshrc && source ~/.zshrc`


### 加速 pip 安装
下载时指定

    pip install -i https://pypi.douban.com/simple/ flask

或者创建 `~/.pip/pip.conf` ，写入

    [global]
    index-url = https://pypi.douban.com/simple/


