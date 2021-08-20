---
layout: post
title: "Docker 容器日志相关命令"
aliases: "Docker 容器日志相关命令"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, logs, linux,]
last_updated:
---

系统运行一段时间之后难免容器会出现问题，出现问题并不可怕，可怕的是不知道问题出现在哪里，这个时候查看当前容器运行的日志就能够排查出一些问题。

在之前的[文章](/post/2017/07/docker-introduction.html) 中，学会了如何创建，查看，移除等等管理容器的方法，其实查看日志也和这些方法类似。

比如要查看容器所有运行的日志可以使用，下面的 containerId 都可以被替换为容器的名字：

    docker logs [containerId]

如果要持续观察容器的日志输出，可以使用 `-f` 或者 `--follow` 参数

    docker logs -f [containerId]

但是这个命令在不同系统上，有的时候会打印出全部的日志，就和没加 `-f` 参数一样，所以有的时候要查看日志最末尾几行可以使用 `--tail`

    docker logs --tail 100 [containerId]

如果想要查看某个时间之后的日志，可以使用 `--since`

    docker logs --since 2018-05-01 [containerId]

同理如果要查看直到某个时间之前的日志也可以使用 `--until`

    docker logs --until 2018-05-01 [containerId]

