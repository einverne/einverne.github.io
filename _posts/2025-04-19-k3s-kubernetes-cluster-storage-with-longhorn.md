---
layout: post
title: "在 K3s 搭建的 Kubernetes 集群中安装 Longhorn 存储解决方案"
aliases:
- "在 K3s 搭建的 Kubernetes 集群中安装 Longhorn 存储解决方案"
tagline: ""
description: ""
category: 经验总结
tags: [k3s, kubernetes, longhorn, ]
create_time: 2025-04-20 21:00:14
last_updated: 2025-04-20 21:00:14
dg-home: false
dg-publish: false
---

前两天我使用 k3s 搭建了一个实验性质的 Kubernetes 集群，k3s 默认的存储

## K3s

[[K3s]] 是由 Rancher Labs 开发的轻量级 Kubernetes 发行版，它以其小巧的体积和低资源消耗而闻名。K3s 能够在资源受限的环境中运行生产级别的 Kubernetes 集群，特别适合边缘设备如树莓派等 IoT 设备

## Longhorn

[[Longhorn]] 是一个轻量级、可靠且易于使用的分布式块存储系统，专为 Kubernetes 设计。它最初由 Rancher Labs 开发，现在作为云原生计算基金会(CNCF)的沙盒项目继续发展。

Longhorn 为每个卷创建一个专用的存储控制器，并在存储在多个节点上的多个副本之间同步复制卷数据。存储控制器和副本本身也使用 Kubernetes 进行编排管理。

- 将 Longhorn 卷用作 Kubernetes 集群中分布式有状态应用程序的持久存储
- 跨多个节点和数据中心复制块存储以提高可用性
- 将备份数据存储在外部存储（如 NFS 或 AWS S3）中
- 创建跨集群灾难恢复卷
- 从备份恢复卷

### local-path vs longhorn

local-path 是 k3s 默认安装的 Storage Class，开箱即用，无需额外配置，资源占用少，使用节点的本地存储。

这个 Storage Class 的配置文件位于 `/var/lib/rancher/k3s/server/manifests/local-storage.yaml`。

默认情况下，local-path 存储类使用 `/var/lib/rancher/k3s/storage` 目录作为数据存储位置。这意味着使用此存储类创建的持久卷将在节点的这个目录中存储数据。

local-path 数据仅存储在单节点上，没有跨节点复制，存在单节点故障风险，如果节点发生永久性故障，那么该节点上的数据将丢失。无法进行数据迁移，Pod 必须在特定节点上运行才能访问其数据。

Longhorn 是一个开源的分布式存储系统，可以支持数据跨节点复制和同步，提高可用性，支持卷快照和备份，可以动态扩展存储容量。

缺点是需要消耗更多的资源，包括 CPU 和内存，设置和维护起来比 local-path 要更复杂，不支持 ARM32，在资源有限的环境中可能性能受限。

### 为什么需要 Longhorn

K8s 中有些应用是有状态的，需要在自身内部存储数据，例如 MySQL，PostgreSQL，Kafka 等，但是 K8s 是以 Pod 形式运行工作负载，Pod 可以在任何节点上进行调度，如果 Pod 在某个节点存储数据，然后被重新调度到另外一个节点，那么数据就会丢失。K8s 通过 PV，PVC，Storage Class 和 CSI 驱动解决这个问题。

## 前提知识

### PV

PV（Persistent Volume）持久卷，提供抽象的存储卷，Pod 可以挂载到 Volume 上，k8s 管理员负责创建一个或多个 PV，将其挂载到实际存储（硬盘或者云存储）上。

### PVC

PVC（Persistent Volume Claim）持久卷声明，是一种 native resource，与 Pod 一起创建，用于指定其所需的存储卷。

### Storage Class

Storage Class 是用来简化管理员创建 PV 以支持 PVC 的流程。管理员可以创建 代表可使用存储的 Storage Class，比如 SSD，HDD，云存储等。然后应用可以在 PVC 中指定所需要的 Storage Class，系统将自动根据 Storage Class 创建 PV。

### CSI Driver

SCI Driver 是一个 k8s 集群中的软件驱动，用于 PV 和 Storage Class 连接到实际的存储提供商，比如磁盘，云存储等。这使得任何提供商都可以通过创建支持其存储的驱动程序来支持 K8s。

## 安装 Longhorn

### 安装前

- 一个 K8s 集群
- Helm 可使用
- 确保所有的节点上都安装了 open-iscsi

### 使用 Helm 安装 Longhorn

```
helm repo add longhorn https://charts.longhorn.io
helm repo update k
ubectl create namespace longhorn-system
helm upgrade -i longhorn longhorn/longhorn --namespace longhorn-system
```

Longhorn 将会被安装在 longhorn-system 的命名空间中。

## 将 Longhorn 设为默认 Storage Class

当我们创建未指定存储类型的 PVC 时，将使用默认存储类型。

如果是默认 k3s 搭建的集群，那么会有一个默认的 Storage Class 叫做 `local-path`。

可以使用 `kubectl get sc` 来查看。

K3s 默认安装了 local-path 存储类，它使用节点本地存储。这个 Storage Class 的配置文件位于 `/var/lib/rancher/k3s/server/manifests/local-storage.yaml`。
默认情况下，local-path 存储类使用 `/var/lib/rancher/k3s/storage` 目录作为数据存储位置。这意味着使用此存储类创建的持久卷将在节点的这个目录中存储数据。

如果查看集群中的 Storage Class 通常会看到如下的输出

```
❯ kubectl get sc
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2d6h
longhorn (default)     driver.longhorn.io      Delete          Immediate              true                   25h
longhorn-static        driver.longhorn.io      Delete          Immediate              true                   25
```

首先取消 local-path 作为默认 Storage Class

```
kubectl patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
```

然后将 Longhorn 标记为默认 Storage Class

```
kubectl patch storageclass longhorn -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

再次执行 `kubectl get sc` 可以看到 Longhorn 被标记为默认。

## 测试

配置完成之后，创建一个不指定存储类的 PVC 来测试，例如 `pvc.yml`

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

如果配置正确，PVC 会自动使用 Longhorn 存储类。

```
kubectl create -f pvc.yml
```

## 确保 K3s 升级后默认被重置

需要注意的是，当使用 Rancher System Upgrade Controller 升级 K3s 时，local-path 可能会重新被设置为默认，导致集群有两个默认存储类，这会使使用默认存储类的 PVC 分配失败。

### 方法一 禁用 local-storage 组件

在 K3s 服务器标志中添加`--disable=local-storage`：

1. 编辑 K3s 配置文件（通常在`/etc/rancher/k3s/config.yaml`）
2. 添加以下行：

```
disable:
  - local-storage
```

然后重启 K3s 服务

```
sudo systemctl restart k3s
```

### 方法二 自定义 local-storage 配置

保留 local-path 存储类，但将其设置为非默认：

```
sudo cp /var/lib/rancher/k3s/server/manifests/local-storage.yaml /var/lib/rancher/k3s/server/manifests/custom-local-storage.yaml

sudo sed -i -e "s/storageclass.kubernetes.io\/is-default-class: \"true\"/storageclass.kubernetes.io\/is-default-class: \"false\"/g" /var/lib/rancher/k3s/server/manifests/custom-local-storage.yaml
```

说明

- 复制默认的”local-storage.yaml”到”custom-local-storage.yaml”
- 将注释”storageclass.kubernetes.io/is-default-class”设置为 false

## reference

- <https://longhorn.io/>
