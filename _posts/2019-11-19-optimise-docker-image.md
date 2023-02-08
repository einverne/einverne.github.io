---
layout: post
title: "优化 Docker 镜像大小"
aliases: "优化 Docker 镜像大小"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, docker-image, ]
last_updated:
---

优化 Docker 镜像文件的大小可以：

- 减少构建时间
- 节省存储空间和带宽
- 减少安全隐患
- 提高部署速度

## 层

Docker 镜像由很多层组成（最多 127 层），依赖很多底层基础，比如文件系统，写时复制，联合挂载等等，每创建一层都会相应地增加一些体积。

## 优化基础镜像

使用 Alpine 作为基础镜像。

`gcr.io/google_containers/pause-amd64:3.1` 镜像仅有 742KB。

### scratch 镜像

scratch 是一个空镜像，只能用于构建其他镜像，比如你要运行一个包含所有依赖的二进制文件，如 Golang 程序，可以直接使用 scratch 作为基础镜像。Google pause 镜像 Dockerfile：

    FROM scratch
    ARG ARCH
    ADD bin/pause-${ARCH} /pause
    ENTRYPOINT ["/pause"]

Google pause 镜像使用了 scratch 作为基础镜像，这个镜像本身是不占空间的，使用它构建的镜像大小几乎和二进制文件本身一样大，所以镜像非常小。当然在我们的 Golang 程序中也会使用。对于一些 Golang/C 程序，可能会依赖一些动态库，你可以使用自动提取动态库工具，比如 ldd、linuxdeployqt 等提取所有动态库，然后将二进制文件和依赖动态库一起打包到镜像中。

### busybox 镜像

scratch 是个空镜像，如果希望镜像里可以包含一些常用的 Linux 工具，busybox 镜像是个不错选择，镜像本身只有 1.16M，非常便于构建小镜像。

## 串联 Dockerfile 指令

减少 RUN 指令

应该把多个命令串联合并为一个 RUN（通过运算符 && 和 / 来实现），每一个 RUN 要精心设计，确保安装构建最后进行清理，这样才可以降低镜像体积，以及最大化的利用构建缓存。

下面是一个优化前 `Dockerfile`：

    FROM ubuntu

    ENV VER     3.0.0
    ENV TARBALL http://download.redis.io/releases/redis-$VER.tar.gz
    # ==> Install curl and helper tools...
    RUN apt-get update
    RUN apt-get install -y  curl make gcc
    # ==> Download, compile, and install...
    RUN curl -L $TARBALL | tar zxv
    WORKDIR  redis-$VER
    RUN make
    RUN make install
    # ==> Clean up
    WORKDIR /
    RUN apt-get remove -y --auto-remove curl make gcc
    RUN apt-get clean
    RUN rm -rf /var/lib/apt/lists/*  /redis-$VER
    CMD ["redis-server"]

构建镜像，名称叫 test/test:0.1。

我们对 `Dockerfile` 做优化，优化后 `Dockerfile`：

    FROM ubuntu
    ENV VER     3.0.0
    ENV TARBALL http://download.redis.io/releases/redis-$VER.tar.gz
    RUN echo "==> Install curl and helper tools..."  && \
        apt-get update                      && \
        apt-get install -y  curl make gcc   && \
        echo "==> Download, compile, and install..."  && \
        curl -L $TARBALL | tar zxv  && \
        cd redis-$VER               && \
        make                        && \
        make install                && \
        echo "==> Clean up..."  && \
        apt-get remove -y --auto-remove curl make gcc  && \
        apt-get clean                                  && \
        rm -rf /var/lib/apt/lists/*  /redis-$VER
    CMD ["redis-server"]

构建镜像，名称叫 test/test:0.2。

对比两个镜像大小：

    docker images
    REPOSITORY       TAG           IMAGE ID            CREATED             SIZE
    test/test        0.2         58468c0222ed        2 minutes ago       98.1MB
    test/test        0.1         e496cf7243f2        6 minutes ago       307MB

将多条 RUN 命令串联起来构建的镜像大小是每条命令分别 RUN 的三分之一。

为了应对镜像中存在太多镜像层，Docker 1.13 版本以后，提供了一个压扁镜像功能，即将 `Dockerfile` 中所有的操作压缩为一层。这个特性还处于实验阶段，Docker 默认没有开启，如果要开启，需要在启动 Docker 时添加 `-experimental` 选项，并在 Docker build 构建镜像时候添加 `--squash` 。不推荐使用这个办法，请在编写 `Dockerfile` 时遵循最佳实践编写，不要试图用这种办法去压缩镜像。
