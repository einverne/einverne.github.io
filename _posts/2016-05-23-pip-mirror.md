---
layout: post
title: "Pypi 国内镜像记录"
tagline: ""
description: ""
category: 经验总结
tags: [pip, python, mirror, ]
last_updated:
---

官方 PyPI 源的 URL 为 https://pypi.org/simple

pip 临时换用国内的镜像

	pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package

或者设为默认：

	pip install pip -U
	pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

或者修改配置文件：

	vi ~/.config/pip/pip.conf

设为：

	[global]
	timeout = 60
	index-url = https://pypi.tuna.tsinghua.edu.cn/simple


## 常用的国内 PyPI 镜像列表

- 豆瓣 https://pypi.doubanio.com/simple/
- 网易 https://mirrors.163.com/pypi/simple/
- 阿里云 https://mirrors.aliyun.com/pypi/simple/
- 清华大学 https://pypi.tuna.tsinghua.edu.cn/simple/
