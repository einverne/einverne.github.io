---
layout: post
title: "Java 查漏补缺之：赋值语句的返回值"
tagline: ""
description: ""
category: Java
tags: [java, jdk, programming,]
last_updated:
---

在看 JDK 源码 HashMap 时发现在 put 方法实现过程中使用了下面的语句

    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;

能够看到在判断语句中使用了赋值语句的结果来和 null 和 0 比较，再比如读写文件时会有

    while ((line = reader.readLine()) != null) {
        out.append(line);
    }

就能发现 Java 中的赋值语句是有返回值的，并且也不是简单的 boolean 。**事实上赋值语句返回的是左侧变量的引用值，也就是右侧的结果**。

    @Test
    public void testAssignment() {
        int i;
	    System.out.println(i=0);
        System.out.println(i=1);
    }

输出分别是 0 和 1.


