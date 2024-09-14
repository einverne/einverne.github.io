---
layout: post
title: "使用 mastodon tootctl 管理 Mastodon 实例"
aliases:
- "使用 mastodon tootctl 管理 Mastodon 实例"
tagline: ""
description: ""
category: 经验总结
tags: [ mastodon, tootctl, cli, sns, microblog ]
create_time: 2022-11-14 10:47:59
last_updated: 2022-11-14 10:47:59
---

Mastodon 的命令行 `tootctl` 位于 bin 目录中

清理外站缓存的媒体文件：

```
tootctl media remove --days=14 --verbose
```

如果是 Docker compose 安装的，直接在前面加上

```
docker-compose run --rm web bin/tootctl media remove --days=14
```

清理没有与本站任何用户产生关联的 toot （跨站时间线上收到，没有本站用户转发评论收藏的消息）

```
tootctl statuses remove
```

清理未关联 toot 的媒体文件：

```
tootctl media remove-orphans
```

如果是用了对象存储最好不要 remove-orphan 会遍历所有文件，而 mastodon 的存储逻辑就相当于几乎遍历了全部文件，每天一次请求费用会特别高。而且也不至于每天都会产生新的孤立文件通常情况下

```
docker exec -it mastodon-web-1 tootctl media
```

```
docker-compose run --rm web exec bin/tootctl media remove --days=14

docker-compose run --rm web exec bin/tootctl media remove-orphans

docker-compose run --rm web exec bin/tootctl statuses remove
```

### 使用命令行管理 Mastodon 实例

    docker-compose run --rm web bin/tootctl help

用于计算消耗的磁盘空间

    tootctl media usage

清理缓存：

    tootctl cache clear

移除本地缓存的其它实例媒体附件：

    tootctl media remove

扫描出不属于任何媒体附件的文件并移除他们：

    tootctl media remove-orphans

某些存储提供商可能会对列出对象所必需的 API 收取费用，请注意，并且如果附件比较多可能执行比较慢。

从数据库中删除未被引用的嘟文

    tootctl statuses remove
    tootctl statuses remove –days30
