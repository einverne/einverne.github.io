---
layout: post
title: "设计模式之结构模式"
tagline: ""
description: ""
category: 学习笔记
tags: [design-pattern, java, object-orientation ]
last_updated:
---

设计模式中的结构模式可以让我们组合类或者对象形成比较大型的结构，但也能保证结构的可维护性和可扩展性。

- Adapter, Allows incompatible interfaces to work together.
- Decorator, Dynamically adds behavior to objects without altering their structure.
- Facade, Simplifies access to complex systems by providing a unified interface.
- Proxy, Controls access to an object, adding security or performance optimizations.
- Composite, Treats individual objects and compositions of objects uniformly (e.g., tree structures).


## 适配器模式 {#adapter}
适配器模式解决的问题，允许不兼容的接口一起工作（Allows incompatible interfaces to work together）。

适用场景：

- 复用一个已经存在的类，但是类提供的接口不符合使用场景，使用适配器重新定义接口
- 在不对每一个都进行子类化以匹配它们的接口的情况下，使用一些已经存在的子类

### 类适配器
类适配器把"被适配的类的 API" 转换成 "目标类的 API"。

三个角色：目标 (Target)，源 (Adaptee) 和适配器 (Adapter)

### 对象适配器
与类适配器一样，对象适配器也是把"被适配的类的 API" 转换成 "目标类的 API"。不同的是，类适配器中"Adapter 和 Adaptee 是继承关系"，而**对象适配器**中"Adapter 和 Adaptee 是关联关系 (Adapter 中存在 Adaptee 类型的成员变量）"。

适配器模式的缺点：

- 大量使用适配器容易造成系统结构混乱


```
public interface Target { void request(); }
public class Adaptee { void specificRequest() { System.out.println("Specific Request"); } }
public class Adapter implements Target {
    private Adaptee adaptee;
    public Adapter(Adaptee adaptee) { this.adaptee = adaptee; }
    public void request() { adaptee.specificRequest(); }
}
```

## 合成模式
又称为“部分 - 整体模式”，合成模式将对象组织到树结构中，可以用来描述整体与部分的关系。


## 装饰模式 {#decorate}
装饰 (Decorator) 模式又名包装 (Wrapper) 模式。装饰模式以对客户端透明的方式**扩展**对象的功能，是继承关系的一个替代方案。

Dynamically adds behavior to objects without altering their structure.

它以对客户透明的方式动态地给一个对象附加上更多的责任。换言之，客户端并不会觉得对象在装饰前和装饰后有什么不同。装饰模式可以在不使用创造更多子类的情况下，将对象的功能加以扩展。

Decorator 模式重点在于责任，在于**保持对外接口一致**的情况下扩展接口功能。这是符合开闭原则的一个模式。

[[decorator design pattern]]

```
interface Coffee { String getDescription(); double getCost(); }
class SimpleCoffee implements Coffee {
    public String getDescription() { return "Simple Coffee"; }
    public double getCost() { return 5; }
}
class MilkDecorator implements Coffee {
    private Coffee coffee;
    MilkDecorator(Coffee coffee) { this.coffee = coffee; }
    public String getDescription() { return coffee.getDescription() + ", Milk"; }
    public double getCost() { return coffee.getCost() + 1.5; }
}
```

## 代理模式 {#proxy}
代理模式给某个对象提供代理，由代理对象控制原对象的引用。

代理模式包含：抽象主题，代理主题，真实主题

- 抽象主题，声明共同接口
- 真实主题，真正内容
- 代理主题，包含一个真实主题，传递调用

注意点：

- 代理模式并不改变接口，代理模式的用意是让客户端不用在意代理的存在
- 代理类将对接口的调用转发给真实的调用，代理起到一个传递请求的作用，同时在传递请求时可以额外的添加特定操作

## 享元模式 {#flyweight}
对象结构模式，以共享的方式高效地支持大量的细粒度对象，通过共享来避免大量拥有相同内容对象的开销。

享元模式中的对象称为享元对象，享元对象分为内蕴状态和外蕴状态。内蕴对象和外蕴对象是相互独立的：内蕴状态是存储在享元对象内部，并且不会随环境改变而有所不同的；内蕴状态是可以共享。外蕴状态是随环境改变而改变，不可以共享的状态；享云对象的外蕴状态必须由客户端保存，并在享元对象被创建之后，在需要使用的时候再传入到享云对象内部。

Java 中享元模式的一个典型应用就是 String 类的实现，假设

    String a="hello";
    String b="hello";

变量 a 和 b 都被赋值 "hello" 那么这个字面常量会存在常量池中，实际上是同一个对象。

享元模式分为"单纯享元模式" 和 "复合享元模式"。

### 单纯享元模式
单纯享元模式涉及到的角色：抽象享元 (Flyweight)，具体享元 (ConcreteFlyweight)，享元工厂 (FlyweightFactory)。


### 复合享元模式

- 复合享元由单纯享元复合而成
- 复合享元实现抽象享元定义的接口


## 门面模式 {#facade}

外部与一个子系统通过统一的门面对象进行交互，门面模式提供一个高层次的接口，使得子系统更加容易使用。

比如说一个病人去医院（子系统）看病，那么需要挂号，门诊，收费，取药等等步骤，如果引入门面模式，相当于在医院增加一个引导员，由引导员负责挂号，门诊，收费，取药等等，病人只需要与引导员打交道。那么这样依赖病人就会方便很多。

门面系统由门面和子系统两个部分。

## 桥梁模式 {#bridge}
桥梁模式是对象的结构模式，桥梁模式的用意是“将抽象化 (Abstraction) 与实现化 (Implementation) 解耦合，使得二者可以独立地变化”。



一般情况下抽象化类中包含一个具体实现，通过包含关系将强关联解耦。

桥梁模式中的三个关键词：

- 抽象化，抽取出共同的、本质性的特征
- 实现，抽象化的具体实现
- 解耦合，将抽象化和具体实现之前的强耦合关系改为弱关联；所谓强关联，就是编译时已经确定的关系，比如继承关系；而弱关联则是可以动态的确定并且可以在运行时动态改变的关系，比如聚合关系

优点：

- 分离了抽象和实现，给扩展提供了灵活性
- 桥梁模式可以分别独立的扩展抽象部分和实现部分

桥梁模式一个非常典型的使用就是 JDBC 驱动器，JDBC 为所有关系型数据提供了通用界面，一个应用选择一个合适的驱动器，通过驱动器向数据库引擎发出指令，这个过程就是将抽象角色的行为委派给具体实现角色的过程。

因为 JDBC 驱动器的存在，应用系统可以不依赖数据库引擎细节而独立发展，而同时数据库引擎也可以独立于应用系统的细节而独立发展。

![jdbc driver](/assets/jdbc-driver.png)

JDBC 这种架构，将抽象部分和具体部分分离，对于应用程序而言，只要选用不同的驱动器，就可以让程序操作不同的数据库，而无需更改应用程序，从而实现在不同的数据库中的移植。对于驱动器程序而言，为不同数据库实现不同的驱动程序，并不会影响应用程序。

## reference

- <http://wangkuiwu.github.io/2012/10/24/design_pattern/>
- https://www.cnblogs.com/java-my-life/archive/2012/05/07/2480938.html
