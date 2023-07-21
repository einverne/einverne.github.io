---
layout: post
title: "使用 k3sup 快速安装 k3s"
aliases: 
- "使用 k3sup 快速安装 k3s"
tagline: ""
description: ""
category: 学习笔记
tags: [ k3s, k8s, kubernetes, docker, google, k3sup, cluster, vps ]
last_updated: 2023-07-17 07:53:46
create_time: 2023-03-31 05:30:07
---

多次想要学习一下 [[Kubernetes]] 但是多次照着搭建环境尝试失败，并且也没有找到合适的落地场景就「放弃」了，但是之前了解的时候看到了轻量级的 k8s 叫做 k3s，然后了解到了一个可以快速搭建 k3s 的项目 [[k3sup]]，所以记录一下。

## 什么是 k3sup

[k3sup](https://github.com/alexellis/k3sup) 是一个可以在任何 Linux 机器上安装并启动 [[k3s]] 的命令行工具，官方宣称可以在 60 秒内启动一个 k3s。

k3sup 发音为“ketchup”。相对于 k8s 来说，k3s 系统容器数量少，轻量级，并且默认使用 containerd 作为容器运行时，内部的 ingress 使用的是 go 语言开发的 traefik，集成了 SQLite 代替 Etcd，但在多个 master 节点中最好使用 Etcd 组件，来保证数据一致性，从而可以 HA。

- k3sup 可以在任何 VM，包括 VPS，VM，AWS EC2，物理机上通过命令安装启动
- 从现有 k3s 集群中获取 KUBECONFIG
- `ks3up join` 将节点加入 k3s 集群

## 安装使用

K3S 部署 Kubernetes 集群，创建集群的 https 证书，Helm 部署 rancher，通过 [[Rancher]] 的 UI 界面手动导入 Kubernetes 集群，使用 Kubernetes 集群。

k3sup 使用 Go 编写，直接下载编译好的二进制文件就能使用。

参考[官网](https://github.com/alexellis/k3sup)：

```
curl -sLS https://get.k3sup.dev | sh
sudo install k3sup /usr/local/bin/

k3sup --help
```

### 安装 k3s server

在本地安装 k3s

```
k3sup install --local
```

运行 k3sup：

```
k3sup install --ip <your_ip> --user username
```

执行该语句之后，会在 IP 主机上安装 k3s 并启动，作为 master。

```
# Test your cluster with:
export KUBECONFIG=~/kubeconfig
kubectl config set-context default
kubectl get node -o wide
```

### 将其他 Agent 加入到 k3s 集群

注意这里的 agent_ip 为另一台机器，而 server_ip 为 master 节点：

    k3sup join --ip <agent_ip> --server-ip <server_ip> --user username

## 卸载 k3s

在 server 节点上：

    /usr/local/bin/k3s-uninstall.sh

在 agent 节点上：

    /usr/local/bin/k3s-agent-uninstall.sh

## k3s vs Rancher

K3s 是一个轻量级的 Kubernetes 发行版，旨在简化和加速 Kubernetes 的部署和管理。它专注于提供一个更小、更快的 Kubernetes 版本，适用于边缘计算和资源有限的环境。K3s 具有更小的二进制文件大小、更低的内存和 CPU 占用，同时仍然提供了 Kubernetes 的核心功能。

[[Rancher]] 是一个开源的容器管理平台，用于部署和管理 Kubernetes 集群以及其他容器编排平台。Rancher 提供了一个易于使用的用户界面，用于集中管理和监控多个 Kubernetes 集群，并提供了诸如应用程序编排、存储和网络管理等高级功能。Rancher 可以与各种底层的容器编排平台集成，包括 Kubernetes、K3s、Docker Swarm 等。

## related

- [[k3s]]
- [[k3d]]
- [[Rancher]]
- [[2021-07-25-k3s-vs-k3d-vs-kind-vs-minikube-vs-microk8s]]
