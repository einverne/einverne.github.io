---
layout: post
title: "使用 Rancher 管理 Kubernetes 集群"
aliases: 
- "使用 Rancher 管理 Kubernetes 集群"
tagline: ""
description: ""
category: 学习笔记
tags: [ rancher, docker, container, kubernetes, k8s, k3s ]
last_updated:
---

Rancher 是一个开源的容器管理平台，也是一个 Kubernetes 管理工具。Rancher 可以运行在任何公有云和私有云上。Rancher 的基础依赖只包括主机 CPU，内存，磁盘和网络资源。

Rancher 为容器化应用提供了基础设施，包括网络、存储、负载均衡、DNS 和安全模块等等。Rancher 可以运行在任何 Linux 主机上。

Rancher 支持主流的容器编排引擎，比如 [[Docker Swarm]]，[[Kubernetes]]， [[Mesos]]，还支持 Cattle 容器编排。

Rancher 不仅能够管理容器，还能管理 Kubernetes 集群。

## Rancher 解决了什么问题

- 降低了 Kubernetes 集群的部署门槛
- 统一管理，Rancher 实现了不同主机 Docker 资源的统一管理，支持分布式服务的发现，内置了健康检查
- 完整的**权限管理**，代替了 Kubernetes 自身的 Dashboard。Rancher 的权限管理采用 RBAC（基于角色的访问控制） 模式。用户或应用通过证书或服务名来表明身份，通过检查角色（Role，ClusterRole）来确认访问者权限。Rancher 集成了 LDAP，GitHub 等等多种认证方式
- **多集群管理**，用户可以通过很多方式搭建 Kubernetes 集群，可以是本机，也可以在公有云服务器上，也可以直接使用云厂商提供的服务。Rancher 可以将部署在不同地点，不同方式搭建的 Kubernetes 管理起来
- 简化应用部署，Kubernetes 提供了强大的容器编排 API，Kubernetes 部署应用时需要编写 `yaml` 并执行 `kubectl create -f`。Rancher 提供了统一的 UI 界面实现。
- 集群监控，日志收集，Rancher 通过集成主流的第三方组件实现对集群的监控报警和日志收集。

## Rancher 的构成

Rancher 主要由四部分组成：

- 基础设施编排
- 容器编排和调度
- 应用商店，提供了常用的应用
- 权限管理，提供了组织，角色，用户的管理

### 基础设施编排

Rancher 为容器化运行实现了一套灵活的基础设施，包括了网络，存储，负载均衡，DNS 和安全模块。

Rancher 的基础设施也是通过容器部署的，所以 Rancher 也可以非常简单的运行在任何 Linux 主机上。

### 容器编排和调度

Rancher 包含了当前全部流行的容器编排调度引擎，比如：Docker Swarm， Kubernetes 和 Mesos。同一个用户可以创建 Swarm 或者 Kubernetes 集群。并且可以使用原生的 Swarm 或者 Kubernetes 工具管理应用。

除了 Swarm，Kubernetes 和 Mesos 之外，Rancher 还支持自己的 Cattle 容器编排调度引擎。Cattle 被广泛用于编排 Rancher 自己的基础设施服务以及用于 Swarm 集群，Kubernetes 集群和 Mesos 集群的配置，管理与升级。

### 应用商店

Rancher 提供了一个由 Rancher 社区维护的应用商店，其中包括了一系列的流行应用。Rancher 的用户也可以创建自己的私有应用商店。

Rancher 的用户可以在应用商店里一键部署由多个容器组成的应用。用户可以管理这个部署的应用，并且可以在这个应用有新的可用版本时进行自动化的升级。

### 权限管理

Rancher 支持灵活的插件式的用户认证。支持 Active Directory，LDAP， Github 等 认证方式。 Rancher 支持在环境级别的基于角色的访问控制 (RBAC)，可以通过角色来配置某个用户或者用户组对开发环境或者生产环境的访问权限。

## Rancher 1.x vs Rancher 2.x

Rancher 1.x 目前已经不再更新了，Rancher 提供了最新的 2.x，在 1.x 的基础之上进行了重新设计。

## 术语 {#terminology}

- The Rancher server：用来图形化管理和提供 Kubernetes 集群。可以通过 Rancher 提供的友好的交互界面来管理下游的 Kubernetes。Rancher Server 会去管理 agent 该启动什么服务。
- Rancher Agent：用来执行具体工作的机器，容器运行在 Agent 上。
- RKE (Rancher Kubernetes Engine) ，是一个经过认证的 Kubernetes 发行版和 CLI/库，可以创建和管理一个 Kubernetes 集群。
- K3s (Lightweight Kubernetes) ，也是一个完全兼容的 Kubernetes 发行版。它比 RKE 更新，更容易使用，而且更轻量级，二进制大小不到 100MB。

## Rancher 和 k8s 的区别

k8s 全称是 [[Kubernetes]]，是一个开源的，容器管理平台。

而 Rancher 是一个开源的多集群 Kubernetes 管理平台，既可以管理本地 k8s 集群，也可以管理云端服务商提供的 k8s 集群。

## Rancher 和 k3s 的区别

[[k3s]] 是一个轻量级的 Kubernetes 发行版，旨在简化 Kubernetes 的部署和管理。包含一个二进制文件，可以在较小的资源和较低的要求下运行。支持常见的 Kubernetes 功能，例如 Pod 和 Service，提供容器运行时（Docker，CRI-O 和 containerd），内置负载均衡器，应用商店和 Helm 支持。

## Prerequisite

- 一台运行着 Linux 的机器，可以是笔记本，虚拟机或者是服务器
- 保持干净的系统，至少保证必须的端口，80，443 等没有被占用
- Linux kernel 需要在 3.10+
- 至少 1GB 内存
- 安装支持的 [Docker 版本](https://rancher.com/docs/rancher/v1.6/en/hosts/#supported-docker-versions) [Rancher2 要求](https://rancher.com/docs/rancher/v2.6/en/installation/requirements/installing-docker/)

更多的可以参考[官网](https://rancher.com/docs/rancher/v2.x/en/installation/requirements/)

Rancher 经历了版本变化，1.x 的版本镜像名为 `rancher/server` 而 2.x 的名字叫做 `rancher/rancher`。

## 安装 Rancher

直接使用 docker 命令启动：

```
docker run -d --restart=unless-stopped \
  --name rancher \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:v2.6.0
```

或者像我这样使用 [docker-compose](https://github.com/einverne/dockerfile/tree/master/rancher)，然后指定域名。

启动之后可以使用 `docker logs -f rancher` 来查看日志。当日志中显示 "succeeded, listening on port" 之后，可以访问 Rancher 的后台界面。

Rancher 2.6 安装的时候会在日志中打印密码，使用如下日志查看后台登录密码：

    docker logs rancher 2>&1 | grep "Bootstrap Password:"

获得密码之后可以访问 http://ip 来访问 Rancher 后台。

安装的过程中遇到:

> Waiting for server to become available: Get "https://127.0.0.1:6444

因为使用的是 Ubuntu 22.04 ，需要编辑 `/etc/default/grub`，然后添加:

```
GRUB_CMDLINE_LINUX="cgroup_memory=1 cgroup_enable=memory swapaccount=1 systemd.unified_cgroup_hierarchy=0"
```

然后执行:

```
sudo update-grub
sudo reboot
```

### 设置用户名和密码

上面的 Docker 监听了本地 80 端口，可以直接访问 <http://ip> 访问后台。

![](/assets/rancher-dashboard-20210825221813.png)

启动 Rancher 之后，管理后台默认是没有设置权限校验的，所以第一件事情就是增加用户和密码。

- 访问"ADMIN"菜单项
- Access Control
- 使用最简单的 Local Auth，即设置一个用户名和密码，然后点击“Enable Local Auth”按钮即可。

Rancher 支持多种权限控制方案，分别是：Active Directory、Azure AD、GitHub、Local Auth、OpenLDAP 和 SHIBBOLETH。可以根据自己的需求设置。

### 增加 Host 部署 Rancher Agent

访问 <http://ip:80/> ，或者如果你[像我一样使用 nginx-proxy](https://github.com/einverne/dockerfile/tree/master/rancher)，使用域名，那么可以访问你设置的域名。

然后依次点击菜单栏中的 “INFRASTRUCTURE”->“Host”->“Add host”。然后执行页面中的命令，即可将 Host 添加到 Server 端管理。

![](/assets/rancher-hosts-add-host.png)

主要注意的是这个主机地址需要能够被 Rancher 访问到，也就是不能在防火墙或局域网中。

在 host-1 上执行如下类似语句：

    sudo docker run --rm --privileged -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/rancher:/var/lib/rancher rancher/agent:v1.2.11 https://xxx.einverne.info/v1/scripts/13A12CE9XXXXXX:1609372800000:9bQkuDTsG0x7U4MXXXXX

就能看到 host-1 已经被加入到 Hosts 里了。

继续可以添加，在 host-2 上运行，把 host-2 也加入到 Hosts 里。

一旦把 Host 添加到了 Rancher，就可以在界面中看到该主机上的所有容器，即使这些容器可能是通过命令行创建的。

并且一旦把 Host 添加到 Rancher 进行管理，Rancher 会自动创建一个私有网段，允许不同主机上的容器可以进行通信。

如果要使用 Rancher 的网络，可以增加标签：

    docker run -it --label io.rancher.container.network=true ubuntu:14.04.2

### 添加服务

![](/assets/rancher-add-stack-20210825231706.png)

点击图中的 Define a Service

### 运行容器

在主机上运行一个 tomcat 容器。点击 Agent 1 上的 Add Container 按钮，如下填入参数：

> Name：tomcat  
> Select Image：tomcat:8.0.30-jre8  
> Public Host Port：8080  
> Private Container Port：8080

然后点击最下方的 Create 按钮。

过一段时间，便能看到如下的容器已经启动完成了。

## 删除 Rancher Agent

```
docker rm -f $(docker ps -qa)
docker rmi -f $(docker images -q)
docker volume rm $(docker volume ls -q)
```

## 延展阅读

- [KubeSphere](https://kubesphere.com.cn/)

### 参考文档

- [http://www.google.com](http://www.google.com/)
- [http://qinghua.github.io/rancher/](http://qinghua.github.io/rancher/)
- [http://docs.rancher.com/rancher/v1.5/en](http://docs.rancher.com/rancher/v1.5/en)
- [http://tonybai.com/2016/04/14/an-introduction-about-rancher/](http://tonybai.com/2016/04/14/an-introduction-about-rancher/)
