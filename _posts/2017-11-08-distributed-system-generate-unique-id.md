---
layout: post
title: "分布式系统中唯一 ID 的生成方法"
aliases: "分布式系统中唯一 ID 的生成方法"
tagline: ""
description: ""
category: 
tags: [java, 发号器 , id, auto-increase, mysql]
last_updated: 
---

在分布式系统存在多个 Shard 的场景中, 同时在各个 Shard 插入数据时, 怎么给这些数据生成全局的 unique ID? 在单机系统中 (例如一个 MySQL 实例), unique ID 的生成是非常简单的, 直接利用 MySQL 自带的自增 ID 功能就可以实现.

但在一个存在多个 Shards 的分布式系统 (例如多个 MySQL 实例组成一个集群, 在这个集群中插入数据), 这个问题会变得复杂, 所生成的全局的 unique ID 要满足以下需求:

- 唯一性，保证生成的 ID 全局唯一
- 今后数据在多个 Shards 之间迁移不会受到 ID 生成方式的限制
- 有序性，生成的 ID 中最好能带上时间信息, 例如 ID 的前 k 位是 Timestamp, 这样能够直接通过对 ID 的前 k 位的排序来对数据按时间排序
- 生成的 ID 最好不大于 64 bits
- 可用性，生成 ID 的速度有要求. 例如, 在一个高吞吐量的场景中, 需要每秒生成几万个 ID (Twitter 最新的峰值到达了 143,199 Tweets/s, 也就是 10万+/秒)
- 整个服务最好没有单点

在要满足前面 6 点要求的场景中, 怎么来生成全局 unique ID 呢?

## 数据库自增ID
数据库单表，使用 `auto increment` 来生成唯一全局递增ID。

优势是无需额外附加操作，定长增长，单表结构中唯一性，劣势是高并发下性能不佳，生产的上限是数据库服务器单机的上限，水平扩展困难，分布式数据库下，无法保证唯一性。

## UUID
如果没有上面这些限制, 问题会相对简单, 例如: 直接利用 UUID.randomUUID() 接口来生成 unique ID (http://www.ietf.org/rfc/rfc4122.txt). 但这个方案生成的 ID 有 128 bits, 另外, 生成的 ID 中也没有带 Timestamp 一般编程语言中自带 UUID 实现， Java 中 `UUID.randomUUID().toString()` 产生的ID 不依赖数据库实现。

优势是，本地生成ID，无需远程调用，全局唯一，水平扩展能力好。劣势是，ID 有 128 bits 长，占空间大，生成字符串类型，索引效率低，生成的 ID 中没有带 Timestamp 无法保证时间递增。

## Flickr 全局主键

Flickr 的做法[^flickr] 是使用 MySQL 的自增ID， 和 replace into 语法。但他这个方案 ID 中没有带 Timestamp, 生成的 ID 不能按时间排序

创建64位自增ID，首先创建表

    CREATE TABLE `Tickets64` (
      `id` bigint(20) unsigned NOT NULL auto_increment,
      `stub` char(1) NOT NULL default '',
      PRIMARY KEY  (`id`),
      UNIQUE KEY `stub` (`stub`)
    ) ENGINE=MyISAM

`SELECT * from Tickets64` 假设表中有一行

    +-------------------+------+
    | id                | stub |
    +-------------------+------+
    | 72157623227190423 |    a |
    +-------------------+------+

那么如果需要产生一个新的全局 64 bits 的ID，只要执行 SQL：

    REPLACE INTO Tickets64 (stub) VALUES ('a');
    SELECT LAST_INSERT_ID();

SQL 返回的ID就是要产生的全局唯一ID。使用 `REPLACE INTO` 代替 `INSERT INTO` 的好处是避免表行数太多。 stub 要设为唯一索引。

Flickr 内部运行两台 ticket servers，通过两台机器做主备和负载均衡。

    TicketServer1:
    auto-increment-increment = 2
    auto-increment-offset = 1

    TicketServer2:
    auto-increment-increment = 2
    auto-increment-offset = 2

## Twitter Snowflake
Twitter 利用 Zookeeper 实现一个全局的 ID 生成服务 Snowflake: <https://github.com/twitter/snowflake>

Snowflake 生成的 unique ID 的组成 (由高位到低位):

- 41 bits: Timestamp 毫秒级
- 10 bits: 节点 ID datacenter ID 5 bits + worker ID 5 bits
- 12 bits: sequence number

一共 63 bits ,其中最高位是 0

unique ID 生成过程:

- 41 bits 的 Timestamp: 每次要生成一个新 ID 的时候, 都会获取一下当前的 Timestamp, 然后分两种情况生成 sequence number:

        - 如果当前的 Timestamp 和前一个已生成 ID 的 Timestamp 相同 (在同一毫秒中), 就用前一个 ID 的 sequence number + 1 作为新的 sequence number (12 bits); 如果本毫秒内的所有 ID 用完, 等到下一毫秒继续 (**这个等待过程中, 不能分配出新的 ID**)
        - 如果当前的 Timestamp 比前一个 ID 的 Timestamp 大, 随机生成一个初始 sequence number (12 bits) 作为本毫秒内的第一个 sequence number

- 10 bits 的机器号, 在 ID 分配 Worker 启动的时候, 从一个 Zookeeper 集群获取 (保证所有的 Worker 不会有重复的机器号)

整个过程中, 只有在 Worker 启动的时候会对外部有依赖 (需要从 Zookeeper 获取 Worker 号), 之后就可以独立工作了, 做到了去中心化.

异常情况讨论:

在获取当前 Timestamp 时, 如果获取到的时间戳比前一个已生成 ID 的 Timestamp 还要小怎么办? Snowflake 的做法是继续获取当前机器的时间, 直到获取到更大的 Timestamp 才能继续工作 (在这个等待过程中, 不能分配出新的 ID)

从这个异常情况可以看出, 如果 Snowflake 所运行的那些机器时钟有大的偏差时, 整个 Snowflake 系统不能正常工作 (偏差得越多, 分配新 ID 时等待的时间越久)

从 Snowflake 的官方文档 (https://github.com/twitter/snowflake/#system-clock-dependency) 中也可以看到, 它明确要求 “You should use NTP to keep your system clock accurate”. 而且最好把 NTP 配置成不会向后调整的模式. 也就是说, NTP 纠正时间时, 不会向后回拨机器时钟.

下面是 Snowflake 的其他变种， Instagram 产生 ID 的方法也借鉴 Snowflake

### 雪花算法存在的问题

- 时间拨回问题
- 机器ID 的分配和回收问题
- 机器 ID 的上限问题

### Boundary flake
代码地址：<https://github.com/boundary/flake>

变化:

ID 长度扩展到 128 bits:

- 最高 64 bits 时间戳;
- 然后是 48 bits 的 Worker 号 (和 Mac 地址一样长);
- 最后是 16 bits 的 Seq Number

由于它用 48 bits 作为 Worker ID, 和 Mac 地址的长度一样, 这样启动时不需要和 Zookeeper 通讯获取 Worker ID. 做到了完全的去中心化 

基于 Erlang ，这样做的目的是用更多的 bits 实现更小的冲突概率，这样就支持更多的 Worker 同时工作。同时, 每毫秒能分配出更多的 ID。

### Simpleflake
源代码：<https://github.com/SawdustSoftware/simpleflake>

Simpleflake 的思路是取消 Worker 号, 保留 41 bits 的 Timestamp, 同时把 sequence number 扩展到 22 bits;

Simpleflake 的特点:

- sequence number 完全靠随机产生 (这样也导致了生成的 ID 可能出现重复)
- 没有 Worker 号, 也就不需要和 Zookeeper 通讯, 实现了完全去中心化
- Timestamp 保持和 Snowflake 一致, 今后可以无缝升级到 Snowflake

Simpleflake 的问题就是 sequence number 完全随机生成, 会导致生成的 ID 重复的可能. 这个生成 ID 重复的概率随着每秒生成的 ID 数的增长而增长.

所以, Simpleflake 的限制就是每秒生成的 ID 不能太多 (最好小于 100次/秒, 如果大于 100次/秒的场景, Simpleflake 就不适用了, 建议切换回 Snowflake).

## Instagram 的做法
Instagram 参考 Flickr 的方案，结合 Twitter 的经验，利用 PostgreSQL 数据库的特性，实现了一个更加简单可靠的 ID 生成服务。 Instagram 的分布式存储方案: 把每个 Table 划分为多个逻辑分片 (logic Shard), 逻辑分片的数量可以很大, 例如 2000 个逻辑分片。然后制定一个规则, 规定每个逻辑分片被存储到哪个数据库实例上面; 数据库实例不需要很多. 例如, 对有 2 个 PostgreSQL 实例的系统 (instagram 使用 PostgreSQL); 可以使用奇数逻辑分片存放到第一个数据库实例, 偶数逻辑分片存放到第二个数据库实例的规则

每个 Table 指定一个字段作为分片字段 (例如, 对用户表, 可以指定 uid 作为分片字段)

插入一个新的数据时, 先根据分片字段的值, 决定数据被分配到哪个逻辑分片 (logic Shard)  然后再根据 logic Shard 和 PostgreSQL 实例的对应关系, 确定这条数据应该被存放到哪台 PostgreSQL 实例上

Instagram 在设计ID时考虑了如下因素：

- 生成的IDs 需要按照时间排序，比如查询一组照片时就不需要额外获取照片更多的信息来进行排序
- IDs 64bits 索引，或者存储在 Redis 中
- The system should introduce as few new ‘moving parts’ as possible — a large part of how we’ve been able to scale Instagram with very few engineers is by choosing simple, easy-to-understand solutions that we trust.

Instagram unique ID 的组成:

- 41 bits 表示 Timestamp (毫秒), 能自定义起始时间 epoch
- 13 bits 表示 每个 logic Shard 的代号 (最大支持 8 x 1024 个 logic Shards)
- 10 bits 表示 sequence number; 每个 Shard 每毫秒最多可以生成 1024 个 ID

假设2011年9月9号下午 5 点钟， epoch 开始于 2011 年 1 月1 号，那么已经有 1387263000 毫秒经过，那么前 41 bits 是

    id = 1387263000 <<(64-41)

接下来13位由分片ID决定，假设按照 user ID 来分片，有 2000 个逻辑分片，如果用户的ID 是 31341 ， 那么分片 ID 是 `31341%2000 -> 1341` ，所以接下来的13位是：

    id |= 1341 <<(63-41-13)

最后，每个表自增来填补剩下的 bits，假设已经为表生成了 5000 个 IDs，那么下一个值是 5001，然后取模 1024

    id |= (5001 % 1024)

sequence number 利用 PostgreSQL 每个 Table 上的 auto-increment sequence 来生成。如果当前表上已经有 5000 条记录, 那么这个表的下一个 auto-increment sequence 就是 5001 (直接调用 PL/PGSQL 提供的方法可以获取到) 然后把 这个 5001 对 1024 取模就得到了 10 bits 的 sequence number。

instagram 这个方案的优势在于:

利用 logic Shard 号来替换 Snowflake 使用的 Worker 号, 就不需要到中心节点获取 Worker 号了. 做到了完全去中心化

另外一个附带的好处就是, 可以通过 ID 直接知道这条记录被存放在哪个 logic Shard 上。同时, 今后做数据迁移的时候, 也是按 logic Shard 为单位做数据迁移的, 所以这种做法也不会影响到今后的数据迁移

## MongoDB ObjectID
MongoDB 的 ObjectID[^objectId] 采用 12 个字节的长度，将时间戳编码在内。

- 其中前四个字节时间戳，从标准纪元开始，单位秒，时间戳和后5个字节保证了秒级别的唯一性，保证插入顺序以时间排序。
- 接着前四个字节时间戳的后面三个字节为机器号，这三个字节为所在主机唯一标识，一般为机器名散列值。
- 接着两个字节为PID标识，同一台机器中可能运行多个Mongo实例，用PID来保证不冲突
- 后三个字节为递增序号，自增计数器，来确保同一秒内产生的 ObjectID 不出现冲突，允许 256 的三次方 16777216 条记录。

[^flickr]:  http://code.flickr.net/2010/02/08/ticket-servers-distributed-unique-primary-keys-on-the-cheap/
[^objectId]: <https://docs.mongodb.com/manual/reference/method/ObjectId/#objectid>

## reference

- <https://engineering.instagram.com/sharding-ids-at-instagram-1cf5a71e5a5c>
- <http://darktea.github.io/notes/2013/12/08/Unique-ID>
- <http://www.cnblogs.com/flyingeagle/articles/7124233.html>
