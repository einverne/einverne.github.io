---
layout: post
title: "Docker 网络与容器互联"
aliases: "Docker 网络与容器互联"
tagline: ""
description: ""
category: 学习笔记
tags: [docker, network, ip,]
last_updated:
---

简单整理一下 Docker 中 network 子命令，以及 docker 中相关 network 方面的内容。

在安装完 Docker 后，使用 `ifconfig -a` 查看可以看到多出一个虚拟的 docker0 接口，这个接口是 Docker 默认的网关地址。

## 不同 Network driver 介绍
Docker 容器默认有三种连接方式：

- bridge，网桥模式
- host，宿主机模式，容器直接使用宿主机的网络
- none

### bridge 模式
Docker 默认会生成一个 `docker0` 网桥，如果不指定，默认创建的容器都会默认走此网桥，使用 bridge 模式联网。默认 bridge 会产生 docker0 的虚拟接口，在宿主机上可以使用 `ifconfig -a` 来查看，一般的网关地址是类似 `172.17.0.1` 这样的私有地址，所有的容器都会使用这个地址作为网关，容器的 IP 地址会从 `172.17.0.2` 到 `172.17.0.254` 这个范围 IP 段划分。

- 此模式下，容器可以单向连接外网，外网或宿主要访问容器则需要容器映射端口。
- 连接同一个 docker0 网桥的容器之间可以彼此通过 IP 直接通信，无需 NAT ，但不建议直接使用各个容易的 IP，建议使用容器的 Link 机制 ( docker run 的 link 和 name 属性) 来让容器互联 ( link 的容器会作为主机名记录添加到容器的 /etc/hosts 中)。

### host 模式
host 模式等同于容器**直接使用物理机的网络**，宿主机的 IP 就是容器的 IP，端口也可以直接调用。

- 此模式的缺点是容易造成宿主机和容器端口冲突，而且降低了安全性，在有多个容器的情况下使用也不方便。
- Mac OS 下，host 是一个运行精简版 Linux (boot2docker) 的 virtualbox，在 Ubuntu 上，host 就是物理机


### none
none 模式，也就是容器默认不联网的模式。通常会合自定义网络的容器一起使用。`non` 在 swarm 服务中不可用。

### macvlan
还有两种更高级的网络模式，overlay 和 macvlan，分别用于跨宿主机的容器通信和给每个容器分配一个 mac 地址。

macvlan 网络允许给容器分配一个 MAC 地址，这样在网络中就可以以物理设备存在。Docker daemon 会通过 Mac 地址将流量导给容器。在处理一些历史遗留应用，期望直接使用物理网络的场景非常适合使用 `macvlan`.

### overlay
Overlay 网络会连接多个 Docker daemon，开启 swarm 服务来相互通信。也可以通过 overlay 网络来帮助 swarm 服务和独立容器之间的通信，或者帮助两个独立的容器，或者帮助不同的 Docker daemons。通过 overlay 就不需要系统级别在不同容器中的路由了。

Docker 本身也有一个 link 指令，可以用于连接两个容器，但这命令的缺点是只能单向连接，也就是 A 和 B 两个容器，只能 A 访问 B 或者 B 访问 A，做不到 AB 之间直接同时互访。

## 使用

创建新网络

	docker network create network-name

	docker network create -d bridge network-name

使用 `ls` 查看：

	docker network ls

审查 network 信息：

	docker network inspect network-id

删除网络：

	docker network rm name
	docker network rm network-id

创建时指定 IP 段：

	docker network create --subnet=192.168.1.0/24 net-name

创建名为 net-name 的网络，默认 bridge，IP 段是： 192.168.1.0 ~ 192.168.1.255


## reference

- <https://docs.docker.com/network/>
