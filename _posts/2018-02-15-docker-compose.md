---
layout: post
title: "使用 docker compose 管理多个容器"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, docker-compose, linux,]
last_updated: 
---

Docker Compose 是一个定义和启动多容器的工具，可以使用 Compose 来管理多个 Docker 容器。Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。Docker Compose 使用 YAML 文件定义应用，之后可以使用一行简单的命令来创建或者启动所有的服务。

Dockerfile 模板文件，可以让用户很方便的定义一个单独的应用容器，但往往实际应用可能包含不止一个容器，常见的 Web 容器通常还包括一个数据库容器。Compose 允许用户通过一个单独的 docker-compose.yml 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。

Compose 中有两个重要的概念：

- 服务 (service)：应用容器，实际上可以包括若干运行相同镜像的容器实例
- 项目 (project)：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义

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

## 以非root方式运行docker

如果 docker 用户不存在，创建docker 用户组

    sudo groupadd docker
    
将当前用户添加到docker 用户组：

    sudo usermod -aG docker [non-root user]


## 命令使用
Compose 命令的对象是项目本身，也可以为项目中的服务或者容器，默认为项目。
服务容器一旦构建后，将会带上一个标记名，例如对于 web 项目中的一个 db 容器，可能是 web_db。


命令选项:

    -f, --file FILE 指定使用的 Compose 模板文件，默认为 docker-compose.yml，可以多次指定。
    -p, --project-name NAME 指定项目名称，默认将使用所在目录名称作为项目名。

### 常见命令

    docker-compose up          # 自动完成构建镜像，创建服务，启动服务，并关联服务等操作
    docker-compose down
    docker-compose start       # 启动存在的服务
    docker-compose stop        # 停止
    docker-compose restart     # 重启项目中服务
    docker-compose exec        # 进入指定容器
    docker-compose help
    docker-compose image       # 列出 Compose 文件中包含的镜像
    docker-compose kill [SERVICE...]
    docker-compose pause [SERVICE...]
    docker-compose unpause [SERVICE...]
    docker-compose ps          # 列出项目中所有容器

### up
大部分时候都可以直接通过该命令来启动一个项目，默认情况，`docker-compose up` 启动的容器都在前台，控制台将会同时打印所有容器的输出信息。

当通过 Ctrl-C 停止命令时，所有容器将会停止。如果使用 `docker-compose up -d`，将会在后台启动并运行所有的容器。一般推荐生产环境下使用该选项。

    docker-compose up -d        # 后台执行

### down
此命令将会停止 up 命令所启动的容器，并移除网络

    docker-compose              # 移除停止的容器
    docker-compose -v           # 此选项会移除 volumns 中定义的卷，千万小心

举例

    > docker-compose down -v
    Removing wordpress    ... done
    Removing wordpress_db ... done
    Removing network wordpress_wordpress-network
    Removing volume wordpress_db_data


### build 
重构项目中容器

    docker-compose build [options] [SERVICE...]

### rm
删除所有停止状态的服务容器。

    docker-compose rm [options] [SERVICES ..]

### config
验证 Compose 文件格式是否正确

    docker-compose config


## Compose 模板文件

默认的模板文件名称为 docker-compose.yml，格式为 YAML 格式。大部分的指令和 `docker run` 的含义是一样的。

### image
指定镜像名或者镜像ID，如果本地不存在，Compose 会拉取该镜像

    image: ubuntu

### volumes
数据卷挂载设置，可以设置宿主机路径 （HOST:CONTAINER） 或加上访问模式 （HOST:CONTAINER:ro）

    volumes:
     - /var/lib/mysql

### ports
暴露端口信息，使用宿主端口：容器端口 (HOST:CONTAINER) 格式，或者仅仅指定容器的端口（宿主将会随机选择端口）

更多详细可参考: <https://yeasy.gitbooks.io/docker_practice/content/compose/compose_file.html>

## reference

- <https://docs.docker.com/compose/>
