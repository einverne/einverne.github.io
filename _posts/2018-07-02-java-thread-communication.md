---
layout: post
title: "Java 查漏补缺：线程间通信"
tagline: ""
description: ""
category: Java
tags: [java, linux, thread, synchronized, ]
last_updated:
---


## wait notify

方法 `wait()` 是让当前执行代码的线程等待，`wait()` 是 Object 类的方法。在调用 `wait()` 方法前，线程需要获得对象级别锁，只能在同步方法或者同步块中调用，执行 `wait()` 方法后，当前线程释放锁。如果调用时没有持有适当锁，会抛出 IllegalMonitorStateException 异常。

方法 `notify()` 也需要在同步方法或者同步块中调用，同样调用前也需要获取对象锁。如果调用没有持有适当的锁，也会抛出 IllegalMonitorStateException 异常。`notify()` 方法永安里通知可能处于等待该对象锁的其他线程，如果有多个线程等待，由线程规划器随机挑选一个呈现 wait 状态的线程，发出 notify 通知，并使它获得该对象的对象锁。`notify()` 方法执行后，当前线程不会马上释放该对象锁，wait 状态的线程也不能马上获取该对象锁，需要等执行 `notify()` 方法的线程将程序执行完，也就是退出 synchronized 代码块之后，当前线程才会被释放锁。

如果发出 `notify()` 操作时没有处于阻塞状态的线程，命令会被忽视。

`wait()` 方法使线程停止运行，而 `notify()` 使停止的线程继续运行。

## join
如果主线程要等待子线程执行完成之后结束，可以使用 join() 方法。

`join(long)` 在内部使用 `wait(long)` 方法实现，所以会释放锁。而 `Thread.sleep(long)` 方法不会释放锁。

## ThreadLocal

ThreadLocal 类主要解决的就是每个线程绑定自己的值，每个线程都有自己的私有数据。

## 公平锁 vs 非公平锁
公平锁线程在获取锁的顺序是按照线程加锁的顺序来分配的，即先来先得 FIFO ，而非公平锁就是获取锁的抢占机制，随机获的锁。

## ReentrantReadWriteLock
类 [[ReentrantLock]] 是完全互斥排他，同一时间只有一个线程能够执行 ReentrantLock 后任务，这样的方式保证了实例变量的线程安全，但是效率低下。所以 JDK 中提供了另外一个读写锁 ReentrantReadWriteLock ，在某些不需要操作实例变量的方法中，可以使用读写锁 ReentrantReadWriteLock 来提升方法的效率。

读写锁表示有两个锁，一个读相关锁，也成为共享锁，另一个是写相关的锁，也叫排它锁。读锁之间不排斥，写锁与其他锁互相排斥。多个线程可以同时读操作，但是同一时刻只允许有一个线程写操作。


