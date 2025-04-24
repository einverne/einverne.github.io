---
layout: post
title: "K3s 部署 IT Tools 在线工具集"
aliases:
- "K3s 部署 IT Tools 在线工具集"
tagline: ""
description: ""
category: 经验总结
tags: [ docker, k3s, k8s, it-tools, self-hosted, traefik, ingress, ]
create_time: 2025-04-21 15:44:32
last_updated: 2025-04-21 15:44:32
dg-home: false
dg-publish: false
---

IT Tools 是一个开源的工具集，包含了非常多好用的工具，Token 生成，Hash 生成，UUID 生成，加密解密，BIP39 passphrase 生成，Hmac 生成，RSA 密钥生成，Password 生成，PDF 签名检查，日期转换，Base64 转换，Unicode，ASCII，YAML，JSON 等等非常多有用的工具。

今天这篇文章就以 IT Tools 为例来介绍一下在 K3s 上部署这样一个无状态的服务，并且通过 Traefik 配置域名访问 K3s 内部服务。

## 前提条件

在安装之前，需要确保

- 一个运行正常的 K3s
- Helm 工具
- 一个可以配置 DNS A 记录的域名

## 获取 Chart

获取第三方的 Chart

```
helm repo add jeffresc https://charts.jeffresc.dev
helm repo update
helm install it-tools jeffresc/it-tools
```

直接安装

```
helm install it-tools jeffresc/it-tools
```

卸载命令

```
helm uninstall it-tools
```

如果为了测试，可以直接执行下面的命令，通过临时端口转发来测试服务是否正常。

```
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=it-tools,app.kubernetes.io/instance=it-tools" -o jsonpath="{.items[0].metadata.name}")
  export CONTAINER_PORT=$(kubectl get pod --namespace default $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace default port-forward $POD_NAME 8080:$CONTAINER_PORT
```

如果您只是临时需要从其他集群外部访问，可以在`port-forward`命令中添加`--address`参数：

```
kubectl --namespace default port-forward $POD_NAME 8080:$CONTAINER_PORT --address 0.0.0.0
```

这样可以让 port-forward 监听所有网络接口，而不仅仅是 localhost。但请注意，这种方法不是生产环境的推荐做法，因为它依赖于保持 kubectl 命令运行。

为了让服务可以向集群外部提供，这里有几个方法

- 通过 NodePort Service，接集群内部的端口映射到集群外部
- 通过 Ingress ，管理从集群外部到内部的服务 HTTP 和 HTTPS 访问，集群的流量入口

## NodePort 类型的 Service

[[Kubernetes NodePort]] 可以创建 NodePort 类型的 Service

```
❯ cat it-tools-service.yml
apiVersion: v1
kind: Service
metadata:
  name: it-tools-nodeport
  namespace: default
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: it-tools
    app.kubernetes.io/instance: it-tools
  ports:
  - port: 8080
    targetPort: 8080
    nodePort: 30080  # 可选，不指定会随机分配30000-32767之间的端口
```

应用此配置之后，可以通过 http://节点:30080 来访问应用。K3s 会在每个节点上开放 30080 端口，访问任一一个节点的 IP 加上端口都可以正常访问该服务。

## 使用 Ingress

[[Kubernetes Ingress]]

如果想通过域名来访问应用，可以配置 Ingress，K3s 默认安装了 Traefik 作为 Ingress 控制器。

```
❯ cat it-tools-ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: it-tools-ingress
  namespace: default
  annotations:
    # 可选：添加Traefik特定的注解
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  rules:
  - host: tools.einverne.info
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: it-tools
            port:
              number: 8080
  tls:
  - hosts:
    - it-tools.einverne.info
    secretName: it-tools-tls-secret
```

这样，当配置了 DNS A 记录指向 K3s 节点的 IP 地址，就可以通过 http://tools.einverne.info 来访问应用。Traefik 会自动申请证书，配置证书。

对于生产环境，建议使用 LoadBalancer 或 Ingress 方式，这样可以确保服务的稳定性和可扩展性。如果您的应用需要特定的 TCP/UDP 端口（不仅仅是 HTTP/HTTPS），LoadBalancer 是更好的选择。

检查证书是否成功颁发

```
kubectl get certificates -n default
```

当证书状态显示为`Ready: True`时，表示证书已成功颁发并可以使用。

## reference

- <https://artifacthub.io/packages/helm/jeffresc/it-tools>
