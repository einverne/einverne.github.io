---
layout: post
title: "MySQL 日期和时间函数"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, database, sql, date, time, ]
last_updated:
---

记住一些常用的时间操作函数能够提高 SQL 查询的效率。比如查询过去 30 天的记录，如果不清楚 `DATE_SUB()` 函数可能需要手动计算一下时间点再查询，但是如果知道 `DATE_SUB()` 函数就可以

    SELECT something FROM tb_name WHERE DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= daet_col;

这个 SQL 同样会查找出来当前时间点未来的记录。

## 获取时间

获取当前时间

    mysql> SELECT NOW();
    +---------------------+
    | NOW()               |
    +---------------------+
    | 2019-07-01 09:12:46 |
    +---------------------+
    1 row in set (0.00 sec)

获取时间戳，同义于 NOW()

    mysql> SELECT CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP;
    +---------------------+---------------------+
    | CURRENT_TIMESTAMP() | CURRENT_TIMESTAMP   |
    +---------------------+---------------------+
    | 2019-07-01 09:13:13 | 2019-07-01 09:13:13 |
    +---------------------+---------------------+
    1 row in set (0.00 sec)

获取 UNIX 时间戳

    mysql> select UNIX_TIMESTAMP(NOW());
    +-----------------------+
    | UNIX_TIMESTAMP(NOW()) |
    +-----------------------+
    |            1562571055 |
    +-----------------------+
    1 row in set (0.00 sec)

获取当前的时间 `CURTIME()`，结果为 `hh:mm:ss` 格式

    mysql> SELECT CURTIME();
    +-----------+
    | CURTIME() |
    +-----------+
    | 09:13:53  |
    +-----------+
    1 row in set (0.01 sec)

或者

    mysql> SELECT CURTIME() + 0;
    +---------------+
    | CURTIME() + 0 |
    +---------------+
    |         91525 |
    +---------------+
    1 row in set (0.02 sec)

## 计算时间
如果能查得当前时间，那么通过计算函数就能够非常快速的得到，比如过去一周，过去三十天的时间戳。


## 时间转换
从一个时间转换成另外一种表现方式

- 天数 <==> 日期
- UNIX 时间戳 <==> 日期
- 秒数 <==> 时间

### TO_DAYS
传入日期，返回一个从第 0 年 ( '0000-00-00') 开始到传入日期的天数

    mysql> SELECT TO_DAYS('0000-01-01');
    +-----------------------+
    | to_days('0000-01-01') |
    +-----------------------+
    |                     1 |
    +-----------------------+

同理还有 `TO_SECONDS(expr)` 方法

### FROM_DAYS
给定一个天数，返回日期。

相类似的方法还有 `FROM_UNIXTIME(unix_timstamp)`，接受一个时间戳返回日期

### 时间到秒
`TIME_TO_SEC(time)` 传入时间返回秒数

    mysql> SELECT TIME_TO_SEC('22:23:00');
            -> 80580
    mysql> SELECT TIME_TO_SEC('00:39:38');
            -> 2378

同理从秒数到时间 `SEC_TO_TIME(seconds)`

## 时间日期计算
给日期增加或者减少，加减运算

### 时间间隔
增加时间

    ADDDATE(date,INTERVAL expr unit), ADDDATE(expr,days)
    DATE_ADD(date,INTERVAL expr unit), DATE_SUB(date,INTERVAL expr unit)

举例

    mysql> select DATE_ADD(NOW(), INTERVAL 1 DAY);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 HOUR);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 MINUTE);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 SECOND);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 MICROSECOND);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 WEEK);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 MONTH);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 QUARTER);
    mysql> select DATE_ADD(NOW(), INTERVAL 1 YEAR);
    mysql> select DATE_ADD(NOW(), INTERVAL -1 YEAR);

同理减时间

    SUBDATE(date,INTERVAL expr unit), SUBDATE(expr,days)
    DATE_SUB(date,INTERVAL expr unit)

## reference

- <https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html>
