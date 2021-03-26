---
layout: post
title: "IntelliJ IDEA vmoptions 设置"
tagline: ""
description: ""
category: 经验总结
tags: [intellij, idea, jvm, java, jetbrain,  ]
last_updated:
---

IntelliJ IDEA 运行在 JVM 上，JVM 有很多的选项和开关配置可以用来调整性能，也就是说，可以通过手动的调整这些 JVM 参数来优化 IntelliJ IDEA 的性能。这篇文章主要是总结一下我的学习过程。

## 打开 memory indicator
首先打开 Memory Indicator

![memory indicator](/assets/intellij-idea-memory-indicator.png)

可以在设置中设定：

![memory indicator settings](/assets/intellij-idea-memory-indicator-settings.png)

或者新版本中，只需要右击右下角状态栏然后选择 memory indicator 即可。

可以看到普通使用 IntelliJ IDEA 大概就使用了 800M 左右的内存。

## Edit VM Options
在菜单 `Help | Edit Custom VM Options` 中可以设置。

## VM options
下载安装包后一定要把压缩包下的 README 读完，里面有详细的路径及配置说明。这里先给一个全部内容的预览，下面再一一解释。

```
-ea
-Xms2g
-Xmx2g
-XX:ReservedCodeCacheSize=240m
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=50
-Dfile.encoding=UTF-8
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
-Dawt.useSystemAAFontSettings=lcd
-Dsun.java2d.renderer=sun.java2d.marlin.MarlinRenderingEngine
```

### heap size
`-Xms` 和 `-Xmx` 配置堆内存，也就是 IntelliJ 可以使用的内存。

- `-Xms` 初始堆内存，调大该内存可以让启动速度更快，以省去分配内存的时间
- `-Xmx` 最大堆内存，如果遇到 `OutOfMemoryError` 可以调大该数值，最大不要超过系统 1/4.

### GC Algorithm

`-XX:+UseConcMarkSweepGC` 参数用来调整 GC 算法。使用该算法利用多个线程在后台进行 GC，以避免应用程序停止。

当分配超过 4GB 的堆内存时，可以尝试使用 `-XX:+UseG1GC`.


### Other

`-ea` 选项开启 assertions。如果调试 IntelliJ 或者开发插件时可能用到，对 IntelliJ 性能并没有影响。

`-server` 虚拟机的解释执行模式。

`-XX:SoftRefLRUPolicyMSPerMB=[value]` 参数用来控制每 M 空间中 soft reference 保证存活的毫秒数。默认的时间是 1000，JetBrains 推荐 50。

`-XX:ReservedCodeCacheSize=510m` 设置编译器最大的 code cache，另外一个相关的 JVM 参数是 `-XX:InitialCodeCacheSize`
JetBrains 推荐这里使用 240m. [^codecache]

[^codecache]: <https://blog.codecentric.de/en/2012/07/useful-jvm-flags-part-4-heap-tuning/>

`-Dsun.io.useCanonCaches=[boolean]` 该参数是否开启文件名及路径缓存，默认 java 会缓存文件名 30 秒 [^c]，JetBrains 建议关闭。

[^c]: <https://stackoverflow.com/a/7479642>

`-XX:+OmitStackTraceInFastThrow` JetBrains 官方推荐的参数。

`-XX:MaxJavaStackTraceDepth=-1` JVM 在实现 `java.lang.Throwable.fillInStackTrace()` 时把整个调用栈上的所有 Java 栈帧消息记录下来

`-XX:+HeapDumpOnOutOfMemoryError` 当发生 `OutOfMemoryError` 时 dump 堆内容。[^dump]

[^dump]: <http://www.oracle.com/technetwork/java/javase/clopts-139448.html#gbzrr>

## reference

- <https://intellij-support.jetbrains.com/hc/en-us/articles/206544869-Configuring-JVM-options-and-platform-properties>
- <https://github.com/FoxxMD/intellij-jvm-options-explained>
