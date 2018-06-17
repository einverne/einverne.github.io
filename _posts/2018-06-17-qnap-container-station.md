---
layout: post
title: "威联通折腾篇四：Container Station"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, container, docker, linux, ]
last_updated:
---

威联通上有一个 Container Station 的应用，可以直接用官方的 App Center 中下载安装，这其实就是一个 Docker 本地环境，如果[熟悉 Docker](/post/2017/07/docker-introduction.html) 使用，那么其实都直接可以 ssh 登录 NAS 然后完全使用命令行来操作。

不过既然威联通提供了一个直观的界面，那么久来使用看看。官方的例子中有一个 GitLab，我的体验来看是非常完美的，几乎就是一键下载部署，即使不了解容器，也不知道 Docker 内部怎么实现，也能够快速的搭建好 GitLab 的服务。威联通 Container Station 中自带很多的服务，比如这个 GitLab，还有 WordPress, MySQL，CentOS, Ubuntu，甚至还有 TensorFlow, Caffe 等等。如果这些还不能满足需求，其实威联通是默认使用的 Docker Hub 的 registry，甚至用户也可以自定义 docker registry，只要能够得到镜像，威联通就能够跑起来，本质上他就是一台虚拟的 Linux 嘛。

比如我使用默认的设置创建的 GitLab 服务，在编辑的时候威联通直接展示给我了一个 Docker compose 文件，里面的配置都很详细。

    gitlab:
      environment:
        DEBUG: 'false'
        GITLAB_PORT: 10080
        GITLAB_SECRETS_DB_KEY_BASE: qcs-gitlab-app
        GITLAB_SECRETS_OTP_KEY_BASE: qcs-gitlab-app
        GITLAB_SECRETS_SECRET_KEY_BASE: qcs-gitlab-app
        GITLAB_SSH_PORT: 10022
      image: sameersbn/gitlab:10.0.4
      links:
      - redis:redisio
      - postgresql:postgresql
      ports:
      - 10080:80
      - '10022:22'
      restart: always
    postgresql:
      environment:
        DB_EXTENSION: pg_trgm
        DB_NAME: gitlabhq_production
        DB_PASS: password
        DB_USER: gitlab
      image: sameersbn/postgresql:9.6-2
      restart: always
    redis:
      command:
      - --loglevel warning
      image: sameersbn/redis:latest
      restart: always


## reference

- [如何使用 Container Station](https://gtk.pw/AwAHB)
