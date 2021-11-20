---
layout: post
title: "MySQL 中的大小写敏感设置"
tagline: ""
description: ""
category: 经验总结
tags: [mysql, sql, index, ]
last_updated:
---


默认情况下 MySQL 中存储内容不是大小写敏感的。MySQL 的大小写和建数据库时的排序规则有关。

- `utf8_bin` 则是将字符串中的每一个字符用二进制存储，bin 是 binary case sensitive collation，区分大小写
- `utf8_general_ci` 不区分大小写，ci 为 case insensitive
- `utf8_general_cs` 区分大小写，cs 为 case sensitive 缩写


### 建表时字段区分大小写
在建表时可以通过 BINARY 来区别

比如

    CREATE TABLE test
    (
        name VARCHAR(20),
        UNIQUE(name)
    );

    mysql>     INSERT INTO test VALUES('California');
    Query OK, 1 row affected (0.00 sec)

    mysql>     INSERT INTO test VALUES('california');
    ERROR 1062 (23000): Duplicate entry 'california' for key 'name'

    mysql>     INSERT INTO test VALUES('cAlifornia');
    ERROR 1062 (23000): Duplicate entry 'cAlifornia' for key 'name'

    mysql>     INSERT INTO test VALUES('cALifornia');
    ERROR 1062 (23000): Duplicate entry 'cALifornia' for key 'name'

    mysql> SELECT * FROM test;
    +------------+
    | name       |
    +------------+
    | California |
    +------------+
    1 row in set (0.00 sec)

如果需要配置大小写敏感则需要使用 `BINARY`

    mysql>     CREATE TABLE test
        ->     (
        ->         name varchar(20) BINARY,
        ->         UNIQUE(name)
        ->     );
    Query OK, 0 rows affected (0.00 sec)

    mysql>
    mysql>     INSERT INTO test VALUES('California');
    Query OK, 1 row affected (0.00 sec)

    mysql>
    mysql>     INSERT INTO test VALUES('california');
    Query OK, 1 row affected (0.00 sec)

    mysql>     INSERT INTO test VALUES('cAlifornia');
    Query OK, 1 row affected (0.00 sec)

    mysql>     INSERT INTO test VALUES('cALifornia');
    Query OK, 1 row affected (0.00 sec)

    mysql>
    mysql>     SELECT * FROM test;
    +------------+
    | name       |
    +------------+
    | California |
    | cALifornia |
    | cAlifornia |
    | california |
    +------------+
    4 rows in set (0.00 sec)


## 查询区分大小写
当然在建库，或者建表时已经排序规则之后就要按照之前的约定，如果没有约定，按照默认则需要自己指定。

强制让 where 语句中区分大小写需要在 where 后添加 binary

    select * from table where binary name='Abc'


## 配置表名大小写不敏感
需要修改配置

    /etc/mysql/my.cnf

在 [mysqld] 配置下面：

    lower_case_table_names = 1

然后需要重新加载 mysql 配置或者重启 MySQL 服务。


## reference

- <https://stackoverflow.com/a/20876063/1820217>
