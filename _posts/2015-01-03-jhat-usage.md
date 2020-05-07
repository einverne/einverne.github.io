---
layout: post
title: "jhat 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jvm, jhat, heap, tool, ]
last_updated:
---

jhat 是 Java 的堆分析工具（Java heap Analyzes Tool），在 JDK 6u7 之后成为 JDK 标配。

## 用法

    jhat [options] heap-dump-file

说明：

- options 参数
- heap-dump-file 二进制 Java 堆文件，可以使用 [jmap 导出](/post/2015/01/jmap-dump-heap.html)

### 可选参数

    -stack false|true

关闭对象分配调用栈跟踪 (tracking object allocation call stack)。 如果分配位置信息在堆转储中不可用，则必须将此标志设置为 false. 默认值为 true.

    -refs false|true

关闭对象引用跟踪 (tracking of references to objects)。 默认值为 true. 默认情况下，返回的指针是指向其他特定对象的对象，如反向链接或输入引用 (referrers or incoming references), 会统计 / 计算堆中的所有对象。

    -port port-number

设置 jhat HTTP server 的端口号。默认值 7000.

    -exclude exclude-file

指定对象查询时需要排除的数据成员列表文件 (a file that lists data members that should be excluded from the reachable objects query)。 例如，如果文件列列出了 java.lang.String.value , 那么当从某个特定对象 Object o 计算可达的对象列表时，引用路径涉及 java.lang.String.value 的都会被排除。

    -baseline exclude-file

指定一个基准堆转储 (baseline heap dump)。 在两个 heap dumps 中有相同 object ID 的对象会被标记为不是新的 (marked as not being new). 其他对象被标记为新的 (new). 在比较两个不同的堆转储时很有用。

    -debug int

设置 debug 级别。0 表示不输出调试信息。 值越大则表示输出更详细的 debug 信息。

    -J< flag >

因为 jhat 命令实际上会启动一个 JVM 来执行，通过 -J 可以在启动 JVM 时传入一些启动参数。例如，`-J-Xmx512m` 则指定运行 jhat 的 Java 虚拟机使用的最大堆内存为 512 MB. 如果需要使用多个 JVM 启动参数，则传入多个 -Jxxxxxx.

## 实例
使用如下命令获取二进制堆转储文件

    jmap -dump:format=b,file=heap-dump.hprof pid

然后使用

    jhat -J-Xmx1024m heap-dump.hprof

来查看和分析堆信息，然后访问本地 7000 端口即可。

jhat 中可以使用 OQL（对象查询语言）来查询，这个 OQL 也是非常庞大，如果要展开说就很多了，这里举一个例子，比如要查找字符串对象中，保存了长度大于 100 的字符串可以使用

    select s from java.lang.String s where s.count > 100

关于 OQL 更多的使用方法可以网上查询。


## reference

- map jhat
