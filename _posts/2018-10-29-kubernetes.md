---
layout: post
title: "Kubernetes"
tagline: ""
description: ""
category: 学习笔记
tags: [kubernetes, container, open-source, automating, scaling, management, docker, ]
last_updated:
---

免责声明：这篇文章只是在了解 Kubernetes 时的一些笔记记录，非常不全面，如果需要全面了解 Kubernetes 那么还请看书或者文档。

## Kubernetes 是什么
Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.

Kubernetes 是 Google 开源的容器集群管理系统，为容器化应用提供资源调度，部署运行，服务发现，扩容和缩容等一系列服务。

## 能够做什么
Kubernetes 最重要的功能就是容器编排（container orchestration），也就是确保所有的容器能够按照预先的设定在物理机或者虚拟机上执行不同的工作流程。容器必须按照约定打包， Kubernetes 会监控所有正在运行的容器，如果容器”死亡“，或者”无响应“，都会被 Kubernetes 处理。

![Kubernetes](/assets/kubertes.png)

图片来自 [Architecture 101](https://www.aquasec.com/wiki/display/containers/Kubernetes+Architecture+101)

- Cluster, A cluster is a collection of hosts storage and networking resources that Kubernetes uses to run the various workloads that comprise your system.
- Node（除去 Master 的其他机器）, single host, a physical or virtual machine. job is to run pods，可以通过 `kubectl get nodes` 查看 node，或者 `kubectl describe node <node_name>` 查看详细信息

    - kubelet 负责 Pod 对应容器创建、启动停止等
    - kube-proxy 实现 Kubernetes Service 通信和负载均衡
    - Docker 引擎，负责本机容器创建和管理

- Master （集群控制节点）, is the control plane of Kubernetes, consists of several components, like API server, a scheduler, and a controller manager.

    - kube-apiserver 提供 HTTP Rest 接口
    - kube-controller-manager 资源对象自动化控制中心
    - kube-scheduler 负责资源调度 Pod 调度

- Pod is the unit of work in Kubernetes. Each pod contains one or more containers.
- Label （标签），Label 可以附加到各种资源上，node，pod，service，RC 等。
- Replication Controller(RC)，核心概念之一，定义一个期望的场景，声明某种 Pod 的副本数量在任意时刻都符合某个期望值

    - Pod 期待的副本数 replicas
    - 筛选目标 Pod 的 Label Selector
    - 当 Pod 副本数小于预期时，创建新 Pod 的 Pod 模板

- Replica Sets 和 RC 的区别，在于支持集合的 Label selector，而 RC 只支持基于等式的 Label Selector
- Horizontal Pod Autoscaler(HPA) 实现 Pod 扩容和缩容。
- Service 可以理解为一个微服务

## 为什么要用 Kubernetes

- 单机走向集群已是必然
- 设计实现分布式系统
- Kubernetes 全面拥抱微服务架构
- Kubernetes 架构有超强的横向扩容能力

## 分布式系统设计模式

### Sidecar Pattern
The Sidecar pattern 是在 pod 中除去 main application 容器之外额外附加的一个容器模式。主要的应用感知不到 sidecar 容器。最好的例子就是中心化的日志收集器，主要的应用容器可以将日志打到 stdout，然后 sidecar 容器收集，然后将所有的日志发送到中心日志服务。

这种方式和在主应用中加入日志系统带来的优势是巨大的，首先，应用可以不被中心日志服务拖累，其次如果想要升级或者改变日志服务，只需要更新 sidecar 容器即可，而不需要修改主应用。

关于更加详细的分析可以参考[这篇文章](https://www.jianshu.com/p/f16498d06c20)

### Ambassador pattern
The Ambassador pattern 可以理解为一个代理层，对于一个远程服务，可以表现为一个本地服务加一些规则来代替提供相同的服务。最常见的使用场景就是，有一个 Redis 集群，master 用来写，而其他 replicas 用来读。

一个 local Ambassador 容器通过代理提供服务，然后暴露 Redis 给主应用容器。主应用容器通过 localhost:6379 来连接 Redis，但是实际上是连接到了同一个 pod 中的 ambassador ，这个代理层会过滤请求，发送写请求给真正的 Redis master，然后读请求会随机的发送给从服务器（replicas）。和 Sidecar 模式中主应用容器一样，主应用是不感知这样的模式的。

这种模式的优点是当 Redis 集群配置发生改变时，只需要 ambassador 做相应的修改即可，主应用不用任何改动。

### Adapter pattern
The Adapter pattern 可以理解成将输出标准化。考虑一种模式，一个服务是逐渐发布的，他产生的报告格式可能和之前的格式不相同，但是其他接收输出报告的服务或者应用还没有升级。那么一个 Adapter 容器可以被部署到同一个 pod，将主应用输出的内容转换成老的格式，直到所有的报告消费者都升级完成。Adapter 容器和主应用容器共享一个文件系统，他可以监控本地文件系统，一旦新的应用写入内容，立即将其修改。

### Multi-node pattern
单节点 patterns 被 Kubernetes 通过 pod 直接支持。Multi-node 模式，比如 leader election， work queues, 和 scatter-gather 并没有直接支持，但是通过标准接口组合 pods 可以实现。


## 下载安装

### 使用 Minikube 快速搭建单节点集群
具体的教程参考[官网](https://github.com/kubernetes/minikube)

### 使用 microk8s 安装
microk8s 是另外一个用以提供 Kubernetes 快速安装的工具，参考[这里](/post/2018/10/microk8s.html)

## 使用

### 创建 rc 配置
样例文件：

    apiVersion: v1
    kind: ReplicationController
    metadata:
      name: nginx
    spec:
      replicas: 3
      selector:
        app: nginx
      template:
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

解释：

- `kind` 资源类型
- `spec.replicas` Pod 副本期待数量
- `spec.template` 基于此模板创建 pod 实例
- template 下 `spec` Pod 中容器定义

发布到 Kubernetes

    kubectl create -f nginx-rc.yaml

用命令查看

    kubectl get rc
    kubectl get pods

## reference

- 《Mastering Kubernetes》
- 《Kubernetes 权威指南》
- <https://github.com/kubernetes/kubernetes>
- <http://kubernetes.kansea.com/docs/getting-started-guides/binary_release/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/>
