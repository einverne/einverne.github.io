---
layout: post
title: "Flask 使用模板渲染"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, flask, template, jinja2]
last_updated: 
---

Flask 使用 [Jinja2](http://jinja.pocoo.org/) 模板引擎。


Flask 会在 templates 文件夹里寻找模板。所以，如果你的应用是个模块，这个文件夹应该与模块同级；如果它是一个包，那么这个文件夹作为包的子目录:

情况 1: 模块:

    /application.py
    /templates
        /hello.html

情况 2: 包:

    /application
        /__init__.py
        /templates
            /hello.html

使用 Jinja2 只需要使用 `render_template()` 方法

    from flask import render_template

    @app.route('/hello/')
    @app.route('/hello/<name>')
    def hello(name=None):
        return render_template('hello.html', name=name)

## 模板支持继承

继承模式具体可参考: <http://docs.jinkan.org/docs/flask/patterns/templateinheritance.html#template-inheritance>

## reference

- <http://docs.jinkan.org/docs/jinja2/>
