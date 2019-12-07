---
layout: post
title: "Java 查漏补缺之 Thread 类中 interrupt() interrupted() isInterrupted() 区别"
tagline: ""
description: ""
category: Java
tags: [java, thread, interrupt, ]
last_updated:
---

Thread 类中有三个方法长得非常像，也特别容易混淆，但是使用起来却非常不同：

    public void interrupt() // 无返回值
    public boolean isInterrupted() // 有返回值
    public static boolean interrupted() // 静态，有返回值

## 解释

- `interrupt()`: 中断本线程

        myThread.interrupt();// 中断的是调用 interrupt() 方法的线程

    阻塞于 wait/join/sleep 的线程，中断状态会被清除掉，同时收到异常 InterruptedException；而其他情况中断状态都被设置，并不一定收到异常。`interrupt()` 方法其实是通知线程该中断了。线程具体中断还是继续执行，应该由被执行线程自己处理。

    具体来说，当一个线程调用 `interrupt()` 方法时：

        - 线程处于阻塞状态（sleep，wait，join 等），线程立即退出被阻塞状态，抛出 InterruptedException 异常
        - 线程处于正常活动状态，会将线程中断标志设置为 true，被设置中断标志的线程将继续正常运行

    一个线程如果有被中断的需求，在正常运行任务时，经常检查本线程的中断标志位，如果被设置了中断标志就自行停止线程

        Thread thread = new Thread(() -> {
            // 若未发生中断，就正常执行任务
            while (!Thread.interrupted()) {
                // 正常任务代码
            }
            // 中断处理代码
            doSomething();
        });
        thread.start();

        // 一段时间以后
        thread.interrupt();


- `isInterrupted()`: 检测本线程是否已经中断

        myThread.isInterrupted();// 判断本线程 myThread 是否中断

    如果已经中断，则返回 true，否则 false。**中断状态不受该方法的影响**。
    如果中断调用时线程已经不处于活动状态，则返回 false。

- `interrupted()`: 检测当前线程是否已经中断

        Thread.interrupted();// 判断该语句所在线程是否中断

    如果已经中断，则返回 true，否则 false，并**清除中断状态**。换言之，如果该方法被**连续调用两次**，第二次必将返回 false，除非在第一次与第二次的瞬间线程再次被中断。如果中断调用时线程已经不处于活动状态，则返回 false。

## 横向对比
后两个方法的区别横向比较：

isInterrupted()    | interrupted()
-------------------|----------------------
实例方法           | 类方法
判断本线程         | 判断当前线程
仅读取中断状态     | 读取并清除中断状态

## reference

- <https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html>
