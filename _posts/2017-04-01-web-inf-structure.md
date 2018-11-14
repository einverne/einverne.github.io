---
layout: post
title: "WEB-INF 目录结构"
tagline: ""
description: ""
category: 学习笔记
tags: [java-web, web, web-inf, spring, spring-mvc, ]
last_updated:
---

WEB-INF 是 Java EE Web 程序一个特殊的目录，此目录中的资源不会被列入应用程序根目录可直接访问项。客户端不可直接访问 WEB-INF 中的资源。

根据 [Servlet 2.4 specification](http://download.oracle.com/otn-pub/jcp/servlet-2.4-fr-spec-oth-JSpec/servlet-2_4-fr-spec.pdf) 中的描述，这个不公开的目录虽然不能被外部访问，但是可以被 servlet 代码 `getResource` 或者 `getResourceAsStream` 等方法访问，并且可以暴露给 `RequestDispatcher`。

目录 `WEB-INF/web.xml` 中保存 web 程序配置文件，XML 格式，描述 servlet 和其他应用组件配置和命名规则。

> 在 Spring MVC 和其他任何 web 程序中一个好的推荐方式是将所有的 views 或者 JSP 文件存放在 WEB-INF 文件夹中。这些放在 WEB-INF 中的 views 就被称为 internal resource view，这些 views 只能被 servlet 或者 Spring Controller 访问。


## reference

- <https://www.mkyong.com/spring-mvc/spring-mvc-internalresourceviewresolver-example/>
- <https://stackoverflow.com/a/19786283/1820217>
