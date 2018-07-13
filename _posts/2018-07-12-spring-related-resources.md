---
layout: post
title: "Spring 相关资源"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, spring-mvc, docs, demo, tutorial,]
last_updated:
---

收集了一些官方的非官方的学习资源。

## 文档

- <https://docs.spring.io/spring-boot/docs/>
- 中文翻译 <https://github.com/qibaoguang/Spring-Boot-Reference-Guide>

## 代码

- 官方的样例 <https://github.com/spring-projects/spring-mvc-showcase>
- 个人的教程 <https://github.com/dyc87112/SpringBoot-Learning>
- Spring MVC 博客 <http://lgbolgger.iteye.com/category/321050>


## Spring 深度探险

### 第一篇 Spring MVC 前传
[Spring MVC 前传](http://downpour.iteye.com/blog/1330537)


    主要讲了 Spring 发展的历史，和 struct 等的对比

### 第二篇 Spring MVC 概览
[Spring MVC 概览](http://downpour.iteye.com/blog/1330596)

以 Servlet 作为入口程序是绝大多数 MVC 框架都遵循的基本设计方案，这里的 DispatcherServlet 被称之为核心分发器。Spring MVC 的核心配置文件定义在 [servlet-name]-servlet.xml 文件中。控制层 Controller 是一个单独的 Java 文件，只是使用注解将其与 HTTP 请求关联。

    - 入口程序 DispatcherServlet
    - 核心配置 servlet.xml
    - 控制逻辑 Controller

这三者构成 Spring MVC 的基础要素。

SpringMVC 在整个 Controller 改造中所涉及到的一些要点：

1. 使用参数 - 返回值（Param-Return）实现模式来打造 Controller
2. 引入 Annotation 来完成请求 - 响应的映射关系

    引入 Annotation 来完成请求 - 响应的映射关系，是 SpringMVC 的一个重大改造。在早期的 SpringMVC 以及其他的 MVC 框架中，通常都是使用 XML 作为基础配置的。而 Annotation 的引入将原本分散的关注点合并到了一起，为实现配置简化打下了坚实的基础。

3. 泛化参数和返回值的含义

    核心 Servlet 应该能够根据一定的规则对不同的 Http 请求分发到不同的 Servlet 对象上去进行处理。核心 Servlet 应该能够建立起一整套完整的对所有 Http 请求进行规范化处理的流程。


Servlet 模型中，请求 和 响应实现依赖，`web.xml` 中配置 `<servlet>` 和 `<servlet-mapping>` 的对应，将响应的 URL pattern 和其对应的实现类进行关联。针对这个问题，Spring MVC 提出的方案就是提炼一个核心的 Servlet 覆盖对所有 HTTP 请求的处理，这就是 `org.springframework.web.servlet.DispatcherServlet` 核心分发器。

因此 web.xml 中的配置就被固定

    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/**</url-pattern>
    </servlet-mapping>

Spring MVC 接下来要处理的内容就是根据一定的规则处理不同的 HTTP 请求，分发到响应的 Servlet 处理。

在 SpringMVC 的设计中，这两个方面的内容总是在一个不断交叉、互为补充的过程中逐步完善的。

处理流程规范化是目的，对于处理过程的步骤划分和流程定义则是手段。因而处理流程规范化的首要内容就是考虑一个通用的 Servlet 响应程序大致应该包含的逻辑步骤：

- 步骤 1 —— 对 Http 请求进行初步处理，查找与之对应的 Controller 处理类（方法）
- 步骤 2 —— 调用相应的 Controller 处理类（方法）完成业务逻辑
- 步骤 3 —— 对 Controller 处理类（方法）调用时可能发生的异常进行处理
- 步骤 4 —— 根据 Controller 处理类（方法）的调用结果，进行 Http 响应处理

在 Java 语言中，最适合表达逻辑处理语义的语法结构是接口，因此上述的四个流程也就被定义为了四个不同接口，它们分别是：

- 步骤 1 —— HandlerMapping
- 步骤 2 —— HandlerAdapter
- 步骤 3 —— HandlerExceptionResolver
- 步骤 4 —— ViewResolver

核心配置文件在整个 SpringMVC 的构成要素中占有一席之地的重要原因就是在于：必须借助一个有效的手段对整个 SpringMVC 的组件进行定义，而这一点正是通过核心配置文件来完成的。


### 第三篇 DispatcherServlet 与初始化主线

[DispatcherServlet 与初始化主线](http://downpour.iteye.com/blog/1341459)，SpringMVC 的设计原则 `Open for extension / closed for modification`

Spring MVC 设计中的要点

- SpringMVC 将 Http 处理流程抽象为一个又一个处理单元
- SpringMVC 定义了一系列组件（接口）与所有的处理单元对应起来
- SpringMVC 由 DispatcherServlet 贯穿始终，并将所有的组件串联起来

根据 Servlet 规范的定义，Servlet 中的两大核心方法 init 方法和 service 方法，它们的运行时间和触发条件都截然不同：

init 方法

在整个系统启动时运行，且只运行一次。因此，在 init 方法中我们往往会对整个应用程序进行初始化操作。这些初始化操作可能包括对容器（WebApplicationContext）的初始化、组件和外部资源的初始化等等。

service 方法

在整个系统运行的过程中处于侦听模式，侦听并处理所有的 Web 请求。因此，在 service 及其相关方法中，我们看到的则是对 Http 请求的处理流程。

DispatcherServlet 的初始化主线

初始化主线的驱动要素，servlet 中的 init 方法；初始化主线的执行次序，HttpServletBean->FrameworkServlet->DispatcherServlet；初始化主线的操作对象，Spring 容器（WebApplicationContext）和组件。
一个组件的多种行为模式可以在容器中共存，容器将负责对这些实现类进行管理。DispatcherServlet 中对于组件的初始化过程实际上是应用程序在 WebApplicationContext 中选择和查找组件实现类的过程，也是指定组件在 SpringMVC 中的默认行为方式的过程。


### 第四篇 SpringMVC 核心配置文件详解
[SpringMVC 核心配置文件详解](http://downpour.iteye.com/blog/1389285)

SpringMVC 的核心配置文件在整个应用程序中所起到的作用也是举足轻重的。在 web.xml 中指定 SpringMVC 的入口程序 DispatcherServlet 时，实际上蕴含了一个对核心配置文件的指定过程（[servlet-name]-servlet.xml）

    namespace     element             attributes
     |             |                         |
    <mvc:annotation-driven ignore-default-model-on-redirect="true"/>
     |             |                         |
    逻辑分类     过程语义             行为配置选项

Schema-based XML 中的配置节点拥有比较鲜明的功能特性，通过 namespace、element 和 attributes 这三大元素之间的配合，共同完成对一个动态过程的描述。<mvc:annotation-driven />这段配置想要表达的意思，就是在 mvc 的空间内实现 Annotation 驱动的配置方式。其中，mvc 表示配置的有效范围，annotation-driven 则表达了一个动态的过程，实际的逻辑含义是：整个 SpringMVC 的实现是基于 Annotation 模式，请为我注册相关的行为模式。


