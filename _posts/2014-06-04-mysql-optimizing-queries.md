---
layout: post
title: "优化 SQL 语句"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, sql, optimize, slow-query, database,  ]
last_updated:
---


## CHAR vs VARCHAR
在设计数据库字段时经常需要保存字符，MySQL 中有两个容易混淆的字段 CHAR 和 VARCHAR。

- VARCHAR 是可变长度
- CHAR 是固定长度

如果预测到要保存的内容是固定长度，可以使用 CHAR，比如保存 MD5 值，保存性别代号等等。

## 合并语句
把对同一个表的修改合并为一个 alter 语句，避免多次拷贝，提高改表效率

合并

    altertable t1 addcolumn a int;
    altertable t1 addcolumn b int;

合并后

    altertable t1 addcolumn a int, add column b int;



## 更新语句

执行更新语句时尽量将同一张表的内容合并到一行。

    UPDATE tablename SET column1 = "value1", column2 = "value2" ....


## 主键
自增主键设置为 unsigned 类型， MySQL 表只能有一个主键，但是可以有多个唯一键，可以尝试将自增 ID 作为主键，实际有意义的字段作为唯一键。

## 冗余索引
假如有 idx1(a,b) 和 idx2(a) 时，idx2 是没有必要的，当查询语句是 where a=xx 时会使用 idx1


