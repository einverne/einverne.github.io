---
layout: post
title: "go 语言学习笔记 1：基本介绍和使用"
tagline: ""
description: ""
category: 学习笔记
tags: [go-lang, google, java, programming, ]
last_updated:
---


## 并发
Go 语言在语言级别支持协程，叫 [[Goroutine]]。Go 语言标准库提供的所有系统调用 (syscall) 操作，当然也包括所有同步 IO 操作，都会出让 CPU 给其他 goroutine

Go 语言推荐采用“Erlang 风格的并发模型”的编程范式来实现进程间通信。

## 编码风格
要求 public 变量以大写字母开头，private 变量以小写字母开头。

花括号写法，还有错误处理，都有详细的规定。Go 语言也是至今为止学习的语言中，唯一一个将编码风格写入语言要求的。

### 变量
对于 Go 的变量，推荐使用 `驼峰式`

### 包名
包名要求小写。

## 编程哲学
Go 语言反对重载，反对继承，反对虚函数和虚函数重载，Go 提供了继承但是使用组合文法提供。

Go 语言是静态类型语言。

## 语言特性
一些值得提前了解的语言特性

- 垃圾回收
- 内置 map 类型，支持数组切片
- 函数多返回值，这一点和动态语言的 Python 有些相像
- 错误处理，Go 语言引入了 defer，panic 和 recover 三个关键字来处理错误。
- 匿名函数和闭包，函数也是值类型，可以传递
- 类型和接口，Go 语言的类型定义非常接近 C 语言中的结构 struct，但是 Go 语言没有沿袭 C++ 和 Java 传统构造一个复杂类型系统，不支持继承和重载，只支持基本的类型组合。

## 并发编程
Go 语言引入 goroutine 概念，关键字 go， 可以让函数以 goroutine 协程方式执行。Go 语言使用 channel 来实现通信顺序进程（CSP，Communicating Sequential Process）模型，方便跨 goroutine 通信。

## 安装使用

### Linux 安装
从[这里](https://golang.org/dl/) 下载，然后解压并添加环境变量

    tar -C /usr/local -xzf go1.11.1.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin

然后设置 `GOPATH` [环境变量](https://golang.org/wiki/SettingGOPATH)

安装 C 相关工具

    sudo apt-get install bison ed gawk gcc libc6-dev make

### Mac 安装

	brew install go

可以使用 `go version` 来验证是否安装成功。

### 安装目录
在安装好的 Go 目录下，有几个重要的目录

- `/bin`，可执行文件，编译器，Go 工具
- `/doc`
- `/lib`，文档模板
- `/misc`，支持 Go 编辑器相关配置
- `/os_arch` 包含标准库包对象文件 `.a`
- `/src`，源代码
- `/src/cmd`，Go 和 C 编译器和命令行脚本

### 几个重要的环境变量

- `$GOROOT` 表示该 go 的安装目录，值一般都是 `/usr/local/`, 当然，也可以安装在别的地方
- `$GOARCH` 表示目标机器的处理器架构，它的值可以是 386、amd64 或 arm
- `$GOOS` 表示目标机器的操作系统，它的值可以是 arwin、freebsd、linux 或 windows
- `$GOPATH` 采用和 $GOROOT 一样的值，但从 Go1.11 本开始，你必须修改为其它路径。它可以包含多个包含 Go 语言源码文件、包文件和可执行文件的路径，而这些路径下又必须分别包含三个规定的目录：`src` 、`pkg` 和 `bin` , 这三个目录分别用于存放源码文件、包文件和可执行文件


### Hello World

创建一个 workspace，然后开始 hello world，在 workspace 下新建 `src/hello` 目录，在目录下创建文件 `vim hello.go`


    package main

    import "fmt"

    func main() {
        fmt.Printf("hello, world\n")
    }

退出文件，在 hello 目录下执行 `go build`，此时会生成一二可执行文件 hello，执行 `./hello` 可以看到输出。

- 每个 Go 源代码文件的开头都是一个 package 声明，表示该 Go 代码所属的包
- 在包声明之后，是一系列的 import 语句，用于导入该程序所依赖的包，不得包含在源代码文件中没有用到的包，否则 Go 编译器会报编译错误
- Go 语言的 main() 函数不能带参数，也不能定义返回值。命令行传入的参数在 os.Args 变量中保存。

函数体定义

    func 函数名（参数列表）（返回值列表） {
        // 函数体
    }

如果不进行编译，也可以直接 `go run hello.go` 来运行。

## 类型系统
在 Go 语言中有四个关键字和定义类型相关，`var`,`const`,`type` 和 `func` 前两个和变量相关，第三个可以用来自定义类型，`func` 定义方法。

### 内置类型
和其他强类型语言一样，Go 语言内置一些基础类型，比如 Strings，Numbers（int32,int64,float32,float64 等等），Booleans。这些类型本质上是原始类型。当对值进行增加或者删除市，会创建一个新值。当把这些值传递给方法时，会传递一个对应值的副本。

### 引用类型
Go 语言中有下面几个引用类型：切片、映射、通道、接口和函数类型。当声明上述类型时，创建的变量被称为标头（header）值，每个引用类型创建的标头值是包含一个指向底层数据结构的指针。

header 中包含一个指针，通过复制来传递一个引用类型的值的副本。

### 结构类型
结构类型用来描述一组数据值。


> 我们对于一些事物的不理解或者畏惧，原因都在于这些事情所有意无意带有的绚丽外衣和神秘面纱。只要揭开这一层直达本质，就会发现一切其实都很简单。

## reference

- 《Go 语言编程》
- 《Go 语言实战》
- <https://tour.golang.org/basics/1>
- https://blog.opskumu.com/go-programming-language.html
