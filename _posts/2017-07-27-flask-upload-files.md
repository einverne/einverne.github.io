---
layout: post
title: "flask upload files"
tagline: ""
description: ""
category: 
tags: [Flask, Web, Python, Linux,]
last_updated: 
---


上传的文件存放在 `static/uploads` 目录中。

werkzeug 库可以判断文件名是否安全，例如防止文件名是 `/../test.png`， 安装

	pip install werkzeug

具体代码：

	from flask import Flask, request
	from werkzeug.utils import secure_filename
	import os
	app = Flask(__name__)
	app.config['UPLOAD_FOLDER'] = 'static/uploads/'
	app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'gif'])
# For a given file, return whether it's an allowed type or not
	def allowed_file(filename):
		return '.' in filename and \
			   filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

	@app.route('/')
	def hello_world():
		return 'hello world'

	@app.route('/upload', methods=['POST'])
	def upload():
		upload_file = request.files['file']
		if upload_file and allowed_file(upload_file.filename):
			filename = secure_filename(upload_file.filename)
			upload_file.save(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename))
			return 'hello, '+request.form.get('name', 'little apple')+'. success'
		else:
			return 'hello, '+request.form.get('name', 'little apple')+'. failed'

	if __name__ == '__main__':
		app.run(debug=True)

app.config中的config是字典的子类，可以用来设置自有的配置信息，也可以设置自己的配置信息。函数 `allowed_file(filename)` 用来判断filename是否有后缀以及后缀是否在app.config['ALLOWED_EXTENSIONS']中。


模拟上传文件

	import requests
	files = {'file': open('01.jpg', 'rb')}
	user_info = {'name': 'letian'}
	r = requests.post("http://127.0.0.1:5000/upload", data=user_info, files=files)
	print r.text


要控制上产文件的大小，可以设置请求实体的大小，例如：

	app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 #16MB

不过，在处理上传文件时候，需要使用try:...except:...。

如果要获取上传文件的内容可以：

	file_content = request.files['image01'].stream.read()


## 使用template
在 template 目录下新建 `upload.html` 

	<form action="{{ url_for('.upload_file') }}" method=post enctype=multipart/form-data>
		<div class="form-group">
		  <label for="exampleInputFile">上传文件</label>
		  <input type="file" name="file">
		  <p class="help-block">上传数据</p>
		  <button type="submit" class="btn btn-default">Submit</button>
		</div>
	</form>

在 views.py 中写 `upload_file` 方法处理上传逻辑

	@crawler_control.route('/upload', methods=['POST'])
	def upload_file():
		if request.method == 'POST':
			f = request.files['file']
			if f and '.' in f.filename and f.filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']:
				filename = secure_filename(f.filename)
				path = op.join('/tmp', filename)
				f.save(path)
			return "Success"
		return render_template_string("only support POST")














