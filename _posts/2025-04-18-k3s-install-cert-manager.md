---
layout: post
title: "K3s 中安装 cert-manager 发行 SSL 证书"
aliases:
- "K3s 中安装 cert-manager 发行 SSL 证书"
tagline: ""
description: ""
category: 经验总结
tags: [ k3s, k8s, cert-manager, ssl, tls, cert-manager, kubectl, yaml ]
create_time: 2025-04-18 17:18:38
last_updated: 2025-04-18 17:18:38
dg-home: false
dg-publish: false
---

cert-manager 作用类似于 certbot ，不过是运行在 Kubernetes 中的。cert-manager 是一个证书的自动化管理工具，可以在 k8s 集群中自动地颁发和管理各种来源，各种用途的数字证书。

我在 K3s 上面安装了不少的应用，所有的域名都是通过 Cloudflare 去进行代理的，因为浏览器当中从来没有报过证书的问题，我一直以为 K3S 的证书生成是没有问题的，直到今天去运行查询 cert-manager 的时候，发现并没有运行的 pod。

```
kubectl get pods -A | grep cert-manager
```

正常情况下，您会看到有三个不同的组件在运行，状态为 Running

- `cert-manager-xxx`
- `cert-manager-cainjector-xxx`
- `cert-manager-webhook-xxx`

什么也没有输出，说明 cert-manager 没有安装。为了确认 cert-manager 确实没有安装，我还继续查询了

```
kubectl get crd | grep cert-manager
# 查看全局的签发者
kubectl get clusterissuers
# 查看当前命名空间的签发者
kubectl get issuers -A
```

正常情况下都会有一个  `ClusterIssuer`（常见的名字是  `letsencrypt-prod`  或  `letsencrypt-staging`）。但是在我的集群当中，我依然没有看到任何的输出。

和 AI 进行了几轮对话之后，我才足以确认我可能用的证书是 Cloudflare 提供的。K3s 自带一个 Traefik，开启了 HTTPS （websecure），但是没有提供有效的证书。Traefik 会自动生成一个自签名证书（self-signed certificate）。如果我们使用自签名的证书，浏览器会显示一个不安全或红色警告，需要点击继续访问才能打开页面。但是我点开浏览器地址栏的小锁图标，查看证书详情，证书的颁发者并不是 TRAEFIK DEFAULT CERT，这说明根本没有用到 Let's Encrypt 证书。

我们还可以通过运行如下的命令，查看证书是否有效，还有多少时间过期。

```
kubectl get secret memos-tls-secret -n memos -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -noout -issuer -dates
```

- 如果报错 Error from server (NotFound)：说明你用的是 Traefik 默认自签名证书（浏览器应该报错）。
- 如果显示 Issuer: ... Let's Encrypt 且 notAfter 是未来的时间：说明你用的是 残留的旧证书。你需要尽快安装 cert-manager，否则到期后服务会中断。

而我执行之后得到的是

```
Error from server (NotFound)
```

这证明我一直以来用的都是 Traefik 默认的自签名证书。

## 流量是如何走的

在调查的过程当中，我才意识到，因为我一直使用的是 Cloudflare，并在后台设置了 HTTPS，开启了 Cloudflare 的(小黄云） CDN 代理。所以无论在 K3s 集群内部的配置如何，在浏览器看到的绿色证书都是 Cloudflare 颁发给自己的边缘节点的。这就解释了为什么我没有运行 cert-manager，甚至后端的 secret 不存在，但是浏览器却依然显示 HTTPS 正常。

当我自己访问我的应用时，分成了两段：

1. 用户访问 Cloudflare 边缘节点。这段连接必须是 HTTPS 加密的。证书是由 Cloudflare 自动管理和颁发的，通常是 Google Trust Service 或 Let's Encrypt，但签发给 Cloudflare。
2. Cloudflare 到 K3s Ingress 的连接是否加密，取决于 Cloudflare 后台设置的 SSL/TLS 模式。

Cloudflare 后台可以设置不同的模式。

- 如果设置的是 Flexible 模式，用户通过 HTTPS 访问 Cloudflare，Cloudflare 通过 HTTP 访问 K3s 的 Ingress。
- 如果设置的是 Full 模式，用户通过 HTTPS 访问 Cloudflare，然后 Cloudflare 通过 HTTPS 访问 K3s Ingress。但是 Cloudflare 尝试用 HTTPS 访问 Ingress 时，不验证证书的有效性。即使 K3s 里面用的是 Traffic 默认的自签名证书，Cloudflare 也只会睁一只眼闭一只眼信任它，将内容取回来之后，加上 Cloudflare 自身的证书颁发给用户。
- 如果设置的是 Full Strict 模式，那么在 K3s 里面没有有效的证书，或者证书过期了，或者是自签名证书，这个模式会直接进行报错，报“526 Invalid SSL Certificate”的错误。

![TBy6vnv5iL](https://pic.einverne.info/images/TBy6vnv5iL.png)

点击我们应用的浏览器地址栏的小锁，查看证书颁发者是 Google Trust Service 或者是 Cloudflare Inc，证明这一段连接是 Cloudflare 进行代理的。

我们可以通过如下的 cURL 来验证后端真实的证书，绕过 Cloudflare，直接从本地向公网 IP 发起请求，查看 K3s 到底返回了什么证书。假设公网 IP 是 1.2.3.4，根据自己的实际情况替换命令中的 IP 地址。

```
curl -vk --resolve your-domain.com:443:1.2.3.4 https://your-domain.com
```

看输出里的 Server certificate 部分，如果是 TRAEFIK DEFAULT CERT -> 这就实锤了！ 其实一直都在裸奔（用的是无效证书），全靠 Cloudflare 的 "Full" 模式在撑着。

## 安装

在 K3s 中安装 cert-manager 非常简单，建议使用 Helm 方式安装，便于后续的管理和升级。

官方提供了多种部署方式，推荐使用 helm3 安装

```
# 添加 cert-manager 的 helm 仓库
helm repo add jetstack https://charts.jetstack.io
helm repo update
# 查看版本号
helm search repo jetstack/cert-manager -l | head
# 下载并解压 chart，gitops 版本管理
helm pull jetstack/cert-manager --untar --version 1.19.1
helm install \
  cert-manager ./cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

我们必须设置 installCRDs=true，这样 Helm 会自动帮我们创建 cert-manager 必须的 CRD 资源。注意，crds 参数会导致使用 helm 卸载的时候，会删除所有 CRDs，可能导致所有 CRDs 资源全部丢失。

为了开始颁发证书，您需要设置一个 ClusterIssuer 或 Issuer 资源（例如，通过创建一个“letsencrypt-prod” issuer）。

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    # Let's Encrypt 生产环境服务器
    server: https://acme-v02.api.letsencrypt.org/directory
    # 替换成你的邮箱，用于接收证书过期通知
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik
```

然后应用

```
kubectl apply -f letsencrypt-prod.yaml
```

通过如下的方式验证安装

```
kubectl get pods -n cert-manager
# 应该能看到 cert-manager, cainjector, webhook 三个 pod 都是 Running 状态
```

重新应用 Ingress YAML

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: somename-ingress
  namespace: somename
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    # 关键：这行现在终于生效了！
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  # ... (其他保持不变)
  tls:
  - hosts:
    - your-domain.com
    secretName: somename-tls-secret # cert-manager 会自动把申请到的证书填进这里
```

应用之后，等待几分钟，查看证书状态

```
kubectl get certificate -A
```

其中的 `READY`  为  `True` 表示已经发行成功。
