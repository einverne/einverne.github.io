---
layout: post
title: "flask admin"
tagline: ""
description: ""
category: 学习笔记
tags: [Flask, Web, Python, Linux, ]
last_updated: 
---

Flask Admin 是 Flask 的一个管理插件，类似于 Django Admin 一样的存在，可以很方便的帮助开发者实现管理界面，并且能够提供一套和数据库对应的界面。

- 官网地址：<https://flask-admin.readthedocs.io/en/latest/>
- 源代码： <https://github.com/flask-admin/flask-admin>

Flask-Admin提供一个现成的SQLAlchemy模型接口。它以类执行并接受2个参数：模型类和数据库会话。

初始化 Flask Admin

	from flask import Flask
	from flask.ext.admin import Admin

	app = Flask(__name__)

	admin = Admin(app)
# Add administrative views here

	app.run()

运行这个程序并访问 <http://localhost:5000/admin/> ，可以看到基础模板。

增加一个管理视图

	from flask import Flask
	from flask.ext.admin import Admin, BaseView, expose

	class MyView(BaseView):
		@expose('/')
		def index(self):
			return self.render('index.html')

	app = Flask(__name__)

	admin = Admin(app)
	admin.add_view(MyView(name='Hello'))

	app.run()


## 模型视图

模型视图允许你为数据库中的每个模型增加专用的管理页面。可以自动为数据库中每一张表生成一个管理页面。

	from flask.ext.admin.contrib.sqla import ModelView

# Flask and Flask-SQLAlchemy initialization here

	admin = Admin(app)
	admin.add_view(ModelView(User, db.session))

构造自己的 ModelView，要定制这些模型视图，有两个选择：一是覆盖 ModelView 类的公有属性，二是覆盖它的方法。 

	from flask.ext.admin.contrib.sqla import ModelView

	# Flask and Flask-SQLAlchemy initialization here

	class MyView(ModelView):
		# Disable model creation
		can_create = False

		# Override displayed fields
		column_list = ('login', 'email')

		def __init__(self, session, **kwargs):
			# You can pass name and other parameters if you want to
			super(MyView, self).__init__(User, session, **kwargs)

	admin = Admin(app)
	admin.add_view(MyView(db.session))

## 文件管理


	from flask.ext.admin.contrib.fileadmin import FileAdmin

	import os.path as op

	# Flask setup here

	admin = Admin(app)

	path = op.join(op.dirname(__file__), 'static')
	admin.add_view(FileAdmin(path, '/static/', name='Static Files'))



