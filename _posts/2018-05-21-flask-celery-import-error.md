---
layout: post
title: "Flask 使用 Celery 避免循环引用"
aliases: "Flask 使用 Celery 避免循环引用"
tagline: ""
description: ""
category: 学习笔记
tags: [flask, celery, python, import, ]
last_updated:
---

在 Flask 中使用 Celery 官方给出了一个非常详细的[教程](http://flask.pocoo.org/docs/1.0/patterns/celery/)，可是这个教程中有一点没有讲清楚，就是关于引入了 Celery 之后如何在项目中划分模块以及模块之间的相互调用，我们知道 Flask 用于构建比较大的项目时可能会使用到 [blueprints](http://flask.pocoo.org/docs/1.0/blueprints/)，而这个时候项目结构可能就比较复杂了。

而引入 Celery 直接面临的问题是如何初始化 Celery 实例，在创建 Flask app 的同时创建 Celery 实例，这时候就面临一个问题，通常我们都在 Views 中引用 celery 异步任务，不可避免的会导致，需要在 views 中 import celery 相关的 module，而 celery 相关的 module 会引入 Flask app 相关的内容，而 Flask app 初始化会引入 views 相关的内容，就变成了循环调用。

有一个比较简单的解法就是初始化两个 Flask App 实例，一个用来启动，一个用来给 Celery 创造上下文。

不要在 `create_app()` 中再创建 Celery 实例。比如新建 `celery_worker.py` 来初始化 celery 实例，而在另外的文件中初始化 `Flask()` 实例。

项目结构大致如下：

    ├── README.md
    ├── app
    │   ├── __init__.py
    │   ├── config.py
    │   ├── forms
    │   ├── models
    │   ├── tasks
    │   │   ├── __init__.py
    │   │   └── email.py
    │   └── views
    │   │   ├── __init__.py
    │   │   └── account.py
    ├── celery_worker.py
    ├── manage.py
    └── wsgi.py

图中

- manage.py 用来初始化 Flask instance
- celery_worker.py 用来初始化 Celery 并且作为 Celery worker 的入口

在 `app/__init__.py`

```
    from celery import Celery
    from flask import Flask

    from app.config import BaseConfig

    celery = Celery(__name__, broker=BaseConfig.CELERY_BROKER_URL)


    def create_app():
        app = Flask(__name__)
        # ....
        celery.conf.update(app.config)	# 更新 celery 的配置
        # ...
        return app
```

在 `celery_worker.py`

```
from app import create_app, celery

app = create_app()
app.app_context().push()
```

这个文件有两个操作，一个为初始化 Flask 实例，也就初始化了 Celery 实例，然后第二个操作是使用 Flask 的 application context，celery 的所有操作都会在这个环境中执行。

然后就可以启动 Celery `celery worker -A celery_worker.celery -l INFO`

## 在 Flask 外部使用 Flask-SQLAlchemy
这里便引出了另外一个问题，如何在 Flask 外部使用 SQLAlchemy 中定义好的 model，当我们定义好和数据库相对应的 Object 之后，难免有些时候需要在 Flask 外部使用，比如清洗一些数据，或者单独跑一些数据时，这时没有 Flask Context 环境，那么这个时候需要借助 `app_context()` 函数：

    from my_package import create_app

    app = create_app(my_envrionment)

    with app.app_context():
        # your code here

在 Context 上下文环境中就能够使用定义好的 model 了。另外一种方法是使用 `@with_appcontext` 装饰器：

    from flask.cli import with_appcontext

    @click.command(name='db-init-data')
    @with_appcontext
    def db_init_data():
        """Init db with some data"""
        admin = User(fname='John', lname='Smith', email='jsmith@google.com')
        db.session.add(admin)
        db.session.commit()

来自 [StackOverflow](https://stackoverflow.com/a/50572705/1820217)

## reference

- <https://blog.miguelgrinberg.com/post/celery-and-the-flask-application-factory-pattern>
- <http://mattupstate.com/blog/how-i-structure-my-flask-applications/>
- <https://github.com/thrisp/flask-celery-example/blob/master/app.py>
- <https://github.com/miguelgrinberg/flask-celery-example/blob/master/app.py>
- <https://github.com/paicha/gxgk-wechat-server/blob/master/main/plugins/queue.py>
