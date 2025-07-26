---
layout: post
title: "Rancher 中创建 K3s 集群 CA 检查报错解决方案"
aliases:
- "Rancher 中创建 K3s 集群 CA 检查报错解决方案"
tagline: ""
description: ""
category: 经验总结
tags: [ rancher, ca, k3s, system-agent, ca-checksum, k8s, ]
create_time: 2025-07-25 10:39:13
last_updated: 2025-07-25 10:39:13
dg-home: false
dg-publish: false
---

在之前的[文章](https://blog.einverne.info/post/2024/09/rancher-2-installation.html)中遗留下来一些没有解决的问题，当时只是记录了一下， 后来因为只使用了 local 集群就没有继续调查，现在想要创建 K3s 集群的时候再次遇到了类似的问题。

在 Rancher 中创建新的 K3s 集群时，在节点上运行注册脚本的时候抛出如下的错误。

```
[FATAL] Aborting system-agent installation due to requested strict CA verification with no CA checksum provided
```

原因是 agent-tls-mode 处于严格（strict）模式，并且命令行中缺少了 `--ca-checksum` 的参数，所以脚本会直接终止并抛出以上的错误。

Rancher >= 2.9 之后默认开启 strict 模式，解决该问题有如下的三条对策

- 如果有私有 CA，保留 strict，可以计算 CA SHA256 并在注册命令中添加 `--ca-checksum hash` ，安全级别最高，后续需要更新证书
- 使用公有 CA（Let's Encrypt 等），全局将 agent-tls-mode 修改为 system-store，一次性解决所有节点问题，但是信任链放宽，导致理论攻击面扩大
- 临时测试，PoC 环境，可以在注册命令前添加 `CATTLE_AGENT_STRICT_VERIFY=false` 最简单绕过检查，但是不建议在生产环境使用，违背零信任原则。

## 方案一 注册命令添加参数

注册的命令类似

```
curl -fL https://<RANCHER_HOST>/system-agent-install.sh | \
  sudo sh -s - \
  --server https://<RANCHER_HOST> \
  --token <TOKEN> \
  --etcd --controlplane --worker
```

当 strict + 空 CATTLE_CA_CHECKSUM 同时满足时，脚本第 224 行直接 fatal 退出。其目的在于防止 MITM 将节点导向伪造的 Rancher 站点。

计算并附加正确的 `--ca-checksum`

下载 Rancher CA 链

```
curl -sSL https://<RANCHER_HOST>/cacerts -o cacerts.pem
```

返回的是 PEM 格式证书链。

生成 SHA256

```
sha256sum cacerts.pem | awk '{print $1}'
```

在注册命令中携带

```
curl -fL https://<RANCHER_HOST>/system-agent-install.sh | \
  sudo CATTLE_AGENT_FALLBACK_PATH="/usr/local/bin" \
  sh -s - \
  --server https://<RANCHER_HOST> \
  --token <TOKEN> \
  --ca-checksum 4f7975c796XXXXX \
  --worker
```

验证节点

```
kubectl get nodes -o wide | grep <NEW_NODE>
```

状态从 Registering 变成 Active，并且 system-agent Pod 运行。

但是该方案需要自行配置 CA 证书，如果没有自己的 CA 证书，那么可以采用方案 2.

## 方案二 将 agent-tls-mode 调整为 system-store

自 Rancher 2.9 开始，新安装默认 strict；从旧版本升级者仍保持 system-store。

### UI 操作

在 侧边栏，Global Settings 中找到 agent-tls-mode。然后点击 Edit，选择 system-mode ，保存。

本地以及下游集群条件 `AgentTlsStrictCheck=True`

### Helm 升级

如果是 Helm 安装的 Rancher 也可以通过命令

```
helm upgrade rancher rancher-stable/rancher \
  --namespace cattle-system \
  --set hostname=rancher.yourdomain.com
  --set agentTLSMode=system-store
```

修改 Helm 后须保持以 Helm 为准；后续请勿再在 UI 里篡改该值。

## 方案三 测试环境跳过验证

可以在注册命令中指定

```
curl -fL https://<RANCHER_HOST>/system-agent-install.sh | \
  sudo CATTLE_AGENT_STRICT_VERIFY=false sh -s - \
  --server https://<RANCHER_HOST> \
  --token <TOKEN> \
  --worker
```

脚本逻辑：若 CATTLE_AGENT_STRICT_VERIFY 明确设置为 false，即便 agent-tls-mode 是 strict 也会跳过 fatal 分支。

不可在生产使用，以免遭中间人攻击。
