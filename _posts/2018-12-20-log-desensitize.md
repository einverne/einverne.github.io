---
layout: post
title: "日志数据脱敏方法研究"
tagline: ""
description: ""
category: 经验总结
tags: [log4j, log, desensitize, 日志 , 脱敏 , ]
last_updated:
---

日志文件中的敏感信息比如密码，电话号码等等进行过滤处理。第一个想到的方法就是去 log4j 中自定义 Appender，在 Appender 中正则匹配敏感信息进行过滤。

log4j 日志框架在[之前](/post/2017/12/log4j-config.html) 的文章中也也说过，主要有三个组件，Logger，Appenders 和 Layout，要过滤日志内容解决方法也就是从这三个地方着手。

## log 时手动处理
Logger 着手就是在打日志的时候就处理，从根源解决。最精确的处理就是在每个类敏感的字段上手动处理，在打印日志时，封装方法手动转换 String 。这种方法唯一的缺点就是对于一个大型成熟的系统，要修改的日志打印地方太多，更本无法顾及。所以还需要寻找统一的方法。

## 自定义 Appender
如果从根源上没有解决，接下来就是在 Appender 中，Appender 决定了日志往哪里输出，那么这个时候就可以重写 subAppend 方法重新修改 LogEvent 来修改日志信息，将敏感的内容移除。比如

    import org.apache.log4j.DailyRollingFileAppender;
    import org.apache.log4j.spi.LoggingEvent;

    public class DesensitizeDailyRollingFileAppender extends DailyRollingFileAppender {

        @Override
        protected void subAppend(LoggingEvent event) {
            String message = (String) event.getMessage();
            // do your stuff
            LoggingEvent modifiedEvent = new LoggingEvent(event.getFQNOfLoggerClass(), event.getLogger(), event.getTimeStamp(), event.getLevel(), modifiedMessage,
                    event.getThreadName(), event.getThrowableInformation(), event.getNDC(), event.getLocationInformation(),
                    event.getProperties());
            super.subAppend(event);
        }
    }

## 扩展 PatternLayout
最后，如果自定义 Appender 的话，那么每一个日志删除的目的 Appender 都要手动实现一下，这个时候如果复写 PatternLayout 就可以让多个 Appender 来使用。

定义自己的 PatternLayout ，然后在配置文件 Appender 指定用我们自己的实现的 PatternLayout。

    import java.lang.reflect.Field;
    import org.apache.log4j.PatternLayout;
    import org.apache.log4j.spi.LoggingEvent;

    public class DesensitizeLayout extends PatternLayout {

        @Override
        public String format(LoggingEvent event) {
            if (event.getMessage() != null && event.getMessage() instanceof String) {
                String message = event.getMessage().toString();
                // do your stuff to change message
                try {
                    Field msgField = LoggingEvent.class.getDeclaredField("message");
                    msgField.setAccessible(true);
                    msgField.set(event, message);
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            return super.format(event);
        }
    }

## RewritePolicy
如果使用的是 log4j 2.x 版本，也可以使用这种方法重写 RewritePolicy，然后 Override rewrite 方法。

## 总结
通过自定 Appender 或者 PatternLayout 可以实现敏感信息的脱敏，那么其实扩展可以实现其他的同类业务。比如固定格式输出，比如打印日志到内部日志收集器等等。


## reference

- <https://juejin.im/post/5b4019625188251b105ad71d>
