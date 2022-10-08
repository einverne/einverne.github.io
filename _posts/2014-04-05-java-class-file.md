---
layout: post
title: "Java 字节码 类文件结构"
tagline: ""
description: ""
category: 学习笔记
tags: [java, class , cross-platform, bytecode, ]
last_updated:
---

Java 文件编译后会生成 `.class` 二进制文件，这个文件以 8 字节为单元组织。在 Class 文件中定义了一些数据类型，u1,u2,u4,u8 分别代表 1 个字节、2 个字节、4 个字节、8 个字节的无符号数。

Class 文件像一张大表格，以一定的格式记录。

	ClassFile
	{
		 magic_number;
		 minor_version;
		 major_version;
		 constant_pool_count;
		 constant_pool[];
		 access_flags;
		 this_class;
		 super_class;
		 interfaces_count;
		 interfaces[];
		 fields_count;
		 fields[];
		 methods_count;
		 methods[];
		 attributes_count;
		 attributes[];
	}


## Magic Number
每个 Class 文件头 4 个字节称为 Magic Number，用于确认该文件是否能被虚拟机接受。

![java class magic number](/assets/java-class-file-magic-number.png)

Class 文件的 Magic Number 是 `0xCAFEBABE` .

> apt install ghex

## Class 版本
接着 Magic Number 后面 4 个字节就是 Class 文件的版本号

- 第 5，6 个字节是次版本号 Minor Version
- 第 7，8 个字节是主版本号 Major Version

Java 版本号从 45 开始，JDK 1.1 后每个 JDK 大版本发布主版本加 1，高版本的 JDK 向下兼容以前的 Class 文件，但不能运行以后的版本。

看到上图里面，5，6 个字节 0x0000，主版本号 0x0033，就是十进制的 51，说明这个 Class 文件可以被 JDK 1.7 或者以上版本虚拟机执行。

## 常量值 constant_pool
在主版本号后面是常量池入口，所有的变量，方法都会在该常量池有一份引用。因为常量值数量不固定，所以常量值入口会放置 u2 类型数据，表示常量池容量计数 constant_pool_count ，这个容量计数是从 1 开始。

常量池主要存放两大类常量：

- 字面值 Literal
- 符号引用 Symbolic References , 包含

		- 类和接口的全限定名 Fully Qualified Name
		- 字段名和描述符 Descriptor
		- 方法的名称和描述符

常量池中每一项都是一个表

第一位是 u1 类型标志位，取值 1 到 12，缺少标志为 2 的数据类型，该标志表示当前常量属于哪种类型。

类型      | 标志            | 描述
----------|-----------------|-------------------
CONSTANT_Utf8_info   | 1  | UTF-8 编码字符串
CONSTANT_Integer_info   | 3  | 整型字面值
CONSTANT_Float_info   | 4  | 浮点
CONSTANT_Long_info   | 5  | 长整型
CONSTANT_Double_info   | 6  | 双精度浮点
CONSTANT_Class_info   | 7  | 类或者接口符号引用
CONSTANT_String_info   | 8  | 字符串类型
CONSTANT_Fieldref_info   | 9  | 字符的符号引用
CONSTANT_Methodref_info   | 10  | 类中方法的符号引用
CONSTANT_InterfaceMethodref_info   | 11  | 接口中方法的符号引用
CONSTANT_NameAndType_info   | 12  | 字段或方法的部分符号引用

如果看二进制的 Class 文件比较麻烦，JDK 中提供了了分析 Class 文件字节码的工具：`javap`

	javap -verbose filename.class

可以看到类似如下的内容：

	Constant pool:
	   #1 = Methodref          #11.#36        // java/lang/Object."<init>":()V
	   #2 = Fieldref           #37.#38        // java/lang/System.out:Ljava/io/PrintStream;
	   #3 = String             #39            // hello
	   #4 = Methodref          #40.#41        // java/io/PrintStream.println:(Ljava/lang/String;)V


## 访问标志 access flags
常量池结束后接 2 字节代表访问标志 access_flag. 用于识别类或接口层次的访问信息，包括 Class 是类还是接口，是否定义为 public，是否定义为 abstract 类型，类是否被声明为 final .

## 类索引 this_class 父索引 super_class 接口索引 interfaces
Class 文件由这个三个数据来确定类的继承关系。

- 类索引确定类的全限定名
- 父类索引确定这个父类的全限定名，除 java.lang.Object 外，所有 Java 类的父类索引都不是 0
- 接口索引描述类实现了哪些接口，按照实现的顺序排列

类索引、父类索引和接口索引都按照顺序排列在访问标志后，类索引和父类索引用两个 u2 类型索引值表示，各自指向 CONSTANT_Class_info 的类描述符常量，通过 CONSTANT_Class_info 类型的常量中的索引值来找到定义在 CONSTANT_Utf8_info 类型的常量中的全限定名字符串。

接口索引，入口是 u2 类型数据的接口计数 interfaces_count ，表示索引表容量，如果没有实现任何接口，则计数器为 0。

## 字段表集合 field info
用于描述接口或者类中声明的变量，包括类级变量或者实例级变量，但不包括方法内部声明变量。

- 字段作用域 public private protected
- 类级变量还是实例变量 static
- 可变性 final
- 并发可见性 volatile，是否强制从主存读写
- 可否序列化 transient
- 字段基本类型，对象，数组
- 字段名称

## 方法表集合
方法表结构和字段表相同，依次包括了访问标志 access flags， 名称索引 name index, 描述符索引 descriptor index ， 属性表集合 attributes

## 属性表集合 attribute info
与 Class 文件中其他数据项目要求严格的顺序、长度和内容不同，属性表集合限制宽松，不要求属性表具有严格顺序，只要不与已有的属性名重复，任何人实现的编译器都可以向属性中写入自己定义的属性信息，Java 虚拟机在运行时会忽略掉它不认识的属性。


