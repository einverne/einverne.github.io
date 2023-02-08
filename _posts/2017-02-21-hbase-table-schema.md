---
layout: post
title: "HBase 如何设计 Table Schema"
aliases: "HBase 如何设计 Table Schema"
tagline: ""
description: ""
category: 学习笔记
tags: [hbase, schema, database, column-database, apache,  ]
last_updated:
---

[我们都知道](/post/2017/02/hbase-introduction-and-use.html) HBase 的基本结构由 rowkey，column, timestamp 组成。列存储数据不同于关系型数据库，MySQL 一旦建表，需要修改表结构时则需要执行对应的修改语句，而 HBase 在建完表之后，对于列的增加则不需要修改建表语句，但这并不意味着 HBase 的建表就可以随意建。

首先来看看 HBase 的结构

- Table, 表，HBase 按照表来组织数据
- Row, 行，Table 可以有多 Row，Table 按照 RowKey 进行索引
- Column Family，列族，一行可以分为多个列族，列族需要在建表 Schema 中指定
- Column Qualifier，和列族一起确定唯一列，一个列族可以有任意多个 Qualifier
- TimeStamp，支持多版本，用时间戳来确定数据版本

通过以上 Row, Column Family, Column Qualifier, TimeStamp 可以唯一确定一个基本存储单元 Cell。

## 关系型 vs 列存储

并没有关系型数据库到列存储数据库一对一的设计迁移，在关系型数据库中，设计的重点是描述实体和其他实体之间的关系，查询和索引可以在之后设计。

而在 HBase 中，遵循着查询优先的设计模式，所有可能的查询都需要在设计中体现，因此 Schema 的设计方式也因此而来。考虑查询的方式，然后设计 Schema，这样可以使得数据能够快速被查询到。另外需要注意 HBase 被设计用来在大数据集群中使用，当预计数据量能够到达一个层级的时候再考虑使用。

## rowkey 设计

rowkey 是 Table 的"主键"，设计时需要确保唯一性，数据按照 rowkey 大小顺序存储，rowkey 不是 schema 的一部分，但需要仔细设计：

- 类型：rowkey 为 byte[]，HBase 提供 String/int/short/long/float/double/boolean 向 byte[] 转化的函数。
- 随机读：根据 rowkey 的随机读会有索引的支持，效率很高。
- 顺序读：数据按 rowkey 大小顺序存储，按照 rowkey 范围 `[startKey, endKey)` 的顺序读，吞吐量很高。
- RowKey 字段的设计需要参考最高频的查询场景

rowKey 设计热点问题，rowKey 要尽量随机，不要出现连续 rowKey。

## 列族设计

建议 HBase 设计为高表，不宜使用过多列族。

列和列族名字不宜太长，HBase 会在内存中对列和列族做索引和缓存。
