---
layout: post
title: "docker volumes 中 -v 和 -mount 区别"
tagline: ""
description: ""
category: [学习笔记, Docker]
tags: [docker, dockerfile, command, docker-compose, linux,]
last_updated: 
---

Docker Volumes 机制通常用来给 Docker 容器保存持久化数据，使用 Volumes 有很多优势：

- 更容易备份和迁移
- 使用 Docker CLI 命令或者 Docker API 来管理
- 可以在 Linux 和 Windows 上使用
- 可以更安全得在多个容器中共享
- Volume drivers 允许容器将内容保存到远端，云服务提供商，或者加密volume内容，或者增加其他功能
- 新 Volume 的内容可以被容器预先填充, volume 会先将容器内容拷贝到容器外目录

Volumes 通常也优于容器的可写层，使用 Volumes 不会增加容器的体积，并且 Volumes 的内容存储在外部独立于容器的生命周期。如果容器不产生持久化数据，可以考虑使用 [tmpfs mount](https://docs.docker.com/storage/tmpfs/)来避免数据存储在其他可能的地方，避免增加容器的体积。

## -v 和 -mount 选项
最开始 `-v` 或者 `--volume` 选项是给单独容器使用， `--mount` 选项是给集群服务使用。但是从 Docker 17.06 开始，也可以在单独容器上使用 `--mount`。通常来讲 `--mount` 选项也更加具体(explicit)和"啰嗦"(verbose)，最大的区别是

- `-v` 选项将所有选项集中到一个值
- `--mount` 选项将可选项分开

如果需要指定 volume driver 选项，那么必须使用 `--mount`

- `-v` 或 `--volume`: 包含三个 field，使用 `:` 来分割，所有值需要按照正确的顺序。第一个 field 是 volume 的名字，并且在宿主机上唯一，对于匿名 volume，第一个field通常被省略；第二个field是宿主机上将要被挂载到容器的path或者文件；第三个field可选，比如说 `ro`
- `--mount`: 包含多个 key-value 对，使用逗号分割。`--mount` 选项更加复杂，但是各个值之间无需考虑顺序。

    - `type`，可以为 `bind`, `volume`, `tmpfs`, 通常为 `volume`
    - `source` 也可以写成 `src`，对于 named volumes，可以设置 volume 的名字，对于匿名 volume，可以省略
    - `destination` 可以写成 `dst`或者 `target` 该值会挂载到容器
    - `readonly` 可选，如果使用，表示[只读](https://docs.docker.com/storage/volumes/#use-a-read-only-volume)
    - `volume-opt` 可选，可以使用多次

两个例子

    docker run -d \
      --name=nginxtest \
      --mount source=nginx-vol,destination=/usr/share/nginx/html \
      nginx:latest

    docker run -d \
      --name=nginxtest \
      -v nginx-vol:/usr/share/nginx/html \
      nginx:latest

## reference

- <https://docs.docker.com/storage/volumes/>
