---
layout: post
title: "maven 依赖管理"
tagline: ""
description: ""
category: 学习笔记
tags: [maven, build, java, linux]
last_updated: 
---


dependencyManagement主要有两个作用

- 集中管理项目的依赖项
- 控制使用的依赖项的版本


使用 dependencyManagement 声明依赖，并不引入，因此子项目需要显示声明需要用的依赖

- 如果不在子项目中声明依赖，是不会从父项目中继承下来的
- 只有在子项目中写了该依赖项，并且没有指定具体版本，才会从父项目中继承该项，并且version和scope都读取自父pom
- 如果子项目中指定了版本号，那么会使用子项目中指定的jar版本

dependencies 即使在子项目中不写该依赖项，那么子项目仍然会从父项目中继承该依赖项。父工程使用 dependencyManagement 假引用，目的是管理版本号。dependencies 用于实际上需要引入的工程，这些工程如果继承于父工程会找到对应的版本号。

