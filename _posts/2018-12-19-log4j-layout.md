---
layout: post
title: "log4j PatternLayout 输出模板"
tagline: ""
description: ""
category: 学习笔记
tags: [log4j, java, log, ]
last_updated:
---

log4j 下的 PatternLayout 只是 Layout 的一种，用来格式化日志文件的输出。在 PatternLayout 中，配置一个样板字符串，通过该字符串来定义输出格式。

log4j 还提供了其他三种 Layout

- org.apache.log4j.HTMLLayout（以 HTML 表格形式布局）
- org.apache.log4j.SimpleLayout（包含日志信息的级别和信息字符串）
- org.apache.log4j.TTCCLayout（包含日志产生的时间、线程、类别等等信息）


这个类的目标是格式化 LoggingEvent 输出结果，这个结果依赖 `conversion pattern`.

conversion pattern 和 C 语言下面的 printf 方法非常类似。conversion patter 由逐字文本和格式化控制表达式（conversion specifiers) 组成。

每一个 conversion specifiers 都由一个 `%` 开始，紧跟着一个可选的 format modifiers （被称为 conversion character)。conversion character 指定了类型，比如日期，线程名。format modifiers z 则控制字段宽度，padding，左右调整。

比如 `%-5p [%t]: %m%n` 配置

    root.debug("Message 1");
    root.warn("Message 2");

则会输出

    DEBUG [main]: Message 1
    WARN  [main]: Message 2


ConversionPattern 参数的格式含义

格式名的含义：

    %c 输出日志信息所属的类的全名
    %C 调用 logger 的类的全名（包含包路径）
    %d 输出日志时间点的日期或时间，默认格式为 ISO8601，也可以在其后指定格式，比如：%d{yyy-MM-dd HH:mm:ss }，输出类似：2002-10-18- 22：10：28
    %f 输出调用 logger 所属的类的类名
    %l 输出日志事件的发生位置，类，线程，代码行数
    %L 调用 logger 的代码行
    %m 输出代码中指定的信息，如 log(message) 中的 message
    %M 调用 logger 的方法名
    %n 输出当前平台的换行符，Windows 平台为“\r\n”，Unix 平台为“\n”
    %p 输出日志的优先级，即 DEBUG，INFO，WARN，ERROR，FATAL。如果是调用 debug() 输出的，则为 DEBUG，依此类推
    %r 输出自应用启动到输出该日志信息所耗费的毫秒数
    %t 输出产生该日志事件的线程名


## reference

- <https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/PatternLayout.html>
