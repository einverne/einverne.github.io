---
layout: post
title: "drools 编程例子"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, drl, jboss, java, rule-engine, ]
last_updated:
---

关于 Drools 更多的[介绍](/post/2018/10/drools-kie.html) 可以参考之前的[文章](/post/2018/10/drools-kie.html)。

这篇文章主要讲解如何在项目中执行 DRL 文件并取得结果。



## ERROR
如果遇到这样的错误，大部分情况下是 drl 规则文件所在的文件夹，没有被项目识别为 `resources` 文件夹，在 IntelliJ IDE 中可以使用`设置为资源文件夹`来解决。

    Exception in thread "main" java.lang.RuntimeException: Unable to get LastModified for ClasspathResource
        at org.drools.core.io.impl.ClassPathResource.getLastModified(ClassPathResource.java:212)
        at org.drools.core.io.impl.ClassPathResource.getInputStream(ClassPathResource.java:149)
        at org.drools.compiler.compiler.DrlParser.parse(DrlParser.java:154)
        at org.drools.compiler.compiler.DrlParser.parse(DrlParser.java:144)
        at org.drools.compiler.builder.impl.KnowledgeBuilderImpl.drlToPackageDescr(KnowledgeBuilderImpl.java:541)
        at org.drools.compiler.builder.impl.KnowledgeBuilderImpl.addPackageFromDrl(KnowledgeBuilderImpl.java:529)
        at org.drools.compiler.builder.impl.KnowledgeBuilderImpl.addKnowledgeResource(KnowledgeBuilderImpl.java:753)
        at org.drools.compiler.builder.impl.KnowledgeBuilderImpl.add(KnowledgeBuilderImpl.java:2296)
        at org.drools.compiler.builder.impl.KnowledgeBuilderImpl.add(KnowledgeBuilderImpl.java:2285)
        at com.neo.drools.banking.RuleRunner.runRules(RuleRunner.java:32)
        at com.neo.drools.banking.BankingExample1.main(BankingExample1.java:10)
    Caused by: java.io.FileNotFoundException: 'Example1.drl' cannot be opened because it does not exist
        at org.drools.core.io.impl.ClassPathResource.getURL(ClassPathResource.java:173)
        at org.drools.core.io.impl.ClassPathResource.getLastModified(ClassPathResource.java:185)
        ... 10 more
