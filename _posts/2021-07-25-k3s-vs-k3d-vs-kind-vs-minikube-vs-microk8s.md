---
layout: post
title: "k3s k3d kind minikube microk8s 对比"
aliases: 
- "k3s k3d kind minikube microk8s 对比"
tagline: ""
description: ""
category: 学习笔记
tags: [ k8s, k3s, kubernetes, microk8s, google, kubectl, ]
last_updated:
---

在本地运行一个 [[Kubernetes]] 可以确保应用可以运行生产环境中。所以可以在本地运行一个类似于 [[minikube]] 的服务，提供一个 Kubernetes 环境。

Kubernetes 是一个 Google 开源的容器编排平台，提供了强大的自动化部署，扩容，管理功能。它提供了非常简单的方式来管理多台机器上的容器，并且提供了负载均衡，资源分配等方式来确保每一个应用都以最优的方式运行。

虽然 Kubernetes 被设计跑在云上，但是很多开发人员依然需要在本地跑起一个 Kubernetes，这就需要一些工具来帮助我们在本地设置这样的一个环境。本文就对比一下这些常用的工具。

## K3s

[[k3s]] 是一个轻量级工具，旨在为低资源和远程位置的物联网和边缘设备运行生产级 Kubernetes 工作负载。
K3s 帮助你在本地计算机上使用 VMware 或 VirtualBox 等虚拟机运行一个简单、安全和优化的 Kubernetes 环境。

K3s 提供了一个基于虚拟机的 Kubernetes 环境。如果要设置多个 Kubernetes 服务器，你需要手动配置额外的虚拟机或节点，这可能相当具有挑战性。

然而，它是为在生产中使用而设计的，这使它成为本地模拟真实生产环境的最佳选择之一。要设置多个 Kubernetes 服务器，你需要手动配置额外的虚拟机或节点，这可能相当具有挑战性。

k3s 可以运行在极低的资源下，只需要 512 MB 内存即可运行。

## K3d

K3d 是一个平台无关的轻量级包装器，在 docker 容器中运行 K3s。它有助于快速运行和扩展单节点或多节点的 K3S 集群，无需进一步设置，同时保持高可用性模式。

作为 K3s 的一个实现，K3d 分享了 K3s 的大部分功能和缺点；但是，它排除了多集群的创建。K3s 是专门为使用 Docker 容器的多个集群运行 K3s 而构建的，使其成为 K3s 的可扩展和改进版本。

## Kind

[Kind](https://kind.sigs.k8s.io/)（Kubernetes in Docker）主要是为了测试 Kubernetes，它可以帮助你在本地和 CI 管道中使用 Docker 容器作为 "节点 "运行 Kubernetes 集群。

它是一个开源的 CNCF 认证的 Kubernetes 安装程序，支持高可用的多节点集群，并从其源头构建 Kubernetes 的发布版本。

## microK8s

microK8s 由 Canonical 创建，是一个 Kubernetes 发行版，旨在运行快速、自愈和高可用的 Kubernetes 集群。它为在多个操作系统（包括 macOS、Linux 和 Windows）上快速、轻松地安装单节点和多节点集群进行了优化。

它是在云、本地开发环境以及边缘和物联网设备中运行 Kubernetes 的理想选择。它还可以在使用 ARM 或英特尔的独立系统中高效工作，如 Raspberry Pi。

和 minikube 不同的是，microK8s 可以在本地 Kubernetes 集群中运行多个节点。但 microK8s 的问题在于，它运行在 snap package 之下，它很难运行在不支持 snap 的 Linux 发行版之上。

## minikube

[minikube](https://minikube.sigs.k8s.io/docs/start/) 是一个使用最广泛的、可以让用户在本地运行 Kubernetes 的工具。它提供了非常方便的方式可以让用户在不同操作系统上安装和运行单一的 Kubernetes 环境。minikube 通过虚拟机实现。它具有很多功能，如负载平衡、文件系统挂载和 FeatureGates。

尽管 minikube 是本地运行 Kubernetes 的最佳选择，但主要缺点是，它只能运行在单一节点上，也也就意味着本地搭建的 Kubernetes 集群中只能有单个节点--这使得它离生产型多节点 Kubernetes 环境有点远。

## Katacoda

也可以通过线上教学平台如 Katacoda 上的免费课程来学习 Kubernetes，它们都是云托管的，你不需要自己安装，只不过你需要云供应商的集群需要付费。

## reference

- <https://faun.pub/k3d-vs-k3s-vs-kind-vs-microk8s-vs-minikube-6949ebb93d18>
