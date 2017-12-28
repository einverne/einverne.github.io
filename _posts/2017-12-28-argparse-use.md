---
layout: post
title: "argparse的使用介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [python, argparse, linux, command]
last_updated: 
---

argparse 模块可以轻松的写出友好的命令行交互，让使用者轻松定义命令行参数及使用参数。

## 简单使用

### 首先创建一个parser
首先通过 `argparse` 来创建一个 `ArgumentParser` 对象：

    parser = argparse.ArgumentParser(description='Process some integers.')

`ArgumentParser` 对象会保存命令行基本的信息。

### 再添加参数

构造好了 `ArgumentParser` 对象之后使用 `add_argument()` 来往其中添加参数。

    >>> parser.add_argument('integers', metavar='N', type=int, nargs='+',
    ...                     help='an integer for the accumulator')
    >>> parser.add_argument('--sum', dest='accumulate', action='store_const',
    ...                     const=sum, default=max,
    ...                     help='sum the integers (default: find the max)')

这些信息都被保存在对象中，直到 `parse_args()` 函数被调用。 `integers` 参数保存了一个或者一个以上列表的int值， `accumulate` 参数则会根据传入的参数选择 `sum()` 或者 `max()` 方法。

### 解析并使用参数
`ArgumentParser` 通过 `parse_args()` 来解析和使用参数

    >>> parser.parse_args(['--sum', '7', '-1', '42'])
    Namespace(accumulate=<built-in function sum>, integers=[7, -1, 42])
   
关于 `ArgumentParser` 对象更多的使用方法可以参考官方[文档](https://docs.python.org/3/library/argparse.html)

## 参数动作

argparse内置6种动作可以在解析到一个参数时进行触发：

- store 保存参数值，可能会先将参数值转换成另一个数据类型。若没有显式指定动作，则默认为该动作
- store_const 保存一个被定义为参数规格一部分的值，而不是一个来自参数解析而来的值。这通常用于实现非布尔值的命令行标记
- store_ture/store_false 保存相应的布尔值。这两个动作被用于实现布尔开关 
- append 将值保存到一个列表中。若参数重复出现，则保存多个值 
- append_const 将一个定义在参数规格中的值保存到一个列表中 
- version 打印关于程序的版本信息，然后退出


## 参数群组

argparse能将参数定义组合成“群组”。默认情况下是使用两个群组，一个是选项的群组，另一个是必须的与位置相关的参数群组。

在基础解析器中使用add_argument_group()来创建一个“身份认证”群组，然后逐个添加身份认证相关的选项到该群组。

    import argparse
    parser = argparser.ArgumentParser(add_help=False)
    group = parser.add_argument_group('authentication')
    group.add_argument('--user', action="store")
    group.add_argument('--password', action="store")

## 互斥选项

定义互斥的选项是选项分组特性的一个特例，使用`add_mutually_exclusive_group()`而不是`add_argument_group()`。

    import argparse
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument('-a', action='store_true')
    group.add_argument('-b', action="store_true")
    print parser.parse_args()


## 可变形参列表

你可以配置单个参数的定义使其能够匹配所解析的命令行的多个参数。根据需要或期望的参数个数，设置nargs为这些标识值之一：

值 | 含义 
---|-------
`N`  |参数的绝对个数（例如：3） 
`?`  |0或1个参数 
`*`  |0或所有参数 
`+`  |所有，并且至少一个参数


## 参数类型

argparse将所有参数值都看作是字符串，除非你告诉它将字符串转换成另一种数据类型。`add_argument()` 的type参数以一个转换函数作为值，被`ArgumentParser`用来将参数值从一个字符串转换成另一种数据类型。

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', type=int)
    parser.add_argument('-f', type=float)
    parser.add_argument('--file', type=file)
    try:
        print parser.parse_args()
    except IOError, msg:
        parser.error(str(msg))

要想将一个输入参数限制为一个预定义集中的某个值，则使用choices参数。

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=('read-only', 'read-write'))
    print parser.parse_args()


values的类型取决于nargs的值。如果该参数允许多个值，则values会是一个列表，即使其仅包含一个列表项。


## reference

- <https://docs.python.org/3/library/argparse.html>
- <http://blog.xiayf.cn/2013/03/30/argparse/>


