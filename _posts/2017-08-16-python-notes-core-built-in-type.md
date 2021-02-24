---
layout: post
title: "Python 笔记之内置类型"
tagline: ""
description: ""
category: 学习笔记
tags: [python, linux, object, type, object-type, ]
last_updated:
---

这篇文章总结一下 Python 的内置类型。

类型

Object type                     | Example literals/creation
--------------------------------|------------------------------
Numbers                         | 1234 , 3.1415 , 3+4j , Decimal , Fraction
Strings                         | 'spam' , "guido's" , b'a\x01c'
Lists                           | [1, [2, 'three'], 4]
Dictionaries                    | {'food': 'spam', 'taste': 'yum'}
Tuples                          | (1, 'spam', 4, 'U')
Files                           | myfile = open('eggs', 'r')
Sets                            | set('abc'), {'a', 'b', 'c'}
Other core types                | Booleans, types, None
Program unit types              | Functions, modules, classes
Implementation-related types    | Compiled code, stack tracebacks

## Numbers
可以表示整形，浮点数，分数等等，甚至可以用来表示非常大的数，比如 `2 ** 10000`

不同进制表示

    0x1234 0X1234               # 16 进制 0x 后接 [0-9A-F]
    0o177 0O177                 # 8 进制  0o Zero 加大小写的 o 后接 [0-7]
    0b101 0B101                 # 2 进制 New in 2.6 > ，后接 [0-1]

内置的 `hex(number)` ， `oct(number)` ， `bin(number)` 将 int 转变为这三种进制的字符串。

## Strings
字符串在 Python 中支持切片的操作，比如 `S = 'Spam'`，这时 `S[-1]` 表示的是最后一个字符 `m`。

    S[1:3]          # 'pa'  左边包括，右边不包括
    S[1:]           # 'pam' [1:len(S)]
    S[:3]           # 'Spa' 等效于 [0:3]
    S[:-1]          # 除去最后一个元素
    S[:]            # S 全部

字符串重复操作可以使用 `S * 10` 打印 10 遍 S.

字符串和 Java 一样是不可变对象，Numbers 和 Tuples 也是不可变的。

### 字符串常用函数
常用操作

    S.find('pa')        # 输出字串位置 1
    S.replace('pa', 'xy')   # 替换 pa 为 xy 输出到新的字符串，不改变原始字符串

    line = 'hello world'
    line.split(' ')     # 空格分割，输出列表
    line.upper()        # 转为大写
    line.isdigit()      # 判断是否为数字，还有 isalpha() isnumeric() isspace() 等等
    line.rstrip()       # 移除行尾空白字符比如 `\n`

格式化字符串

    '%s, eggs, and %s' % ('spam', 'SPAM!')     # Python 格式化表达式
    # or
    '%s, eggs, and %s' % ('spam', 'SPAM!')     # Python 2.6 and 3.0

对于任何一个对象，都可以调用内置方法 `dir(S)` 来查看相关属性和方法。dir 方法可以用来快速查看对象的可调用方法，所以记不住方法的名字也不需要担心，使用 dir() 方法即可。

对于任何方法的使用，可以用 `help(S.replace)` 查看。

### 正则
说到字符串处理就不可避免的要谈到正则

    >>> import re
    >>> match = re.match('Hello[ \t]*(.*)world', 'Hello
    >>> match.group(1)
    'Python '

    >>> match = re.match('/(.*)/(.*)/(.*)', '/usr/home/einverne')
    >>> match.groups()
    ('usr', 'home', 'einverne')



## Lists

基本操作，可 Strings 类似也都支持切片，下标索引等等

    L = [123, 'spam', 1.23]
    L[0]
    L[:-1]
    L + [4,5,6]

Lists 不同于其他熟悉的语言，可以承载不同的类型，比如上面的例子，L 中就有三种完全不同的类型，Lists 没有特定的大小，可以根据需求调整长度。

    L.append('NI')          # 添加
    L.pop(2)                # 删除 index 为 2 的元素，并返回
    L.insert(1, 'xyz')      # 在 index 之前插入 'xyz'
    L.remove('xyz')         # 按照值移除第一个找到的 item

另外 list 的 `sort()` 和 `reverse()` 方法分别为 list 排序，逆序，直接改动 list 自身。

### Nesting
循环嵌套，比如表示 3 × 3 矩阵

    >>> M = [[1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]]
    >>> M
    [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

在获取值的时候可以

    >>> M[1]     # 获取第二行
    >>> M[1][2]  # 获取第二行第三列

可以使用 List comprehensions 来获取列

    >>> col2 = [row[1] for row in M]   # 获取第二列

这句话表达的意思就是，将矩阵 M 中每一行的 `row[1]` 第二个元素放到一个新的 list 中返回。这个表达式甚至可以更加复杂，比如在返回时每个元素乘以二。

    >>> [row[1] * 2 for row in M]

或者加入判断，只有偶数才返回

    >>> [row[1] for row in M if row[1] % 2 == 0]

List comprehensions 可以用在任何可以迭代的对象上，比如返回 M 矩阵对角线元素

    >>> diag = [M[i][i] for i in range(3)]
    >>> [c * 2 for c in 'spam']  # 输出一个列表 ['ss', 'pp', 'aa', 'mm']

在 Python 3.0 及以上，comprehension 语法也可以用来创建 set 或者 dict

    {sum(row) for row in M}       # {sum(row) for row in M} 创建一个每一行和的 set
    {i : sum(M[i]) for i in range(3)}    # {0: 6, 1: 15, 2: 24} dict

## Dictionaries
基本操作

    D = {}
    D['name'] = 'bob'

dict 也同样支持嵌套，value 值可以为不同类型。

    >>> rec = {'name': {'first': 'Bob', 'last': 'Smith'},
    'job': ['dev', 'mgr'],
    'age': 40.5}

构造这样一个复杂结构的 dict 在 Python 中非常轻松，但是如果在 C 中将会需要非常多的 coding。在一个 lower-level 的语言中我们需要非常小心释放变量内存空间，但是在 Python 中当丢失对象的引用时，内存空间会自动被释放。

    >>> rec = 0

Python 也有自己的垃圾回收机制，在 Python 中当对象的最后一个引用丢失时，空间会立即被回收。

使用 `in` 来检查 key 是否在 dict 中

    if 'f' in D:
        print D['f']

或者在 Python 3 可以使用 get() 方法，来避免获取一个不存在的 key 可能引发的错误

    D.get('f', 0)           # 如果 f 存在返回 D['f']，否则返回 0，等效于
    D['f'] if 'f' in D else 0

## Tuples
元组，像 lists 一样的序列，但是像 string 一样不可变。支持任意的类型，任意的嵌套，和序列一样。

    T = (1, 2, 3, 4)
    T = ('spam', 3.0, [11, 22, 33])

## Files
文件类型是 Python 用来和外部文件访问的重要接口。使用内置的 `open()` 函数来创建文件对象。

    f = open('data.txt', 'w')
    f.write('Hello\n')
    f.close()

    f = open('data.txt')          # 'r' 可以省略
    text = f.read()
    f.close()

在 Python 3 中区分了 text 和 binary data，__Text files__ 代表字符串内容并且以 Unicode 形式可以 encode 和 decode。而 __binary files__ 代表特殊的 bytes 并且允许用户直接访问无修改的文件内容。

## Other Core Types
集合

    X = set('spam')
    Y = {'h', 'a', 'm'}

    X & Y   # 交集
    X | Y   # 并集
    X - Y   # 差集

Decimal

    import deciaml
    d = decimal.Decimal('3.141')

    >>> decimal.getcontext().prec = 2
    >>> decimal.Decimal('1.00') / decimal.Decimal('3.00')
    Decimal('0.33')

    >>> from fractions import Fraction
    >>> f = Fraction(2, 3)
    >>> f + 1
    Fraction(5, 3)
    >>> f + Fraction(1, 2)
    Fraction(7, 6)

## Type check

    if type(L) == type([]):
        print('yes')

    if type(L) == list:
        print('yes')

    if isinstance(L, list):
        print('yes')

不过需要记住，代码少用这些类型检查。

> In Python, we code to object interfaces (operations supported), not to types.

Python 中所有的一切都是 Object，所以上面提到的所有类型都是 Object。
