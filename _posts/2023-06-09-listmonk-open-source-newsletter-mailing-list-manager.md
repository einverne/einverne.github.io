---
layout: post
title: "使用 Listmonk 搭建自己的 Newsletter"
aliases:
- "使用 Listmonk 搭建自己的 Newsletter"
tagline: ""
description: ""
category: 产品体验
tags: [newsletter, listmonk, email, email-server, email-service, docker, postgresql]
create_time: 2023-06-09 09:22:58
last_updated: 2023-06-09 09:22:58
---

[listmonk](https://github.com/knadh/listmonk) 是一个开源的，使用 Go 语言编写的，自托管的邮件列表订阅应用。目前已经在 GitHub 收获了超过 10000 颗星星，listmon 速度非常快，功能丰富，并且可以直接打包成一个二进制文件，和 PostgreSQL 数据库一起使用。

借助 listmonk 可以非常快速的搭建属于自己的 Newsletter，Newsletter 是一种基于邮件的时事通讯，企业或组织可以通过邮箱给其成员，客户，员工或其他订阅者发送活动的新闻及广告营销的方式，但最近也逐渐成为个人出版、自媒体的流行订阅形式，相比 RSS，它更加自主，有更好的阅读体验，并且可以有更灵活的付费方式。

特性：

- 支持公共列表和私有列表
- 只依赖 [[PostgreSQL]]
- 拥有管理面板
- 基于 Go 的模板、支持 WYSIWYG 编辑器
- 多线程，多 SMTP 邮件队列，用于快速投递邮件
- HTTP，JSON API
- 点击和视图追踪
- 支持导入 [[MailChimp]] 和 [[Substack]] 的订阅用户

## 安装

具体的 [docker-compose](https://github.com/einverne/dockerfile/tree/master/listmonk) 可以看[这里](https://github.com/einverne/dockerfile/tree/master/listmonk)，listmonk 需要依赖一个配置文件，我一般习惯直接放在 HOME 目录中

```
git clone git@github.com:einverne/dockerfile.git
cd dockerfile/listmonk
cp env .env
# edit .env
# create config.toml
vi ~/listmonk/config.toml
```

然后填入一下内容。注意将配置文件中的内容填写，比如用户名和密码，数据库连接方式替换为自己的内容。

```ini
[app]
# Interface and port where the app will run its webserver.
address = "0.0.0.0:9000"
admin_username = "username"
admin_password = "password"

# Database.
[db]
host = "host"
port = 5432
user = "listmonk"
password = "pass"
database = "listmonk"
ssl_mode = "disable"
max_open = 25
max_idle = 25
max_lifetime = "300s"
```

当添加完配置文件之后，就可以使用 `docker-compose up -d db` 来启动数据库了，但是 listmonk 应用不回初始化数据库 Schema，所以还需要进行初始化数据库操作。

```
docker-compose run --rm app ./listmonk --install
```

等初始化数据操作完成，可以通过进入 PostgreSQL 容器查看表结构来验证。

```
docker exec -it listmonk_db /bin/bash

psql -d listmonk -U listmonk -W
\dt
```

最后就可以启动应用 `docker-compose up -d`

## 自定义静态模板文件

这部分内容已经在我上面提及的 `docker-compose.yml` 文件中存在。

```
  app:
    <<: *app-defaults
    container_name: listmonk_app
    depends_on:
      - db
    command: "./listmonk --static-dir=/listmonk/static"
    volumes:
      - "${LISTMONK_CONFIG}/config.toml:/listmonk/config.toml"
      - "./static:/listmonk/static"
```

## 导入外部订阅用户

加入已经在 [[MailChimp]] 或者 [[Substack]] 上有一定的订阅用户，那么可以通过后台工具导入 csv 文件。但需要注意的是，导入的用户默认状态是 Unconfirmed，所以需要进入数据库手动更新用户的状态。

```
docker exec -it listmonk_db /bin/bash
psql -d listmonk -U listmonk -W
```

输入密码登录数据库，然后执行 `\dt` 查看表。然后查看表内容

```
SELECT * from subscriber_lists;
```

然后更新所有人

```
UPDATE subscriber_lists SET status='confirmed' WHERE list_id=4;
```

## 设置 SSL

默认情况下 listmonk 运行在 HTTP，不提供 SSL，我们可以借助 Nginx 和 Let's Encrypt 来生成证书提供更安全的访问。

有很多种方式可以完成

- 在服务器上安装 Nginx，然后[使用 certbot 生成 SSL 证书并自动续期](/post/2016/02/certbot.html)
- 也可以利用 [Nginx Proxy Manager](/post/2022/02/nginx-proxy-manager.html) 来管理 Docker 中的服务，自动暴露 Docker 端口，然后提供 SSL 访问
  - 或者如果不想有一个 Web UI 管理界面，也可以利用 [Nginx Proxy](/post/2017/02/docker-nginx-host-multiple-websites.html) 自动管理 Docker 中的服务，生成证书
- 在这边因为我已经安装了 [HestiaCP 控制面板](/post/2022/07/web-server-control-panel-hestia-usage.html) 就直接借助其自带的 Nginx

之前好几篇文章也介绍过 [HestiaCP 面板中的模板文件](/post/2023/01/hestiacp-web-template.html)，所以这里就简单再总结一下。

首先与进入 root 账户 `sudo su -`

然后进入如下的目录

```
cd /usr/local/hestia/data/templates/web/nginx/php-fpm/
```

这个目录中包含了 HestiaCP 默认的 Nginx 模板。

```
cp default.tpl listmonk.tpl
cp default.stpl listmonk.stpl
```

然后分别修改这两个新生成的 listmonk 配置文件。

将其中 location 部分修改

```
    location / {
        proxy_pass  http://localhost:9001;
        proxy_set_header    Host                $http_host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
    }
```

然后最好把 `stpl` 文件中的 `proxy_hide_header Upgrade;` 删除。

再进入 HestiaCP 管理后台，创建用户，然后创建网站，填入域名。创建域名进入高级管理，在 Web Template（Nginx）中选择刚刚创建的 listmonk，保存。然后在高级设置中，配置 SSL，等待获取证书，保存之后就能通过域名来访问 listmonk 了。
