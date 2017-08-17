---
layout: post
title: "Java enum 相等比较 == or equal"
tagline: ""
description: ""
category: 学习笔记
tags: [Java, enum, ]
last_updated: 
---

能否使用 `==` 来针对 enum 来比较？

答案是：YES, 枚举谨慎的实例化管理允许使用 `==` 来进行比较，[JLS 8.9 Enums](https://docs.oracle.com/javase/specs/jls/se7/html/jls-8.html#jls-8.9) 中有Java 语言的规范定义：

> 枚举类型除了定义时的枚举常量外没有其他实例
>
> 如果显示的实例化枚举类型，会产生编译时异常。`final clone` 方法保证了 `Enum` 变量不会被 clone， 序列化的机制也保证了重复的实例在反序列化时不会创建额外的枚举变量。通过反射实例化 Enum 类型是被禁止的。所有这四种方式确保了 `enum` 类型不存在额外的实例，除了定义时的常量
>
> 因为每一个枚举常量只有一个实例，因此使用 `==` 来代替 `equals` 方法来比较两个枚举是被允许的.

## == 和 equals 的区别

使用 `==` 来代替 `equals` 也存在两点需要注意的问题。

`==` 不会抛出空指针异常

	enum Color { BLACK, WHITE };

	Color nothing = null;
	if (nothing == Color.BLACK);      // runs fine
	if (nothing.equals(Color.BLACK)); // throws NullPointerException

不过 `==` 有编译时类型检查，这一点还是很不错的

	enum Color { BLACK, WHITE };
	enum Chiral { LEFT, RIGHT };

	if (Color.BLACK.equals(Chiral.LEFT)); // compiles fine
	if (Color.BLACK == Chiral.LEFT);      // DOESN'T COMPILE!!! Incompatible types!

## 总结

对于不可变类，并且该类能够有效的控制实例数量， `==` 就是可用的。

在 Effective Java 一书中指出：

> 考虑静态工厂方法代替构造器，它使得不可变类可以确保不存在两个相等的实例，即当且仅当 a==b 时才有 a.equals(b) 成立，如果类能够保证这一点，它的客户端可以使用 `==` 来代替 equals 方法，这样可以提升性能，而枚举类型可以保证这一点。

所以在枚举比较中可以使用 `==`：

1. 可以正常工作
2. 更快
3. 运行时安全
4. 编译期也是安全的。

## reference

- <http://stackoverflow.com/questions/1750435/comparing-java-enum-members-or-equals>
