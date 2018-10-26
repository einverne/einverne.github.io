---
layout: post
title: "Drools Kie"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, rules, java]
last_updated:
---

Drools 是一个 Java 实现的开源规则引擎 (Rule Engine)，或者又被称为 Business Rules Management System(BRMS) 。Drools workbench 被叫做 Drools-WB，KIE-WB（或者也叫 KIE Drools workbench) 组合了 Guvnor, Drools 和 jBPM 插件。[^1]

[^1]: <http://www.kiegroup.org/>

Kie Server 是一个模块化的，独立的组件，可以用来演示和执行规则和流程。

KIE 全称是 Knowledge Is Everything [^2]


[^2]: <https://docs.jboss.org/drools/release/7.12.0.Final/drools-docs/html_single/index.html>

## 规则引擎用来处理什么问题
Drools 用来解决复杂规则的问题。现实问题往往会有很多逻辑判断，而如果将这些逻辑判断都编码写死在代码逻辑中，不仅实现混乱，而不易于维护。Drools 可以让应用逻辑和数据逻辑分离，通过直观的规则编排将数据逻辑单独处理。

从网上摘抄了一段规则引擎（BRMS）的特点：

- 业务规则可以嵌入应用程序任何位置
- 可持久化
- 测试场景可视化
- 版本控制
- 类人语言

## Docker 启动 drools workbench
Google 搜索之后发现 drools-workbench 有下面两个版本，不带 `showcase` 的版本是设计用来扩展，可以增加自己的的配置的镜像，而如果想要直接使用，那么可以使用 `drools-workbench-showcase:latest` 这个镜像，这个镜像包含了一些默认的配置。

    docker pull jboss/drools-workbench
    docker pull jboss/drools-workbench-showcase

拉取镜像后

    docker run -p 8080:8080 -p 8001:8001 -d --name drools-wb jboss/drools-workbench-showcase:latest

当应用启动后，可以访问 <http://localhost:8080/drools-wb> 来体验 workbench 功能。

下面是镜像中默认包含的用户和角色：

    USER        PASSWORD    ROLE
    *********************************************
    admin       admin       admin,analyst,kiemgmt
    krisv       krisv       admin,analyst
    john        john        analyst,Accounting,PM
    sales-rep   sales-rep   analyst,sales
    katy        katy        analyst,HR
    jack        jack        analyst,IT

如果想要自己扩展用户，那么可以尝试使用不带 `showcase` 的版本。



## Docker 启动 Kie Server
拉取镜像

    docker pull jboss/kie-server-showcase

拉取完成后，如下启动：

    docker run -p 8180:8080 -d --name kie-server --link drools-wb:kie_wb jboss/kie-server-showcase:latest



## reference

- <http://www.drools.org/>
- <https://hub.docker.com/r/jboss/drools-workbench-showcase/>
- <https://training-course-material.com/training/Drools_KIE_introduction>
- <https://blog.csdn.net/chinrui/article/details/79018351>
