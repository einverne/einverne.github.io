---
layout: post
title: "Python 项目的结构"
tagline: ""
description: ""
category: 学习笔记
tags: [python, project, structure, management, ]
last_updated:
---

之前和朋友聊天，说到 Python 项目的结构问题，Python 确实是一门比较灵活的语言，你可以单独执行某个文件，把这些文件扔到一起看起来像个工程，但是外人来看其实就是一个个独立的小文件，小模块，对于小型项目来说可能并不会造成什么问题，但是对于大型项目，尤其是如果需要多人合作，有一个关于工程结构的基本认识是非常必要的。

Python 没有强制的结构规范，但是有一个大家的[共识](https://github.com/kennethreitz/samplemod)

    README.rst
    LICENSE
    setup.py
    requirements.txt
    sample/__init__.py
    sample/core.py
    sample/helpers.py
    docs/conf.py
    docs/index.rst
    tests/test_basic.py
    tests/test_advanced.py

项目的结构是项目的门面，简单易懂的项目结构能够让介入的第三人快速的熟悉项目，Python 项目结构没有太多的约束和限制，Python 提供的导入和模块管理使得结构化 Python 相对简单，但也要注意一些比如循环依赖的问题。

## 模块
为了解决项目结构的问题就不得不提到模块（module），这是 Python 最主要的抽象层，模块允许将代码分为不同的部分，每个部分包含相关的数据和功能。

模块名尽量要短，使用小写，并且避免使用特殊符号，比如（`.`）或者 （`?`） 等。不推荐在模块名中使用下划线。

    # ok
    import library.plugin.foo
    # not ok
    import library.foo_plugin

import 的工作原理，比如 `import modu` 将会寻找合适的文件，调用目录下的 `modu.py` 文件，如果没有找到，Python 解释器会递归地在 `PYTHONPATH` 环境变量中查找该文件，如果没有则抛出 ImportError 异常。一旦找到 `modu.py` Python 解释器将在隔离的作用域内执行模块。所有顶层语句都会被执行，包括其他的引用。方法和类的定义会存储到模块字典中。这个模块的变量、方法和类通过命名空间暴露给调用方。

import 语句也可以为 `from modu import *` ，使用 `from modu import func` 能够精确定位想要导入的方法，并将其放入到全局命名空间。

    # 较差的写法
    [...]
    from modu import *
    [...]
    x = sqrt(4)  # sqrt 是模块 modu 的一部分么？或是内建函数么？上文定义了么？

    # 稍好
    from modu import sqrt
    [...]
    x = sqrt(4)  # 如果在 import 语句与这条语句之间，sqrt 没有被重复定义，它也许是模块 modu 的一部分。

    # 最好的做法
    import modu
    [...]
    x = modu.sqrt(4)  # sqrt 显然是属于模块 modu 的。

## 包
Python 提供非常简单的包管理系统，简单地将模块管理机制扩展到一个目录上，就是包。任意包含 `__init__.py` 文件的目录都被认为是一个 Python 包。如果包内的模块和子包没有代码共享的需求，使用空白 `__init__.py` 是正常的做法。

导入深层嵌套包可以使用 `import very.very.deep.module as mod` 可以简化导入冗长子包。

## 对象
使用无状态的函数是一种更好的编程范式。

把有隐式上下文和副作用的函数与仅包含逻辑的函数（纯函数）谨慎地区分开来，会带来 以下好处：

- 纯函数的结果是确定的：给定一个输入，输出总是固定相同。
- 当需要重构或优化时，纯函数更易于更改或替换。
- 纯函数更容易做单元测试：很少需要复杂的上下文配置和之后的数据清除工作。
- 纯函数更容易操作、修饰和分发。

## 装饰器
装饰器本质上是一个 Python 函数，它可以让其他函数在不需要做任何代码变动的前提下增加额外功能，装饰器的返回值也是一个函数对象。它经常用于有切面需求的场景，比如：插入日志、性能测试、事务处理、缓存、权限校验等场景。装饰器是解决这类问题的绝佳设计，有了装饰器，我们就可以抽离出大量与函数功能本身无关的雷同代码并继续重用。概括的讲，装饰器的作用就是为已经存在的对象添加额外的功能。


    def use_logging(func):

        def wrapper():
            logging.warn("%s is running" % func.__name__)
            return func()   # 把 foo 当做参数传递进来时，执行 func() 就相当于执行 foo()
        return wrapper

    def foo():
        print('i am foo')

    foo = use_logging(foo)  # 因为装饰器 use_logging(foo) 返回的时函数对象 wrapper，这条语句相当于  foo = wrapper
    foo()                   # 执行 foo() 就相当于执行 wrapper()

使用 `@` 符号，装饰器的语法糖

    def use_logging(func):

        def wrapper():
            logging.warn("%s is running" % func.__name__)
            return func()
        return wrapper

    @use_logging
    def foo():
        print("i am foo")

    foo()

这样就可以省略掉 `foo = use_logging(foo)` 这句赋值。

带参数的装饰器

    def use_logging(level):
        def decorator(func):
            def wrapper(*args, **kwargs):
                if level == "warn":
                    logging.warn("%s is running" % func.__name__)
                elif level == "info":
                    logging.info("%s is running" % func.__name__)
                return func(*args)
            return wrapper

        return decorator

    @use_logging(level="warn")
    def foo(name='foo'):
        print("i am %s" % name)

    foo()

类装饰器

    class Foo(object):
        def __init__(self, func):
            self._func = func

        def __call__(self):
            print ('class decorator runing')
            self._func()
            print ('class decorator ending')

    @Foo
    def bar():
        print ('bar')

    bar()

通过 `functools.wrap` 来找回原函数的元信息

    from functools import wraps
    def logged(func):
        @wraps(func)
        def with_logging(*args, **kwargs):
            print func.__name__      # 输出 'f'
            print func.__doc__       # 输出 'does some math'
            return func(*args, **kwargs)
        return with_logging

    @logged
    def f(x):
       """does some math"""
       return x + x * x

Python 类相关的内置装饰器

    @staticmathod、@classmethod、@property

## 上下文管理器
上下文管理器是一个 Python 对象，为操作提供了额外的上下文信息。with 语句初始化上下文

    with open('file.txt') as f:
        contents = f.read()

实现这个功能有两种简单的方法：使用类或使用生成器。 让我们自己实现上面的功能，以使用类方式开始：

    class CustomOpen(object):
        def __init__(self, filename):
            self.file = open(filename)

        def __enter__(self):
            return self.file

        def __exit__(self, ctx_type, ctx_value, ctx_traceback):
            self.file.close()

    with CustomOpen('file') as f:
        contents = f.read()

生成器使用 Python 自带的 contextlib

from contextlib import contextmanager

    @contextmanager
    def custom_open(filename):
        f = open(filename)
        try:
            yield f
        finally:
            f.close()

    with custom_open('file') as f:
        contents = f.read()

由于这两种方法都是一样的，所以我们应该遵循 Python 之禅来决定何时使用哪种。 如果封装的逻辑量很大，则类的方法可能会更好。 而对于处理简单操作的情况，函数方法可能会更好。

## reference

- <https://pythonguidecn.readthedocs.io/zh/latest/writing/structure.html>
