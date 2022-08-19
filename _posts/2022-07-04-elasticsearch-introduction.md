---
layout: post
title: "Elasticsearch 入门使用"
aliases:
- "Elasticsearch 入门使用"
tagline: ""
description: ""
category: 学习笔记
tags: [ elasticsearch, elastic, lucene, search, java ]
create_time: 2022-07-04 10:13:11
last_updated: 2022-07-04 10:13:11
---

[[Elasticsearch]] 是一款基于 [[Lucene]] 的开源的、分布式的搜索引擎。提供一个分布式、多租户的全文搜索引擎。提供 HTTP Web 界面和 JSON 格式接口。

Elasticsearch 由 Java 实现，是目前最流行的大数据存储、搜索和分析引擎。

GitHub：<https://github.com/elastic/elasticsearch>

大数据要解决三个问题：

- 存储
    - 传统关系型数据库 MySQL，Oracle 遇到瓶颈，Google 提出 Map/Reduce 和 Google File System，Hadoop 作为开源实现在业界得到应用，但 Hadoop 存储无法实现数据实时检索和计算
- 检索
    - [[Apache Hive]] 作为在 Hadoop 基础之上的数据仓库提供了查询分析的能力
- 展现

但 Elasticsearch + Kibana 的组合可以快速解决如上提到的问题。

Elasticsearch 是面向文档的，存储整个文档或对象，内部使用 JSON 作为文档序列化格式。

## installation

在使用 Linux 安装之前设置 `vm.max_map_count` 至少是 262144.

使之生效：

    sudo sysctl -w vm.max_map_count=262144
    
让系统重启之后也生效，需要编辑 `/etc/sysctl.conf` 添加一行：

```
vm.max_map_count=262144
```

通过 [docker-compose](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-compose-file) 安装。

也可以下载[手动安装](https://www.elastic.co/downloads/elasticsearch)。

我个人推荐在本地使用[单节点安装启用](https://github.com/einverne/dockerfile)。

默认情况，Elasticsearch 通过 9200 端口对外提供 REST API。Kibana 的默认端口是 5601。

如果遇到如下问题，请查看是否设置了 `vm.max_map_count`。

> es03_1    | ERROR: [1] bootstrap checks failed. You must address the points described in the following [1] lines before starting Elasticsearch.


### Single node
单节点的 Elasticsearch 可以使用 Docker 在本地启用，参考[这里](https://github.com/einverne/dockerfile)。

常用命令：

```
docker network create elastic
docker run --name es --net elastic -p 9200:9200 -p 9300:9300 -it docker.elastic.co/elasticsearch/elasticsearch:8.3.1
docker exec -it es /usr/share/elasticsearch/bin/elasticsearch-reset-password
```


## 概念

### Node
Node，节点，Elasticsearch 运行实例，集群由多个节点组成。节点存储数据，并参与集群索引、搜索和分析。

### Shard
Shard， 分片，数据中的一小部分，每一个分片是一个独立的 Lucene 实例，自身也是一个完整的搜索引擎。

索引会存储大量的数据，这些数据会超出单个节点的硬件限制，例如，占用 1TB 磁盘空间的 10 亿个文档的单个索引可能超出单个节点的磁盘容量，所以 Elasticsearch 提供了索引水平切分（Shard 分片）能力。

创建索引时只需要定义所需分片数量。每一个分片本身就是一个具有完全功能的独立「索引」，可以分布在集群中的任何节点上。

文档会被存储并被索引在分片中。但是当我们使用程序与其通信时，不会直接与分片通信，而是通过索引。

当集群扩容或缩小时，Elasticsearch 会自动在节点之间迁移分配分片。

分片分为：

- 主分片 primary shard
- 从分片 replica shard

从分片是主分片的副本，提供数据的冗余副本，在硬件故障时提供数据保护，同时服务于搜索和检索只读请求。

索引中主分片的数量在索引创建之后就固定了，但是从分片数量可以随时改变。

设置三个主分片和一组从分片

```
PUT /blogs
{
    "settings" : {
        "number_of_shards" : 3,
        "number_of_replicas" : 1
    }
}
```

分片很重要：

- 分片可以水平拆分数据，实现大数据存储和分析
- 跨分片进行分发和并行操作，提高性能和吞吐量

### Index
Index， 索引。在 Elasticsearch 中，存储数据的行为叫做索引 Indexing，在索引数据值前，要决定数据存储在哪里。

单个集群中可以定义任意多索引。

一个 Elasticsearch 集群可以包含多个索引（数据库），可以包含很多类型（表），类型中可以包含很多文档（行），文档中包含很多字段（列）。

```
关系数据库  -> 数据库 -> 表 -> 行 -> 列 (column)
Elasticsearch -> 索引 -> 类型 -> 文档 -> 字段（field)
```

在 Elasticsearch 中索引有不同的含义。

#### 作为名词
索引就是 Elasticsearch 提供的「数据库」。

#### 作为动词
为文档创建索引，就是将文档存储到索引（数据库）中的过程，只有建立了索引才能被检索。

#### 反向索引
在关系型数据库中为某一列添加索引，是在文件结构中使用 B-Tree 加速查询。在 Elasticsearch 和 Lucene 中使用 Inverted index （反向索引）的结构来实现相同的功能。

通常文档中的每一个字段都被创建了索引（有一个反向索引）

#### 创建索引
假如要创建员工名单：

```
PUT /corp/employee/1
{
"first_name" : "John",
"last_name" : "Smith",
"age" : 25,
"about" : "I love to go rock climbing",
"interests": [ "sports", "music" ]
}
```

- 为每一个员工文档创建索引
- 文档被标记为 `employee` 类型
- 这个类型会存放在 `corp` 索引中

### Document
Document 文档，可被索引的基本信息单元。文档以 JSON 表示。单个索引理论上可以存储任意多的文档。

### 副本
副本在分片或节点发生故障时提供高可用。

分片和对应的副本不可在同一个节点上

副本机制，可以提高搜索性能和水平扩展吞吐量，因为可以在所有副本上并行搜索。

默认情况下，Elasticsearch 中的每个索引都分配一个主分片和一个副本。集群至少需要有两个节点，索引将有一个主分片和一个完整副本。

### Query DSL 搜索
Elasticsearch 提供了灵活的查询语言，可以完成更加复杂的搜索任务。

使用 JSON 作为主体：

```
GET /megacorp/employee/_search
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}
```

### Aggregation
Elasticsearch 有一项功能叫做 Aggregation，类似于 GROUP BY，但是更强大。结合查询语句可以实现非常多的聚合操作。


### 分布式
Elasticsearch 可以被扩展到上百成千台服务器来处理 PB 级别的数据。Elasticsearch 是分布式的。用户在使用的过程中不需要考虑到分片，集群等等，这些都是 Elasticsearch 自动完成的：

- 将文档分区到不同的容器，分片中
- 跨节点平衡集群中节点间的索引和搜索负载
- 自动复制数据提供冗余副本，防止硬件错误造成数据丢失
- 自动在节点之间路由
- 无缝扩展或恢复集群

集群健康状态查询：

```
GET /_cluster/health
{
"cluster_name": "elasticsearch",
"status": "green", <1>
"timed_out": false,
"number_of_nodes": 1,
"number_of_data_nodes": 1,
"active_primary_shards": 0,
"active_shards": 0,
"relocating_shards": 0,
"initializing_shards": 0,
"unassigned_shards": 0
}
```

其中 status 有三个状态：

- green 主分片和从分片都可以用
- yellow 主分片可用，但存在从分片不可用
- red 存在不可用的主分片


## 使用
集群健康状况：

```
GET /_cat/health?v
```

列出节点信息：

```
GET /_cat/nodes?v
```

列出集群中索引信息：

```
GET /_cat/indices?v
```

创建索引：

```
PUT /customer?pretty
GET /_cat/indices?v
```

