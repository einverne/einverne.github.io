---
layout: post
title: "使用 Docker hub 及其他镜像站点加速下载"
tagline: ""
description: ""
category: 经验总结
tags: [docker, google, cloud, images]
last_updated:
---

有很多网站可以托管 Docker 镜像， Docker 官方站点 hub.docker.com 速度在国内访问不是很快，不过幸好国内有公司做了 hub.docker.com 的镜像，通过 CDN 优化了下载。Docker Hub 为用户提供无限数量的公开镜像托管服务，但是仅提供一个私有镜像托管。Docker Hub 上镜像分为两类，一类为官方镜像，ubuntu，redis 等等由权威三方开发和维护通过 Docker 官方认证，另一类就是普通用户镜像。

## 使用 registry mirrors
手动修改 Docker 配置 `/etc/docker/daemon.json` 文件增加 docker registry 镜像：

    {
        "registry-mirrors": [
            "加速地址"
        ],
        "insecure-registries": []
    }

修改其中的 `加速地址`，不同的服务提供的镜像加速地址不一样。记得修改配置之后 `sudo /etc/init.d/docker restart` 重启 docker。下面就总结一下国内的 Docker 镜像站点。

修改后使用 `sudo docker info` 来检查配置是否生效。

如果下方公开的镜像速度不佳的话，尝试阿里云的镜像，需要开发者账号。

### Docker cn
Docker 官方提供的镜像：

	https://registry.docker-cn.com

### Azure
Azure [中国镜像](https://github.com/Azure/container-service-for-azure-china/blob/master/aks/README.md#22-container-registry-proxy) 包括 Docker Hub、GCR、Quay。

	https://dockerhub.azk8s.cn

### 网易

	https://hub-mirror.c.163.com

### 腾讯
腾讯只能在腾讯云上使用：

	https://mirror.ccs.tencentyun.com

### 科大镜像 ustc
[科大](https://mirrors.ustc.edu.cn/help/dockerhub.html) 包括 Docker Hub、GCR、Quay。[^ustc]

	https://docker.mirrors.ustc.edu.cn

[^ustc]: https://lug.ustc.edu.cn/wiki/mirrors/help/docker

### 七牛
[七牛](https://kirk-enterprise.github.io/hub-docs/#/user-guide/mirror)

	https://reg-mirror.qiniu.com

### DaoCloud
DaoCloud [提供](https://www.daocloud.io/mirror#accelerator-doc) 的加速地址：

    http://6ce28dce.m.daocloud.io

这个地址不同用户看起开不一样，可以使用我的，也可以自己注册。

这个地址不知道是不是长久地址，不过失效，可以到他的官方[网站](http://6ce28dce.m.daocloud.io) 查看。

### Docker cn
也可以使用 Docker 官方提供的镜像

    https://registry.docker-cn.com

官网[地址](https://www.docker-cn.com/registry-mirror)

### 个人维护的镜像

[mritd](https://mritd.me/2017/03/21/private-maintenance-docker-mirror-registry/) 反向代理了主流的三大仓库（Docker Hub，gcr.io，quay.io）。

## docker registries
不得不说的 hub.docker.com，官方提供

### daocloud hub
这是国内 DaoCloud 公司提供的

- https://hub.daocloud.io/

### gcr.io
可以通过下面的链接查看 gcr.io 中存在镜像，类似于直接在 <https://hub.docker.com/> 中搜索查看。

- <https://console.cloud.google.com/gcr/images/google-containers/GLOBAL?location=GLOBAL&project=google-containers>

### 阿里云
这里是阿里云提供的镜像托管服务

- <https://dev.aliyun.com/search.html>

然后[有人](http://dockone.io/question/1216) 把 `gcr.io/google-containers` 下所有的 Docker 镜像都同步到了中央库

- <https://hub.docker.com/u/googlecontainer/>

更多的 registry 可以参考[这里](https://github.com/veggiemonk/awesome-docker#registry)

