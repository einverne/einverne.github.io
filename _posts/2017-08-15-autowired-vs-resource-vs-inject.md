---
layout: post
title: "@Autowired vs @Resource vs @Inject 的区别"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, java, web, design-pattern, spring-mvc, spring-boot, ]
last_updated:
---

为了实现依赖注入 DI 而引入，Java 提供 `javax.annotation.Resource` , `javax.inject.Inject` 注解，Spring 框架提供了 `org.springframework.beans.factory.annotation.Autowired` 。依赖注入（Denpendency Injection，DI）， 控制反转（Inversion of Control, IoC），主要的目的是去除代码耦合。具体可参考其他资料。

## 使用

Spring 注入的方式有多种，可以写在 field 上，可以写在 setter 方法上，可以写在 constructor 上。


 	// field
	@Autowired
	private UserDao userDao;

	// constructor
	@Autowired
	public UserService(UserDao userDao) {
		this.userDao = userDao;
	}


	@Resource
	private UserDao userDao;

配置

	<context:annotation-config/>

	or

	<context:component-scan base-package="需要自动扫描的包" />


## 具体解释

Annotation     |  Package         | Source
--------------|-------------------|-----------
@Autowired    | org.springframework.beans.factory.annotation.Autowire  | Spring
@Resource     | javax.annotation.Resource | Java
@Inject       | javax.inject.Inject | Java  需额外依赖

`@Autowired`: Spring 特有的注解，@Autowired 通过**类型**来注入，比如通过类的类型，或者类的接口来注解 field 或者 constructor。为了防止在项目中实现同一个接口，或者一系列子类，可以使用 @Qualifier 注解来避免歧义。默认情况下 bean 的名字就是 qualifier 的值。 尽管你可以按照约定通过名字来使用 @Autowired 注解，@Autowired 根本上还是类型驱动的注入，并且附带可选的语义上的 qualifiers.

@Inject: 该注解基于 [JSR-330](https://jcp.org/en/jsr/detail?id=330), @Inject 注解是 Spring @Autowired 注解的代替品。所以使用 Spring 独有的 @Autowired 注解时，可以考虑选择使用 @Inject. @Autowired 和 @Inject 的不同之处在于是否有 required 属性，@Inject 没有 required 属性，因此在找不到合适的依赖对象时 inject 会失败，而 @Autowired 可以使用 required=false 来允许 null 注入。

使用 @Inject 需要添加如下依赖：

	<dependency>
		<groupId>javax.inject</groupId>
		<artifactId>javax.inject</artifactId>
		<version>1</version>
	</dependency>


Advantage of @Inject annotation is that rather than inject a reference directly, you could ask @Inject to inject a Provider. The Provider interface enables, among other things, lazy injection of bean references and injection of multiple instances of a bean. In case we have few implementation of an interface or a subclass we can narrow down the selection using the @Named annotation to avoid ambiguity. @Named annotation works much like Spring’s @Qualifier

`@Resource`: JDK 1.6 支持注解，[JSR-250](https://jcp.org/en/jsr/detail?id=250) 引入。@Resource 和 @Autowired  @Inject 类似，最主要的区别在于寻找存在的 Bean 注入的路径不同。`@Resource` 寻找的优先顺序为

- 1) 优先通过名字 (by name)
- 2）其次是类型 (by type)
- 3）再次是 qualifier(by qualifier)

而 `@Autowired` and `@Inject` 寻找的顺序为

1. 通过类型寻找
2. 通过 qualifier
3. 最后通过名字寻找

@Resource 如果没有指定 name 属性，当注解标注在 field 上，默认取字段名称作为 bean 名称寻找依赖对象；当标注在属性 setter 方法上，默认取属性名作为 bean 名称寻找依赖。如果没有指定 name 属性，并且按照默认名称找不到依赖对象时，回退到类型装配。




## 扩展

<https://github.com/google/guice/>

Google 提供的轻量级依赖注入框架，支持 Java 6 及以上

<http://square.github.io/dagger/>

为 Android 和 Java 设计的 DI


## reference

- <https://stackoverflow.com/questions/4093504/resource-vs-autowired>
- <https://stackoverflow.com/questions/20450902/inject-and-resource-and-autowired-annotations>
- <http://www.baeldung.com/spring-annotations-resource-inject-autowire>
- <https://jcp.org/en/jsr/detail?id=250>
- <http://blogs.sourceallies.com/2011/08/spring-injection-with-resource-and-autowired/>
