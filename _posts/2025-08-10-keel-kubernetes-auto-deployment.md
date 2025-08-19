---
layout: post
title: "Keel 基于 Kubernetes 的自动部署工具"
aliases:
- "Keel 基于 Kubernetes 的自动部署工具"
tagline: ""
description: ""
category: 经验总结
tags: [ keel, kubernetes, k8s, k3s, deployment, cicd ]
create_time: 2025-08-14 14:18:14
last_updated: 2025-08-14 14:18:14
dg-home: false
dg-publish: false
---

如果我们只是简单使用 Docker 部署一些服务，可以使用 [[watchtower]] 这一类工具来自动更新容器版本。那如果是在 K8s/K3s 中要自动更新容器版本呢？我们通常的做法是更新一下 `deployment.yaml` 然后手动执行 `kubectl apply -f deployment.yaml` ，这样的方法既容易出错，又缺乏控制，用户需要登录访问集群，并执行操作。

那么我今天要介绍的这一款 Keel 工具，就可以轻松实现 K8s/K3s 集群中的容器自动版本更新。

## 什么是 Keel

Keel 是专为 Kubernetes 设计的轻量级自动部署工具，旨在简化容器镜像更新和应用部署的自动化流程。作为一个开源项目，Keel 通过监控容器镜像仓库的变化，自动触发 Kubernetes 集群中相应部署的更新，为开发者提供了一种无需手动干预的持续部署解决方案。

与传统的手动部署方式相比，Keel 采用了"一次配置，持续监控"的理念。开发者无需频繁执行 kubectl apply 命令或复杂的 CI/CD 流水线配置，只需通过简单的注解配置，即可实现应用的自动化更新。

## 特性

Keel 采用非常简单的架构设计，资源占用极低，仅需要 0.2 核 CPU 以及 256 MB 内存，这使得 Keel 非常适合资源有限的环境。而相对应的 ArgoCD，FluxCD 等都需要至少 1~2 核的 CPU，1GB 以上的内存。

Keel 也不需要外部数据库或持久化存储，直接从 Kubernetes 集群中获取信息。

支持多种触发模式

- Web Hook 触发，容器镜像仓库主动通知 Keel
- 轮询检查，定期扫描镜像仓库检测版本变化
- 混合模式

### 更新策略

Keel 支持不同的更新策略

- all，更新所有的版本，只要有更新就升级
- major，只更新 major, minor, patch 版本
- minor, 更新 minor, patch 版本
- path，只更新 patch 版本
- force，强制更新，比如设置 latest 标签时
- glob，根据正则匹配更新版本

## 安装部署

### Helm 安装

可以使用 Helm 来部署

```
helm repo add keel https://charts.keel.sh
helm repo update
```

创建 `values.yaml` 文件

```
image:
  repository: keelhq/keel
  tag: null
  pullPolicy: Always
# Enable insecure registries
insecureRegistry: false

# Polling is enabled by default,
# you can disable it setting value below to false
polling:
  enabled: true
  defaultSchedule: "@every 10m"

# 关闭 Helm Provider
helmProvider:
  enabled: false

# Google Container Registry
# GCP Project ID
gcr:
  enabled: false
  projectId: ""
  gcpServiceAccount: ""
  clusterName: ""
  pubSub:
    enabled: false

# AWS Elastic Container Registry
# https://keel.sh/v1/guide/documentation.html#Polling-with-AWS-ECR
ecr:
  enabled: false
  roleArn: ""
  accessKeyId: ""
  secretAccessKey: ""
  region: ""

notificationLevel: info

# Webhook Notification
# Remote webhook endpoint for notification delivery
webhook:
  enabled: false
  endpoint: ""

# Slack Notification
# bot name (default keel) must exist!
slack:
  enabled: false
  botName: ""
  token: ""
  channel: ""
  approvalsChannel: ""

# Hipchat notification and approvals
hipchat:
  enabled: false
  token: ""
  channel: ""
  approvalsChannel: ""
  botName: ""
  userName: ""
  password: ""

# Mattermost notifications
mattermost:
  enabled: false
  endpoint: ""

# MS Teams notifications
teams:
  enabled: false
  webhookUrl: ""

# Discord notifications
discord:
  enabled: false
  webhookUrl: ""

# 开启 Dashboard
basicauth:
  enabled: true
  user: "admin"
  password: "admin321"

# 开启 EMail 通知
mail:
  enabled: true
  from: "email@mail.com"
  to: "email@mail.com"
  smtp:
    server: "smtp.mail.com"
    port: 465
    user: "email@mail.com"
    pass: "password"

# Keel service
# Enable to receive webhooks from Docker registries
service:
  enabled: true
  type: LoadBalancer
  externalPort: 9300
  clusterIP: ""

# Webhook Relay service
# If you don’t want to expose your Keel service, you can use https://webhookrelay.com/
# which can deliver webhooks to your internal Keel service through Keel sidecar container.
webhookRelay:
  enabled: false
  bucket: ""
  # webhookrelay.com credentials
  # Set the key and secret values here to create the keel-webhookrelay secret with this
  # chart -or- leave key and secret blank and create the keel-webhookrelay secret separately.
  key: ""
  secret: ""
  # webhookrelay docker image
  image:
    repository: webhookrelay/webhookrelayd
    tag: latest
    pullPolicy: IfNotPresent

# Use a secret file to define passwords and tokens of third parties.
secret:
  # Leave blank to use `keel.fullname`
  name: ""
  # Set to false to manage your own secret file, with terraform for example.
  create: true

# Keel self-update
# uncomment lines below if you want Keel to automaticly
# self-update to the latest release version
keel:
  # keel policy (all/major/minor/patch/force)
  policy: patch
  # trigger type, defaults to events such as pubsub, webhooks
  trigger: poll
  # polling schedule
  pollSchedule: "@every 10080m"
  # images to track and update
  images:
    - repository: image.repository
      tag: image.tag

# RBAC manifests management
rbac:
  enabled: true
  serviceAccount:
    # Kubernetes service account name to be used for ClusterRoleBinding and Deployment.
    # name:
    # Create a new Kubernetes service account automatically. Set to false if you want to use your own service account.
    # If rbac.serviceAccount.name is not set, a new name for the service account is generated
    create: true

# Resources
resources:
  limits:
    cpu: 200m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 256Mi

# NodeSelector
nodeSelector: {}

affinity: {}

tolerations: {}

# base64 encoded json of GCP service account
# more info available here: https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform
# e.g. --set googleApplicationCredentials=$(cat <JSON_KEY_FIEL> | base64)
googleApplicationCredentials: ""

# Enable DEBUG logging
debug: false

# This is used by the static manifest generator in order to create a static
# namespace manifest for the namespace that keel is being installed
# within. It should **not** be used if you are using Helm for deployment.
createNamespaceResource: false

podAnnotations: {}

serviceAnnotations: {}
# Useful for making the load balancer internal
# serviceAnnotations:
#    cloud.google.com/load-balancer-type: Internal

aws:
  region: null

podDisruptionBudget:
  enabled: false
  maxUnavailable: 1
  minAvailable: null

# Google Cloud Certificates
gcloud:
  managedCertificates:
    enabled: false
    domains:
      - ""

ingress:
  enabled: false
  labels: {}
  annotations: {}
  #  kubernetes.io/ingress.class: nginx
  #  kubernetes.io/tls-acme: "true"
  hosts: []
#    - host: chart-example.local
#      paths:
#        - /
  tls: []
#    - secretName: chart-example-tls
#      hosts:
#        - chart-example.local

dockerRegistry:
  enabled: false
  name: ""
  key: ""

persistence:
  enabled: false
  storageClass: "-"
  size: 1Gi
```

安装部署

```
helm upgrade --install keel --namespace=keel --create-namespace keel/keel -f values.yaml
```

### YAML 文件部署

如果不想使用 Helm，或者想要自己掌控，可以使用 YAML 文件部署。

```
---
apiVersion: v1
kind: Namespace
metadata:
  name: keel
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: keel
  namespace: keel
  labels:
    app: keel
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: keel
rules:
  - apiGroups:
      - ""
    resources:
      - namespaces
    verbs:
      - watch
      - list
  - apiGroups:
      - ""
    resources:
      - secrets
    verbs:
      - get
      - watch
      - list
  - apiGroups:
      - ""
      - extensions
      - apps
      - batch
    resources:
      - pods
      - replicasets
      - replicationcontrollers
      - statefulsets
      - deployments
      - daemonsets
      - jobs
      - cronjobs
    verbs:
      - get
      - delete #required to delete pods during force upgrade of the same tag
      - watch
      - list
      - update
  - apiGroups:
      - ""
    resources:
      - configmaps
      - pods/portforward
    verbs:
      - get
      - create
      - update
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: keel
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: keel
subjects:
  - kind: ServiceAccount
    name: keel
    namespace: keel
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: keel-data
  namespace: keel
  labels:
    app: keel
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  storageClassName: managed-nfs-storage
---
apiVersion: v1
kind: Service
metadata:
  name: keel
  namespace: keel
  labels:
    app: keel
spec:
  type: NodePort
  ports:
    - name: keel
      port: 9300
      targetPort: 9300
      protocol: TCP
      nodePort: 30930
  selector:
    app: keel
  sessionAffinity: None
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: keel
    release: keel
  name: keel
  namespace: keel
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  selector:
    matchLabels:
      app: keel
      release: keel
  template:
    metadata:
      labels:
        app: keel
        release: keel
    spec:
      serviceAccountName: keel
      containers:
        - command:
            - /bin/keel
          env:
            - name: NAMESPACE
              valueFrom:
                fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
            - name: POLL
              value: "true"
            - name: POLL_DEFAULTSCHEDULE
              value: "@every 1m"
            - name: BASIC_AUTH_USER
              value: admin
            - name: BASIC_AUTH_PASSWORD
              value: admin@123456
            - name: MAIL_SMTP_SERVER
              value: smtp.mail.com
            - name: MAIL_SMTP_PORT
              value: "25"
            - name: MAIL_SMTP_USER
              value: email@mail.com
            - name: MAIL_TO
              value: email@mail.com
            - name: MAIL_FROM
              value: email@mail.com
            - name: NOTIFICATION_LEVEL
              value: info
          image: keelhq/keel:0.19.1
          imagePullPolicy: Always
          livenessProbe:
            failureThreshold: 3
            httpGet:
              path: /healthz
              port: 9300
              scheme: HTTP
            initialDelaySeconds: 30
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 10
          name: keel
          ports:
            - containerPort: 9300
              protocol: TCP
          readinessProbe:
            failureThreshold: 3
            httpGet:
              path: /healthz
              port: 9300
              scheme: HTTP
            initialDelaySeconds: 30
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 10
          resources:
            limits:
              cpu: 100m
              memory: 128Mi
            requests:
              cpu: 50m
              memory: 64Mi

```

然后运行 `kubectl apply -f keel.yaml`。

## 使用

Keel 提供了简洁的 Web 管理界面，可以通过浏览器访问 9300 端口。

### 触发器

Keel 可以通过 Webhook 和 poll 方式来检查镜像版本，Webhook 可以在容器镜像仓库或对应的代码仓库更新时主动通知 Keel 来更新镜像。

Pull Mode 是 Keel 主动拉取更新，Web Hook 则是主动通知 Keel 去更新。

下面是一个主要的流程

- 修改代码提交到 GitHub
- CI 构建产生容器镜像，并将镜像推送到 Registry
- 容器 Registry 收到新版本之后，通过 Web Hook 通知 Keel，或者在 CI 中配置推送完成之后调用 Web Hook
- 当 WebHook 收到之后，Keel 根据内容处理相关的资源

![jd0M](https://photo.einverne.info/images/2025/08/14/jd0M.png)

## 实践

CI/CD 集成，推荐 GitHub Actions 和 Keel 集成使用

```
# GitHub Actions 工作流示例
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Build and push Docker image
      run: |
        docker build -t your-registry/app:${GITHUB_SHA} .
        docker push your-registry/app:${GITHUB_SHA}
        # 同时推送 latest 标签供 Keel 监控
        docker tag your-registry/app:${GITHUB_SHA} your-registry/app:latest
        docker push your-registry/app:latest
```

## related

- [[ArgoCD]]
