---
layout: post
title: "Redis 常用命令"
aliases: "Redis 常用命令"
tagline: ""
description: ""
category: 学习笔记
tags: [redis, database, 学习笔记 ]
last_updated:
---

Redis 是典型的 KV 数据库，通常所说的 Redis 数据结构指的是 Value 的数据结构，常用的数据结构有 String, Hash, List, Set, Sorted Set. 前三种类型不用多讲，几乎每种语言都存在，后两种 set 是单纯的集合， Sorted Set 是有序集合，在集合内可以根据 score 进行排序。Redis 的命令不区分大小写，但通常情况下使用大写以示区分。

几个常用网址：

- <https://redis.io/commands>
- <https://redis.io/documentation>
- 中文命令 <http://redisdoc.com/>


对 Redis 键的命名格式并没有强制性的要求，不过一般约定为，”对象类型：对象 ID：对象属性“，比如使用 `user:1:friends` 表示 id 为 1 的用户的好友列表。为了方便后期维护，键的命名一定要有意义。

`redis-cli` 是 Redis 自带的命令行工具（类似于 MySQL 的 mysql 命令）, 直接在命令行终端与 redis server 执行所有命令和返回响应。下面所有命令都可以在 cli 交互式命令行中执行。

## 交互式命令参数

`redis-cli` 命令行自带一些参数，可以使用 `redis-cli --help` 查看。

通常 `-p` 参数指定端口， `-a` 参数指定密码， `-h` 指定 hostname。

`--stat` 参数打印状态

如果本地没有安装 Redis，可以通过在线模拟尝试 [Try Redis](https://try.redis.io/)。

## 基础命令

### 连接操作命令

关闭连接

    quit
    
简单密码认证

    auth
    
帮助

    help
    
### 持久化

将数据同步到磁盘

    save
    
将数据异步保存到磁盘

    bgsave
    
返回上次成功将数据保存到磁盘的 Unix 时间戳

    lastsave
    
将数据同步保存到磁盘，然后关闭服务

    shutdown
    


获取符合规则的键名列表

	KEYS pattern

pattern 支持 glob 风格的通配符格式。

可以使用 `EXISTS` 命令来判断一个键是否存在

	EXISTS key

使用 `TYPE` 键的数据类型

	TYPE key

默认使用 cli 命令登录之后是 redis 的 0 数据库，可以使用 select 命令来切换数据库

    SELECT 1

将 key 从一个数据库移动到另外一个数据库可以使用 move 命令

    MOVE key <db index>

从所有 key 中随机选择一个 key

    RANDOMKEY

重命名 key

    RENAME key new_key



## 字符串类型操作命令

字符串类型，最大容量 512MB，字符串类型可以包含任何数据，图片的二进制，或者序列化的对象。

命令    |  行为
-----------|----------
GET  	| 获取存储在键中的值
SET   	| 给 KEY 设置值
DEL 	| 删除存储在 KEY 中的值，该命令可以用于所有类型

### 赋值与取值

将 value 关联到 key，如果 key 有值， SET 命令覆盖。对于某个原本带有生存时间（TTL）的键来说， 当 SET 命令成功在这个键上执行时， 这个键原有的 TTL 将被清除。

    SET key value
	GET key

使用 SETNX (set not exists) 可以实现如果 key 存在时不做任何操作

	SETNX key value  # 如果 key 存在，则返回 0，如果设置成功返回 1

可以使用 SETEX 来针对 key 设置过期时间，以秒为单位

	SETEX key seconds value


### 递增递减数字
让当前键值递增，操作键不存在时默认为 0，当键不是整数时，报错。对不存在的 key ，则设置 key 为 1

	INCR key

通过 increment 参数来在 key 的基础上加上一个增量。

	INCRBY key increment

递减数值，对于不存在的 key，设置为 -1

	DECR key

递减一个量，DECRBY 为了增加可读性，完全可以使用 INCRBY 一个负值来实现同样的效果

	DECRBY key decrement

增加指定浮点数

	INCRBYFLOAT key increment


### 向尾部追加值
如果 key 已经存在，并且 value 是一个字符串，那么 APPEND 将 value 追加到末尾

	APPEND key value

### 获取字符串长度
返回 key 所存储的字符串长度

	STRLEN key


### 多 key 操作
获取多个值

	MGET key [key ...]

设置多个 key value, 一次性设置多个值，返回 0 表示没有值被覆盖

	MSET key value [key value ...]

### 其他复杂命令

	SETRANGE key offset value  # 用 value 值覆盖给定 key 从 offset 开始所存储的字符串
	MSETNX key value key value # 一次性设置多个值， SETNX 的 multi 版本
	GETSET key 				# 设置 key 的值，并返回 key 的旧值
	GETRANGE key start end  # 截取 start 和 end 偏移量的字符串

## 散列类型操作命令
通过 HSET 建立的键是散列类型，用过 SET 命令建立的是字符串类型。散列或者哈希非常适合存储对象，添加和删除操作复杂度平均 O（1）.

命令 |  行为
---------|--------
HSET 	| 给散列起给定的键值名
HGET 	| 获取给定散列值
HGETALL  | 获取散列包含的所有键值对
HDEL 	| 如果给定键存在，则移除该键

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

获取所有域和值

	HGETALL key

查看哈希表 key 中，给定域 field 是否存在。

	HEXISTS key field

增加数字，返回增值后的字段值

	HINCRBY key field increment

删除一个或者多个字段，返回被删除的字段个数

	HDEL key field [field ...]

获取指定 hash 的 field 数量

	HKEYS key

获取指定 hash 的 values

	HVALS key

## 列表类型

有序的字符串列表，向列表两端添加元素，或者获取列表的某一个片段。列表类型内部使用双向链表，向列表两端添加元素时间复杂度 O(1)

命令 | 行为
-------|--------
LPUSH 	| 给定值加入列表左端
RPUSH 	| 给定值加入列表右端
LRANGE 	| 获取列表给定范围的所有值
LINDEX 	| 获取列表在给定位置上的单个元素
LPOP 	| 从列表左端弹出一个值，并返回被弹出的值

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
set 是集合，和数学中的集合概念相似。 Redis 的 set 是 String 类型的无序集合，set 元素最大可包含 2 的 32 次方个元素。

向集合中增加一个或者多个元素，如果不存在则创建，如果存在则忽略。SREM 用来从集合中删除一个或者多个元素，并返回删除成功的个数

命令详解，将给定元素添加到集合

	SADD key member [member ...]

如果给定的元素存在于集合中，移除该元素

	SREM key member [member ...]

随机返回并删除一个元素

	SPOP key

随机返回一个元素，但是不删除， Redis 2.6 版本之后接受可选 count 参数。

	SRANDMEMBER key [count]

返回集合中的所有元素

	SMEMBERS key

判断元素是否在集合中

	SISMEMBER key member

### 集合间运算

集合差集  A-B

	SDIFF key [key ...]

集合交集运算 A 交 B

	SINTER key [key ..]

集合并集 A 并 B

	SUNION key [key...]

获得集合中的元素个数

	SCARD key

将结果保存到 destination 键中

	SDIFFSTORE destination key [key ...]
	SINTERSTORE destination key [key ...]
	SUNIONSTORE destination key [key...]


## 有序集合

在集合的基础上加上了排序，有序集合的键被称为成员 member，每个成员都是不同的，有序集合的值称为分值 score，分值必须为浮点数。

有序集合中加入一个元素和该元素的分数，如果元素存在则用新的分数替换

	ZADD key score member [score member ...]

获得元素分数

	ZSCORE key member

获取排名在某个范围的元素列表，按照元素分数从小到大顺序返回索引从 start 到 stop 之间的所有元素，包括两端。可选参数可返回元素分数。但 stop 为 -1 时返回全部。

	ZRANGE key start stop [WITHSCORES]

按 score 从大到小

	ZREVRANGE key start stop

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

按照排名范围删除元素，元素分数从小到大顺序（索引 0 表示最小值），删除指定排名范围内的所有元素，并返回删除的数量

	ZREMRANGEBYRANK key start stop

按照分数范围删除元素，删除指定分数范围内的所有元素，返回删除元素的数量

	ZREMRANGEBYSCORE key min max

获得元素的排名，从小到大顺序，分数最小排名为 0。

	ZRANK key member

获取元素的排名，从大到小

	ZREVRANK key member


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

使用 DISCARD 命令来取消事务，DISCARD 命令来清空事务命令队列并退出事务上下文，回滚。

## 过期时间

关系型数据库一般需要额外设置一个字段“到期时间”，然后定期删除，而在 Redis 中可使用 EXPIRE 命令设置一个键的过期时间，到时间后 Redis 会自动删除它。

	EXPIRE key seconds

返回 1 表示成功，0 为键不存在或者设置失效。 EXPIRE 命令参数必须为整数，最小单位为 1 秒，如果想要更加精确的控制过期时间可以使用 PEXPIRE 命令，单位为毫秒，也可以使用 PTTL 来以毫秒为单位返回剩余时间。


	TTL key

TTL 命令查看键多久时间被删除，当键不存在时返回 -2，当键不过期时返回 -1

	PERSIST key

取消键的过期时间，成功清除返回 1，否则返回 0

SORT 命令对列表类型，集合类型和有序集合类型键进行排序，可以完成关系型数据库中连接查询类似的任务。

SORT 命令时

- 尽可能减少待排序键中的元素数量
- 使用 LIMIT 参数只获取需要的数据
- 排序的数据比较大，尽可能使用 STORE 参数将结果缓存

## Redis Client

Redis 支持的客户端

	https://redis.io/clients

[[Java Redis 客户端 Jedis]]