---
layout: post
title: "Redis 读书笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [redis, database, database, key-value, db, reading, ]
last_updated:
---

这篇文章主要介绍 Redis 的持久化机制，主从复制等等

## 持久化机制

通常情况下 Redis 会将数据存储于内存中，但 Redis 也支持持久化。Redis 支持两种持久化方式，RDB 方式 和 AOF 方式。RDB 通过快照方式，将内存数据写入磁盘。而 AOF 方式则是类似 MySQL 日志方式，记录每次更新的日志。前者性能高，但是可能引起一定的数据丢失，后者相反。

### RDB 方式

RDB 通过快照 snapshotting 完成，也是 Redis 默认的持久化方式，当符合一定条件时 Redis 会自动将内存中的所有数据以快照方式保存一份副本到硬盘上 (dump.rdb)，这个过程称为"快照"。

Redis 根据以下情况执行快照：

- 根据配置规则进行自动快照
- 用户执行 SAVE 或者 BGSAVE 命令
- 执行 FLUSHALL 命令
- 执行复制 replication

1. 配置规则

- `save 900 1` 表示在 15min(900s) 时间内，有一个或者一个以上键被更改则进行快照。
- `save 300 10` 表示 300 秒内超过 10 个 key 被修改，则发起快照

2. SAVE 或 BGSAVE 命令

SAVE 命令时， Redis 同步地进行快照操作，会阻塞所有来自客户端的请求。尽量避免在生产环境使用这一命令。

BGSAVE 命令，后台异步进行快照。查看快照是否成功，通过 LASTSAVE 命令获取最近一次成功执行快照时间，返回结果 Unix 时间戳。

3. FLUSHALL ，Redis 清除数据库所有数据。只要定义了自动快照条件，则会进行快照。如果没有定义自动快照，则不会进行快照。

4. 复制操作时，即使没有定义自动快照条件，也会生成 RDB 快照

Redis 默认将快照文件存储在工作目录中 dump.rdb 文件中，可以通过配置 dir 和 dbfilename 两个参数分别来指定快照文件的存储路径和文件名。

快照的保存过程：

1. redis 调用 fork， fork 一份子进程
2. 父进程处理 client 请求，子进程负责将内存内容写入临时文件，父进程处理写请求时 os 为父进程创建副本，子进程地址空间内的数据是 fork 时刻整个数据库的快照
3. 当子进程将快照写入临时文件完毕之后，用临时文件替换原来的快照文件，子进程退出。

需要注意的是，每次快照持久化都是将内存数据完整写入到磁盘一次，并不是增量的只同步变更数据。如果数据量大的话，而且写操作比较多，必然会引起大量的磁盘 io 操作，可能会严重影响性能。

### AOF 方式

快照的方式是一定间隔备份一次，它的缺点就是如果 Redis 意外挂掉的话，就会丢失最后一次快照之后的所有修改。如果应用要求不能丢失任何修改可以采用 AOF 持久化方式。

AOF 将 Redis 执行的每一条**写命令**追加到硬盘文件中（默认为 appendonly.aof)。默认没有开启 AOF (append only file) ，可以通过 appendonly 参数启用：

    appendonly yes

AOF 文件保存位置和 RDB 文件位置相同，通过 dir 参数设置，默认为 appendonly.aof ，通过 appendfilename 参数修改：

    appendfilename appendonly.aof

Redis 在重启时会通过重新执行文件中保存的写命令来在内存中重建整个数据库。

操作系统会在内核中缓存写命令的修改，因此不是立即存盘，所以也可能会导致部分数据丢失。通过 fsync 函数强制系统写入磁盘的时机， 有三种方式如下（默认是：每秒 fsync 一次）:

	appendonly yes  # 启用 aof 持久化方式
	# appendfsync always  # 收到写命令就立即写入磁盘，最慢，但是保证完全的持久化
	appendfsync everysec  # 每秒钟写入磁盘一次，在性能和持久化方面做了很好的折中
	# appendfsync no  # 完全依赖 os, 性能最好，持久化没保证

AOF 方式的缺点：

- 持久化文件会越来越大，为了解决这个问题 Redis 提供了 `bgrewriteaof` 命令。 收到此命令 Redis 将使用与快照类似的方式将内存中的数据以命令方式保存到临时文件中，最后替换原来的文件

## 集群

结构上，容易发生单点故障，分配不同服务器

容量上，内存容易成为存储瓶颈，需要对数据进行分片

集群的特点在于拥有和单机实例同样的性能，同时在网络分区后能够提供一定的可访问性以及对主数据库故障恢复的支持。


### 主从复制

复制多副本部署不同服务器，防止一台故障丢失数据。通过主从复制可以允许多个 slave server 拥有和 master server 相同的数据库副本。

主从复制特点：

- master 可以拥有多 slave
- 多 slave 可以连接到同一个 master 外也能连接到其他 slave
- 主从复制不会阻塞 master， master 在同步数据时也可以继续处理 client 请求

从数据库配置中：

    slaveof 主数据库地址 主数据库端口

当配置好 slave 后，slave 与 master 建立连接，然后发送 sync 命令。无论是第一次连接还是重新连接，master 都会启动一个后台进程，将数据库快照保存到文件中，同时 master 主进程会开始收集新的写命令并缓存。后台进程完成写文件后，master 发送文件给 slave, slave 将文件保存到硬盘上，再加载到内存中，接着 master 就会把缓存的命令转发给 slave, 后续 master 将收到的写命令发送给 slave。如果 master 同时收到多个 slave 发来的同步连接命令，master 只会启动一个进程来写数据库镜像，然后发送给所有的 slave。

使用 info 命令来判断当前 redis 是主库还是从库， `role` 字段，还可以利用 `master_link_status` 来查看主从是否异步，up 为正常，down 为同步异步。

## 哨兵 {#sentinel}

监控 Redis 运行状况。



## Redis 命令属性

Redis 不同命令拥有不同的属性，是否只读命令，是否是管理员命令，一个命令可以拥有多个属性。

- `REDIS_CMD_WRITE` 属性，会修改 Redis 数据库数据
- `REDIS_CMD_DENYOOM` 属性，可能增加 Redis 占用的存储空间，显然拥有该属性的命令都拥有 `REDIS_CMD_WRITE` 属性。
- `REDIS_CMD_NOSCRIPT` 属性，无法在 Redis 脚本中执行
- `REDIS_CMD_RANDOM` 脚本执行了该属性命令之后，不能执行拥有 `REDIS_CMD_WRITE` 属性命令
- `REDIS_CMD_SORT_FOR_SCRIPT` 产生随机结果
- `REDIS_CMD_LOADING` 当 Redis 启动时，只会执行拥有该属性的命令

## Redis 事务
Redis 由单线程处理所有 client 请求，在接收到 client 发送的命令后会立即处理并返回结果，但是当 client 发出 `multi` 命令后，这个连接会进入事务上下文，连接后续命令并不会立即执行，而是先放到队列中，当收到 `exec` 命令后，redis 顺序执行队列中所有命令，并将结果一起返回。

    get keydemo
    multi
    set keydemo 10
    set keydemo 20
    exec
    get keydemo

在 multi 开始之后可以使用 `discard` 来取消事务。

## Redis 的乐观锁
[[乐观锁]]，指的是每次拿数据时认为别人不会修改，不上锁，而在提交更新时判断期间是否有别人更新该数据。

乐观锁使用数据库版本记录实现，需要满足提交版本必须大于当前记录版本才能执行更新的乐观锁策略。

Redis 从 2.1 版本开始支持乐观锁，可以使用 watch 显式对 key 加锁。watch 命令会监视给定的 key，在 exec 结束时如果监视 key 从调用 watch 后发生过变化，则事务会失败。



## Redis Client

phpRedisAdmin 是一个 PHP 实现的 Redis 管理 Web 界面。地址：<https://github.com/erikdubbelboer/phpRedisAdmin>

## reference

- <http://redisdoc.zixuebook.cn/>
- <https://github.com/JasonLai256/the-little-redis-book/blob/master/cn/redis.md>

