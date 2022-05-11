---
layout: post
title: "Celery 最佳实践"
aliases: "Celery 最佳实践"
tagline: ""
description: "Celery is a fast, reliable, distributed task queue"
category: 经验总结
tags: [celery, python, web, database, redis, queue,]
last_updated:
---

如果你第一次听说 Celery，可以去看下之前的 [Celery 介绍](/post/2017/04/celery-introduction.html) 了解下 Celery 的基本功能，然后再来看这篇文章。

## 尽量不要使用数据库作为 AMQP Broker
随着 worker 的不断增多可能给数据库 IO 和连接造成很大压力。更具体来说不要把 Celery 的 task 数据和应用数据放到同一个数据库中。 Docker 上[很多](https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=rabbitmq&starCount=0) 相关的镜像。


## 使用多个队列

对于不同的 task ，尽量使用不同的队列来处理。

	@app.task()
	def my_taskA(a, b, c):
		print("doing something here...")
	@app.task()
	def my_taskB(x, y):
		print("doing something here...")

在 `celery_config.py` 中定义

    task_queues=(
        Queue('default', routing_key='default'),
        Queue('other', routing_key='other'),


在 task 上定义

	@app.task(queue='other')
	def parse_something():
		pass

## 定义具有优先级的 workers

假如有一个 taskA 去处理一个队列 A 中的信息，一个 taskB 去处理队列 B 中的数据，然后起了 x 个 worker 去处理队列 A ，其他的 worker 去处理队列 B。而这时也可能会出现队列 B 中一些 task 急需处理，而此时堆积在队列 B 中的 tasks 很多，需要耗费很长时间来处理队列 B 中的 task。此时就需要定义优先队列来处理紧急的 task。

celery 中可以在定义 Queue 时，指定 `routing_key`

	Queue('other', routing_key='other_high'),
	Queue('other', routing_key='other_low'),

然后定义

	task_routes={
		# see
		# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-task_routes
		# http://docs.celeryproject.org/en/latest/userguide/routing.html#routing-basics
		'path.to.task' : {
			'queue': 'other',
			'routing_key': 'other_high'
		},
		'path.to.task' : {
			'queue': 'other',
			'routing_key': 'other_low'
		},
	}

在启动 worker 时指定 `routing_key`

	celery worker -E -l INFO -n workerA -Q other_high
	celery worker -E -l INFO -n workerB -Q other_low

## 使用 celery 的错误处理机制

一般情况下可能因为网络问题，或者第三方服务暂时性错误而导致 task 执行出错。这时可以使用 celery task 的重试机制。

	@app.task(bind=True, default_retry_delay=300, max_retries=5)
	def my_task_A():
		try:
			print("doing stuff here...")
		except SomeNetworkException as e:
			print("maybe do some clenup here....")
			self.retry(e)

一般添加 `default_retry_delay` 重试等待时间和 `max_retries` 重试次数来限定，防止任务无限重试。


## 使用 Flower

Flower [项目](http://celery.readthedocs.io/en/latest/userguide/monitoring.html#flower-real-time-celery-web-monitor) 为监控 celery tasks 和 workers 提供了一系列的便利。他使用 Web 界面提供 worker 当前状态， task 执行进度，各个 worker 详细信息，甚至可以在网页上动态更行执行速率。

## 只有在真正需要时才去追踪 celery 的 result

任务的状态存储任务在退出时成功或者失败的信息，这些信息有些时候很重要，尤其是在后期分析数据时，但是大部分情况下更加关心 task 执行过程中真正想要保存的数据，而不是任务的状态。

所以，可以使用 `task_ignore_result = True` 来忽略任务结果。

## 不要将 Database/ORM 对象传入 tasks

不应该讲 Database objects 比如一个 User Model 传入在后台执行的任务，因为这些 object 可能包含过期的数据。相反应该传入一个 user id ，让 task 在执行过程中向数据库请求全新的 User Object。

以上七条来自：<https://denibertovic.com/posts/celery-best-practices/>

## 尽量简化 tasks

task 应该简洁 (concise)：

- 将主要 task 逻辑包含在对象方法或者方法中
- 确保方法抛出明确的异常 (identified exceptions)
- 只有在切当的时机再实现重试机制

假设需要实现一个发送邮件的 task

	import requests
	from myproject.tasks import app  # app is your celery application
	from myproject.exceptions import InvalidUserInput
	from utils.mail import api_send_mail
	@app.task(bind=True, max_retries=3)
	def send_mail(self, recipients, sender_email, subject, body):
		"""Send a plaintext email with argument subject, sender and body to a list of recipients."""
		try:
			data = api_send_mail(recipients, sender_email, subject, body)
		except InvalidUserInput:
			# No need to retry as the user provided an invalid input
			raise
		except Exception as exc:
			# Any other exception. Log the exception to sentry and retry in 10s.
			sentrycli.captureException()
			self.retry(countdown=10, exc=exc)
		return data

通常任务真实的实现只有一层，而剩余的其他部分都是错误处理。而通常这么处理会更加容易维护。


## 设置 task 超时

设置一个全局的任务超时时间

	task_soft_time_limit = 600   # 600 seconds

超时之后会抛出 SoftTimeLimitExceeded 异常

	from celery.exceptions import SoftTimeLimitExceeded
	@app.task
	def mytask():
		try:
			return do_work()
		except SoftTimeLimitExceeded:
			cleanup_in_a_hurry()

同样，定义任务时也能够指定超时时间，如果任务 block 尽快让其失败，尽量配置 task 的超时时间。不让长时间 block task 的进程。


	@app.task(
		bind=True,
		max_retries=3,
		soft_time_limit=5 # time limit is in seconds.
	)
	def send_mail(self, recipients, sender_email, subject, body):
		...

## 将 task 重复部分抽象出来

使用 task 的基类来复用部分 task 逻辑


	from myproject.tasks import app
	class BaseTask(app.Task):
		"""Abstract base class for all tasks in my app."""
		abstract = True
		def on_retry(self, exc, task_id, args, kwargs, einfo):
			"""Log the exceptions to sentry at retry."""
			sentrycli.captureException(exc)
			super(BaseTask, self).on_retry(exc, task_id, args, kwargs, einfo)
		def on_failure(self, exc, task_id, args, kwargs, einfo):
			"""Log the exceptions to sentry."""
			sentrycli.captureException(exc)
			super(BaseTask, self).on_failure(exc, task_id, args, kwargs, einfo)

	@app.task(
		bind=True,
		max_retries=3,
		soft_time_limit=5,
		base=BaseTask)
	def send_mail(self, recipients, sender_email, subject, body):
		"""Send a plaintext email with argument subject, sender and body to a list of recipients."""
		try:
			data = api_send_mail(recipients, sender_email, subject, body)
		except InvalidUserInput:
			raise
		except Exception as exc:
			self.retry(countdown=backoff(self.request.retries), exc=exc)
		return data


## 将大型 task 作为类

一般情况下将使用方法作为 task 就已经足够，如果遇到大型 task ，可以将其写成[类](https://celery.readthedocs.org/en/latest/userguide/tasks.html#custom-task-classes)

	class handle_event(BaseTask):   # BaseTask inherits from app.Task
		def validate_input(self, event):
			...
		def get_or_create_model(self, event):
			...
		def stream_event(self, event):
			...
		def run(self, event):
			if not self.validate_intput(event):
				raise InvalidInput(event)
			try:
				model = self.get_or_create_model(event)
				self.call_hooks(event)
				self.persist_model(event)
			except Exception as exc:
				self.retry(countdown=backoff(self.request.retries), exc=exc)
			else:
				self.stream_event(event)

## 单元测试

直接调用 worker task 中的方法，不要使用 `task.delay()` 。 或者使用 Eager Mode，使用 `task_always_eager` 设置来启用，当启用该选项之后，task 会立即被调用。而 这两种方式都只能测试 task worker 中的内容，官方 [^testing] 并不建议这么做。


[^testing]: <http://docs.celeryproject.org/en/latest/userguide/testing.html>


## 对于执行时间长短不一的任务建议开启 -Ofair

celery 中[默认](http://celery.readthedocs.io/en/latest/userguide/optimizing.html#prefork-pool-prefetch-settings) 都会有 prefork pool 会异步将尽量多的任务发送给 worker 执行，这也意味着 worker 会**预加载**一些任务。这对于通常的任务会有性能提升，但这也容易导致因为某一个长任务处理时间长，而导致其他任务处于长时间等待状态。

对于执行时间长短不一的任务可以开启 `-Ofair`

	celery -A proj worker -l info -Ofair

## 设置 worker 的数量
Celery 默认会开启和 CPU core 一样数量的 worker，如果想要不想开启多个 worker ，可以通过启动时指定 `--concurrency` 选项

    --concurrency=1

## 在 Celery 中使用多线程
上面提到使用 `--concurrency=1` 或者 `-c 1` 来设置 worker 的数量，Celery 同样支持 Eventlet 协程方式，如果你的 worker 有大量的 IO 操作，网络请求，那么此时使用 [Eventlet](http://docs.celeryproject.org/en/latest/userguide/concurrency/eventlet.html) 协程来提高 worker 的执行效率。确保在使用 Eventlet 之前对 Eventlet 非常了解，否则不要轻易使用

    celery -A proj worker -P eventlet -c 10

## reference

- <https://denibertovic.com/posts/celery-best-practices/>
- <https://blog.balthazar-rouberol.com/celery-best-practices>
- <https://library.launchkit.io/three-quick-tips-from-two-years-with-celery-c05ff9d7f9eb>
- <https://blog.jixee.me/7-tips-for-working-with-celery/>
