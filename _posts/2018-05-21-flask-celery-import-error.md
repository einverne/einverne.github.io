---
layout: post
title: "Flask 使用 Celery 避免循环引用"
tagline: ""
description: ""
category: 学习笔记
tags: [flask, celery, python, import, ]
last_updated:
---

在 Flask 中使用 Celery 官方给出了一个非常详细的[教程](http://flask.pocoo.org/docs/1.0/patterns/celery/)，可是这个教程中有一点没有讲清楚，就是关于引入了 Celery 之后如何在项目中划分模块以及模块之间的相互调用，我们知道 Flask 用于构建比较大的项目时可能会使用到 [blueprints](http://flask.pocoo.org/docs/1.0/blueprints/)，而这个时候项目结构可能就比较复杂了。

而引入 Celery 直接面临的问题是如何初始化 Celery 实例，在创建 Flask app 的同时创建 Celery 实例，这时候就面临一个问题，通常我们都在 Views 中引用 celery 异步任务，不可避免的会导致，需要在 views 中 import celery 相关的 module，而 celery 相关的 module 会引入 Flask app 相关的内容，而 Flask app 初始化会引入 views 相关的内容，就变成了循环调用。

有一个比较简单的解法就是初始化两个 Flask App 实例，一个用来启动，一个用来给 Celery 创造上下文。

不要在 create_app() 中再创建 Celery 实例。比如新建 `celery_worker.py` 来初始化 celery 实例，而在另外的文件中初始化 `Flask()` 实例。

## reference

- <https://github.com/thrisp/flask-celery-example/blob/master/app.py>
- <https://github.com/miguelgrinberg/flask-celery-example/blob/master/app.py>
- <https://github.com/paicha/gxgk-wechat-server/blob/master/main/plugins/queue.py>
