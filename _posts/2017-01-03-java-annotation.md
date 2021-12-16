---
layout: post
title: "Java 查漏补缺之注解"
tagline: ""
description: ""
category: Java
tags: [java, annotation, interface, ]
last_updated:
---

Java 中的注解，也被称为元数据，注解是一系列元数据，它提供数据用来解释程序代码，但是注解并非是所解释的代码本身的一部分。注解对于代码的运行效果没有直接影响。

注解有许多用处，主要如下：

- 提供信息给**编译器**：编译器可以利用注解来探测错误和警告信息 `@Override`
- **编译阶段**时的处理：软件工具可以用来利用注解信息来生成代码（lombok）、Html 文档或者做其它相应处理
- **运行时**的处理：某些注解可以在程序运行的时候接受代码的提取

## 注解的形式
常用的注解 `@Override` 等等就略过，如果注解有 annotation type element declarations，可写成：

    @SuppressWarnings(value = "unchecked")
    void myMethod() { ... }

或者省略

    @SuppressWarnings("unchecked")
    void myMethod() { ... }

如果没有 annotation type element declarations，括号也能省略。如果遇到

    @Author(name = "Jane Doe")
    @Author(name = "John Smith")
    class MyClass { ... }

这样的形式，这是 Java 8 引入的新的 [Repeating Annotations](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html) 注解。

注解可以在定义时使用，包括类定义，field 定义，方法定义时。 Java 8 之后，注解也可以用在下面这些情况：

- 类实例化时

        new @Interned MyObject()

- 强制类型装换时

        myString = (@NonNull String) str;

- implements 语句

        class UnmodifiableList<T> implements
                @Readonly List<@Readonly T> { ... }

- 抛出异常时

        void monitorTemperature() throws
                @Critical TemperatureException { ... }

这种类型的注解叫做 **type annotation**，更多信息可以在[这里](https://docs.oracle.com/javase/tutorial/java/annotations/type_annotations.html) 查看。

## 定义注解
看上去很像接口，下面是 JDK 中自带的 `Override` 注解

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.SOURCE)
    public @interface Override {
    }

定义自己的注解

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface TimeCost {
        public boolean enabled() default true;
    }

注解的属性也叫做 annotation type element declarations，看起来像方法，但是不是。注解**只有 annotation type element declarations**，没有方法。注解的 annotation type element declarations 在注解的定义中以“无形参的方法”形式来声明，其方法名定义了该 annotation type element declarations 的名字，其返回值定义了该 annotation type element declarations 的类型。

## 元注解
Java 中有如下元注解 (meta-annotation)，可以理解成定义注解的注解。

注解名字 | 解释
---------|--------
@Target  | 定义的注解可以用于什么地方，比如类型上，方法上，字段上等等，详见 ElementType 枚举
@Retention | 在什么级别保存该注解信息，比如常见的运行时，详见 RetentionPolicy 枚举
@Document | 将注解包含在 Javadoc 中
@Inherited | 允许子类继承父类中的注解
@Repeatable | 表示该注解可以在同一个定义地方被多次使用

前四个注解是 Java 5 引入，后 Java 8 引入了 [Repeating Annotations](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html).

## Repeating Annotations
可重复的注解是 Java 8 引入的内容，为什么需要可重复的注解呢？举个官方文档上的例子，比如说定义了一个定时任务，有两种方式来驱动

    @Schedule(dayOfMonth="last")
    @Schedule(dayOfWeek="Fri", hour="23")
    public void doPeriodicCleanup() { ... }

亦或是在类上定义权限

    @Alert(role="Manager")
    @Alert(role="Administrator")
    public class UnauthorizedAccessException extends SecurityException { ... }

为了实现可重复的注解，在注解定义时需要添加 `@Repeatable` 元注解

    import java.lang.annotation.Repeatable;

    @Repeatable(Schedules.class)
    public @interface Schedule {
      String dayOfMonth() default "first";
      String dayOfWeek() default "Mon";
      int hour() default 12;
    }

在 `@Repeating` 元注解括号中需要定义 container annotation，这个 container annotation 是 Java 编译器生成用来存储可重复注解的。在例子中，container annotation type 就是 `Schedules`，因此可重复注解 `@Shedule` 就被保存在 `@Schedules` 中。

定义 container annotation type 必须要包含一个 `value` 变量，这个变量是一个包含注解的数组。

    public @interface Schedules {
        Schedule[] value();
    }

## 获取解析注解
通过反射获取注解有很多方法，之前的 `AnnotatedElement.getAnnotation(Class<T>)` 方法维持不变，依然返回一个注解。或者在 JAVA 8 以后，可以通过 `AnnotatedElement.getAnnotationsByType(Class<T>)` 来一次性获取多个注解。

## reference

- <https://docs.oracle.com/javase/tutorial/java/annotations/>
