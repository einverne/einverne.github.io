---
layout: post
title: "Python 参数类型和参数匹配模型"
tagline: ""
description: ""
category: 学习笔记
tags: [python, argument-matching, argument, model, ]
last_updated:
---

Python 方法的参数种类有很多，而不是通常语言定义的那样， Python 方法的传参能力要比想象的强大很多。很多初学者可能对一些库中带 `*` 带 `**` 的参数类型非常奇怪，但是其实这些语法正是保证 Python 方法传参强大的重要因素。

## First Thing

首先要声明 argument 和 parameter 的区别，很多时候这两个单词被直接翻译为参数更导致了很多人无法区分，argument 是调用方发起的称呼，parameter 是定义方法时使用

    def foo(a, b):  # <- a and b are "parameters" or "formal arguments"
        pass

    foo(1, 2)  # <- 1 and 2 are arguments to foo, that match a and b

## 参数类型
在讨论参数类型之前，先来看一个例子

    def bar(a,    # <- this parameter is a normal python parameter
            b=1,  # <- this is a parameter with a default value
            *,    # <- all parameters after this are keyword only
            c=2,  # <- keyword only argument with default value
            d):   # <- keyword only argument without default value
        pass

这是一个典型的方法定义，其中包括了一些类型，但是还不全面。

Python 的参数类型：

- Positionals: matched from left to right 很多教程都叫做：位置参数

    顾名思义，就是从左往右匹配，比如 `def foo(a, b): pass` 传参的时候就必须 `foo(1,'a')` 按照位置传

- Keywords: matched by argument name

    也就是传参时需要指定关键词 (name=value) 这样的形式传，比如定义 `def func(name=value):pass` 然后调用 `func(name=value)`

- Defaults: specify values for arguments that aren’t passed

    可以给某些参数默认值，如果不传这些参数则使用默认值，这些可选参数传值时也需要 name=value

- Varargs collecting: collect arbitrarily many positional or keyword arguments

    方法可以使用带 `*` 或者 `**` 的参数来收集任意长度的参数，定义方法时 `def func(*name)` 用来收集剩下的位置参数然后保存到 tuple 中，定义方法 `def func(**name)` 将收集所有的 keyword arguments 然后作为 dictionary

- Varargs unpacking: pass arbitrarily many positional or keyword arguments

    调用者可以使用 `*` 方式来 unpack 参数集合，比如 `func(*sequence)` 调用者将 sequence 的所有对象一个个按照顺序传入（作为单独的 positional arguments)， `func(**dict)` 调用者将 dict 中的所有 key/value 以单独的关键词参数传入 (keyword arguments)

- Keyword-only arguments: arguments that must be passed by name

    In Python 3.0 以后引入，可以指定必须 name=value 传递

总而言之，上面定义的参数类型模型，让 Python 能够决定方法需要传递多少参数，通常情况下位置参数调用者必须显示指定，而如果定义了默认参数调用者往往可以省去，而如果定义了 `*` 参数，则表示调用者可以传任意数量的参数。

## 顺序
方法定义和方法调用都要遵循一定的顺序：

- 方法调用者，参数列表需要按照如下顺序：positional arguments(value) -> keyword arguments(name=value) -> `*sequence`  -> `**dict`
- 而方法定义时，参数定义需要按照： normal arguments(name)， 跟着 default arguments(name=value), -> `*name` -> `name or name=value` keyword-only arguments -> `**name`

在定义和调用时， `**arg` 如果定义都必须在最后出现，如果不按照顺序使用，会给出语法错误。 Python 内部按照下面的步骤来匹配参数列表：

- 先按照 positional arguments 来赋值，对于任何 positional arguments：

    1. 尝试将 argument 绑定到第一个没有填充的 parameter slot，如果 slot 不是 vararg slot，标记 slot 为 filled 。
    2. 如果下一个 unfilled slot 是一个 vararg slot，并且没有 name 那么报错
    3. 否则（下一个 unfilled slot 是一个 vararg slot)，所有剩下的 non-keyword arguments 都传给 vararg slot。

- 再按照 keyword arguments 来赋值任何匹配的参数

    1. 如果 parameters 中存在 name 和 keyword 匹配的参数，在将 argument value 赋值给 parameter slot. 如果 parameter slot 已经 filled，报错
    2. 否则，如果有 keyword dictionary argument, argument 就添加到存在的 dictionary，如果已经存在同名 key，则报错
    3. 否则，如果没有 keyword dictionary, 并且没有匹配的 named parameters , 报错

- 将剩余没有 keyword 的参数赋值给 `*name` 元组
- 将剩余的 keyword 参数赋值给 `**name` 字典
- 最后将默认值赋值给没有传入的参数

    - 如果 vararg slot 还没有填充，将空的 tuple 赋值给他
    - 对于剩下的空的 slot，如果有默认值则填充，如果没有默认值，则报错

在这些之后，Python 会检查每个参数都已经有且仅有一个值，如果不是将抛出错误。一旦匹配完成，Python 就将传入的对象赋值给参数名。

在这些都理清楚之后 Python 3.0 还有一个 keyword-only arguments 似乎还要费些笔墨。

## Python 3.0 Keyword-Only Arguments
Python 3.0 总结了定义方法时参数列表的顺序，允许我们使用 **keyword-only arguments** ---- 这类参数只能通过 keyword 传入，永远不会使用 positional argument 来填充。当我们既想要方法处理任意数量的 arguments 并且也可选的接受一些 configuration 选项时。

句法上， keyword-only arguments 类似于 named arguments，但是出现在 `*args` 后面。所有这类 argument 都必须在调用时使用 keyword 形式传入。

    >>> def kwonly(a, *b, c):
            print(a, b, c)

    >>> kwonly(1, 2, c=3)
    1 (2,) 3

    >>> kwonly(a=1, c=3)
    1 () 3

    >>> kwonly(1,2,3)
    TypeError: kwonly() needs keyword-only argument c

这里 `*b` 如果不需要任意长度可以简写为 `*`

    >>> def kwonly(a, *, b, c):
            print(a, b, c)

    >>> kwonly(1, c=3, b=2)
    1 2 3
    >>> kwonly(c=3, b=2, a=1)
    1 2 3
    >>> kwonly(1,2,3)
    TypeError: kwonly() takes exactly 1 positional argument (3 given)
    >>> kwonly(1)
    TypeError: kwonly() needs keyword-only argument b

在 `*` 之后依然可以使用带默认值的参数，b,c 如果被使用到则必须使用 keyword

    >>> def kwonly(a, *, b='spam', c='ham'):
    ...
    print(a, b, c)
    ...
    >>> kwonly(1)
    1 spam ham
    >>> kwonly(1, c=3)
    1 spam 3
    >>> kwonly(a=1)
    1 spam ham
    >>> kwonly(c=3, b=2, a=1)
    1 2 3
    >>> kwonly(1, 2)
    TypeError: kwonly() takes exactly 1 positional argument (2 given)

如果 keyword-only 参数没有默认值，则在调用时必须传入

在调用时，keyword-only 被传入时，必须要在 `**args` 之前

    >>> def f(a, *b, c=6, **d): print(a, b, c, d)
    >>> f(1, *(2, 3), **dict(x=4, y=5))
    1 (2, 3) 6 {'y': 5, 'x': 4}

    >>> f(1, *(2, 3), **dict(x=4, y=5), c=7)
    SyntaxError: invalid syntax

    >>> f(1, *(2, 3), c=7, **dict(x=4, y=5))
    1 (2, 3) 7 {'y': 5, 'x': 4}

    >>> f(1, c=7, *(2, 3), **dict(x=4, y=5))
    1 (2, 3) 7 {'y': 5, 'x': 4}

    >>> f(1, *(2, 3), **dict(x=4, y=5, c=7))
    1 (2, 3) 7 {'y': 5, 'x': 4}

为什么要有 keyword-only arguments ，简单的来说，就是想让方法支持任意的 positional arguments 并且让 configuration 选项作为 keyword 传入。

比如想要实现一个函数，处理传入的一组对象，并且有一个开关用来指定处理完成之后是否通知

    process(X, Y, Z)
    process(X, Y, notify=True)

如果没有 keyword-only arguments，我们可能需要同时使用 `*args` 和 `**args` 并且人工的从 keywords 中获取 notify 。使用 keyword-only 可以节省很多

    def process(*args, notify=False): ...


## reference

- <https://www.python.org/dev/peps/pep-3102/>
