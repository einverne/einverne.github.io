---
layout: post
title: "Celery 使用介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [celery, python, queue, task, distribution]
last_updated:
---

Celery 简单来说就是一个分布式[[消息队列]]。简单、灵活且可靠，能够处理大量消息，它是一个专注于实时处理的任务队列，同时也支持异步任务调度。Celery 不仅可以单机运行，也能够同时在多台机器上运行，甚至可以跨数据中心。

Celery 中比较关键的概念：

- worker: worker 是一个独立的进程，任务执行单元，它持续监视队列中是否有需要处理的任务；
- broker: broker 消息传输中间件，任务调度队列，接收生产者发出的消息，将任务存入队列，broker 负责协调客户端和 worker 的沟通。客户端向队列添加消息，broker 负责把消息派发给 worker。
- 任务模块：包含异步任务和定时任务，异步任务通常在业务逻辑中被触发并发往任务队列，定时任务由 celery beat 进程周期性发送
- 任务结果 backend：backend 存储任务执行结果，同消息中间件一样，需要由其他存储系统提供支持

一个典型的 Celery 使用场景就是，当用户在网站注册时，请求可以立即返回而不用等待发送注册激活邮件之后返回，网站可以将发送邮件这样的耗时不影响主要流程的操作放到消息队列中，Celery 就提供了这样的便捷。

## 安装 Celery

直接使用 python 工具 pip 或者 easy_install 来安装：

    $ pip install celery

## 安装 Broker

Celery 支持多种 broker, 但主要以 RabbitMQ 和 Redis 为主，其他都是试验性的，虽然也可以使用， 但是没有专门的维护者。如何在 RabbitMQ 和 Redis 之间选择呢？

> RabbitMQ is feature-complete, stable, durable and easy to install. It’s an excellent choice for a production environment.

> Redis is also feature-complete, but is more susceptible to data loss in the event of abrupt termination or power failures.

Celery 官方明确表示推荐在生产环境下使用 RabbitMQ，Redis 存在丢数据的问题。所以如果你的业务可以容忍 worker crash 或者电源故障导致的任务丢失，采用 redis 是个不错的选择，本篇就以 redis 为例来介绍。

Celery 对于 redis 的支持需要安装相关的依赖，以下命令可以同时安装 celery 和 redis 相关的依赖，但是 redis server 还是必须单独安装的。

    $ pip install -U celery[redis]  # -U 的意思是把所有指定的包都升级到最新的版本

## Celery 的配置和使用

Celery 本身的配置项是很多的，但是如果要让它跑起来，你只需要加一行配置：

    BROKER_URL = 'redis://localhost:6379/0'

这一行就是告诉 celery broker 的地址和选择的 redis db，默认是 0。接下来用个很简单的例子来介绍 celery 是如何使用的：

    # task.py
    from celery import Celery

    broker = 'redis://127.0.0.1:6379/0'

    app = Celery('tasks', broker=broker)

    @app.task()
    def add(x, y):
       return x + y

上述代码创建了一个 celery 的实例 app，可以通过它来创建任务和管理 workers。在上面的例子中，我们创建了一个简单的任务 task，它返回了两个数相加后的结果。然后启动 celery 服务，通过它来监听是否有任务要处理。

    $ celery worker -A task -l info

- `-A` 选项指定 celery 实例 app 的位置，本例中 `task.py` 中自动寻找，当然可以直接指定 `celery worker -A task.app -l info`
- `-l` 选项指定日志级别， `-l` 是 `--loglevel` 的缩略形式

其他更多选项通过 `celery worker –-help` 查看

### 调用任务或者发送消息
然后我们再打开一个 shell 窗口，进入 python 控制台去调用 add 任务：

    >>> from task import add
    >>> add.delay(1, 2)
    <AsyncResult: 42ade14e-c7ed-4b8d-894c-1ca1ec7ca192>

`delay()` 是 `apply_async` 的简写，用于一个任务消息（task message）。我们发现 add 任务并没有返回结果 3，而是一个对象 AsyncResult，它的作用是被用来检查任务状态，等待任务执行完毕或获取任务结果，如果任务失败，它会返回异常信息或者调用栈。

我们先尝试获取任务的执行结果：

    >>> result = add.delay(1, 2)
    >>> result.get()
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
      File "/usr/local/lib/python2.7/dist-packages/celery/result.py", line 169, in get
        no_ack=no_ack,
      File "/usr/local/lib/python2.7/dist-packages/celery/backends/base.py", line 604, in _is_disabled
        'No result backend configured.  '
    NotImplementedError: No result backend configured.  Please see the documentation for more information.

报错了：No result backend configured. 错误信息告诉我们没有配置 result backend。因为 celery 会将任务的 状态或结果保存在 result backend，result backend 的选择也有很多，本例中依然选用 redis 作为 result backend。

我们修改 task.py 的代码，添加上 result backend 的设置，保存后重启 celery worker。

    # task.py
    ...
    app = Celery('tasks', backend='redis://localhost', broker='redis://localhost//')
    ...

然后重新调用 add task:

    >>> from task import add
    >>> result = add.delay(1,2)
    >>> result.get()
    3

## Celery Flower

flower 是一个 celery 的监控工具，它提供了一个图形用户界面，可以极大的方便我们监控任务的执行过程， 执行细节及历史记录，还提供了统计功能。

flower 安装

    pip install flower

or:

    easy_install flower

flower 使用简介，首先启动通过命令行启动 flower 进程：

    flower -A proj --port=5555

然后打开浏览器 <http://localhost:5555/>

celery flower

## Celery 任务类型

### apply_async

调用一个异步任务，这也是最常用的任务类型之一，delay 与它的作用相同，只是 delay 不支持 `apply_async` 中额外的参数。该方法有几个比较重要的参数，在实际应用中会经常用到：

countdown： 任务延迟执行的秒数，默认立即执行；
eta：任务被执行的绝对时间

### crontab 计划任务
Celery 同样也支持定时任务：

    from datetime import timedelta
    from celery.schedules import crontab

    app.conf.beat_schedule = {
        # Executes every Monday morning at 7:30 A.M
        'add-every-monday-morning': {
            'task': 'tasks.add',
            'schedule': crontab(hour=7, minute=30, day_of_week=1),
            'args': (20, 20),
        },
        # execute every ten minutes
       'every_ten_minutes': {
            'task': 'worker.cntv.cntv_test',
            'schedule': timedelta(minutes=10),
            'args': ('args1',),
            'options': {
                'queue': 'queue_name'
            }
        },
    }

要启动定时任务，需要启动一个心跳进程，假设

    celery beat -A celery_app.celery_config -s /path/to/celerybeat-schedule -l info

其中 `-s` 参数指定 celerybeat 文件保存的位置。beat 主要的功能就是将 task 下发到 broker 中，让 worker 去消费。

## 取消队列中任务
取消队列中任务，可以使用命令行，也可以导入 celery app 然后使用 `control()`

    celery -A proj -Q queue_name purge      # 取消队列 queue_name 中的任务
    # or
    from proj.celery import app
    app.control.purge()

From：[stackoverflow](https://stackoverflow.com/a/7155348/1820217)

## celery 在 supervisor 中 root 不能启动问题
Celery 不能用 root 用户启动，所以在 supervisor 中启动时会报错：

    If you really want to continue then you have to set the C_FORCE_ROOT
    environment variable (but please think about this before you do).

    User information: uid=0 euid=0 gid=0 egid=0

解决办法

    from celery import Celery, platforms
    platforms.C_FORCE_ROOT = True

或者 supervisor 配置中

    environment=C_FORCE_ROOT="true"


## reference

- <http://liuzxc.github.io/blog/celery/>
- <http://wiki.jikexueyuan.com/project/explore-python/Third-Party-Modules/celery.html>
