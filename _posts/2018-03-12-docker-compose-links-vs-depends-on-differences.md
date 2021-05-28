---
layout: post
title: "docker-compose 中 links 和 depends_on 区别"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, docker-compose, linux, ]
last_updated: 
---

以下的内容适用于 `docker-compose` 版本 `version 2` 和 `version 3`。先来看 Docker 官方文档中关于 [Docker Compose and Django](https://docs.docker.com/compose/django/#/define-the-project-components)的例子，可以使用 `depends_on` 来访问容器中的数据

    version: '2'
    services:
      db:
        image: postgres
      web:
        build: .
        command: python manage.py runserver 0.0.0.0:8000
        volumes:
          - .:/code
        ports:
          - "8000:8000"
        depends_on:
          - db

而比如下面使用

    web:
      links:
       - db

则表示当启动 db 容器时会随机分配一个本地端口比如32777来连接容器3306端口，每一次修改或者重启容器都会改变该端口，使用 links 来保证每一次都能够连接数据库，而不需要知道具体端口是什么。比如说启动了一个 MySQL 容器

    docker run -d --name=my-mysql --env="MYSQL_ROOT_PASSWORD=mypassword" -P mysql
    docker inspect <container-id> | grep HostPort

会显示该容器的本地端口。

当 `docker-compose` 执行 V2 文件时会自动在容器间创建一个网络，每一个容器都能够立即通过名字来访问到另外的容器。 因此，不再需要 links，links 过去通常用来开始db容器和web server容器网络之间的通讯，但是这一步已经被 `docker-compose` 做了。[^refer]

当使用 `depends_on` 来定义服务之间的依赖关系时会造成下面的影响[^dependson]

- `docker-compose up` 会依据**依赖顺序**启动服务
- `docker-compose up` 启动时 SERVICE 会自动包括 SERVICE 的依赖

看这个例子：

    version: '2'
    services:
      web:
        build: .
        depends_on:
          - db
          - redis
      redis:
        image: redis
      db:
        image: postgres

这个例子中 db ，redis 容器启动顺序要优先于 web 容器；当启动 web 容器时会自动创建 redis 和 db 容器。

不过需要注意的是， `depends_on` 不会等到 db 和 redis 容器 `ready` 再启动，web 容器仅仅等到 redis 和 db 容器启动就开始启动。具体可参考官网[启动顺序](https://docs.docker.com/compose/startup-order/)了解。


[^refer]: <https://medium.com/@giorgioto/docker-compose-yml-from-v1-to-v2-3c0f8bb7a48e#.ukh8ajps0>

[^dependson]: <https://docs.docker.com/compose/compose-file/#/dependson>

## reference

- <https://stackoverflow.com/a/39658359/1820217>
