---
layout: post
title: "Python 方法的参数传递 argument passing 引用传值"
tagline: ""
description: ""
category: 学习笔记
tags: [python, argument-passing, notes, ]
last_updated:
---

Argument passing 指的是方法传参，对象是如何被传送到方法作为输入的。

下面是传参的几个要点：

- Arguments are passed by automatically assigning objects to local variable names.

    参数被传递后自动将赋值给局部变量名

- Assigning to argument names inside a function does not affect the caller

    在方法内部对参数进行赋值，不会影响调用者

- Changing a mutable object argument in a function may impact the caller

    方法可能会原地修改可变对象，从而影响到调用者

记住以上几点就能够清晰的明白 Python 中传参的要点了。Learning Python 一书中将 Python 传参模型和 C 语言比较，他们都有共同点：

- Immutable arguments are effectively passed “by value.”
- Mutable arguments are effectively passed “by pointer.”

Python 的这种传值机制使得在函数中传递对象变得非常简单，即使是很大的对象传递一个”指针“也非常快速。但是对于编程者而言需要非常明确地知道，在传递可变对象时需要特别当心方法会修改对象值。所以有必要的情况下，先拷贝一份对象内容再传递给方法。

## 举例
例子

    def test_function_args(s: str, i: int, t: tuple, d: dict, c: tuple):
        print('-' * 10)
        print(f's id: {id(s)}, value: {s}')
        print(f'i id: {id(i)}, value {i}')
        print(f't id: {id(t)}, value {t}')
        print(f'd id: {id(d)}, value {d}')
        print(f'c id: {id(c)}, value {c}')
        print('-' * 10)
        s = 'in function'
        i = i + 10
        t = (3, 4)
        d['age'] = '20'
        c[0].append(3)
        print('-' * 10)
        print(f's id: {id(s)}, value: {s}')
        print(f'i id: {id(i)}, value {i}')
        print(f't id: {id(t)}, value {t}')
        print(f'd id: {id(d)}, value {d}')
        print(f'c id: {id(c)}, value {c}')
        print('-' * 10)


    if __name__ == '__main__':
        s = 'this is a test s'
        i = 10
        t = (1, 2)
        d = {'name': 'ev'}
        c = ([1, 2], 3.14)
        print('-' * 10)
        print(f's id: {id(s)}, value: {s}')
        print(f'i id: {id(i)}, value {i}')
        print(f't id: {id(t)}, value {t}')
        print(f'd id: {id(d)}, value {d}')
        print(f'c id: {id(c)}, value {c}')
        print('-' * 10)
        test_function_args(s, i, t, d, c)
        print('-' * 10)
        print(f's id: {id(s)}, value: {s}')
        print(f'i id: {id(i)}, value {i}')
        print(f't id: {id(t)}, value {t}')
        print(f'd id: {id(d)}, value {d}')
        print(f'c id: {id(c)}, value {c}')
        print('-' * 10)

输出

    ----------
    s id: 139714585800824, value: this is a test s
    i id: 9277184, value 10
    t id: 139714585799240, value (1, 2)
    d id: 139714605570160, value {'name': 'ev'}
    c id: 139714585797704, value ([1, 2], 3.14)
    ----------
    ----------
    s id: 139714585800824, value: this is a test s
    i id: 9277184, value 10
    t id: 139714585799240, value (1, 2)
    d id: 139714605570160, value {'name': 'ev'}
    c id: 139714585797704, value ([1, 2], 3.14)
    ----------
    ----------
    s id: 139714605058544, value: in function
    i id: 9277504, value 20
    t id: 139714585798664, value (3, 4)
    d id: 139714605570160, value {'name': 'ev', 'age': '20'}
    c id: 139714585797704, value ([1, 2, 3], 3.14)
    ----------
    ----------
    s id: 139714585800824, value: this is a test s
    i id: 9277184, value 10
    t id: 139714585799240, value (1, 2)
    d id: 139714605570160, value {'name': 'ev', 'age': '20'}
    c id: 139714585797704, value ([1, 2, 3], 3.14)
    ----------
