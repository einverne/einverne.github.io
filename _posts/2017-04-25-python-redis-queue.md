---
layout: post
title: "在 Python 中使用 redis 作为任务队列 Python RQ 使用"
aliases: "在 Python 中使用 redis 作为任务队列 Python RQ 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [python, redis, queue, python-rq, flask-rq2, ]
last_updated:
---

在学习 Flask 时接触 flask-rq2，然后知道了 [python-rq](http://python-rq.org/) 因为之前使用过 Celery ，所以对 python-rq 倒也没有多大的困惑。因为 python-rq 只依赖于 redis，相较于 Celery 轻量很多，如果在 Flask 中不需要非常繁重的后台任务队列（比如只有发送注册邮件任务）可以考虑使用 python-rq，毕竟有 flask-rq2 为 Flask 度身定做，结合 Flask 要比 Celery 容易很多。

> RQ (Redis Queue) is a simple Python library for queueing jobs and processing them in the background with workers. It is backed by Redis and it is designed to have a low barrier to entry. It can be integrated in your web stack easily.

官方的介绍也非常清晰，RQ 是一个用于后台任务的简单的 Python library。他使用 Redis 作为后台，他的设计目标就是降低入门门槛。他可以被轻松的整合到 Web 应用中。在项目的历史中，也不避讳的直言该项目受到 Celery，Resque 和 [Flask snippet](http://flask.pocoo.org/snippets/73/) 中设计精美的部分的启发，然后作为一个轻量的任务队列框架而设计。

python-rq 的内容就不多介绍，感兴趣可以去[官网](http://python-rq.org/) 直接了解，非常简单。不过有几点需要注意。作为一个任务队列基本都要完成几个步骤

- 定义耗时任务 `def count_words_at_url(url): pass`
- 启动任务 [worker](http://python-rq.org/docs/workers/) `rq worker`
- 提交任务到队列中 `q = Queue(connection=redis_conn); q.enqueue(count_words_at_url, 'http://nvie.com')`

但其实本文想要介绍的是 [Flask-RQ2](https://github.com/rq/Flask-RQ2)

## Flask RQ2
安装

    pip install Flask-RQ2

快速整合 Flask 参考 [doc](https://flask-rq2.readthedocs.io/en/latest/)

第一步定义任务

    from flask_rq2 import RQ

    rq = RQ()

    @rq.job
    def add(x, y):
        return x + y

第二步启动 worker

    flask rq worker

第三步提交到任务队列

    job = add.queue(1, 2)
    job2 = add.queue(3, 4, queue='high', timeout=60 * 2)

定时任务相关

    @rq.job
    def add(x, y):
        return x + y

    # queue job in 60 seconds
    add.schedule(timedelta(seconds=60), 1, 2)

    # queue job at a certain datetime (UTC!)
    add.schedule(datetime(2016, 12, 31, 23, 59, 59), 1, 2)

    # queue job in 14 days and then repeat once 14 days later
    add.schedule(timedelta(days=14), 1, 2, repeat=1)

    # queue job in 12 hours with a different queue
    add.schedule(timedelta(hours=12), 1, 2, queue='high', timeout=60 * 2)

    # queue job every day at noon (UTC!)
    add.cron('0 0 12 * * ?', 'add-one-two', 1, 2)

    # queue job every minute with a different queue
    add.cron('* * * * *', 'add-one-two', 1, 2, queue='high', timeout=55)

### Bug
不过在使用的过程中启动 `flask rq worker` 时遇到一个 bug

    redis.exceptions.ResponseError: Command # 7 (EXPIRE rq:worker:ev.22880 None) of pipeline caused error: value is not an integer or out of range

类似这样的 [bug](https://github.com/rq/rq/issues/961) 似乎是因为新版本原因造成的，我降级为 rq==0.10.0 就好了。

## python-rq 和 Celery 比较

一句话总结，RQ 的设计目标是简洁，而 Celery 是更加健壮完善。

区别                    | RQ                    | Celery                        | 总结
------------------------|------------------------|------------------------------|-----------------------------
文档 | RQ [doc](http://python-rq.org/) 非常简洁易懂     | [Celery](https://celery.readthedocs.org/en/latest/getting-started/brokers/redis.html) 文档虽然复杂，但是也很清晰，Celery 有非常多的选项 | 都很好
监控    | [RQ Dashboard](https://github.com/nvie/rq-dashboard)        | [Celery Flower](https://github.com/mher/flower)  两者都非常容易部署，能满足 90 % 的需求 | 很好
Broker support | RQ only supports Redis | Celery 能够支持很多 Redis，RabbitMQ 等等，如果要确保任务执行，Celery 可能是更好的选择 | Celery 优势
优先队列    | RQ 的设计简洁高效，worker 可以从[不同的队列中](http://python-rq.org/docs/workers/) 消费 | Celery 需要不同的 worker 从不同的队列中消费 | 都有方法轻松实现
系统支持    | RQ 仅仅支持有 `fork` 操作的系统（Unix）   | Celery 不限       | Celery 获胜
语言支持    | RQ 仅仅支持 Python | Celery 允许从一个语言发送任务到另外的语言 | Celery 更胜一筹
API     | RQ API simple    | Celery API 非常灵活 multiple result backends, nice config format, workflow canvas support，支持很多特性，同样带来的是配置的复杂 | Celery 更胜一筹
子任务支持  | RQ 不支持     | 支持从任务中创建新任务    | Celery 赞
Community and Stability | 活跃 | 活跃 | 两个项目都是活跃开发状态

## reference

- <https://stackoverflow.com/a/29837939/1820217>
