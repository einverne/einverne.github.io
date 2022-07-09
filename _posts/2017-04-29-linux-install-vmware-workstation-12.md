---
layout: post
title: "Linux 安装 VMware workstation 12"
aliases: "Linux 安装 VMware workstation 12"
tagline: ""
description: ""
category: 经验总结
tags: [linux, linux-mint, vmware, virtual-machine, ]
last_updated: 
---

VMware Workstation 12 虚拟机，适用于  RHEL/CentOS 7, Fedora 20-24, Debian 7-9, Ubuntu 16.04-14.14 and Linux Mint 17-18.

## Prerequisites

- 确保系统 64 位
- VMware 12 不支持 32 位 CPU
- 确保有 root 权限

## 安装

更新

	apt-get update && apt-get upgrade	# On Debian Systems

下载

	wget 'http://www.vmware.com/go/tryworkstation-linux-64'

执行权限

	chmod +x VMware-Workstation-Full-12.5.5-5234757.x86_64.bundle

执行安装

	./VMware-Workstation-Full-12.5.5-5234757.x86_64.bundle

启动之后，如果没有自动找到 gcc ，需要手动指定 gcc 版本， `gcc-4.8` 版本，在 `/usr/bin/` 目录下。

## 安装系统

这一步只要有系统镜像，一步步安装是很快的。省略。

## 宿主共享文件

在 VM 菜单下， Setting 中 Option 可以添加宿主机的共享文件夹。

## reference

- <http://www.tecmint.com/install-vmware-workstation-in-linux/>