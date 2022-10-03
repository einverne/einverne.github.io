---
layout: post
title: "Go 语言学习笔记 4：Go 语言的控制语句"
aliases:
- "Go 语言学习笔记 4：Go 语言的控制语句"
tagline: ""
description: ""
category: [ Go ]
tags: [golang, programming, control-flow, ]
create_time: 2022-03-15 11:26:14
last_updated: 2022-09-24 11:25:53
---

常见的语句：

- condition，条件
- for-loop，循环
- goto，跳转（特殊）

## statement vs expression
下文中使用 statement 和 expression 来表达一些语句的区别：

- statement, 通常用来指代一个操作，可以是赋值操作，等等
- expression 通常用来指代一个值，这个值可以是一个语句的返回，也可以是一个函数的返回

## 条件语句
通用：

```
if InitSimpleStatement; Condition {
    // do something
} else {
    // other
}
```

- 和其他语言一样 `else` 是可选的
- InitSimpleStatement 是可选的，必须是 Simple Statement，通常这部分是一个简单变量的定义或者赋值
- Condition 必须是一个返回值是 boolean 值的 **expression**，这部分可以添加 `()` 或者不加。
- 如果没有 InitSimpleStatement，那么后面的 `;` 也是可选的

举例：

```
if a < 4 {
    return 0
} else {
    return 1
}
```

更复杂一些的：

```
package main

import (
    "fmt"
    "math/rand"
    "time"
)

func main() {
    rand.Seed(time.Now().UnixNano())

    if n := rand.Int(); n%2 == 0 {
        fmt.Println(n, "is an even number.")
    } else {
        fmt.Println(n, "is an odd number.")
    }

    n := rand.Int() % 2 // this n is not the above n.
    if n % 2 == 0 {
        fmt.Println("An even number.")
    }

    if ; n % 2 != 0 {
        fmt.Println("An odd number.")
    }
}
```

## switch-case
一种特殊的条件分支语句。

```
switch i {  
case 0:  
   fmt.Printf("0")  
case 1:  
   fmt.Printf("1")  
case 2:  
   fmt.Printf("2")  
case 3:  
   fallthrough  
case 4, 5, 6:  
   fmt.Printf("4,5,6")  
default:  
   fmt.Printf("Default")  
}
```

## for loop
for 循环的格式：

```
for InitSimpleStatement; Condition; PostSimpleStatement {
    // do something
}
```

- for 循环的语法和其他语言相差不多，但不需要 `()`

```
for i := 0; i < 10; i++ {
    fmt.Println(i)
}
```

几个变种：

```
var i = 0
for ; i < 10; {
    fmt.Println(i)
    i++
}
for i < 20 {
    // do something
    i++
}
for i := 0; ; i++ {
    if i >= 10 {
        break
    }
}
```

使用 `for range` 遍历 map:

```
for key, value := range oldMap {
    newMap[key] = value
}
```

## goto 跳转语句和 Label 定义
Java 语言不支持 goto 关键字，但是 goto 是作为关键字保留了下来，但是 Java 中可以使用 `label` 关键字来达到 `goto` 的效果。

Go 语言支持 goto statement，`goto` 关键字必须跟一个 label 来表达跳转到的地方。

```
package main

import "fmt"

func main() {
    i := 0
Here: // declare a label
    fmt.Println(i)
    i++
    if i < 10 {
        goto Here // goto label
    }
}
```

需要注意的是 label 对于最里层的代码块是不可见的。

`break` 和 `continue` 关键字后面都可以接 `label`

## defer 关键字
defer 关键字会推迟方法的执行，知道外层的方法返回之后再执行。

defer 的调用的参数会立即

A defer statement defers the execution of a function until the surrounding function returns.

The deferred call's arguments are evaluated immediately, but the function call is not executed until the surrounding function returns.

```
package main

import "fmt"

func main() {
    defer fmt.Println("world")

    fmt.Println("hello")
}
```

## reference

- <https://github.com/go101/go101>
