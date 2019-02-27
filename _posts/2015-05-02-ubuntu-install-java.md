---
layout: post
title: "Ubuntu 下安装 java 及问题配置"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jdk, apt-get, ]
last_updated:
---

记录一下

    sudo apt-get install software-properties-common
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt-get update

或者下载 Oracle 的版本

    wget -c --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.tar.gz

    http://download.oracle.com/otn-pub/java/jdk/8u144-b01/090f390dda5b47b9b721c7dfaa008135/jdk-8u144-linux-x64.tar.gz

## 切换 java 版本
我们知道默认情况下我们会配置 `JAVA_HOME` 的位置，但是有些情况下需要依赖 java 运行的应用可能也会找到其他的系统自带的 JAVA 版本。

默认情况下 系统会去 `/usr/bin/java` 找对应的 Java 版本，可以使用

    sudo update-alternatives --list java

如果新安装 Java 版本可以使用

    sudo udpate-alternatives --install /usr/bin/java java /path/to/java 1

最后使用

    sudo update-alternatives --config java

选择系统要优先手动选择的 java 版本。
