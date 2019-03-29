---
layout: post
title: "需要注意的 Python round() 方法"
tagline: ""
description: ""
category: 经验总结
tags: [python, round, programming, tips,]
last_updated:
---

今天无意间看到 Python 的 round() 方法，它支持第二个可选参数 `round(number[, ndigits])` ，看其文档可以知道

- 当 ndigits 为 None 时，返回返回距离最近的整数
- 当 ndigits 不为空时，则返回小数点后面 n 精度的 float 数字

所以可以简单的将该函数记忆成四舍五入的方法，然而该方法在执行过程中有些情况需要特别注意，尤其是在输入数字为浮点数时。

## 正负数

    >>> round(0.5)
    1.0
    >>> round(-0.5)
    -1.0

## Python 不同版本之间差异

Python 2 中

    Python 2.7.13 (default, Aug 27 2018, 10:30:14)
    [GCC 5.4.0 20160609] on linux2
    Type "help", "copyright", "credits" or "license" for more information.
    >>> round(6.5)
    7.0

Python 3 中

    Python 3.6.1 (default, Jul 11 2017, 16:32:55)
    [GCC 5.4.0 20160609] on linux
    Type "help", "copyright", "credits" or "license" for more information.
    >>> round(6.5)
    6

## 返回值的不同类型
当不提供 ndigits 时返回的是 integer 而提供 ndigits 时提供的是输入参数的类型

    >>> type(round(1.4))
    <class 'int'>
    >>> type(round(1.454,2))
    <class 'float'>

## Attention
另外需要注意的是，因为 Float 在不同机器上表示方式不是精确的，所以在计算四舍五入时会发现有些数字会有很奇怪的输出，比如官方文档上给出的 2.675，保留 2 位，那么结果是：

    >>> round(2.675,2)
    2.67

## Tips
另外 round 的第二个参数可以传入负数

    >>> round(1234, -3)
    1000.0


