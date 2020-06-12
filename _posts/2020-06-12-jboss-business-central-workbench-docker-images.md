---
layout: post
title: "JBoss 工作流相关 Docker 镜像整理"
tagline: ""
description: ""
category: 学习笔记
tags: [jboss, kie, kie-workbench, drools, ]
last_updated:
---


源代码地址：

- <https://github.com/jboss-dockerfiles/business-central>

三个可用的镜像：

- business-central-workbench

JBoss Business-Central Workbench 基础镜像，可以根据该镜像来扩展创建自己的镜像。

- business-central-workbench-showcase

继承自 JBoss Business-Central Workbench 镜像，可以直接使用的 Docker 镜像。提供了自定义的配置文件，默认的用户和角色。

- jBPM Server Full distribution

提供了可以立即执行的全部 jBPM 功能的镜像，包含全部必须的配置文件。包括 jBPM Workbench, Kie Server and jBPM Case Management Showcase。可以访问 [新手教程](http://jbpm.org/learn/gettingStarted.html) 来查看。



