---
layout: post
title: "Proxmox VE 安装 Ubuntu Server 22.04"
aliases:
- "Proxmox VE 安装 Ubuntu Server 22.04"
tagline: ""
description: ""
category: 经验总结
tags: [ proxmox, proxmox-ve, ubuntu-server, ubuntu, ]
create_time: 2023-04-16 12:19:11
last_updated: 2023-04-16 12:19:11
---

之前的时候，有一台小主机，在上面安装了 [[Proxmox VE]]，然后在其中安装了 [[iKuai]] 和 [[OpenWrt]] 作为软路由使用。现在已经不需要再将其作为软路由代理使用，所以今天就拿出来整理一下，正好放在家里面作为一个 Linux 小服务器，跑一些小一点的程序，然后顺便挂载一个硬盘作为一个小型的媒体服务器。

因为之前在 Proxmox VE 上安装过很多次的系统，这里就不展开，把一些重要的配置和截图放在下面。

## 准备 ISO

在创建虚拟机之前，需要到 [Ubuntu Server 官网](https://ubuntu.com/download/server) 下载最新的 ISO 镜像，然后把镜像上传到 ISO Images 中：

![643b79d2eeb21](https://img.gtk.pw/i/2023/04/16/643b79d2eeb21.png)

之后就可以开始创建 Ubuntu Server。具体的步骤如下。

## 创建虚拟机

首先第一步设置节点的名字（Name）

![643b6ae8acf5d](https://img.gtk.pw/i/2023/04/16/643b6ae8acf5d.png)

然后第二步选择需要挂载的镜像。
![643b73b26a6d2](https://img.gtk.pw/i/2023/04/16/643b73b26a6d2.png)

第三步配置 BIOS，保持默认即可。
![643b73d6849ac](https://img.gtk.pw/i/2023/04/16/643b73d6849ac.png)

第四步，选择磁盘，这里个地方可以根据自己的需要调整虚拟磁盘大小。
![643b741125266](https://img.gtk.pw/i/2023/04/16/643b741125266.png)

第五步，设置 CPU 核心，默认是不能超过物理 CPU 的数量的。
![643b7439c5ae0](https://img.gtk.pw/i/2023/04/16/643b7439c5ae0.png)

第六步，设置网络设备，我这边默认有一个 Linux 网桥（vmbr0），默认即可。
![643b748c50f63](https://img.gtk.pw/i/2023/04/16/643b748c50f63.png)

之后点击下一步，确认自己的配置，然后点击完成虚拟机的创建。

之后就可以开启虚拟机，第一次会使用设置 ISO 启动虚拟机，然后进入 Ubuntu Server 的安装界面。

## 安装 Ubuntu Server

第一次启动虚拟机之后会自动进入安装的程序，安装的过程比较简单，使用键盘选择，确认即可，基本上会分成如下几步：

- 选择语言，English
- 选择安装的类型，默认的 Ubuntu Server 即可
- 配置网络，这个地方需要注意
  - 默认情况下安装程序会根据 DHCP 自动获取一个 IP 地址，如果这个 IP 地址不是你想要的，可以使用 Mannual 自动配置一个
  - subnet 192.168.2.0/24
  - IP 选择一个想要的，比如 192.168.2.30
  - Gateway: 网关 192.168.2.1
  - Name Server: 设置一个 DNS 解析服务器，比如 8.8.8.8
  - Search Domain: 设置一个 Search Domain，Search Domain 的作用就是当本地网络的一个解析，比如设置了 Search Domain 是 `einverne.info` ，那么在 Ubuntu Server 中解析 `webserver` 的时候会首先尝试去解析 `webserver.einverne.info`
- 配置代理，不需要设置，但如果是在局域网，或者无法访问互联网的时候这个地方可以根据自己的需要设置一下
- Ubuntu Archive Mirror，默认即可
- 配置磁盘，可以根据自己的需求调整，我就按默认
- 创建用户名密码等
- 开启 SSH
- 选择是否要安装其他组件，比如 [[microk8s]], [[NextCloud]], [[weken]], [[Docker]] 等等
- 最后就是确认，等待安装完成

## 进入系统

等待安装程序安装完成之后就可以通过 IP 地址和端口，用户名和密码登录到 Ubuntu Server。

```
ssh username@ip
```
