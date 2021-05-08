---
layout: post
title: "Python 笔记之内存模型 Variables Objects and References 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [python, variable, object, ]
last_updated:
---

许多使用静态语言比如 C、 C++ 或者 Java 的人，在转到 Python 的时候可能第一个会疑惑的就是 Python 不需要显示的指定类型，那么 Python 是怎么知道变量的类型呢？

## 变量创建流程
在 Python 中，变量的创建遵循着一个非常合理的方式，以 `a=3` 来举例子：

- 变量创建

    一个变量（名字）比如 `a` ，当第一次被赋值时被创建。

- 变量类型 Variable Types

    一个变量永远不会有任何类型信息或者约束，类型的概念和 Object 关联，而不是变量名字。变量都是通用的（泛型），变量总是在特定时间指向一个特定的 Object 。

- 变量使用 Variable use

    当变量出现在表达式中，他会立即使用当前指向的 Object 替换。因此，所有的变量在使用之前都必须显式的被赋值，当使用未被赋值的变量时会产生错误。

总结来说，变量会在赋值时被创建，并且能够指向任何类型的对象，在引用前必须已经被赋值。这就是动态类型模型和传统静态语言最显著的差别。

所以对于 `a=3` Python 会执行三个完全不同的步骤来完成，下面的步骤显示了 Python 语言中所有赋值会执行的步骤：

1. 创建一个对象来表示 3
2. 如果变量不存在，则创建一个变量 `a`
3. 将变量 `a` 连接到对象 3

变量和对象会分别保存到不同的内存中。变量永远会指向 Objects，永远不会指向其他变量，但是大型的 Objects 可能会有指向其他 Objects 的链接（比如 list 对象就可能会有很多指向其他对象的链接）。

在 Python 中，这些从变量指向对象的链接被称为引用 **references** ，也就是说引用是一种关联，在内存中表现为指针。每当一个变量被使用， Python 会自动跟随着 variable to object 链接。

所以这些术语理解起来要简单得多，具体来讲：

- Variables 变量是 system table 的记录，使用空间来记录指向 Objects 的链接
- Objects 对象是真正分配内存的，使用足够的空间来表示他们真的值
- References 引用 会自动跟随着指针从变量到对象

概念上讲，每一次创建新的值， Python 都会创建新的对象（开辟内存空间）来表示值。内部来说，作为优化，Python 会使用缓存重用一些特定的不会改变的对象，比如比较小的 integers，strings，比如 0 并不会单独每一次都开辟内存空间，而是使用缓存。但是从逻辑上，每一个表达式的结果都会为不同的对象，每一个对象都有自己的内存空间。

每一个对象都有两个标准的 header fields：`type designator` 用来表明对象的类型，`reference counter` 来记录引用次数，何时对象应该被回收。

> Types live with Objects, Not Variables

## 对象回收
当对同一个变量重复赋值，那么变量之前指向的 Object 会发生什么？

    a = 3
    a = 'Spam'

当 a 被重新赋值为 Spam 时，对象 (3) 会发生什么。在 Python 中，当一个变量名被赋值到新对象时，之前对象的空间会被回收（也就是说当当一个对象不再被变量或者其他对象引用时会被回收）。这种自动回收对象空间的机制被称为 **垃圾回收** (garbage collection)。

内部实现来说，Python 通过在每一个 Object 中存储一个 counter，来追踪当前对象被引用的次数来实现垃圾回收。一旦引用计数变为 0，对象的内存空间就会被自动回收。

## Shared References
上面的内容都是单一变量，如果出现变量赋值比如

    a = 3
    b = a

这个时候 Python 会怎么处理呢？ 当变量 b 被创建时，会创建一个从 b 指向对象 3 的引用。这个有多个变量名字指向相同的对象的场景，被称为 **shared reference**

在上面的基础上，如果

    a = 'spam'

a 被重新赋值 `spam` 这个时候不会影响 b 指向的对象 3.

如果

    a = a + 2

同样不会影响 b 的值，对象 integer 5 会作为加号的结果放到**新的内存空间**，是一个新的对象，所以也不会改变 b 的值。事实上，也没有任何方法可以改变对象 3 的值，就像之前关于 [Python 类型一文](/post/2017/08/python-notes-core-built-in-type.html) 中说的那样，integer 是不可变类型，因此不能原地修改其内容。

## 共享引用和原地修改
当使用可变对象，比如 list 时，如果存在共享引用，要特别注意，当修改其中一个引用的对象的值时，会影响其他指向这个对象的引用。

    L1 = [2,3,4]
    L2 = L1
    L1[0] = 'spam'

这个时候 L1，L2 变量指向的对象值都被改变了。

如果需要深度拷贝 list 时，就需要特别注意，不要使用引用。

    L1 = [2,3,4]
    L2 = L1[:]             # 创建了一个 L1 的拷贝
    L1[0] = 'spam'          # 此时再修改 L1 则不会对 L2 造成影响

对 L1 的修改不会影响 L2 ，因为 L2 指向和 L1 完全不同的内存区域。

    import copy
    X = copy.copy(Y)            # make top-level "shadow" copy of any object Y
    X = copy.deepcopy(Y)        # make deep copy of any object Y: copy all nested parts

## 判别相等
因为 Python 的引用模型，所有有两种完全不同的判断相等的方法

    L = [1,2,3]
    M = L
    L == M                      # Same 这时候判断的是引用是否相同，判定值是否相同
    L is M                      # Same is 操作符判断是指向的对象是否相同，更强的相等判断

更比如说

    L = [1,2,3]
    M = [1,2,3]
    L == M                      # Same 相同的内容
    L is M                      # False 不同的对象

再比如

    X = 42
    Y = 42                      # 应该是两个不同的对象
    X == Y                      # True
    X is Y                      # 相同的对象，caching 在起作用

之前说过 Python 垃圾回收时，优化机制，导致 small integer 和 strings 会被缓存和重新使用，`is` 操作符告诉我们他们引用得是相同的对象。

事实上，如果想要知道对象的引用次数，可以使用 `getrefcount` 方法，在 `sys` 模块中。

    import sys
    sys.getrefcount(1)

检查对象 1 被引用的次数，常常会发现超过期待。因为 Integer 是不可变的，所以也就无所谓多少引用指向相同的对象了。

## reference

- Learning Python 4th Edition Chapter 6
