---
layout: post
title: "每天学习一个命令：jstack 打印Java进程堆栈信息"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [jstack, java, debug, linux, thread-dump, ]
last_updated: 
---

Jstack 用于打印出给定的 java 进程 ID 或 core file 或远程调试服务的 Java 堆栈信息.

> Prints Java thread stack traces for a Java process, core file, or remote debug server. This command is experimental and unsupported.

如果 java 程序崩溃生成 core 文件，jstack 工具可以用来获得 core 文件的 java stack 和 native stack 的信息，从而可以轻松地知道 java 程序是如何崩溃和在程序何处发生问题。另外，jstack 工具还可以附属到正在运行的 java 程序中，看到当时运行的 java 程序的 java stack 和native stack 的信息, 如果运行的 java 程序呈现 hung 的状态，jstack 是非常有用的。

thread dump 就是将当前时刻正在运行的 JVM 的线程拷贝一份，可以用来分析程序执行情况。

## 用法
打印某个进程的堆栈信息

    jstack [PID]

    jstack -l [PID]
    jstack -m [PID]

关于如何找到PID，有很多方法，使用 `jps -v` 或者 `ps -aux` 或者 `htop` 等等方法都可以。

## 分析

在执行 `jstack -l [PID] > /tmp/output.txt` 之后可以对 `/tmp/output.txt` 进行分析

开头交代当前 dump 的时间和 JVM 基本信息

    2018-05-24 14:41:06
    Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.101-b13 mixed mode):

接下来就是程序的线程信息

    "resin-8015" #8015 daemon prio=5 os_prio=0 tid=0x00007f991820a800 nid=0x25e65 waiting on condition [0x00007f96b1b39000]
       java.lang.Thread.State: WAITING (parking)
            at sun.misc.Unsafe.park(Native Method)
            at java.util.concurrent.locks.LockSupport.park(LockSupport.java:304)
            at com.caucho.env.thread2.ResinThread2.park(ResinThread2.java:196)
            at com.caucho.env.thread2.ResinThread2.runTasks(ResinThread2.java:147)
            at com.caucho.env.thread2.ResinThread2.run(ResinThread2.java:118)

       Locked ownable synchronizers:
            - None

线程的状态 Thread Life States

- alive  通常运行时状态
- not started 线程已经被 `java.lang.Thread.start()` 请求运行，但是实际上操作系统还没有开始
- terminated 线程已经结束 `run()` 并且通知其他线程 joining

线程运行状态 Thread Run States

- blocked 该线程尝试进入一个被其他线程占用的 synchronized 块，当前线程直到锁被释放之前一直都是 blocked 状态
- blocked (on thin lock) 和 `blocked` 相同的状态，但是锁需要是 thin lock
- waiting 当前线程调用了对象的 `Object.wait()` ，当前线程会保持该状态直到其他线程发送通知到该对象
- sleeping 当前线程调用了 `java.lang.Thread.sleep()`
- parked 当前线程调用了 `java.util.concurrent.locks.LockSupport.park()`
- suspended 当前线程的执行被 `java.lang.Thread.suspend()` 暂停，或者有 JVMTI/JVMPI agent 调用

以上内容来自 [Oracle](https://docs.oracle.com/cd/E13150_01/jrockit_jvm/jrockit/geninfo/diagnos/using_threaddumps.html)

通过 jstack 信息可以分析线程死锁，或者系统瓶颈，但是这篇文章比较粗浅，只介绍了大概，等以后熟悉了补上。

## reference

- <https://helpx.adobe.com/in/experience-manager/kb/TakeThreadDump.html>
