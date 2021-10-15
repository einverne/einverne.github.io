---
layout: post
title: "Cloud-init 初始化虚拟机配置"
tagline: ""
description: ""
category: 学习笔记
tags: [proxmox, virtual, virtual-machine, cloud-init, ubuntu, linux, openstack,]
last_updated:
---

在安装 [Proxmox](/post/2020/03/proxmox-install-and-setup.html) 后在它的文档中了解到了 cloud-init。所以就来梳理一下，什么是 cloud-init，它解决了什么实际问题，以及最重要的它该怎么用。


## cloud-init 是什么
cloud-init 是一套工业标准为的是统一不同操作系统发行版在跨平台的云端服务器上初始化安装的流程。
**cloud-init** 是运行在 Guest machine 中，并在初始化时将一些自定义的配置应用到 Guest machine 中的应用程序。想象一下，假如你是一个云主机提供商，每天都需要为客户初始化成千上万台虚拟主机，这些机器可能使用不用的操作系统，可能根据客户需求设定不同的 IP 地址，不同的 SSH key，以及设置不同的 hostname 等等，这个时候需要怎么办，cloud-init 就是为了解决这个问题而诞生的。

cloud-init 最早由 Ubuntu 的开发商 Canonical 开发，现在已经支持绝大多数 Linux 发行版和 FreeBSD 系统。而目前大部分的公有云都在用 cloud-init 初始化系统配置，cloud-init 也支持部分私有云 (KVM, OpenStack, LXD 等等） [^cloud]，已经成为了事实上的标准。而这里就回到了 Proxmox，因为 Proxmox 是用来部署和管理虚拟机的平台，所以天然的适合 cloud-init 的使用场景，甚至可以说是不可或缺的一部分。

当我们在 AWS，或者 Google Cloud 这些公有云中申请计算资源的时候，云服务的提供商总是会叫我们选择一个系统镜像，然后做一些基础设置 (Hostname, SSH key 等等），然后在此基础上进行系统创建。cloud-init 正是在这个背景下诞生，自动化将用户数据初始化到系统实例中。

cloud-init 的主旨是定义一些独立于操作系统的配置，比如 hostname, networking configuration 等等。

[^cloud]: <https://cloudinit.readthedocs.io/en/latest/topics/availability.html>

cloud-init 特性：

- 设置默认的 locale
- 设置 hostname
- 生成并设置 SSH 私钥
- 设置临时的挂载点

## Boot Stages
cloud-init 对系统的初始化分为这几个阶段：

- Generator
- Local
- Network
- Config
- Final

### Generator
当系统启动的时候，[generator](https://www.freedesktop.org/software/systemd/man/systemd.generator.html) 会检查 `cloud-init.target` 是否需要启动。默认情况下，generator 会启动 cloud-init. 但是如下情况 cloud-init 不会在开机运行：

- `/etc/cloud/cloud-init.disabled` 文件存在时
- 当内核命令发现文件 `/proc/cmdline` 包含 `cloud-init=disabled` 时，当在容器中运行时，内核命令可能会被忽略，但是 cloud-init 会读取 `KERNEL_CMDLINE` 这个环境变量

### Local
Local 阶段会在挂载根分区 `/` 时，立即执行

	cloud-init-local.service

Local 阶段的目的是：

- 查找 `local` data source
- 将网络配置应用到本地

大多数情况下，这个阶段就只会做这些事情。它会在 datasource 中查找，并应用网络配置。网络配置可能从这些地方来：

- **datasource**: 云端通过 metadata 提供
- **fallback**: 通过 `dhcp on eth0`，在虚拟机内自行通过 DHCP 获取 IP
- **none**: 网络配置可以通过 `/etc/cloud/cloud.cfg` 中配置 `network: {config: disabled}` 来禁用

如果是该实例的第一次启动，那么被选中的网络配置会被应用，所有老旧的配置都会会清除。

该阶段需要阻止网络服务启动以及老的配置被应用，这可能带来一些负面的影响，比如 DHCP 服务挂起，或者已经广播了老的 hostname，这可能导致系统进入一个奇怪的状态需要重启网络设备。

cloud-init 然后再继续启动系统，将网络配置应用后启动。

### Network
在 local 阶段后，网络服务启动后，启动

	cloud-init.service

该阶段需要所有的网络配置已经被应用，并且网络在线，然后才会应用所有的 user-data

- 递归检索任何 `#include` 或者 `#include-once` 包括 http
- 解压缩任何压缩的内容
- 运行任何找到的 part-handler

该阶段运行 `disk_set` 和 `mounts` 模块，可能会分区并格式化任何配置挂载点（比如 `/etc/fstab`中）的磁盘。这个模块不能再早运行，因为有可能有些信息来源于网络，只有等网络信息获取到后才能执行。比如用户可能在网络资源中提供了挂载点配置信息。

在一些云服务中，比如 Azure，这个阶段会创建可以被挂载的文件系统。

`part-handler` 也会在这个阶段运行，包括 cloud-config `bootcmd`。

### Config
在网络启动后运行：

	cloud-config.service

这个阶段只会运行 config 模块，不会对其他阶段产生影响的模块在这里运行。

### Final
启动的最后阶段运行：

	cloud-final.service

用户登录系统后习惯于运行的脚本在这个阶段运行，包括：

- 包安装
- 配置管理的插件 (puppet, chef, salt-minion)
- 用户脚本（包括 `runcmd`)

## Install and use cloud-init under Proxmox
cloud-init 一般是安装在虚拟机中的，Ubuntu 系的系统直接安装即可：

	apt install cloud-init

绝大部分的发行版会提供开箱即用 (ready-to-use) 的 Cloud-Init 镜像（一般以 `.qcow2` 文件发布），所以你可以下载这些文件，然后直接导入。比如说 Ubuntu 提供的镜像：<https://cloud-images.ubuntu.com/>

虽然大部分发行版都提供了开箱即用的 Cloud-Init 镜像，但还是推荐如果要更高的定制化需求可以自己来制作符合自己需求的镜像。

在 Proxmox 下，一旦制作好了 Cloud-Init 镜像，推荐将该镜像转换成 VM template, 通过 template 可以快速创建虚拟机。

	# download
	wget https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.img
	# create a new vm
	qm create 9000 --memory 2048 --net0 virtio,bridge=vmbr0
	# import the downloaded disk to local-lvm storage
	qm importdisk 9000 bionic-server-cloudimg-amd64.img local-lvm
	# finally attach the new disk to the VM as scsi drive
	qm set 9000 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9000-disk-1

Add cloud-init CDROM drive

	qm set 9000 --ide2 local-lvm:cloudinit

为了从 Cloud-Init 镜像直接启动需要设置 bootdisk 参数到 `scsi0`，然后设置 BIOS 从 disk 启动

	qm set 9000 --boot c --bootdisk scsi0

然后配置 serial console 将其作为显示输出，这是 OpenStack 镜像必须设置的内容

	qm set 9000 --serial0 socket --vga serial0

### Prepare template
最后就可以将 VM 转换成 template，然后通过该模板就可以快速创建 clones，从 VM templates 部署系统要远远快于一个完整的 clone:

	qm template 9000

### Deploying Cloud-Init Templates
可以使用如下命令从 template 中克隆系统：

	qm clone 9000 123 --name ubuntu2

设置 SSH，及网络（这里的 IP 地址需要改成自己的网络环境的地址）：

	qm set 123 --sshkey ~/.ssh/id_rsa.pub
	qm set 123 --ipconfig0 ip=10.0.10.123/24,gw=10.0.10.1


## 配置文件地址 {#config}

cloud-init 配置文件在：

	/etc/cloud/cloud.cfg
	/etc/cloud/cloud.cfg.d/*.cfg

cloud-init 在配置文件 `/etc/cloud/cloud.cfg` 中定义了各个阶段需要执行的任务，任务以 module 形式组织。
cloud.cfg 中指定了 `set_hostname` 这个 module, 则表示 cloud-init 会执行设置 hostname 的任务，但是具体设置的内容由 metadata 指定。

cloud-init 的日志在：

	/var/log/cloud-init-output.log: 每一个阶段的输出
	/var/log/cloud-init.log: 每一个操作更详细的调试日志
	/run/cloud-init: contains logs about how cloud-init decided to enable or disable itself, as well as what platforms/datasources were detected. These logs are most useful when trying to determine what cloud-init ran or did not run.

数据存放在：

	/var/lib/cloud

## 在 Ubuntu Server 18.04 中设置静态 IP 地址
在安装 ubuntu server 18.04 的时候没有选择用静态地址，所以路由器 DHCP 随机分配了一个，然后进系统才想起来配置一下静态地址。传统的做法是修改 `/etc/network/interfaces` 文件，配置接口的静态地址即可。不过网上搜索一番学习之后发现了一个新方法，使用 netplan 来做修改。[^netplan]

[^netplan]: <https://www.techrepublic.com/article/how-to-configure-a-static-ip-address-in-ubuntu-server-18-04/>

修改 `/etc/netplan/50-cloud-init.yaml` 文件，原来的 DHCP 配置可以看到 `dhcp4: yes` 这一行配置的是 `yes`，现在修改成这样：

	network:
		ethernets:
			ens18:
				dhcp4: no
				addresses: [192.168.2.10/24]
				gateway4: 192.168.2.1
				nameservers:
						addresses: [114.114.114.114, 8.8.8.8]
		version: 2

然后应用到接口：

	sudo netplan --debug apply
	sudo netplan apply

这里千万要小心配置，如果配错可能导致无法连上系统的！

## reference

- <https://cloud-init.io/>
- <https://pve.proxmox.com/wiki/Cloud-Init_FAQ>
- <https://cloudinit.readthedocs.io/en/latest/>
