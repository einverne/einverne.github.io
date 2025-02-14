---
layout: post
title: "基于表格的无代码数据库 Teable 介绍"
aliases:
- "基于表格的无代码数据库 Teable 介绍"
tagline: ""
description: ""
category: 产品体验
tags: [github, open-source, saas, self-hosted, postgresql, no-code, airtable, ]
create_time: 2024-03-15 09:29:45
last_updated: 2024-03-15 09:29:45
dg-home: false
dg-publish: false
---

[Teable](https://github.com/teableio/teable) 是一个非常快，实时，专业，开发者友好的 No Code 数据库。Teable 构建在 PostgreSQL 之上，使用一个简介的，表格类似界面，可以基于此构建复杂的企业级别的数据库应用。

## 功能

Spreadsheet-like 界面

- 单元格编辑，每一个单元格都可以编辑
- 公式支持，支持直接在单元格进行公式计算
- 数据排序和过滤，基于列或者多列的排序过滤
- Aggregation Function，聚合方法，根据列，计算，统计 sum， average，count，max，min 等
- 数据格式化，格式化数字，日期等
- 分组，行组织成组
- 固定列，固定表格左侧的列，滚动时可见
- 导入导出 csv xlsx 格式
- 行样式和条件格式
- 图表和可视化工具，从表格数据创建图标，比如条形图，饼图，折线图等（即将推出）
- 数据验证，限制或验证单元格中的数据（即将推出）
- 撤销和重做（即将推出）
- 评论和注释（即将推出）
- 替换查找（即将推出）

多视图

以特定的方式显示数据

- Grid View，网格视图，默认，电子表格形式展示
- Form View，表单格式，用于输入数据
- Kanban View，看板显示（即将推出）
- Calendar View，日历视图 （即将推出）
- Gallery View，图库视图（即将推出）
- Gantt View，甘特图，项目进度（即将推出）
- Timeline View，时间线视图（即将推出）

速度快

- 支持数百万数据
- 自动索引
- 批量操作

SQL 支持

- 可以与 BI 工具，比如 [[Metabase]]，[[PowerBi]] 等工具集成
- 和 [[Appsmith]] 这样的 No code 工具集成
- 支持原生 SQL 直接检索数据

Privacy First

- 支持自己托管数据

实时协作

- 为团队涉及，支持数据实时更新
- 支持团队协作，成员邀请和管理
- 完全的权限机制，支持表和列级别

扩展性

- 基于 React 的无后端编程能力
- 极低成本定制自己的应用程序
- 扩展脚本

Automation 自动化

- 使用 AI 或者可视化编程设计工作流

Copilot （即将推出）

- 通过聊天创建项目表格
- 澄城条形图分析
- 查看日程安排
- 等等

关键词说明：

- Space，Teable 中所有的内容都通过 Space 来管理，每一个 Space 都是独立的空间，可以邀请协作者单独管理 base
- base，是 Database 的缩略语，是存储数据的地方，workflow 也依赖于此
- table，用来管理不同的数据集
- view，用户可以创建 Grid，Form views，Gallery，Kanban，Calendar views 等等

## 总结

在 GitHub Trending 上看到这个项目就点开来看了一下，直接拉下来代码，看到当前项目的完成度还不错，直接在服务器上就跑起来了，但看到官方的说明，项目还在构建当中，还有很多功能在慢慢推进，我自己的话还没有来得及每个功能都尝试一遍，但以当前的完成度，还是果断关注一下，这个项目的想象空间还是挺大的，毕竟有了灵活的数据库可视化，很多服务都可以被代替掉。

## related

- [[PostgreSQL]]
- [[Airtable]]
