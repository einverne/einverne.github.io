---
layout: post
title: "Java 查漏补缺之 class"
tagline: ""
description: ""
category: Java
tags: [java, linux, class, reflection, ]
last_updated:
---

Java 程序在运行时，Java 运行时系统一直对所有的对象进行所谓的运行时类型标识。Class 类封装一个对象和接口运行时的状态，当装载类时，Class 类型的对象自动创建。

Class 没有公共构造方法。Class 对象是在加载类时由 Java 虚拟机以及通过调用类加载器中的 defineClass 方法自动构造的，因此不能显式地声明一个 Class 对象。

虚拟机为每种类型管理一个独一无二的 Class 对象。也就是说，每个类（型）都有一个 Class 对象。运行程序时，Java 虚拟机 (JVM) 首先检查是否所要加载的类对应的 Class 对象是否已经加载。如果没有加载，JVM 就会根据类名查找.class 文件，并将其 Class 对象载入。Class 对象包含着类的元数据（metadata）包括类的

- name
- package
- methods
- fields
- constructors
- annotations

基本的 Java 类型（boolean、byte、char、short、int、long、float 和 double）和关键字 void 也都对应一个 Class 对象。枚举是 class，而 注解 (annotation) 是 interface。

## 获取 Class 对象

有如下方法可以获取 Class 对象

- 直接使用 MyClass.class 来获取，一般当类没有实例时可以直接通过这种方式来获取
- 如果类已经申明了实例 myClass，则可以通过实例方法 `myClass.getClass()` 方法来获取
- 通过 Class 类的静态方法 `forName()` 来获取，比如 `Class.forName("MyClass")`，传入的参数必须是接口或者类的名字

## Class 类常用方法

### getName()

`getName()` 方法返回 String，Class 对象所表示的实体（类、接口、数组类、基本类型或 void）名称。

### getConstructors()
获取类所有公开的构造函数数组，返回 `Constructor<?>[]`

### newInstance()
通常在反射中为类创建实例。`newInstance` 调用默认构造函数（无参）来初始化新建对象。

### getSuperclass()
返回表示此 Class 所表示的实体（类、接口、基本类型或 void）的超类的 Class。

### 获取构造函数

Class API                   | 列表      | 私有构造函数
----------------------------|-----------|--------------
getDeclaredConstructor()    | no        | yes
getConstructor()            | no        | no
getDeclaredConstructors()   | yes       | yes
getConstructors()           | yes       | no

### 获取成员变量

Class API           | 成员变量列表  | 继承的变量 | 私有变量
--------------------|---------------|------------|----------
getDeclaredField()  | no            | no         | yes
getField()          | no            | yes        | no
getDeclaredFields() | yes           | no         | yes
getFields()         | yes           | yes        | no

### 获取类方法

Class API           | 方法列表      | 继承的方法 | 私有方法
--------------------|---------------|------------|----------
getDeclaredMethod() | no            | no         | yes
getMethod()         | no            | yes        | no
getDeclaredMethods()| yes           | no         | yes
getMethods()        | yes           | yes        | no

综上基本看到出来：不带 `Declared` 的方法都是返回的类公开的 public 可访问的，而带 `Declared` 的方法能够访问私有。

而对于继承的方法或者变量，通过不带 `Declared` 的方法能够访问到。

### 其他方法

    public static Class<?> forName(String className)// 传入完整的“包，类”名称实例化 Class 对象
    public Constructor[] getContructors() // 得到一个类的全部的构造方法
    public Field[] getDeclaredFields()// 得到本类中单独定义的全部属性
    public Field[] getFields()// 得到本类继承而来的全部属性
    public Method[] getMethods()// 得到一个类的全部方法
    public Method getMethod(String name,Class..parameterType)// 返回一个 Method 对象，并设置一个方法中的所有参数类型
    public Class[] getInterfaces() // 得到一个类中锁实现的全部接口
    public String getName() // 得到一个类完整的“包。类”名称
    public Package getPackage() // 得到一个类的包

    public Class getSuperclass() // 得到一个类的父类
    public Object newInstance() // 根据 Class 定义的类实例化对象
    public Class<?> getComponentType() // 返回表示数组类型的 Class
    public boolean isArray() // 判断此 class 是否是一个数组

## 反射

反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性，这种动态获取的信息以及动态调用对象的方法的功能称为 java 语言的反射机制。一直以来反射技术都是 Java 中的闪亮点，这也是目前大部分框架（如 Spring/Mybatis 等）得以实现的支柱。在 Java 中，Class 类与 java.lang.reflect 类库一起对反射技术进行了全力的支持。在反射包中，我们常用的类主要有 Constructor 类表示的是 Class 对象所表示的类的构造方法，利用它可以在运行时动态创建对象、Field 表示 Class 对象所表示的类的成员变量，通过它可以在运行时动态修改成员变量的属性值（包含 private)、Method 表示 Class 对象所表示的类的成员方法，通过它可以动态调用对象的方法（包含 private)。

## reference

- Java doc
