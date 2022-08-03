---
layout: post
title: "Drools Kie 简单使用"
aliases: "Drools Kie 简单使用"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, rules, java, rule-engine, kie, rete, jbpm ]
last_updated:
---

Drools 是一个 Java 的商业过程实现，这是 Bob McWhirter 所编写的一个开源项目，由 JBoss 和 Red Hat Inc 支持。 Drools 提供一个核心的 Business Rules Engine(BRE) 和一个网页编写规则的管理系统（Drools Workbench）和 一个 Eclipse IDE 的插件，一同构成完整的 Drools 生态。

Drools 是一个 Java 实现的开源[[规则引擎]] (Rule Engine)，或者又被称为 Business Rules Management System(BRMS) 。Drools workbench 被叫做 Drools-WB，KIE-WB（或者也叫 KIE Drools workbench) 组合了 Guvnor, Drools 和 jBPM 插件。[^1]

简单地来说，Drools 是一系列的工具集合允许用户将业务逻辑和数据分离。


[^1]: <http://www.kiegroup.org/>

Kie Server 是一个模块化的，独立的组件，可以用来演示和执行规则和流程。

KIE 全称是 Knowledge Is Everything [^2]

[^2]: <https://docs.jboss.org/drools/release/7.12.0.Final/drools-docs/html_single/index.html>

## Drools 功能划分
Drools 大致可以分为两个部分：Authoring 和 Runtime

- Authoring：编写规则部分，包括创建规则文件 .DRL 文件
- Runtime：包括创建工作内存处理规则等等

### Authoring
Authoring 包括：

- 规则文件 DRL 创建
- 语法检查
- 编译规则到源码文件

### Runtime
Drools Runtime 需要告诉如何执行特定 jar，用户可以在不同的 Runtime 中执行程序。

#### Working Memory
Working Memory 是 Drools Engine 的核心要素：Facts 被插入的时候。Facts 是 plain Java Classes，被插入到 Working Memory 的 Facts 会被修改或者扩展。

## 为什么会产生规则引擎
在企业复杂项目演进过程中随着外部条件复杂化会造成不断变化的业务逻辑，在系统实现时需要考虑将应用开发实现和商业业务决策逻辑**剥离**。这些规则可以**集中管理**，也可以在运行时**动态管理修改**，规则引擎正是基于上面的背景诞生的解决方案。

## 规则引擎用来处理什么问题
Drools 用来解决复杂规则的问题。现实问题往往会有很多逻辑判断，而如果将这些逻辑判断都编码写死在代码逻辑中，不仅实现混乱，而不易于维护。Drools 可以让应用逻辑和数据逻辑分离，通过直观的规则编排将数据逻辑单独处理。

通常来讲，如果一个系统需要接受一系列的参数，根据这些参数做一些决策，那么 Drools 应该都能够处理。

规则引擎（BRMS）的特点：

- 业务规则可以嵌入应用程序任何位置
- 可持久化
- 依据市场变化，业务规则需要能够快速，低成本更新
- 测试场景可视化
- 版本控制
- 类人语言

可以这么理解规则引擎，是一种在应用程序中可嵌入的组件，将业务逻辑从应用代码中分离，使用行业特定的规则模块编写业务逻辑，接受数据输入，解释业务规则，并根据规则做出业务决策。

## 规则引擎适用场景
规则引擎并不万能，在业务中使用规则引擎需要预先分析业务的使用场景，规则引擎适用于下面的场景：

- 业务规则数量有限，如果有成百条规则就明显不太适合使用规则引擎
- 规则经常发生变动


### 声明式编程
规则引擎描述做什么，而不是如何去做。规则可以对复杂问题进行简化，规则的事先声明也使得困难问题得以分步解决，并且可以通过规则来验证。不像程序代码，规则使用比较简单的语法规则书写，规则比编码更易读。

### 逻辑与数据分离
数据保存在系统对象，逻辑保存在规则，打破了面向对象编程系统中数据和逻辑耦合的问题。

当逻辑跨领域时更为有用，通过将逻辑规则集中在一起维护，取代了分散在代码中的问题。

### 速度和可测量
Rete 算法，Leaps 算法，提供了系统数据对象有效的匹配。RETE 算法来自 Dr. Charles Forgy 在 1979 年的 《专家系统原理和编程》中 [CIS587:The RETE Algorithm](https://cis.temple.edu/~ingargio/cis587/readings/rete.html)

### 集中化规则
通过规则，可以建立一个可执行的规则库，规则库代表着现实业务策略，理想情况下可读性高的规则还可以作为文档。

### 类自然语言的规则
通过 DSL 领域特定语言，可以让编码者通过接近自然语言的方式来编写规则。这让非技术人员和领域专家可以使用自己的逻辑来理解和编写规则。

### 工具集成
类似于 Eclipse 这样的工具提供了方法用来编辑和管理规则，并且可以用来提供反馈，校验。同时也有审计和调试的工具。

### 说明设施
Rule 系统提供了方法可以记录决策的结果，以及如何被决策的过程。

## 如何使用规则引擎
规则引擎至少应该包括：

- 加载卸载规则集 API
- 数据操作 API
- 引擎执行 API

使用规则引擎遵循五个典型步骤：

- 创建规则
- 向引擎添加或者更换规则
- 向引擎提交数据
- 引擎执行
- 导出引擎执行结果，获取数据

一个开放的规则引擎可以被嵌在程序任何位置。

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

## Drools
Drools 大体可以分为两个部分：Authoring 构建 和 Runtime 运行。

### Authoring
构建过程涉及到 `.drl` 规则文件创建，通过上面的 workbench 可以使用界面来创建规则。

### Runtime
运行时则是在执行规则的服务，kie 提供了 server 可以用来执行规则。

如果要 clone KIE 中的规则，那么在项目的 General Settings 中获取 SSH 地址

    git clone ssh://0.0.0.0:8001/MySpace/example

这个地址需要注意，如果是使用 Docker 安装的，那么在 clone 的地址中需要加入用户

    git clone ssh://admin@0.0.0.0:8001/MySpace/example

然后再使用密码即可。

## reference

- <http://www.drools.org/>
- <https://hub.docker.com/r/jboss/drools-workbench-showcase/>
- <https://training-course-material.com/training/Drools_KIE_introduction>
- <https://blog.csdn.net/chinrui/article/details/79018351>
- <http://geosmart.github.io/2016/08/22/Drools%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/>
- <http://www.iigrowing.cn/java_gui_ze_yin_qing_zong_jie.html>
- <https://examples.javacodegeeks.com/enterprise-java/jboss-drools/jboss-drools-best-practices-tutorial/>
