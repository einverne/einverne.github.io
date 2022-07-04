---
layout: post
title: "Docker 使用 nginx-proxy 来架设多个网站"
aliases: "Docker 使用 nginx-proxy 来架设多个网站"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, nginx, proxy, dockerfile, ]
last_updated:
---

我们知道如果使用 Nginx 可以使用 Virtual HOST 来 HOST 多个域名下的网站到同一台机器，那么如果使用 Docker 架设了一个 WordPress，还想用 Docker 架设一个新的网站，那么该怎么办呢？

有一种解决办法就是使用 Nginx 转发请求，比如一个网站监听了 81 端口，一个网站监听了 82 端口，那么使用 Nginx 的代理功能，将对应的流量转发给对应的服务器处理即可。因此 nginx-proxy 这个镜像的作用就如上面所述，让我们将不同的流量转发给不同的 Docker 容器进行处理。

## 启动 nginx-proxy
有两种方式可以启动 `nginx-proxy` 容器，一种是通过 docker 命令，另一种是使用 `docker-compose`。不过用这两种方式之前，先创建一个 Docker network，将多个容器关联起来

    docker network create nginx-proxy

然后创建容器

    docker run -d -p 80:80 --name nginx-proxy --net nginx-proxy -v /var/run/docker.sock:/tmp/docker.sock jwilder/nginx-proxy

或者创建 `docker-compose.yml` ：

    version: "3"
    services:
      nginx-proxy:
        image: jwilder/nginx-proxy
        container_name: nginx-proxy
        ports:
          - "80:80"
        volumes:
          - /var/run/docker.sock:/tmp/docker.sock:ro

    networks:
      default:
        external:
          name: nginx-proxy

然后在同目录下 `docker-compose up -d`

Nginx Proxy Manager 的管理面板在 81 端口，默认的用户名和密码是 `admin@example.com` 和 `changeme`。

nginx-proxy 对外暴露 80 端口，并且监听 80 端口，允许 80 端口的流量流入。而 `/var/run/docker.sock:/tmp/docker.sock` 这一行则表示着允许该容器访问宿主机器的 Docker socket，这也就意味着有新容器加入，或者新容器关闭时都会通知到 nginx-proxy。

这样每一次添加容器，nginx-proxy 就会通过 socket 来接收到事件，自动创建对应的配置文件，然后重启 nginx 来生效。`nginx-proxy` 会寻找带有 `VIRTUAL_HOST` 环境变量的容器，然后依照配置进行。

另外 `--net nginx-proxy` 和 docker compose 中 networks 块的配置，让所有的容器通过 Docker network 进行通讯。

## 增加容器
比如增加一个 WordPress 容器

    docker run -d --name blog --expose 80 --net nginx-proxy -e VIRTUAL_HOST=blog.DOMAIN.TLD wordpress

- `--expose 80` 会允许流量从 80 端口流入
- `--net nginx-proxy` 保证 Docker 使用同一个网络
- `-e VIRTUAL_HOST=blog.DOMAIN.TLD` 开启 `nginx-proxy` 创建对应的配置文件将流量转发给 WordPress 容器

如果使用 Docker compose

    version: "3"

    services:
       db_node_domain:
         image: mysql:5.7
         volumes:
           - db_data:/var/lib/mysql
         restart: always
         environment:
           MYSQL_ROOT_PASSWORD: PASSWORD
           MYSQL_DATABASE: wordpress
           MYSQL_USER: wordpress
           MYSQL_PASSWORD: PASSWORD
         container_name: wordpress_db

       wordpress:
         depends_on:
           - db_node_domain
         image: wordpress:latest
         expose:
           - 80
         restart: always
         environment:
           VIRTUAL_HOST: blog.DOMAIN.TLD
           WORDPRESS_DB_HOST: db_node_domain:3306
           WORDPRESS_DB_USER: wordpress
           WORDPRESS_DB_PASSWORD: PASSWORD
         container_name: wordpress
    volumes:
        db_data:

    networks:
      default:
        external:
          name: nginx-proxy

不过这里需要注意的是会创建一个数据库容器，一个 WordPress app 容器。

## 扩展
如果想要支持 SSL，那么 `nginx-proxy` 有一个对应的项目 [letsencrypt-nginx-proxy-companion](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion)，他可以自动创建和续签 Let's Encrypt 的证书。

## 延展阅读

- [Nginx Proxy Manager](https://nginxproxymanager.com/)
- [docker-swag](https://github.com/linuxserver/docker-swag)，或者 [LinuxServer 网站指南](https://docs.linuxserver.io/general/swag)

## reference

- <https://github.com/jwilder/nginx-proxy>
- <https://github.com/einverne/dockerfile/tree/master/nginx-proxy>
- <https://gtk.pw/Wy5BG>
