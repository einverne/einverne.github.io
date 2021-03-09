---
layout: post
title: "设计模式之创建模式"
aliases: "设计模式之创建模式"
tagline: ""
description: ""
category: 学习笔记
tags: [design-pattern, factory, singleton, builder, creational-pattern, ]
last_updated:
---

本文主要归纳设计模式中的创建模式 (creational pattern)，主要包括了工厂模式，单例多例，建造者模式，和原型模式等。

创建模式是指对象的实例化过程，这些模式都提供了一种将对象实例化从客户端分离的方法。

为什么要有创建模式，这也符合开闭原则，Java 自带的 new Object() 实例化对象没有任何问题，问题在于修改，一旦当具体实例涉及变化，那么就必须修改实例自身，不符合开闭原则，所以才有这么多的创建模式。将对外暴露的接口抽象起来，将对象创建的方式封装，对外接口尽量减少。

## 简单工厂
主要分为三个部分，工厂，抽象产品，具体产品。

工厂直接提供具体产品，也就是直接创建具体类。

工厂模式将产品的生产和其提供的功能隔离。

## 多态工厂方法
又称为工厂方法。

> The Factory Method Pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

分为四个部分，抽象工厂，具体工厂，抽象产品，具体产品。将产品实例化放到具体工厂子类中实现，抽象出工厂的一般方法。通常一个具体工厂产出一种具体产品。

因此在添加具体产品后不需要修改具体工厂类，而只需要相应的添加具体工厂来产出产品。

## 抽象工厂
和多态工厂相同，包含四个部分。

> The Abstract Factory Pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes.

**抽象工厂**和**工厂方法**的区别在于，抽象工厂模式中，一个工厂可以提供多个抽象产品。在工厂方法模式中，由“具体工厂”决定提供哪一类具体产品；在抽象工厂中，由客户端决定返回哪一类产品。

## 单例 {#singleton}
至始至终只有一个实例。

### Eager initialization
The instance of Singleton is created at the time of class loading.
```java
public class EagerSingletion {
	private static final EagerSingletion instance = new EagerSingletion();
	private EagerSingletion() {}
	public static EagerSingletion getInstance() {
		return instance;
	}
}
```

在 Singleton 不占用太多资源时可以使用 `static` 在类加载时使用这个方法。但是对于大对象这个方法就不是很好。

### Static block initialization
Use static block to create instance

```java
public class StaticBlockSingleton {
	private static StaticBlockSingleton instance = null;
	private StaticBlockSingleton() {}
	static {
		try {
			instance = new StaticBlockSingleton();
		} catch(Exception e) {
			throw new RunTimeException("Exception creating singleton");
		}
	}

	public static StaticBlockSingleton getInstance() {
		return instance;
	}
}
```

使用 `static` 字段和 `static` block 定义的实例都是在实例对象被使用之前就已经创建。

### Lazy Initialization
在第一次使用时创建。

```
public class LazyInitialSingleton {
	public static LazyInitialSingleton instance = null;
	private LazyInitialSingleton() {}
	public static LazyInitialSingleton getInstance() {
		if (instance == null) {
			instance = new LazyInitialSingleton();
		}
		return instance;
	}
}
```

但是这个方法在单线程中是没有问题的，如果是多线程同时调用 `getInstance` 方法，就可能创建多个实例。

### Thread Safe Singleton

```
public class ThreadSafeSingleton {
	public static ThreadSafeSingleton instance = null;
	private ThreadSafeSingleton() {}
	public static synchronized ThreadSafeSingleton getInstance() {
		if (instance == null) {
			instance = new ThreadSafeSingleton();
		}
		return instance;
	}
}
```

`synchronized` 作用于静态方法等同于对类加锁。

### Double checked Singleton

```
public static ThreadSafeSingleton getInstance () {
	if (instance == null) {
		synchronized (ThreadSafeSingleton.class) {
			if (instance == null) {
				instance = new ThreadSafeSingleton();
			}
		}
	}
	return instance;
}
```

### Bill Pugh Singleton
使用内部静态类

```
public class Singleton() {
	private Singleton() {}
	private static class Helper {
		private static final Singleton INSTANCE = new Singleton();
	}

	public static Singleton getInstance() {
		return Helper.INSTANCE;
	}
}
```

这里涉及到类加载机制，在类加载 Singleton 时，内部静态类是不会被加载的。只有当有调用 `getInstance()` 方法，实例才会初始化。

## 多例
一个类存在多个自身的实例，并且多例类需要自己创建，管理自己的实例，并向外提供自己的实例。

常见的线程池，数据库连接池就是多例的使用案例。

## 建造者模式 {#builder}
当需要创建的对象，创建步骤比较复杂时，可以将对象的"创建"和"表示"分离。Builder 模式允许用户将复杂对象的创建封装，允许使用者多个步骤来构造对象。

建造者模式包括：导演，抽象建造者，具体建造者，和产品

建造者模式的使用场景：

- 对象内部结构复杂，比如包含不同零件的汽车类，比如一个复杂的邮件类
- 对象内部属性有依赖，需要按照某一些顺序进行赋值
- 对象创建过程依赖系统其他对象，而这些依赖的对象不易获取

优点：

- 封装了内部构造细节
- 隐藏了内部表示
- 构造对象内部实现可以灵活改动，客户端只通过抽象接口来构造该对象

缺点：

- 相较于工厂模式，客户端需要额外的知识来创建对象

## 原型模式 {#prototype}
通过原型指明要创建的对象类型，然后通过该原型创造更多的对象实例。Java 中可以通过 `clone()` ，或者反序列化来实现。原型模式允许客户端在不知道对象具体内部细节的情况下创建实例。

一个比较具体的使用场景，比如要对比两个对象修改前后的差异，可以在修改前复制一个对象实例，然后修改之后对比。再比如一次比较重的数据库查询，可以缓存该对象，再下一次请求到来时直接返回该对象的复制。

一些比较适合的场景：

- 当创建一个实例比较昂贵或者复杂时

原型模式的优点：

- 对客户端隐藏了构造对象的复杂细节
- 对客户端提供了一种在不确定类型情况下创建对象实例的方法
- 某一些场景下复制对象实例要比创建来的更有效率

缺点：

- 对于一些只有少量对象的系统来说并不太需要
- 每一个原型类的子类都需要实现 clone 方法，有些时候创建对象拷贝并不是非常轻松

## reference

- <https://www.geeksforgeeks.org/prototype-design-pattern/>
- <http://wangkuiwu.github.io/2012/10/17/design_pattern/>
- <https://www.tutorialspoint.com/design_pattern/prototype_pattern.htm>
- 《Head First Design Patterns》
- <https://www.journaldev.com/1377/java-singleton-design-pattern-best-practices-examples>
