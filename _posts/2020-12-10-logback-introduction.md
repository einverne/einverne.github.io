---
layout: post
title: "Logback 基本使用介绍"
aliases: 
- "Logback 基本使用介绍"
tagline: ""
description: ""
category: 学习笔记
tags: [logback, spring, java, logger, slf4j,]
last_updated:
---

[[Logback]] 是 log4j 的创始人开发设计的另一个开源日志组件，期望成为 `log4j` 项目的继任者，相较于 log4j，Logback 有一些[优势](http://logback.qos.ch/reasonsToSwitch.html)。

- 更快的实现，更小的内存占用
- 充分的测试，Extensive battery of tests
- 可以直接使用 [[SLF4J]] 接口
- 健全的文档
- 可以通过 XML 或 Groovy 进行配置
- Logback 可以在配置更改后自动加载
- 可以优雅的从 IO 失败中恢复
- 自动移除老的日志存档
- 自动压缩存档日志文件
- 在 Prudent mode 模式中，在不同 JVMs 中运行的不同 FileAppender 实例可以安全地写到同一个文件中
- Lilith，Log 事件的观察者
- Conditional processing of configuration files
- Filters，过滤器，要诊断问题，在 Log4j 中，只有降低日志级别才会打印日志，但这样会打出大量的日志，影响性能，但是 Logback 可以继续保持日志级别，而单独添加一个过滤器，比如过滤某用户的登录日志，将其打印在 DEBUG 级别，而其他用户的日志继续打印在 WARN 级别，可以参考 [[MDCFilter]]
- SiftingAppender，多功能的 Appender，可以根据给定的参数对日志文件进行切分，比如根据用户的 ID 进行切分， 每个用户都会有一个日志文件
- Stack traces with packaging data
- Logback-access

## 模块

Logback 划分成三个模块：

- logback-core 基础模块
- logback-classic 这是 Log4j 的改良版本，完整实现了 slf4j，可以很方便的切换成其他日志系统比如 log4j 或 JDK Logging
- logback-access 访问模块和 Servlet 容器集成，提供 HTTP 访问日志

Maven 依赖：

```
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>${logback.version}</version>
</dependency>
```

## logback 配置

- Logger 是日志的记录器，关联到应用的 context ，用于存放日志对象，可以定义日志级别、类型
- Appender 负责指定日志输出的目的地，可以是控制台，文件，远程套接字，MySQL，PostgreSQL，Oracle 等数据库，JMS 和远程 Unix Syslog 守护进程等等
- Layout 负责把事件转换成字符串，格式化日志信息的输出

## 默认配置

应用在启动时按如下的顺序寻找配置文件：

- 在 `classpath` 中 `logback-test.xml` 文件
- `logback.groovy`
- `logback.xml`
- 上述文件都找不到，JDK 的 SPI 机制查找 `META-INF/services/ch.qos.logback.classic.spi.Configurator` 中的 logback 配置实现类
- 如果都不成功，则使用自带的 `BasicConfigurator` 来配置，并将日志输出到 console。

配置文件 `logback-test.xml` 或 `logback.xml` 都不存在， logback 会默认调用 BasicConfigurator，创建最小化配置。最小化配置由一个关联到根 logger 的 ConsoleAppender 组成。输出用模式为 `%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n` 的 PatternLayoutEncoder 进行格式化。root logger 默认级别是 DEBUG。

配置文件格式：

```
<configuration>
    <appender>    //输出到控制台的信息配置
       //....
    </appender>

    <appender>   //输出到info文件的配置
       //...
    </appender>

    <appender>   //输出到error文件的配置
    </appender>

    <logger>     //特殊处理日志定义
        //..
    </logger>

    <root level="debug">  //总日志开关
        //...
    </root>
</configuration>
```

### Logback 配置文件

- 以 `configuration` 开头，后面有 0 个或多个 `<appender>` 元素，0 个或多个 `<logger>`，最多有一个 `<root>` 元素。

## related

[[2020-12-10-logback-xml-config]]
[[2020-12-10-logback-usage]]

## 文档

- [Java docs](http://logback.qos.ch/apidocs/index.html)
- [Source code](http://logback.qos.ch/xref/index.html)
