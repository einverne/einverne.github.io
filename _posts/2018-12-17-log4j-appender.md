---
layout: post
title: "log4j appender"
aliases: "log4j appender"
tagline: ""
description: ""
category: 学习笔记
tags: [log, java, log4j ,slf4j, ]
last_updated:
---

Appender 表示日志输出的地方，常见的有控制台，文件等等，log4j 自带了一些常用的 Appender。

## 日志中的 LEVEL 和 threshhold

log4j 框架中有两个概念 logger 和 appender。如果 logger 的最低 level 设置为 warn，这意味着任何日志 level 低于 warn 的日志都会被忽略。

一旦一个消息被 logger 接收，这条消息会被发送给一个或者多个 appenders（to console，to file，to mail server, etc). 每一个 appender 都会定义 threshold。比如可以限制打印到 console 的消息为 error，但是打印到文件的日志接收 warn 及以上。[^1]

[^1]: https://stackoverflow.com/a/5120069/1820217

## ConsoleAppender
可能是最常见的一个 Appender，输出到控制台，ConsoleAppender 将日志事件输出到 System.out 或者 System.err 中。

    <appender name="console-appender" class="org.apache.log4j.ConsoleAppender">
      <layout class="org.apache.log4j.PatternLayout">
        <param name="ConversionPattern"
          value="%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n" />
      </layout>
    </appender>

## AsyncAppender

AsyncAppender 允许用户异步（asynchronously) 地打印日志，AsyncAppender 会收集所有发送到它的事件，并将它们分发到所有附加在它的 appenders 中。可以在 AsyncAppender 上附属多个 appenders。

AsyncAppender 会使用单独的线程来处理它缓冲区中的事件。

Important note: The AsyncAppender can only be script configured using the DOMConfigurator.

## FileAppender
将日志 event 输出到文件，直接子类有 DailyRollingFileAppender，和 RollingFileAppender。

可选的 append 配置表示是否在原来的文件内容上追加日志，如果是 false，log4j 会清理文件内容，每次重启程序，原来的日志文件会丢失，默认为 true，日志文件会越来越大。

## RollingFileAppender
RollingFileAppender 继承自 FileAppender 用来配置当日志文件到达一定大小则自动备份日志文件到其他地方。

两个参数 maxFileSize 和 maxBackupIndex

    <appender name="file" class="org.apache.log4j.RollingFileAppender">
      <param name="append" value="false"/>
      <param name="maxFileSize" value="10KB"/>
      <param name="maxBackupIndex" value="5"/>
      <param name="file" value="/tmp/jutils/jutils.log"/>
      <layout class="org.apache.log4j.PatternLayout">
        <param name="ConversionPattern"
          value="%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n"/>
      </layout>
    </appender>

## DailyRollingFileAppender

DailyRollingFileAppender 继承自 FileAppender，定义的日志文件在用户指定的频率下会定时产生新的日志文件。

日志周期由 DatePattern 选项定义，模式需要遵循 SimpleDateFormat 格式，此处定义的日期格式会作为滚动日志文件的后缀。

举例，如果 File 选项设置为 `/foo/bar.log` 并且 DatePattern 设置为 "'.'yyyy-MM-dd"，那么在 2001-02-16 的午夜，日志文件 `/foo/bar.log` 文件会被拷贝到 `/foo/ba.log.2001-02-16`，然后在 `/foo/bar.log` 日志文件中会继续记录 2001-02-17 的日志。

    <appender name="dailyRolling" class="org.apache.log4j.DailyRollingFileAppender">
      <param name="File"  value="/tmp/jutils/roll_jutils.log"/>
      <param name="DatePattern" value=".yyyyMMdd"/>
      <param name="threshold" value="error"/>
      <layout class="org.apache.log4j.PatternLayout">
        <param name="ConversionPattern" value="%d{ISO8601} %-5p [%t] [%l] - %m%n"/>
      </layout>
    </appender>

DailyRollingFileAppender 同样支持指定按照月，星期，半天，天，小时，分钟间隔的分割配置。

DatePattern     | Rollover schedule     | Example
----------------|-----------------------|--------
'.'yyyy-MM      | 每月初                |
'.'yyyy-ww      | 每个星期第一天，每星期第一天由地区决定    |
'.'yyyy-MM-dd   | 每天 midnight         |
'.'yyyy-MM-dd-a | 每天 midnight 和 midday |
'.'yyyy-MM-dd-HH | 每个小时     |
'.'yyyy-MM-dd-HH-mm     | 每分钟开始时  |

不要在 DatePattern 选项中使用冒号 `:` .

## 自定义 Appender
自定义 Appender 以实现在记录日志时将其中部分信息过滤。

    import org.apache.log4j.DailyRollingFileAppender;
    import org.apache.log4j.spi.LoggingEvent;

    public class SensitiveDailyRollingFileAppender extends DailyRollingFileAppender {

        @Override
        protected void subAppend(LoggingEvent event) {
            String message = (String) event.getMessage();
            String modifiedMessage = SensitiveUtils.filterName(message);
            modifiedMessage = SensitiveUtils.filterName(modifiedMessage);
            modifiedMessage = SensitiveUtils.filterIdentityId(modifiedMessage);
            LoggingEvent modifiedEvent = new LoggingEvent(event.getFQNOfLoggerClass(), event.getLogger(), event.getTimeStamp(), event.getLevel(), modifiedMessage,
                    event.getThreadName(), event.getThrowableInformation(), event.getNDC(), event.getLocationInformation(),
                    event.getProperties());
            super.subAppend(event);
        }
    }

如果想要更加基础可以继承 AppenderSkeletion，需要实现三个方法

- protected void append(LoggingEvent loggingEvent)   打印日志核心方法
- public void close()  关闭资源
- public boolean requiresLayout()  是否需要 Layout

复写 append 方法实现自己的内容。

## reference

- <https://logging.apache.org/log4j/1.2/manual.html>
- <https://stackoverflow.com/a/7769428/1820217>
