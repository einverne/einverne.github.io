---
layout: post
title: "Java 查漏补缺之并发编程 ExecutorService"
aliases: "Java 查漏补缺之并发编程 ExecutorService"
tagline: ""
description: ""
category: Java
tags: [java, thread, runnable, callable, executor, threadpool, ]
last_updated:
---

Java 实现多线程，继承 Thread 类，另一种就是实现 Runnable 接口。实际 Thread 类源码也是实现了 Runnable，使用继承 Thread 方式创建多线程，最大的局限就是不能多继承，随意推荐实现 Runnable 。

## Executor
Java 5 开始， Java 并发 API 提供了一套执行器框架 Executor Framework，围绕 Executor 接口和它的子接口 ExecutorService ，以及实现这两个接口的 ThreadPoolExecutor 类展开。这套机制将任务创建和执行分离。执行器通过创建所需的线程来负责 Runnable 对象的创建、实例化和运行。执行器使用线程池来提高应用性能。

执行器另一个优势是 Callable 接口，类似于 Runnable 接口，但是 Callable 接口的 `call()` 方法能够返回接口；当发送 Callable 对象给 Executor 时，将获得一个实现了 Future 接口的对象，通过这个对象，可以用来控制 Callable 的状态和结果。

Executor 是一个接口，用来表示一个对象能够接受 task 来执行。

执行器需要显示的结束它，否则程序不会结束。执行器没有任何任务可以执行，那么会一直等待。

## ExecutorService

ExecutorService 接口继承 Executor 接口，提供做了更多管理生命周期的方法，他提供了内存队列，并且可以通过当前线程的可用性来安排任务执行。

    public interface ExecutorService extends Executor {
        void shutdown();
        List<Runnable> shutdownNow();
        boolean isShutdown();
        boolean isTerminated();
        boolean awaitTermination(long timeout, TimeUnit unit);
        <T> Future<T> submit(Callable<T> task);
        <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks);
        <T> T invokeAny(Collection<? extends Callable<T>> tasks);
    }

几个重要的方法：

- `submit` 方法调用 Executor.execute() 然后返回 Future
- `invokeAny` 和 `invokeAll` 方法来提交一个集合任务，然后等待
- `shutdown` 方法平稳关闭，不再接受新任务，同时等待已经提交的任务执行完毕，包括还未开始的任务
- `shutdownNow` 方法将直接关闭过程，将尝试取消所有运行中的任务，不再启动队列中尚未开始的任务

ExecutorService 的生命周期有三种：运行，关闭和已终止。

- ExecutorService 创建初期处于运行状态
- 当所有任务都完成就进入终止状态

## Executors
Executors 是一个工具类。 Executors 类中有很多创建线程池的方法，这些方法都是调用

```
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) { ... }
```

参数说明

- `corePoolSize` 核心线程数，当前线程数没有达到 coolPoolSize，会创建线程
    - 核心线程一般不会被销毁即使是空闲的，如果通过 `allowCoreThreadTimeOut` 设置了超时，也会被销毁
- `maximumPoolSize` 最大线程数，可同时活动的线程数量上限
    - 当核心线程无空闲，队列已满的时候会创建临时线程
- `keepAliveTime` 超时时间，当某个线程空闲时间超过存活时间，会被标记为回收（默认用于非核心线程），当线程池大小超过基本大小时，该线程会被销毁
- `TimeUnit` 超时时间单位
- `workQueue` 缓冲队列，等待执行的任务队列，如果核心线程没有空闲，新来的任务会被放入到队列，队列可以分为有界和无界，决定了运行策略
    - 有界，队列长度有限，核心线程无空闲，新任务进入队列，队列满，创建临时线程（警惕临时线程无线增加风险）
    - 无界，核心线程无空闲，新任务添加到队列，不会创建临时线程（警惕队列任务无线增加风险）
- `threadFactory` 线程工厂，创建线程的方式，线程名，是否后台执行等等
- `handler` 拒绝策略，没有空闲线程处理任务，队列已满，再有新任务添加，这个参数指定策略：
    - ThreadPoolExecutor.AbortPolicy：直接抛出异常，这是默认策略；
    - ThreadPoolExecutor.DiscardPolicy：直接丢弃任务，但是不抛出异常。
    - ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后将新来的任务加入等待队列
    - ThreadPoolExecutor.CallerRunsPolicy：由线程池所在的线程处理该任务，比如在 main 函数中创建线程池，如果执行此策略，将有 main 线程来执行该任务

虽然不提倡使用 Executors 中的方法来直接创建线程池，但也需要了解一下几种常见的线程池。

在 Executors 中提供了很多静态方法：

- `newFixedThreadPool(int)` 固定长度线程池
- `newCachedThreadPool()` 可缓存线程池，线程池规模不存在任何限制
- `newSingleThreadExecutor()` 单线程 Executor，如果这个线程出现异常，将创建新的线程补充。能够确保任务在队列中顺序执行，FIFO
- `newScheduledThreadPool(int)` 固定长度线程池，延迟或定时执行任务，类似 Timer

## ScheduledExecutorService
ScheduledExecutorService 和 ExecutorService 接口类似，但是提供了定时任务的方法。

## Future
Future 用来表示异步操作的结果。他有方法可以用来检测任务有没有完成，也有方法来获取异步任务的结果。

## volatile
关键字 volatile 主要作用是让变量在多个线程间可见。

volatile vs synchronized

- volatile 关键字是程序同步轻量级实现，性能稍好，volatile 只能修饰变量，而 synchronized 可以修饰方法，代码块
- 多线程访问 volatile 不会阻塞， synchronized 会阻塞
- volatile 能保证数据可见性，不能保证原子性；synchronized 可以保证原子性，也能间接保证可见性，synchronized 会将私有内存和公共内存的数据同步。

## thread setDaemon(boolean)
关于 Thread 类中 `setDaemon(boolean)` 中的 daemon 方法，一个守护线程是程序运行结束仍然运行的线程，垃圾回收线程就是典型的例子。在 Java 中有两类线程：User Thread（用户线程）、Daemon Thread（守护线程） 。只要当前 JVM 实例中尚存在任何一个非守护线程没有结束，守护线程就全部工作；只有当最后一个非守护线程结束时，守护线程随着 JVM 一同结束工作。

User 和 Daemon 两者几乎没有区别，唯一的不同之处就在于虚拟机的离开：如果 User Thread 已经全部退出运行了，只剩下 Daemon Thread 存在了，虚拟机也就退出了。 因为没有了被守护者，Daemon 也就没有工作可做了，也就没有继续运行程序的必要了。


## 常见的线程池
可缓存线程池

```
Executors.newCacheThreadPool()
```

线程池为无限大，当执行当前任务时上一个任务已经完成，会复用执行上一个任务的线程

可重用固定个数的线程池

```
Executors.newFixedThreadPool(int n)
```

固定长度，定时：

```
Executors.newScheduledThreadPool(int n)
```

单线程化的线程池

```
Executors.newSingleThreadExecutor()
```

## 缓冲队列

BlockingQueue是双端队列。

- ArrayBlockingQueue 有界队列
- LinkedBlockingQueue 无界队列
- PriorityBlockingQueue
- SynchronizedQueue


假设队列大小为 10，corePoolSize 为 3，maximumPoolSize 为 6，那么当加入 20 个任务时，执行的顺序就是这样的：首先执行任务 1、2、3，然后任务 4~13 被放入队列。这时候队列满了，任务 14、15、16 会被马上执行，而任务 17~20 则会抛出异常。

最终执行顺序大略是：1、2、3、14、15、16、4、5、6、7、8、9、10、11、12、13。

## TheadFactory
