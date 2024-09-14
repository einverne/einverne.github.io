---
layout: post
title: "升级 Mastodon 从 4.1.19 至 4.2.x"
aliases:
- "升级 Mastodon 从 4.1.19 至 4.2.x"
tagline: ""
description: ""
category: 经验总结
tags: [mastodon, mastodon-upgrade, ruby, docker, docker-compose]
create_time: 2024-09-14 11:30:55
last_updated: 2024-09-14 11:30:55
dg-home: false
dg-publish: false
---

记录一下 Mastodon 实例维护，为 4.1.19 升级至 4.2.x 的过程。因为之前的版本还在 4.1.x 所以先按照官方的教程升级到了 4.1.19 最新的版本，然后开始研究如何跨版本升级，之前已经成功将 Mastodon 从 V3 升级到了 V4 版本，我大致猜测应该也差不多，但是为了数据安全起见，还是做了好充分的备份。

## 备份

首先是数据库备份

```
docker exec mastodon-db-1 pg_dump -Fc -U mastodon mastodon > ~/20240914mastodon_backup.dump
```

## 升级

然后修改 docker-compose 文件的版本至 `4.2.0`

然后执行 `docker-compose pull` 拉取最新的镜像。

首先执行

```
docker-compose run --rm -e SKIP_POST_DEPLOYMENT_MIGRATIONS=true web bundle exec rails db:migrate
```

然后运行 Mastodon 实例

```
docker-compose up -d
```

然后执行后处理

```
docker-compose run --rm web bundle exec rails db:migrate
```

最后如果使用 Elsticsearch，那么重新构建索引

```
docker-compose run --rm web bin/tootctl search deploy --reset-chewy
```

完成版本更新，欢迎大家使用 [EV Mastodon](https://m.einverne.info/)

接下来就是小版本的升级，拉取镜像，然后更新即可。
