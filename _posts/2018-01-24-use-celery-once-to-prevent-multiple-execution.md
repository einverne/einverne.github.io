---
layout: post
title: "使用 Celery Once 来防止Celery重复执行同一个任务"
tagline: ""
description: ""
category: 学习笔记
tags: [celery, celery-once, redis, broker, queue, task, unique, python]
last_updated: 
---

在[使用](/post/2017/04/celery-introduction.html) Celery 的时候发现有的时候 Celery 会将同一个任务执行两遍，我遇到的情况是相同的任务在不同的worker中被分别执行，并且时间只相差几毫秒。这问题我一直以为是自己哪里处理的逻辑有问题，后来发现[其他人](https://github.com/celery/celery/issues/4400)也有类似的问题，然后基本上出问题的都是使用 Redis 作为 Broker 的，而我这边一方面不想将 Redis 替换掉，就只能在 task 执行的时候加分布式锁了。

不过在 Celery 的 issue 中搜索了一下，有人使用 Redis 实现了[分布式锁](https://github.com/celery/celery/issues/3270)，然后也有人使用了 [Celery Once](https://github.com/cameronmaske/celery-once)。 大致看了一下 Celery Once ，发现非常符合现在的情况，就用了下。

Celery Once 也是利用 Redis 加锁来实现，他的使用非常简单，参照 GitHub 的使用很快就能够用上。Celery Once 在 Task 类基础上实现了 QueueOnce 类，该类提供了任务去重的功能，所以在使用时，我们自己实现的方法需要将 QueueOnce 设置为 base

    @task(base=QueueOnce, once={'graceful': True})

后面的 once 参数表示，在遇到重复方法时的处理方式，默认 graceful 为 False，那样 Celery 会抛出 AlreadyQueued 异常，手动设置为 True，则静默处理。

另外如果要手动设置任务的 key，可以指定 keys 参数

    @celery.task(base=QueueOnce, once={'keys': ['a']})
    def slow_add(a, b):
        sleep(30)
        return a + b

总得来说，分为几步

第一步，安装

    pip install -U celery_once

第二步，增加配置

    from celery import Celery
    from celery_once import QueueOnce
    from time import sleep

    celery = Celery('tasks', broker='amqp://guest@localhost//')
    celery.conf.ONCE = {
      'backend': 'celery_once.backends.Redis',
      'settings': {
        'url': 'redis://localhost:6379/0',
        'default_timeout': 60 * 60
      }
    }

第三步，修改 delay 方法

    example.delay(10)
    # 修改为
    result = example.apply_async(args=(10))

第四步，修改 task 参数

    @celery.task(base=QueueOnce, once={'graceful': True, keys': ['a']})
    def slow_add(a, b):
        sleep(30)
        return a + b

更多详细的参数可以参考GitHub，或者直接阅读源码。

## reference

- <https://github.com/cameronmaske/celery-once>
