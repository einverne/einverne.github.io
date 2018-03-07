---
layout: post
title: "Flask restful"
tagline: ""
description: ""
category: 
tags: [linux, flask, json, restful, web, python]
last_updated: 
---


## 使用 JSON 作为交换格式

处理 JSON 时，请求和响应头的 `Content-Type` 设置为 `application/json` 。


	from flask import Flask, request, Response
	import json
	app = Flask(__name__)

	@app.route('/json', methods=['POST'])
	def my_json():
		print request.headers
		print request.json
		rt = {'info':'hello '+request.json['name']}
		# add custom headers
		response.headers.add('Server', 'python flask')
		return Response(json.dumps(rt),  mimetype='application/json')

	if __name__ == '__main__':
		app.run(debug=True)

模拟客户端请求

	import requests, json

	user_info = {'name': 'einverne'}
	headers = {'content-type': 'application/json'}
	r = requests.post("http://127.0.0.1:5000/json", data=json.dumps(user_info), headers=headers)
	print r.headers
	print r.json()


模拟 RESTful 接口


	from flask import Flask
	app = Flask(__name__)

	@app.route('/')
	def hello_world():
		return 'hello world'

	@app.route('/user/<username>')
	def user(username):
		print username
		print type(username)
		return 'hello world'

	@app.route('/user/<username>/friends')
	def user_friends(username):
		print username
		print type(username)
		return 'hello world'

	if __name__ == '__main__':
		app.run(debug=True)

使用内置类型装换

	@app.route('/page/<int:num>')
	def page(num):
		print num
		print type(num)
		return 'hello world'

自动将 num 转换成 int 类型，目前 Flask 支持的转换有：

类别 | 解释
-----|------
string | 任何不带 slash(/) 的字符串
int    | 整数
float  | float
path   | 接受 slash(/) 
any    | 所有
uuid | uuid string


复杂的用法，比如定义一个范围

	@app.route('/page/<int:num1>-<int:num2>')
	def page(num1, num2):
		print num1
		print num2
		return 'hello world'

自定义转换器

自定义的转换器是一个继承 `werkzeug.routing.BaseConverter` 的类，修改 `to_python` 和 `to_url` 方法即可。`to_python` 方法用于将url中的变量转换后供被 `@app.route` 包装的函数使用，`to_url` 方法用于 `flask.url_for` 中的参数转换。

下面是一个示例，将 `HelloWorld/index.py` 修改如下：

	from flask import Flask, url_for
	from werkzeug.routing import BaseConverter

	class MyIntConverter(BaseConverter):
		def __init__(self, url_map):
			super(MyIntConverter, self).__init__(url_map)

		def to_python(self, value):
			return int(value)

		def to_url(self, value):
			return 'hi'
	app = Flask(__name__)
	app.url_map.converters['my_int'] = MyIntConverter


	@app.route('/page/<my_int:num>')
	def page(num):
		print num
		print url_for('page', num='123')
		return 'hello world'

	if __name__ == '__main__':
		app.run(debug=True)


浏览器访问 <http://127.0.0.1:5000/page/123> 后，HelloWorld/index.py 的输出信息是：

	123 
	/page/hi


## url for

上面例子只能提到的 `url_for` 方法用于构建URL，他的使用方法如下


	from flask import Flask, url_for
	app = Flask(__name__)

	@app.route('/')
	def hello_world():
		pass

	@app.route('/user/<name>')
	def user(name):
		pass

	@app.route('/page/<int:num>')
	def page(num):
		pass

	@app.route('/test')
	def test():
		print url_for('hello_world')
		print url_for('user', name='einverne')
		print url_for('page', num=1, q='hadoop mapreduce 10%3')
		print url_for('static', filename='uploads/01.jpg')
		return ''

	if __name__ == '__main__':
		app.run(debug=True)

输出

	/
	/user/einverne
	/page/1?q=hadoop+mapreduce+10%253
	/static//uploads/01.jpg

url for 后接方法名


