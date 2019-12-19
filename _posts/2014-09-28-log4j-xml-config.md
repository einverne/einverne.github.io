---
layout: post
title: "log4j XML 配置"
tagline: ""
description: ""
category: 经验总结
tags: [java, log4j, log4j12, log4j12-config, ]
last_updated:
---

我们都知道 log4j 有两种配置文件的语法，本文主要介绍 XML 格式的配置格式。

log4j XML 配置的一些细节记录。

## priority 和 level 的区别

我们都知道日志打印的级别，从低到高依次是 TRACE, DEBUG, INFO, WARN, ERROR and FATAL.

日常使用中经常会看到 root 或者 logger 节点配置 `<level value="INFO">` 这样的语句，root 节点中也有 priority 的配置

    <logger name="com.package">
        <level value="WARN" />
    </logger>

    <root>
      <priority value ="debug" />
      <appender-ref ref="console" />
    </root>

定义了 priority 的 root 只会将 DEBUG 级别及其以上级别的日志发送到 Appender 中。logger 的 level 同理，只会将 WARN 级别和以上的日志发送到 appender 中。

他们的区别只在于 priority 在 root 中用，level 则 logger 中用。

## appender 中 Threshold 的使用
appender 的配置

    <appender name="fileAppender" class="org.apache.log4j.RollingFileAppender">
       <param name="Threshold" value="ERROR"/>
    </appender>

假设有如下两种情况。

    priority value="DEBUG" and param name="Threshold" value="ERROR"

    priority value="ERROR" and param name="Threshold" value="DEBUG"

1. 第一种情况 Logger 设置优先级 DEBUG，appender Threshold 设置为 ERROR，意味着 logger 会将  DEBUG，INFO，WARN，ERROR 和 FATAL 级别的日志发送到 appender，但是 appender 只会接受 ERROR 和 FATAL 的日志，所以最后日志中只会有 ERROR 和 FATAL 级别的日志。
2. 第二中情况，logger 设置为 ERROR，appender 设置为 DEBUG，意味着 logger 会将 ERROR 和 FATAL 级别日志 pass 到 appender，而 appender 能够接受 DEBUG，INFO，WARN，ERROR，FATAL 级别的日志，但最后的日志中也只有 ERROR 和 FATAL 级别的日志。

所以两者的最后结果是一致的。组合二者的使用能够更有效率的打印测试环境或者生产环境的日志。

## 同一份日志打印到多个地方
定义不同的 appender ，然后在 logger 中定义多个在 pass 到 appender 即可。

## 不同的 package 使用不同的 appender
则在定义 logger 时 name 中指定对应的 package name，然后引用对应的 appender。

## 不同的 appender 相同的文件
log4j 不支持不同的 appender 打印到相同的文件中。

## reference

- <https://stackoverflow.com/a/8994413/1820217>
