---
layout: post
title: "jmap 命令使用及内存分析"
aliases: "jmap 命令使用及内存分析"
tagline: ""
description: ""
category: 学习笔记
tags: [jmap, jstack, jdk, jvm, java,]
last_updated:
---

jdk 自带的命令用来 dump heap info，或者查看 ClassLoader info，等等。

## 命令格式

    jmap [OPTION] PID

## 使用实例

### 不加任何参数

直接使用命令

    jmap pid

查看 pid 内存信息。

### 查看堆信息

    jmap -heap pid

### 查看堆对象信息
统计对象 count ，live 表示在使用

    jamp -histo pid
    jmap -histo:live pid

### 查看 classLoader

    jmap -clstats pid

### 生成堆快照

    jmap -dump:format=b,file=heapdump.phrof pid

hprof 二进制格式转储 Java 堆到指定 filename 的文件中，live 选项将堆中活动的对象转存。

> 执行的过程中为了保证 dump 的信息是可靠的，所以会暂停应用， 线上系统慎用

文件可以用 jhat 分析。

## 错误

在运行 jmap 的时候可能遇到如下错误：

    Attaching to process ID 18078, please wait...
    Error attaching to process: sun.jvm.hotspot.runtime.VMVersionMismatchException: Supported versions are 25.131-b11. Target VM is 25.152-b38
    sun.jvm.hotspot.debugger.DebuggerException: sun.jvm.hotspot.runtime.VMVersionMismatchException: Supported versions are 25.131-b11. Target VM is 25.152-b38
        at sun.jvm.hotspot.HotSpotAgent.setupVM(HotSpotAgent.java:435)
        at sun.jvm.hotspot.HotSpotAgent.go(HotSpotAgent.java:305)
        at sun.jvm.hotspot.HotSpotAgent.attach(HotSpotAgent.java:140)
        at sun.jvm.hotspot.tools.Tool.start(Tool.java:185)
        at sun.jvm.hotspot.tools.Tool.execute(Tool.java:118)
        at sun.jvm.hotspot.tools.PMap.main(PMap.java:72)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at sun.tools.jmap.JMap.runTool(JMap.java:201)
        at sun.tools.jmap.JMap.main(JMap.java:130)

解决办法就是保证 jmap 的版本 也就是 JDK 的版本和运行的 JVM 的版本，也就是 JRE 的版本一致。

我使用 Java VisualVM GUI 来查看当前进程使用的 Java 版本，或者直接 ps 查看进程，然后再使用对应的 jmap 的版本。

要保证 jmap 运行的版本和运行的 java 进程程序使用同一个的 JRE(JDK) 的方法就是在 Linux 下使用

    sudo update-alternatives --config java

来配置保证使用相同的 Java 程序。

## heap 文件大小差异
使用 jmap dump 出来的二进制文件大小可能会有很大的差别。

在 MAT 中不会显示 unreachable objects。

可以在 Preferences -> Memory Analyzer -> Keep Unreachable Objects 来启用。

## reference

- <https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jmap.html>
