---
layout: post
title: "Java 定时任务框架 Job-scheduling Quartz 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [java, quartz, schedule, cronjob, ]
last_updated:
---

Quartz is a richly featured, open source job scheduling library that can be integrated within virtually any Java application - from the smallest stand-alone application to the largest e-commerce system.

## Setup

    <dependency>
        <groupId>org.quartz-scheduler</groupId>
        <artifactId>quartz</artifactId>
        <version>2.2.1</version>
    </dependency>

## Usage

客户端调用

    JobDetail job = newJob(MyJob.class)
        .withIdentity("myJob")
        .build();

    Trigger trigger = newTrigger()
        .withIdentity(triggerKey("myTrigger", "myTriggerGroup"))
        .withSchedule(simpleSchedule()
            .withIntervalInHours(1)
            .repeatForever())
        .startAt(futureDate(10, MINUTES))
        .build();

    scheduler.scheduleJob(job, trigger);

## Source Code

StdSchedulerFactory 是 Scheduler 的工厂方法，实现了 SchedulerFactory 接口。

    // 提供客户端可用的 Scheduler
    Scheduler getScheduler() throws SchedulerException;
    // 通过名字获取
    Scheduler getScheduler() throws SchedulerException;
    // 返回当前 JVM 中通过该 Factory 创建的所有 Scheduler
    Collection<Scheduler> getAllSchedulers() throws SchedulerException;



SchedulerRepository 单例，内部持有一个 Map `HashMap<String, Scheduler> schedulers`

类中，绑定 (bind)，解绑 (remove) 都为同步方法，保证线程安全。

### Scheduler
Scheduler 是一个很庞大的接口，它的实现主要有

- RemoteScheduler, via RMI
- StdScheduler, std
- JBoss4RMIRemoteMBeanScheduler, via JBoss's JMX RMIAdaptor

Quartz 的核心实现也基本都在这些实现类中，Scheduler 可以用来定时触发任务。


### CronScheduleBuilder
CronScheduleBuilder 用来将字符串的 cron 表达式变成 CronScheduleBuilder 对象，ScheduleBuilder 是一个抽象类

    public class CronScheduleBuilder extends ScheduleBuilder<CronTrigger> {
        public static CronScheduleBuilder cronSchedule(String cronExpression) { }
    }

主要的实现有：

- CronScheduleBuilder 主要实现 cron 定时任务，通过字符表达式
- SimpleScheduleBuilder 比较简单的 ScheduleBuilder
- CalendarIntervalScheduleBuilder 看例子 `withIntervalInDays(3)` 每隔 3 天，如果要使用固定间隔的可以看一下这个
- DailyTimeIntervalScheduleBuilder 看例子比较简单 `onDaysOfTheWeek(MONDAY, THURSDAY)` , 每一个周一和周四

比如

    CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(job.getCronExpr());
    trigger = TriggerBuilder.newTrigger().withIdentity(triggerId).withSchedule(scheduleBuilder)
        .forJob(jobDetail).build();
    scheduler.scheduleJob(jobDetail, trigger);


