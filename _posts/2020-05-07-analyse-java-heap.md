---
layout: post
title: "分析 Java 内存"
aliases: "分析 Java 内存"
tagline: ""
description: ""
category: 学习笔记
tags: [java, heap, java-memory, ]
last_updated:
---



## What Is Heap
The space used by the Java Runtime to allocate memory to Objects and JRE Classes is called Heap. The heap space can be configured using the following JVM arguments:

	-Xmx<size> — Setting maximum Java heap size
	-Xms<size> — Setting initial Java heap size

**Heap dump** is a snapshot of the Java memory. It contains information about the Java objects and classes in the heap at the moment the snapshot is triggered.

## take heap dump without hanging the application
First, you have to identify the Java process Id:

	ps aux |grep "java"

the normal way to capture the heap dump is using `jmap`:

	jmap -dump:live,format=b,file=/tmp/heapdump.hprof PID

Try the following. It comes with JDK >= 7:

	/usr/lib/jvm/jdk-YOUR-VERSION/bin/jcmd PID GC.heap_dump FILE-PATH-TO-SAVE

Example:

	/usr/lib/jvm/jdk1.8.0_91/bin/jcmd 25092 GC.heap_dump /opt/hd/3-19.11-jcmd.hprof

This dumping process is much faster than dumping with `jmap`! Dumpfiles are much smaller, but it's enough to give your the idea, where the leaks are.


[From]: <https://stackoverflow.com/a/40692594/1820217>


## Analyse heap file

### Memory Analyzer Tool (MAT)

The [[Eclipse Memory Analyzer]] is a fast and feature-rich Java heap analyzer that helps you find memory leaks and reduce memory consumption.

Use the Memory Analyzer to analyze productive heap dumps with hundreds of millions of objects, quickly calculate the retained sizes of objects, see who is preventing the Garbage Collector from collecting objects, run a report to automatically extract leak suspects.

Eclipse Memory Analyzer Tool 是一个基于 Eclipse 的分析工具。


### Shallow Heap 和 Retained Heap 区别


### Out of memory 问题

I recently installed Eclipse MAT (Eclipse Memory Analyzer Version 1.9.1) on Mac OS Catalina (10.15.3). I needed to review a 4g heap dump. The default JVM heap size for MAT is 1024m.

I think the easiest way to increase the JVM's heap size is to use a shell window - go to the /Applications/mat.app/Contents/Eclipse/ folder. Then vi MemoryAnalyzer.ini and change -Xmx1024m to your required value, in my case I went with -Xmx10g.

To review the change, restart MAT and go to the help -> About Eclipse Memory Analyzer then click installation details, and look for the entry: eclipse.vmargs=-Xmx10g about 50 lines down.





## reference

- <https://www.eclipse.org/mat/>
