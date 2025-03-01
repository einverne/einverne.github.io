---
layout: post
title: "无代码数据库 NocoDB 使用体验"
aliases:
- "无代码数据库 NocoDB 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [ open-source, nocodb, airtable, mysql, low-code, excel, restful, slack, discord, table ]
create_time: 2025-02-25 10:41:43
last_updated: 2025-02-25 10:41:43
dg-home: false
dg-publish: false
---

[DocoDB](https://www.nocodb.com/) 是一款开源的无代码数据库平台，可以进行数据管理和应用开发。 它的灵感来自 [[Airtable]]，支持与 Airtable 类似的电子表格式交互、关系型数据库 Schema 设计、API 自动生成等特性。

Github：<https://github.com/nocodb/nocodb>

NocoDB 是一款开源的无代码数据库平台，可以进行数据管理和应用开发。它支持多种数据源，包括 MySQL、PostgreSQL、SQL Server、SQLite 等主流关系型数据库，也能连接 Airtable、Google 表格等 SaaS 服务。

NocoDB 的本质是将数据库中的数据以在线 Excel 或者接口的方式开放出来，提供本地部署和云托管两种模式。

## 特点

- 在线表格界面：包括创建、读取、更新和删除表格、列和行等基本操作，以及排序、筛选、隐藏/显示列、多种视图类型（网格、画廊、表单视图和看板视图）、视图权限类型、共享基础/视图、变体单元格类型等
- 跨应用集成: 提供多种集成，包括聊天（比如 Slack、Discord）、电子邮件和存储服务
- 编程访问: 提供 REST API 和 NocoDB SDK，支持以编程方式调用操作
- 同步模式: 允许同步在 NocoDB GUI 之外所做的模式更改

## 表操作

- 基本操作，包括创建，读取，更新，删除表，行，列
- 字段的排序，过滤，隐藏，取消隐藏
- 多视图类型，网格，图表，看板
- 权限
- 共享基础
- 单元格类型，ID、LinkToAnotherRecord、Lookup、Rollup、SingleLineText、附件、货币、公式等
- 角色访问控制

## 接口访问

- REST API
- NocoDB SDK

## 部署

推荐直接使用 docker compose 部署，可以参考我的[配置](https://github.com/einverne/dockerfile)。

启动完了之后直接访问 8080 端口。

在注册页面完成初始化注册。

## NocoDB vs NocoBase

NocoDB 和 NocoBase 是两款开源的低代码，无代码的开发平台，但是两者在设计和实现上有一些差异。

NocoDB 更注重将关系型数据表结构以电子表格的形式扩展到网页，并提供了 API 来进行查询和更新。

而 NocoBase 则更偏重企业应用，不仅提供了表单在线预览，还提供了强大的工作流，以及为企业

## related

- [[baserow]]
- [[undb]]
- [[Teable]]
- [[Directus]]
- [[strapi]]
