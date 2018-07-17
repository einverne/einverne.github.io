---
layout: post
title: "Ubuntu 下安装 Gradle 及简单使用"
tagline: ""
description: ""
category: 学习笔记
tags: [gradle, ubuntu, linux, usage, build-system, jvm, java]
last_updated:
---

Gradle 的核心是基于 Groovy 的 领域特定语言 (DSL)，目的是为了代替 XML 繁多的构建工具。

## 自动安装
可以使用这个 [PPA](https://launchpad.net/~cwchien/+archive/ubuntu/gradle)

    sudo add-apt-repository ppa:cwchien/gradle
    sudo apt-get update
    sudo apt install gradle

或者根据官网的[教程](https://gradle.org/install/) 手动安装。

## 使用

- <https://gradle.org/guides/#getting-started>
