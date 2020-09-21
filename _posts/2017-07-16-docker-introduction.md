---
layout: post
title: "Docker 入门"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, linux,  容器 , 虚拟化 , ]
last_updated:
---

Docker 是一个能够把开发环境的应用程序自动部署到容器的开源引擎。该引擎的目标是提供一个轻量、快速的环境，能够运行开发者的程序，并方便高效地将程序从开发者的笔记本部署到测试环境，然后再部署到生产环境。

Docker 是一个开源的应用容器引擎，基于 Go 语言 并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口，更重要的是容器性能开销极低。

Docker 使用客户端 - 服务端 C/S 架构，使用远程 API 来管理和创建 Docker 容器。

Docker 容器通过 Docker 镜像来创建。容器与镜像的关系类似于面向对象编程中的对象与类。


Docker 官网：<http://www.docker.com>

Github Docker 源码：<https://github.com/docker/docker>


名词 | 解释
-----|-------
Docker 镜像 (Images)    |Docker 镜像是用于创建 Docker 容器的模板。可以使用 docker images 来查看镜像
Docker 容器 (Container) |容器是独立运行的一个或一组应用。可以使用 docker ps -a 来查看 container
Docker 客户端 (Client) |Docker 客户端通过命令行或者其他工具使用 Docker API (https://docs.docker.com/reference/api/docker_remote_api) 与 Docker 的守护进程通信。
Docker 主机 (Host)     |一个物理或者虚拟的机器用于执行 Docker 守护进程和容器。
Docker 仓库 (Registry)   |Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。 Docker Hub(https://hub.docker.com) 提供了庞大的镜像集合供使用
Docker Machine      |Docker Machine 是一个简化 Docker 安装的命令行工具，通过一个简单的命令行即可在相应的平台上安装 Docker，比如 VirtualBox、 Digital Ocean、Microsoft Azure。


## 安装

### Ubuntu

Docker 要求 Ubuntu 系统的内核版本高于 3.10 ，查看本页面的前提条件来验证你的 Ubuntu 版本是否支持 Docker。
通过 uname -r 命令查看你当前的内核版本。通过如下命令安装

    wget -qO- https://get.docker.com/ | sh

启动

    sudo service docker start

启动测试运行 hello-world

    docker run hello-world

### Raspberry Pi 树莓派

Hypriot team 提供了一个可安装的 [Package](http://blog.hypriot.com/downloads/)，可以不必自己编译安装：

    $ curl -ks https://packagecloud.io/install/repositories/hypriot/schatzkiste/script.deb.sh | sudo bash
    $ sudo apt-get install docker-hypriot=1.10.3-1
    $ sudo sh -c 'usermod -ag docker $sudo_user'
    $ sudo systemctl enable docker.service

安装完后

    pi@raspberrypi ~ $ sudo docker info
    Containers: 0
     Running: 0
     Paused: 0
     Stopped: 0
    Images: 0
    Server Version: 1.10.3
    Storage Driver: overlay
     Backing Filesystem: extfs
    Execution Driver: native-0.2
    Logging Driver: json-file
    Plugins:
     Volume: local
     Network: bridge null host
    Kernel Version: 4.1.19-v7+
    Operating System: Raspbian GNU/Linux 8 (jessie)
    OSType: linux
    Architecture: armv7l
    CPUs: 4
    Total Memory: 925.8 MiB
    Name: raspberrypi
    ID: UMZZ:ZYZY:TLB2:DKK7:GY6V:SYW3:JZZD:7L4X:JNXY:HNRQ:PFFO:K4X5
    Debug mode (server): true
     File Descriptors: 11
     Goroutines: 20
     System Time: 2017-07-16T14:07:39.946162928Z
     EventsListeners: 0
     Init SHA1: 0db326fc09273474242804e87e11e1d9930fb95b
     Init Path: /usr/lib/docker/dockerinit
     Docker Root Dir: /var/lib/docker
    WARNING: No memory limit support
    WARNING: No swap limit support
    WARNING: No oom kill disable support
    WARNING: No cpu cfs quota support
    WARNING: No cpu cfs period support

查看版本

    pi@raspberrypi ~ $ sudo docker version
    Client:
     Version:      1.10.3
     API version:  1.22
     Go version:   go1.4.3
     Git commit:   20f81dd
     Built:        Thu Mar 10 22:23:48 2016
     OS/Arch:      linux/arm

    Server:
     Version:      1.10.3
     API version:  1.22
     Go version:   go1.4.3
     Git commit:   20f81dd
     Built:        Thu Mar 10 22:23:48 2016
     OS/Arch:      linux/arm

参考[文档](https://github.com/umiddelb/armhf/wiki/Get-Docker-up-and-running-on-the-RaspberryPi-(ARMv6)-in-four-steps-(Wheezy)), 有关树莓派从 wheezy
 升级到 Debian 8 Jessie 的内容也可以参考该链接

    $ sudo sed -i 's/wheezy/jessie/' /etc/apt/sources.list
    $ sudo sed -i 's/wheezy/jessie/' /etc/apt/sources.list.d/raspi.list
    $ sudo apt-get update && sudo apt-get -y upgrade # answer 'y' to upcoming questions
    $ sudo apt-get -y dist-upgrade # answer 'y' to upcoming questions
    $ sudo init 6
    $ sudo apt-get -y autoremove
    $ sudo apt-get -y purge $(dpkg -l | awk '/^rc/ { print $2 }')
    $ sudo init 6

### Linux Mint

Linux Mint 下安装的时候使用 Ubuntu 下那种方式的时候没有安装成功，网上查说源中的内容有些问题，使用自己的添加的 Repository 才可以：

    # First import the GPG key

    sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 \
          --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

    # Next, point the package manager to the official Docker repository

    sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'

    # Update the package database

    sudo apt update

    # 安装必要的包
    sudo apt install linux-image-generic linux-image-extra-virtual

    # 安装 docker
    sudo apt install docker-engine

最后安装成功

    sudo docker version
    [sudo] password for einverne:
    Client:
     Version:      17.05.0-ce
     API version:  1.29
     Go version:   go1.7.5
     Git commit:   89658be
     Built:        Thu May  4 22:10:54 2017
     OS/Arch:      linux/amd64

    Server:
     Version:      17.05.0-ce
     API version:  1.29 (minimum version 1.12)
     Go version:   go1.7.5
     Git commit:   89658be
     Built:        Thu May  4 22:10:54 2017
     OS/Arch:      linux/amd64
     Experimental: false

## 体验

镜像是 Docker 的三大组件之一，Docker 官方托管了一个镜像的 [Hub](https://hub.docker.com/)，可以从上面获取镜像。

可以使用 `sudo docker search []` 来搜索镜像

### 获取镜像

可以使用 `docker pull` 从仓库中获取所需要的镜像，比如从官方仓库下载 ubuntu 12.04 的镜像：

    sudo docker pull ubuntu:12.04

实际该命令相当与 `sudo docker pull registry.hub.docker.com/ubuntu:12.04`，即从注册的服务器的 Ubuntu Repository 中拉取 12.04 的镜像。

在国内拉去镜像的速度一般不是很快，可以使用官方的镜像加速，其他网易，阿里都有提供，但是建议还是使用官方[镜像](https://www.docker-cn.com/registry-mirror)。

    docker pull registry.docker-cn.com/myname/myrepo:mytag

比如说：

    docker pull registry.docker-cn.com/library/ubuntu:16.04

[Docker Store](https://store.docker.com/) 是发现 Docker 镜像的新地方。

### 查看镜像

当拉取完成之后可以使用 `sudo docker images` 来查看本地的镜像列表

	$ sudo docker images
	REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
	nginx               latest              1e5ab59102ce        6 days ago          108MB
	redis               latest              4e482b286430        3 months ago        99MB

列出的信息中，可以看到几个字段

- REPOSITORY 镜像名字，比如 nginx
- TAG 镜像的标记， latest 或者特定版本号
- IMAGE ID 镜像的唯一标示
- CREATED
- SIZE

默认 `docker images` 只会显示顶层镜像，如果希望显示包含中间层镜像在内的所有镜像，需要添加 `-a` 参数

	docker images -a

`docker images` 命令有 `-f` 参数用来过滤，比如列出 虚悬镜像 dangling image 可以使用

	$ sudo docker images -f dangling=true
	REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
	<none>              <none>              8e7492c7cb6a        28 minutes ago      122MB

虚悬镜像是指因为官方镜像维护，发布新版本之后有些本地镜像名被取消，虚悬镜像已经没有价值，可以随意删除

	sudo docker rmi $(sudo docker images -q -f dangling=true)

`docker images` 支持更多的过滤器语法，比如，希望看到 `ubuntu:14.04` 之后建立的镜像，可以

	sudo docker images -f since=ubuntu:14.04

想看某个时间之前的镜像，可以把 `since` 改成 `before`

也可以自定输出格式

	sudo docker images --format "\{\{.ID\}\}: \{\{.Repository\}\}"
	sudo docker images --format "table \{\{.ID\}\}\t\{\{.Repository\}\}\t\{\{.Tag\}\}"

本地镜像保存在 Docker 宿主机 `/var/lib/docker` 目录下，每个镜像都保存在 Docker 所采用的存储驱动目录下，比如 aufs 或者 devicemapper。 可以在 `/var/lib/docker/containers` 目录下看到所有的容器。

### 运行镜像

可以运行本地镜像

    sudo docker run -t -i ubuntu:12.04 /bin/bash

	sudo docker run --name=webserver –p 8080:80 –d nginx


- `run` 命令用来创建一个 docker container
- 如果有 `-p` 参数，用来将 `-p local-machine-port:internal-container-port` 暴露出来，比如 8080:80 将内部的 80 端口映射到 8080 端口
- `-d` 用来使用 daemon 后台运行


### 查看当前运行的容器

当运行某一个镜像时，docker 会自动创建一个 container 容器在，该容器中运行该镜像，可以使用 `sudo docker ps -a` 来查看当前正在运行的容器。可以使用 `docker stop [ContainerId]` 来终止一个容器的运行。

### 终止容器
使用 `docker stop` 来终止一个运行中的容器，当前正在运行或者终止的容器可以使用 `sudo docker ps -a` 来查看。

处于终止状态的容器，可以通过 `docker start` 命令来重新启动。

此外，`docker restart` 命令会将一个运行态的容器终止，然后再重新启动它。

`docker kill <ID>` 可以用来强制停止一个容器

### 进入容器
但在 `docker run` 时使用 `-d` 参数时，容器会进入后台，可以使用 `attach` 来进入容器

	sudo docker attach <containerid>

### 移除容器和镜像

只有当容器停止运行时才可以将其删除，确认容器已经停止，使用 `sudo docker rm [Container Id]` 来删除一个容器， 使用 `sudo docker rmi [ImageId]` 来删除一个本地的镜像。

删除所有容器，可以使用 `docker rm $(docker ps -a -q)` ， `-q` 参数表示只列出容器 ID。


### 在容器和宿主机之间传递文件
可以使用 `docker cp` 命令来在容器和宿主机之间拷贝文件。

	docker cp foo.txt mycontainer:/foo.txt
	docker cp mycontainer:/foo.txt foo.txt

## 其他参考链接

- <https://github.com/wsargent/docker-cheat-sheet/tree/master/zh-cn>
- <https://peihsinsu.gitbooks.io/docker-note-book/content/what-is-container.html>
