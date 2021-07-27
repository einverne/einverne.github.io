---
layout: post
title: "由 libevent 库开始学习 Linux IO 模型"
tagline: ""
description: ""
category: 学习笔记
tags: [libevent, c, nio, non-blocking, epoll,]
last_updated:
---

在看 Java 的 Netty 的时候，了解到了 NIO，从 NIO 了解到了 C 语言实现的 libevent 。我们为什么需要这样一个库，他的出现是为了解决什么问题。对于熟悉网络编程，或者多线程的人来说，都会知道一个普遍存在的问题，CPU 要远远快过 IO。所以如果我们要同时处理多个任务，而当前的任务阻塞了 IO，那么理想的状态应该是让 CPU 执行其他任务，而让阻塞 IO 的任务放到后台执行。

libevent 库提供了一种事件响应机制，当事件发生在用户关心的文件描述符上时，通知用户，并且隐藏后台真正使用的方法（select,epoll,kqueue) ，这避免了让用户为各个平台书写不同代码的问题。

## Linux 网络 IO 模型
Linux 内核将所有外部设备看做一个文件来操作，对一个文件的读写操作会调用内核提供的命令，返回 file descriptor。对一个 socket 的读写也有相应的描述符，socketfd，描述符是一个数字，指向内核中一个结构体。

UNIX 网络编程对 IO 模型划分了 5 类：

- 阻塞 I/O 模型：默认情况下所有文件操作都是阻塞的。以套接字为例，进程中调用 recvfrom，系统调用直到数据包到达且被复制到应用进程缓冲区或者发生错误时才返回，期间一直等待，进程从调用 recvfrom 开始到返回整个过程是被阻塞的
- 非阻塞 I/O 模型：recvfrom 从应用层到内核，如果该缓冲区没有数据，直接返回一个 EWOULDBLOCK 错误，一般轮讯检查该状态，看内核是否有数据
- I/O 复用模型：Linux 提供 select/poll ，进程通过一个或者多个文件描述符传递给 select 或者 poll 系统调用，阻塞在 select 操作，select/poll 可以侦测多个文件描述符是否处于就绪状态。Linux 还提供 epoll 系统调用，epoll 使用基于事件驱动方式代替顺序扫描
- 信号驱动 I/O 模型，开启套接口信号驱动 IO 功能，通过系统调用 sigaction 执行信号处理函数（非阻塞），当数据准备好，进程生成 SIGIO 信号，通过信号回调通知应用程序调用 recvfrom 来读取数据，并通知主循环函数处理
- 异步 IO：告知内核启动某个操作，并让内核在整个操作完成后（包括将数据从内核复制到用户缓冲区）通知用户。这种模型区别于信号驱动主要区别是：信号驱动 IO 由内核通知何时开始 IO 操作；异步 IO 由内核通知 IO 何时已经完成

更多的可以参考《UNIX 网络编程》这本书。

## NIO 类库
NIO 在 JDK 1.4 引入，弥补了 JAVA 原来的同步阻塞 IO 的不足。

### 缓冲区 Buffer
Buffer 是一个对象，包含一些要写入或者要读的数据。在面向流的 IO 中，数据可以直接写入或者读取到 Stream 对象中，在 NIO 库中，所有的数据都是用缓冲区处理。

缓冲区实质上是数组，通常是字节数组 ByteBuffer，缓冲区也不仅是一个数组，缓冲区提供了数据结构化访问以及维护读写位置等信息。

最常用的是 ByteBuffer ，但是每一种 Java 基本类型都对应一个缓冲区。

### 通道 Channel
网络数据通过 Channel 读写，通道和流不同的是通道是双向的，流只是一个方向的移动，通道可以同时用于读、写或者同时进行。

Channel 可以分为两类：

- 网络读写的 SelectableChannel
- 文件 FileChannel

### 多路复用器 Selector
Selector 会不断轮询注册在上面的 Channel，如果某 Channel 发生读写时间，Channel 处于就绪状态，被 Selector 轮询出来，通过 SelectionKey 获取就绪 Channel 集合，进行后续 IO。

## reference

- 《Netty 权威指南》
- <http://blog.gaurav.im/2014/12/15/a-gentle-intro-to-libevent/>
- <http://www.wangafu.net/~nickm/libevent-book/>
- <https://github.com/libevent/libevent>
- <https://www.ibm.com/developerworks/cn/aix/library/au-libev/index.html>
