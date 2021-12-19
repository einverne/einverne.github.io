---
layout: post
title: "使用 k3s 和 WireGuard 网络部署 Kubernetes 集群"
aliases: 
- "使用 k3s 和 WireGuard 网络部署 Kubernetes 集群"
tagline: ""
description: ""
category: 学习笔记
tags: [ kubernetes, k3s, netmaker, wireguard, ]
last_updated:
---

在今年的黑色星期五入手了几个不同 VPS 提供上的机器，包括之前的 [A400](/post/2021/08/a400-vps-test-and-usage.html)，以及 [HostHatch](/post/2021/08/hosthatch-vps-review.html)，手上的机器可以用来学习搭建一个 Kubernetes。

在之前的文章中已经介绍过[netmaker](/post/2021/12/netmaker.html)，这是一个可以用来管理 [[WireGuard]] 网络的工具，这篇文章就简单介绍一下如何在不同的云服务器提供商的主机之间，利用 WireGuard 构建的局域网，并使用 k3s 来搭建一个简单的 Kubernetes 集群。

## 概念介绍

### Netmaker
Netmaker 是一个开源的、基于 WireGuard 网络的组网工具，可以非常方便的构建 WireGuard 网络。

### WireGuard 
[[WireGuard]] 是一个已经合并到 Linux 内核的轻量级 VPN 协议，可以在不同的主机中建立点对点通信隧道。

### K3s
[[k3s]] 是 Rancher Lab 发布的一款轻量级的 Kubernetes 发行版。

### Kubernetes
Kubernetes 是一个用于管理容器的开源运维平台，非常易于扩展。通常简称 k8s。


## 工具选择
因为我搭建 k8s 只是为了学习，不是为了应用于生产，所以不直接使用 Kubernetes，而是选择更轻量的 K3s，也可以在性能没有那么好的 VPS 上运行。

Kubernetes 安全性的问题则通过 WireGuard 网络解决，WireGuard 可以在不同主机节点之间建立加密隧道，可以让节点和节点之间的通信都只经过这条加密隧道，这样即使我的不同的主机在不同的地点，可以保证之间的通信是可靠的。但是存在一个问题便是，如果只是只有几台机器，那么完全可以通过手工的方式来管理 WireGuard 网络，但如果机器很多则管理起来会非常麻烦，所以这里使用 Netmaker，可以只通过简单命令快速构建一个私有局域网。

这里不会使用 Netmaker 更加只能的一些特性，比如 DNS，storage，或者 High Availability(高可用)，只简单的借助其基本的组网特性。


## 设置
在这个演示的过程中，我使用两台 RackNerd 的 1核2G VPS（分别叫做 RN1，RN2）作为 worker 节点 ，以及一台 2核4G 的 A400 机器作为 k3s master 节点，然后有一台另外的机器安装 Netmaker 管理端。

- 操作系统：机器都安装 Ubuntu 20.04
- 节点机器都已经安装 `apt install wireguard-tools`
- Netmaker 节点安装了 Docker 以及 docker-compose，并且保证 80, 8081, 50051 端口是开放的


### Netmaker 安装 WireGuard 设置
第一步首先需要通过 Netmaker 构建一个节点与节点之前的安全网络，用于之后的通信。首先在 Netmaker 节点的机器上安装 Netmaker。

教程可以参考[之前的 Netmaker 文章](/post/2021/12/netmaker.html)，为了方便起见可以选择一键安装脚本：

```
sudo wget -qO - https://raw.githubusercontent.com/gravitl/netmaker/master/scripts/nm-quick.sh | bash
```

如果熟悉 docker-compose 可以下载 docker-compose.yml 自行修改配置后启动。

启动之后可以根据脚本的提示获取 Netmaker 登录后台的地址。在 UI 界面中创建用户，并登录。

在界面中创建一个 Network 叫做 k3s，然后在选项中配置私有网络地址的范围是 `10.11.11.0/24`。

这一步完成之后，就可以将不同的主机节点添加到这个网络中，首先点击 Access Keys，选择 k3s 网络，然后创建 Key，Key 的名字重要，可以随意，然后给这个 Key 100 次使用机会。然后就会获得一个安装脚本，通常是 `curl` 开头的。

然后在去其他节点中依次安装，将其添加到 Netmaker 网络中。

确保节点已经安装 `wireguard-tools` 包，然后使用 root 账户：

    su -
    # 粘贴安装脚本
    curl ...
    # 完成安装后执行 wg show 查看状态是否正常
    wg show

`wg show` 命令会显示网络接口，如果节点添加成功，可以继续在其他节点中依次执行上述步骤，直到把所有节点都添加到网络中。然后其 Netmaker 后台，点开 k3s 网络可以查看到网络中添加进来的主机节点，以及其私有 IP 地址。一般 Netmaker 会根据主机的 Hostname 来在界面中展示，可以点击修改来重命名网络中的任何节点名字。

### K3s 安装
假设 master 节点安装在 A400 机器，worker 节点使用两台 RackNerd 节点。

那么首先登录 A400 机器

    # 切换到 root
    su -
    # 查看 IP
    ip a

可以看到结果中会有一个 `nm-k3s` 的网络接口，其中显示的 IP 地址就是 WireGuard 的地址，假设是 `10.11.11.4`，然后需要将此 IP 地址替换下面命令中的 IP 地址。

```
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC=”server --node-ip 10.11.11.4 --node-external-ip 10.11.11.4 --flannel-iface nm-k3s” sh -
```

等待安装完成，可以使用如下命令查看状态：

    systemctl status k3s
    kubectl get nodes
    kubectl get pods --all-namespaces

一旦确认状态都没有问题，所有的 pods 都正常运行，可以开始部署 worker 节点。首先从 master 节点获取 node key:

    cat /var/lib/rancher/k3s/server/node-token

然后在每一个 worker 主机上执行：

    # 切换到 root
    su -
    # 查看 IP
    ip a

获取机器的私有 IP 地址，用来替换下面命令中的 `10.11.11.x`。然后下面命令中的 `MASTER` 需要替换成 k3s master 机器的 IP，如果是上面的例子就是 `10.11.11.4`，将 MASTER 修改为 4。
然后将 `<TOKEN VAL>` 替换成上面 `cat /var/lib/rancher/k3s/server/node-token` 命令输出的结果。

```
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://10.11.11.MASTER:6443 --token <TOKEN VAL> --node-ip 10.11.11.X --node-external-ip 10.11.11.X --flannel-iface nm-k3s" sh -
```

替换上面的命令中的部分，完成执行，使用如下命令查看状态：

    systemctl status k3s-agent
    
然后依次在两台 worker 机器中执行。

然后到 master 节点执行：

    sudo kubectl get nodes
    sudo kubectl get pods --all-namespaces -o wide

显示如下：

![](/assets/kubectl-get-pods-20211219115744.png)

### 测试

创建一个 `pingtest.yml`

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pingtest
  namespace: pingtest
spec:
  selector:
    matchLabels:
      app: pingtest
  replicas: 4
  template:
    metadata:
      labels:
        app: pingtest
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - pingtest
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: busybox
        image: busybox
        command: ["/bin/sh", "-ec", "sleep 1000"]
````

然后执行：

    kubectl create namespace pingtest
    kubectl apply -f pingtest.yml
    kubectl get pods -n pingtest -o wide

执行完成之后，可以看到三个节点中有三个运行的 pods，因为上面指定了 `replicas` 是 4，所以会有一个在 pending 中。

![](/assets/kubectl-pingtest-20211219121358.png)

进入一个运行的节点，执行 `ping`:

    kubectl exec -it pingtest-588df6f488-zzcrp -n pingtest -- sh

然后执行 `ping` 其他节点的操作。



Nginx test

创建一个 `nginx.yml`:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: nginx
  name: nginx
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  sessionAffinity: None
  type: ClusterIP
```

然后执行：

    kubectl create namespace nginx
    kubectl apply -f nginx.yml -n nginx

然后

    kubectl exec -it pingtest-588df6f488-zzcrp -n pingtest -- sh
    
在其中可以访问其他 worker 节点中的 nginx index.html

## reference

- [How to deploy a single Kubernetes cluster across multiple clouds using k3s and WireGuard](https://itnext.io/how-to-deploy-a-single-kubernetes-cluster-across-multiple-clj)