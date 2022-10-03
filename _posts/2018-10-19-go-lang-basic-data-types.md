---
layout: post
title: "Go 语言学习笔记 3：基础类型"
aliases: "Go 语言学习笔记 3：基础类型"
tagline: ""
description: ""
category: [ 学习笔记 , Go]
tags: [golang, programming, ]
last_updated:
---

和大多数强类型语言一样，Go 也有自己基本的类型系统。Go 语言的类型大致可以分为四大类：

- basic types 基础类型（basic types）包括 `numbers`,`strings`,`booleans`
- aggregate types  聚合类型（aggregate types）包括 `arrays` , `structs`
- reference types 引用类型（reference types) 包括不同组，包括 `pointers` , `slices`, `maps`, `functions`, `channels` ，他们都是程序变量或者状态的引用
- interface types, 接口类型 (interface types) 是特殊的一个类型，会在后面单独介绍。

## Integers

Go 数值类型包括整型，浮点数和复数。对于整型

- 有符号 int8(8 位，1 个字节）、int16、int32 和 int64
- 无符号 uint8、uint16、uint32 和 uint64
- 还有对应特定 CPU 的 int 和 uint，在不同平台上可能为 32bit 或者 64 bit。
- `rune` 等同于 int32 用来表示 Unicode
- `byte` 等同于 uint8 通常用来表示原始数据
- `uintptr` 无符号整数类型，用来存储指针，uintptr 通常用在更加底层编程

注意 `int` 和 `int32` 不是同一类型。

书中这边还介绍了运算符优先级和类型转换，进制转换的具体问题，详情可以参考。

## Floating-Point 浮点类型
Go 提供了两种精度的浮点数 `float32` 和 `float64` ，常量 `math.MaxFloat32` 表示 float32 能表示的最大数，`math.MaxFloat64` 同理。

float32 类型的浮点数可以提供大约 6 个十进制数的精度，而 float64 则可以提供约 15 个十进制数的精度；通常应该优先使用 float64 类型。

## Complex Numbers 复数
Go 语言提供了两种精度的复数类型：complex64(8 字节） 和 complex128(16 个字节），分别对应 float32 和 float64 两种浮点数精度。内置的 complex 函数用于构建复数，`real` 和 `imag` 函数用来返回实部和虚部：

    var x complex128 = complex(1,2) // 1+2i
    var y complex128 = complex(3,4) // 3+4i
    fmt.Println(x*y)                 // "(-5+10i)"
    fmt.Println(real(x*y))           // "-5"
    fmt.Println(imag(x*y))           // "10"

## Booleans
布尔值只有两个值 true or false

## Strings
字符串是不可变的字节序列，可以包含任何数据，通常文本会解释为 UTF8 编码 Unicode 。len 函数返回的是字节数目。

标准库中有四个包对字符串处理尤为重要：bytes、strings、strconv 和 unicode 包。strings 包提供了许多如字符串的查询、替换、比较、截断、拆分和合并等功能。

bytes 包也提供了很多类似功能的函数，但是针对和字符串有着相同结构的 []byte 类型。因为字符串是只读的，因此逐步构建字符串会导致很多分配和复制。在这种情况下，使用 bytes.Buffer 类型将会更有效，稍后我们将展示。

strconv 包提供了布尔型、整型数、浮点数和对应字符串的相互转换，还提供了双引号转义相关的转换。

unicode 包提供了 IsDigit、IsLetter、IsUpper 和 IsLower 等类似功能，它们用于给字符分类。每个函数有一个单一的 rune 类型的参数，然后返回一个布尔值。而像 ToUpper 和 ToLower 之类的转换函数将用于 rune 字符的大小写转换。所有的这些函数都是遵循 Unicode 标准定义的字母、数字等分类规范。strings 包也有类似的函数，它们是 ToUpper 和 ToLower，将原始字符串的每个字符都做相应的转换，然后返回新的字符串。

## Constants
常量表达式在编译器计算，每种常量的潜在类型都是基础类型。

常量声明语句定义了常量的名字，常量值不能被修改。

    const pi = 3.1415

或者

    const (
        e = 2.71
        pi = 3.14
    )

### iota 常量生成器
常量声明可以使用 iota 常量生成器初始化，用于生成一组相似规则初始化的常量，const 语句中，第一个声明常量所在行，iota 会被置为 0，然后每行加一。

    type Weekday int

    const (
        Sunday Weekday = iota
        Monday
        Tuesday
        Wednesday
        Thursday
        Friday
        Saturday
    )
