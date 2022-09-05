---
layout: post
title: "gunicorn 使用"
aliases: "gunicorn 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [python, gunicorn, wsgi, http, unix, web, server, ]
last_updated:
---

之前的文章[使用 gunicorn 来部署 webpy](/post/2016/05/gunicorn-deploy-webpy.html) 中简单的提到了 gunicorn 的使用。这篇文章就在官方文档的基础上学习下 gunicorn 的其他更多的用法。

基本的安装和参数就跳过了，这边讲下文档中很有用却不是常用的一些选项，如果要看基础使用可以去看之前的[文章](/post/2016/05/gunicorn-deploy-webpy.html)

## 配置文件
我们知道 gunicorn 能够直接使用命令行来启动，常见的参数

    gunicorn -w 2 -b 0.0.0.0:5000 app:app --log-level info --access-logfile logfile.log --log-file error.log

当这样一路写下去就知道命令行非常难管理，所以 gunicorn 能够使用 config 文件来管理

    gunicorn -c config.py app:app

这样就简单很多了。至于 config.py 文件格式如何，保证是一个 python 格式的文件，语法没有太大问题即可

    import multiprocessing

    bind = "127.0.0.1:8000"
    workers = multiprocessing.cpu_count() * 2 + 1
    backlog = 2048                           # int 范围在 64-2048 pending 的链接最大数
    worker_class = 'gevent'
    debug = True
    pidfile = '/tmp/home.pid'
    loglevel = 'info'
    logfile = '/var/log/gunicorn/gun_debug.log'

其他的全部配置可以在 [setting](http://docs.gunicorn.org/en/latest/settings.html#settings) 中找到。

## 设计模式
gunicorn 的[设计](http://docs.gunicorn.org/en/latest/design.html)，官方这篇说明清楚的解释了 同步 worker 和 异步 worker 的区别，如果你的应用程序接口有大量的 IO 操作推荐使用 异步 worker。

## 重新加载配置
首先要知道 master worker 的 pid 发送 `-HUP` 信号

    kill -HUP masterpid

如何测试性能，可以使用 [hey](https://github.com/rakyll/hey)，下面的命令发送了 10000 个请求，其中 100 是并发量。

    hey -n 10000 -c 100 http://127.0.0.1:5000/


## reference

- <http://docs.gunicorn.org/en/latest/index.html>
