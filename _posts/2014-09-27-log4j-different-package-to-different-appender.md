---
layout: post
title: "log4j 根据 package 打印日志到不同目的地"
tagline: ""
description: ""
category: 经验总结
tags: [log4j, log4j12, log4j12-conf, log4j12-xml, ]
last_updated:
---

log4j 可以配置不同的包打印到不同的 appender 中，通过在配置中添加如下配置。

    <!-- 这里的 additivity 配置了该 package 下的 appender 是否需要传递到 root , 默认为 true , 造成日志打印两遍 -->
    <logger name="com.jutils.appender.LogLevelATest" additivity="false">
      <level value="INFO"/>
      <appender-ref ref="consoleAppender"/>
    </logger>
    <logger name="com.jutils.appender.LogLevelBTest" >
      <level value="WARN"/>
    </logger>

定义 logger 在 name 中指定需要 include 的 package full path，然后在 appender-ref 中指定需要打到的 Appender 中。
