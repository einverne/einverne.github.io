---
layout: post
title: "Uptime Kuma 清理 SQLite 数据库历史数据"
aliases:
- "Uptime Kuma 清理 SQLite 数据库历史数据"
tagline: ""
description: ""
category: 经验总结
tags: [ kuma, sqlite, uptime, uptime-kuma, website, monitor, ping ]
create_time: 2025-06-17 13:32:36
last_updated: 2025-06-17 13:32:36
dg-home: false
dg-publish: false
---

大概两年前我自己部署了 Uptime Kuma 来监控我的各项服务在线情况，这两年内一直工作非常稳定，除了偶尔的网络波动带来的误报，基本上没有其他大问题。

但是用了超过两年，最近访问后台加载起来越来越慢，经常需要好久才能将监控的列表加载出来。对于使用上的问题，对我的影响越来越不能忽视， 所以今天来讲一下如何优化 Uptime Kuma 的数据库。

## 原因

Uptime Kuma 在 1.x 版本中需要对整个 heartbeat 表进行扫描来执行一些操作，数据库中存在大量数据时，会导致显著的性能下降。根据开发者的说明，性能限制依赖于硬件配置，超过 500 个监控或者数据库大小超过 1.5 GB 左右时会有明显的性能问题。[^1]

[^1]: <https://github.com/louislam/uptime-kuma/issues/4747>

于是我检查了一下我本地的 SQLite 数据库，竟然达到了 2.6 GB。

![8dOy](https://photo.einverne.info/images/2025/06/17/8dOy.png)

## 改善性能

### 降低数据保留期限

可以在 Kuma 的设置 `/settings/monitor-history` 中设置数据保留期限，然后手动执行清理。

### 增加检查间隔

因为在 v1 版本中 Kuma 使用 heartbeat 心跳表来记录检查，如果频繁的进行检查，并记录，可能导致 heartbeat 表快速膨胀，可以根据自己的情况适当地降低检查频率。

### 清理历史数据

在 Uptime Kuma 的 SQLite 数据库中，历史数据主要存储在心跳相关的表中。

推荐在清理数据时，先将 Kuma 服务暂停。

推荐备份一下 kuma.db 数据库

```
cp kuma.db kuma-2025xxxx.db
```

然后使用 sqlite3 连接数据库，并执行删除语句。

```
DELETE FROM heartbeat WHERE time < datetime('now', '-30 days');
```

清理特定监控器的历史数据

```
-- 查看监控器ID
SELECT id, name FROM monitor;

-- 删除特定监控器的历史数据
DELETE FROM heartbeat WHERE monitor_id = [监控器ID];
```

数据清理之后，可以对数据库优化释放空间

```
VACUUM;
-- 重建索引
REINDEX;
```

## 未来

Uptime Kuma 的维护团队正在开发 v2 版本，希望通过引入外部的 MariaDB 数据库来改善性能，等未来 v2 版本稳定之后，可以考虑升级，但是目前看官方的进度还在 beta 阶段。
