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

## 镜像备份
这里说的备份指的是直接从本地备份镜像文件，可以使用 [docker save](https://docs.docker.com/engine/reference/commandline/save) 命令将镜像打包成 tar 文件，之后可以使用 [docker load](https://docs.docker.com/engine/reference/commandline/load/) 命令来恢复。

## 容器备份
备份容器有不同的方法：

- 通过 [docker commit] 命令来提交一个基于当前容器状态的新镜像
- 使用 [docker export] 命令来将容器导出到系统文件并压缩成 tar，之后可以根据该 tar 文件使用 [docker import](https://docs.docker.com/engine/reference/commandline/import/) 来创建新的镜像

需要注意的是所有的命令都只会备份容器 layered file system ，**不包括** 挂载的数据卷 Volumes

## 备份 data 数据卷

[Docker user guide](https://docs.docker.com/engine/tutorials/dockervolumes/#backup-restore-or-migrate-data-volumes) 中有非常详细的知道，如何备份数据卷，这样就可以在新容器启动时使用备份好的数据。当备份 data volume 时，需要先关闭容器。

## reference

- <https://stackoverflow.com/a/26339848/1820217>
