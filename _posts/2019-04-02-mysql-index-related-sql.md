---
layout: post
title: "MySQL 中索引相关 SQL 语句"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, sql, index, query, ]
last_updated:
---

索引是用来加快从数据库中查询数据的速度的。

需要注意的是索引的使用会增加插入和更新的时间，因为在插入数据的同时也会更新索引。所以在创建索引时确保只在那些频繁作为查询条件的列中增加。


## 创建索引
创建索引时有几个需要注意的点：

- 不要在频繁写，而读取频率较低的表上使用索引，和之前说的那样，索引提高了读速度，而损耗了写速度
- 不要在 low cardinality 的列上使用索引，Cardinality 直接翻译是基数，可以理解成为这一列取值的散列程度，如果一个列包含的值只有少数几个，那么索引的效果也无法达到
- 不要在固定大小的表上使用索引，小数量集的表增加索引并不会带来多大的性能提升，所以尤其需要注意的是那些可能随着时间数据量增长很快的表，比如 `users` 表

在建表时

    CREATE INDEX idx_name ON table_name(column1, column2);

    ALTER TABLE `table_name` ADD INDEX idx_name (`column1`);

创建唯一索引

    ALTER TABLE `table_name` ADD UNIQUE uni_name (`column1`)

## 显示查看索引
查看表索引

    SHOW INDEX FROM table_name;

在查询的结果中可以看到索引的名字，列名，散列程度（Cardinality），索引类型（BTREE） 等等。

查询 Schema 中所有的索引

    SELECT DISTINCT
        TABLE_NAME,
        INDEX_NAME
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = 'your_schema';

## 删除索引

    DROP INDEX idx_name ON table_name;

    ALTER TABLE table_name DROP INDEX idx_name;


## Single index vs Composite index
组合索引和单一索引一样，不过组合索引是需要组合多列。

假设有用户表 `users`

    ID | first_name | last_name    | class      | position |
    --------------------------------------------------------
     1 | Teemo      | Shroomer     | Specialist | Top      |
     2 | Cecil      | Heimerdinger | Specialist | Mid      |
     3 | Annie      | Hastur       | Mage       | Mid      |
     4 | Fiora      | Laurent      | Slayer     | Top      |
     5 | Garen      | Crownguard   | Fighter    | Top      |

然后在 `class` 和 `position` 列上创建组合索引

    CREATE INDEX class_pos_index ON users (class, position);

然后数据库会创建一个组合索引的排序，类似：

    class-position       Primary Key
    --------------------------------
    AssassinMid       -> 10
    ControllerSupport -> 16
    ControllerSupport -> 18
    ControllerSupport -> 8
    FigherTop         -> 7
    FigherTop         -> 9
    FighterJungle     -> 13
    FighterJungle     -> 21
    FighterJungle     -> 23

假设需要查询班级中的 Top，那么会提升速度：

    SELECT * FROM users
    WHERE
      class = 'Specialist'
    AND
      position = 'Top';

因为按照了 `class-position` 来排序，所以查询速度得到了提升。数据库能够在 `O(log_2(n))` 时间内查找到 `Specialist-Top` 而不需要读取全表。

需要注意的是即使查询条件只有 `class` 字段，组合索引依然能够提升速度，因为`class` 在组合索引的第一个位置。

但是单纯的查询 position

    SELECT * FROM users WHERE position = 'Top';

则享受不到组合索引带来的好处。所以组合索引的列顺序非常关键。

创建组合索引的一些注意点：

- 如果特定列固定的出现在查询条件中，那么对这些列创建组合索引比较好
- 如果要创建 field1 上的索引，也要创建 (field1, field2) 上的索引，那么只创建一个组合索引 (field1, field2) 已经足够
- 和 Single indexes 一样，组合索引的 Cardinality 一样重要。显然当两个 field 有高的 Cardinality，组合索引的 Cardinality 也会很高。但是某一些情况下低 Cardinality 的列也会有高的 Cardinality 组合索引


## reference

- <https://medium.com/@User3141592/single-vs-composite-indexes-in-relational-databases-58d0eb045cbe>
- <https://stackoverflow.com/a/5213364/1820217>
