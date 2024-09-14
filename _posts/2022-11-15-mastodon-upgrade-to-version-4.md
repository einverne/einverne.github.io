---
layout: post
title: "Mastodon 升级到 V4 版本"
aliases:
- "Mastodon 升级到 V4 版本"
tagline: ""
description: ""
category: 经验总结
tags: [mastodon, mastodon-upgrade, docker, docker-compose]
create_time: 2022-11-15 13:56:41
last_updated: 2022-11-15 13:56:41
---

记录一下 Mastodon 更新升级步骤。

[Mastodon](https://github.com/mastodon/mastodon/releases/tag/v4.0.0) 发布了 4.0.0 版本

- 追踪 hashtags
- 可以按语言来过滤
- 支持 WebP
- 翻译内容
- 注册时显示社区规则
- 添加了内容和媒体的缓存过期时间，定期自动清理
- 支持自定义角色
- 嘟文支持编辑
- 表情包大小限制开放为 256KB

更加详细的发布清单可以参考[这里](https://github.com/mastodon/mastodon/releases/tag/v4.0.0)

## 备份

### 备份数据库

```
docker exec mastodon-db-1 pg_dump -Fc -U mastodon mastodon > 20221115_backup.dump
```

说明：

- `-F format` 指定输出的格式，format 可以是：
  - `p` plain，纯文本 SQL
  - `c` custom，自定义归档格式
  - `d` directory，用于 `pg_restore` 的目录格式归档，将创建目录
  - `t` tar，生成适合输入到 `pg_restore` 的 tar 归档文件
- `-U username` 指定连接用的用户名

## Upgrade

修改 `docker-compose.yml` 文件将 3.5.3 版本修改为 4.0.0 。然后执行：

```
docker-compose run --rm -e SKIP_POST_DEPLOYMENT_MIGRATIONS=true web rails db:migrate
```

然后 `docker-compose up -d` 更新容器到 4.0.0。

然后执行：

```
docker-compose run --rm web rails db:migrate
```

最后在重启 Mastodon 容器。
