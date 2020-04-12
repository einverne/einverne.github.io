---
layout: post
title: "JDK 和 Tomcat 配置"
tagline: ""
description: ""
category: 经验总结
tags: [java, jdk, tomcat , knowledge]
last_updated: 2016-10-03
redirect_from: "/post/2013/10/JDK-tomcat-config.html"
---


这些天重装系统，好多东西都要重来，装系统倒是不麻烦，麻烦的是好多编程工具需要配置环境变量。这里就当作是备忘吧。以防止以后还需要。

## JDK 是什么
Java Development Kit（JDK）是 Sun 公司针对 Java 开发人员发布的免费软件开发工具包（SDK，Software development kit）. 普通用户并不需要安装 JDK 来运行 Java 程序，而只需要安装 JRE（Java Runtime Environment）. 而程序开发者必须安装 JDK 来编译、调试程序。----from [Wikipedia](http://zh.wikipedia.org/wiki/JDK)

## JDK 下载地址
- Google 搜索 JDK
- 或者点击 http://www.oracle.com/technetwork/java/javase/downloads/index.html 链接可能失效

## JDK 环境变量配置的步骤如下：

1. 我的电脑 -->属性 -->高级 -->环境变量。
2. 配置用户变量：
    - a. 新建 JAVA_HOME
        C:\Program Files\Java\jdk （JDK 的安装路径）
    - b. 新建 PATH
        %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin
    - c. 新建 CLASSPATH
        .;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
    或者配置系统变量
    - a. 新建 JAVA_HOME
    - b. 修改 PATH , 在原有增加，以分号隔开（注意不要修改之前环境变量，只能增加）
    - c. 新建 CLASSPATH
3. 测试环境变量配置是否成功：
    开始 -->运行 -->CMD
    键盘敲入：JAVAC   JAVA
    出现相应的命令，而不是出错信息，即表示配置成功！

## 环境变量配置的理解：
1. PATH 环境变量。作用是指定命令搜索路径，在 i 命令行下面执行命令如 javac 编译 java 程序时，它会到 PATH 变量所指定的路径中查找看是否能找到相应的命令程序。我们需要把 jdk 安装目录下的 bin 目录增加到现有的 PATH 变量中，bin 目录中包含经常要用到的可执行文件如 javac/java/javadoc 等待，设置好 PATH 变量后，就可以在任何目录下执行 javac/java 等工具了。
2. CLASSPATH 环境变量。作用是指定类搜索路径，要使用已经编写好的类，前提当然是能够找到它们了，JVM 就是通过 CLASSPTH 来寻找类的。我们需要把 jdk 安装目录下的 lib 子目录中的 dt.jar 和 tools.jar 设置到 CLASSPATH 中，当然，当前目录“.”也必须加入到该变量中。
3. JAVA_HOME 环境变量。它指向 jdk 的安装目录，Eclipse/NetBeans/Tomcat 等软件就是通过搜索 JAVA_HOME 变量来找到并使用安装好的 jdk。


配置 Tomcat 之前先配置 JDK

## 什么是 Tomcat
Tomcat 是由 Apache 软件基金会下属的 Jakarta 项目开发的一个 Servlet 容器，按照 Sun Microsystems 提供的技术规范，实现了对 Servlet 和 JavaServer Page（JSP）的支持，并提供了作为 Web 服务器的一些特有功能，如 Tomcat 管理和控制平台、安全局管理和 Tomcat 阀等。由于 Tomcat 本身也内含了一个 HTTP 服务器，它也可以被视作一个单独的 Web 服务器。

[Wikipedia][1]

## Tomcat 下载地址
- Google 搜索 Tomcat
- 或者 http://tomcat.apache.org/

## 配置 Tomcat 环境变量
1. 新建变量名：CATALINA_BASE，变量值：D:\tomcat (Tomcat 目录）
2. 新建变量名：CATALINA_HOME，变量值：D:\tomcat
3. 打开 PATH，添加变量值：%CATALINA_HOME%\lib;%CATALINA_HOME%\bin

## 启动 Tomcat 服务
方法两种：
1. 方法一：在 CMD 命令下输入命令：startup，出现如下对话框，表明服务启动成功。
2. 方法二：右键点击桌面上的“我的电脑”->“管理”->“服务和应用程序”->“服务”，找到“Apache     Tomcat”服务，右键点击该服务，选择“属性”，将“启动类型”由“手动”改成“自动”。（貌似只有安装版 Tomcat 才有，如果是解压直接使用的，在 bin 目录下有 startup.bat, 运行即可）

## 测试 Tomcat
打开浏览器，在地址栏中输入 http://localhost:8080 回车，如果看到 Tomcat 自带的一个 JSP 页面，说明你的 JDK 和 Tomcat 已搭建成功。


[1]: http://zh.wikipedia.org/wiki/Apache_Tomcat
