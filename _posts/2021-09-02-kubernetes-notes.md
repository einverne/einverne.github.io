---
layout: post
title: "Kubernetes 学习笔记"
aliases:
- "Kubernetes 学习笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [ kubernetes, k8s, k3s, docker, container, cncf, google, borg, deployment, ]
create_time: 2021-01-21 06:03:42
last_updated: 2023-07-21 06:04:01
---

Kubernetes (简称 k8s)是 Google 基于其内部容器调度平台 Borg 的经验开发的一个开源的容器编排和管理平台。2014 年开源，并作为 CNCF（云原生计算基金会）的核心发起项目。旨在简化容器化应用的部署、扩展和管理。它提供了一种便捷的方式来组织、调度和管理容器化应用程序，并能够自动化地处理应用程序在集群中的部署、扩展、故障恢复和负载均衡等任务。

设计的目的是在主机集群之间提供一个能够自动部署、扩展、应用容器的可运营的平台。Kubernetes 通常结合 docker 容器一起工作。

Kubernetes 使用了一种称为 Pods 的抽象概念来组织应用程序的容器。Pod 是一个或多个相关容器的组合，它们共享同一个网络命名空间、存储卷以及其他资源。这样，它们可以共享网络配置、文件系统和其他依赖关系，从而更好地协同工作。

Kubernetes 还提供了一种称为 Replication Controller 的机制，用于自动扩展和管理 Pod 实例。Replication Controller 可以根据设置的规则自动复制和删除 Pod 实例，以适应负载变化，并确保应用程序始终处于所需的状态。

此外，Kubernetes 还提供了一种称为 Service 的机制，用于将后端 Pod 实例暴露给外部访问。Service 可以为后端 Pod 实例提供负载均衡、服务发现和稳定访问地址等功能。

Kubernetes 还支持水平扩展、滚动更新、故障恢复等功能，使得应用程序的部署和管理变得更加简单和可靠。它还提供了丰富的 API 和命令行工具，以便管理员和开发者可以方便地管理和监控集群中的应用程序。

## 功能

- 自动化容器部署、复制
- 随时扩展或收缩容器规模
- 组织容器成组，提供容器间的负载均衡
- 更新和回滚容器版本

## Terminology

- API Server： 对外提供 RESTful 接口，系统管理指令的统一入口，对资源的操作都要交给 API Server 再提交给 etcd
- schedule： 调度 pod 到 Node
- controller manager: 每一个资源对应一个控制器
- etcd: 高可用的 key-value 存储，k8s 用来存储各个资源的状态

### Master

Kubernetes 中的 Master 节点指的是集群控制节点，负责整个集群管理和控制。

Master 节点上运行着关键进程：

- Kubernetes API Server(kube-apiserver)，提供 HTTP Rest 接口，所有资源的增删改查操作入口
- Kubernetes Controller Manager（kube-controller-manager），所有资源对象的自动化控制中心
- Kubernetes Scheduler（kube-scheduler),负责资源调度（Pod 调度）的进程

### Node

Kubernetes 集群中除去 Master 之外的节点被叫做 Node 节点（Agent），工作负载节点，执行 Master 分配的工作。当 Node 节点宕机时，工作负载会自动转移到其他节点。

Node 节点运行的关键进程：

- kubelet，负责 Pod 对应容器的创建、启动、停止等
- kube-proxy, 实现 Kubernetes Service 的通信和负载均衡
- Docker Engine（docker），Docker 引擎，负责本机容器创建和管理

可以使用如下命令查看集群中 Node：

    kubectl get nodes

查看具体信息：

    kubectl describe node kubernetes-minion1

### Pods

k8s 最小调度单元，Pod 中运行业务相关的容器

- Kubernetes 中最小的部署单元
- 包含一个或多个容器，可以被一起编排（schedule）
- 每一个 pod 都有一个唯一的 IP 地址
- Pod 中的每一个容器可以通过 localhost 相互通信

### Label

Label 是 key=value 键值对，附加到资源对象上，Node，Pod，Service，RC 等等。资源对象可以定义任意数量 Label，同一个 Label 也可以被添加到任意数量的资源对象上。

### Replication Controller

Replication Controller（后简称 RC），定义了场景，声明某种 Pod 的副本数量在任意时刻都符合预期值。

定义包括几部分：

- Pod 期待的副本数 （replicas）
- 筛选目标 Pod 的 Label Selector
- Pod 副本数量小于预期数量的时候，用于创建新 Pod 的模板（template）

### Service

Service 就是「微服务」

- Service 定义服务的访问入口
- Service 与后端 Pod 副本集群之间通过 Label Selector 实现无缝对接
- 服务之间通过 TCP/IP 通信，形成灵活的弹性网络

```
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
spec:
  ports:
  - port: 8080
  selector:
    tier: frontend
```

- 定义了名为 `tomcat-service` 的 Service
- 端口 8080
- Label 是 `tier=frontend` 的 Pod 实例都属于它

然后创建：

    kubectl create -f tomcat-server.yaml

### Namespace

Namespace 命名空间，用于实现多租户的资源隔离。

    kubectl get namespace

在 Kubernetes 中，所有对象都使用 manifest（yaml 或 json）来定义，比如一个简单的 nginx 服务可以定义为 nginx.yaml，它包含一个镜像为 Nginx 的容器：

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```
