---
layout: post
title: "Redis 常用命令"
tagline: ""
description: ""
category: 学习笔记
tags: [Redis, database, 学习笔记]
last_updated: 
---

Redis 常用的数据结构有 String, Hash, List, Set, Sorted Set.

几个常用网址：

- <https://redis.io/commands>
- <https://redis.io/documentation>
- 中文命令 <http://redisdoc.com/>


对键的命名，”对象类型：对象ID：对象属性“

`redis-cli` 是 Redis 自带的命令行工具(类似于MySQL的mysql命令), 直接在命令行终端与 redis server 执行所有命令和返回响应。下面所有命令都可以在 cli 交互式命令行中执行。

## 交互式命令参数

`redis-cli` 命令行自带一些参数，可以使用 `redis-cli --help` 查看。

通常 `-p` 参数指定端口， `-a` 参数指定密码， `-h` 指定 hostname。

`--stat` 参数打印状态

如果本地没有安装 Redis，可以通过在线模拟尝试 [Try Redis](https://try.redis.io/)

## 字符串类型操作命令


字符串类型，最大容量 512MB

### 赋值与取值

将 value 关联到 key，如果 key 有值， SET 命令覆盖。对于某个原本带有生存时间（TTL）的键来说， 当 SET 命令成功在这个键上执行时， 这个键原有的 TTL 将被清除。

    SET key value

	GET key


### 递增递减数字
让当前键值递增，操作键不存在时默认为0，当键不是整数时，报错

	INCR key

通过 increment 参数来在 key 的基础上加上一个增量。

	INCRBY key increment

递减数值

	DECR key

递减一个量

	DECRBY key decrement

增加指定浮点数

	INCRBYFLOAT key increment


### 向尾部追加值
如果key 已经存在，并且 value 是一个字符串，那么 APPEND 将 value 追加到末尾

	APPEND key value

### 获取字符串长度
返回 key 所存储的字符串长度

	STRLEN key


### 多key操作
获取多个值

	MGET key [key ...]

设置多个 key value

	MSET key value [key value ...]


## 散列类型操作命令
通过 HSET建立的键是散列类型，用过 SET 命令建立的是字符串类型


### 赋值取值
将哈希表 key 中的域 field 的值设为 value 。

如果 key 不存在，一个新的哈希表被创建并进行 HSET 操作。

如果域 field 已经存在于哈希表中，旧值将被覆盖。

	HSET key field value
	HGET key field

	HMSET key field value [field value ...]
	HMGET key field [field ...]

当字段不存在时赋值

	HSETNX key field value

### 获取所有域和值

	HGETALL key

### 检查是否存在
查看哈希表 key 中，给定域 field 是否存在。

	HEXISTS key field

### 增量
增加数字，返回增值后的字段值

	HINCRBY key field increment

### 删除
删除一个或者多个字段，返回被删除的字段个数

	HDEL key field [field ...]

## 列表类型

有序的字符串列表，向列表两端添加元素，或者获取列表的某一个片段。列表类型内部使用双向链表，向列表两端添加元素时间复杂度O(1)

LPUSH 用来向列表左边增加元素，返回值表示增加元素后列表的长度，RPUSH 同理

	LPUSH key value [value ...]

	RPUSH key value [value... ]

从左边右边弹出元素

	LPOP key

	RPOP key

获取列表中元素的个数

	LLEN key

获取列表中某一个片段

	LRANGE key start stop

删除列表中指定的值

	LREM key count value

获取设置指定索引的元素值

	LINDEX key index

删除指定索引范围之外的所有元素。

	LTRIM key start end

向列表中插入元素，将值 value 插入到列表 key 当中，位于值 pivot 之前或之后。

	LINSERT key BEFORE | AFTER pivot value

先执行 RPOP 命令再执行 LPUSH 命令

    RPOPLPUSH source destination


## 集合类型

向集合中增加一个或者多个元素，如果不存在则创建，如果存在则忽略。SREM 用来从集合中删除一个或者多个元素，并返回删除成功的个数

	SADD key member [member ...]

	SREM key member [member ...]

返回集合中的所有元素

	SMEMBERS key

判断元素是否在集合中

	SISMEMBER key member

### 集合间运算

集合差集  A-B

	SDIFF key [key ...]

集合交集运算 A交B

	SINTER key [key ..]

集合并集 A并B

	SUNION key [key...]

获得集合中的元素个数

	SCARD key

将结果保存到 destination 键中

	SDIFFSTORE destination key [key ...]

	SINTERSTORE destination key [key ...]

	SUNIONSTORE destination key [key...]

随机从集合中获取一个元素

	SRANDMEMBER key [count]

从集合中弹出一个元素

	SPOP key

## 有序集合

在集合的基础上加上了排序

有序集合中加入一个元素和该元素的分数，如果元素存在则用新的分数替换

	ZADD key score member [score member ...]

获得元素分数

	ZSCORE key member

获取排名在某个范围的元素列表，按照元素分数从小到大顺序返回索引从 start 到 stop 之间的所有元素，包括两端。可选参数可返回元素分数。

	ZRANGE key start stop [WITHSCORES]

元素分数从小到大顺序返回元素分数在 min 和 max 之间的元素

	ZRANGEBYSCORE key min max

增加某个元素分数，返回值为更改过后的分数

	ZINCRBY key increment member

获取集合中元素的数量，返回 integer 数量

	ZCARD key

获得指定分数范围内的元素个数，返回个数

	ZCOUNT key min max

删除一个或者多个元素，返回成功删除的元素数量

	ZREM key member [member ...]

按照排名范围删除元素，元素分数从小到大顺序（索引0表示最小值），删除指定排名范围内的所有元素，并返回删除的数量

	ZREMRANGEBYRANK key start stop

按照分数范围删除元素，删除指定分数范围内的所有元素，返回删除元素的数量

	ZREMRANGEBYSCORE key min max

获得元素的排名，从小到大顺序，分数最小排名为0。

	ZRANK key member


计算多个有序集合的交集，并将结果存储在 destination 键中，同样以有序集合存储，返回 destination 键中的元素个数

	ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM | MIN | MAX]


AGGREGATE 是 SUM 时（默认值）， destination 键中元素的分数是每个参与计算的集合中该元素分数的和。

其他情况同理，MIN 为最小值，MAX 为最大值

## 事务

Redis 中事务 transaction 是一组命令的集合。事务同命令一样都是 Redis 的最小执行单位。

	MULTI
	SADD ”user:1:following" 2
	SADD "user:2:followers" 1
	EXEC

事务中 WATCH 命令，监控一个或者多个键，一旦其中一个键被修改（或删除），之后的事务就不会执行，监控持续到 EXEC 命令

## 过期时间

关系型数据库一般需要额外设置一个字段“到期时间”，然后定期删除，而在 Redis 中可使用 EXPIRE 命令设置一个键的过期时间，到时间后 Redis 会自动删除它。

	EXPIRE key seconds

返回1表示成功，0为键不存在或者设置失效。 EXPIRE 命令参数必须为整数，最小单位为1秒，如果想要更加精确的控制过期时间可以使用 PEXPIRE 命令，单位为毫秒，也可以使用 PTTL 来以毫秒为单位返回剩余时间。


	TTL key

TTL 命令查看键多久时间被删除，当键不存在时返回 -2，当键不过期时返回-1


	PERSIST key

取消键的过期时间，成功清除返回1，否则返回0

SORT 命令对列表类型，集合类型和有序集合类型键进行排序，可以完成关系型数据库中连接查询类似的任务。

SORT 命令时

- 尽可能减少待排序键中的元素数量
- 使用LIMIT参数只获取需要的数据
- 排序的数据比较大，尽可能使用 STORE 参数将结果缓存

## Redis Client

Redis 支持的客户端

	https://redis.io/clients

## 持久化

RDB 方式 和 AOF 方式

### RDB 方式

通过快照 snapshotting 完成，当符合一定条件时 Redis 会自动将内存中的所有数据生成一份副本并存储到硬盘上，这个过程称为”快照“。

以下情况执行快照：

- 根据配置规则进行自动快照
- 用户执行 SAVE 或者 BGSAVE 命令
- 执行 FLUSHALL 命令
- 执行复制 replication

1. 配置规则

save 900 1 表示在15min(900s) 时间内，有一个或者一二以上键被更改则进行快照。

2. SAVE 或 BGSAVE 命令

SAVE 命令时， Redis 同步地进行快照操作，会阻塞所有来自客户端的请求。尽量避免在生产环境使用这一命令。

BGSAVE 命令，后台异步进行快照。查看快照是否成功，通过 LASTSAVE 命令获取最近一次成功执行快照时间，返回结果 Unix 时间戳。

3. FLUSHALL ，Redis 清除数据库所有数据。只要定义了自动快照条件，则会进行快照。如果没有定义自动快照，则不会进行快照。

4. 复制操作时，即使没有定义自动快照条件，也会生成 RDB 快照

Redis 默认将快照文件存储在工作目录中 dump.rdb 文件中，可以通过配置 dir 和 dbfilename 两个参数分别来指定快照文件的存储路径和文件名。

### AOF方式

将 Redis 执行的每一条写命令追加到硬盘文件中。默认没有开启 AOF (append only file) ，可以通过 appendonly 参数启用：

    appendonly yes

AOF 文件保存位置和 RDB 文件位置相同，通过 dir 参数设置，默认为 appendonly.aof ，通过 appendfilename 参数修改：

    appendfilename appendonly.aof

## 集群

结构上，容易发生单点故障，分配不同服务器

容量上，内存容易成为存储瓶颈，需要对数据进行分片

### 复制

复制多副本部署不同服务器，防止一台故障丢失数据。

从数据库配置中：

    slaveof 主数据库地址 主数据库端口

通过复制实现读写分离

### 哨兵

监控 Redis 运行状况。

### 集群

集群的特点在于拥有和单机实例同样的性能，同时在网络分区后能够提供一定的可访问性以及对主数据库故障恢复的支持。

	https://github.com/erikdubbelboer/phpRedisAdmin

## Redis 命令属性

Redis 不同命令拥有不同的属性，是否只读命令，是否是管理员命令，一个命令可以拥有多个属性。

`REDIS_CMD_WRITE` 属性，会修改 Redis 数据库数据

`REDIS_CMD_DENYOOM` 属性，可能增加 Redis 占用的存储空间，显然拥有该属性的命令都拥有 `REDIS_CMD_WRITE` 属性。

`REDIS_CMD_NOSCRIPT` 属性，无法在Redis脚本中执行

`REDIS_CMD_RANDOM` 脚本执行了该属性命令之后，不能执行拥有 `REDIS_CMD_WRITE` 属性命令

`REDIS_CMD_SORT_FOR_SCRIPT` 产生随机结果

`REDIS_CMD_LOADING` 当 Redis 启动时，只会执行拥有该属性的命令
