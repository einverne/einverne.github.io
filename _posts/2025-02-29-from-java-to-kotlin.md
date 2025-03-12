---
layout: post
title: "从 Java 到 Kotlin"
aliases:
- "从 Java 到 Kotlin"
tagline: ""
description: ""
category: 经验总结
tags: [java, kotlin, programming-language, jvm, dart, ]
create_time: 2025-03-05 15:32:03
last_updated: 2025-03-05 15:32:03
dg-home: false
dg-publish: false
---

Kotlin 和 Java 作为 JVM 生态中两大主流编程语言，在语法特性、开发效率和适用场景上存在显著差异。Kotlin 凭借现代化设计解决了 Java 的许多痛点，而 Java 凭借成熟生态和广泛支持仍是企业级开发的主力。

Kotlin 在 2017 年 Google I/O 大会之后，成为了 Android 平台上潜力巨大的官方支持语言。

## Java 转换到 Kotlin

Kotlin 采用极简语法设计，相比 Java 减少约 40% 的样板代码量：

### 类型声明反转

```
String name = "Kotlin";
final int age = 30;
```

在 Kotlin 中

```
val name: String = "Kotlin"
val name = "Kotlin"           // 不可变变量 相当于 final

var age = 30； // 可变变量
```

### 方法定义优化

```
fun max(a: Int, b: Int) = if (a > b) a else b

fun sum(a: Int, b: Int): Int {
    return a + b
}
```

### 类属性访问

会自动生成 get set 方法

### 非空约束

```
var nonNull: String = "value" // 编译时强制非空
var name: String? = null     // 可空类型

val length = nonNull.length // 无需判空

// 安全调用
val nameLen = name?.length

// Elvis 操作符
val l = name?.length ?: -1
```

### 安全调用链

```
user?.address?.street?.length ?: 0
```

### 平台类型处理

```
val javaList: List<String!> = JavaClass.getList()
```

### 不可变集合创建

```
val readOnlyList = listOf(1, 2, 3)
val mutableMap = mutableMapOf("a" to 1)
```

### 流式处理

```
list.filter { it > 5}
    .map { it * 2 }
    .take(10)
```

### 数据类

```
data class User(val name: String, val age: Int)
```

数据类自动生成 equals() 和 hashCode() 方法

### Sealed 类

```
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val msg: String) : Result()
}
```

### 原始类型数组

```kotlin
val intArray = IntArray(10)
```

### 协程

简化了异步编程

```
import kotlinx.coroutines.*

fun main() = runBlocking {
  launch {
    delay(1000L)
    println("world!")
  }
  println("hello")
}
```

### 扩展函数

通过扩展函数，为现有的类添加新方法

```
fun String.addExclamation() = this + "!"

val str = "Hello".addExclamation() // Hello!
```

Kotlin 中的扩展函数的设计和我之前学习的 Dart 函数有一些相似。Dart 使用 extension 关键字定义扩展，Kotlin 直接是在函数前加上了接受者类型。

设计的目的都是为了扩展当前的类，为当前的类添加新功能，而无需修改原始类，遵循开闭原则。

一些区别

- Kotlin 的扩展函数可以定义在任何地方，包括类内部。Dart 扩展函数智能定义在顶层。
- Dart 和 Kotlin 都支持泛型扩展
- Dart 不允许在 dynamic 类型上扩展，Kotlin 允许在动态类型上扩展
- Dart 可以通过 as 关键字来解决命名冲突，Kotlin 通过导入时重命名解决冲突
- Dart 可以创建未命名扩展，Kotlin 扩展函数可见性与普通函数相同


## related

- [[Scala]]