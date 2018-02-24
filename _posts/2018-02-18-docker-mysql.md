---
layout: post
title: "Docker中运行 MySQL"
tagline: ""
description: ""
category: 学习笔记
tags: [mysql, database, linux, docker,]
last_updated: 
---

[mysql](https://hub.docker.com/_/mysql/) 是 Docker 和 MySQL 官方提供的一个镜像。

## 启动服务器实例
拉取镜像

    docker pull mysql

启动镜像

    docker run --name first-mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:5.7

这样就创建了一个名为 `first-mysql` 的 mysql 5.7 实例。

## Shell 中访问容器日志查看

    docker exec -it first-mysql bash

日志

    docker logs first-mysql


## 环境变量
当启动 mysql 容器时，可以传入环境变量来改变容器的配置：

- `MYSQL_ROOT_PASSWORD`：必须。用于设置MySQLroot用户的密码
- `MYSQL_DATABASE`：可选。用于指定镜像启动容器时要创建的数据库。如果提供了用户/密码，则会将该用户做为此数据库的超级用户。
- `MYSQL_USER`，`MYSQL_PASSWORD`：可选。用于创建一个新用户并设置密码。
- `MYSQL_ALLOW_EMPTY_PASSWORD`：可选。设置为yes时，则可以使用空密码登录
- `MYSQL_RANDOM_ROOT_PASSWORD`：可选。设置为yes时会为root用户设置一个随机密码（使用pwgen），所生成的随机密码会被输出到stdout
- `MYSQL_ONETIME_PASSWORD`：可选。为root用户指定一个一次性密码，该密码会在用户首次登录时强制修改

## 数据存储

mysql 镜像创建容器时，数据库存储会以下面两种方式存储：

- 数据卷容器：使用Docker默认的数据管理方式来管理数据库的数据存储，在这种方式下，数据库文件会被写入数据库的内部。这种方式对于用户非常简单，缺点是很在宿主机上找到所存储的数据。
- 外部数据卷：在宿主机创建一个数据目录，再将数据目录挂载到容器内部。这种方式可以很方便的在宿主机上找到并进行数据管理，但需要确保数据目录的存在。

使用外部数据卷时，假设宿主机有 /my/data/ 目录，可以使用 `-v` 选项来讲宿主机挂载到容器：

    docker run --name mysql -v /my/data/:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:5.7

数据备份

    docker exec first-mysql sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > /some/path/on/your/host/all-databases.sql

## 在其他容器中连接mysql
官方的镜像中导出的是默认 3306 端口，其他容器可以使用 `--link` 参数来连接mysql容器

    docker run --name other-app --link first-mysql:mysql -d other-application-use-mysql
