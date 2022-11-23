---
layout: post
title: "Docker Compose 中使用环境变量"
aliases: 
- "Docker Compose 中使用环境变量"
tagline: ""
description: ""
category: 学习笔记
tags: [ docker, dockerfile, environment-variable, shell, linux, ]
last_updated:
---

通常在使用 Docker compose 的时候会设置很多的环境变量来控制容器的使用。

很多情况下我们会直接写到 `docker-compose.yml` 文件中类似于下面 `environment` 中的：

```
version: "3"
services:
  flarum:
    image: mondedie/flarum:stable
    container_name: flarum
    volumes:
      - ./flarum/extensions:/flarum/app/extensions
      - ./flarum/assets:/flarum/app/public/assets
      - ./flarum/storage/logs:/flarum/app/storage/logs
      - ./flarum/nginx:/etc/nginx/flarum
    ports:
      - 8888:8888
    environment:
      - UID=1000
      - GID=1000
      - DEBUG=false
      - FORUM_URL=https://forum.domain.tld
      - UPLOAD_MAX_SIZE=20M
      - DB_HOST=
      - DB_PORT=3306
      - DB_USER=
      - DB_PASS=123456
      - DB_NAME=
```

同样也可以使用 `.env` 文件来设定。Compose 会自动寻找 compose 文件同级目录的 `.env` 文件，并自动使用 `.env` 文件中的环境变量值覆盖 shell environment 中的内容。

## Docker 使用环境变量
配置可以包含 environment variables，Compose 会使用 Shell 的环境变量值作为这些配置值。

假设 Shell 中配置了 `POSTGRES_VERSION=9.3`，那么如果有配置：

```
  db:
    image: "postgres:${POSTGRES_VERSION}"
```

当执行 `docker-compose up` 的时候，会自动将环境变量的值替换。上面的例子中就会自动使用 9.3 版本的配置。

如果环境变量没有配置，那么 Compose 会用一个空字符串替换。

如果要配置默认的环境变量，可以使用一个 `.env` 文件，Compose 会自动寻找项目目录下的该文件（和 docker-compose.yml 文件同级目录），Shell 环境变量中的值会覆盖 `.env` 文件中的。

`$VARIABLE` 和 `${VARIABLE}` 两种语法都支持。

- `${VARIABLE:-default}` 如果 VARIABLE 没有设置或是空，那么结果是 default
- `${VARIABLE-default}` 只有当 VARIABLE 没有设置的时候才为 default

同样的，可以使用如下的语法强制要求用户设置：

- `${VARIABLE:?err}` 如果 VARIABLE 没有设置，或者为空，那么会抛出移除信息 err
- `${VARIABLE?err}` 如果 VARIABLE 没有设置，会抛出 err

## 使用 `--env-file` 选项
在命令行中指定 `--env-file` 路径。

    docker-compose --env-file ./config/.env.dev up

和上一行命令等价的是，也可以使用 `env_file` 选项来将 env 文件配置到 `docker-compose.yml` 文件中：

```
web:
  env_file:
    - web-variable.env
```

## 环境变量优先级
上面提到了多种环境变量使用的方式，Compose 在选择环境变量时按照如下的优先级：

- `docker-compose.yml` 文件中的 environment 设置
- Shell 中指定的环境变量
- 环境文件 `.env`
- Dockerfile
- Variable is not defined

也就是说 compose 文件中定义的 environment 优先级是最高的。

## reference

- <https://docs.docker.com/compose/environment-variables/>
- <https://docs.docker.com/compose/compose-file/compose-file-v3/#variable-substitution>