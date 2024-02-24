---
layout: post
title: "在两个 DataGrip 之间同步数据库配置以及一些使用笔记"
aliases: "在两个 DataGrip 之间同步数据库配置以及一些使用笔记"
tagline: ""
description: ""
category: 经验总结
tags: [jetbrains, datagrip, mysql, postgresql, sql, redis]
last_updated: 2024-02-23 09:13:29
create_time: 2021-09-27 07:58:28
---

DataGrip 是 JetBrains 出品的一款数据库管理工具。

## 同步

从 2021.1 版本开始，可以在 Data Source 上按下 Ctrl/Cmd+C 复制，然后在其他的 IDE 中使用 Ctrl/Cmd+V 来粘贴。

粘贴板会包含 Data Source 的 XML 配置。

但使用 Cmd+C 的同步方式，粘贴板并不会粘贴密码内容，所以粘贴之后也还需要输入数据库密码进行验证。

## 同步表结构

虽然这种情况我自己很少操作，但是看了一下还是有很多有这样的需求，这里就记录一下，比如有两个环境，本地开发环境和线上环境，如果本地已经完成表结构的变更，想要将这个表结构的更新同步到线上的数据库中，可以直接利用 DataGrip 的同步表结构。

![A1iMMEc1_1](https://pic.einverne.info/images/A1iMMEc1_1.png)

当然我个人推荐的做法是通过将 SQL 放入版本控制做好 Migration，或者使用自动化的 SQL 版本，比如 Python 下的 [[Alembic]] 来管理数据库表结构的版本，实现可以自动升级，降级等。
