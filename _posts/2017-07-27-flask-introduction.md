---
layout: post
title: "Flask 使用介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [python, web, flask, django]
last_updated:
---

Flask 是一个轻量级的基于 python 的 web 框架。

## 安装运行

一般情况下，只要通过 pip 安装 Flask 即可：

	pip install Flask

进入 python shell

	>>> import flask
	>>> print flask.__doc__
		flask
		~~~~~
		A microframework based on Werkzeug.  It's extensively documented
		and follows best practice patterns.
		:copyright: (c) 2015 by Armin Ronacher.
		:license: BSD, see LICENSE for more details.
	>>> print flask.__version__
	0.12.2

创建 `index.py` 文件，在文件中放入以下内容：

	from flask import Flask

	app = Flask(__name__)

	@app.route('/')
	def hello_world():
		return 'Hello World!'

	if __name__ == '__main__':
		app.run()

运行 `python index.py`

	python index.py
	 * Running on http://127.0.0.1:5000/

变量 app 是一个 Flask 实例，当客户端访问根目录 `/` 时，将响应 `hello_world()` 函数返回的内容。这不是返回 Hello World! 这么简单，Hello World! 只是 HTTP 响应报文的实体部分，状态码等信息既可以由 Flask 自动处理，也可以通过编程来制定。

## Tips

### 更改静态资源地址

在创建 Flask 时使用额外的参数，具体可参考 `__doc__`

### 显示调试信息

添加 run 函数参数：

	app.run(debug=True)

### 绑定网络接口和端口

默认情况下，Flask 使用 `127.0.0.1` ，端口为 `5000`，通过如下方式更改：

	app.run(host='0.0.0.0', port=80, debug=True)

绑定 80 端口需要 root 权限运行 `index.py`。

### 获取请求参数

	from flask import Flask, request
	app = Flask(__name__)

	@app.route('/')
	def hello_world():
		params = request.args.items()
		return params.__str__()

	if __name__ == '__main__':
		app.run()

另外可以通过 `request.full_path` 和 `request.path` 来获取客户端请求 url

### 获取 POST 请求参数

	from flask import Flask, request

	app = Flask(__name__)

	@app.route('/')
	def hello_world():
		return 'hello world'

	@app.route('/register', methods=['POST'])
	def register():
		print request.headers
		print request.form
		print request.form['name']
		print request.form.get('name')
		print request.form.getlist('name')
		print request.form.get('nickname', default='little apple')
		return 'welcome'

	if __name__ == '__main__':
		app.run(debug=True)

使用 `requests` 模拟客户端请求：

	import requests
	user_info = {'name': 'einverne', 'password': '123'}
	r = requests.post("http://127.0.0.1:5000/register", data=user_info)
	print r.text

## 唯一 URL
构造访问 URL 时可能会遇到如下两种情况：

    @app.route('/projects/')
    def projects():
        return 'The project page'

    @app.route('/about')
    def about():
        return 'The about page'

解释：

- 第一种类似文件系统中访问文件夹，访问一个结尾不带斜线的 URL 会被 Flask 重定向到带斜线的规范 URL 去
- 第二种类似 Unix-like 系统中的路径名，访问结尾带斜线的 URL 会产生一个 404 “Not Found” 错误。

## RESTful

Flask 下有 Flask-Restless 结合 SQLAlchemy 轻松实现 RESTful 。

## reference

- <https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world>
- <http://docs.jinkan.org/docs/flask/quickstart.html>




