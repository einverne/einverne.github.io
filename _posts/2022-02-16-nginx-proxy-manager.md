---
layout: post
title: "使用 Nginx Proxy Manager 管理 Nginx 代理"
aliases:
- "使用 Nginx Proxy Manager 管理 Nginx 代理"
tagline: ""
description: ""
category: 学习笔记
tags: [ nginx, docker, docker-compose, linux, http, container, reverse-proxy, ]
last_updated:
---

Nginx Proxy Manager 是一个可以自动暴露网络服务，并申请 Let's Encrypt 免费证书的 Nginx 反向代理。可以非常方便的和 Docker 一起使用。Nginx Proxy Manager 还提供了一个不错的界面。

在没有使用 Nginx Proxy Manager 之前我一直使用 [Nginx Proxy](/post/2017/02/docker-nginx-host-multiple-websites.html) 来自动暴露 Docker 服务，并生成 SSL 证书。

## 安装

首先创建 network:

    docker network create nginx-proxy

docker-compose 配置：

```
version: "3"
services:
  nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      # These ports are in format <host-port>:<container-port>
      - '80:80' # Public HTTP Port
      - '443:443' # Public HTTPS Port
      - '81:81' # Admin Web Port
      # Add any other Stream port you want to expose
      # - '21:21' # FTP
    environment:
      DB_SQLITE_FILE: "/data/database.sqlite"
      # Uncomment this if IPv6 is not enabled on your host
      # DISABLE_IPV6: 'true'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

使用 `docker-compose up -d` 之后，访问浏览器 IP:81 端口。

默认的用户名和密码：

- admin@example.com
- changeme

### 使用
创建一个 Nginx 反向代理到 81 端口，可以设置域名解析，将 `npm.example.com` 解析到 IP 地址，然后在 Nginx Proxy Manager 后台，创建 Proxy Host，按照自己的配置填入：

![nginx proxy manager](https://img.gtk.pw/i/2022/07/09/62c9316325371.png)

等待 DNS 解析生效，访问 `npm.example.com` 即可登录管理后台。

### 使用 Docker network
在使用 Nginx Proxy Manager 的时候，可以不用让每一个容器都暴露一个端口，可以使用 Docker network 来将容器放到同一个网络下，然后使用名字来关联。

创建网络：

    docker network create nginx-proxy

然后分别将 Nginx Proxy Manager 和其他服务放到同一个网络下，添加如下配置：

```
networks:
  default:
    external:
      name: nginx-proxy
```


以 Portainer 举例：

```
version: '3'
services:

  portainer:
    image: portainer/portainer
    privileged: true
    volumes:
      - './data:/data'
      - '/var/run/docker.sock:/var/run/docker.sock'
    restart: unless-stopped

networks:
  default:
    external:
      name: nginx-proxy
```

在配置中可以看到 Portainer 没有显示定义暴露的 9000 端口，这个时候可以在 Nginx Proxy Manager 后台，通过 `portainer` 作为 hostname 来创建反向代理，关联到这个容器。这种方法只需要保证每一个容器都有一个唯一的名字即可。

## 本地静态网站
首先添加一个额外的 Volume:

```
/opt/website:/var/www/website
```

Forward Hostname/IP 填写服务器 IP 地址。

在 Advanced 中配置：

```
location / {
  root /var/www/website;
}
```

保存。然后将静态网站内容放到宿主机的 `/opt/website` 中即可。

## reference

- <https://nginxproxymanager.com/advanced-config/#best-practice-use-a-docker-network>
