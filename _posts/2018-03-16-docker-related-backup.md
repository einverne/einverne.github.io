---
layout: post
title: "备份 Docker 镜像容器和数据以及无痛迁移"
alias: "备份 Docker 镜像容器和数据以及无痛迁移"
tagline: ""
description: ""
category: [ 学习笔记 , Docker]
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

        docker save -o /path/to/image.tar image-name:1.0.0
        docker load -i /path/to/image.tar

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

`数据卷` 是被设计用来持久化数据的，它的生命周期独立于容器，Docker 不会在容器被删除后自动删除 数据卷，并且也不存在垃圾回收这样的机制来处理没有任何容器引用的 数据卷。如果需要在删除容器的同时移除数据卷。可以在删除容器的时候使用 `docker rm -v` 这个命令。

无主 (dangling) 的数据卷可能会占据很多空间，要清理请使用以下命令

    docker volume prune

## 数据卷备份
比如在 docker compose 中定义了叫做 `db_data` 的 volume：

    volumes:
      db_data:

那么在启动 docker compose 之后会生成一个 `DOCKER_COMPOSE_NAME` 加上 `VOLUME_NAME` 的容器卷

    [DOCKER_COMPOSE_NAME]_[VOLUME_NAME]

那么可以使用下面的命令来备份该数据卷：

    docker run --rm \
      --volume [DOCKER_COMPOSE_PREFIX]_[VOLUME_NAME]:/[TEMPORARY_DIRECTORY_TO_STORE_VOLUME_DATA] \
      --volume $(pwd):/[TEMPORARY_DIRECTORY_TO_STORE_BACKUP_FILE] \
      alpine \
      tar cvf /[TEMPORARY_DIRECTORY_TO_STORE_BACKUP_FILE]/[BACKUP_FILENAME].tar /[TEMPORARY_DIRECTORY_TO_STORE_VOLUME_DATA]

看清楚其中的临时 DATA 目录和 临时备份目录，执行该命令之后，在当前文件夹下就会产生 `BACKUP_FILENAME.tar` 这样的文件，里面包含数据卷中的内容。

这一行语句包含两个 volume，举例使用说明，假如有一个数据卷叫做 `chevereto_chevereto_data`，要备份该数据卷：

	docker run --rm \
	  --volume chevereto_chevereto_data:/tmp \
	  --volume $(pwd):/path_to_store_backup \
	  alpine \
	  tar cvf /path_to_store_backup/chevereto_chevereto_data.tar /tmp

那么就能够使用该命令来恢复数据卷数据：

    docker run --rm \
      --volume [DOCKER_COMPOSE_PREFIX]_[VOLUME_NAME]:/[TEMPORARY_DIRECTORY_STORING_EXTRACTED_BACKUP] \
      --volume $(pwd):/[TEMPORARY_DIRECTORY_TO_STORE_BACKUP_FILE] \
      alpine \
      tar xvf /[TEMPORARY_DIRECTORY_TO_STORE_BACKUP_FILE]/[BACKUP_FILENAME].tar -C /[TEMPORARY_DIRECTORY_STORING_EXTRACTED_BACKUP] --strip 1

恢复数据卷数据，举例：

	docker run --rm \
	  --volume chevereto_chevereto_data:/tmp \
	  --volume $(pwd):/path_to_store_backup \
	  alpine \
	  tar xvf /path_to_store_backup/chevereto_chevereto_data.tar -C /tmp --strip 1

如果是数据库容器，比如 MySQL 容器，备份数据可以使用如下方式

    docker exec [CONTAINER_NAME] /usr/bin/mysqldump -u root --password=root [DATABASE] > backup.sql

然后使用下面的命令来恢复

    cat backup.sql | docker exec -i [CONTAINER_NAME] /usr/bin/mysql -u root --password=root [DATABASE]

对于 docker compose 启动的多个容器，可能因为宿主机器变化而导致 docker 容器的 id 有变化，可能在回复数据之后，还需要对数据库连接的地址进行修改才能完整的恢复。

## reference

- <https://stackoverflow.com/a/26339848/1820217>
- <https://stackoverflow.com/a/39125414/1820217>
- <https://gist.github.com/spalladino/6d981f7b33f6e0afe6bb>
