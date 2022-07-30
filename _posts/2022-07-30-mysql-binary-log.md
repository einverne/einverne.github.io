---
layout: post
title: "MySQL Binary Log 清理"
aliases:
- "MySQL Binary Log 清理"
tagline: ""
description: ""
category: 学习笔记
tags: [ mysql, mysql-binary-log, binary-log, mysql-replication, ]
create_time: 2022-07-30 09:57:07
last_updated: 2022-07-30 09:57:07
---


Binary Log 中包含了

- 数据库更改的事件，比如表创建或者数据更改
- 一条语句更新数据花费的时间

Binary log 的目的：

- For replication，在 replication 源服务器的 binary log 提供了数据更改的记录，这些记录会发送给 replicas。源服务器会将 binary log 发送给 replicas，然后在 replicas 服务器中重新执行事务，以做到和源服务器相同的数据更改。[[MySQL Replication 主从同步原理]]
- 特定的数据恢复操作需要依赖于 binary log。在备份恢复之后，在 binary log 中被记录的 events 可以从备份点开始被重新执行，这些修改会将数据库状态更新到最新

binary log 不会记录那些不修改数据的语句，比如 SELECT 或 SHOW 等等。如果要记录所有的语句，可以使用 [[MySQL  General Query Log]]

## 清理 bin log
不要直接在操作系统删除 bin.log 文件，让 MySQL 自己处理这些文件。

清理 binlogs 的命令是：

```
PURGE BINARY LOGS TO 'mysql-bin.000223';
```

这一行命令会清理 `mysql-bin.000223` 之前的 binary logs.

```
PURGE BINARY LOGS BEFORE 'datetimestamp';
PURGE BINARY LOGS BEFORE DATE(NOW() - INTERVAL 3 DAY) + INTERVAL 0 SECOND;
```

这一行会清理 3 天前的 binary logs。

### 设置自动清理
如果只想要保留 3 天的 binary log ，那么可以修改配置文件 `/etc/my.cnf`:

```
[mysqld]
expire_logs_days=3
```

或者直接使用命令：

```
mysql> SET GLOBAL expire_logs_days=3;
```


## Extend

- [[MySQL set the binary log format]]

## reference

- <https://dev.mysql.com/doc/refman/8.0/en/binary-log.html>