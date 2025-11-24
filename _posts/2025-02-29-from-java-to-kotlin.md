---
layout: post
title: "Java 程序员视角的 Kotlin 语法区别"
aliases:
- "Java 程序员视角的 Kotlin 语法区别"
tagline: ""
description: ""
category: 经验总结
tags: [java, kotlin, programming-language, jvm, dart, ]
create_time: 2025-03-05 15:32:03
last_updated: 2025-03-05 15:32:03
dg-home: false
dg-publish: false
---

Kotlin 和 Java 作为 JVM 生态中两大主流编程语言，在语法特性、开发效率和适用场景上存在显著差异。Kotlin 凭借现代化设计解决了 Java 的许多痛点，而 Java 凭借成熟生态和广泛支持仍是企业级开发的主力。最近有一些项目想要使用 Kotlin 实现，所以本文正好来总结一下从 Java 程序员转到 Kotlin 程序员需要注意的一些语言细节。

## Java 转换到 Kotlin

Kotlin 采用极简语法设计，相比 Java 减少了大量样板代码量

- 无需分号结束语句
- 支持类型推断，智能转换
- equals, hashCode, toString 方法的自动生成
- get set 方法的自动生成
- 顶级函数
- 扩展函数
- Null-safety 空安全

## 类型声明

Java 中存在基本数据类型，引用数据类型。但是在 Kotlin 中一切都是对象，没有基本数据类型。

### 类型声明反转

在变量声明方面有一些差异，Java 中类型在变量前，Kotlin 中类型在变量之后，并且使用冒号分割。

```java
String name = "Kotlin";
final int age = 30;
List<Integer> list = new ArrayList<>();
```

更重要的是，在 Kotlin 中支持类型推断，允许编译器自动推断变量类型，大大减少样板代码。

```kotlin
val name: String = "Kotlin"
val name = "Kotlin"           // 不可变变量 相当于 final
val list = ArrayList<String>()

var age = 30； // 可变变量
```

Kotlin 使用 `val`（不可变）和 `var`（可变）关键字来声明变量，这比 Java 的 final 关键字更加明确。

### 原始类型数组

```kotlin
val intArray = IntArray(10)

val intArr: IntArray = intArrayOf(1，2，3，4)
val doubleArr: DoubleArray = doubleArrayOf(1.1, 22.2)
val booleanArr: BooleanArray = booleanArrayOf(true, false, true)
```

构造函数创建指定大小的数组

```
val intArr = IntArray(5) // create Int array size of 5, default 0
val doubleArr = DoubleArray(3) // create Double array size of 3, default 0.0
val squares = IntArray(5) { i -> i * i; } // [0, 1, 4, 9, 16]
```

### 不可变集合创建

Kotlin 提供专门的工厂函数来创建不可变集合。

```
val readOnlyList = listOf(1, 2, 3)
var stringList = liftOf("a", "bc", "def")

val s = setOf(1, 2, 3)

var map = mapOf(1 to "a", 2 to "b", 3 to "c")
var map2 = mapOf(Pair("key1", "value1"), Pair("key2", "value2"))
```

可变集合转为不可变集合

```
val mutableList = mutableListOf("Jason", "Jack", "Jacky")
mutableList.add("狗蛋")

// 转换为不可变集合
val immutableList = mutableList.toList()
```

### Null-safety

Kotlin 最重要的特性 Null-safety，通过类型控制空引用，明确要求开发者指定变量是否可以为空。

```kotlin
var nonNull: String = "value" // 编译时强制非空
var name: String? = null     // 可空类型

val length = nonNull.length // 无需判空

// 安全调用
val nameLen = name?.length

// Elvis 操作符
val l = name?.length ?: -1
```

如果要声明可空类型，必须在类型后面添加 `?` 符号。

安全调用链

```
user?.address?.street?.length ?: 0
```

### 平台类型处理

```
val javaList: List<String!> = JavaClass.getList()
```

## 分支语句

在 Kotlin 中，when 是一个表达式，用于替代传统的 switch 语句。它可以根据条件匹配执行不同的代码块。when 的语法如下。

```
val result = when (value) {
    1 -> "Value is 1"
    2 -> "Value is 2"
    else -> "Value is unknown"
}
```

- value 是要匹配的变量。
- 每个分支使用 -> 指定匹配条件和对应的结果。else 是默认分支，类似于 default，当没有其他分支匹配时执行。

匹配多个值:  

```
when (value) {
    1, 2 -> println("Value is 1 or 2")
    else -> println("Value is unknown")
}
```

使用表达式或函数:  

```
when {
    value < 0 -> println("Negative value")
    value == 0 -> println("Zero")
    value > 0 -> println("Positive value")
}
```

返回值: when 可以作为表达式返回值。  

```
val message = when (value) {
    1 -> "One"
    2 -> "Two"
    else -> "Other"
}
```

类型检查: 可以结合 is 关键字进行类型检查。  

```
when (obj) {
    is String -> println("Object is a String")
    is Int -> println("Object is an Int")
    else -> println("Unknown type")
}
```

范围匹配: 使用 in 关键字匹配范围。  

```
when (value) {
    in 1..10 -> println("Value is in range 1 to 10")
    !in 10..20 -> println("Value is not in range 10 to 20")
    else -> println("Value is unknown")
}
```

注意事项
- when 表达式必须覆盖所有可能的分支，否则需要提供 else 分支。
- 它可以用于任何类型的变量，而不仅仅是数字。

## 函数定义

### 函数定义优化

函数声明在两种语言中有明显差异。Kotlin 使用 fun 关键字，支持表达式函数体，并且返回类型是可选的

在 Java 中

```java
public static int sum(int a, int b) {
    return a + b;
}
```

在 Kotlin 中

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

fun max(a: Int, b: Int) = if (a > b) a else b
```

### 流式处理

```
list.filter { it > 5}
    .map { it * 2 }
    .take(10)
```

### 相等检查

```
Kotlin区分结构相等（==）和引用相等（===），而Java的==只检查引用相等
```

```kotlin
val user1 = User("Jane", "Doe")
val user2 = User("Jane", "Doe")
val structurallyEqual = user1 == user2    // true，调用equals()
val referentiallyEqual = user1 === user2  // false，检查引用
```

## 接口
Kotlin 使用 interface 关键字定义接口

```
interface MyInterface {
    fun bar() // 未实现方法
    fun foo() {   // 默认实现
        println("foo")
    }
}
```

支持属性

```
interface Behavior {
    val canWalk: Boolean // 抽象属性
    val wings: String
        get() = "wings" // 提供访问器实现
}
```

可以使用逗号分隔，实现多个接口

```
class MyClass : InterfaceA, InterfaceB {
    // 实现所有接口的抽象方法
}
```

当实现多个接口存在同名方法时，Kotlin 提供了明确的冲突解决

```
interface A {
    fun foo() { print("A") }
}

interface B {
    fun foo() { print("B") }
}

class C : A, B {
    override fun foo() {
        super<A>.foo() // 调用接口 A 的实现
        super<B>.foo() // 调用接口 B 的实现
    }
}
```

## 类

### 类属性访问

会自动生成 get set 方法。

### 主构造函数

Kotlin 允许类名后直接定义构造函数。

```kotlin
// Kotlin - 主构造函数
class Person(val name: String, var age: Int)

// Java - 传统构造函数
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

其他构造函数

```kotlin
class Person(val name: String) {
    constructor(name: String, age: Int) : this(name) {
        // 次构造函数实现
    }
}
```

### 类继承
Kotlin 中所有的类都有一个共同的超类 Any，注意 Any 不是 java.lang.Object。

默认情况下 Kotlin 的类是 final 的，不能被继承，如果要让类能继承必须使用 open 关键字

```
open class Base
```

继承语法使用 `:` 来表示

```
open class Person(val name: String, val age: Int)

class Student(name: String, aget: Int, val studentId: String) : Person(name, age)
```

如果派生类没有主构造函数，每个次构造函数必须使用 super 关键字初始化基类

```
class MyView : View {
    constructor(ctx: Context) : super(ctx)
    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

### 方法和属性重写
父类的方法需要使用 open 修饰才能被重写，子类使用 override 关键字重写方法

```
open class Person {
    open fun walk() {
        println("慢慢走")
    }
}

class Doctor : Person() {
    override fun walk() {
        println("快走")
    }
}
```

同样属性也需要 open 才能被重写。

```
open class Animal {
    open val species: String = "Unknown"
}

class Dog : Animal() {
    override val species: String = "Canine"
}
```

Kotlin 鼓励开发者更加谨慎地设计类的继承关系，避免意外的继承问题，提高代码的安全性和可维护性。

### 数据类

Kotlin 的`data class`关键字自动生成`equals()`、`hashCode()`、`toString()`等方法，大大减少样板代码。

```
data class User(val name: String, val age: Int?)
```

数据类自动生成 equals() 和 hashCode() 方法

### Sealed 类

sealed 类是拥有特定数量子类的类。

- Sealed 类所有子类都必须与密封类在同一文件定义
- 子类的子类可以定义在任何地方
- Sealed 类没有构造函数，不可以直接实例化，只能实例化内部子类。

```
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val msg: String) : Result()
}
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

### 静态成员替代

Kotlin 没有静态成员概念，没有 static 关键字，而是使用 companion object，顶级函数，扩展函数或者 `@JvmStatic` 注解来代替 Java 静态成员。

Companion Objects 允许在类内部定义类级别的函数和属性。伴生对象本质上是一个类关联的单例对象，可以访问类的私有成员。

```kotlin
class MyClass {
    companion object Factory {
        val companionProperty: String = "Companion Property"

        fun create(): MyClass = MyClass()

        fun companionFunction() {
            println("Companion Function")
        }
    }
}
```

伴生对象的成员可以直接通过类名访问，无需创建类的实例

```kotlin
// 访问伴生对象的属性和方法
val propertyValue = MyClass.companionProperty
val instance = MyClass.create()
MyClass.companionFunction()
```

伴生对象的名称可以省略，默认的名称是 Companion。

```kotlin
class MyClass {
    companion object {
        val foo: String = "Hello"
        fun sayHello() {
            println("Hello, World!")
        }
    }
}

// 访问方式
println(MyClass.foo)
MyClass.sayHello()
```

伴生对象功能上类似于 Java 静态成员，但是实际上提供了伴生对象实例的成员，这使得伴生对象可以实现接口，提供更大的灵活性。

### 顶级函数

顶级函数是定义在包级别，不属于任何类，对象，接口的函数。

```
fun topLevelFunction() {
    println("这是一个顶级函数")
}

// 直接调用，无需类实例
fun main() {
    topLevelFunction()
}
```

从编译器角度来看，Kotlin 顶级函数本质上被编译为 Java 的静态方法，编译器会自动生成一个文件名加上 Kt 后缀的 Java 类来容纳这些静态方法。
