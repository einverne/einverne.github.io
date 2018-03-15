---
layout: post
title: "树莓派中安装 Docker 及 docker compose"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, respberry-pi, docker, docker-compose]
last_updated: 
---

仅仅作为记录，为了不让树莓派吃灰。主要参考官网[这篇文章](https://www.raspberrypi.org/blog/docker-comes-to-raspberry-pi/)。

Docker 的好用程度已经不比多说，经过这两年的发展已经非常成熟，还记得一年前买的书已经跟不上Docker的发展了，所以这里还是推荐 Docker 的官方文档，要比市面上存在所有书籍要详细。不过要是想要了解 Docker 的内部技术还是有不少好书可以参考。跑偏了，回到正题。

## 安装
Docker 官方[已经支持](https://github.com/docker/docker/pull/24815) Raspbian Jessie，所以可以直接安装：

    curl -sSL https://get.docker.com | sh

Docker client 只能被 root 或者 docekr group 中的用户使用，所以将 pi 用户添加到 `docker` 用户组：

    sudo usermod -aG docker pi

## 使用
如果拉取了 `busybox` 镜像，可能会发现工作不正常，这只是因为有些镜像是为了 PC 或者 `x86_64` 架构设计的，可能未来版本会修复，所以应该使用那些设计为了在 ARM 上运行的镜像，目前 Docker 团队维护了一小部分镜像，可以在[arm32v6](https://hub.docker.com/r/arm32v6)这个用户下找到。

可以使用 `arm32v6/alpine` 作为基础镜像，同样也可以使用 [Resin.io](http://resin.io/) 制作的镜像，该镜像被用在了[当前](https://github.com/docker/docker/blob/master/contrib/builder/deb/armhf/raspbian-jessie/Dockerfile) Docker 中，这是一个轻量版本的 Raspberry Jessie。 

### 制作镜像
比如说想要制作一个在树莓派上能够跑的镜像，可以以 `resion/rpi-raspbian` 作为基础镜像

    FROM resin/rpi-raspbian:latest
    ENTRYPOINT []

    RUN apt-get update && \
        apt-get -qy install curl ca-certificates

    CMD ["curl", "https://docker.com"]

或者也可以

    FROM arm32v6/alpine:3.5

    RUN apk add --no-cache curl ca-certificates

    CMD ["curl", "https://docker.com"]


build 命令 

    docker build -t curl_docker .
    docker run curl_docker

如果不怎么使用 Raspberry Pi 连接显示器，或者不怎么使用 GPU，可以限制 gpu 内存的占用，修改 `/boot/config.txt` 添加下面一行：

    gpu_mem=16
    

## reference

- <https://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/>
