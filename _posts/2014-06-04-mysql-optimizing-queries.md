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

- VARCHAR 是可变长度，仅使用必要的空间，需要额外使用 1 个或者 2 个字节来记录字符串长度，最大长度小于等于 255 字节，只需要额外使用一个字节，否则需要 2 个字节
- CHAR 是固定长度，MySQL 在存储 CAHR 时会删除所有末尾空格，适合存储很短的字符串，或者所有值都接近同一个长度


VARCHAR(10) 需要 11 个字节存储空间，VARCHAR(1000) 列需要 1002 字节存储，2 个字节用来存储长度信息。

适用场景：

- 字符串 COLUMN 的最大长度比平均长度大很多，列很少更新，不容易产生碎片
- 如果预测到要保存的内容是固定长度，可以使用 CHAR，比如保存 MD5 值，保存性别代号等等；对于经常需要更新的数据 CHAR 也比 VARCHAR 更好，定长 CHAR 不容易产生碎片

与 CHAR 和 VARCHAR 类似的类型还有 BINARY 和 VARBINARY，存储的是二进制字符串。二进制字符串存储的是字节码而不是字符，填充也不一样，MySQL 填充 BINARY 采用的是 `\0` 零字节，而不是空格，检索时也不会去掉填充值。

当存储二进制，并且希望 MySQL 使用字节码而不是字符进行比较时，这些类型比较有用。MySQL 比较 BINARY 字符串时，每次按一个字节，并且根据该字节的数值比较。因此，二进制比较比字符比较简单很多，也就更快。


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


