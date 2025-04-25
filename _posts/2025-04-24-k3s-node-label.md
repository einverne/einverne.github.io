---
layout: post
title: "K3s 中给节点添加标签并实现 Pod 调度控制"
aliases:
- "K3s 中给节点添加标签并实现 Pod 调度控制"
tagline: ""
description: ""
category: 经验总结
tags: [ k3s, k8s, pod, workload, tags, label,  ]
create_time: 2025-04-24 10:37:21
last_updated: 2025-04-24 10:37:21
dg-home: false
dg-publish: false
---

给 K3s 中的节点添加标签并实现 Pod 调度是一个非常常见的需求，特别是当你希望某些 Pod 只在特定地理位置的节点，比如美国，日本，上运行的时候。

## 给 K3s 节点添加标签

可以使用 `kubectl` 命令来为节点添加标签。

```
kubectl label nodes <node-name> <label-key>=<label-value>
kubectl label nodes <node-name> <label-key>=<label-value> <label2>=<value2>
```

例如，给节点添加地理位置标签

```
kubectl label nodes k3s-node-1 location=jp
```

可以通过如下的命令来验证标签是否添加成功

```
kubectl get nodes --show-labels
```

输出的结果，将显示节点信息和对应的标签内容。

## K3s Agent 在启动时添加标签

如果希望在节点首次加入集群时就添加标签，可以在启动 K3s Agent 的时候使用 `--node-label` 参数。

```
k3s agent --node-label location=jp
```

注意，这种方式只能在节点首次注册的时候添加，之后不能通过重新运行 K3s 来修改。

## 让 Pod 只在特定标签节点运行

有几种方法可以确保 Pod 只在特定标签的节点上运行。

### 使用 nodeSelector （最简单）

在 Pod 配置文件中添加 `nodeSelector` 字段

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-jp
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    location: jp
```

这个 Pod 将只会被调度到带有 location=jp 标签的节点上。同样 nodeSelector 还可以指定多个标签。

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-jp
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    location: jp
    label2: value2
```

### 使用 Node Affinity （更灵活）

Node Affinity 提供了比 nodeSelector 更强大的语法:

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-jp
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: location
            operator: In
            values:
            - jp
  containers:
  - name: nginx
    image: nginx
```

这个配置使用 requiredDuringSchedulingIgnoredDuringExecution 确保 Pod 只会被调度到带有 location=jp 标签的节点上。

如果你想设置优先级而不是强制要求，可以使用`preferredDuringSchedulingIgnoredDuringExecution`

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-jp-preferred
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: location
            operator: In
            values:
            - jp
  containers:
  - name: nginx
    image: nginx
```

调度器会尝试将 Pod 放在日本的节点上，但如果不可能，它也会考虑其他节点。

## 标签管理的其他操作

如果需要删除节点上的标签，可以使用如下的命令，在标签键后面加上减号"-"：

```
kubectl label nodes <node-name> <label-key>-
```

比如

```
kubectl label nodes k3s-node-1 location-
```

修改现有的标签，可以使用 `--overwirte` 参数

```
kubectl label nodes <ndoe-name> <label-key>=<label-value> --overwrite
```

比如

```
kubectl label nodes k3s-node-1 location=other --overwrite
```

通过以上方法，可以有效地管理 K3s 集群中的节点标签，并确保特定的 Pod 只在特定地理位置的节点上运行，从而满足地理位置相关的业务需求。
