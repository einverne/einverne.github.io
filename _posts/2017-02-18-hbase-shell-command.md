---
layout: post
title: "HBase Shell Command"
tagline: ""
description: "HBase 命令行工具"
category: 学习笔记
tags: [HBase, Linux]
last_updated: 
---

HBase Shell 是 HBase 提供的一个简单方便的命令行工具，用它可以直接操作 HBase，对 HBase 进行各种设置。 HBase Shell 提供的命令可以对对 HBase 数据进行增删改查。在上一篇[HBase 介绍](/post/2017/02/hbase-introduction-and-use.html)中对 HBase 做了简答的介绍，也初识了一些命令行。

可以在启动 HBase 之后，通过 `$ ./bin/hbase shell` 来进入 HBase Shell。

## 常用命令

### 基础命令

- status

	查询服务器状态

- version

	查询 HBase 版本

- whoami

	查看连接用户

## 基本 SHELL 命令

### 查询所有表名

列举数据库中所有表

    list

### 创建表

create 命令

    create 'table_name', 'cf1', 'cf2'

其中的 cf1 和 cf2 为列族名1，列族名2，列族需要在见表时确定，列则不需要， Column Family 是 Schema 的一部分，设计时就需要考虑。

### 测试表是否存在

	exists 'table_name`

会显示表是否存在：

    hbase(main):002:0> exists 'test'
    Table test does exist
    0 row(s) in 0.2650 seconds


### 增加记录

put 命令

插入数据，对于同一个 rowkey，如果执行两次 put，则认为是更新操作

    put 'table_name', 'rowkey', '列族名1:列名1', 'value'

`put 't1', 'r1', 'c1', 'value', ts1` 一般情况下 ts1(时间戳) 可以省略， Column 可以动态扩展，每行可以有不同的 Column。

### 增加指定表，行或者列的值

incr

### 显示表结构

describe 命令查看表结构，显示HBase 表 schema，以及 column family 设计

    describe 'table_name'


### 查询表行数

计算表的行数，count 一般比较耗时，使用 

    count 'table_name'

查询所有 rowkey

    count 'table_name', { INTERVAL => 1 }


### 查询记录

get 命令获取数据，HBase 的shell操作，大概顺序就是命令后接表明，rowkey，列名然后在后面用花括号加上其他条件。

获取指定rowkey的指定列族指定列的数据，每个Column 可以有任意数量的 Values，按照 Timestamp 倒序自动排序，可以使用 `scan 'table_name', {VERSIONS => 10}` 来验证，详细请查看 scan 命令

    get 'table_name', 'rowkey', '列族名:列名'

获取指定rowkey的指定列族所有的数据

    get 'table_name', 'rowkey', '列族名'

获取指定rowkey的所有数据

    get 'table_name', 'rowkey'

获取指定时间戳的数据

    get 'table_name', 'rowkey', {COLUMN=>'列族名:列', TIMESTAMP=>1373737746997}

获取多个版本值，查询默认返回最新的值

    get 'table_name', 'rowkey', {COLUMN => '列族名:列名', VERSIONS => 2}

HBase 按照rowkey 字典序(1, 100, 102, 20) 自动排序，每行包含任意数量 Column，每列按照 列名 Column Key 排序。如果有列族 cf，其中有列 cf:a, cf:b, cf:c， 则按照字典序排序。

每个数据由 TabelName+RowKey+Column+Timestamp=>Value 唯一确定。

### 删除记录

delete 命令删除表中数据，delete 命令只能用来删除某一列。

删除指定 rowkey 的指定列族的列名数据

    delete 'table_name', 'rowkey', '列族名:列名'

删除指定 rowkey 指定列族的数据

    delete 'table_name', 'rowkey', '列族名‘

使用 deleteall 命令来删除 rowkey 所有 column 的Value，删除整行数据

    deleteall 'table_name', ’rowkey'

### 删除表

在删除表之前需要使用 disable 命令，让表失效。在修改表结构时，也需要先执行此命令

    disable "table_name'

删除表使用 drop 命令

    drop 'table_name'


### 使表有效

enable 命令，和  disable 命令对应

    enable 'table_name'

### 修改表结构

alter 修改表的结构，新增列族，删除列族。在修改之前要先 disable ，修改完成后再 enable

新增列族 

    alter 'table_name', ‘列族'

删除列族 

    alter 'table_name', {name=>‘列族’, METHOD=>'delete'}

列族不能被重命名，通常创建新列族名，将数据复制过去，并删除旧的列族名。

    hbase(main):049:0> alter 'test','cf2'
    Updating all regions with the new schema...
    1/1 regions updated.
    Done.
    0 row(s) in 1.7520 seconds
    hbase(main):050:0> describe 'test'
    DESCRIPTION                                                                                                                               ENABLED
     'test', {NAME => 'cf', DATA_BLOCK_ENCODING => 'NONE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0', VERSIONS => '3', COMPRESSION => ' false
     NONE', MIN_VERSIONS => '0', TTL => '2147483647', KEEP_DELETED_CELLS => 'false', BLOCKSIZE => '65536', IN_MEMORY => 'false', ENCODE_ON_DI
     SK => 'true', BLOCKCACHE => 'true'}, {NAME => 'cf2', DATA_BLOCK_ENCODING => 'NONE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0', COM
     PRESSION => 'NONE', VERSIONS => '3', TTL => '2147483647', MIN_VERSIONS => '0', KEEP_DELETED_CELLS => 'false', BLOCKSIZE => '65536', ENCO
     DE_ON_DISK => 'true', IN_MEMORY => 'false', BLOCKCACHE => 'true'}
    1 row(s) in 0.1680 seconds
    hbase(main):052:0> alter 'test', {NAME => 'cf2', METHOD => 'delete'}
    Updating all regions with the new schema...
    1/1 regions updated.
    Done.
    0 row(s) in 1.5880 seconds
    hbase(main):053:0> describe 'test'
    DESCRIPTION                                                                                                                               ENABLED
     'test', {NAME => 'cf', DATA_BLOCK_ENCODING => 'NONE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0', VERSIONS => '3', COMPRESSION => ' false
     NONE', MIN_VERSIONS => '0', TTL => '2147483647', KEEP_DELETED_CELLS => 'false', BLOCKSIZE => '65536', IN_MEMORY => 'false', ENCODE_ON_DI
     SK => 'true', BLOCKCACHE => 'true'}
    1 row(s) in 0.2010 seconds


### 全表扫描

scan

全表扫描

    hbase(main):043:0> scan 'test', {VERSIONS => 12}
    ROW           										COLUMN+CELL
     rowkey1                                               column=cf:a, timestamp=1487295285291, value=value 3
     rowkey1                                               column=cf:a, timestamp=1487294839168, value=value 2
     rowkey1                                               column=cf:a, timestamp=1487294704187, value=value 1

```
### 删除全表数据 truncate

删除全表数据，这个命令也是 disable，drop，create命令组合而成。

    truncate 'table_name'

### hbase shell 脚本

shell 命令，把所有的 hbase shell 命令写到一个文件内，类似与 Linux shell 脚本顺序执行所有命令，可以使用如下方法执行。

    hbase shell test.hbaseshell





