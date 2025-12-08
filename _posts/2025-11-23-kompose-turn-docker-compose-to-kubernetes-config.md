---
layout: post
title: "Kompose：将 Docker Compose 迁移到 Kubernetes 的利器"
aliases:
  - "Kompose：将 Docker Compose 迁移到 Kubernetes 的利器"
tagline: ""
description: ""
category: 经验总结
tags: [Kubernetes, Docker, DevOps,Tools]
last_updated:
---

在云原生时代，Kubernetes (K8s) 已经成为容器编排的事实标准。然而，对于很多开发者来说，Docker Compose 依然是本地开发和测试的首选工具，因为它简单、直观且易于配置。

当我们准备将应用从本地开发环境迁移到生产环境的 Kubernetes 集群时，往往面临着一个痛点：如何将 `docker-compose.yaml` 文件“翻译”成 Kubernetes 的各种 YAML 资源文件（Deployment, Service, PVC 等）？

手工编写这些 Kubernetes Manifests 不仅耗时，而且容易出错。这时，[Kompose](https://kompose.io/) 就派上用场了。

## 什么是 Kompose？

Kompose (Kubernetes + Compose) 是一个转换工具，也是 Kubernetes 官方项目的一部分。它的主要目标是帮助开发者简化从 Docker Compose 到 Kubernetes 的迁移过程。

简单来说，Kompose 读取你的 `docker-compose.yaml` 文件，并将其转换为 Kubernetes 可以识别的资源文件。

## 为什么使用 Kompose？

1.  **降低门槛**：如果你熟悉 Docker Compose 但对 Kubernetes 的复杂配置感到头大，Kompose 可以作为一个很好的学习工具，让你看到对应的 K8s 配置是什么样的。
2.  **节省时间**：自动生成基础的 YAML 文件，避免了大量的复制粘贴和样板代码编写。
3.  **平滑迁移**：为现有的 Docker Compose 项目提供了一条快速上云的路径。

## 安装 Kompose

Kompose 支持多种操作系统。

**macOS (Homebrew):**

```bash
brew install kompose
```

**Linux:**

```bash
# 下载二进制文件 (请检查 GitHub Release 页面获取最新版本)
curl -L https://github.com/kubernetes/kompose/releases/download/v1.31.2/kompose-linux-amd64 -o kompose

# 添加执行权限
chmod +x kompose

# 移动到 PATH 路径下
sudo mv ./kompose /usr/local/bin/kompose
```

**Windows:**

可以通过 Chocolatey 安装 `choco install kubernetes-kompose` 或者直接从 GitHub 下载二进制文件。

## 如何使用

假设你有一个简单的 `docker-compose.yaml` 文件：

```yaml
version: "3"
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
  redis:
    image: redis:alpine
```

### 转换 (Convert)

这是最常用的功能。在目录下运行：

```bash
kompose convert -f docker-compose.yml -o k8s/
```

Kompose 会分析 `docker-compose.yaml` 并生成相应的文件。对于上面的例子，它可能会生成：

- `web-deployment.yaml`
- `web-service.yaml`
- `redis-deployment.yaml`
- `redis-service.yaml`

你可以通过 `-o` 参数指定输出文件名或目录。

当我们拿到 Kubernetes 的 config 文件时，就可以直接通过`kubectl`应用这些资源。

```
kubectl apply -f *.yaml
```

我们也可以直接通过 Ranger UI 来导入 YAML 清单。

Kompose 生成的 YAML 文件可以直接在 Rancher UI 中部署

1. 在 Rancher UI 中：☰ > Cluster Management
2. 选择你的 k3s 集群，点击  **Explore**
3. 左侧菜单选择  **Workload** > **Create**
4. 选择工作负载类型（Deployment、StatefulSet 等）
5. 填入容器镜像、环境变量、端口等配置
6. 或者在 YAML 编辑器中直接粘贴转换后的 YAML 内容

## 注意事项与局限性

虽然 Kompose 很强大，但它并不是万能的：

- **配置差异**：Docker Compose 和 Kubernetes 在某些概念上并非 1:1 对应。例如，Docker Compose 的 `build` 指令在 Kubernetes 中没有直接对应（通常需要先构建镜像推送到仓库）。
- **复杂性**：对于非常复杂的 Docker Compose 配置，Kompose 生成的文件可能需要人工进行二次调整和优化。
- **Label 标签**：Kompose 支持通过在 `docker-compose.yaml` 中添加 `labels` 来控制转换行为（例如指定 Service 类型为 LoadBalancer 或 NodePort）。

支持的 Compose 版本：Kompose 支持 Docker Compose v1、v2 和 v3 文件格式

## More

当然，如果我们还想要更系统化地管理自己的配置文件，也可以将多个 Compose 配置转换为 Helm Chart，它提供更强大的模板化功能。

```
# 创建基础 Helm Chart 结构
helm create my-app

# 编辑 values.yaml 和 templates/ 下的文件
# 然后部署到 k3s
helm install my-app ./my-app -n my-namespace
```

## reference

- [Kompose 官方网站](https://kompose.io/)
- [Kompose GitHub 仓库](https://github.com/kubernetes/kompose)
