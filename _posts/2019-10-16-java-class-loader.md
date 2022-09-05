---
layout: post
title: "Java 类加载器"
tagline: ""
description: ""
category: 学习笔记
tags: [java, class, class-loader, jvm, ]
last_updated:
---

虚拟机把描述类的数据从 Class 文件加载到内存中，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型，这就是 Java 虚拟机的类加载机制。

类加载的时机，整个生命周期包括：

- Loading
- Verification
- Preparation
- Resolution
- Initialization 初始化
- Using
- Unloading

其中 Verification, Preparation, Resolution 三个部分称为 Linking。

四种情况必须对类进行“初始化”。

- 遇到 new, getstatic, putstatic 或者 invokestatic 四条字节码指令时
- 使用 java.lang.reflect 包方法对类进行反射调用时
- 初始化类时，如果发现其父类没有初始化，则需要先触发其父类的初始化 auto
- 当虚拟机启动时，用户需要指定一个执行的主类（包含 main 方法的那个类），虚拟机会初始化这个类

## Loading
虚拟机会：

- 通过一个类的全限定名获取定义此类的二进制字节流偶 iu
- 将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构
- Java 堆中生成一个代表这个类的 java.lang.Class 对象，作为方法区这些数据的访问入口

## Verification

Linking 的第一步，为了确保 Class 文件字节流中包含的信息符合当前虚拟机的要求，并且不会危害到虚拟机自身的安全。

### 文件格式验证
验证字节流是否符合 Class 文件格式规划。


### 元数据验证
字节码描述的信息进行语义分析，以保证符合 Java 语言规范。

### 字节码验证
进行数据流和控制流分析。

### 符号应用验证
符号引用验证的目的是确保解析动作能正常执行，如果无法通过符号引用验证，会抛出一个 java.lang.IncompatibleClassChangeError 异常的子类，比如 java.lang.IllegalAccessError, java.lang.NoSuchFieldError, java.lang.NoSuchMethodError 等等。


## Preparation

准备阶段正式为变量分配内存并设置类变量初始值的阶段，这些内存都将在方法区中进行分配。这个阶段中有两个容易产生混淆的概念，这个时候进行内存分配的仅仅包括类变量（被 static 修饰的变量），不包括实例变量。实例变量将会在对象实例化时随着对象一起分配在 Java 堆中。其次初始值“通常”指的是数据类型的零值。

	public static int value = 123;

那么变量 value 在准备阶段后，初始化为 0 而不是 123. 但是

	public static final int value = 123;

编译时 Javac 将会为 value 生成 ConstantValue 属性，在准备阶段虚拟机就会根据 ConstantValue 设置，将 value 值设置为 123.

## Resolution
虚拟机将常量池内的符号引用替换为直接应用的过程。

## 初始化 {#Initialization}

到初始化阶段，才真正开始执行类中定义的 Java 程序代码。

初始化阶段是执行类构造器 clinit() 方法的过程。



## 双亲委派模型
Java 虚拟机角度，只存在两种不同的类加载器：

- 启动类加载器 Bootstrap ClassLoader , C++ 实现
- 其他类加载器，Java 实现，独立于虚拟机之外，继承抽象类 java.lang.ClassLoader.

工作过程，如果一个类加载器收到类加载的请求，将这个请求委派给父类加载器完成，每一个层次的类加载器都如此，因此所有的加载请求最终都应该传送到顶层的启动类加载器中，只有当父加载器反馈无法完成这个加载请求时，子加载器才会尝试自己去加载。
实现双亲委派的代码都在 java.lang.ClassLoader 的 loadClass() 方法中。


