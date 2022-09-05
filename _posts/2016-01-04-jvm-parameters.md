---
layout: post
title: "JVM parameters"
aliases: "JVM parameters"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jvm, java-virtual-machine, ]
last_updated:
---

如果要更加了解 JVM 启动参数，那么对 JVM 的内存结构需要有一定的了解。JVM 内存主要分为三大块：

- Heap，又分为 Eden，From Survivor，To Survivor
- 方法区，存储类信息，常量，静态变量
- 栈，又分为虚拟机栈（Java Stack）和本地方法栈（Native Method Stack），用于方法执行


## -Xms
初始堆大小，默认值是物理内存的 1/64 . 默认 (MinHeapFreeRatio 参数可以调整）空余堆内存小于 40% 时，JVM 就会增大堆直到 -Xmx 的最大限制。

## -Xmx
最大堆大小，物理内存的 1/4（小于 1GB), 默认 (MaxHeapFreeRatio 参数可以调整）空余堆内存大于 70% 时，JVM 会减少堆直到 -Xms 的最小限制。


## -XX:+HeapDumpOnOutOfMemoryError

当堆内存空间溢出时输出堆的内存快照

通常配合 `-XX:HeapDumpPath` 使用，输出到文件

     -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/java_error_xxx.hprof

只有当发生 `java.lang.OutOfMemo-ryError` 时，才会 dump 到指定文件。

得到 hprof 文件后使用 memory analyzer tool（比如<http://eclipse.org/mat/>) 来分析。

## -XX:MaxGCPauseMillis=100

设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM 会自动调整年轻代大小，以满足此值。

## -XX:InitiatingHeapOccupancyPercent=25
整个堆占用量，开始 GC 。 默认值为 45，当值为 0 时，表示 “do constant GC cycles”。

## -XX:+UseG1GC
使用 Garbage First(G1) Collector.

## -XX:MaxJavaStackTraceDepth=1000000
JVM 人为设置了 stack trace 的限制为 1024，可以使用该参数来增加该限制。`-1` 值表示没有限制。

## -XX:ErrorFile=/hs_err_pid%p.log
JVM 致命错误。

该文件包含如下几类关键信息：

- 日志头文件
- 导致 crash 的线程信息
- 所有线程信息
- 安全点和锁信息
- 堆信息
- 本地代码缓存
- 编译事件
- gc 相关记录
- jvm 内存映射
- jvm 启动参数
- 服务器信息
