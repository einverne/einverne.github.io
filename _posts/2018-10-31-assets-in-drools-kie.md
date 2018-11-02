---
layout: post
title: "Drools kie 中的 Assets"
tagline: ""
description: ""
category: 学习笔记
tags: [drools, rule-engine, kie, ]
last_updated:
---

Drools Workbench 中有很多的 Assets （资源）类型，每一种类型的 asset 都意味着一种类型的规则模型，下面就记录下学习的过程。

## Model
这个是最好理解的概念了，和 Java 的对象一样。可以通过基础类型定义一些抽象的概念。

## Data enumerations
枚举，和常见的枚举也没有太大差别，不过在 Drools 中会被下拉菜单用到。

Fact            | Field             | Context
----------------|-------------------|--------------
Applicant       | age               | [20, 25, 30]

然后会生成这样的代码

    'Applicant.age' : [20,25,30]

如果想要缩写可以使用等号，比如

    'Person.gender' : ['M=Male','F=Female']

## guided rules
向导型规则，通过 WHEN ，THEN 语句快速建立规则，相对比较简单的一种。在规则设计器中可以轻松的添加条件和结果规则。

## Guided decision tables
向导型决策表是一种以表格形式表现规则的工具，非常适合描述条件判断很多，条件又可以相互组合，有很多决策方案的情况。决策表可以将这些复杂的逻辑以一种精确而简单的表格形式整理出来，通过 Workbench 中直观的表格形式非常清晰。

Drools 中的决策表可以非常轻松的引导用户制作一个基于 UI 的规则，可以定义规则 attributes, metadata, conditions 和 actions。一旦通过 UI 形式定义好规则，那么所有的规则都会编译为 Drools Rule Language(DRL) 规则。

## guided rule templates
规则模板，可以使用占位符来生成模板来给其他使用

## Spreadsheet decision tables
由用户上传一张 excel 表


## Test Scenario
Test Scenario 用来验证规则是否符合预期，当规则发生改变，可以使用 Test Scenario 来回归测试。

## reference

- <http://docs.jboss.org/drools/release/latest/drools-docs/html_single/#guided-decision-tables-con>
