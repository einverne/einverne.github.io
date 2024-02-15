---
layout: post
title: "使用 PlanetScale 以及 Docker 搭建网站分析 Umami"
aliases: 
- "使用 PlanetScale 以及 Docker 搭建网站分析 Umami"
tagline: ""
description: ""
category: 经验总结
tags: [umami, google-analytics, ga4, web-analytics, docker, self-hosted, mysql,]
last_updated: 2024-02-15 08:46:33
create_time: 2023-05-18 09:41:47
---

[Umami](https://umami.is/) 是一个可以自托管的数据统计服务，可以用来代替 [[Google Analytics]]。 "Umami"，源于 "Umai"，在日语里是“美味、鲜味”的意思。

![92m2](https://photo.einverne.info/images/2023/05/17/92m2.png)

## 安装

默认情况下官方推荐的是使用 [[PostgreSQL]] 来作为数据库，可以参照如下的安装。

```
apt -y update
apt -y install curl git nginx python-certbot-nginx
curl -sSL https://get.docker.com/ | sh
systemctl enable docker nginx
curl -L https://github.com/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

git clone https://github.com/mikecao/umami.git
cd umami/
# edit docker-compose.yml
```

修改：

```
version: '3'
services:
  umami:
    image: ghcr.io/mikecao/umami:postgresql-latest
    ports:
      - "127.0.0.1:3000:3000" # 仅监听在本地
    environment:
      DATABASE_URL: postgresql://username:password@db-umami:5432/umami # 配置数据库用户和密码
      DATABASE_TYPE: postgresql
      HASH_SALT: replace-me-with-a-random-string
    depends_on:
      - db-umami
  db-umami:
    image: postgres:12-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: username # 数据库用户
      POSTGRES_PASSWORD: password # 数据库密码
    volumes:
      - ./sql/schema.postgresql.sql:/docker-entrypoint-initdb.d/schema.postgresql.sql:ro
      - umami-db-data:/var/lib/postgresql/data
volumes:
  umami-db-data:
```

然后执行：

    docker-compose up -d

配置 Nginx 反向代理：

```
server {
    listen 80;
    server_name umami.yourdomain.com; # 换成你的域名
    client_max_body_size 0;

    location / {
        proxy_pass       http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
   }
}
```

## 使用 PlanetScale

但是我为了避免再维护一套数据库，所以使用了之前介绍过的云端 MySQL 兼容数据库 [PlanetScale](https://blog.einverne.info/post/2022/08/planetscale-mysql-service.html) 。

安装过程参考[这里](https://github.com/einverne/dockerfile/tree/master/umami)

```
git clone https://github.com/einverne/dockerfile.git
cd umami
cp env .env
# modify .env
docker-compose up -d
```

然后根据自己的需求，使用 Nginx ，或者直接 [[Nginx Proxy Manager]]，配上域名就完成了。

## related

- [[Plausible Analytics]]
