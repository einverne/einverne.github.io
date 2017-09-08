---
layout: post
title: "flask introduction"
tagline: ""
description: ""
category: 学习笔记
tags: [Python, Web, Flask]
last_updated: 
---


Flask是一个轻量级的基于python的web框架。

## 安装运行
一般情况下，只要通过pip安装Flask即可：

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

变量app是一个Flask实例，当客户端访问/时，将响应hello_world()函数返回的内容。这不是返回Hello World!这么简单，Hello World! 只是HTTP响应报文的实体部分，状态码等信息既可以由Flask自动处理，也可以通过编程来制定。


## Tips
### 更改静态资源地址


在创建 Flask 时使用额外的参数，具体可参考 `__doc__`


### 显示调试信息
添加 run 函数参数：

	app.run(debug=True)

### 绑定网络接口和端口

默认情况下，Flask 使用 `127.0.0.1` ，端口为 `5000`，通过如下方式更改：

	app.run(host='0.0.0.0', port=80, debug=True)

绑定80端口需要 root 权限运行 `index.py`。

### 获取请求参数

	from flask import Flask, request
	app = Flask(__name__)

	@app.route('/')
	def hello_world():
		params = request.args.items()
		return params.__str__()

	if __name__ == '__main__':
		app.run()

另外可以通过 `request.full_path` 和 `request.path` 来获取客户端请求url

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





## reference

- <https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world>




