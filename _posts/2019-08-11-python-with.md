---
layout: post
title: "Python 为什么需要 with 语法"
tagline: ""
description: ""
category: 学习笔记
tags: [python, java, programming, ]
last_updated:
---

Python 中的 with 语法经常被用来在管理资源的访问和清理中，常见的场景有文件的使用和关闭，锁的获取和释放等等。

	with open("file.txt") as file:
		data = file.read()

with 语法特别容易联想起 Java 中的 [try-with-resources](/post/2016/04/try-with-resources-statement.html) AutoCloseable，同样实现资源的自动释放。

## 基本格式
从基本使用开始了解 with，with 的结构如下：

	with context_expression [as target(s)]:
	    content

## With 工作原理
如果要聊 with 的实现，就不得不提到 Python 中的上下文管理：

with 语句执行过程：

- 执行 context_expression 生成上下文管理器 context_manager
- 调用 context manager 的 enter() 方法，如果使用 as 子句，将 enter 方法返回值赋值给 target(s)
- 执行 with-body
- 不管是否异常，执行 exit() 方法，exit() 方法负责清理工作
- 出现异常时， exit(type, value, traceback) 返回 False，重新抛出异常，让 with 之外的语句逻辑来处理异常；如果返回 True，这忽略异常，不再对异常处理


	class Dummy:
		def __enter__(self):
			print "in __enter__"
			return "Foo"
		def __exit__(self, exc_type, exc_val, exc_tb):
			print "in __exit__"

	def get_dummy():
		return Dummy()

	with get_dummy() as dummy:
		print "Dummy: ", dummy

除了上面这种实现 `__enter__` 和 `__exit__` 方法来生成 context manger 的方式，还可以使用 contextlib

	from contextlib import contextmanager

	@contextmanager
	def open_file(name, mode):
	  f = open(name, mode)
	  yield f
	  f.close()

然后使用：

	with open_file('file.txt', 'w') as f:
	  f.write("Hello, world.")

## reference

- <https://www.python.org/dev/peps/pep-0343/>
