---
layout: post
title: "在 K3s 中安装 Redis Cluster 集群"
aliases:
- "在 K3s 中安装 Redis Cluster 集群"
tagline: ""
description: ""
category: 经验总结
tags: [ k8s, k3s, redis, redis-cluster, helm, bitnami ]
create_time: 2025-04-21 14:01:17
last_updated: 2025-04-21 14:01:17
dg-home: false
dg-publish: false
---

在拥有 3 个 master 节点和多个 Agent 节点的 K3s 集群上部署高可用的 Redis Cluster 是一个很好的选择，可以确保数据的高可用性和可扩展性。

## 前提条件

在开始部署之前，确保已经满足

- 正常运行的 K3s 集群，包含 3 个 Master 节点以及多个 Agent 节点
- Helm 工具

## 部署

首先确保 Helm 安装

```
helm version
```

如果没有安装 Helm 可以参考官方的教程[安装](https://helm.sh/docs/intro/install/)。

## 添加 Bitnami 仓库

Bitnami 提供了一个 Redis Cluster Helm Chart

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

创建专用 Namespace，资源管理和隔离

```
kubectl create namespace redis-cluster
```

使用 Helm 安装 Redis 集群，将部署具有 3 个主节点和 3 个从节点的 Redis 集群。

```
helm install my-redis-cluster oci://registry-1.docker.io/bitnamicharts/redis-cluster \
  --namespace redis-cluster \
  --set cluster.nodes=6 \
  --set cluster.replicas=1 \
  --set persistence.storageClass=longhorn \
  --set persistence.size=2Gi
```

或者 

```
helm install my-redis-cluster oci://registry-1.docker.io/bitnamicharts/redis-cluster \
  --namespace redis-cluster \
  --create-namespace \
  -f redis-cluster-values.yml
```

- 总共 6 个节点（3 个主节点和 3 个从节点）
- 每个主节点有 1 个从节点（replica=1）
- 是用 Longhorn 存储
- 启用持久存储，每个节点分配 5GB 存储空间

验证部署状态。查看 Pod 分布

```
kubectl get pods -n redis-cluster
```

当所有 Pod 都是 Running 时，成功。

存储配置验证

```
kubectl get pvc -n redis
```

## 获取 Redis 密码

```
export REDIS_PASSWORD=$(kubectl get secret --namespace "redis-cluster" my-redis-cluster -o jsonpath="{.data.redis-password}" | base64 -d)
echo $REDIS_PASSWORD
```


## 访问 Redis 集群

创建一个临时的客户端 Pod 来连接 Redis 集群。

```
kubectl run --namespace redis-cluster my-redis-client --rm --tty -i --restart='Never' \
  --env REDIS_PASSWORD=$REDIS_PASSWORD \
  --image docker.io/bitnami/redis-cluster:latest -- bash
```

在 客户端 Pod 内部，使用 redis-cli 连接到集群。

```
redis-cli -c -h my-redis-cluster -a $REDIS_PASSWORD
```

连接成功之后，可以运行一些命令来验证集群状态

```
CLUSTER INFO
```

验证成功

![Pz52](https://photo.einverne.info/images/2025/04/21/Pz52.png)

显示集群的基本信息，节点数量，槽分配等。

## 外部访问 Redis Cluster




## 基本测试

一些基本的 Redis 操作来验证集群功能

```
SET mykey "Hello Redis Cluster"
GET mykey
```

部署的 Redis 集群具有以下特性：

- 自动分片和数据迁移：当节点加入或离开集群时，Redis 集群会自动将数据迁移到正确的节点，保持均衡的数据分布
- 高可用性：Redis 集群使用主从复制机制，每个主节点都有从节点。当主节点发生故障时，从节点可以自动接管，提供高可用性
- 负载均衡：Redis 集群实现了客户端和节点之间的自动负载均衡。客户端可以直接连接到任何节点，节点会自动转发请求，实现负载均衡
- 持久化：通过配置，我们启用了持久化存储，确保数据不会因 Pod 重启而丢失

## 维护和更新

### 扩展集群

如果要扩展集群，可以更新 Helm 部署

```
helm upgrade my-redis-cluster oci://registry-1.docker.io/bitnamicharts/redis-cluster \
  --namespace redis-cluster \
  --set cluster.nodes=8 \
  --set cluster.replicas=1 \
  --set persistence.enabled=true \
  --set persistence.size=2Gi
```

### 监控集群

定期检查集群状态

```
kubectl exec -it my-redis-cluster-0 -n redis-cluster -- redis-cli -a $REDIS_PASSWORD cluster info
```

## related

- [[new relic]]
