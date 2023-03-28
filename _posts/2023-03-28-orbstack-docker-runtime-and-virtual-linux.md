---
layout: post
title: "macOS 上轻便的 Docker 容器以及 Linux 运行环境"
aliases:
- "macOS 上轻便的 Docker 容器以及 Linux 运行环境"
tagline: ""
description: ""
category: 产品体验
tags: [orbstack, docker, macos, linux, virtual-machine, virtual-box]
create_time: 2023-03-28 09:18:13
last_updated: 2023-03-28 09:18:13
---

今天早上在 Twitter 上连续看到三个人在同一时间推荐了一款在 macOS 上运行的 Docker 容器和 Linux 虚拟机 ---- [OrbStack](https://orbstack.dev/) 。

GitHub：<https://github.com/orbstack>

而 macOS 上的 Docker Desktop 原本就是饱受诟病，慢，重，资源消耗巨大。 OrbStack 的出现就是为了解决这个问题。

macOS 从 2020 年发布 Big Sur 开始，提供了虚拟化的框架，开发者可以在 macOS 上构建基于 Intel/ARM 的 Linux 环境。macOS 上的 [[Parallels Desktop]] 和 [[Docker Desktop]] 都在使用这个框架，但这二者都比较重。

## OrbStack 使用

下载安装的过程特别简单。可以看到如下的界面可以在 macOS 上快速，轻便的创建 Docker 容器和 Linux 环境。

![OfKw](https://photo.einverne.info/images/2023/03/28/OfKw.png)

执行一下测试的容器:

```
docker run -it -p 80:80 docker/getting-started
```

然后再访问 <http://localhost/> 即可看到最基础的 Docker 教程。

在这个界面中也可以对容器进行简单的管理。
![Ou7c](https://photo.einverne.info/images/2023/03/28/Ou7c.png)

在系统的资源管理器中可以看到 OrbStack 几乎不怎么占用 CPU 和内存。

CPU 消耗

![OS4r](https://photo.einverne.info/images/2023/03/28/OS4r.png)

内存消耗

![O4Rd](https://photo.einverne.info/images/2023/03/28/O4Rd.png)

## 相关命令

OrbStack 也提供了一些管理命令 `orbctl`，可以直接在命令行使用。

```
orbctl help
```

OrbStack 在创建了 Ubuntu 等 Linux 镜像之后也可以使用 SSH 连接

```
orb -m ubuntu -u root
orb -m ubuntu -u root uname -a
```

`orb` 命令还提供了其他一些特性，比如可以在虚拟机中 push 或 pull 来传输文件。

## 目前的一些局限

OrbStack 虚拟的 Linux 是不支持 GUI 的，不过这也不妨碍，我想大部分开发应该只会使用命令行去管理 Linux 运行环境吧。大致猜想 OrbStack 应该只是用 Docker 开启了一个 Linux 的容器，所以不支持图形化界面也是可以理解的。

## 总结

总之如果你之前饱受 Docker Desktop 慢的问题困扰，或者之前经常使用 Virtual Box，[[VMware Fusion]] 等虚拟化工具在 macOS 上虚拟化 Linux 运行环境，不妨来试试这一款轻量的 OrbStack。
