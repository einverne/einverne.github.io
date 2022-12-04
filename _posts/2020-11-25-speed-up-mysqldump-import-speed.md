---
layout: post
title: "提升 mysqldump 导入导出 MySQL 的速度"
aliases:
- "提升 mysqldump 导入导出 MySQL 的速度"
tagline: ""
description: ""
category: 经验总结
tags: [ mysql, linux, mysqldump, sql, methodology, ]
last_updated:
---

在前端时间网上泄漏出来一个巨大包括了近 8 亿 QQ 账号的绑定电话号码数据库，于是想着导入到本地的 MySQL 看看，提升一下查询的速度，因为这个巨大的绑定关系，即使用 grep 查询也需要花费非常多的时间。

于是我新建了表

```
CREATE TABLE `qq_bind` (
  `phone` bigint NOT NULL,
  `qq` bigint DEFAULT NULL,
  KEY `ix_qq_bind` (`phone`,`qq`),
  KEY `ix_qq` (`qq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

于是我想当然的想利用 mysqldump 命令来导入文件，但是发现导入的速度非常的慢，并且看到磁盘占用的速度飞速上升。以这样的导入速度，我大致计算了一下得一个多星期才能导入完成。

后来我就想办法怎么才可以提升这个导入的速度，发现如果表上有索引，或者 Primary Key 会大大的影响导入速度，所以：

1. 移除所有的索引，包括唯一索引，除非能确保导入的数据是唯一的，否则也不建议留着，Primary Key 也是索引。

但是我移除了所有的索引之后，再执行 mysqldump 速度虽然有提升，但依然非常慢。所以不得不找其他办法。

## 使用 LAOD DATA INFILE 导入文件到 MySQL
再搜寻了一番之后发现 MySQL 可以使用 `LOAD DATA INFILE` 这样的语句来批量导入数据。

登录 MySQL cli 后可以执行:

```
LOAD DATA INFILE '/Users/einverne/Downloads/demo.csv' 
IGNORE INTO TABLE demo_table 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n' 
IGNORE 1 ROWS;
```

或者使用命令行：

```
mycli -h host -u root -p -D database_name -e "LOAD DATA INFILE '/path/to/file.csv' INTO TABLE demo_table FIELDS TERMINATED BY ','"
```

说明：

- Terminated 字段分隔符（列分隔符）。一般是空格或者 `\t`
- Enclosed 字段括起字符。没有为空字符即可
- Escaped 转义字符。没有为空字符即可
- Terminated 记录分隔符（行结束符）

插入语句：

- Into Table 代表插入，记录已存在（唯一键约束）则失败不再往下执行。
- Replace Into Table 代表覆盖，记录已存在则覆盖（是整条记录覆盖，没有列出的字段给默认值）。
- Ignore Into Table 遇到已存在直接跳过。

## LOAD DATA INFILE 原理

`LOAD DATA INFILE` 比单纯的 INSERT 要快。

- insert 每次运行，都会更新一次索引，而 load 语句全部执行完才会更新索引。

需要注意的是，当时用  `LOCAL` 或者 `LOAD DATA` 时，文件的拷贝会保存到服务器的 temp 目录，这个目录不是由 `tmpdir or slave_load_tmpdir` 配置决定的，而是操作系统的临时目录 （temporary 目录）。

所以如果 CSV 文件比较大，操作系统临时目录无法放下，可以将文件分割成多份，分批次进行操作。

    $ split -l (numbersofrowsinfile / ((filesize/tmpsize) + 1)) /path/to/your/<file>.csv

## reference

- <https://dba.stackexchange.com/a/37497/124317>
- <https://dev.mysql.com/doc/refman/8.0/en/optimizing-myisam-bulk-data-loading.html>
- [如何导入 5 亿条数据到数据库](https://derwiki.tumblr.com/post/24490758395/loading-half-a-billion-rows-into-mysql)
