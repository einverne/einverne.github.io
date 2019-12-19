---
layout: post
title: "log4j 配置"
tagline: ""
description: ""
category: 学习笔记
tags: [log, java, log4j, ]
last_updated:
---

Log4j 是一个可靠的、高效的、快速可扩展的日志框架，Log4j 使用 Java 开发，已经被移植到了很多主流语言，比如 C, C++, Perl, Python, Ruby 等等。

- Log4j 可以通过外部文件配置来定义行为，Log4j 为日志输出提供了不同的目的地，比如可以将日志输出到控制台，文件，数据库等等
- 也可以控制每一条日志的输出格式；
- 通过定义每一条日志信息的级别，能够更加细致地控制日志的生成过程。

这一切都可以通过一个配置文件来灵活地进行配置，而不需要修改应用代码。Log4j 是 Apache 的一个开放源代码项目。

在应用程序中添加日志记录总的来说基于三个目的：

- 监视代码中变量的变化情况，周期性的记录到文件中供其他应用进行统计分析工作
- 跟踪代码运行时轨迹，作为日后审计的依据
- 担当集成开发环境中的调试器的作用，向文件或控制台打印代码的调试信息

Log4j 主要有三个组件：

- Loggers 记录器，主要供客户端调用，也就是日常使用 `log.info()` `log.debug()` 的地方，作用就是用来记录日志
- Appenders 输出源，负责日志输出，用来将采集的日志信息发送到不同的目的地，控制台，文件等等
- Layouts 布局 ，负责日志格式化，用于格式化输出日志

综合使用这三个组件可以轻松的记录信息的类型和级别，并可以在运行时控制日志输出的样式和位置。

Log4j 的执行顺序

1. 日志信息传入 logger
2. 日志信息被封装为 LoggingEvent 传入 Appender
3. Appender 中 Filter 对日志过滤，Layout 对信息格式化，输出

Log4j 的特性：

- 线程安全
- 为速度优化
- 同一个记录器支持不同的输出
- 支持多语言
- 日志的行为可以通过配置文件在运行时使用
- 支持不同的 LEVEL
- 日志的输出可以通过 Layout 类来改变
- 日志的输出途径可以通过修改 Appender 接口来定义

通常，我们都提供一个名为 `log4j.properties` 的文件，该文件以 key-value 的方式进行配置。默认情况下，LogManager 会在 CLASSPATH 目录下寻找 `log4j.properties` 这个文件名。一些老的项目也会用 log4j.xml 格式来配置。

简单例子

    # Define the root logger with appender X
    log4j.rootLogger = DEBUG, X

    # Set the appender named X to be a File appender
    log4j.appender.X=org.apache.log4j.FileAppender
    log4j.appender.X.File=${log}/log.out

    # Define the layout for X appender
    log4j.appender.X.layout=org.apache.log4j.PatternLayout
    log4j.appender.X.layout.conversionPattern=%d{yyyy-MM-dd HH:mm:ss} %p [%t] %C{1}.%M(%F:%L) - %m%n

这个例子定义了

- root logger 的 level 是 DEBUG，并且 DEBUG 附加到一个名为 X 的 Appender 上
- 设置 X Appender
- 然后设置 X 的 layout

## Maven 依赖
在 maven 的 pom.xml dependency 下添加：

    <!-- sl4j -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.21</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>1.7.21</version>
    </dependency>
    <!-- log4j -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>

slf4j(Simple Logging Facade for Java) 不是一个真正的日志实现，而是抽象层，允许在后台使用任意一个日志类库。slf4j 使得代码能够独立于任意一个特定的日志 API。

SLF4J API 的特性占位符 (place holder)，在代码中表示为“{}”的特性。占位符是一个非常类似于在 String 的 format() 方法中的 %s，因为它会在运行时被某个提供的实际字符串所替换。这不仅降低了你代码中字符串连接次数，而且还节省了新建的 String 对象。

然后在 CLASSPATH 下添加 `log4j.properties` 文件。

    #config root logger
    log4j.rootLogger = INFO,system.out
    log4j.appender.system.out=org.apache.log4j.ConsoleAppender
    log4j.appender.system.out.layout=org.apache.log4j.PatternLayout
    log4j.appender.system.out.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} %p [%t] %C{1}.%M(%F:%L) - %m%n

    #config this Project.file logger
    log4j.logger.APPENDER_NAME.file=INFO,APPENDER_NAME.file.out
    log4j.appender.APPENDER_NAME.file.out=org.apache.log4j.DailyRollingFileAppender
    log4j.appender.APPENDER_NAME.file.out.File=logContentFile.log
    log4j.appender.APPENDER_NAME.file.out.layout=org.apache.log4j.PatternLayout

在 Java 代码中使用 slf4j

    private static final Logger logger = LoggerFactory.getLogger(Server.class);
    logger.info("now {}" , "starting server");

Log4j 支持两种配置文件格式，一种是 XML 格式的文件，一种是 Java properties（key=value）【Java 特性文件（键 = 值）】。先介绍使用 Java 特性文件做为配置文件的方法

配置详细介绍

## 配置 Logger 　　
Loggers 组件在此系统中被分为五个级别：DEBUG、INFO、WARN、ERROR 和 FATAL。这五个级别是有顺序的

    DEBUG < INFO < WARN < ERROR < FATAL

分别用来指定这条日志信息的重要程度，这里 Log4j 有一个规则：假设 Loggers 级别为 P，如果在 Loggers 中发生了一个级别 Q 比 P 高，则记录，否则就不记录。

比如，你定义的级别是 info，那么 error 和 warn 的日志可以显示而比他低的 debug 信息就不显示了。

配置 root Logger

其语法为：

　　log4j.rootLogger = [ level ] , appenderName1, appenderName2, …

    # level : 是日志记录的优先级，分为 OFF、FATAL、ERROR、WARN、INFO、DEBUG、ALL 或者您定义的级别。Log4j 建议只使用四个级别，优先级从高到低分别是 ERROR、WARN、INFO、DEBUG。通过在这里定义的级别，您可以控制到应用程序中相应级别的日志信息的开关。比如在这里定义了 INFO 级别，则应用程序中所有 DEBUG 级别的日志信息将不被打印出来。

　　appenderName: 就是指定日志信息输出到哪个地方。可以同时指定多个输出目的地。

例如：`log4j.rootLogger＝info,A1,B2,C3`

## 配置日志信息输出目的地

Log4j 日志系统允许把日志输出到不同的地方，如控制台（Console）、文件（Files）、根据日期或者文件大小产生新的文件、以流的形式发送到其它地方等等。

其语法为：

    log4j.appender.appenderName = fully.qualified.name.of.appender.class
    log4j.appender.appenderName.option1 = value1
    log4j.appender.appenderName.optionN = valueN

其中， Log4j 提供的 appender 有以下几种：

- org.apache.log4j.ConsoleAppender 输出到控制台
- org.apache.log4j.FileAppender 输出到文件
- org.apache.log4j.DailyRollingFileAppender 输出到每天产生一个日志文件
- org.apache.log4j.RollingFileAppender 文件大小到达指定尺寸的时候产生一个新的文件，可通过 log4j.appender.R.MaxFileSize=100KB 设置文件大小，还可通过 log4j.appender.R.MaxBackupIndex=1 设置为保存一个备份文件
- org.apache.log4j.WriterAppender 将日志信息以流格式发送到任意指定的地方

例：

    log4j.appender.stdout=org.apache.log4j.ConsoleAppender

定义一个名为 stdout 的输出目的地， 输出到控制台。

其语法为：

    log4j.appender.appenderName = fully.qualified.name.of.appender.class

"fully.qualified.name.of.appender.class" 可以指定下面五个目的地中的一个：

- org.apache.log4j.ConsoleAppender（控制台）
- org.apache.log4j.FileAppender（文件）
- org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件）
- org.apache.log4j.RollingFileAppender（文件大小到达指定尺寸的时候产生一个新的文件）
- org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）

输出目的地的选项，可以通过如下语法指定

    log4j.appender.appenderName.option = valueN

### ConsoleAppender 选项

- Threshold=WARN: 指定日志消息的输出最低层次。
- ImmediateFlush=true: 默认值是 true, 意谓着所有的消息都会被立即输出。
- Target=System.err：默认情况下是：System.out, 指定输出控制台

### FileAppender 选项

- Threshold=WARN: 指定日志消息的输出最低层次。
- ImmediateFlush=true: 默认值是 true, 意谓着所有的消息都会被立即输出。
- File=mylog.txt: 指定消息输出到 mylog.txt 文件。
- Append=false: 默认值是 true, 即将消息增加到指定文件中，false 指将消息覆盖指定的文件内容。

Java web 项目里面的日志的位置配置支持变量

如果是要指定日志文件的位置为 D 盘下的 log.txt 文件。

    log4j.appender.APPENDER_NAME.file.out.File=d:\\log.txt

如果指定日志文件的位置为当前的 tomcat 的工作目录下的某个文件

    log4j.appender.APPENDER_NAME.file.out.File=${catalina.home}/logs/logs_tomcat.log


### DailyRollingFileAppender 选项

- Threshold=WARN: 指定日志消息的输出最低层次。
- ImmediateFlush=true: 默认值是 true, 意谓着所有的消息都会被立即输出。
- File=mylog.txt: 指定消息输出到 mylog.txt 文件。
- Append=false: 默认值是 true, 即将消息增加到指定文件中，false 指将消息覆盖指定的文件内容。

`DatePattern='.'yyyy-ww`: 每周滚动一次文件，即每周产生一个新的文件。当然也可以指定按月、周、天、时和分。即对应的格式如下：

- '.'yyyy-MM: 每月
- '.'yyyy-ww: 每周
- '.'yyyy-MM-dd: 每天
- '.'yyyy-MM-dd-a: 每天两次
- '.'yyyy-MM-dd-HH: 每小时
- '.'yyyy-MM-dd-HH-mm: 每分钟

### RollingFileAppender 选项
按照日志大小滚动日志文件

- Threshold=WARN: 指定日志消息的输出最低层次。
- ImmediateFlush=true: 默认值是 true, 意谓着所有的消息都会被立即输出。
- File=mylog.txt: 指定消息输出到 mylog.txt 文件。
- Append=false: 默认值是 true, 即将消息增加到指定文件中，false 指将消息覆盖指定的文件内容。
- MaxFileSize=100KB: 后缀可以是 KB, MB 或者是 GB. 在日志文件到达该大小时，将会自动滚动，即将原来的内容移到 mylog.log.1 文件。
- MaxBackupIndex=2: 指定可以产生的滚动文件的最大数。

实际应用：

　　log4j.appender.A1=org.apache.log4j.ConsoleAppender // 这里指定了日志输出的第一个位置 A1 是控制台 ConsoleAppender
　　
## 配置日志信息的格式
如果希望格式化自己的日志输出，Log4j 可以在 Appenders 的后面附加 Layouts 来完成这个功能。Layouts 提供了四种日志输出样式，如根据 HTML 样式、自由指定样式、包含日志级别与信息的样式和包含日志时间、线程、类别等信息的样式等等。

其语法表示为：

　　org.apache.log4j.HTMLLayout 以 HTML 表格形式布局
　　org.apache.log4j.PatternLayout 可以灵活地指定布局模式
　　org.apache.log4j.SimpleLayout 包含日志信息的级别和信息字符串
　　org.apache.log4j.TTCCLayout 包含日志产生的时间、线程、类别等等信息

配置时使用方式为：

　　log4j.appender.appenderName.layout = fully.qualified.name.of.layout.class
　　log4j.appender.appenderName.layout.option1 = value1
　　log4j.appender.appenderName.layout.option = valueN


"fully.qualified.name.of.layout.class" 可以指定下面 4 个格式中的一个：

- org.apache.log4j.HTMLLayout
- org.apache.log4j.PatternLayout
- org.apache.log4j.SimpleLayout
- org.apache.log4j.TTCCLayout

### 输出格式
Log4J 采用类似 C 语言中的 printf 函数的打印格式格式化日志信息，打印参数如下：

    %m 输出代码中指定的消息
    %p 输出优先级，即 DEBUG，INFO，WARN，ERROR，FATAL
    %r 输出自应用启动到输出该 log 信息耗费的毫秒数
    %c 输出所属的类目，通常就是所在类的全名
    %t 输出产生该日志事件的线程名
    %n 输出一个回车换行符，Windows 平台为“\r\n”，Unix 平台为“\n”
    %d 输出日志时间点的日期或时间，默认格式为 ISO8601，也可以在其后指定格式，比如： %d{yyyy MMM dd HH:mm:ss,SSS} ，输出类似： 2002 年 10 月 18 日 22 ： 10 ： 28 ， 921
    %l 输出日志事件的发生位置，包括类目名、发生的线程，以及在代码中的行数。


格式化例子：

    log4j.appender.APPENDER_NAME.file.out.layout.ConversionPattern=%d{yyyy MMM dd HH:mm:ss,SSS}%5p{ \%F\:\%L }-%m%n

注意：

参数中间可能会有一些数字，比如：%5p 它的意思就是在输出此参数之前加入多少个空格，还有就是里面的“\”的作用是转义字符

### HTMLLayout 选项

- LocationInfo=true: 默认值是 false, 输出 java 文件名称和行号
- Title=my app file: 默认值是 Log4J Log Messages.

### PatternLayout 选项

- ConversionPattern=%m%n : 指定怎样格式化指定的消息。

### XMLLayout 选项
LocationInfo=true: 默认值是 false, 输出 java 文件和行号

实际应用：

    log4j.appender.A1.layout=org.apache.log4j.PatternLayout
    log4j.appender.A1.layout.ConversionPattern=%-4r %-5p %d{yyyy-MM-dd HH:mm:ssS} %c %m%n

这里需要说明的就是日志信息格式中几个符号所代表的含义：

    %p: 输出日志信息优先级，即 DEBUG，INFO，WARN，ERROR，FATAL,
    %d: 输出日志时间点的日期或时间，默认格式为 ISO8601，也可以在其后指定格式，比如：%d{yyy MMM dd HH:mm:ss,SSS}，输出类似：2002 年 10 月 18 日 22：10：28，921
    %r: 输出自应用启动到输出该 log 信息耗费的毫秒数
    %c: 输出日志信息所属的类目，通常就是所在类的全名
    %t: 输出产生该日志事件的线程名
    %l: 输出日志事件的发生位置，相当于 %C.%M(%F:%L) 的组合，包括类目名、发生的线程，以及在代码中的行数。举例：Testlog4.main(TestLog4.java:10)
    %x: 输出和当前线程相关联的 NDC（嵌套诊断环境）, 尤其用到像 java servlets 这样的多客户多线程的应用中。
    %%: 输出一个"%"字符
    %F: 输出日志消息产生时所在的文件名称
    %L: 输出代码中的行号
    %m: 输出代码中指定的消息，产生的日志具体信息
    %n: 输出一个回车换行符，Windows 平台为"\r\n"，Unix 平台为"\n"输出日志信息换行

可以在 % 与模式字符之间加上修饰符来控制其最小宽度、最大宽度、和文本的对齐方式。如：

1. %20c：指定输出 category 的名称，最小的宽度是 20，如果 category 的名称小于 20 的话，默认的情况下右对齐。
2. %-20c: 指定输出 category 的名称，最小的宽度是 20，如果 category 的名称小于 20 的话，"-"号指定左对齐。
3. %.30c: 指定输出 category 的名称，最大的宽度是 30，如果 category 的名称大于 30 的话，就会将左边多出的字符截掉，但小于 30 的话也不会有空格。
4. %20.30c: 如果 category 的名称小于 20 就补空格，并且右对齐，如果其名称长于 30 字符，就从左边交远销出的字符截掉。

这里上面三个步骤是对前面 Log4j 组件说明的一个简化；下面给出一个具体配置例子，在程序中可以参照执行：

　　log4j.rootLogger=INFO,A1，B2
　　log4j.appender.A1=org.apache.log4j.ConsoleAppender
　　log4j.appender.A1.layout=org.apache.log4j.PatternLayout
　　log4j.appender.A1.layout.ConversionPattern=%-4r %-5p %d{yyyy-MM-dd HH:mm:ssS} %c %m%n

根据上面的日志格式，某一个程序的输出结果如下：

    0　　INFO　2003-06-13 13:23:46968 ClientWithLog4j Client socket: Socket[addr=localhost/127.0.0.1,port=8002,localport=2014]
     DEBUG 2003-06-13 13:23:46984 ClientWithLog4j Server says: 'Java server with log4j, Fri Jun 13 13:23:46 CST 2003'
    16　 DEBUG 2003-06-13 13:23:46984 ClientWithLog4j GOOD
    16　 DEBUG 2003-06-13 13:23:46984 ClientWithLog4j Server responds: 'Command 'HELLO' not understood.'
    16　 DEBUG 2003-06-13 13:23:46984 ClientWithLog4j HELP
    16　 DEBUG 2003-06-13 13:23:46984 ClientWithLog4j Server responds: 'Vocabulary: HELP QUIT'
    16　 DEBUG 2003-06-13 13:23:46984 ClientWithLog4j QUIT

4. 当输出信息于回滚文件时

    log4j.appender.ROLLING_FILE=org.apache.log4j.RollingFileAppender // 指定以文件的方式输出日志
    log4j.appender.ROLLING_FILE.Threshold=ERROR
    log4j.appender.ROLLING_FILE.File=rolling.log // 文件位置，也可以用变量 ${java.home}、rolling.log
    log4j.appender.ROLLING_FILE.Append=true
    log4j.appender.ROLLING_FILE.MaxFileSize=10KB // 文件最大尺寸
    log4j.appender.ROLLING_FILE.MaxBackupIndex=1 // 备份数
    log4j.appender.ROLLING_FILE.layout=org.apache.log4j.PatternLayout
    log4j.appender.ROLLING_FILE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n 　　


## log4j 日志等级

- DEBUG: 纯 debug 信息，可以有隐私数据，可以有性能问题，可以很大，但线上一定不会打这个日志，只有在线下 debug 或极端情况线上 debug 的时候才会用到
- INFO: 一般性的采集信息，觉得很有用的信息可以打出来，不可滥用，会有性能问题。大部分情况下线上服务器会在 INFO 级别，不应该有核心隐私数据
- WARN: 程序不合理状态，需要巡检时注意的状况。处于性能瓶颈时，线上服务器可能会临时调到 WARN 级别，所以该日志应当非常少，只在异常的状态才打出来，应当被注意并修复异常状态
- ERROR: 发生服务端错误，如存储错误、RPC 错误、进入 bug 路径等，该日志级别通常伴随不可用，并直接返回 error。所有 error 日志被看到之后，都应该逻辑调查原因并避免其出现
- FATAL: 致命性错误，极少打，一般该错误伴随 panic 或直接重启

建议使用 lombok 的 @Slf4j 注解。


## Log4j 比较全面的配置

LOG4J 的配置之简单使它遍及于越来越多的应用中：Log4J 配置文件实现了输出到控制台、文件、回滚文件、发送日志邮件、输出到数据库日志表、自定义标签等全套功能。

    log4j.rootLogger=DEBUG,CONSOLE,FILE,ROLLING_FILE,SOCKET,LF5_APPENDER,MAIL,DATABASE,A1,im
    log4j.addivity.org.apache=true

    # 应用于控制台
    log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
    log4j.appender.Threshold=DEBUG
    log4j.appender.CONSOLE.Target=System.out
    log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
    log4j.appender.CONSOLE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n
    #log4j.appender.CONSOLE.layout.ConversionPattern=[start]%d{DATE}[DATE]%n%p[PRIORITY]%n%x[NDC]%n%t[thread] n%c[CATEGORY]%n%m[MESSAGE]%n%n

    #应用于文件
    log4j.appender.FILE=org.apache.log4j.FileAppender
    log4j.appender.FILE.File=file.log
    log4j.appender.FILE.Append=false
    log4j.appender.FILE.layout=org.apache.log4j.PatternLayout
    log4j.appender.FILE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n
    # Use this layout for LogFactor 5 analysis

    # 应用于文件回滚
    log4j.appender.ROLLING_FILE=org.apache.log4j.RollingFileAppender
    log4j.appender.ROLLING_FILE.Threshold=ERROR
    log4j.appender.ROLLING_FILE.File=rolling.log // 文件位置，也可以用变量 ${java.home}、rolling.log
    log4j.appender.ROLLING_FILE.Append=true //true: 添加 false: 覆盖
    log4j.appender.ROLLING_FILE.MaxFileSize=10KB // 文件最大尺寸
    log4j.appender.ROLLING_FILE.MaxBackupIndex=1 // 备份数
    log4j.appender.ROLLING_FILE.layout=org.apache.log4j.PatternLayout
    log4j.appender.ROLLING_FILE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n

    #应用于 socket
    log4j.appender.SOCKET=org.apache.log4j.RollingFileAppender
    log4j.appender.SOCKET.RemoteHost=localhost
    log4j.appender.SOCKET.Port=5001
    log4j.appender.SOCKET.LocationInfo=true
    # Set up for Log Facter 5
    log4j.appender.SOCKET.layout=org.apache.log4j.PatternLayout
    log4j.appender.SOCET.layout.ConversionPattern=[start]%d{DATE}[DATE]%n%p[PRIORITY]%n%x[NDC]%n%t[thread]%n%c[CATEGORY]%n%m[MESSAGE]%n%n

    # Log Factor 5 Appender
    log4j.appender.LF5_APPENDER=org.apache.log4j.lf5.LF5Appender
    log4j.appender.LF5_APPENDER.MaxNumberOfRecords=2000

    # 发送日志给邮件
    log4j.appender.MAIL=org.apache.log4j.net.SMTPAppender
    log4j.appender.MAIL.Threshold=FATAL
    log4j.appender.MAIL.BufferSize=10
    log4j.appender.MAIL.From=web@gmail.com
    log4j.appender.MAIL.SMTPHost=www.gmail.com
    log4j.appender.MAIL.Subject=Log4J Message
    log4j.appender.MAIL.To=web@gmail.com
    log4j.appender.MAIL.layout=org.apache.log4j.PatternLayout
    log4j.appender.MAIL.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n
    # 用于数据库
    log4j.appender.DATABASE=org.apache.log4j.jdbc.JDBCAppender
    log4j.appender.DATABASE.URL=jdbc:mysql://localhost:3306/test
    log4j.appender.DATABASE.driver=com.mysql.jdbc.Driver
    log4j.appender.DATABASE.user=root
    log4j.appender.DATABASE.password=
    log4j.appender.DATABASE.sql=INSERT INTO LOG4J (Message) VALUES ('[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n')
    log4j.appender.DATABASE.layout=org.apache.log4j.PatternLayout
    log4j.appender.DATABASE.layout.ConversionPattern=[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n

    log4j.appender.A1=org.apache.log4j.DailyRollingFileAppender
    log4j.appender.A1.File=SampleMessages.log4j
    log4j.appender.A1.DatePattern=yyyyMMdd-HH'.log4j'
    log4j.appender.A1.layout=org.apache.log4j.xml.XMLLayout

    #自定义 Appender
    log4j.appender.im = net.cybercorlin.util.logger.appender.IMAppender
    log4j.appender.im.host = mail.cybercorlin.net
    log4j.appender.im.username = username
    log4j.appender.im.password = password
    log4j.appender.im.recipient = corlin@cybercorlin.net
    log4j.appender.im.layout=org.apache.log4j.PatternLayout
    log4j.appender.im.layout.ConversionPattern =[framework] %d - %c -%-4r [%t] %-5p %c %x - %m%n


## 一个完整的 XML 例子

    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
    <log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">

        <!-- ========================== 自定义输出格式说明 ================================ -->
        <!-- %p 输出优先级，即 DEBUG，INFO，WARN，ERROR，FATAL -->
        <!-- #%r 输出自应用启动到输出该 log 信息耗费的毫秒数  -->
        <!-- #%c 输出所属的类目，通常就是所在类的全名 -->
        <!-- #%t 输出产生该日志事件的线程名 -->
        <!-- #%n 输出一个回车换行符，Windows 平台为“\r\n”，Unix 平台为“\n” -->
        <!-- #%d 输出日志时间点的日期或时间，默认格式为 ISO8601，也可以在其后指定格式，比如：%d{yyy MMM dd HH:mm:ss,SSS}，输出类似：2002 年 10 月 18 日 22：10：28，921  -->
        <!-- #%l 输出日志事件的发生位置，包括类目名、发生的线程，以及在代码中的行数。举例：Testlog4.main(TestLog4.java:10)  -->
        <!-- ========================================================================== -->

        <!-- ========================== 输出方式说明 ================================ -->
        <!-- Log4j 提供的 appender 有以下几种：-->
        <!-- org.apache.log4j.ConsoleAppender（控制台）,  -->
        <!-- org.apache.log4j.FileAppender（文件）,  -->
        <!-- org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件）, -->
        <!-- org.apache.log4j.RollingFileAppender（文件大小到达指定尺寸的时候产生一个新的文件）,  -->
        <!-- org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）   -->
        <!-- ========================================================================== -->
        <!-- 输出到日志文件  -->
        <appender name="filelog_appender"
            class="org.apache.log4j.RollingFileAppender">
            <!-- 设置 File 参数：日志输出文件名 -->
            <param name="File" value="log/testlog4jxml_all.log" />
            <!-- 设置是否在重新启动服务时，在原有日志的基础添加新日志 -->
            <param name="Append" value="true" />
            <!-- 设置文件大小 -->
            <param name="MaxFileSize" value="1MB" />
            <!-- 设置文件备份 -->
            <param name="MaxBackupIndex" value="10000" />
            <!-- 设置输出文件项目和格式 -->
            <layout class="org.apache.log4j.PatternLayout">
                <param name="ConversionPattern" value="%d{yyyy-MM-dd HH:mm:ss} %-5p (%c:%L)- %m%n" />
            </layout>
        </appender>

        <!-- 输出到日志文件 每天一个日志  -->
        <appender name="filelog_daily" class="org.apache.log4j.DailyRollingFileAppender">
            <param name="File" value="log/daily.log" />
            <param name="DatePattern" value="'daily.'yyyy-MM-dd'.log'" />
            <layout class="org.apache.log4j.PatternLayout">
                <param name="ConversionPattern" value="[%d{yyyy-MM-dd HH:mm:ss\} %-5p] [%t] (%c:%L) - %m%n" />
            </layout>
        </appender>

        <!-- 输出到控制台中 -->
        <appender name="console" class="org.apache.log4j.ConsoleAppender">
            <layout class="org.apache.log4j.PatternLayout">
                <param name="ConversionPattern"
                    value="%d{yyyy-MM-dd HH:mm:ss} %-5p: %m%n" />
                <!-- "%-5p: [%t] [%c{3}.%M(%L)] | %m%n" -->
            </layout>
        </appender>

        <appender name="EMAIL_QQ" class="org.apache.log4j.net.SMTPAppender">
            <param name="Threshold" value="INFO"/>
            <param name="BufferSize" value="128" />
            <param name="SMTPHost" value="smtp.qq.com" />
            <param name="SMTPUsername" value="" />
            <param name="SMTPPassword" value="" />
            <param name="From" value="" />
            <param name="To" value="" />
            <param name="Subject" value="测试邮件发送" />
            <param name="LocationInfo" value="true" />
            <param name="SMTPDebug" value="true" />
            <layout class="org.cjj.log4j.extend.PatternLayout_zh">
                <param name="ConversionPattern" value="[%d{ISO8601}] %-5p %c %m%n"/>
            </layout>
        </appender>

    <!--- 异步测试，当日志达到缓存区大小时候执行所包的 appender -->
        <appender name="ASYNC_test" class="org.apache.log4j.AsyncAppender">
         <param name="BufferSize" value="10"/>
         <appender-ref ref="EMAIL_QQ"/>
       </appender>

     <!-- 设置包限制输出的通道 -->
        <category name="com.package.name" additivity="false"><!-- 日志输出级别，起码可以有 5 个级别，可以扩展自己的级别，邮件发送必须是 ERROR 级别不好用，所以最后自己扩展一个邮件发送级别 -->
            <level value="ERROR" />
            <appender-ref ref="filelog_daily" />
            <appender-ref ref="daily_appender" />
            <appender-ref ref="console" />
            <appender-ref ref="ASYNC_test" />
        </category>
    </log4j:configuration>

Web 配置 log4j, 需求增加以下内容到 `WEB-INF/web.xml`

　　<context-param>
        <param-name>webAppRootKey</param-name>
        <param-value>smilecargo.root</param-value>
    </context-param>
    <context-param>
        <param-name>log4jConfigLocation</param-name>
        <param-value>classpath:log4j.xml</param-value>
    </context-param>
    <context-param>
        <param-name>log4jRefreshInterval</param-name>
        <param-value>60000</param-value>
    </context-param>
　　<listener>
        <listener-class>org.springframework.web.util.Log4jConfigListener</listener-class>
    </listener>

`${smilecargo.root}` 是 web 工程相对路径

## 问题
配置时出现如下问题：

    log4j:ERROR setFile(null,true) call failed.
    java.io.FileNotFoundException: /home/work/log/web.log (No such file or directory)
        at java.io.FileOutputStream.open0(Native Method)
        at java.io.FileOutputStream.open(FileOutputStream.java:270)
        at java.io.FileOutputStream.<init>(FileOutputStream.java:213)
        at java.io.FileOutputStream.<init>(FileOutputStream.java:133)
        at org.apache.log4j.FileAppender.setFile(FileAppender.java:294)
        at org.apache.log4j.FileAppender.activateOptions(FileAppender.java:165)
        at org.apache.log4j.DailyRollingFileAppender.activateOptions(DailyRollingFileAppender.java:223)
        at org.apache.log4j.config.PropertySetter.activate(PropertySetter.java:307)
        at org.apache.log4j.xml.DOMConfigurator.parseAppender(DOMConfigurator.java:295)
        at org.apache.log4j.xml.DOMConfigurator.findAppenderByName(DOMConfigurator.java:176)
        at org.apache.log4j.xml.DOMConfigurator.findAppenderByReference(DOMConfigurator.java:191)
        at org.apache.log4j.xml.DOMConfigurator.parseChildrenOfLoggerElement(DOMConfigurator.java:523)
        at org.apache.log4j.xml.DOMConfigurator.parseCategory(DOMConfigurator.java:436)
        at org.apache.log4j.xml.DOMConfigurator.parse(DOMConfigurator.java:1004)
        at org.apache.log4j.xml.DOMConfigurator.doConfigure(DOMConfigurator.java:872)
        at org.apache.log4j.xml.DOMConfigurator.doConfigure(DOMConfigurator.java:778)
        at org.apache.log4j.helpers.OptionConverter.selectAndConfigure(OptionConverter.java:526)
        at org.apache.log4j.LogManager.<clinit>(LogManager.java:127)
        at org.apache.log4j.Logger.getLogger(Logger.java:104)
        at org.apache.commons.logging.impl.Log4JLogger.getLogger(Log4JLogger.java:262)
        at org.apache.commons.logging.impl.Log4JLogger.<init>(Log4JLogger.java:108)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
        at org.apache.commons.logging.impl.LogFactoryImpl.createLogFromClass(LogFactoryImpl.java:1025)
        at org.apache.commons.logging.impl.LogFactoryImpl.discoverLogImplementation(LogFactoryImpl.java:844)
        at org.apache.commons.logging.impl.LogFactoryImpl.newInstance(LogFactoryImpl.java:541)
        at org.apache.commons.logging.impl.LogFactoryImpl.getInstance(LogFactoryImpl.java:292)
        at org.apache.commons.logging.impl.LogFactoryImpl.getInstance(LogFactoryImpl.java:269)
        at org.apache.commons.logging.LogFactory.getLog(LogFactory.java:655)
        at org.springframework.util.PropertyPlaceholderHelper.<clinit>(PropertyPlaceholderHelper.java:40)
        at org.springframework.web.util.ServletContextPropertyUtils.<clinit>(ServletContextPropertyUtils.java:38)
        at org.springframework.web.util.Log4jWebConfigurer.initLogging(Log4jWebConfigurer.java:128)
        at org.springframework.web.util.Log4jConfigListener.contextInitialized(Log4jConfigListener.java:49)
        at org.eclipse.jetty.server.handler.ContextHandler.callContextInitialized(ContextHandler.java:890)
        at org.eclipse.jetty.servlet.ServletContextHandler.callContextInitialized(ServletContextHandler.java:532)
        at org.eclipse.jetty.server.handler.ContextHandler.startContext(ContextHandler.java:853)
        at org.eclipse.jetty.servlet.ServletContextHandler.startContext(ServletContextHandler.java:344)
        at org.eclipse.jetty.webapp.WebAppContext.startWebapp(WebAppContext.java:1514)
        at org.eclipse.jetty.maven.plugin.JettyWebAppContext.startWebapp(JettyWebAppContext.java:359)
        at org.eclipse.jetty.webapp.WebAppContext.startContext(WebAppContext.java:1476)
        at org.eclipse.jetty.server.handler.ContextHandler.doStart(ContextHandler.java:785)
        at org.eclipse.jetty.servlet.ServletContextHandler.doStart(ServletContextHandler.java:261)
        at org.eclipse.jetty.webapp.WebAppContext.doStart(WebAppContext.java:545)
        at org.eclipse.jetty.maven.plugin.JettyWebAppContext.doStart(JettyWebAppContext.java:434)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:131)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:113)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:113)
        at org.eclipse.jetty.server.handler.ContextHandlerCollection.doStart(ContextHandlerCollection.java:167)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:131)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:113)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:113)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.start(ContainerLifeCycle.java:131)
        at org.eclipse.jetty.server.Server.start(Server.java:449)
        at org.eclipse.jetty.util.component.ContainerLifeCycle.doStart(ContainerLifeCycle.java:105)
        at org.eclipse.jetty.server.handler.AbstractHandler.doStart(AbstractHandler.java:113)
        at org.eclipse.jetty.server.Server.doStart(Server.java:416)
        at org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:68)
        at org.eclipse.jetty.maven.plugin.AbstractJettyMojo.startJetty(AbstractJettyMojo.java:467)
        at org.eclipse.jetty.maven.plugin.AbstractJettyMojo.execute(AbstractJettyMojo.java:333)
        at org.eclipse.jetty.maven.plugin.JettyRunMojo.execute(JettyRunMojo.java:180)
        at org.apache.maven.plugin.DefaultBuildPluginManager.executeMojo(DefaultBuildPluginManager.java:134)
        at org.apache.maven.lifecycle.internal.MojoExecutor.execute(MojoExecutor.java:207)
        at org.apache.maven.lifecycle.internal.MojoExecutor.execute(MojoExecutor.java:153)
        at org.apache.maven.lifecycle.internal.MojoExecutor.execute(MojoExecutor.java:145)
        at org.apache.maven.lifecycle.internal.LifecycleModuleBuilder.buildProject(LifecycleModuleBuilder.java:116)
        at org.apache.maven.lifecycle.internal.LifecycleModuleBuilder.buildProject(LifecycleModuleBuilder.java:80)
        at org.apache.maven.lifecycle.internal.builder.singlethreaded.SingleThreadedBuilder.build(SingleThreadedBuilder.java:51)
        at org.apache.maven.lifecycle.internal.LifecycleStarter.execute(LifecycleStarter.java:128)
        at org.apache.maven.DefaultMaven.doExecute(DefaultMaven.java:307)
        at org.apache.maven.DefaultMaven.doExecute(DefaultMaven.java:193)
        at org.apache.maven.DefaultMaven.execute(DefaultMaven.java:106)
        at org.apache.maven.cli.MavenCli.execute(MavenCli.java:863)
        at org.apache.maven.cli.MavenCli.doMain(MavenCli.java:288)
        at org.apache.maven.cli.MavenCli.main(MavenCli.java:199)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.codehaus.plexus.classworlds.launcher.Launcher.launchEnhanced(Launcher.java:289)
        at org.codehaus.plexus.classworlds.launcher.Launcher.launch(Launcher.java:229)
        at org.codehaus.plexus.classworlds.launcher.Launcher.mainWithExitCode(Launcher.java:415)
        at org.codehaus.plexus.classworlds.launcher.Launcher.main(Launcher.java:356)
        at org.codehaus.classworlds.Launcher.main(Launcher.java:47)
    log4j:ERROR Either File or DatePattern options are not set for appender [file].

解决方案：

这种情况一般是 log 文件的路径不对，要不是文件路径不存在，要不就是无权限写入。

## reference

- <https://wiki.apache.org/logging-log4j/Log4jXmlFormat>
- <http://www.cnblogs.com/tqsummer/archive/2010/08/26/1809232.html>
- <http://www.slf4j.org/docs.html>
- <https://logging.apache.org/log4j/2.x/>
