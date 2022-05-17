---
layout: post
title: "Spring 中的 @Transactional 注解"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, spring-mvc, spring-boot, ]
last_updated:
---


Spring 中有两种不同方式实现事务 ---- annotations 和 AOP。


## 配置事务
在 Spring 3.1 及以后可以使用 @EnableTransactionManagement 注解 [^1]

[^1]: https://www.baeldung.com/transaction-configuration-with-jpa-and-spring

3.1 之前可以使用 XML 配置，注意几个 tx 的命名空间：

    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:tx="http://www.springframework.org/schema/tx" xmlns:aop="http://www.springframework.org/schema/aop"
           xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd
                        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd
                        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <tx:annotation-driven transaction-manager="transactionManager" proxy-target-class="false"/>
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

之后在类实现方法中添加 @Transactional 注解即可。

    @Transactional(propagation=Propagation.NOT_SUPPORTED)

@Transactional 有如下的属性

    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @Inherited
    @Documented
    public @interface Transactional {
      String value() default "";
      Propagation propagation() default Propagation.REQUIRED;
      Isolation isolation() default Isolation.DEFAULT;
      int timeout() default -1;
      boolean readOnly() default false;
      Class<? extends Throwable>[] rollbackFor() default {};
      String[] rollbackForClassName() default {};
      Class<? extends Throwable>[] noRollbackFor() default {};
      String[] noRollbackForClassName() default {};
    }

### 传播性
Propagation 支持 7 种不同的传播机制：

- REQUIRED：如果存在事务，则加入当前事务；如果没有事务则开启一个新的事务。
- SUPPORTS： 如果存在一个事务，加入当前事务；如果没有事务，则非事务的执行。但是对于事务同步的事务管理器，PROPAGATION_SUPPORTS 与不使用事务有少许不同。
- NOT_SUPPORTED：总是非事务地执行，并挂起任何存在的事务。
- REQUIRES_NEW：总是开启一个新的事务。如果一个事务已经存在，则将这个存在的事务挂起。
- MANDATORY：如果已经存在一个事务，支持当前事务；如果没有一个活动的事务，则抛出异常。
- NEVER：总是非事务地执行，如果存在一个活动事务，则抛出异常
- NESTED：如果一个活动的事务存在，则运行在一个嵌套的事务中。如果没有活动事务，则按 REQUIRED 属性执行。

### 隔离性
Isolation

- DEFAULT 默认
- READ_UNCOMMITTED: 未授权读取级别 以操作同一行数据为前提，读事务允许其他读事务和写事务，未提交的写事务禁止其他写事务（但允许其他读事务）。此隔离级别可以防止更新丢失，但不能防止脏读 y（一个事务读取到另一个事务未提交的数据）、不可重复读（同一事务中多次读取数据不同）、[[幻读]]（同一个事务内读取到另一个事务已提交的 insert 数据）。此隔离级别可以通过“排他写锁”实现
- READ_COMMITTED: 授权读取级别 以操作同一行数据为前提，读事务允许其他读事务和写事务，未提交的写事务禁止其他读事务和写事务。此隔离级别可以防止更新丢失、脏读，但不能防止不可重复读、幻读。此隔离级别可以通过“瞬间共享读锁”和“排他写锁”实现
- REPEATABLE_READ: 可重复读取级别 以操作同一行数据为前提，读事务禁止其他写事务（但允许其他读事务），未提交的写事务禁止其他读事务和写事务。此隔离级别可以防止更新丢失、脏读、不可重复读，但不能防止幻读。此隔离级别可以通过“共享读锁”和“排他写锁”实现
- SERIALIZABLE: 序列化级别 提供严格的事务隔离。它要求事务序列化执行，事务只能一个接着一个地执行，不能并发执行。此隔离级别可以防止更新丢失、脏读、不可重复读、幻读。如果仅仅通过“行级锁”是无法实现事务序列化的，必须通过其他机制保证新插入的数据不会被刚执行查询操作的事务访问到

### 超时
默认是 30 秒

    @Transactional(timeout=30)

### 只读性
readOnly  true of false

多次查询保证结果一致性

### 回滚异常类
rollbackFor

一组异常类，遇到时 确保 进行回滚。默认情况下 checked exceptions 不进行回滚，仅 unchecked exceptions（即 RuntimeException 的子类）才进行事务回滚

### 回滚异常类名
rollbackForClassname 一组异常类名，遇到时 确保 进行回滚

### 不回滚异常类
noRollbackFor 一组异常类，遇到时确保 不 回滚。

### 不回滚异常类名

noRollbackForClassname 一组异常类，遇到时确保不回滚


## 实现
默认情况下，数据库按照单独一条语句单独一个事务方式，自动提交模式，每条语句执行完毕，如果执行成功则隐式提交事务，如果失败则隐式回滚。

开启事务管理之后，Spring 会在 org/springframework/jdbc/datasource/DataSourceTransactionManager.java 中将底层自动提交特性关闭。

Spring 事务管理回滚的推荐做法是在当前事务的上下文抛出异常，Spring 事务管理会捕捉任何未处理的异常，然后根据规则决定是否回滚事务。

默认配置下，Spring 只有在抛出异常为运行时 unchecked 异常时才回滚事务，也就是抛出的异常为 RuntimeException 子类（Error 也会）导致回滚，而 checked 异常则不会导致事务回滚。

Spring 在注解了 @Transactional 的类或者方法上创建了一层代理，这一层代理在运行时是不可见的，
这层代理使得 Spring 能够在方法执行之前或者之后增加额外的行为。调用事务时，首先调用的是 AOP 代理对象，而不是目标对象，事务切面通过 TransactionInterceptor 增强事务，在进入目标方法前打开事务，退出目标方法时提交 / 回滚事务。

## 使用注意
注意事项：

- @Transactional 注解可以被用于接口定义、接口方法、类定义和类的 public 方法上
- @Transactional 注解只能应用到 public 可见度的方法上
- 建议在具体类实现（或方法中）使用 @Transactional 注解，不要在类所实现的接口中使用
- 单纯 @Transactional 注解不能开启事务行为，必须在配置文件中使用配置元素，才真正开启事务行为
- @Transactional 的事务开启，或者是基于接口的，或者是基于类的代理被创建

其他注意事项，比如通过 this 调用事务方法时将不会有事务效果，比如

    @Service
    public class TargetServiceImpl implements TargetService
    {
        public void a()
        {
            this.b();
        }
        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public void b()
        {
        // 执行数据库操作
        }
    }

比如此时调用 `this.b()` 将不会执行 b 的事务切面。

## reference

- <https://blog.csdn.net/u013142781/article/details/50421904>
- <https://www.baeldung.com/transaction-configuration-with-jpa-and-spring>
