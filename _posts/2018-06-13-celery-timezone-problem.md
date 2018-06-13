---
layout: post
title: "Celery 又一坑：时区错误"
tagline: ""
description: ""
category: 学习笔记
tags: [celery, python, linux, message, queue, bug,]
last_updated:
---

Celery 使用过程中又遇[一坑](https://github.com/celery/celery/issues/4177)，最近升级项目中使用的 Celery 到 4.1.1，突然发现一些定时任务突然不执行了。开始还以为代码哪里做了变化，尝试找了很久，然后打开 scheduler 的日志观察了一段时间。

Celery config 中的配置是如下所示，理论上，早间的任务应该在 8 点到 12 点 每隔 5 分钟执行一次，然后午间和晚间的以此类推。

    app.conf.timezone = 'Asia/Shanghai'

    app.conf.beat_schedule = {
        'morning': {
            'task': 'worker.xxx.get_xxx',
            'schedule': crontab(minute='*/5', hour='8-12'),
            'args': ('早间',),
            'options': {
                'queue': 'xxx'
            }
        },
        'afternoon': {
            'task': 'worker.xxx.get_xxx',
            'schedule': crontab(minute='*/5', hour='12-18'),
            'args': ('午间',),
            'options': {
                'queue': 'xxx'
            }
        },
        'evening': {
            'task': 'worker.xxx.get_xxx',
            'schedule': crontab(minute='*/5', hour='19-21'),
            'args': ('晚间',),
            'options': {
                'queue': 'xxx'
            }
        },
    }

但是观察日志发现，即使现在是下午 4 点，但是上午的任务依然在跑，这个时候突然想起来，是不是因为版本升级导致，果不然，一查 [GitHub](https://github.com/celery/celery/issues/4177) 就有人反馈这个问题，目前解决方法很简单，为了恢复可用状态，将 celery 回滚到了 4.0.2 版本。暂时没有发现问题。

看 issue 已经意识到该问题，希望能在 4.2 版本中修复吧，有时间的话我再看看他的源码。
