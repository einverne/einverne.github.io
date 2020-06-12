---
layout: post
title: "Analyse Java Heap"
tagline: ""
description: ""
category: 学习笔记
tags: [java, heap,]
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

the normal way to capture the heap dump is using jmap:

	jmap -dump:live,file=/tmp/heapdump.hprof PID

Try the following. It comes with JDK >= 7:

	/usr/lib/jvm/jdk-YOUR-VERSION/bin/jcmd PID GC.heap_dump FILE-PATH-TO-SAVE

Example:

	/usr/lib/jvm/jdk1.8.0_91/bin/jcmd 25092 GC.heap_dump /opt/hd/3-19.11-jcmd.hprof

This dumping process is much faster than dumping with `jmap`! Dumpfiles are much smaller, but it's enough to give your the idea, where the leaks are.





[From]: <https://stackoverflow.com/a/40692594/1820217>



## Analyse heap file

### Memory Analyzer (MAT)

The Eclipse Memory Analyzer is a fast and feature-rich Java heap analyzer that helps you find memory leaks and reduce memory consumption.

Use the Memory Analyzer to analyze productive heap dumps with hundreds of millions of objects, quickly calculate the retained sizes of objects, see who is preventing the Garbage Collector from collecting objects, run a report to automatically extract leak suspects.
- <https://www.eclipse.org/mat/>
