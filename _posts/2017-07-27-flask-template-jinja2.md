---
layout: post
title: "flask template jinja2"
tagline: ""
description: ""
category: 
tags: []
last_updated: 
---



将template 模板放到 `app/templates/index.html` 


	<html>
	  <head>
		<title>{{ title }} - microblog</title>
	  </head>
	  <body>
		  <h1>Hello, {{ user.nickname }}!</h1>
	  </body>
	</html>

在 `views.py` 中：

	from flask import render_template
	from app import app

	@app.route('/')
	@app.route('/index')
	def index():
		user = {'nickname': 'Miguel'}  # fake user
		return render_template('index.html',
							   title='Home',
							   user=user)

Jinja2 使用 `{{ ... }}` 来引用由函数 `render_template` 传入的参数。

## 控制语句

### 条件

Jinja2 使用 `{% ... %}` 作为控制语句，比如：

	<html>
	  <head>
		{% if title %}
		<title>{{ title }} - microblog</title>
		{% else %}
		<title>Welcome to microblog</title>
		{% endif %}
	  </head>
	  <body>
		  <h1>Hello, {{ user.nickname }}!</h1>
	  </body>
	</html>

控制语句，如果有 title 就显示 title，否则就显示其他内容。


### 循环 Loop

假设有这个数据结构：

    user = {'nickname': 'Miguel'}  # fake user
    posts = [  # fake array of posts
        { 
            'author': {'nickname': 'John'}, 
            'body': 'Beautiful day in Portland!' 
        },
        { 
            'author': {'nickname': 'Susan'}, 
            'body': 'The Avengers movie was so cool!' 
        }
    ]

在模板中可以：

	<html>
	  <head>
		{% if title %}
		<title>{{ title }} - microblog</title>
		{% else %}
		<title>Welcome to microblog</title>
		{% endif %}
	  </head>
	  <body>
		<h1>Hi, {{ user.nickname }}!</h1>
		{% for post in posts %}
		<div><p>{{ post.author.nickname }} says: <b>{{ post.body }}</b></p></div>
		{% endfor %}
	  </body>
	</html>

## 继承

模板可以和类一样通过继承来复用，主要用到了 `{% block }` 这样的语法。

假设有 `base.html` 模板

	<html>
	  <head>
		{% if title %}
		<title>{{ title }} - microblog</title>
		{% else %}
		<title>Welcome to microblog</title>
		{% endif %}
	  </head>
	  <body>
		<div>Microblog: <a href="/index">Home</a></div>
		<hr>
		{% block content %}{% endblock %}
	  </body>
	</html>

其中的 block content 就留着给继承的模板实现，新建 `index.html` 

	{% extends "base.html" %}
	{% block content %}
		<h1>Hi, {{ user.nickname }}!</h1>
		{% for post in posts %}
		<div><p>{{ post.author.nickname }} says: <b>{{ post.body }}</b></p></div>
		{% endfor %}
	{% endblock %}

使用 extends 关键字来继承 base.html ，然后实现 block content 内容


