---
layout: post
title: "Spring AOP 笔记"
tagline: ""
description: ""
category: Spring
tags: [spring, aop, spring-mvc, ]
last_updated:
---

Spring AOP

- transaction management
- logging
- security

AOP 提供了不同于 OOP 的另一种全新的软件架构思考方式。

Spring 中有两种方式来使用 AOP

- schema-based approach, 基于 XML 方式配置
- @Aspect annotation approach, 基于注解

## Terms

- advice, actions taken by aspect at a particular **join-point**
- join-point a point during the execution of a program, in spring AOP always represents a method execution
- pointcut is a predicate or expression that matches join-point
- Advice is associated with a pointcut expression and runs at any join point matched by the pointcut
- weaving linking aspects with other application types or objects to create an advised object.

基于上面的认知，知道 join-point 可以认为是方法调用的时刻，所以 Spring 中有 5 种类型的 Advice 时机：

- Before advice, 方法执行前（无法阻止方法执行，除非抛出异常）
- After returning advice, 正常方法（无异常）返回后执行
- After throwing advice, 抛出异常时执行
- After advice, 不管方法正常或者抛出异常后执行
- Around advice, 方法调用前后

## Maven
具体的版本可以自行搜索使用。

	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context</artifactId>
		<version>4.1.4.RELEASE</version>
	</dependency>
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-context-support</artifactId>
		<version>4.1.4.RELEASE</version>
	</dependency>
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-aop</artifactId>
		<version>4.1.4.RELEASE</version>
	</dependency>
	<dependency>
		<groupId>org.aspectj</groupId>
		<artifactId>aspectjrt</artifactId>
		<version>1.6.11</version>
	</dependency>
	<dependency>
		<groupId>org.aspectj</groupId>
		<artifactId>aspectjweaver</artifactId>
		<version>1.6.11</version>
	</dependency>

## Pointcut Designators
Pointcut expression 由一个 **pointcut designator**(PCD) 开头，来告诉 Spring 什么时候匹配。Spring 支持很多个 pointcut designators ，最常见的就是 execution 了。

### execution
matching method execution join points

匹配某一个特定方法：

	@Pointcut("execution(public String info.einverne.FooDao.get(Long))")

假如要匹配 FooDao 中所有方法：

	@Pointcut("execution(* info.einverne.FooDao.*(..))")

第一个`*` 匹配所有的返回值，`(..)` 表示匹配任意数量的参数。

### within
limits matching to join points within certain types

使用 within 也能够达到上面的效果，将类型限定到 FooDao

	@Pointcut("within(info.einverne.springboot.demo.dao.FooDao)")
	public void logWithClass(JoinPoint jp) {}


或者匹配某个包下所有

	@Pointcut("within(info.einverne.springboot.demo.dao..*)")
	public void logWithPackage(JoinPoint jp) {}

### this and target

- this - limits matching to join points (the execution of methods when using Spring AOP) where the bean reference (Spring AOP proxy) is an instance of the given type
- target - limits matching to join points (the execution of methods when using Spring AOP) where the target object (application object being proxied) is an instance of the given type



`this` 匹配 bean reference 是给定类型的实例，`target` 匹配 target Object 是给定类型的实例。`this` 适用于 Spring AOP 创建 CGLIB-based proxy, `target` 适用于 JDK-based proxy.

	@Pointcut("target(info.einverne.springboot.demo.dao.BaseDao)")
	public void logBaseDao(JoinPoint jp) {}

	@Pointcut("this(info.einverne.springboot.demo.dao.FooDao)")
	public void logThis(JoinPoint jp) {}

### args
limits matching to join points (the execution of methods when using Spring AOP) where the arguments are instances of the given types

匹配特定方法参数

	// 匹配方法参数是 Long 的方法
	@Pointcut("args(Long)")
	public void argsMatchLong() {}

args 后面加类名，表示入参是该类的方法。

### @target
limits matching to join points (the execution of methods when using Spring AOP) where the class of the executing object has an annotation of the given type

	@Pointcut("@target(org.springframework.stereotype.Repository)")

### @args
limits matching to join points (the execution of methods when using Spring AOP) where the runtime type of the actual arguments passed have annotations of the given type(s)

	// 匹配所有使用了 SomeCustomAnnotation 注解的参数的方法
	@Pointcut("@args(info.einverne.SomeCustomAnnotation)")
	public void args() {}

`@args` 需要接注解的类名，表示方法运行时入参标注了指定的注解。

### @within
limits matching to join points within types that have the given annotation (the execution of methods declared in types with the given annotation when using Spring AOP)

	@Pointcut("@within(org.springframework.stereotype.Repository)")

等于：

	@Pointcut("within(@org.springframework.stereotype.Repository *)")

`@target` 和 `@within` 的区别：Spring AOP 基于 dynamic proxies, 它仅仅提供了 public, non-static 方法执行的 interception. 而使用 CGLIB proxies, 你可以 intercept package-scoped, non-static 方法。然而 AspectJ 甚至可以 intercept 方法的调用（而不仅仅是方法的执行），member field access （静态或者非静态），constructor call/execution, static class initialisation 等等。[^1]

[^1]: <https://stackoverflow.com/a/51128236/1820217>

- @within() is matched statically, requiring the corresponding annotation type to have only the **CLASS** retention
- @target() is matched at runtime, requiring the same to have the **RUNTIME** retention

### @annotation
limits matching to join points where the subject of the join point (method being executed in Spring AOP) has the given annotation

## Order
可以使用 `@Order` 来指定先后执行顺序。

## execution expression

execution 在使用时有自己的语法规则：

	execution(modifiers-pattern? return-type-pattern declaring-type-pattern?method-name-pattern(param-pattern) throws-pattern?)

	          public/private       void/String/...         com.xxxx.SomeClass     .saveUser                     throws *Exception

带问号的可以省略，其他可以支持正则。

## 组合使用
所有的 Pointcut 之间都可以使用 `&&`，`||`， `!` 来连接。

	@Pointcut("execution(public * *(..))")
	private void anyPublicOperation() {}

	@Pointcut("within(com.xyz.someapp.trading..*)")
	private void inTrading() {}

	@Pointcut("anyPublicOperation() && inTrading()")
	private void tradingOperation() {}


代码地址：<https://github.com/einverne/thrift-swift-demo/tree/master/spring-boot-demo>

## reference

- <https://howtodoinjava.com/spring-aop-tutorial/>
- <https://www.baeldung.com/spring-aop-pointcut-tutorial>
- <https://www.baeldung.com/aspectj>
- <https://docs.spring.io/spring/docs/4.3.15.RELEASE/spring-framework-reference/html/aop.html>
- <https://www.tutorialspoint.com/spring/aspectj_based_aop_appoach.htm>
