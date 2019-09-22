---
layout: post
title: "ModuleNotFoundError: No module named 'marshmallow.compat'"
tagline: ""
description: ""
category: 经验总结
tags: [flask, marshmallow, flask-marshmallow, ]
last_updated:
---

今天重新部署一个服务时发现了一个奇怪的错误，之前用很久都没有错，重新部署一个新环境就发生了这样的问题，问题应该就出现在新依赖的包中。

	  File "/usr/local/lib/python3.6/dist-packages/flask_marshmallow/fields.py", line 15, in <module>
		from marshmallow.compat import iteritems
	ModuleNotFoundError: No module named 'marshmallow.compat'

所以搜了一圈在原来的老环境中发现依赖的 marshmallow 是 2.15.4 重新安装这个版本之后解决了这个问题。那就可能是 marshmallow 这个包升级到 3.2.0 之后的问题了。

解决办法：

	pip install marshmallow==2.15.4

后来查看 marshmallow 的升级说明，和一些 issue 发现 marshmallow 这个包 2.x 和 3.x 没有完全兼容，看来又要改代码了。
