---
layout: post
title: "Python 笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [python, class, inheritance, ]
last_updated:
---

## 多重继承
在 Python 中如果一个类继承自多个类，这种行为被称为多重继承 multiple inheritance，虽然多重继承非常有用，但是需要注意一些问题，否则会出现不可预见的问题。

在使用多重继承时，如果一个方法从多个超类中继承，先继承的类中的方法会重写后继承类中的方法。（超类顺序为定义 class 时的顺序）。

## 静态方法和类成员方法
Python 2.4 中，引入了**装饰器**(decorators) 的语法，能够对任何可调用的对象进行包装，既能够用于方法也能够用于函数。使用 `@` 操作符，在方法或函数上将装饰器列出，指定一个或者多个装饰器。多个装饰器在应用时的顺序与指定顺序相反。

    class Date(object):

        def __init__(self, day=0, month=0, year=0):
            self.day = day
            self.month = month
            self.year = year

        @classmethod
        def from_string(cls, date_as_string):
            day, month, year = map(int, date_as_string.split('-'))
            date1 = cls(day, month, year)
            return date1

        @staticmethod
        def is_date_valid(date_as_string):
            day, month, year = map(int, date_as_string.split('-'))
            return day <= 31 and month <= 12 and year <= 3999

    date2 = Date.from_string('11-09-2012')
    is_date = Date.is_date_valid('11-09-2012')

`classmethod` 必须有一个指向 class object 的 reference 作为第一参数，而 staticmethod 则不需要。

### Class Method
C++ 有重载的功能，但是 Python 缺乏重载的机制，所以就有了 `classmethod`，可以想象成另外一个构造函数

    @classmethod
    def from_string(cls, date_as_string):
        day, month, year = map(int, date_as_string.split('-'))
        date1 = cls(day, month, year)
        return date1

    date2 = Date.from_string('11-09-2012')

`cls` 是一个持有 class self 的对象，但是不是 class 的一个实例。如果继承了 `Date` 类，所有的子类都会拥有 `from_string` 方法。

### Static method
对于这个例子，`is_date_valid` 方法不需要关心类内部的其他变量和方法，但是这个 valid 方法和 Date 相关，可以定义为静态方法。和其他语言中的静态方法可以一起理解。

## getattr setattr
拦截 intercept 对象的所有特性访问是可能的，然后有一些魔法方法。比如 `__getattr__` 和 `_setattr__`

- `__getattribute__(self.name)` 当特性 name 被访问时自动被调用，只能在新式类中使用
- `__getattr__(self.name)` 当特性 name 被访问且对象没有相应的特性时被自动调用
- `__setattr__(self.name.value)` 当试图给特性 name 赋值时被自动调用
- `__delattr__(self.name)` 当试图删除特性 name 时被自动调用

这里是一些区别

- `__getattribute__` 无条件被调用，任何对象的属性访问时都会隐式调用，比如 `t.__dict__` 其实是执行了 `t.__getattribute__("__dict__")` ，所以如果我们在重载`__getattribute__`中又调用`__dict__`的话，会无限递归，用 object 来避免，即 object.__getattribute__(self, name)
- `__getattr__` 只有 `__getattribute__` 找不到的时候才会调用 `__getattr__`

举例

    class Attr(object):

        def __init__(self, name):
            self.name = name

        def __getattribute__(self, item):
            print("__getattribute__ " + item)
            return object.__getattribute__(self, item)

        def __getattr__(self, item):
            print("__getattr__ " + item)

        def __setattr__(self, key, value):
            print("__setattr__ key %s, value %s" % (key, value))
            object.__setattr__(self, key, value)


    if __name__ == '__main__':
        attr = Attr('wendy')
        print("main " + attr.name)
        attr.name = 'nancy'

在这个例子中，输出结果

    __setattr__ key name, value wendy
    __getattribute__ name
    main wendy
    __setattr__ key name, value nancy


## 迭代器

在 Python 中，很多对象都是可以通过 for 语句来直接遍历的，例如 list、string、dict 等等，这些对象都可以被称为可迭代对象。迭代器对象要求支持迭代器协议的对象，在 Python 中，支持迭代器协议就是实现对象的`__iter__()` 和 `next()` 方法。其中`__iter__()` 方法返回迭代器对象本身；`next()` 方法返回容器的下一个元素，在结尾时引发 StopIteration 异常。

    class PowTwo:
        """Class to implement an iterator
        of powers of two"""

        def __init__(self, max=0):
            self.max = max

        def __iter__(self):
            self.n = 0
            return self

        def __next__(self):
            if self.n <= self.max:
                result = 2 ** self.n
                self.n += 1
                return result
            else:
                raise StopIteration


    p = PowTwo(5)
    for i in p:
        print(i)


## 生成器


