---
layout: post
title: "备份 K3s 数据"
aliases:
- "备份 K3s 数据"
tagline: ""
description: ""
category: 经验总结
tags: [k3s, k8s, kuberntes, backup, data-security, s3, minio]
create_time: 2025-05-14 16:33:33
last_updated: 2025-05-14 16:33:33
dg-home: false
dg-publish: false
---

在 K3s 集群中，持久化数据通常通过 PersistentVolume（PV）和 PersistentVolumeClaim（PVC）实现。要全面备份 PVC，既要备份集群状态（如 etcd/SQLite 数据库），也要备份底层存储卷的数据。不同存储方案（如 Local Path Provisioner、Longhorn 等）备份方式略有差异。

备份 K3s 是一个需要分层处理的任务：

- Cluster Data 控制面数据，包含 K8s 所有的资源定义，例如 Deployment、Service、Secrets 等。对于 K3s 来说，这通常在 Circulate 或 etcd 里面。
- Persistent Volume Data 业务数据，包含应用的数据、应用数据库文件。这部分通常在 [[Longhorn]] 或本地磁盘中。

## 基于 Cluster Data

备份这一部分数据取决于安装 K3s 时，默认使用的是 SQLite 还是嵌入式 etcd。如果是单节点，大概率 SQLite

### 备份 SQLite 单节点默认

**备份方法：**  
备份  `/var/lib/rancher/k3s/server/`  目录下的以下关键内容：

1. **数据库**：`/var/lib/rancher/k3s/server/db/`
2. **Token**：`/var/lib/rancher/k3s/server/token` (非常重要！恢复时必须用到)
3. **TLS 证书**：`/var/lib/rancher/k3s/server/tls/` (建议备份)

备份脚本

```
# 停止 k3s (为了数据一致性，建议停止，虽然不停止也能拷，但有风险)
systemctl stop k3s

# 打包备份
tar -czvf k3s-control-plane-backup-$(date +%F).tar.gz \
  /var/lib/rancher/k3s/server/db \
  /var/lib/rancher/k3s/server/token \
  /var/lib/rancher/k3s/server/tls

# 启动 k3s
systemctl start k3s
```

### 使用 etcd 高可用集群

K3s 自带了强大的 snapshot 工具。

```
# 手动触发快照
k3s etcd-snapshot save
```

快照默认保存在  `/var/lib/rancher/k3s/server/db/snapshots/`。

## 备份业务数据 Persistent Volumes

这是最关键的业务数据，包括了应用的数据以及数据库文件。如果你使用了 Longhorn，备份就非常简单。

### Longhorn 分布式存储

Longhorn 等 CSI 存储方案通常自带快照和备份功能。可直接在 Longhorn UI 或通过其 API 创建卷快照和备份。

1. 配置备份目标 (Backup Target)：  
   进入 Longhorn UI -> Settings -> General -> Backup Target。  
   你需要填入一个 S3 兼容的存储地址（比如 AWS S3, MinIO, 或者是支持 S3 协议的 NAS）。  
   _如果你没有 S3，也可以配置 NFS 路径。_
2. 设置自动备份： 在 Volume 详情页，设置  **Recurring Job**。
   - Task: **Backup** (注意选 Backup 而不是 Snapshot，Snapshot 还是在本地磁盘，Backup 才是异地安全备份)
   - Schedule: `0 2 * * *` (每天凌晨 2 点)
   - Retain: 10 (保留 10 份)

恢复流程为：在 Longhorn UI 选择卷，恢复快照或备份，然后重新创建 PV/PVC 资源。

### Local Path Provisioner

如果你的 PV 是 HostPath，k3s 默认的 local-path，那么数据其实就在宿主机中。

Local Path Provisioner 通常将数据存储在节点本地的 `/var/lib/rancher/k3s/storage/` 路径下，每个 PVC 对应一个子目录。

仅备份 K3s 数据库无法还原 PVC 内实际数据内容。需要同步备份这些本地存储路径。例如，可以定期将 `/var/lib/rancher/k3s/storage/` 下的数据复制到外部存储或对象存储。

恢复时，需先恢复 PVC/PV 资源对象（可用 `kubectl get pv,pvc -o yaml` 导出），再将数据目录拷贝回原路径，确保 PVC 的 `volumeName` 与 PV 的名称一致

我们可以直接编写一个脚本，每天把这个目录 rsync 到 NAS 或移动磁盘中。注意：拷贝正在运行的数据库文件可能会导致损坏。建议需要先停 pod 再进行拷贝，或者在业务低峰期进行拷贝。

## 备份流程

```
# 备份 K3s SQLite 数据库和 token
sudo systemctl stop k3s
cp -r /var/lib/rancher/k3s/server/ /backup/
cp -r /var/lib/rancher/k3s/storage/ /backup/
sudo systemctl start k3s

# 导出 PV/PVC 配置
kubectl get pv,pvc -A -o yaml > /backup/pv-pvc-backup.yaml
```

## 进阶

如果您想把 K3s 资源和 PV 数据一起备份，可以使用 Valero。它能对接 Longhorn CSI 快照接口，一键备份整个 Namespace 所有的配置以及数据。但是这个配置稍复杂，对于一个成熟的企业来说，可以考虑。并且配置完之后，恢复起来也最快。
