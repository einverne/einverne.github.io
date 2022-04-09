---
layout: post
title: "Spring AOP 笔记"
aliases: "Spring AOP 笔记"
tagline: ""
description: ""
category: Spring
tags: [spring, spring-boot, spring-framework, aop, spring-mvc, ]
last_updated:
---

Spring AOP 指的是 Aspect Oriented Programming（面向切面编程），AOP 是一种编程范式，AOP 提供了不同于 OOP 的另一种全新的软件架构思考方式，目的是为了通过分离切面问题来增加程序的模块化，同通俗的话讲就是不修改代码的情况下给程序增加额外的行为。[Spring AOP](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#aop) 就是这样一个框架，可以提高我们切面编程的效率。

Spring AOP 的几个常用的使用场景：

- 事务，transaction management
- 日志，logging
- 安全，security

Spring 中有两种方式来使用 AOP

- schema-based approach, 基于 XML 方式配置
- @Aspect annotation approach, 基于注解

## Terms
在深入 AOP 之前，先来了解一些关键性的术语：

- `join-point`: 中文通常翻译成切点，切入点，也就是切入的地方，通常是一个方法 **a point** during the execution of a program, in spring AOP always represents a method execution
- `pointcut`:is **a predicate or expression** that matches join-point
- `advice`: 具体切入的动作 **actions** taken by aspect at a particular **join-point**, is associated with a pointcut expression and runs at any join point matched by the pointcut
- `weaving`: linking aspects with other application types or objects to create an advised object.

基于上面的认知，知道 join-point 可以认为是方法调用的时刻，所以 Spring 中有 5 种类型的 Advice 时机：

- `Before advice`, 方法执行前（无法阻止方法执行，除非抛出异常）
- `After returning advice`, 正常方法（无异常）返回后执行
- `After throwing advice`, 抛出异常时执行
- `After advice`, 不管方法正常或者抛出异常后执行
- `Around advice`, 方法调用前后

## Spring 中 AOP 实现原理
Spring 中 AOP 的实现主要是通过 JDK [[动态代理]]和 [[CGLIB]] 动态代理完成。[^a]可以通过注解 [[Spring @EnableAspectJAutoProxy]] 的参数来指定。

[^a]: <https://juejin.im/post/5af3bd6f518825673954bf22>

- JDK 动态代理通过**反射**来代理类，要求被代理的类**实现一个接口**，JDK 动态代理的核心是 `InvocationHandler` 和 `Proxy` 类
- 如果目标类没有实现接口，Spring 会采用 CGLIB 来动态代理目标类，CGLIB 是一个代码生成的类库，可以在运行时动态生成类的子类，CGLIB 通过**继承**方式代理，所以如果一个类被标记为 final，是无法通过 CGLIB 来做动态代理的
 
## Spring Boot 中使用 AOP

引入依赖：

```
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.6.1</version>
</parent>
 
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
</dependencies>
```

在启动类上使用 [[Spring @EnableAspectJAutoProxy]] 注解，但其实如果不配置该注解，`spring.aop.auto` 属性也是默认开启的。

Spring Boot 中指定 CGLIB 实现 AOP。

在注解中指定：

    @Configuration
    @EnableAspectJAutoProxy(proxyTargetClass = true)
    public class AppConfig {}

或者配置属性：

    spring.aop.proxy-target-class=true

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

## 相关的注解

`@Aspect` 注解将 Java 类定义为切面，使用 `@Pointcut` 定义切点。

在不同的位置切入，可以使用 `@Before`, `@After`, `@AfterReturning`, `@Around`, `@AfterThrowing` 等等。

- `@Before`，在方法执行前执行
- `@After`，方法执行后执行
- `@AfterReturning`，方法返回结果之后执行 [[Spring AOP AfterReturning]]
- `@AfterThrowing`，异常通知，方法抛出异常之后
- `@Around`，环绕方法执行

## Pointcut Designators
如何定义切点，以及切点表达式的编写是学习 AOP 的一个重点。

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
`@annotation` 可以用来表示被注解引用的时机。

limits matching to join points where the subject of the join point (method being executed in Spring AOP) has the given annotation

比如自定义注解：

	@Retention(RetentionPolicy.RUNTIME)
	@Target(ElementType.METHOD)
	public @interface LogExecutionTime {
	}

那在定义 Pointcut 时可以使用：

	@Around("@annotation(com.package.LogExecutionTime)")
	public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {}

## Order
可以使用 `@Order` 来指定先后执行顺序。

[[Spring @Order]]

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


## 总结
代码地址：<https://github.com/einverne/thrift-swift-demo/tree/master/spring-boot-demo>

## reference

- <https://howtodoinjava.com/spring-aop-tutorial/>
- <https://www.baeldung.com/spring-aop-pointcut-tutorial>
- <https://www.baeldung.com/aspectj>
- <https://docs.spring.io/spring/docs/4.3.15.RELEASE/spring-framework-reference/html/aop.html>
- <https://www.tutorialspoint.com/spring/aspectj_based_aop_appoach.htm>
