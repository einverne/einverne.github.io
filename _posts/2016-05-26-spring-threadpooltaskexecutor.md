---
layout: post
title: "Spring 中 ThreadPoolTaskExecutor 配置"
aliases: "Spring 中 ThreadPoolTaskExecutor 配置"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, thread, thread-pool, queue, ]
last_updated:
---

The Spring Framework provides abstractions for asynchronous execution and scheduling of tasks with the TaskExecutor and TaskScheduler interfaces, respectively.

## The Spring TaskExecutor abstraction
Spring’s TaskExecutor interface is identical to the java.util.concurrent.Executor interface.

接口 ExecutorService 的几个常用方法：

- submit() 有返回值的任务使用
- execute() 无返回值的任务使用
- getActiveCount() 当前活跃线程数

### TaskExecutor types
Spring 提供了一系列的预置的 `TaskExecutor` 的实现，几乎能满足日常的所有需求。

- `SimpleAsyncTaskExecutor` 不复用任何线程，每次调用都新建线程。但是它提供并发数量限制，当调用超过限制时，会阻塞直到线程池中有空余。
- `SyncTaskExecutor` 非异步执行，没有实现异步调用，主要用于简单的测试等等不需要多线程的场景
- `ConcurrentTaskExecutor` 该类适配了 `java.util.concurrent.Executor`，只有在 `ThreadPoolTaskExecutor` 满足不了需求时才考虑用这个类。
- `SimpleThreadPoolTaskExecutor` 这个类的实现实际上是 Quartz 的 `SimpleThreadPool`，它会监听 Spring 生命周期的回调。典型的使用场景是当你需要一个线程池需要和 Quartz 和 non-Quartz 组件共享
- `ThreadPoolTaskExecutor` 最常用的线程池，它在 `java.util.concurrent.ThreadPoolExecutor` 的基础上暴露了一些 bean 的配置，并把它包装在 `TaskExecutor` 中。如果你要适配 `java.util.concurrent.Executor`，推荐可以自定义 `ConcurrentTaskExecutor`。
- `WorkManagerTaskExecutor` This implementation uses the CommonJ WorkManager as its backing implementation and is the central convenience class for setting up a CommonJ WorkManager reference in a Spring context. Similar to the SimpleThreadPoolTaskExecutor, this class implements the WorkManager interface and therefore can be used directly as a WorkManager as well.

### ThreadPoolTaskExecutor Config
Spring 线程池 ThreadPoolTaskExecutor 通过 XML 方式配置：

<!-- spring thread pool executor -->
    <bean id="taskExecutor" class="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor">
        <!-- 线程池维护线程的最少数量 -->
        <property name="corePoolSize" value="5" />
        <!-- 允许的空闲时间 -->
        <property name="keepAliveSeconds" value="200" />
        <!-- 线程池维护线程的最大数量 -->
        <property name="maxPoolSize" value="10" />
        <!-- 缓存队列 -->
        <property name="queueCapacity" value="20" />
		<!-- 线程名前缀 -->
		<property name="threadNamePrefix" value="taskExecutor-thread-"/>
        <!-- 对拒绝 task 的处理策略 -->
        <property name="rejectedExecutionHandler">
            <bean class="java.util.concurrent.ThreadPoolExecutor$CallerRunsPolicy" />
        </property>
    </bean>

属性字段说明：

- `corePoolSize`：核心线程数，线程池维护的最少线程数，不管创建后空闲与否，除非设置了 `allowCoreThreadTimeOut`
- `maxPoolSize`：线程池维护线程的最大数量
- `keepAliveSeconds`：存活时间，允许的空闲时间，如果经过 `keepAliveTime` 时间后，超过核心线程数的线程还没有接受到新的任务，那就回收
- `queueCapacity`：缓存队列
- `rejectedExecutionHandler`：对拒绝 task 的处理策略

	- AbortPolicy，用于被拒绝任务的处理程序，它将抛出 RejectedExecutionException。
	- CallerRunsPolicy，用于被拒绝任务的处理程序，它直接在 execute 方法的调用线程中运行被拒绝的任务。
	- DiscardOldestPolicy，用于被拒绝任务的处理程序，它放弃最旧的未处理请求，然后重试 execute。
	- DiscardPolicy，用于被拒绝任务的处理程序，默认情况下它将丢弃被拒绝的任务。

将任务添加到线程池时：

- 如果线程池中的线程数量小于 `corePoolSize`，即使线程池中的线程都处于空闲状态，也要创建新的线程来处理被添加的任务。
- 如果线程池中的线程数量等于 `corePoolSize`，但是缓冲队列 `workQueue` 未满，那么任务被放入缓冲队列。
- 如果线程池中的线程数量大于 `corePoolSize`，缓冲队列 `workQueue` 满，并且线程池中的数量小于 `maxPoolSize`，建新的线程来处理被添加的任务。
- 如果线程池中的数量大于 `corePoolSize`，缓冲队列 `workQueue` 满，并且线程池中的数量等于 `maxPoolSize`，那么通过 handler 所指定的策略来处理此任务。也就是：处理任务的优先级为：核心线程 `corePoolSize`、任务队列 `workQueue`、最大线程 `maxPoolSize`，如果三者都满了，使用 handler 处理被拒绝的任务。
- 当线程池中的线程数量大于 `corePoolSize` 时，如果某线程空闲时间超过 `keepAliveTime`，线程将被终止。这样，线程池可以动态的调整池中的线程数。

### SimpleAsyncTaskExecutor
SimpleAsyncTaskExecutor 每次都会 newThread()

	protected void doExecute(Runnable task) {
		Thread thread = (this.threadFactory != null ? this.threadFactory.newThread(task) : createThread(task));
		thread.start();
	}

### SyncTaskExecutor
SyncTaskExecutor 在 spring-core-xxx.jar 包中。

SyncTaskExecutor 同步执行

	@Override
	public void execute(Runnable task) {
		Assert.notNull(task, "Runnable must not be null");
		task.run();
	}

### ConcurrentTaskExecutor
ConcurrentTaskExecutor 类在 spring-context-xxx.jar 包中。

ConcurrentTaskExecutor 类中通过 TaskExecutorAdapter 适配了 Executor

	private Executor concurrentExecutor;
	private TaskExecutorAdapter adaptedExecutor;

提交任务时直接通过 adapter 来提交：

	public void execute(Runnable task, long startTimeout) {
		this.adaptedExecutor.execute(task, startTimeout);
	}
	@Override
	public Future<?> submit(Runnable task) {
		return this.adaptedExecutor.submit(task);
	}

	@Override
	public <T> Future<T> submit(Callable<T> task) {
		return this.adaptedExecutor.submit(task);
	}

### SimpleThreadPoolTaskExecutor
SimpleThreadPoolTaskExecutor 类在 spring-context-support-xxx.jar 包中。

SimpleThreadPoolTaskExecutor 继承了 Quartz 的 SimpleThreadPool,

	@Override
	public <T> Future<T> submit(Callable<T> task) {
		FutureTask<T> future = new FutureTask<T>(task);
		execute(future);
		return future;
	}

## 队列的选择

### ArrayBlockingQueue
数组实现的有长度限制的阻塞队列，FIFO 先进先出。

### LinkedBlockingQueue
链表组成的有界队列，FIFO，默认长度是 Integer.MAX_VALUE，如果默认创建该队列一定特别小心容量问题。

### PriorityBlockingQueue
优先级排序的无界队列，默认自然序，可自定义实现 `compareTo()` 方法来定义排序规则（不能保证同优先级的顺序）。


### DelayQueue
使用 PriorityBlockingQueue 实现的延迟无界队列，创建元素时，可以指定延迟时间。

### SynchronousQueue
不存储元素的阻塞队列，每一个 put 操作都需要等待 take。

### LinkedTransferQueue
链表组成的无界阻塞队列，多了 transfer 和 tryTransfer 方法。

### LinkedBlockingQueue
链表组成的双向阻塞队列，头部和尾部都可以添加或移除元素，多线程并发时可以将锁的竞争降一半。

### 选择
对于如何设置线程池中线程的数量，《Java 并发编程实战》中作者给出了一个公式：

	 Number of threads = Number of Available Cores * (1 + Wait time / Service time)

说明：

- wait time 用来表示任务中 IO 花费的时间，比如等待 HTTP 回应，这里的 wait time 也包括 thread 在 WAITING/TIMED_WAITING 状态的时间
- service time, 任务真正处理的时间，比如解析 HTTP 回应内容等等

wait time / service time 这个比率又被称为 blocking coefficient。

对于 CPU 密集型任务，核心线程数可以设置为，CPU 核心数 + 1，在计算密集型的任务中，blocking coefficient 接近于 0，所以线程数约等于 CPU 核心数。但为什么要 +1 呢？

《Java 并发编程实战》一书中给出的原因是：即使当计算（CPU）密集型的线程偶尔由于页缺失故障或者其他原因而暂停时，这个“额外”的线程也能确保 CPU 的时钟周期不会被浪费。

在运行时可以通过 Runtime.availableProcessors 来获取 CPU 核心数。

	int numOfCores = Runtime.getRuntime().availableProcessors();


如果任务是 IO 密集型，则可以适量的调大核心线程数，因为这个时候 wait time / service time 就会响应的增大。

### 举例
假如有一个工作线程来响应一个微服务，序列化一个 JSON，并执行一些规则。微服务的响应时间是 50ms，处理时间是 5ms，然后将应用部署到一台双核处理器的机器上，那么根据上面的公式：

	2 * ( 1 + 50 / 5)  = 22    // 理想的线程池核心线程数

这个例子是一个极端简单的举例，除去 HTTP 线程池外，应用也还有可能有 JDBC 连接线程池，JMS 请求线程池等等。如果现实应用中也遇到各种不同的场景，可以针对不同的场景，使用多个线程池，然后针对不同的使用场景进行调优。

假使有多个线程池，可以在公式中新增一个 Target CPU utilization，取值范围是 [0-1]， `1` 表示线程池会充分利用处理器。


	 Number of threads = Number of Available Cores * Target CPU utilization * (1 + Wait time / Service time)

### Little's Law
通过上面的解释，可以得到一个理想的核心线程数，可以得到一个理论上的核心数上限。但是我们如何知道并发的线程数如何影响延迟 (latency) 和吞吐量 (throughput)？

[Little's law](https://en.wikipedia.org/wiki/Little%27s_law) 可以同来回答这个问题。这条定律认为，系统中的请求数等于它们到达的速度乘以处理单个请求所需的平均时间。我们可以利用该公式来计算需要多少并发线程来处理给定吞吐量并且要求延迟的场景。

	L = λ * W

	L - 并发处理的请求数
	λ – 长期的平均到达率 long-term average arrival rate (RPS)
	W – 处理单个请求的平均时间 the average time to handle the request (latency)

使用该公式，可以计算出系统的容量，需要多少实例同时运行才可以处理给定数量的请求，以及让处理的时间在一个稳定的范围。

回到上面的例子，我们有一个服务平均处理时间是 55ms，50ms wait time 和 5ms service time，核心线程数是 22 。

应用 Little's Law 公式：

	22 / 0.055 = 400 // the number of requests per second our service can handle with a stable response time

## 总结
上面提到的公式并不是银弹 (silver bullet) ，并不能解决所有遇到的问题。这个公式的问题在于，它注重于系统平均能够处理的请求数，所以并不适合于不同场景爆发式的流量情况。所以可以在设计系统时通过上面的公式计算出一个初始的设定，然后通过压测来调整。

## reference

- <https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/scheduling.html>
- <https://jobs.zalando.com/en/tech/blog/how-to-set-an-ideal-thread-pool-size/>
