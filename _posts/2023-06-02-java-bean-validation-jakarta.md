---
layout: post
title: "利用 Jakarta 来验证 Java Bean 数据合法性"
aliases:
- "利用 Jakarta 来验证 Java Bean 数据合法性"
tagline: ""
description: ""
category: 学习笔记
tags: [ java, jakarta, java-bean, validation,  ]
create_time: 2023-06-09 14:35:09
last_updated: 2023-06-09 14:35:09
---

Bean Validation 为 JavaBean 和方法验证定义了一组元数据模型和 API 规范，常用于后端数据的声明式校验。

2017 年 11 月，Oracle 将 Java EE 移交给 Eclipse 基金会。 2018 年 3 月 5 日，Eclipse 基金会宣布 Java EE (Enterprise Edition) 被更名为 Jakarta EE。因此 Bean Validation 规范经历了从 JavaEE Bean Validation 到 Jakarta Bean Validation 的两个阶段：

- JSR 303 (Bean Validation 1.0) Java EE 6
- JSR 349 (Bean Validation 1.1) Java EE 7
- JSR 380 (Bean Validation 2.0) Java EE 8
- Jakarta Bean Validation 2.0
- Jakarta Bean Validation 3.0

## 特性

- 通过使用注解的方式在对象模型上表达约束
- 以扩展的方式编写自定义约束
- 提供了用于验证对象和对象图的 API
- 提供了用于验证方法和构造方法的参数和返回值的 API
- 报告违反约定的集合

## Maven

添加依赖

```
<!-- Validation -->
<dependency>
  <groupId>org.hibernate.validator</groupId>
  <artifactId>hibernate-validator</artifactId>
  <version>8.0.0.Final</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>jakarta.validation</groupId>
  <artifactId>jakarta.validation-api</artifactId>
  <version>3.0.2</version>
</dependency>
<dependency>
  <groupId>org.glassfish.expressly</groupId>
  <artifactId>expressly</artifactId>
  <version>5.0.0</version>
  <scope>runtime</scope>
</dependency>
```

## 自定义校验注解

默认 Jakarta 已经定义了非常常用的一些校验，比如 `@NotBlank`, `@Min`, `@Max` 等等，但如果它提供的注解无法满足我们的需求时就需要通过自定义的方式来实现。

自定义的步骤主要分为

- 创建一个 `validator` 来，实现 `jakarta.validation.ConstraintValidator` 接口
- 创建一个 constraint annotation 并且添加 `jakarta.validation.Constraint` 注解

首先来看看注解定义

```
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER,
        ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = LanguageValidator.class)
@Documented
public @interface Language {
    String message() default "must be a valid language display name.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

注意这里的 `@Constraint` 注解需要指定 Validator。

## Constraints

Constraints 约束是 Bean Validation 规范的核心。通过约束注解和约束验证的实现组合完成。
