---
layout: post
title: "flower 简单使用"
tagline: ""
description: ""
category: 学习笔记
tags: [flower, monitor, linux, celery, django]
last_updated: 
---

Flower 是一个基于 Web 的监控和管理工具，可以用在 Celery 集群的监控和管理。和 Celery 配合使用非常不错。

Flower 可以查看 Celery 队列中 task 的数量，可以用来监控 worker 的状态并进行简单的管理，比如调整 worker 的 pool size 和 autoscale 设置，可以用来查看当前处理的 tasks， 等等。

## 安装
使用 pip 安装 Flower 

    pip install flower

或者安装开发版

    pip install https://github.com/mher/flower/zipball/master


## 使用 #{Usage}
直接使用下面命令开启本地监听 http://localhost:5555

    flower -A proj --port=5555

或者从 Celery 中开启

    celery flower -A proj --address=127.0.0.1 --port=5555

如果要暴露给外网访问可以 `--address=0.0.0.0`:

    celery flower -A worker --address=0.0.0.0 --port=5555 --basic_auth=name:password

使用 `--basic_auth` 来开启 HTTP 简单验证

## reference

- <https://github.com/mher/flower>
