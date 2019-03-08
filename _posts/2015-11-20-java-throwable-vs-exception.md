---
layout: post
title: "Java 查漏补缺之 throwable vs exception 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jdk, exception, ]
last_updated:
---

在 java 中 try catch 的时候，大多数情况下是使用的 Exception，但是今天看代码有些却 catch 了 Throwable，于是总结下。

看 JDK 源码知道 Throwable 是 Exception 的超类，也同样是 Error 的超类，所以可想而知，如果 catch 了 Throwable，那么会连同 Exception 和 Error 一同 catch，这样也不同意丢异常。

对于大部分的 log 场景，Throwable 是不会有任何问题的。

## reference

- <https://stackoverflow.com/q/2274102/1820217>
