---
layout: post
title: "使用 Docker 安装单节点 Rancher"
aliases: "使用 Docker 安装单节点 Rancher"
tagline: ""
description: ""
category: 经验总结
tags: [docker, rancher, kubernetes, google, k3s]
last_updated: 
dg-home: false
dg-publish: false
---

Rancher 是一个 [[Kubernetes]] 管理工具，提供部署和管理集群的能力。Rancher 为所有集群提供集中身份验证和基于角色的访问控制 RBAC，管理员可以在一个位置控制集群访问。

- 在现有的节点上配置 Kubernetes
- Catalog 管理，使用 Helm charts 轻松部署应用程序
- 管理项目
- Fleet 持续交付
- Istio 集成

## 测试单节点安装

根据官方的单节点安装[建议](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/#option-a-default-rancher-generated-self-signed-certificate)：

直接执行如下的命令，或者转换成 [docker-compose](https://github.com/einverne/dockerfile)

```
docker run -d --restart unless-stopped -p 80:80 -p 443:443 --privileged --name rancher rancher/rancher:v2.9.2
```

查看日志：

```
docker logs --tailf 100 -f rancher
```

等待服务启动之后，登录 IP 地址 80 端口或者 443。

获取密码：

```
docker logs rancher 2>&1 | grep "Bootstrap Password:"
```

但是如果要上生产环境，请一定在 Kubernetes 下安装高可用的 Rancher，我在单节点安装只是为了方便学习和测试。

## 使用

### 身份验证，权限和全局设置

首次登录 Rancher 之后，会提示输入 Rancher Server URL，应该将 URL 设定成 Rancher 主入口，如果在负载均衡器之前，设置成负载均衡器的入口 URL。

主要注意的，设置 Rancher Server URL 后，Rancher 不支持更新。所以设置 URL 时要格外小心。

Rancher 支持非常多的外部系统连接登录，具体可以参考其官网。

### 集群管理

侧边栏，点击 Cluster Management

可以在这里探索集群，比如查看集群的节点数，内存使用，资源利用等等。

可以在此处创建集群，点击创建，然后给集群起一个名字，描述，然后选择集群的 Kubernetes 版本，我这里为了演示就选择 k3s

![Kyng](https://photo.einverne.info/images/2024/10/18/Kyng.png)

我在创建了集群， 并且在另外一台机器上运行 agent 命令之后，Rancher 中，集群一直 Updating 状态，节点状态也一直是 Reconciling ，然后必须去 Agent 端查看日志。

在 Client 安装 rancher agent，并重启

```
sudo systemctl restart rancher-system-agent
```

查看日志

```
sudo journalctl -u rancher-system-agent -f
```

发现了错误原因，可能是证书的问题。

```
Oct 18 16:12:38 gc12.einverne.info rancher-system-agent[7340]: time="2024-10-18T16:12:38+08:00" level=fatal msg="error while connecting to Kubernetes cluster: Get \"https://rancher.einverne.info/version\": tls: failed to verify certificate: x509: certificate signed by unknown authority"
```

## k3s 中安装 Rancher


### 前提提交

确保满足以下先决条件:

- 有一个公网可访问的域名,并创建一个 A 记录 `rancher.YOUR_DOMAIN.com` 将其指向 Rancher 服务器的 IP 地址。
- 开放 80 和 443 端口，Let's Encrypt 需要通过 80 端口进行 HTTP-01 挑战验证。


### 安装 k3s
因为 Docker 安装的单节点 Rancher 只适合测试，并且证书存在问题，为了方便扩展，所以更推荐的方式就是在现有的集群中安装 Rancher。

首先在主节点上安装 k3s

```
curl -sfL https://get.k3s.io | sh -
```

验证服务状态

```
sudo systemctl status k3s.service
```

配置 kubectl 访问

```
mkdir ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER ~/.kube/config
sudo chmod 600 ~/.kube/config
export KUBECONFIG=~/.kube/config
```

验证集群状态

```
kubectl get nodes
kubectl cluster-info
kubectl get pods --all-namespaces
```

在安装 Rancher 时可以使用 Let's Encrypt 的证书。

### 安装 Helm
安装 [[Helm]]

```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
# 或者
sudo snap install helm --classic
snap version
```

添加 Rancher Repository

```
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
```

创建命名空间

```
kubectl create namespace cattle-system
```

### 安装 cert-manager
因为要使用 letsEncrypt，所以需要安装 cert-manager

查看 [cert-manager](github.com/cert-manager/cert-manager/) 最新版本

```
# If you have installed the CRDs manually, instead of setting `installCRDs` or `crds.enabled` to `true` in your Helm install command, you should upgrade your CRD resources before upgrading the Helm chart:

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.1/cert-manager.crds.yaml

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.16.1 \
  --set crds.enabled=true
```

验证

```
kubectl get pods --namespace cert-manager
```

### 安装 Rancher

安装

```
helm install rancher rancher-stable/rancher \
  --namespace cattle-system \
  --set hostname=rancher.YOUR_DOMAIN.com \
  --set bootstrapPassword=admin \
  --set ingress.tls.source=letsEncrypt \
  --set letsEncrypt.email=me@example.org \
  --set letsEncrypt.ingress.class=traefik \
  --set privateCA=true
```

- 将 rancher.YOUR_DOMAIN.com 替换为你的实际域名。
- 将 me@example.com 替换为你的邮箱地址。
- 确保你的域名已正确解析到 K3s 节点的 IP 地址。
- bootstrapPassword 设置了初始的管理员密码,请更改为安全的密码。

如果设置里密码，直接使用密码登录即可，如果没有指定密码，可以使用命令获取

```
kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}{{ "\n" }}'
```

Rancher 会自动请求和安装 Let's Encrypt 证书。这个过程可能需要几分钟。

验证服务启动之后可以验证

```
kubectl -n cattle-system rollout status deploy/rancher
```

安装完成后，可以通过 `https://<rancher.YOUR_DOMAIN.com>` 访问 Rancher UI。

## 使用

在登录 Rancher 后台之后，创建 k3s cluster ，但是在安装 Rancher agent 的时候发生错误

```
[FATAL] Aborting system-agent installation due to requested strict CA verification with no CA checksum provided
```


## 其他命令

卸载 `system-agent-uninstall`

```
curl https://raw.githubusercontent.com/rancher/system-agent/main/system-agent-uninstall.sh | sudo sh
```

其他清理

```
sudo rm -rf /etc/rancher /var/lib/rancher
ps aux | grep rancher
sudo rm /etc/systemd/system/rancher-*
sudo systemctl daemon-reload
```



01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b


```
curl -vk https://<RANCHER_SERVER_URL>/v3/settings/cacerts | jq -r .value | sha256sum | awk '{print $1}'
```

```
curl -fL https://rancher.einverne.info/system-agent-install.sh | sudo  sh -s - --server https://rancher.einverne.info --label 'cattle.io/os=linux' --token 6rfv4hgmmffvj2nz9f9fsrlg2khjnnthzlg9hk8cbfsn5vldj6bgrz --etcd --controlplane --worker
```

```
curl -fL https://rancher.einverne.info/system-agent-install.sh | sudo  sh -s - --server https://rancher.einverne.info --label 'cattle.io/os=linux' --token 6rfv4hgmmffvj2nz9f9fsrlg2khjnnthzlg9hk8cbfsn5vldj6bgrz --ca-checksum be15ab9bb1b034c17c8e2d13a748fead0165df3af96f8bcb76eb4cfbb461b5ee --etcd --controlplane --worker
```

```
curl -vk https://rancher.einverne.info/v3/settings/cacerts | jq -r .value | sha256sum | awk '{print $1}'
```

