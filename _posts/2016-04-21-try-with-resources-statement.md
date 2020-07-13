---
layout: post
title: "Java 查漏补缺之：try-with-resources 语法"
tagline: ""
description: ""
category: Java
tags: [java, try-with-resources, closable, jdk, ]
last_updated:
---

try-with-resources 表达式就是在 try 语句中定义了一个或者多个资源，resource 必须要在程序结束后关闭，try-with-resources 表达式保证了 resource 会在表达式结束时自动关闭，有点像 python 的 with 语句。所有实现了 `java.lang.AutoCloseable` 接口的类都可以作为 try 中的 resource。

## 举例

下面的例子中 `BufferedReader` 需要被关闭。在 Java SE 7 以后，BufferedReader 实现了 AutoCloseable 接口，所以定义在 try 语句中的的 br 对象，不管正常执行，或者异常，都会在表达式结束时自动关闭。


    static String readFirstLineFromFile(String path) throws IOException {
        try (BufferedReader br =
                       new BufferedReader(new FileReader(path))) {
            return br.readLine();
        }
    }

在 Java SE 7 以前需要使用 finally 来保证

    static String readFirstLineFromFileWithFinallyBlock(String path)
                                                         throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(path));
        try {
            return br.readLine();
        } finally {
            if (br != null) br.close();
        }
    }

当然在 try 语句中多个语句也是可以的。

## Try-with-resources 原理
如果要实现 `try-with-resources` 需要资源实现 `AutoCloseable` 接口，重写 `close` 方法。

然后 Java 程序在编译的时候，编译器就会根据实现的 close 方法来自动生成 try-finally 方法块。


## Closeable & AutoCloseable 区别
Closeable 继承了 AutoCloseable:

	public interface Closeable extends AutoCloseable {
	  void close() throws IOException;
	}

Closeable 的 close 方法抛出的是 `IOException`.


## reference

- <https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html>
