---
layout: post
title: "Logback 使用"
aliases: 
- "Logback 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [logback, slf4j, spring, java, logger,]
last_updated:
---

Logback 在之前的[文章](/post/2020/12/logback-introduction.html)中说过，是一个开源日志组件。

[[Logback]] 推荐和 SLF4J 一起使用。

## Maven 依赖

```
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <logback.version>1.1.7</logback.version>
    <slf4j.version>1.7.21</slf4j.version>
</properties>

<dependencies>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>${slf4j.version}</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-core</artifactId>
      <version>${logback.version}</version>
    </dependency>
    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-classic</artifactId>
      <version>${logback.version}</version>
      </dependency>
</dependencies>
```

## logback.xml

logback 简单配置：

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoders are assigned the type ch.qos.logback.classic.encoder.PatternLayoutEncoder
            by default -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n
            </pattern>
        </encoder>
    </appender>
    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

具体的注释写在配置代码中。

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <!--定义日志文件的存储地址 勿在 Logback 的配置中使用相对路径-->
    <property name="LOG_HOME" value="/home" />
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>
    <!-- 配置每天滚动生成日志文件 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--日志文件输出的文件名-->
            <FileNamePattern>${LOG_HOME}/TestWeb.log.%d{yyyy-MM-dd}.log</FileNamePattern>
            <!--日志文件保留天数-->
            <MaxHistory>30</MaxHistory>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
        <!--日志文件最大的大小-->
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>10MB</MaxFileSize>
        </triggeringPolicy>
    </appender>

    <!-- 日志输出级别 -->
    <root level="INFO">
    <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

在 Java 代码中

```
　　public class App {

　　private final static Logger logger = LoggerFactory.getLogger(App.class);

　　　　public static void main(String[] args) {
　　　　　　logger.info("logback 成功了");
　　　　　　logger.error("logback 成功了");
　　　　　　logger.debug("logback 成功了");
　　　　}
　　}
```
