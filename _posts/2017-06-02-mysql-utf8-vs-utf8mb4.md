---
layout: post
title: "MySQL 中 utf8 和 utf8mb4 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, encoding, utf8, unicode, ]
last_updated:
---

今天在插入 MySQL 时遇到如下错误

    Incorrect string value: ‘\xF0\x9F\x98\x81…’ for column ‘data’ at row 1

查证之后发现是因为插入的时候字符串中有 emoji，而 emoji 是 unicode 编码，MySQL 当时在建表时选择了 utf8 编码，导致了上述错误。mysql 支持的 utf8 编码最大字符长度为 3 字节，如果遇到 4 字节的宽字符就会插入异常了，因此引出了 utf8mb4 编码。MySQL 在 5.5.3 之后增加了这个 utf8mb4 的编码，mb4 就是 most bytes 4 的意思，专门用来兼容四字节的 unicode。好在 utf8mb4 是 utf8 的超集，除了将编码改为 utf8mb4 外不需要做其他转换。当然，为了节省空间，一般情况下使用 utf8 也就够了。

为了获取更好的兼容性，应该总是使用 utf8mb4 而非 utf8，对于一般性要求建议普通表使用 utf8， 如果这个表需要支持 emoji 就使用 utf8mb4。


## 深入 Mysql 字符集设置

字符 (Character) 是指人类语言中最小的表义符号。例如’A'、’B'等；给定一系列字符，对每个字符赋予一个数值，用数值来代表对应的字符，这一数值就是字符的编码 (Encoding)。例如，我们给字符’A'赋予数值 0，给字符’B'赋予数值 1，则 0 就是字符’A'的编码；给定一系列字符并赋予对应的编码后，所有这些字符和编码对组成的集合就是字符集 (Character Set)。例如，给定字符列表为{‘A’,'B’}时，{‘A’=>0, ‘B’=>1}就是一个字符集；

字符序 (Collation) 是指在**同一字符集内字符之间的比较规则**；确定字符序后，才能在一个字符集上定义什么是等价的字符，以及字符之间的大小关系；每个字符序唯一对应一种字符集，但一个字符集可以对应多种字符序，其中有一个是默认字符序 (Default Collation)；

MySQL 中的字符序名称遵从命名惯例：以字符序对应的字符集名称开头；以 `_ci`（表示大小写不敏感）、`_cs`（表示大小写敏感）或 `_bin`（表示按编码值比较）结尾。例如：在字符序 `utf8_general_ci` 下，字符 “a” 和“A”是等价的；

## 字符集相关命令

检测字符集问题的一些手段

- SHOW CHARACTER SET;
- SHOW COLLATION;
- SHOW VARIABLES LIKE 'character%';
- SHOW VARIABLES LIKE 'collation%';
- 查看数据库的字符集 `use dbname;SELECT @@character_set_database, @@collation_database;`
- 查看表的字符集 `SHOW TABLE STATUS where name like 'table_name';`
- 查看表中列的字符集 `SHOW FULL COLUMNS FROM table_name;`

其他一些修改语句

    # 修改数据库：
    ALTER DATABASE database_name CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
    # 修改表：
    ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    # 修改表字段：
    ALTER TABLE table_name MODIFY column_name VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ALTER TABLE table_name CHANGE column_name column_name VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


