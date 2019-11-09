---
layout: post
title: "pip 镜像"
tagline: ""
description: ""
category: 经验总结
tags: [pip, python, mirror, ]
last_updated:
---

pip 换用国内的镜像

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

