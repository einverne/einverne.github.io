---
layout: post
title: "威联通折腾篇四：Container Station 运行 Docker 容器"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, container, docker, linux, ]
last_updated:
---

威联通上有一个 Container Station 的应用，可以直接用官方的 App Center 中下载安装，这其实就是一个 Docker 本地环境，如果[熟悉 Docker](/post/2017/07/docker-introduction.html) 使用，那么其实都直接可以 ssh 登录 NAS 然后完全使用命令行来操作。

不过既然威联通提供了一个直观的界面，那么久来使用看看。官方的例子中有一个 GitLab，我的体验来看是非常完美的，几乎就是一键下载部署，即使不了解容器，也不知道 Docker 内部怎么实现，也能够快速的搭建好 GitLab 的服务。威联通 Container Station 中自带很多的服务，比如这个 GitLab，还有 WordPress, MySQL，CentOS, Ubuntu，甚至还有 TensorFlow, Caffe 等等。如果这些还不能满足需求，其实威联通是默认使用的 Docker Hub 的 registry，甚至用户也可以自定义 docker registry，只要能够得到镜像，威联通就能够跑起来，本质上他就是一台虚拟的 Linux 嘛。

## 使用默认配置创建 GitLab
官方例子，这边不多说了。App 为一群 Docker 镜像文件的集合，目的是提供完整的服务，如 Application+Database，即一个快速的安装包。以 GitLab app 为例，它内含了 GitLab 主程序、PostgreSQL 和 Redis 三个镜像文件。

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

GitLab 实在是太占内存了

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/28997918018/in/dateposted/" title="docker gitlab"><img src="https://farm2.staticflickr.com/1727/28997918018_68b8562649_b.jpg" alt="docker gitlab"></a>

## 使用自定义镜像安装容器
Docker hub 中有无数的应用可供选择，这边以 GitLab 的代替品 Gogs 为例，首先在 Container Station -> 创建 -> 搜索 gogs，选择 Docker Hub 然后从中选择 `gogs/gogs` 下载镜像。

等待镜像完成之后，创建容器，在高级中选择 NAT 模式，端口映射 10080 和 10022 ，为了不和宿主 NAS 端口产生冲突。然后我习惯创建一个共享文件夹，比如 gogs 来挂载 gogs 的文件内容，以便于快速访问。然后完成创建。

在创建完成，得到 IP 地址之后，点击进入然后开始配置，这边我容器的网关地址是 10.0.3.1，这个地址可以在 Container 界面 -> 属性中找到，或者登录 NAS，然后运行 `docker inspect container-name | grep "Gateway"` 来查看(查看任意一个容器的)，因为我启用了 NAS 上的 MySQL(MariaDB) 服务，所以可以直接可以使用 `10.0.3.1:3306` 作为数据库地址。然后 Gogs 的其他配置照着填写即可。

完成安装之后对比一下和 GitLab 的内存占用会发现，GitLab 简直就是巨兽。

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/28997933668/in/dateposted/" title="qnap docker gogs"><img src="https://farm1.staticflickr.com/887/28997933668_f8aecb984c_b.jpg" alt="qnap docker gogs"></a>

更多的 Container Station 的使用可以参考下面官方的链接，Docker 真的很好用。

## reference

- [如何使用 Container Station](https://gtk.pw/AwAHB)
