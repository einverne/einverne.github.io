---
layout: post
title: "Spring 中 ThreadPoolTaskExecutor 配置"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, thread, thread-pool, ]
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

- corePoolSize：线程池维护线程的最少数量
- keepAliveSeconds：允许的空闲时间
- maxPoolSize：线程池维护线程的最大数量
- queueCapacity：缓存队列
- rejectedExecutionHandler：对拒绝 task 的处理策略

	AbortPolicy，用于被拒绝任务的处理程序，它将抛出 RejectedExecutionException。
	CallerRunsPolicy，用于被拒绝任务的处理程序，它直接在 execute 方法的调用线程中运行被拒绝的任务。
	DiscardOldestPolicy，用于被拒绝任务的处理程序，它放弃最旧的未处理请求，然后重试 execute。
	DiscardPolicy，用于被拒绝任务的处理程序，默认情况下它将丢弃被拒绝的任务。

将任务添加到线程池时：

- 如果线程池中的线程数量小于 corePoolSize，即使线程池中的线程都处于空闲状态，也要创建新的线程来处理被添加的任务。
- 如果线程池中的线程数量等于 corePoolSize，但是缓冲队列 workQueue 未满，那么任务被放入缓冲队列。
- 如果线程池中的线程数量大于 corePoolSize，缓冲队列 workQueue 满，并且线程池中的数量小于 maxPoolSize，建新的线程来处理被添加的任务。
- 如果线程池中的数量大于 corePoolSize，缓冲队列 workQueue 满，并且线程池中的数量等于 maxPoolSize，那么通过 handler 所指定的策略来处理此任务。也就是：处理任务的优先级为：核心线程 corePoolSize、任务队列 workQueue、最大线程 maximumPoolSize，如果三者都满了，使用 handler 处理被拒绝的任务。
- 当线程池中的线程数量大于 corePoolSize 时，如果某线程空闲时间超过 keepAliveTime，线程将被终止。这样，线程池可以动态的调整池中的线程数。

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

## reference

- <https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/scheduling.html>
