---
layout: post
title: "Helm 使用"
aliases:
- "Helm 使用"
tagline: ""
description: ""
category: 经验总结
tags: [ helm, kuberntes, k8s, rancher, k3s, cluster, ]
create_time: 2025-03-11 14:23:26
last_updated: 2025-03-11 14:23:26
dg-home: false
dg-publish: false
---

Helm 是 [[Kubernetes]] 的一个包管理工具，用来简化 Kubernetes 应用的部署和管理。

通过使用使用 Helm 可以管理 Kubernetes manifest files、管理 Helm 安装包 Charts、基于 Chart 的 Kubernetes 应用分发。

Helm Chart 是用来封装 Kubernetes 原生应用程序的 YAML 文件。

## Installation

macOS 下安装 Helm

```shell
brew install helm
```

Linux 下安装 Helm

```
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

更多操作系统的安装[说明](https://helm.sh/docs/intro/install/)

## 介绍

在 `helm` 中有三个关键概念：`Chart`，`Repo` 及 `Release`

- `Chart`: 一系列 k8s 资源集合的命名，包含一系列 k8s 资源配置文件的模板与参数，可灵活配置
- `Repo`: 即 chart 的仓库，其中有很多个 chart 可供选择，如官方 [helm/charts](https://github.com/helm/charts)
- `Release`: 当一个 Chart 部署后生成一个 release

### Chart 简介

使用 `helm create` 创建一个 chart，了解简单 chart 的目录结构

```bash
# 创建一个 chart
$ helm create todo
Creating todo

$ cd todo

# 打印 chart 目录，主要文件有 Chart.yaml 与 values.yaml
# --dirsfirst 先打印文件夹名称
$ tree --dirsfirst
.
├── charts
├── templates
│   ├── tests
│   │   └── test-connection.yaml
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── Chart.yaml
└── values.yaml

3 directories, 8 files
```

查看主要的两个文件目录

- `templates/`: 运维编写的配置文件模板，示例是最简单应用的资源配置，但复杂应用还会有 pvc，role，service-acount 等等
- `values.yaml`: 这是给开发写的可选参数，但是大部分参数都被运维内置了

可以利用 `helm repo add` 来添加 Repo，比较著名的 Repo，有一些大型软件也会维护自己的 Chart，比如 GitLab，Elastic 等。

- [Artifact Hub](https://artifacthub.io/)
- <https://charts.bitnami.com/>

Helm 使用

```
Usage:
  helm [command]

Available Commands:
  completion  generate autocompletion scripts for the specified shell
  create      create a new chart with the given name
  dependency  manage a chart's dependencies
  env         helm client environment information
  get         download extended information of a named release
  help        Help about any command
  history     fetch release history
  install     install a chart
  lint        examine a chart for possible issues
  list        list releases
  package     package a chart directory into a chart archive
  plugin      install, list, or uninstall Helm plugins
  pull        download a chart from a repository and (optionally) unpack it in local directory
  push        push a chart to remote
  registry    login to or logout from a registry
  repo        add, list, remove, update, and index chart repositories
  rollback    roll back a release to a previous revision
  search      search for a keyword in charts
  show        show information of a chart
  status      display the status of the named release
  template    locally render templates
  test        run tests for a release
  uninstall   uninstall a release
  upgrade     upgrade a release
  verify      verify that a chart at the given path has been signed and is valid
  version     print the client version information

Flags:
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
  -h, --help                            help for helm
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "/home/einverne/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "/home/einverne/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "/home/einverne/.config/helm/repositories.yaml")

Use "helm [command] --help" for more information about a command.
```
