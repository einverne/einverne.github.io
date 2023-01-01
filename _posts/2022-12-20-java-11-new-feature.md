---
layout: post
title: "Java 11 新特性学习"
aliases:
- "Java 11 新特性学习"
tagline: ""
description: ""
category: 学习笔记
tags: [ java, java-11, jdk, openjdk, ]
create_time: 2022-12-20 11:21:14
last_updated: 2022-12-20 11:21:14
---

Java 11 在 2018 年 9 月 25 日发布。这是 Java 8 之后首个长期版本。

## 安装
因为我本地使用 [asdf](/post/2020/04/asdf-vm-manage-multiple-language.html) 来管理 Java 的多个版本，所以直接使用  asdf 来安装：

```
asdf install java adoptopenjdk-11.0.17+8
asdf global java adoptopenjdk-11.0.17+8
java -version
```

## HTTP Client 升级
Http Client 几乎被重写，支持异步非阻塞。

包名从 `jdk.incubator.http` 改为 `java.net.http`，通过 `CompleteableFutures` 提供非阻塞请求。新的 HTTP Client 提供了对 HTTP/2 的支持，兼容 HTTP/1.1 ，与主流的开源库（Apache HttpClient，Jetty， OkHttp）性能相差无几。

Java 在 Reactive-Stream 的实践，广泛使用了 Java Flow API。

模拟 GET 请求：

```
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create("http://openjdk.java.net/"))
      .build();
client.sendAsync(request, BodyHandlers.ofString())
      .thenApply(HttpResponse::body)
      .thenAccept(System.out::println)
      .join();
```

## Epsilon 低开销垃圾回收器
Epsilon 目标是开发一个内存控制器，不执行任何垃圾回收，提供完全消极的 GC 实现，最大限度降低内存占用和内存吞吐延迟时间。

通过 JVM 参数 `-XX:+UseEpsilonGC` 来开启。

### 为什么要开发一个不回收内存的垃圾回收器

一些特殊的场景可以不开启垃圾回收以方便进行比如性能测试，内存压力测试等等。

## 简化单个源代码文件的启动方法
Java 11 可以直接运行一个单一的源码文件，Java 解释器可以直接在内存中编译，然后执行。所有的类都必须定义在同一个 Java 文件中。

这个功能特别适合想要简单了解一下 Java，写一些脚本文件的时候非常有用。

## 本地变量类型推断

## Lambda 参数的局部变量语法

Java 10 开始就引入了 var 关键字，允许局部变量推断。

但在 Java 10 中有几个限制：

- 只能用于局部变量
- 声明时必须初始化
- 不能用于方法参数
- 不能在 Lambda 表达式中

Java 11 中允许开发者直接在 Lambda 表达式中使用 var 进行参数声明。

## 低开销的 Heap Profiling

Java 11 中提供了一种低开销的 Java 堆分配采样方法，能够得到堆分配的 Java 对象信息，并能够通过 JVMTI 访问堆信息。

- 低开销，可以默认开启
- 定义好的程序接口访问
- 堆所有堆分配区域进行采样
- 给出正在和未被使用的 Java 对象信息

## ZGC 可伸缩低延迟垃圾收集器

ZGC 是 Z Garbage Collector ，GC 停顿时间短，不超过 10ms，能处理 T 级别堆大小。

实验阶段，只在 Linux/x64 上可用，在编译时加入参数才可以启用，并且使用时需要增加 JVM 参数。

## 飞行记录器
低开销的事件信息收集框架。

启用参数：

```
-XX:StartFlightRecording
```

## reference

- <https://developer.ibm.com/zh/technologies/java/articles/the-new-features-of-java-11/>
