---
layout: post
title: "Java 查漏补缺之 throwable vs exception 区别"
tagline: ""
description: ""
category: Java
tags: [java, jdk, exception, ]
last_updated:
---

在 java 中 try catch 的时候，大多数情况下是使用的 Exception，但是今天看代码有些却 catch 了 Throwable，于是总结下。

看 JDK 源码知道 Throwable 是 Exception 的超类，也同样是 Error 的超类，所以可想而知，如果 catch 了 Throwable，那么会连同 Exception 和 Error 一同 catch，这样也不会丢异常。

- Throwable 是所有异常的根，java.lang.Throwable
- Error 是错误，java.lang.Error，`Error` 通常是不可恢复的错误
- Exception 是异常，java.lang.Exception，Exception 通常是程序可恢复的

当程序发生不可控错误，抛出 Error 错误，与异常不同的是 Error 及其子类对象不应该被抛出。通常发生 Error 时需要介入处理。


## reference

- <https://stackoverflow.com/q/2274102/1820217>
