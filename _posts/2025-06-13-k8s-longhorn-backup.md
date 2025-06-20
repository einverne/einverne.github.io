---
layout: post
title: "Longhorn 备份到 S3 兼容存储"
aliases:
- "Longhorn 备份到 S3 兼容存储"
tagline: ""
description: ""
category: 经验总结
tags: [ longhorn, k3s, k8s, kubernetes, backup, data-storage, data-security ]
create_time: 2025-06-20 20:58:05
last_updated: 2025-06-20 20:58:05
dg-home: false
dg-publish: false
---

在之前的[文章](https://blog.einverne.info/post/2025/04/k3s-kubernetes-cluster-storage-with-longhorn.html)当中已经介绍过如何在 K3S 当中使用 Longhorn 作为分布式存储方案，那么本文再记录一下如何将 Longhorn 的备份存储到 S3 兼容的对象存储当中。

要完成这个备份,需要完成两个核心步骤。创建一个 S3 访问凭证，然后在 Longhorn 的 UI 当中配置备份目标。

## 创建 S3 访问凭证

首先，您需要在  `longhorn-system`  命名空间中创建一个 Kubernetes Secret，用于安全地存储访问 S3 存储桶所需的凭证。

准备如下的信息

- **Access Key ID**: 访问 S3 服务的授权 ID。
- **Secret Access Key**: 访问 S3 服务的授权密钥。
- **Endpoint URL**: S3 兼容服务的访问地址，例如  `http://10.6.6.25:9000`  或 AWS 的  `https://s3.us-east-1.amazonaws.com`。

您可以创建一个 YAML 文件来定义该 Secret。请注意，Secret 中的值必须经过 Base64 编码。

创建一个配置文件，比如 `longhorn-backblaze-credentials.yaml`

```
apiVersion: v1
kind: Secret
metadata:
  name: longhorn-minio-credentials
  namespace: longhorn-system
type: Opaque
data:
  # 以下是示例值，请替换为您自己的凭证（Base64编码后）
  AWS_ACCESS_KEY_ID: YWRtaW4= # 示例: echo -n 'admin' | base64
  AWS_SECRET_ACCESS_KEY: YWRtaW5hZG1pbg== # 示例: echo -n 'adminadmin' | base64
  AWS_ENDPOINTS: aHR0cDovLzEwLjYuMTIuMjUxOjkwMDAv # 示例: echo -n 'http://10.6.12.251:9000/' | base64
```

保存内容之后应用

```
kubectl apply -f longhorn-backblaze-credentials.yaml
```

## 配置备份目标

创建 Secret 之后，登录 Longhorn 管理界面设置备份目标。

因为我使用 [[Rancher]] 所以直接在后台找到 Longhorn 管理页面，点击顶部菜单 Settings，然后选择 Backup Target。

![hWfIctwwlM](https://pic.einverne.info/images/hWfIctwwlM.png)

在设置页面中填写如下的字段

- Backup Target URL，该字段置顶了备份数据要存储的 S3 存储桶和区域
  - 格式为 `s3://<bucket-name>@<region>/<optional-folder-path>`
  - `<bucket-name>`  是您在 S3 存储中创建的存储桶名称。
  - `<region>`  是存储桶所在的区域代码，例如  `us-east-1`
  - `<optional-folder-path>`  是存储桶内的一个可选文件夹路径，用于存放备份。
  - URL 末尾必须有 `/`
- Backup Target Credential Secret
  - 该字段填写第一步中创建的 Kubernetes Secret 名称，比如 `longhorn-backblaze-credentials`

我这里采用 [[Backblaze B2 Cloud Storage]] 作为备份存储，创建存储桶 (Bucket) 时，Backblaze 会提供一个 S3 Endpoint。它的格式通常是  `s3.<region-code>.backblazeb2.com`。例如：`s3.us-west-004.backblazeb2.com`。Region 这部分信息就是 Endpoint URL 中的区域代码。例如：`us-west-004`。Bucket Name: 您用于存储备份的 B2 存储桶的名称。

配置完成之后，点击保存按钮，在页面上就能看到 Backup Target 显示绿色的 Available。

## 手动触发备份测试

为了测试之前的配置是否有效,我们可以进行一次手动的备份测试，最简单的备份测试就是可以通过 Longhorn 的图形界面。

- 导航到 Volume 列表
- 选择想要备份的卷，比如 bitwarden，点击进入卷详情
- 在详情信息页面，找到 Snapshots and Backups 部分，点击 Create Backup 按钮
- 添加标签，为备份添加标签，便于后续管理，然后点击 OK

Longhorn 会将卷当前的状态快照复制到配置的 Backup Target 中，可以在 Backup 标签页中查看已创建的备份。

## 定时自动备份

Longhorn 允许为每个卷配置周期性的备份任务。

- 进入卷详情页面
- 配置备份计划，找到周期性任务设置
  - **类型 (Type)**: 在下拉菜单中选择  `backup`。
  - **执行时间 (Schedule)**: 使用标准的 CRON 表达式来定义备份的频率，例如每天、每周或自定义时间。
  - **保留数量 (Retain)**: 设置要保留的备份副本数量，旧的备份会根据此设置被自动清理。
  - **标签 (Labels)**: 为所有通过此计划创建的备份应用统一的标签。

保存设置: 配置完成后保存即可。Longhorn 会根据您设定的 CRON 表达式自动为该卷创建备份。

![H5eltJQkf_](https://pic.einverne.info/images/H5eltJQkf_.png)

Longhorn 有一个优化机制，只有当卷的数据自上次备份以来发生了变化时，周期性备份任务才会创建新的备份，从而避免生成大量内容重复的备份。
