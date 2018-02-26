---
layout: post
title: "docker compose"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, dockercompose, linux,]
last_updated: 
---

Docker Compose 是一个定义和启动多容器的工具，可以使用 Compose 来管理多个 Docker 容器。Docker Compose 使用 YAML 文件定义应用，之后可以使用一行简单的命令来创建或者启动所有的服务。

## 使用 Compose
使用 Compose 可以简单的归纳为三步

- 定义应用的 Dockerfile
- 定义服务 docker-compose.yml 文件
- 执行 `docker-compose up` 来启动整个服务

常见的 `docker-compose.yml` 文件如下：

```
version: '3'
services:
  web:
    build: .
    ports:
    - "5000:5000"
    volumes:
    - .:/code
    - logvolume01:/var/log
    links:
    - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```

## 安装
Compose 依赖于 Docker Engine，所以确保安装 Compose 之前 Docker 已经在本地安装成功。安装 Compose 非常简单，将编译好的二进制文件下载到本地即可，查看compose 的github release [页面](https://github.com/docker/compose/releases) 获取最新版本:

    sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose --version

## 示例
具体例子可参考官网或者 <https://github.com/einverne/dockerfile/> 项目下有 `compose-start` 文件夹，其中包含示例代码:

    version: '3'
    services:
      web:
        build: .
        ports:
         - "5000:5000"
      redis:
        image: "redis:alpine"

在该文件夹下使用 `docker-compose up` 启动服务。使用 `docker-compose down` 关闭。如果想要在后台执行添加 `-d` 选项 `docker-compose up -d`。


## reference

- <https://docs.docker.com/compose/>
