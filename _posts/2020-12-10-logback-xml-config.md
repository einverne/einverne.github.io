---
layout: post
title: "logback.xml 配置详解"
aliases: 
- "logback.xml 配置详解"
tagline: ""
description: ""
category: 学习笔记
tags: [logback, spring, logger, log, logging, slf4j, java, java-log, ]
last_updated:
---

之前两篇文章简单的介绍了 [[Logback]] 是什么，以及基本的使用，这一篇文章着重说一下 Logback 中最重要的 `logback.xml` 配置文件的编写。

![[Pasted image 20201210145047.png]]

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

- appender 配置打印行为，比如将日志输出到控制台，文件，数据库，网络端口等等
  - 可以配置多个 appender
- logger 用来处理特定的包和类

## 根节点

根节点 `<configuration>` 包含三个属性：

- `scan`: 为 true 时，如果配置改表会重新加载，默认是 true
- `scanPeriod`: 检测配置文件修改的时间间隔，默认单位毫秒，默认时间间隔 1 分钟
- `debug`: 为 true 时，打印 logback 内置日志信息，实时查看 logback 运行状态，默认 false

例如：

```
<configuration scan="true" scanPeriod="60 seconds" debug="false">
　　  <!--其他配置省略-->
</configuration>　
```

## 子节点

### contextName 子节点

子节点 `<contextName>`，设置上下文名称。

```
<configuration scan="true" scanPeriod="60 seconds" debug="false">
     <contextName>myAppName</contextName>
　　  <!--其他配置省略-->
</configuration>
```

### property 子节点

用来定义变量值，两个属性 `name` 和 `value`，通过 `<property>` 定义的值会被插入到 Logger 上下文中，可以使用 `${}` 来使用。

```
<configuration scan="true" scanPeriod="60 seconds" debug="false">
　　　<property name="APP_Name" value="myAppName" />
　　　<contextName>${APP_Name}</contextName>
　　　<!--其他配置省略-->
</configuration>
```

### timestamp 子节点

获取时间戳字符串

- key：标识此 timestamp 名字
- datePattern：设置当前时间，遵循 `java.text.SimpleDateFormat`

```
<configuration scan="true" scanPeriod="60 seconds" debug="false">
　　<timestamp key="bySecond" datePattern="yyyyMMdd'T'HHmmss"/>
　　<contextName>${bySecond}</contextName>
　　<!-- 其他配置省略-->
</configuration>
```

### appender 子节点

appender 是负责写日志的组件，两个属性：

- `name`，指定 appender 名字
- `class`，指定 appender 全限定名

logback 实现了一些内置的 appender，可以将日志输出到控制台，文件等等地方。

```
<appender name="file-appender" class="ch.qos.logback.core.rolling.RollingFileAppender">
  ....
</appender>
```

内置的 appender:

- ConsoleAppender
- FileAppender
- RollingFileAppender

#### ConsoleAppender 控制台输出

将日志输出到控制台（Console），两个子节点：

- `<encoder>`: 对日志输出格式化
- `<target>`: 字符串 `System.out` 或 `System.err`

例如：

```
<configuration>
　　　<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
　　　　　 <encoder>
　　　　　　　　　<pattern>%-4relative [%thread] %-5level %logger{35} - %msg %n</pattern>
　　　　　 </encoder>
　　　</appender>

　　　<root level="DEBUG">
　　　　　　<appender-ref ref="STDOUT" />
　　　</root>
</configuration>
```

#### FileAppender

将日志输出到文件（FileAppender），子节点：

- `<file>`: 被写入的文件名
- `<append>`: 如果是 true，日志被追加到文件结尾，false 则清空现存文件，默认为 true
- `<encoder>`: 对记录事件进行格式化
- `<prudent>`: 如果是 true，日志会被安全地写入文件（其他 FileAppender 也在向此文件做写入操作）效率低，默认是 false

```
<configuration>
　　<appender name="FILE" class="ch.qos.logback.core.FileAppender">
　　　　<file>testFile.log</file>
　　　　<append>true</append>
　　　　<encoder>
　　　　　　<pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
　　　　</encoder>
　　</appender>

　　<root level="DEBUG">
　　　　<appender-ref ref="FILE" />
　　</root>
</configuration>
```

#### RollingFileAppender

滚动日志，记录日志到文件，当符合某条件时，将日志记录到其他文件。子节点：

- `<file>`: 文件名
- `<append>`: true 时，追加到文件结尾，false 时 清空现存文件，默认为 true
- `<rollingPolicy>`: 滚动策略，定义 Rolling 的行为策略

##### 根据时间滚动

定义 `class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy"` 根据时间来记录日志。

- `<fileNamePattern>`: 文件名的命名方案，`%d` 可以包含一个符合 `java.text.SimpleDateFormat` 格式的时间，比如 `%d{yyyy-MM-dd}`。如果直接使用 `%d` 默认是 `yyyy-MM-dd`
- `<file>`: 当前日志总是记录到 file 指定的文件，非必需
- `<maxHistory>`: 可选，保留归档文件的最大数量

比如配置每天生成一个日志文件，保存 30 天日志。

```
<configuration>
　　　<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
　　　　　　<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
　　　　　　　　　<fileNamePattern>logFile.%d{yyyy-MM-dd}.log</fileNamePattern>
　　　　　　　　　<maxHistory>30</maxHistory>
　　　　　　</rollingPolicy>
　　　　　　<encoder>
　　　　　　　　　<pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
　　　　　　</encoder>
　　　</appender>

　　　<root level="DEBUG">
　　　　　　<appender-ref ref="FILE" />
　　　</root>
</configuration>
```

##### 根据文件大小滚动

定义 `class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy"`，超过大小滚动。

- `<maxFileSize>`: 默认大小是 10MB
- `<prudent>`: 当为 true 时，不支持 FixedWindowRollingPolicy

##### 根据固定窗口算法重命名文件滚动策略

- `<minIndex>`: 窗口索引最小值
- `<maxIndex>`: 窗口索引最大值
- `<fileNamePattern>`: 必须包含 `%i` ，假设最小和最大为 1 和 2，命名模式是 `mylog-%i.log`，会产生归档文件 `mylog-1.log` 和 `mylog-2.log`。可以指定压缩选项。

按照固定窗口模式生成日志文件，文件大于 5 MB 时，生成新的日志文件，窗口大小是 1 到 3，保存了 3 个归档文件后，覆盖最早的日志。

```
<configuration>
　　　<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
　　　　　　<file>test.log</file>

　　　　　　<rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">
　　　　　　　　　　<fileNamePattern>tests.%i.log.zip</fileNamePattern>
　　　　　　　　　　<minIndex>1</minIndex>
　　　　　　　　　　<maxIndex>3</maxIndex>
　　　　　　</rollingPolicy>

　　　　　　<triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
　　　　　　　　　　<maxFileSize>5MB</maxFileSize>
　　　　　　</triggeringPolicy>
　　　　　　<encoder>
　　　　　　　　　<pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>
　　　　　　</encoder>
　　　</appender>

　　　<root level="DEBUG">
　　　　　　<appender-ref ref="FILE" />
　　　</root>
</configuration>
```

#### AsyncAppender

异步日志

```
<appender name ="ASYNC_UTIL_LOG" class="ch.qos.logback.classic.AsyncAppender">
        <discardingThreshold>0</discardingThreshold>
        <queueSize>512</queueSize>
        <neverBlock>true</neverBlock>
        <appender-ref ref="UTIL_LOG"/>
    </appender>

    <logger name="com.test.util" level="DEBUG" additivity="false" >
        <appender-ref ref="ASYNC_UTIL_LOG"/>
    </logger>
```

##### 其他 Appender

还有其他的 Appender 具体可以参考[官方文档](http://logback.qos.ch/documentation.html)：

- SocketAppender
- SMTPAppender
- DBAppender
- SyslogAppender
- SiftingAppender

### logger 子节点

用来设置某一个包或具体的某一个类的日志打印级别，执行 appender。

Logger 是 Logback 另一个重要的组成部分，开发者可以将日志信息用特定的等级输出。Logback 定义了 5 个等级的日志级别：TRACE, DEBUG, INFO, WARN, ERROR。

每一个等级都对应着一个特定的方法, `trace()`, `debug()`, `info()`, `warn()`, `error()`。

```
<!-- show parameters for hibernate sql 专为 Hibernate 定制 -->
<logger name="org.hibernate.type.descriptor.sql.BasicBinder" level="TRACE" />
<logger name="org.hibernate.type.descriptor.sql.BasicExtractor" level="DEBUG" />
<logger name="org.hibernate.SQL" level="DEBUG" />
<logger name="org.hibernate.engine.QueryParameters" level="DEBUG" />
<logger name="org.hibernate.engine.query.HQLQueryPlan" level="DEBUG" />

<!--myibatis log configure-->
<logger name="com.apache.ibatis" level="TRACE"/>
<logger name="java.sql.Connection" level="DEBUG"/>
<logger name="java.sql.Statement" level="DEBUG"/>
<logger name="java.sql.PreparedStatement" level="DEBUG"/>
```

## 多环境配置

根据不同的环境，配置不同的日志输出。

日志的名称不是 `logback.xml`，如果要使用 Spring 扩展，要以 `logback-spring.xml` 命名。

```
<springProfile name="test,dev">
    <logger name="com.dudu.controller" level="info" />
</springProfile>
<!-- 生产环境. -->
<springProfile name="prod">
    <logger name="com.dudu.controller" level="ERROR" />
</springProfile>
```

## reference

- <https://logback.qos.ch/manual/appenders.html>
