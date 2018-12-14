---
layout: post
title: "Ubuntu 下安装 java"
tagline: ""
description: ""
category: 学习笔记
tags: [java, jdk, apt-get]
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

    sudo update-alternatives --config java
