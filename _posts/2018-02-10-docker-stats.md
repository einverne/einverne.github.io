---
layout: post
title: "监控 docker 运行数据 stats 命令"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, monitor, container, ]
last_updated: 
---

之前因为学习 Docker 也总结了一批[经常使用的 Docker 命令](/post/2017/07/docker-introduction.html) 然后回头过来看唯独漏掉了 Docker 监控的一块，一方面也是当时看的文档并没有覆盖到这个领域，另一方面也是最近看到 Google [cAdvisor](/post/2018/03/cadvisor.html) 才开始注意到 Docker 监控的命令。

## 使用

### 查看容器资源使用
直接运行，查看所有当前运行的 Docker 状态及资源消耗

    docker stats

该命令执行后会返回下列数据

- 容器ID，名字
- CPU及 MEM 使用率
- 内容使用量及限制
- NET I/O 网络IO
- BLOCk I/O 本地IO
- PIDs 进程ID

### 查看容器中进程情况
查看容器中启动的进程

    docker top [CONTAINER] [ps options] 

### 查看容器的日志
使用如下命令查看容器日志

    docker logs [OPTIONS] CONTAINER

使用参数 `-f` 来追踪打印未来的日志

    docker logs -f CONTAINER


