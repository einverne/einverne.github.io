---
layout: post
title: "解决 NoSuchMethodException 错误的方法"
aliases: 
- 解决 NoSuchMethodException 错误的方法
tagline: ""
description: ""
category: 经验总结
tags: [ java, jdk, jvm, methodology ]
last_updated:
---

## 问题的出现
在使用 Java Instrumentation API 的时候，因为在应用启动的时候加载了一个 Java Agent，然后在 Java Agent 中依赖的包，和应用内依赖的包产生了冲突，同时使用了 commons.lang3 这个包，但是依赖的版本不一致。导致使用 FieldUtils 的时候出现了 `NoSuchMethodError`:

```
Caused by: java.lang.NoSuchMethodError: org.apache.commons.lang3.reflect.FieldUtils.getFieldsWithAnnotatio
n(Ljava/lang/Class;Ljava/lang/Class;)[Ljava/lang/reflect/Field;
        at com.opencsv.bean.AbstractMappingStrategy.loadRecursiveClasses(AbstractMappingStrategy.java:498)
        at com.opencsv.bean.AbstractMappingStrategy.loadFieldMap(AbstractMappingStrategy.java:440)
        at com.opencsv.bean.AbstractMappingStrategy.setType(AbstractMappingStrategy.java:363)
        at com.opencsv.bean.util.OpencsvUtils.determineMappingStrategy(OpencsvUtils.java:79)
        at com.opencsv.bean.CsvToBeanBuilder.build(CsvToBeanBuilder.java:234)
```

## NoSuchMethodError 错误出现的根本原因

NoSuchMethodError 错误出现的根本原因是应用程序直接或间接依赖了同一个类的多个版本，并且在运行时因为版本不一致，其中依赖的版本缺少方法而导致的。编译时和运行时类路径不一致。

基于上面具体的问题，在排查应用内的错误的时候，完全没有发现包冲突的情况，但加上了 Agent 就出错。

## 同一个 Class 出现不同版本的原因

- JDK 版本不一致
- SNAPSHOT 版本不一致
- Maven 依赖作用域为 provided [[Maven scope 作用域]]
- 同一个 jar 包出现多个版本
- 同一个 Class 出现在不同的 Jar 中

## 哪个版本的 Class 会被执行

- [[202010141045-Maven 依赖仲裁机制]]
- [[JVM 类加载机制]] 决定了 Class 被加载到 JVM 的优先级

## 如何解决 NoSuchMethodError 错误

- 定位异常 Class 的全限定类名和调用方，堆栈日志
- 定位异常 Class 来源，可以通过 [[Arthas]] 等在线诊断工具反编译，使用 `jad com.xxx.ClassName` 来获取该类运行时的源码，ClassLoader，Jar 包位置等信息
    - 如果程序启动失败，或无法在线诊断，可以考虑添加 JVM 启动参数 `-verbose:class` 或`-XX:+TraceClassLoading` ，在日志中输出每一个类的加载信息
- 根据 ClassLoader 和 Jar 包全路径名，判断类加载、Maven 仲裁或其他原因
    - 如果是 Jar 包多版本问题，可以指定需要的版本，或移除间接依赖中的低版本，使用 `mvn dependency:tree` 查看
    - 如果是同一个 Class 出现在不同 Jar 包中，如果可以排除，就排除依赖，如果不能排除，可以考虑升级或替换包

## reference

- [[Java 常见问题]]