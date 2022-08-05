---
layout: post
title: "MyBatis 使用介绍"
aliases: "MyBatis 使用介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [mybatis, mysql, orm, java, 教程 ,  ]
last_updated:
---

MyBatis 是 Java 系的 ORM(Object Relational Mapping) 框架，提供了非常简洁的编程接口。用简单的话来说就是可以将数据库表映射到 Object 中 MyBatis 就是中间辅助处理的框架。

类似于 Python 中的 [[SQLAlchemy]]。

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

- 配置解析，初始化过程中，会加载 `mybatis-config.xml` 配置文件、映射配置文件以及 Mapper 接口中的注解信息，解析后的配置信息会形成相应的对象并保存到 Configuration 对象中
- SQL 解析和 scripting 模块，动态 SQL 语句
- SQL 执行
- 插件

接口层相对较简单，核心是 `SqlSession` 接口，接口定义了 MyBatis 暴露给应用程序的 API。

## 基本使用流程
所以如果要使用 MyBatis 基本有如下几个步骤：

- 开发 Java 类，编写 Mapper 定义 SQL
- 获取 SqlSessionFactory
- 获取 SqlSession
- 面向对象方式操作数据
- 关闭事务，关闭 SqlSession

SqlSession 是 MyBatis 关键对象，持久化操作的对象，类似 JDBC 中 Connection。SqlSession 对象完全包含以数据库为背景的所有执行 SQL 操作的方法，底层封装了 JDBC 连接。每个线程都应该有自己的 SqlSession 实例，SqlSession 实例线程不安全，不能共享，绝对不要将 SqlSession 实例引用放到类静态字段或者实例字段中。使用完 SqlSession 一定关闭。

## Mapper 文件
Mapper 文件针对 SQL 文件构建。

### select
select 语句用来映射查询语句。

    <select id="selectUser" parameterType="int" resultType="hashmap">
        SELECT * FROM USER WHERE ID = #{id}
    </select>

这个语句被称为 selectUser，接受 int 参数，返回 HashMap 类型。

### insert, update, delete
比如

    <insert id="insertUser">
        insert into USER (id, username, password, email, address)
        values (#{id},#{username},#{password},#{email},#{address})
    </insert>

### sql
sql 元素用来定义可重用的 SQL 代码。

### Parameter
如果 parameterType 传入一个对象，那么 `#{id}` 在查询时会去对象属性查询。

    <insert id="insertUser" parameterType="User">
        insert into USER (id, username, password, email, address)
        values (#{id},#{username},#{password},#{email},#{address})
    </insert>

### ResultMaps
ResultMaps 元素是 MyBatis 中最重要最强大的元素，告诉 MyBatis 从结果集中取出数据转换成 Java Object。

## 怎么用
MyBatis 是一个比较大的项目，下面包含了很多[子项目](http://blog.mybatis.org/p/products.html)，如果看这个项目列表就能够清晰的看到一些

- MyBatis 3 项目自身，提供核心的功能
- Generator 代码生成，是一款 maven 插件，可以快速生成 Mapper 和对应的 Object 实体文件
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

mybatis generator 作为插件引入：

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

更多关于 MyBatis Generator 的内容可以参考[这里](/post/2014/08/mybatis-generator.html)

## reference

- <http://www.mybatis.org/spring/zh/getting-started.html>
- <http://www.mybatis.org/mybatis-3/getting-started.html>
