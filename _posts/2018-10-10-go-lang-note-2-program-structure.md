---
layout: post
title: "Go 语言学习笔记 2：基本结构"
aliases: "Go 语言学习笔记 2：基本结构"
tagline: ""
description: ""
category: [ 学习笔记 , Go ]
tags: [go-lang, google, programming, ]
last_updated:
---

和大部分编程语言一样，Go 也有很多内置关键字，下面这些关键字和语法相关，不能用于定义。

```
break
case
chan
const
continue
default
defer
else
fallthrough
for
func
go
goto
if
import
interface
map
package
range
return
select
struct
switch
type
var
```

三大类预定义的关键字

| 分类       | 关键字                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Constants: | true false iota nil                                                                                                                                   |
| Types:     | int int8 int16 int32 int64 <br/> uint uint8 uint16 uint32 uint64 uintptr <br/> float32 float64 complex128 complex64 <br/> bool byte rune string error |
| Functions: | make len cap new append copy close delete complex real imag panic recover                                                                             |

上面这些可以用于定义。

## 变量定义
变量定义遵循

    var name type = expression

type （类型）可以省略

    var name, age, gender = "EV", 18, 1

或者：

```
	var (
		name   = "EV"
		age    = 18
		gender = 1
	)
```

type 会自动推导

变量只能被声明一次。

### Short Variable Declarations
定义简短的写法，只能在函数内部使用

    name := expression

这种写法可以省略 var 关键字。

注意 `:=` 是变量声明，而 `=` 是赋值。

short variable declaration 不是总是定义左边的变量，当在同一个作用域，已经声明过的变量，那么 `:=` 表现为赋值。

### 枚举
Go 语言不提供枚举类型，不过可以使用常量+iota 来模拟枚举：

```
const (
    E1 int = iota
    E2
    E3
)
```

这三个变量分别是 0,1,2

### 指针
`variable` 是包含值的一块内存区域，`pointer` 值是 `variable` 的地址，指针指向变量真正存储值的地方。不是每一个 value 都有地址，但是每一个变量都有地址。即使在不知道变量名的情况下，可以通过指针间接地读写变量相关的 value。

变量定义为 `var x int`， 表达式 `&x` 是取变量 x 的地址，会返回一个指针 `*int` ，读做指向 int 的指针。假设变量 b 来持有 `*int`:

    x := 1
    p := &x             // p, of type *int, points to x
    fmt.Println(*p)     // "1"
    *p = 2
    fmt.Println(*p)     // "2"

指针的 zero value 是 nil. 如果指针指向一个变量 那么 `p != nil` 为 true。

    var x, y int
    fmt.Println(&x == &x, &x == &y, &x == nil)

### 使用 new 方法定义
另外一种创建 variable 的方法是使用内置方法 `new`， 表达式 `new(T)` 会创建一个类型 T 的 `unnamed variable`，并且将类型 T 使用 zero value 初始化，然后返回指向该值的指针，也就是 `*T`。

    p := new(int)
    fmt.Println(*p)         // "0"
    *p = 2
    fmt.Println(*p)         // "2"

使用 new 方法创建，除了没有变量名字和普通创建没有什么差别。所以下面两个方法等同

    func newInt() *int {
        return new(int)
    }

    func newInt() *int {
        var dummy int
        return &dummy
    }

### 变量的生命周期

- 包变量一直常驻在内存到程序的结束，然后被系统垃圾回收器回收。
- 局部变量，一直生存，直到没有外部指针，或者函数退出，没有路径可以访问到该变量

## 赋值
赋值其实没啥好说的，任何语言都不可或缺。

但是 Go 支持 元组赋值 Tuple Assignment，那么就可以和 Python 一样，允许多个值一起被赋值

    x, y = y, x

## 类型定义
类型定义

    type name underlying-type

    type Celsius float64

## 包和文件
Go 语言中的包 (package) 和其他语言中的 库（libraries），或者模块（module）作用是一样的，为了支持模块化，封装和重用。

Go 中的包让我们控制内部名字是否暴露给外部。就和之前说的那样，大写字母开头的会暴露给外部。

当一个 go 文件包名为 main, 那么就是告诉 go 编译程序，这是一个可执行程序，go 编译器就会尝试将它编译为一个二进制文件。

### 导入包
导入包需要用到 `import` 关键字。

    import "fmt"
    import "net/http"

Go 编译器会去 Go 的环境变量 `GOROOT` 和 `GOPATH` 中寻找导入的内容。关于这两个环境变量可以参考上一篇文章。

Go 也支持远程导入包，比如导入 github 上的包

    import "github.com/xxx/xxx"

`go get` 工具可以递归获取依赖。

重命名导入的包

    import (
        "fmt"
        myfmt "mylib/fmt"
    )

### 初始化包

每个包都可以包含多个 `init` 函数，每个 init 函数都会在 main 函数之前执行，init 函数通常用来做初始化变量，设置包等初始化工作。

## Scope
作用域，不要和生命周期搞混，变量声明的作用域是编译期的概念，而变量的生命周期是运行时概念。

一个句法上的块 （block）指的是花括号包围的一组语句。

```
    func f() {}

    var g = "g"

    func main() {
        f := "f"
        fmt.Println(f) // "f"; local var f shadows package-level func f
        fmt.Println(g) // "g"; package-level var
        fmt.Println(h) // compile error: undefined: h
    }
```

## reference

- 《The Go Programming Language 2015》
