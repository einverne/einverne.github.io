---
layout: post
title: "Helm 更新安装好的应用"
aliases:
  - "Helm 更新安装好的应用"
tagline: ""
description: ""
category: 经验总结
tags: [helm, k3s, k8s, chart, kubernetes]
create_time: 2025-10-08 18:27:50
last_updated: 2025-12-08 18:27:54
dg-home: false
dg-publish: false
---

在 k3s 中使用 Helm 安装的应用，更新流程非常标准化。基本公式是：**更新仓库 -> (可选)修改配置 -> 执行 Upgrade**。

以下是通用步骤，假设你要更新名为 `gitea` 的应用：

### 更新 Helm 仓库缓存

首先必须告诉 Helm 获取最新的 Chart 版本列表，否则它只知道旧版本。

```bash
helm repo update
```

### (可选) 查看有哪些新版本

如果你想知道现在有什么版本可供升级：

```bash
# 搜索仓库里的版本
helm search repo gitea/gitea

# 或者查看你当前安装版本的状态
helm list -n gitea
```

### (推荐) 导出或准备你的 values.yaml

升级时，**最重要的原则是保持配置一致**。 如果你当初安装时用了一个 `values.yaml` 文件（比如 `gitea-values.yaml`），请直接复用它。

如果你**搞丢了**当初的配置文件，或者你是用 `--set` 参数瞎装的，可以先把当前的配置导出来：

```bash
# 把当前运行的配置导出为 my-current-values.yaml
helm get values gitea -n gitea > my-current-values.yaml
```

_检查一下导出的文件，确认里面的配置是你想要的。_

### 执行升级 (Upgrade)

使用 `helm upgrade` 命令。这个命令非常智能：如果应用没装，它会报错（除非加 `--install`）；如果装了，它会对比版本差异进行升级。

**语法：** `helm upgrade [Release名字] [Chart名字] -n [命名空间] -f [配置文件]`

**示例：**

```bash
helm upgrade gitea gitea/gitea \
  -n gitea \
  -f gitea-values.yaml \
  --version 10.0.0  # <--- 可选：指定特定版本。不加这行默认升到最新版
```

### 验证升级

升级命令执行完后，Pod 通常会重启（滚动更新）。

```bash
# 观察 Pod 重启过程
kubectl get pods -n gitea -w

# 检查 Helm 状态，确认 Revision（修订版本号）增加了
helm list -n gitea
```

### 常见问题 (FAQ)

- **Q: 如果升级失败了怎么办？** A: Helm 支持一键回滚。
  ```bash
  # 回滚到上一个版本
  helm rollback gitea -n gitea
  ```
- **Q: k3s 自带的组件（如 Traefik）怎么用 Helm 升级？** A: k3s 自带组件比较特殊，它们是通过 `HelmChart` CRD 管理的。 通常**不需要**你手动用 `helm upgrade` 去动它们。升级 k3s 本身（二进制文件）时，这些内置组件会自动更新。 _如果你手动去 upgrade `traefik`，可能会和 k3s 的自动管理器冲突，导致配置被覆盖回来。_
- **Q: 我只改了 `values.yaml` 里的配置，版本号没变，能用 `upgrade` 吗？** A: **可以！** `helm upgrade` 不仅仅是“升级版本”，它的本质是“应用新状态”。即使 Chart 版本没变，只要你的 `values.yaml` 变了（比如开启了 ingress），执行 `upgrade` 就会应用这些配置变更。
