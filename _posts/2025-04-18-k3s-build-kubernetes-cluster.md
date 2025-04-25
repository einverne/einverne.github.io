---
layout: post
title: "K3s 构建高可用 Kubernetes 集群"
aliases:
- "K3s 构建高可用 Kubernetes 集群"
tagline: ""
description: ""
category: 经验总结
tags: [k3s, kubernetes, k3sup, cluster, ubuntu, linux, distribute-system]
create_time: 2025-04-20 23:24:02
last_updated: 2025-04-20 23:24:02
dg-home: false
dg-publish: false
---

之前写过一篇文章介绍了如何使用 [k3sup](https://blog.einverne.info/post/2023/07/use-k3sup-install-kubernetes.html) 来快速安装 k3s 集群，虽然之前已经走过一遍教程，但是实际上还是没有充分利用起来，这一次就从学习的角度再次从头开始利用 K3s 构建一个生产级别的 K8s 集群。

现在我有三台 Ubuntu 24 的 VPS，想要在其上，构建一个 k3s/rancher 的架构，并且在其中部署一个高可用服务，该服务有一个 MySQL 数据库，有一个 app service ，暴露 8080 端口，可以让用户通过域名来访问该服务，并且该服务能够水平扩展。

硬件和网络配置

- 假设三台机器 IP, master
  - master1.einverne.info
  - master2.einverne.info
  - master3.einverne.info
- Agent node
  - agent1

在 Master1 上执行如下命令

```
curl -sfL https://get.k3s.io | sh -s - server \
  --cluster-init \
  --tls-san master1.einverne.info \
  --tls-san master2.einverne.info \
  --tls-san master3.einverne.info \
  --node-taint CriticalAddonsOnly=true:NoExecute
```

说明

- `--tls-san` 参数用于在 k3s 服务器 TLS 证书中添加额外的主机名或 IP 地址作为 Subject Alternative Name（SAN，主题备用名称）。
- `--node-taint CriticalAddonsOnly=true:NoExecute` 用来设置节点污点（Node Taint），污点是 K8s 中应用于节点的一种属性，使节点能够排斥特定类型的 Pod，污点是让节点拒绝某些 Pod 调度，Node Affinity 则是相反，吸引 Pod 到特定节点
  - CriticalAddonsOnly 表示只允许关键组件运行
  - NoExecute 效果，不仅阻止新 Pod 调度到该节点，还会驱逐已经在节点上运行但不能容忍该污点的 Pod

等待安装完成，然后获取 Token

```
sudo cat /var/lib/rancher/k3s/server/node-token
```

复制输出的 Token，然后在其他 master 节点上安装。

在 Master2 和 Master3 中使用。

```
export TOKEN=your-token
```

在 Master2 和 Master3 上执行，安装 Master 节点

```
# TOKEN为上一步获取的token
curl -sfL https://get.k3s.io | K3S_TOKEN=$TOKEN sh -s - server \
  --server https://master1.einverne.info:6443 \
  --tls-san master1.einverne.info \
  --tls-san master2.einverne.info \
  --tls-san master3.einverne.info \
  --node-taint CriticalAddonsOnly=true:NoExecute
```

验证集群状态，在任意一个 master 节点中执行

```
sudo kubectl get nodes
```

三个节点都处于 Ready 状态，并且具有 control-plane 角色。

## Agent Node

在 Agent 节点上执行

```
export TOKEN=your-token
curl -sfL https://get.k3s.io | K3S_URL=https://master1.einverne.info:6443 K3S_TOKEN=$TOKEN sh -
```

在 Master 节点上验证节点状态

```
sudo kubectl get nodes
```

## 配置 kubectl 访问

为了方便在本地管理集群，可以在本地配置 kubectl

从 master 节点复制 kubeconfig

```
# 在 master1 上执行
mkdir ~/.kube/
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER ~/.kube/config
sudo chmod 600 ~/.kube/config
export KUBECONFIG=~/.kube/config
```

建议将  `export KUBECONFIG=~/.kube/config`  写入你的  `~/.bashrc`  或  `~/.bash_profile`，这样每次登录都能自动生效。

将输出的内容保存到本地的 `~/.kube/config` 文件中，并修改 server 地址为任一节点 IP

```
server: https://master1.einverne.info:6443
```

另外如果要让 kubectl 自动补全，可以执行

```
source <(kubectl completion zsh)
```

## 安装 Helm

Ubuntu 下

```
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

其他[平台](https://helm.sh/docs/intro/install/)。

## 部署 Rancher 管理平台

[[Rancher]] 是一个强大的 Kubernetes 管理平台，使用 Helm 来部署。

### 安装 cert-manager

首先安装 [[cert-manager]]，用于处理 SSL 证书。

```
# 创建命名空间
kubectl create namespace cert-manager

# 添加Helm仓库
helm repo add jetstack https://charts.jetstack.io
helm repo update

# 安装cert-manager CRDs
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.0/cert-manager.crds.yaml

# 安装cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.17.0
```

验证 cert-manager 部署

```
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
```

返回 success 表示成功。

### 安装 Rancher

注意将下面命令中的 hostname 替换成自己的 hostname，配置 DNS，将`rancher.example.com`指向任一节点 IP，或者配置负载均衡器指向所有节点，然后将密码设置成自己的密码。

```
# 创建命名空间
kubectl create namespace cattle-system

# 添加Helm仓库
# https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/install-upgrade-on-a-kubernetes-cluster#kubernetes-cluster
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
helm repo update

# 安装 Rancher
export PASSWORD=your-complex-password
# 替换rancher.example.com为你的实际域名
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.example.com \
  --set bootstrapPassword=$PASSWORD \
  --set ingress.tls.source=letsEncrypt \
  --set letsEncrypt.email=admin@einverne.info \
  --set letsEncrypt.ingress.class=traefik
```

验证 Rancher 是否正常运行

```
kubectl -n cattle-system rollout status deploy/rancher
```

当所有 Pod 处于 Running 状态，可以通过浏览器访问。

K3s v1.21+与 Rancher 存在兼容性问题，Kubernetes v1.21+版本无法降级时的临时方案可以减少 Rancher 副本数量

```
kubectl scale deploy rancher -n cattle-system --replicas=1
```

## k8s Pod 典型的异常及排查

| 状态             | 排查和建议                                                         |
| ---------------- | ------------------------------------------------------------------ |
| Pending          | `kubectl describe pod <pod> -n <namespace>` 检查调度和资源分配问题 |
| CrashLoopBackOff | `kubectl logs -f <pod> -n <ns>` 查看容器日志                       |
| ImagePullBackOff | `kubectl describe pod <pod> -n <ns>` 检查镜像拉取错误              |
| Evicted          | `kubectl describe node` 检查节点磁盘，内存等资源使用情况           |

## related

- [[K3s]]
- [[k3sup]]
- [[minikube]]
