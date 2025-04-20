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

[k3sup](https://github.com/alexellis/k3sup) 是一个可以在任何 Linux 机器上安装并启动 [[K3s]] 的命令行工具，官方宣称可以在 60 秒内启动一个 k3s。k3sup 是一个可帮助快速轻松地在任何地方部署 Kubernetes 集群的工具。它使用 SSH 连接到远程主机并安装 k3s，然后提供一个可用于与集群交互的 kubeconfig 文件。

k3sup 发音为“ketchup”。相对于 k8s 来说，k3s 系统容器数量少，轻量级，并且默认使用 containerd 作为容器运行时，内部的 ingress 使用的是 go 语言开发的 traefik，集成了 SQLite 代替 Etcd，但在多个 master 节点中最好使用 Etcd 组件，来保证数据一致性，从而可以 HA。

k3sup 需要通过 SSH 连接到对应的服务器进行安装操作，所以配置 [SSH 免密码登录](/post/2016/06/ssh-copy-id.html)是必需的。

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
# 指定用户
k3sup install --local --user=$USER --local-path ./kubeconfig
# 指定版本
k3sup install --local --user=$USER --local-path ./kubeconfig --k3s-version=v1.19.5+k3s1
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

其他的常用参数 

- `--local` 无需通过 SSH，安装在本地
- `--local-path string` 本地路径，`kubeconfig` 文件的本地路径
- `--merge` 合并到 `kubeconfig` 文件
- `--ssh-key string` 用于远程登录的 SSH key 密钥
- `--ssh-port int ` 如果使用非标准端口，可以使用该参数指定端口
- `--user string` SSH 登录用户名

### 将其他 Agent 加入到 k3s 集群

注意这里的 agent_ip 为另一台机器，而 server_ip 为 master 节点：

    k3sup join --ip <agent_ip> --server-ip <server_ip> --user username

其他常用参数

- `--server-ssh-port int` 连接服务器的端口

## 卸载 k3s

在 server 节点上：

    /usr/local/bin/k3s-uninstall.sh

在 agent 节点上：

    /usr/local/bin/k3s-agent-uninstall.sh

对于失效的节点可以通过如下的命令移除

```
kubectl delete node <node name>
```

## kubectl 自动补全
kubectl 的自动补全可以在[这里](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#kubectl-autocomplete)查看。

```
source <(kubectl completion zsh)  # set up autocomplete in zsh into the current shell
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # add autocomplete permanently to your zsh shell
```

## k3s vs Rancher

K3s 是一个轻量级的 Kubernetes 发行版，旨在简化和加速 Kubernetes 的部署和管理。它专注于提供一个更小、更快的 Kubernetes 版本，适用于边缘计算和资源有限的环境。K3s 具有更小的二进制文件大小、更低的内存和 CPU 占用，同时仍然提供了 Kubernetes 的核心功能。

[[Rancher]] 是一个开源的容器管理平台，用于部署和管理 Kubernetes 集群以及其他容器编排平台。Rancher 提供了一个易于使用的用户界面，用于集中管理和监控多个 Kubernetes 集群，并提供了诸如应用程序编排、存储和网络管理等高级功能。Rancher 可以与各种底层的容器编排平台集成，包括 Kubernetes、K3s、Docker Swarm 等。

## k3s 端口使用

- 6443 端口提供 API 服务器
- 8472：用于flannel网络插件的VXLAN通信端口。
- 10250：Kubelet API的端口，用于节点与主节点之间的通信。


也可以使用 `kubectl get service -A` 来查看使用的端口。


## related

- [[K3s]]
- [[k3d]]
- [[Rancher]]
- [[Multipass]]
- [[2021-07-25-k3s-vs-k3d-vs-kind-vs-minikube-vs-microk8s]]
