---
layout: post
title: "使用 Docker 安装 Mastodon 实例搭建自己的社交网络"
aliases:
- "使用 Docker 安装 Mastodon 实例搭建自己的社交网络"
tagline: ""
description: ""
category: 学习笔记
tags: [ mastodon, linux, docker, social-media, twitter, distributed-system ]
last_updated: 2022-05-12 09:12:21
create_time: 2022-01-11 05:49:09
---

早之前就对 Mastodon 有所耳闻，当时 Google+ 关闭的时候就想着自建一个 Mastodon 实例，但是一直因为没有服务器，也没抽出时间就耽搁了，期间一直在寻找一个比较合适的栖息地，但国内的豆瓣越来越封闭，动不动就删贴，Twitter 是进来使用比较多的社交媒体，但也并没有怎么深入的用，只是在上面关注了一些行业里面的大佬。最近正好 So you Start 服务器中的资源很有剩余，就尝试安装一下 Mastodon。

[[Mastodon]] 是一个开源的、分布式社交网络，他创立的目的就是用来代替 Twitter。和 Twitter 一样，用户可以 Follow 他人，也可以相互关注，用户可以发布消息、图片、视频等等。但是和 Twitter 不同的是，Mastodon 没有一个中心化的存储和内容审查。Mastodon 使用 [[ActivityPub]] 协议进行通信，任何实现了该协议的站点都可以同 Mastodon 实例进行通信。

Mastodon 由无数社区维护的服务器运行，用户在某一台服务器上注册的账号可以和其他网络节点进行通信，也可以跨节点交换数据。

先来看看成果：

- <https://m.einverne.info>

欢迎来玩。

## Prerequisites

- Mastodon 需要比较高的服务器配置，推荐至少 2 核 4GB 内存以上，空间最好也稍微大一些，前期可以把资源文件放本地，但扩展起来把媒体资源文件放到云存储上比较好
- 一个域名
- 可以发送邮件的 [[SMTP]] 配置，可以[使用 Mailcow 自建](/post/2022/04/mailcow-email-server.html)，或者[这些](/post/2020/02/self-hosted-mail-server.html)，或者使用[邮件服务提供商](/post/2017/07/email-services-collection.html)
- 系统：Ubuntu/Debian
- 安装 `docker` 和 `docker-compose`
- 可选 Cloudflare

## 安装
本文使用 Docker + Nginx 的方式配置，使用 Docker 起服务，然后在宿主机上使用 Nginx 反向代理（因为 So you Start 这台机器之前就已经安装了 Nginx，否则的话会使用 Nginx-Proxy 或者 [[Nginx Proxy Manager]] 来直接管理 Docker 容器）。

因为 Docker Compose 的配置比较直观，我就直接放一个[链接](https://github.com/einverne/dockerfile/blob/master/mastodon/docker-compose.yml)。

首先创建网络：

    docker network create external_networks
    docker network create internal_network

### Database
这里直接选用 [[PostgreSQL]] 作为数据库存储。

### Redis
选择 Redis 作为缓存和队列。

### Elasticsearch
Elasticsearch 是可选的组件，主要用来对内容做全文检索。

### 初始化安装
之后就是 `tootsuite/mastodon` 本体。

第一次安装需要先执行一个初始化的动作，将这部分内容另存为一个 `docker-compose.init.yml` 文件：

```
version: "3"
services:
  web:
    image: tootsuite/mastodon:v3.4.4
    restart: always
    environment:
      - "RAILS_ENV=production"
    command: bash -c "rm -f /mastodon/tmp/pids/server.pid; tail -f /etc/hosts"
    networks:
      - mastodon_networks

networks:
  mastodon_networks:
    external: true
```

然后指定该文件

    docker-compose -f docker-compose.init.yml run --rm web bundle exec rake mastodon: setup

在初始化的过程中会要求提供域名，数据库用户名密码，以及 SMTP 等等配置。按照提前准备的内容依次输入即可。然后就可以获得一份初始配置。记得从终端拷贝下来，并保存为 `.env.production`。

然后再使用 `docker-compose up -d` 启动所有的容器。

### Nginx 反向代理

在 Mastodon 的 GitHub 仓库中官方提供了 [Nginx 配置文件模板](https://github.com/mastodon/mastodon/blob/main/dist/nginx.conf) 。

可以拉一下代码，然后直接拷贝使用。

    git clone https://github.com/mastodon/mastodon.git
    cd mastodon
    sudo cp dist/nginx.conf /etc/nginx/sites-available/mastodon
    sudo ln -s /etc/nginx/sites-available/mastodon /etc/nginx/sites-enabled/mastodon

然后修改配置文件中的 `example.com` 为自己的域名，然后记得将网站的 root 修改为自己服务器上的路径。

    sudo /etc/init.d/nginx reload

等待 Nginx 加载文件之后，就可以访问域名，进入实例。

## 实例维护

查看 Mastodon 实例的性能和日志，可以访问：<https://domain.com/sidekiq>  [[Sidekiq]] 是一个 Ruby 的后台异步任务系统。

查看数据库的信息和查询效率，可以访问：<https://domain.com/pghero>

## 其他搭建教程
本文因为已经使用了 Nginx，所以直接使用 Nginx 做反向代理，如果你是一个台没有占用 80，443 端口的服务器，那么还可以直接使用 Nginx-Proxy，或者 [Nginx Proxy Manager](/post/2022/02/nginx-proxy-manager.html) 来直接接管 Docker 容器。

- 如果你使用 Docker + Nginx Proxy 可以参考 [这篇](https://blog.riemann.cc/digitalisation/2022/02/06/mastodon-setup-with-docker-and-nginx-proxy/)
- Linode 官方的 [教程](https://www.linode.com/docs/guides/install-mastodon-on-ubuntu-2004/#download-mastodon) 也可以参考
- 使用 [Nginx 反向代理](https://www.howtoforge.com/how-to-install-mastodon-social-network-with-docker-on-ubuntu-1804/)

## 升级实例版本
修改 `docker-compose.yml` 文件中的版本，然后重启实例。

    docker-compose run --rm web rails db:migrate
    docker-compose run --rm web rails assets: precompile

## 其他

### 单用户节点

修改 `.env.production` 中增加：

    SINGLE_USER_MODE=true

然后重启服务。

### SSL/TLS certificate

使用 [Certbot](https://certbot.eff.org/)

    sudo snap install core && sudo snap refresh core
    sudo snap install --classic certbot
    sudo certbot --nginx

### 每周一开放注册

```
00 0 * * 1 root docker exec mastodon_web_1 tootctl settings registrations approved >> /home/mastodon/log/mastodon/all.log 2>&1
00 0 * * 2 root docker exec mastodon_web_1 tootctl settings registrations close >> /home/mastodon/log/mastodon/all.log 2>&1
```

### 开启 ES 全文检索

```
ES_ENABLED=true
ES_HOST=es
ES_PORT=9200
```

然后停止服务重新启动。然后在 <https://domain.com/admin> 中就能看到全文搜索已经启用了。

然后执行：

    docker-compose run --rm web bin/tootctl search deploy

就可以建立索引。


## 遇到问题

### 上传图片 500

网上大致看了一下，然后 `docker-compose logs -f` 看了一下日志，发现 ERROR：

```
web_1        | [9c1db729-7032-4c87-a85c-c38dc47380cf] Errno::EACCES (Permission denied @ dir_s_mkdir - /opt/mastodon/public/system/media_attachments):
```

可以看到权限不足，因为 Docker 部署，挂载到了本地的 `~/mastodon/public` 目录下，所以：

    sudo chown -R 991:991 ~/mastodon/public

### 上传图片 422 Error processing thumbnail for uploaded media
同样也是上传文件的报错。但是这个错误发生在 `sidekiq` 中

    docker-compose logs -f sidekiq

查看错误，发现：

```
sidekiq_1    | 2022-05-12T03:59:56.171Z pid=6 tid=2fmy WARN: Errno::ENOENT: No such file or directory @ rb_sysopen - /opt/mastodon/public/system/media_attachments/files/108/286/964/537/181/703/original/559172f05be085c3.jpeg
```

一查配置发现，Sidekiq 挂载的时候没有暴露其中最后一行。

```
     volumes:
       - /etc/localtime:/etc/localtime:ro
       - /etc/timezone:/etc/timezone:ro
       - ~/mastodon/public/system:/mastodon/public/system
```

添加最后一行，重启即可。这个只能怪我太粗心了。

## reference

- <https://www.linode.com/docs/guides/install-mastodon-on-ubuntu-2004/>
