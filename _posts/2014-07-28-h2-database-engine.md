---
layout: post
title: "H2 Database Engine"
tagline: ""
description: ""
category: 学习笔记
tags: [h2, database, in-memory-database, jdbc, ]
last_updated:
---

H2 is a Java SQL database, with following features:

- fast, open source, JDBC API
- Embedded and server modes; in-memory databases
- Browser based console application
- small footprint: around 1.5MB jar file size

## 连接方式
H2 数据库支持三种连接方式，三种模式都支持内存、持久化到文件，三种模式对同时开启的数据库数量和连接数没有限制。

### 嵌入式模式
本地 JDBC 连接，最方便的一种，嵌入式下，JVM 启动 H2 数据库通过 JDBC 连接。

### 服务器模式
通过 JDBC 或者 ODBC API 远程连接数据库，可以部署在不同的 JVM 或者不同的物理机中。数据通过 TCP/IP 协议传输，比嵌入式慢。

### 混合模式
第一个应用通过嵌入式打开 H2 数据库，同时数据库开启服务器模式，其他应用可以远程连接。

连接字符串

    driver=org.h2.Driver
    url=jdbc:h2:mem:testdb;MODE=MYSQL;DB_CLOSE_DELAY=-1
    username=sa
    password=

## 使用
控制台启动

    java -jar h2*.jar

在 Spring 应用中 maven 配置

    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <version>1.x.xxx</version>
    </dependency>

连接配置

    driver=org.h2.Driver
    url=jdbc:h2:mem:testdb;MODE=MYSQL;DB_CLOSE_DELAY=-1
    username=sa
    password=

## reference

- <http://www.h2database.com/html/main.html>
