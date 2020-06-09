---
layout: post
title: "Java 查漏补缺：函数式接口"
tagline: ""
description: ""
category: 学习笔记
tags: [java, linux, java-8]
last_updated:
---


Functional interface is a new feature Java 8 introduced. Functional interfaces provides target types for lambda expressions and method references.

	// Assignment context
    Predicate<String> p = String::isEmpty;

	// Method invocation context
    stream.filter(e -> e.getSize() > 10)...

	// Cast context
    stream.map((ToIntFunction) e -> e.getSize())...

## 特性

- 函数式接口都是表达一种行为
- @FunctionalInterface 保证了函数式接口只有一个抽象方法，但是注解的使用是不必须的

## java.util.function
相关的新的函数式接口定义在 `java.util.function` 包下 [^p]：

[^p]: <https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html>


- Consumer，一个参数，无返回，`void accept(T t)`
- Function，一个参数，一个结果，`R apply(T t)`
- Supplier，无参数，返回一个结果，`T get()`
- Predicate 接收一个参数，返回一个 boolean，`boolean test(T t)`
- BinaryOperator，接收两个相同类型参数，返回一个相同类型

## 实例

	class Test
	{
		public static void main(String args[])
		{
			// create anonymous inner class object
			new Thread(new Runnable()
			{
				@Override
				public void run()
				{
					System.out.println("New thread created");
				}
			}).start();
		}
	}

使用函数式接口后

	class Test
	{
	public static void main(String args[])
	{

		// lambda expression to create the object
		new Thread(()->
		{System.out.println("New thread created");}).start();
	}
	}


定义和使用

	@FunctionalInterface
	interface Square
	{
		int calculate(int x);
	}

	class Test
	{
		public static void main(String args[])
		{
			int a = 5;

			// lambda expression to define the calculate method
			Square s = (int x)->x*x;

			// parameter passed and return type must be
			// same as defined in the prototype
			int ans = s.calculate(a);
			System.out.println(ans);
		}
	}


## reference

- <https://www.geeksforgeeks.org/functional-interfaces-java/>
