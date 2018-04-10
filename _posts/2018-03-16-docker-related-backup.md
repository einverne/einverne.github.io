---
layout: post
title: "备份 Docker 镜像容器和数据"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, docker, container, image, volume]
last_updated: 
---

本意上想要了解一下 Docker 容器中 Volume 的备份，毕竟重要的数据都在 Volume 中。然后顺带看了一下 Docker 镜像，容器的备份，不过镜像和容器托管到 Docker Hub 上也算是备份了。

Volume 可以叫做 `数据卷`，可供一个或者多个容器使用：

- 数据卷 可以在容器之间共享和重用
- 对 数据卷 的修改会立马生效
- 对 数据卷 的更新，不会影响镜像
- 数据卷 默认会一直存在，即使容器被删除

## 镜像备份
这里说的备份指的是直接从本地备份镜像文件，可以使用 [docker save](https://docs.docker.com/engine/reference/commandline/save) 命令将镜像打包成 tar 文件，之后可以使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 命令来恢复。

## 容器备份
备份容器有不同的方法：

- 通过 [docker commit] 命令来提交一个基于当前容器状态的新镜像
- 使用 [docker export] 命令来将容器导出到系统文件并压缩成 tar，之后可以根据该 tar 文件使用 [docker import](https://docs.docker.com/engine/reference/commandline/import/) 来创建新的镜像

需要注意的是所有的命令都只会备份容器 layered file system ，**不包括** 挂载的数据卷 Volumes

## 数据卷操作

[Docker user guide](https://docs.docker.com/engine/tutorials/dockervolumes/#backup-restore-or-migrate-data-volumes) 中有非常详细的知道，如何备份数据卷，这样就可以在新容器启动时使用备份好的数据。当备份 data volume 时，需要先关闭容器。

    docker volume create my-vol          # 创建数据卷
    docker volume ls                     # 查看所有数据卷
    docker volume inspect my-vol         # 查看指定数据卷内容
    docker run -d -P \
        --name web \
        # -v my-vol:/wepapp \
        --mount source=my-vol,target=/webapp \
        training/webapp \
        python app.py                   # 启动并挂载一个数据卷 使用 `--mount`
    docker inspect web                  # 查看容器中 mount 信息
    docker volume rm my-vol             # 移除数据卷

数据卷 是被设计用来持久化数据的，它的生命周期独立于容器，Docker 不会在容器被删除后自动删除 数据卷，并且也不存在垃圾回收这样的机制来处理没有任何容器引用的 数据卷。如果需要在删除容器的同时移除数据卷。可以在删除容器的时候使用 docker rm -v 这个命令。

无主的数据卷可能会占据很多空间，要清理请使用以下命令

    docker volume prune

## reference

- <https://stackoverflow.com/a/26339848/1820217>
