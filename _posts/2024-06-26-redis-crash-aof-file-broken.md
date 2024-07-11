---
layout: post
title: "记一次磁盘日志满导致 Redis AOF 文件格式错误的问题"
aliases:
- "记一次磁盘日志满导致 Redis AOF 文件格式错误的问题"
tagline: ""
description: ""
category: 经验总结
tags: [ redis, vps, log, ubuntu, linux, redis-server, aof ]
create_time: 2024-06-26 15:50:09
last_updated: 2024-06-26 15:50:09
dg-home: false
dg-publish: false
---

记录一次 VPS 被日志写满，VPS 重启后，导致 Redis 备份文件格式错误的问题。

今天早上起来的时候就收到了一台服务器服务的告警，但是没怎么注意，还以为是网络波动，但是到中午发现服务无法访问了，上到管理面板看了一下，发现日志写到 99%，幸好此时还可以登录，所以赶紧 ssh 登录上去，使用 [gdu](https://blog.einverne.info/post/2021/07/gdu-fast-disk-usage-analyzer.html) 扫描一下，发现 `/www/wwwlogs/` 文件占用了超过 60 GB，然后再一看网站的访问日志就写了超过 30GB，所以立马 less 排查一下没发现异常，就把文件清理了，但是 Ubuntu 下有一个问题，即使清理了文件，一时间系统也无法感知到文件被删除了，可能因为 Nginx 还在不断占用文件句柄写文件中，所以无奈只能临时重启一下服务器。

但是重启之后问题就出现了，首先是 Redis 无法启动

```
❯ sudo /etc/init.d/redis-server status
● redis-server.service - Advanced key-value store
     Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Wed 2024-06-26 14:42:18 CST; 13s ago
       Docs: http://redis.io/documentation,
             man:redis-server(1)
    Process: 6918 ExecStart=/usr/bin/redis-server /etc/redis/redis.conf (code=exited, status=0/SUCCESS)
   Main PID: 6919 (code=exited, status=1/FAILURE)

Jun 26 14:42:18 gc4 systemd[1]: redis-server.service: Scheduled restart job, restart counter is at 5.
Jun 26 14:42:18 gc4 systemd[1]: Stopped Advanced key-value store.
Jun 26 14:42:18 gc4 systemd[1]: redis-server.service: Start request repeated too quickly.
Jun 26 14:42:18 gc4 systemd[1]: redis-server.service: Failed with result 'exit-code'.
Jun 26 14:42:18 gc4 systemd[1]: Failed to start Advanced key-value store.
```

然后我根据 Redis ，查看了 `/var/log/redis/redis-server.log` 之后发现，原来是 AOF 文件的问题。

```
8882:M 26 Jun 2024 14:43:42.161 * Reading RDB preamble from AOF file...
8882:M 26 Jun 2024 14:43:42.257 * Reading the remaining AOF tail...
8882:M 26 Jun 2024 14:43:42.935 # Bad file format reading the append only file: make a backup of your AOF file, then use ./redis-check-aof --fix <filename>
```

因为这一台服务器的 Redis 是直接通过 apt 安装，所以 AOF 文件默认被放在了 `/var/lib/redis/appendonly.aof` ，使用命令行

```
# back up aof file
cp appendonly.aof appendonly.aof.bak
redis-check-aof --fix appendonly.aof
```

然后再重启 Redis

```
sudo /etc/init.d/redis-server start
```

即可。
