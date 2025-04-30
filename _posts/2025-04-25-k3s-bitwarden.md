---
layout: post
title: "K3s 部署 Bitwarden"
aliases:
- "K3s 部署 Bitwarden"
tagline: ""
description: ""
category: 经验总结
tags: [ k3s, k8s, bitwarden, longhorn, traefik, vaultwarden, open-source, kubectl, rust]
create_time: 2025-04-25 19:48:49
last_updated: 2025-04-25 19:48:49
dg-home: false
dg-publish: false
---

我之前一直是在一台机器上使用 Docker compose 安装了 Bitwarden，但是这样存在一个隐患，那就是如果这一台机器宕机了，或者发生任何意外，那么我可能有一段时间无法访问我的所有密码仓库，所以为了避免这样的问题，尤其是在我已经稳定运行 K3s 一段时间之后，我就想着将 Bitwarden 迁移到 K3s 上，并且我希望直接使用 Bitwarden 历史的数据，并且也直接使用原来的域名，密码等等，这样就不需要让我所有的设备重新再登录一遍。那么本文就记录一下我在 K3s 上搭建 Bitwarden ，以及将历史数据迁移到 K3s 中的过程。

Bitwarden 我就不多说明了，是一个开源的密码管理器，而我使用的 [vaultwarden/server](https://github.com/dani-garcia/vaultwarden) 则是一个开源的 Rust 编写的 Bitwarden 兼容的后端，Bitwarden 提供了跨平台的客户端，以及浏览器插件，所以可以在任何的平台上非常方便地使用。

## 环境配置

### 前提条件

- 确保有一个已经在运行 K3s 的集群
- 使用 Helm 安装好 Longhorn，Traefik，cert-manager
- 确保本地安装好 kubectl 命令，可以管理 K3s
- 准备一个域名，并且可以配置 DNS A 记录

### 部署 Longhorn 持久化存储

Longhorn 更详细的安装步骤可以参考[这篇文章](https://blog.einverne.info/post/2025/04/k3s-kubernetes-cluster-storage-with-longhorn.html)，本文简略地再提一下。

节点准备 (如果需要): 根据 Longhorn 的要求，可能需要在每个节点上安装 nfs-common、open-iscsi，并准备用于存储的磁盘或目录。

安装 Longhorn，使用 Helm 安装到 longhorn-system 命名空间。

```
helm repo add longhorn https://charts.longhorn.io
helm repo update
ubectl create namespace longhorn-system
helm upgrade -i longhorn longhorn/longhorn --namespace longhorn-system
```

验证安装: 检查 longhorn-system 命名空间中的 Pod 是否都正常运行，并确认 longhorn StorageClass 是否已创建

```
kubectl -n longhorn-system get pod
kubectl get storageclass
```

### 安装 Traefik（Ingress 控制器）

K3s 默认已经安装了 Traefik 作为反向代理和负载均衡器，可以将外部流量路由到集群内部的服务中。

### 配置 DNS

在域名服务提供商那边，为域名 `bitwarden.einverne.info` 创建一个 A 记录，指向 Traefik 的外部 IP 地址，或者指向集群中任意一台机器 IP。

### 部署 cert-manager （证书管理）

可以使用 Helm 来安装 cert-manager ，cert-manager 会自动从证书发行商，比如 Let's Encrypt 等获取以及续订 TLS 证书。

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set installCRDs=true
```

## 部署 Bitwarden 应用

- 配置中，会创建一个 vaultwarden 命名空间，也可以直接使用命令创建 `kubectl create namespace vaultwarden`
- 创建一个 Deployment 来运行 `vaultwarden/server` 容器，并挂载 PVC `vaultwarden-data`
- 创建一个 ClusterIP 类型的 Service，将流量引导到 Vaultwarden 的 Pod
- 创建一个 Certificate 资源，让 cert-manager 为域名创建证书，并将证书存放在名为 `vaultwarden-tls-secret` 的 Secret 中。
- 创建一个 Traefik IngressRoute 资源，将来自域名的 HTTPS 流量路由到 Vaultwarden Service，并使用 cert-manager 生成的 TLS 证书

```
apiVersion: v1
kind: Namespace
metadata:
  name: vaultwarden
---
apiVersion: v1
kind: Secret
metadata:
  name: vaultwarden-secrets
  namespace: vaultwarden
stringData: # 使用 stringData 更易读，Kubernetes 会自动 base64 编码
  ADMIN_TOKEN: ""  # 替换为你生成的 Admin Token openssl
  SMTP_HOST: "smtp.gmail.com"             # 替换为你的 SMTP 服务器地址
  SMTP_FROM: "@gmail.com" # 替换为发件人邮箱
  SMTP_PORT: "587"                        # 替换为 SMTP 端口 (e.g., 587 for TLS)
  SMTP_SSL: "true"                        # 或 "false", 根据你的 SMTP 服务器设置 TLS/SSL
  SMTP_USERNAME: ""     # 替换为 SMTP 用户名
  SMTP_PASSWORD: ""     # 替换为 SMTP 密码
  # 注意：DOMAIN, WEBSOCKET_ENABLED, SIGNUPS_ALLOWED 将直接在 Deployment 中设置，因为它们不敏感或依赖于部署本身
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vaultwarden-data
  namespace: vaultwarden # 假设部署在 vaultwarden 命名空间
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 512Mi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vaultwarden
  namespace: vaultwarden
  labels:
    app: vaultwarden
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vaultwarden
  template:
    metadata:
      labels:
        app: vaultwarden
    spec:
      containers:
      - name: vaultwarden
        image: vaultwarden/server:1.32.7 # 使用官方镜像
        ports:
        - name: http
          containerPort: 80
        - name: websocket
          containerPort: 3012
        env:
        - name: DOMAIN # 可选，配置域名
          value: "https://bitwarden.einverne.info"
        - name: WEBSOCKET_ENABLED
          value: "true"
        - name: SIGNUPS_ALLOWED
          value: "false"
        envFrom: # 从 Secret 加载敏感环境变量
        - secretRef:
            name: vaultwarden-secrets
        volumeMounts:
        - name: data
          mountPath: /data # 挂载持久化存储
        - name: localtime
          mountPath: /etc/localtime
          readOnly: true # 挂载宿主机时区文件
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: vaultwarden-data # 引用之前创建的 PVC
      - name: localtime # 定义宿主机路径卷
        hostPath:
          path: /etc/localtime
          type: File # 确保挂载的是文件
---
apiVersion: v1
kind: Service
metadata:
  name: vaultwarden-service
  namespace: vaultwarden
spec:
  selector:
    app: vaultwarden
  ports:
  - name: http # 命名端口以便 IngressRoute 引用
    protocol: TCP
    port: 80
    targetPort: http # 对应 Deployment 中的 containerPort name: http
  - name: websocket # 暴露 websocket 端口
    protocol: TCP
    port: 3012
    targetPort: websocket # 对应 Deployment 中的 containerPort name: websocket
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: vaultwarden-certificate
  namespace: vaultwarden
spec:
  secretName: vaultwarden-tls-secret # K8s Secret 名称，用于存储证书
  dnsNames:
  - bitwarden.einverne.info # 需要签发证书的域名
  issuerRef:
    name: letsencrypt-prod # 引用之前创建的 ClusterIssuer
    kind: ClusterIssuer
---
apiVersion: traefik.io/v1alpha1 # 使用 Traefik CRD
kind: IngressRoute
metadata:
  name: vaultwarden-ingressroute
  namespace: vaultwarden
spec:
  entryPoints:
    - websecure # 指定入口点，通常是 443/HTTPS
  routes:
  - match: Host(`bitwarden.einverne.info`) && PathPrefix(`/`) # 匹配域名
    kind: Rule
    services:
    - name: vaultwarden-service # 指向 Vaultwarden Service
      port: http
    # Websocket 流量路由规则
  - match: Host(`bitwarden.einverne.info`) && PathPrefix(`/notifications/hub`)
    kind: Rule
    services:
    - name: vaultwarden-service # 指向 Vaultwarden Service
      port: websocket # 指向 Service 的 websocket 端口 (3012)
  tls:
    secretName: vaultwarden-tls-secret # 引用包含证书的 Secret
```

可以将 YAML 配置文件保存成 `vaultwarden-deployment.yaml` 文件，然后应用

```
kubectl apply -f vaultwarden-deployment.yaml
```

K3s 会根据定义自动创建命名空间，资源等等。

运行如下的命令检查 vaultwarden 命名空间中的 Pod

```
kubectl get pods -n vaultwarden -w
```

检查其他资源

```
kubectl get pods,svc,certificate,ingressroute -n vaultwarden
```

当 Pod 在运行状态的时候，就可以在浏览器访问定义好的域名。完成这些步骤之后，Bitwarden 就已经在 K3s 集群中搭建好了，通过 Longhorn 进行持久化存储，通过 Traefik 和 cert-manager 来实现了自动化的 HTTPS 访问，如果某个节点发生故障，K3s 会尝试在其他可用节点上重新调度 Vaultwarden Pod，Longhorn 确保数据在节点之间共享。

## 迁移历史的 Bitwarden 数据

因为我之前已经安装好了 Bitwarden，所以下面我会讲述一下如何将历史数据通过临时 Pod 恢复到 K3s 集群中由 Longhorn 管理的 vaultwarden-data PersistentVolumeClaim（PVC）中。

核心思路就是先停止 K3s 中的 vaultwarden 应用，然后通过一个临时的 Pod 访问 Longhorn 卷，将本地数据复制进去，然后重启 Vaultwarden 应用。

### 前提确定

- 已经按照文本上述的方法部署了 Vaultwarden，并且创建了名为 vaultwarden-data 的 PVC
- 本地历史的 Vaultwarden 的数据目录 `bw-data` 已经备份好
- 通过 kubectl 访问 K3s 集群管理

### 备份 K3s 中的数据（可选但是强烈推荐）

虽然目标是为了恢复旧的数据，但是最好还是先用 Longhorn UI 或者 kubectl 创建当前 vaultwarden-data PV 的快照或者备份，防止恢复过程中的问题。

### 停止 K3s 中的 Vaultwarden 应用

为了安全地修改 PV 内容，停止当前正在使用 PV 的 Pod，将 Vaultwarden Deployment 缩容到 0 个副本。

```
kubectl scale deployment vaultwarden --replicas=0 -n vaultwarden
```

确认 Pod 已经被终止

```
kubectl get pods -n vaultwarden
```

此时应该没有 Pod 在运行。

### 创建一个临时的 Pod 访问 PVC

创建一个简单的 Pod，例如使用 busybox 或者 alpine 镜像，并挂载 `vaultwarden-data` PVC，将这个 Pod 作为数据传输的中转站。

```
apiVersion: v1
kind: Pod
metadata:
  name: restore-helper
  namespace: vaultwarden
spec:
  volumes:
    - name: vaultwarden-storage
      persistentVolumeClaim:
        claimName: vaultwarden-data # 确保这个名称与你的 PVC 名称一致
  containers:
    - name: helper
      image: busybox:latest # 使用一个包含基本工具的轻量级镜像
      command: ["/bin/sh", "-c", "sleep 3600"] # 让 Pod 持续运行一段时间
      volumeMounts:
        - name: vaultwarden-storage
          mountPath: /restore-data # 将 PVC 挂载到 Pod 内的 /restore-data 目录
  # 可选：如果 Vaultwarden 需要特定用户 ID 运行，可以在这里设置 securityContext
  # securityContext:
  #   runAsUser: 1000 # 示例 User ID，根据 Vaultwarden 容器实际情况调整
  #   runAsGroup: 1000 # 示例 Group ID
  #   fsGroup: 1000 # 确保挂载卷的文件系统组权限正确
```

将上述配置保存成 `restore-helper-pod.yaml` ，然后应用这个 YAML 创建 Pod

```
kubectl apply -f restore-helper-pod.yaml -n vaultwarden
```

等待 Pod 编程 Running 状态

```
kubectl get pods -n vaultwarden
```

### 将本地数据复制到临时的 Pod 挂载点

首先找到本地通过 [Docker Compose](https://github.com/einverne/dockerfile/blob/master/bitwarden_traefik/docker-compose.yml) 部署的 Bitwarden 挂在的路径，我一般会放在 HOME 目录下，假设是 `~/bitwarden` 目录

```
sudo tar czvf - /home/einverne/bitwarden | ssh einverne@your.server.ip "cat > /home/einverne/bitwarden-2025.tgz"
```

然后解压文件，假设 Bitwarden 的数据在 `~/bitwarden/bw-data` 下。

```
# 首先检查一下当前数据
kubectl exec -n vaultwarden restore-helper -- ls -al /restore-data/

# 清空目标目录
kubectl exec -n vaultwarden restore-helper -- rm -rf /restore-data/*

# 复制本地数据到 Pod 内的卷挂载点
# 注意：源路径末尾的 "." 表示复制目录内容，而不是目录本身
kubectl cp ~/bitwarden/bw-data/. restore-helper:/restore-data/ -n vaultwarden
```

最后再运行验证一下数据是否已经复制，应该可以看到 `db.sqlite3`, `config.json`, `attachments`, `sends`, `rsa_key.*`  等文件。

### 移除旧的 RSA 密钥

根据迁移指南，恢复数据后需要移除旧的 RSA 密钥对，让 Vaultwarden 在启动时重新生成。在临时 Pod 中执行此操作：

```
kubectl exec -n vaultwarden restore-helper -- rm -f /restore-data/rsa_key.pem /restore-data/rsa_key.pub.pem
```

### 清理临时 Pod

数据复制和清理完成后，删除  `restore-helper` Pod：

```
kubectl delete pod restore-helper -n vaultwarden
```

### 重新启动 Vaultwarden 应用

将 Vaultwarden Deployment 扩容到 1 个副本

```
kubectl scale deployment vaultwarden --replicas=1 -n vaultwarden
```

观察 Pod 启动情况

```
kubectl get pods -n vaultwarden -w
kubectl logs -n vaultwarden -l app=vaultwarden -f # 检查日志是否有错误
```

最后，验证数据恢复，通过域名访问实例，使用之前的用户名和密码访问，检查密码库，设置，组织等等是否恢复。

### 其他管理命令

```
# 获取 secret
kubectl get secret vaultwarden-secrets -n vaultwarden -o yaml

# 手动重启
kubectl rollout restart deployment vaultwarden -n vaultwarden
```

如果访问没有问题，可以在 Cloudflare 上（如果使用的话），配置多个 A 记录分别指向集群中的公网 IP，完成 Bitwarden 高可用的配置。