---
layout: post
title: "alibaba arthas 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [arthas, java, diagnostic-tool, ]
last_updated:
---

Arthas is a Java diagnostic tool that promises to help developers troubleshoot production issues for Java applications without modifying the code or restarting the server.

Main features:

- Useful for trouble-shooting jar file conflicts
- Decompile a class to ensure the code is running as expected
- View classloader statistics
- View the method invocation details
- Check the stack trace of specified method invocation
- Trace the method invocation to find slow sub-invocations
- Monitor method invocation statistics
- Monitor system metrics, thread states and CPU usage, gc statistics, and etc
- Support command line interactive mode, with auto-completed feature enabled.
- Support telnet and WebSocket, enabling both local and remote diagnostics with command line and browsers

## Install
安装非常简单

    curl -L https://alibaba.github.io/arthas/install.sh | sh

然后使用 `./as.sh` 启动即可。

其他安装[方式](https://alibaba.github.io/arthas/install-detail.html)

## 实例

### 全局监控
进入 arthas 之后使用 `dashboard` 可以快速查看全局信息，包括系统基本信息，CPU 使用率，堆内存，gc 次数，gc 耗时等等

### 查看 JVM 线程堆栈信息
使用 `thread` 可以查看线程堆栈信息。当 thread 没有参数时会打印所有的线程信息。

`thread` 命令也支持打印当前最忙的前 N 个线程

    thread -n 3

后面增加 id 可以打印指定线程堆栈

    thread id

使用 `-b` 参数一键找出当前阻塞其他线程的线程

    thread -b

目前只支持找出 synchronized 关键字阻塞住的线程， 如果是 `java.util.concurrent.Lock`， 目前还不支持。

### 查看类从哪一个 jar 加载
当知道类的路径时可以直接使用 `sc -d package.Class` 这样的方式来查看当前类的详细信息

    $ sc -d demo.MathGame
     class-info        demo.MathGame
     code-source       /home/einverne/arthas/arthas-demo.jar
     name              demo.MathGame
     isInterface       false
     isAnnotation      false
     isEnum            false
     isAnonymousClass  false
     isArray           false
     isLocalClass      false
     isMemberClass     false
     isPrimitive       false
     isSynthetic       false
     simple-name       MathGame
     modifier          public
     annotation
     interfaces
     super-class       +-java.lang.Object
     class-loader      +-sun.misc.Launcher$AppClassLoader@5c647e05
                         +-sun.misc.Launcher$ExtClassLoader@197c17c6
     classLoaderHash   5c647e05

信息中可以清晰的看到加载的 jar 的路径等等一些信息。

### 代码为什么没有执行
要回答这个问题，最好的方法就是立马检查下当前正在跑的代码是否符合预期。使用如下命令：

    jad demo.package.Class

直接查看当前运行的代码

### 查看函数调用栈耗时
如果特别关心某一函数的耗时情况，可以使用 trace 来查看

    trace package.Class method

### 监控有异常的接口
使用 tt 命令可以记录下指定方法被调用时的入参和返回值。tt 是 TimeTunnel 的缩写，为了解决 watch 命令的复杂。

    tt -t package.Class methodName -n 100
    tt -t package.Class methodName -n 100 > temp.log

`-n` 表示会统计之后的多少请求，`> temp.log` 表示输出到 arthas 的 cache 中，地址在 `~/logs/arthas-cache/` 下

### 回放请求
上面使用 tt 命令记录的内容可以用来回放请求，在 temp.log 日志中找到 index 表示的即为该请求的入参，使用 tt 命令可以用来回放请求，下面命令中的 index 就是文件中的 index

    tt --play -i index

在使用回放的时候需要注意：1. ThreadLocal 信息丢失 2. 引用对象， tt 命令将当前环境的对象引用保存，如果方法对入参进行了修改，那么 tt 命令无法查看到准确的值。

### watch 命令查看有异常的入参
tt 命令可以一直监控方法的入参，但是有的时候并不关心正常运行的参数，而只关心有异常的方法的入参，这个时候就可以使用 watch 命令

    watch package.Class method -e -x 2 '{params[0], params[1].toString, throwExp}'


### 监控 JVM 运行状态
使用 `jvm` 命令即可查看 JVM 的运行状态

    jvm

### sysprop sysenv 查看系统变量
sysprop 可以查看系统变量，sysenv 可以查看系统的环境变量。


## reference

- <https://alibaba.github.io/arthas/dashboard.html>
