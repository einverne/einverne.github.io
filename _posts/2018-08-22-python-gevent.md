---
layout: post
title: "Python 并发编程之 gevent"
tagline: ""
description: ""
category: 学习笔记
tags: [python, greenlet, gevent, thread, process, yield, ]
last_updated:
---

gevent 中最主要的是 greenlet，greenlet 是 Python 的 C 扩展，用来实现协程。

协程 [[Coroutine]]，就是可以暂时中断，之后再继续执行的程序

事实上 Python 就有最基础的 Coroutine，也就是生成器 generator

协程就是一种特殊的并发机制，其调度"就是指什么时候调用什么函数"完全由程序员指定

- 进程是一个操作系统级别的概念，拥有自己独立的堆和栈，既不共享堆，亦不共享栈，进程由操作系统调度。
- 线程拥有自己独立的栈和共享的堆，共享堆，不共享栈，线程亦由操作系统调度（标准线程）。
- 协程和线程一样共享堆，不共享栈，协程由程序员在协程的代码里显示调度。


## greenlet
看一个最经典的生产者消费者模型。

    from greenlet import greenlet
    from time import sleep

    def consumer():
        last= ''
        while True:
            receival = pro.switch(last)
            if receival is not None:
                print(f'Consume {receival}')
                last = receival
                sleep(1)


    def producer(n):
        con.switch()
        x = 0
        while x < n:
            x += 1
            print(f'Produce {x}')
            last = con.switch(x)

    pro = greenlet(producer)
    con = greenlet(consumer)
    pro.switch(10)


## gevent
gevent 是一个并发网络库，他的协程是基于 greenlet 的。并基于 libev 实现快速事件循环（Linux 上是 epoll，FreeBSD 上是 kqueue，Mac OS X 上是 select）。

一个比较通俗的解释就是当 greenlet 遇到 IO 操作，比如访问网络时自动切换到其他 greenlet ，等 IO 操作完成，在适当的时候切换回来继续执行。由于 IO 操作非常耗时，经常使程序处于等待状态，所以 gevent 保证总是有 greenlet 在运行，而不是等待 IO。

    import gevent

    def foo():
        print('Running in foo')
        gevent.sleep(0)
        print('Explicit context switch to foo again')

    def bar():
        print('Explicit context to bar')
        gevent.sleep(0)
        print('Implicit context switch back to bar')

    gevent.joinall([
        gevent.spawn(foo),
        gevent.spawn(bar),
    ])

`gevent.spawn()` 方法会创建一个新的 greenlet 协程对象，`gevent.joinall()` 方法会等待所有传入的 greenlet 协程运行结束后再退出。

## 优缺点
gevent 的优点如下：

- 执行效率高，子程序切换几乎没有开销，与多线程相比，线程越多，协程性能越明显
- 不需要多线程的锁机制，因为只有一个线程，也不存在同时写变量冲突，在控制共享资源时也不需要加锁
- I/O 多路复用是在一个进程内部处理多个逻辑流程，不用进行进程切换，性能较高，另外流程间共享信息简单。
- 协程有编程语言提供，由程序员控制进行切换，所以没有线程安全问题，可以用来处理状态机，并发请求等 IO 密集型任务

gevent 缺点如下：

- 不能利用 CPU 多核优势
- 程序流程被事件处理切割成一个个小块，程序比较复杂，难于理解

所以，协程的适用场景，应该是一些**IO 密集型**的并行程序，而对应的计算密集型，应当采用传统的多线程、多进程方案。

## 相关知识点

- Threads
- Processes
- SubProcess (Or os.system calls)
- concurrent.futures
- gevent, greenlet etc
- asyncio aiodns
- cython (Disabling the GIL)
- Writing C extensions

## reference

- <http://www.gevent.org/>
- <http://litaotao.github.io/python-gevent>
