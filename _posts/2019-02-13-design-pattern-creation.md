---
layout: post
title: "设计模式之创建模式"
tagline: ""
description: ""
category: 学习笔记
tags: [design-pattern, factory, singleton, builder, ]
last_updated:
---

本文主要归纳设计模式中的创建模式 (creational pattern)，主要包括了工厂模式，单例多例，建造者模式，和原型模式。

## 简单工厂
主要分为三个部分，工厂，抽象产品，具体产品。

工厂直接提供具体产品，也就是直接创建具体类。

## 多态工厂方法
又称为工厂方法。

> The Factory Method Pattern defi nes an interface for creating an object, but lets subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

分为四个部分，抽象工厂，具体工厂，抽象产品，具体产品。将产品实例化放到具体工厂子类中实现，抽象出工厂的一般方法。通常一个具体工厂产出一种具体产品。

因此在添加具体产品后不需要修改具体工厂类，而只需要相应的添加具体工厂来产出产品。

## 抽象工厂
和多态工厂相同，包含四个部分。

> The Abstract Factory Pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes.

**抽象工厂**和**工厂方法**的区别在于，抽象工厂模式中，一个工厂可以提供多个抽象产品。在工厂方法模式中，由“具体工厂”决定提供哪一类具体产品；在抽象工厂中，由客户端决定返回哪一类产品。

## 单例
至始至终只有一个实例。

## 多例
一个类存在多个自身的实例，多例类需要自己创建，管理自己的实例，并向外提供自己的实例。

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
通过原型指明要创建的对象类型，然后通过该原型创造更多的对象实例。Java 中可以通过 `clone()` 来实现，或者反序列化。

一个比较具体的使用场景，比如要对比两个对象修改前后的差异，可以在修改前复制一个对象实例，然后修改之后对比。再比如一次比较重的数据库查询，可以缓存该对象，再下一次请求到来时直接返回该对象的复制。

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
