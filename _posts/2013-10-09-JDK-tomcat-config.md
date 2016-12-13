---
layout: post
title: "JDK 和 Tomcat 配置"
tagline: ""
description: ""
category: 经验总结
tags: [Java, JDK, Tomcat , Knowledge]
last_updated: 2016-10-03
---


这些天重装系统,好多东西都要重来,装系统倒是不麻烦,麻烦的是好多编程工具需要配置环境变量.这里就当作是备忘吧.以防止以后还需要.

## JDK是什么
Java Development Kit（JDK）是Sun公司针对Java开发人员发布的免费软件开发工具包（SDK，Software development kit）. 普通用户并不需要安装JDK来运行Java程序，而只需要安装JRE（Java Runtime Environment）.而程序开发者必须安装JDK来编译、调试程序。----from [Wikipedia](http://zh.wikipedia.org/wiki/JDK)

## JDK下载地址
- Google搜索JDK
- 或者点击http://www.oracle.com/technetwork/java/javase/downloads/index.html 链接可能失效

## JDK环境变量配置的步骤如下：

1. 我的电脑-->属性-->高级-->环境变量.
2. 配置用户变量:
    - a. 新建 JAVA_HOME
        C:\Program Files\Java\jdk （JDK的安装路径）
    - b. 新建 PATH
        %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin
    - c. 新建 CLASSPATH
        .;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
    或者配置系统变量
    - a. 新建 JAVA_HOME
    - b. 修改 PATH , 在原有增加,以分号隔开(注意不要修改之前环境变量,只能增加)
    - c. 新建 CLASSPATH
3. 测试环境变量配置是否成功：
    开始-->运行-->CMD
    键盘敲入: JAVAC   JAVA
    出现相应的命令，而不是出错信息，即表示配置成功！

## 环境变量配置的理解：
1. PATH环境变量。作用是指定命令搜索路径，在i命令行下面执行命令如javac编译java程序时，它会到PATH变量所指定的路径中查找看是否能找到相应的命令程序。我们需要把jdk安装目录下的bin目录增加到现有的PATH变量中，bin目录中包含经常要用到的可执行文件如javac/java/javadoc等待，设置好PATH变量后，就可以在任何目录下执行javac/java等工具了。
2. CLASSPATH环境变量。作用是指定类搜索路径，要使用已经编写好的类，前提当然是能够找到它们了，JVM就是通过CLASSPTH来寻找类的。我们需要把jdk安装目录下的lib子目录中的dt.jar和tools.jar设置到CLASSPATH中，当然，当前目录“.”也必须加入到该变量中。
3. JAVA_HOME环境变量。它指向jdk的安装目录，Eclipse/NetBeans/Tomcat等软件就是通过搜索JAVA_HOME变量来找到并使用安装好的jdk。


配置Tomcat之前先配置JDK

## 什么是Tomcat
Tomcat是由Apache软件基金会下属的Jakarta项目开发的一个Servlet容器，按照Sun Microsystems提供的技术规范，实现了对Servlet和JavaServer Page（JSP）的支持，并提供了作为Web服务器的一些特有功能，如Tomcat管理和控制平台、安全局管理和Tomcat阀等。由于Tomcat本身也内含了一个HTTP服务器，它也可以被视作一个单独的Web服务器。

[Wikipedia][1]

## Tomcat下载地址
- Google搜索Tomcat
- 或者http://tomcat.apache.org/

## 配置Tomcat环境变量
1. 新建变量名：CATALINA_BASE，变量值：D:\tomcat (Tomcat目录)
2. 新建变量名：CATALINA_HOME，变量值：D:\tomcat
3. 打开PATH，添加变量值：%CATALINA_HOME%\lib;%CATALINA_HOME%\bin

## 启动Tomcat服务
方法两种：
1. 方法一：在CMD命令下输入命令：startup，出现如下对话框，表明服务启动成功。
2. 方法二：右键点击桌面上的“我的电脑”->“管理”->“服务和应用程序”->“服务”，找到“Apache     Tomcat”服务，右键点击该服务，选择“属性”，将“启动类型”由“手动”改成“自动”。(貌似只有安装版Tomcat才有,如果是解压直接使用的,在bin目录下有startup.bat,运行即可)

## 测试Tomcat
打开浏览器，在地址栏中输入http://localhost:8080回车，如果看到Tomcat自带的一个JSP页面，说明你的JDK和Tomcat已搭建成功。


[1]: http://zh.wikipedia.org/wiki/Apache_Tomcat