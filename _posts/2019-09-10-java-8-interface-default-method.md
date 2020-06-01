---
layout: post
title: "Java 查漏补缺：Java 8 中接口 default 方法"
tagline: ""
description: ""
category: 学习笔记
tags: [java, java8, interface, ]
last_updated:
---

Java 8 新特性：

- lambda expressions
- functional interfaces
- method references
- streams
- Optional

还有 interface 中的 **static** 和 **default** 方法。


## 基本使用
Java 8 允许在接口中定义默认方法。

	interface Collection {

		void add();

		default void debug(){
			System.out.println("put the key in");
		}
	}


## 为什么要引入 default 方法
和接口中定义的其他方法一样，`default` 方法默认是 public

接口是用来定义类的行为的，如果要在接口中新添加方法，那么所有实现此接口的类都需要强制的实现新添加的方法。而 `default` 方法就可以规避该问题。

## 当多个接口定义了相同 default 方法
当一个类实现的多个接口定义了相同的 default 方法，那么编译时会失败。需要子类 `Override` 该方法实现。在子类中可以通过 `Interface.super.xxx()` 方法来调用接口的 `default` 方法。

	@Override
	public void turnOnAlarm() {
		Vehicle.super.turnOnAlarm();
		Alarm.super.turnOnAlarm();
	}


## 接口中的 static 方法
除了 `default` 方法，Java 8 也允许在接口中定义 `static` 方法。

接口中的静态方法属于类，在接口中定义 `static` 方法和在类中定义一样。

因为 Java 不支持多继承，所以在遇到一些代码共享的时候，就不能通过多继承来实现，通常的做法是定义一个静态类，包含可能被多个类使用到的共同的方法，比如 Java 中的 `Collections` 类。

而通过接口中的 `static` 方法可以提高代码的 [cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science))，将相关的逻辑集中到一起，而不用另外定义一个 Object。

同样 Abstract 类也能做到，但是和抽象类的区别在于，抽象类是有 Constructors, state, behavior 的。

## 总结
理想状态下，接口不应该封装具体的行为，只应该用来定义某类型的公开接口。

但是为了弥补 Java 不能多继承而带来的一些缺点，Java 8 中引入接口的 default 和 static 方法，也肯定是 JDK 工程师仔细考量后的一个权衡。


## reference

- <https://www.baeldung.com/java-static-default-methods>
