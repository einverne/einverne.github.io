---
layout: post
title: "Python 笔记之赋值语句和表达式"
tagline: ""
description: ""
category: 学习笔记
tags: [python, notes, assignment, expression, ]
last_updated:
---

赋值语句比较简单，Learning Python 这本书中对赋值语句介绍比较详细，分类也讲述的比较细，这篇文章就只简单的记录一些容易混乱的知识点，并不记录所有赋值语句需要注意的点。

## Augmented assignment and shared references
在之前的文章中就交代过共享引用是需要特别注意的，在 augmented assignment 中也是

    >>> L = [1, 2]
    >>> M = L                           # L M 共享同一个对象
    >>> L = L + [3, 4]                  # Concatenation 会创建新的对象
    >>> L, M                            # 所以他们的值不相同
    ([1, 2, 3, 4], [1, 2])

    >>> L = [1, 2]
    >>> M = L                           # Share
    >>> L += [3, 4]                     # 但是 `+=` 其实用的是 extend 方法，所以是原地修改
    >>> L, M
    ([1, 2, 3, 4], [1, 2, 3, 4])

## Expression Statements and In-Place Changes
表达式同样也分为很多种

    >>> L = [1,2]
    >>> L.append(3)
    >>> L
    [1, 2, 3]

不过需要注意的是，比如 `append()` 方法并没有返回值，所有返回的 L 会是 None

    >>> L = L.append(4)
    >>> L
    None


