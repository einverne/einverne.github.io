---
layout: post
title: "HBase 基本使用"
aliases: "HBase 基本使用"
tagline: "从 0 到 1"
description: ""
category: 学习笔记
tags: [hbase, database, apache, column-database, nosql, ]
last_updated: 2017-03-01
---


[[HBase]] — Hadoop Database，是一个分布式的、面向列的开源数据库，该技术来源于 Fay Chang 所撰写的 Google 论文《Bigtable：一个结构化数据的分布式存储系统》。HBase 是 Google Bigtable 的开源实现，就像 Bigtable 利用了 Google 文件系统（File System）所提供的分布式数据存储一样，HBase 在 Hadoop 之上提供了类似于 Bigtable 的能力，利用 Hadoop HDFS 作为文件系统，利用 Hadoop MapReduce 来处理 HBase 中海量数据，利用 [[ZooKeeper]] 作为协同服务，HBase 是 Apache 的 Hadoop 项目的子项目，

HBase 不同于一般的关系数据库，它是一个适合于非结构化数据存储的数据库。另一个不同的是 HBase 基于列的而不是基于行的模式。

HBase 是一个高可靠性、高性能、面向列、可伸缩的分布式存储系统，利用 HBase 技术可在廉价 PC Server 上搭建起大规模结构化存储集群。HBase 不是关系型数据库，不支持 SQL。


> Apache HBase™ is the Hadoop database, a distributed, scalable, big data store.

> Use Apache HBase™ when you need random, realtime read/write access to your Big Data. This project's goal is the hosting of very large tables -- billions of rows X millions of columns -- atop clusters of commodity hardware. Apache HBase is an open-source, distributed, versioned, non-relational database modeled after Google's Bigtable: [A Distributed Storage System for Structured Data](http://research.google.com/archive/bigtable.html) by Chang et al. Just as Bigtable leverages the distributed data storage provided by the Google File System, Apache HBase provides Bigtable-like capabilities on top of Hadoop and HDFS.


## HBase 结构

3 维 map，三个维度分别是

- rowkey 主键
- column 由 family:qualifier 两部分组成， family 列族，和 qualifier 来确定唯一的列
- timestamp 数据写入时间戳

HBase 的 map 是按照 key 来排序的，其将 key 转换为 byte[], 然后顺序进行存储。

- 表名为字符串
- Rowkey 和 ColumnName 是二进制 byte[]
- Timestamp 是 64 位整数 Java 中 long 类型
- value 是一个字节数组 byte[]

### 行主键 rowkey

行以 rowkey 作为唯一标识，rowkey 是一段字节数组，任何东西都能保存进去，字符串，数字等等。行按照字典序由低到高存储在表中。rowkey 可以是任意字符串，最大长度 64KB。

HBase 不支持条件查询和 Order by 查询，读取记录只能按照 rowkey 及其 range 或全表扫描，因此 rowkey 需要根据业务来设计以利用其字典序特性排序提高性能。

行的一次读写是原子操作，这个设计使得 HBase 的并发更新操作更加易懂。

### 列族和列 column family

列族是列的集合，要准确表示一个列，`列族：列名` 方式。列族（Column family）需要 **在创建表时指定** ，列（Column）则不需要，可以随时在使用时创建。列族的成员在文件系统中都存储在一起，列族中所有列存储方式都一致。HBase 的每一个列都属于一个列族，以列族名为前缀，例如 `A:a` 和  `A:b` 都属于 A 列族。

### 时间戳 timestamp

HBase 通过 row 和 column 确定一份数据（Cell），不同版本值按照时间倒序排序，查询时默认返回最新数据。存储的值根据 `tableName + RowKey + ColumnKey + Timestamp => value` 唯一确定。Cell 中数据没有类型，字节码存储。

每个保存的 Cell 数据都会保存多版本，版本通过时间戳来索引，时间戳由 HBase 在数据写入时自动赋值，时间戳为系统时间毫秒。如果客户端想要显示赋值也可以，每个 Cell 中，不同时间版本数据按照时间倒序排列，最新的数据排在最前。

为了避免数据存在过多版本造成的的管理 （包括存贮和索引）负担，HBase 提供了两种数据版本回收方式。一是保存数据的最后 n 个版本，二是保存最近一段时间内的版本（比如最近七天）。用户可以针对每个列族进行单独设置。


## 基本使用

包括安装和基本使用

### 安装

从 [Apache Download Mirrors](http://www.apache.org/dyn/closer.cgi/hbase/) 下载，从 stable 目录下下载 `.tar.gz` 的文件，比如 `hbase-0.94.27.tar.gz`

    $ tar xfz hbase-0.94.27.tar.gz
    $ cd hbase-0.94.27

安装依赖基础

- Linux
- JDK，需要 1.6 及以上

确保 `/etc/hosts` 目录下

    127.0.0.1 localhost
    127.0.0.1 ubuntu.ubuntu-domain ubuntu

不要有 127.0.1.1 类似的出现，用 `#` 注释掉，如果有 ipv6 的地址也最好注释掉或者删掉。

编辑 `vim conf/hbase-site.xml`

    <?xml version="1.0"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
    <configuration>
      <property>
        <name>hbase.rootdir</name>
        <value>file:///DIRECTORY/hbasedata</value>
      </property>
      <property>
        <name>hbase.zookeeper.property.dataDir</name>
        <value>/DIRECTORY/zookeeper</value>
      </property>
    </configuration>

配置其中的 `hbase.rootdir` 指向本地的目录，目录保存 HBase 的文件，HBase 会自动创建。默认数据存储目录为 `/tmp/hbase-${user.name}`

编辑 `conf/hbase-env.sh` 文件，配置如下两项，找到本地 Java 安装目录，可以使用 `whereis java` 来获取，将 JDK 的根目录配置如下：

    export JAVA_HOME="/usr/lib/jdk"
    export HBASE_MANAGES_ZK=true

然后使用如下命令启动 HBase：

	$ ./bin/start-hbase.sh

    starting Master, logging to logs/hbase-user-master-example.org.out

单机模式启动，停止的脚本也在同目录下。单机模式表示 HBase 所有服务都运行在一个 JVM 中，包括 HBase 和 Zookeeper。HBase 还有另外两种启动运行方式，伪分布式和分布式模式。


### 连接 HBase

使用自带的客户端连接

    $ ./bin/hbase shell
    HBase Shell; enter 'help<RETURN>' for list of supported commands.
    Type "exit<RETURN>" to leave the HBase Shell
    Version: 0.90.0, r1001068, Fri Sep 24 13:55:42 PDT 2010
    hbase(main):001:0>


### 初步熟悉

创建表，插入数据

    hbase(main):003:0> create 'test', 'cf'
    0 row(s) in 1.2200 seconds
    hbase(main):003:0> list 'test'
    1 row(s) in 0.0550 seconds
    hbase(main):004:0> put 'test', 'row1', 'cf:a', 'value1'
    0 row(s) in 0.0560 seconds
    hbase(main):005:0> put 'test', 'row2', 'cf:b', 'value2'
    0 row(s) in 0.0370 seconds
    hbase(main):006:0> put 'test', 'row3', 'cf:c', 'value3'
    0 row(s) in 0.0450 seconds

cf 为 column family 列族，列族要求在创建表时指定，列族的成员在文件系统上存储在一起，HBase 的优化存储针对列族级别。

可以使用 list 命令来查询表名


然后可以使用 scan 'test' 来查询

    hbase(main):006:0> scan 'test'
    ROW    COLUMN+CELL
     row1    column=cf:a, timestamp=1480648404221, value=value1
     row2    column=cf:b, timestamp=1480648416039, value=value2
     row3   column=cf:c, timestamp=1480648427572, value=value3
    3 row(s) in 0.0450 seconds

也可以使用 get 命令来获取记录

    hbase(main):008:0> get 'test', 'row1'
    COLUMN      CELL
    cf:a        timestamp=1288380727188, value=value1
    1 row(s) in 0.0400 seconds

删除记录

delete 方法只能删除 column

    hbase(main):020:0> delete 'test', 'row2', 'cf:b'
    0 row(s) in 0.0080 seconds

使用 deleteall 来删除 rowkey 的所有 column

    hbase(main):001:0> deleteall 'test', 'row1'
    0 row(s) in 0.3090 seconds

使用 disable 和 drop 来删除表

    hbase(main):012:0> disable 'test'
    0 row(s) in 1.0930 seconds
    hbase(main):013:0> drop 'test'
    0 row(s) in 0.0770 seconds

不清楚命令使用格式，可以使用 `help "list"` 来查看命令的具体使用帮助。

退出使用 `exit<Enter>`

最后退出可以使用 `./bin/stop-hbase.sh` 来停止 hbase。

## 其他问题

### Mac 下尝试

Mac 下安装 HBase 可以参考这篇

- http://chase-seibert.github.io/blog/2013/02/01/getting-starting-with-hbase-and-pig.html

### 其他问题

Hbase error zookeeper exists failed after 3 retries

    16/12/02 10:45:28 INFO zookeeper.ClientCnxn: Opening socket connection to server localhost/127.0.0.1:2181. Will not attempt to authenticate using SASL (unknown error)
    16/12/02 10:45:28 WARN zookeeper.ClientCnxn: Session 0x0 for server null, unexpected error, closing socket connection and attempting

### 配置

更多的配置可以参考

<http://hbase.apache.org/0.94/book/configuration.html>

- standalone mode
- Pseudo-Distributed mode
- Distributed mode

## reference

- <http://hbase.apache.org/>
- <http://hbase.apache.org/book.html#quickstart>
- <http://hbase.apache.org/0.94/book/quickstart.html#d1984e105>
- <https://www.cloudera.com/documentation/enterprise/5-8-x/topics/cdh_ig_hbase_installation.html>
- <https://www.tutorialspoint.com/hbase/hbase_installation.htm>
- <https://www.tutorialspoint.com/hbase/hbase_overview.htm>
- <http://blog.csdn.net/u014419512/article/details/27966957>
- <http://www.cnblogs.com/vichao/p/3187369.html>
