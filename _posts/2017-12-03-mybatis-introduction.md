---
layout: post
title: "MyBatis 介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [mybatis, mysql, orm, ]
last_updated:
---


MyBatis 是 Java 系的 ORM 框架，提供了非常简洁的编程接口。

## 整体架构
分为三层

- 基础支持层
- 核心处理层
- 接口层

基础支持层包含了如下模块

- 反射，封装了原生反射接口
- 类型转换，别名机制，JDBC 类型和 Java 类型装换
- 日志，集成第三方优秀日志框架
- 资源加载，类加载器封装，确定类加载器使用顺序，提供加载类文件和及其他资源文件
- 解析器，对 XPath 封装；处理动态 SQL 语句中占位符
- 数据源，连接池，检测连接状态，自身提供，也提供与第三方数据源集成接口
- 事务，事务接口抽象和实现
- 缓存，一级缓存和二级缓存，运行在同一个 JVM，共享同一块堆内存
- Binding，通过 Binding 模块将用户自定义 Mapper 接口与映射配置文件关联，避免拼写错误

核心处理层包括

- 配置解析，初始化过程中，会加载 mybatis-config.xml 配置文件、映射配置文件以及 Mapper 接口中的注解信息，解析后的配置信息会形成相应的对象并保存到 Configuration 对象中
- SQL 解析和 scripting 模块，动态 SQL 语句
- SQL 执行
- 插件

接口层相对较简单，核心是 SqlSession 接口，接口定义了 MyBatis 暴露给应用程序的 API。

## 怎么用
MyBatis 是一个比较大的项目，下面包含了很多[子项目](http://blog.mybatis.org/p/products.html)，如果看这个项目列表就能够清晰的看到一些

- MyBatis 3 项目自身，提供核心的功能
- Generator 代码生成，可以快速生成 Mapper 和 Object
- mybatis spring 则是和 Spring 的整合，项目列表页上还有和 Spring Boot 的结合 和 Guice 的结合，和 Memcache 的整合等等

Ant 则直接在 classpath 引入 [jar 包](https://github.com/mybatis/mybatis-3/releases)，Maven 则

    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>x.x.x</version>
    </dependency>

使用 [mybatis-spring](http://www.mybatis.org/spring/zh/getting-started.html) 将 MyBatis 无缝嵌入到 Spring 中。

    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>x.x.x</version>
    </dependency>

mybatis generator

    <project ...>
       ...
       <build>
         ...
         <plugins>
          ...
          <plugin>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-maven-plugin</artifactId>
            <version>1.3.7</version>
          </plugin>
          ...
        </plugins>
        ...
      </build>
      ...
    </project>


## reference

- <http://www.mybatis.org/spring/zh/getting-started.html>
- <http://www.mybatis.org/mybatis-3/getting-started.html>
