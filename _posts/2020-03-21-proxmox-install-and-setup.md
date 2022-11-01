---
aliases: 
layout: post
title: "Proxmox 安装和设置"
alias: "Proxmox 安装和设置"
tagline: ""
description: ""
category: [ 学习笔记 , Proxmox-VE ]
tags: [proxmox, pve, virtual, virtual-machine, ]
last_updated: 2022-11-01 03:11:32
create_time: 2022-10-29 08:36:49
---

接触虚拟化的过程中慢慢的了解到了 [[Proxmox VE]]，在此之前是看到很多人在用 [[ESXi]]，一款 VMware 的商业化产品，个人授权是免费的，不过 Proxmox VE 是一个基于 Debian 的开源虚拟化系统，对于我这样的初学者，学习过程要比产品的稳定性来的重要，所以对我个人而言 Proxmox 是一个不错的选择。

Proxmox VE 全称是 Proxmox Virtual Environment 是一个开源的虚拟化解决方案，基于 QEMU/KVM 和 LXC。

> Proxmox Virtual Environment is an open source server virtualization management solution based on QEMU/KVM and LXC. You can manage virtual machines, containers, highly available clusters, storage and networks with an integrated, easy-to-use web interface or via CLI. Proxmox VE code is licensed under the GNU Affero General Public License, version 3.

Proxmox VE，是一个开源的服务器虚拟化环境 Linux 发行版。Proxmox VE 基于 Debian，使用基于 Ubuntu 的定制内核，包含安装程序、网页控制台和命令行工具，并且向第三方工具提供了 REST API，在 Affero 通用公共许可证第三版下发行。

Proxmox VE 支持两类虚拟化技术：基于容器的 LXC（自 4.0 版开始，3.4 版及以前使用 OpenVZ 技术） 和硬件抽象层全虚拟化 KVM。

Proxmox 支持的虚拟化：

- 基于内核的 [[KVM]] (Kernel-based Virtual Machine)
- 基于容器的虚拟化技术 [[LXC]]（Linux Containers）

## 准备工作 {#prerequisite}
安装 Proxmox VE 之前有几件必须的东西需要准备：

- Proxmox VE ISO 镜像，[[balenaEtcher]] 安装程序
- 一个空 U 盘，容量不用太大，也不能小到 Proxmox ISO 文件都放不下
- 主机 (64 位 CPU，至少 1G 内存，支持 KVM 的主板`egrep '(vmx|svm)' /proc/cpuinfo`），键盘和显示器（安装过程中需要，安装后就不用了）

## 安装 {#installation}
和安装其他 Linux 系统一样，先用 Etcher 将 Proxmox VE ISO 写入 U 盘。或者使用 `dd` 命令：

	# dd bs=1M conv=fdatasync if=./proxmox-ve_*.iso of=/dev/XYZ

一定要注意 `of` 后别写错设备。如果不知道 dd 命令如何使用千万别复制粘贴上面命令。

将 U 盘插入主机，启动硬件，在 BIOS 中选择 U 盘启动，或者使用 F12 或者 F2，或者 DELETE 等等按键选择 U 盘启动。然后在 Proxmox 安装程序中下一步下一步既可，注意安装时输入的局域网 IP 地址，后面需要用该 IP 或者 (hostname) 来访问 Proxmox 的 Web 管理界面。

## 使用 {#usage}

安装完成后，重启系统，进入 Proxmox VE，等待屏幕显示黑色登录等待命令，可以使用局域网中其他电脑登录：

	https://ip:8006

这里有两点需要注意，一定要用 https 访问，我用 http 访问是没有回应的，还重装了一遍，还以为有硬件故障检查了半天，甚至 root 登录进去重启了各种服务，最后发现必须要使用 https 登录；第二点就是输入安装时设置的 IP 地址，加上 8006 端口进行访问。

### 设置 host
PVE 官方要求设置 `/etc/hosts` 防止出现问题，可以手动执行 `hostnamectl set-hostname pve` 将本机 hostname 设置为 pve

```
127.0.0.1 localhost.localdomain localhost
your.ip pve.domain.com pve
```

### 设置更新源 {#source}
Proxmox 源自于 Debian，所以 Proxmox 也可以用 apt 的包管理。但是 Proxmox 维护了一套自己的软件源，如果没有订阅企业授权，在 apt update 的时候会报错。所以需要注释掉企业的 source list:

	vi /etc/apt/sources.list.d/pve-enterprise.list
	然后用 # 注释掉其中的地址
	# deb https://enterprise.proxmox.com/debian/pve buster pve-enterprise

然后添加非订阅的源，修改 `vi /etc/apt/sources.list`: [^non]

	# PVE pve-no-subscription repository provided by proxmox.com,
	# NOT recommended for production use
	deb http://download.proxmox.com/debian/pve buster pve-no-subscription

或者直接创建一个新文件：

	echo 'deb http://download.proxmox.com/debian/pve buster pve-no-subscription' >> /etc/apt/sources.list.d/pve-no-subscription.list

[^non]: <https://pve.proxmox.com/wiki/Package_Repositories>

国内的 Proxmox VE 软件源镜像：[^pr]

	deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian buster pve-no-subscription

[^pr]: <https://mirror.tuna.tsinghua.edu.cn/help/proxmox/>

设置 Debian 国内镜像

Proxmox VE 基于 Debian 的软件源都可以替换成国内的镜像：[^tuna]

	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free

[^tuna]: <https://mirror.tuna.tsinghua.edu.cn/help/debian/>


然后更新 `apt update`，然后升级 `apt upgrade`

### 使用 sudo
生产环境中如果不想一直使用 root 账户来管理后台，可以参考[官网](https://pve.proxmox.com/wiki/User_Management) 用户管理一章节的内容来添加账户，并分配给不同的角色。这一步可以先跳过，等后面部署真正用起来后再配置就行。

安装 sudo

	apt install sudo

然后编辑 `visudo`:

	einverne    ALL=(ALL:ALL) NOPASSWD:ALL

### BBR
目前的Proxmox VE版本的linux内核版本比较新，已经包含了bbr模块了。

如果没有包含可以使用如下方法：

```
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
# 验证
lsmod | grep bbr
```

## 配置 {#setup}
经过上面的配置 Proxmox 已经处于一个可用的状态。

通过 ISO 镜像安装 Proxmox 后 Proxmox 会自动创建一个 pve 的 Volume Group，并在其上面创建 root, data 和 swap 三个逻辑卷。

默认情况下 Proxmox 会自动创建 local(pve) 和 local-lvm(pve) 这两个 Storage，分别用来存放镜像和磁盘：

- local 是 Directory 类型，用来存放 VZDump backup file, ISO Images, Container template
- local-lvm 是 LVM-Thin 类型，用来存放 Disk image, Container

上面两个存储是在 Proxmox 安装后自动创建的，使用 `fdisk -l` 来看，我的 Proxmox 是安装在了 `/dev/sdc` 这款 120G 的 SSD 上。


### Storage

Proxmox 支持两类文件存储类型：

- 本地 (ZFS, LVM, Linux 支持的任何文件系统）
- 网络存储 (NFS, CIFS, iSCSI)

本地的存储类型肯定是最稳定的，但问题也就是空间大小有限制。但假如在万兆局域网中，网络传输造成的瓶颈就不存在了，那么可以创建网络存储，挂载其他设备，比如 NAS 上的文件系统。

### 建立 Directory
在 GUI 界面中 Disks -> Directory 新建，要注意这里只有没有任何数据，没有任何分区的硬盘才能在菜单中显示，然后看到创建的执行日志：

	# /sbin/sgdisk -n1 -t1:8300 /dev/sda
	The operation has completed successfully.
	# /sbin/mkfs -t ext4 /dev/sda1
	mke2fs 1.44.5 (15-Dec-2018)
	Creating filesystem with 976754385 4k blocks and 244195328 inodes
	Filesystem UUID: rrrrr317-3e7f-4352-bda6-xxxxccde13fb
	Superblock backups stored on blocks:
		32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
		4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968,
		102400000, 214990848, 512000000, 550731776, 644972544

	Allocating group tables:     0/29809 done
	Writing inode tables:     0/29809 done
	Creating journal (262144 blocks): done
	Writing superblocks and filesystem accounting information:     0/29809 done

	# /sbin/blkid /dev/sda1 -o export
	Created symlink /etc/systemd/system/multi-user.target.wants/mnt-pve-sda.mount -> /etc/systemd/system/mnt-pve-sda.mount.
	TASK OK

可以看到我创建的 Directory 在 `/dev/sda` 这款硬盘上，首先 Proxmox 用 `sgdisk` 创建了一个分区 `sda1`，然后格式化了该分区为 ext4（这是我在 UI 界面中选择的），最后创建了一个挂载点，Proxmox 中是用 systemd 来管理的，具体可看到硬盘被挂载在了 `/mnt/pve/sda` 这个地方。

### 设置 ISO Directory
点击左侧边栏 DataCenter 下默认的 pve 节点，然后在右侧找到 Disks -> Directory ，新建 Directory。

这个时候需要注意，只有当硬盘没有任何数据的时候，才会在这里的菜单中显示。我在安装的时候是用的一块已经划分了分区的 1T 硬盘，所以需要 ssh 到后台，用 `fdisk /dev/sda` 来将分区删掉才能显示。

### 设置虚拟机的目录 Volume Group
和 ISO 目录一样，ISO 目录用来存放 ISO 镜像，虚拟机目录则是真正划分给虚拟机用的分区。在 Disks 中选中 LVM，创建 Volume Group。

## Benchmark
在安装成功的 Proxmox 系统中可以执行 `pveperf` 来检查一下 CPU 和其他硬件的性能。

## 创建 VM 以 OpenMediaVault 为例
右上角创建 Virtual Machine，这里以安装 OpenMediaVault 来举例子。在 OpenMediaVault 下载好镜像 ISO，并上传到 Proxmox 中 local(pve) 中。

### General
创建虚拟机的第一步就是给虚拟机起一个名字。PVE 使用数字来标识虚拟机，Name 字段起一个标志性的名字。

### OS
在操作系统页面中，在 Storage 中选择刚刚建立的 ISO storage 目录，然后选择刚刚上传的 OpenMediaVault ISO 文件。

默认 Guest OS 会自动识别出对应的版本，下一步即可。

### System
默认即可。

### Hard Disk

设置硬盘大小，这一块硬盘会划分给 OpenMediaVault 系统，因为 OpenMediaVault 安装后占用体积也非常小，划分 16G 磁盘空间就已经足够。

### CPU
设置虚拟机可以使用的 CPU 核心数。

Type 选择 Host，可以提供最好的性能。

### Memory

设置内存，OpenMediaVault 内存占用也非常少，动态的设定一个 1G 到 4G 的动态范围。

高级设置中可以设置动态的内存使用范围。

### Network
默认

点击既可创建成功。


## 其他 {#other}
安装及使用过程中的一些疑问和操作。

### 如何移除 Storage
在界面中通过如下来移除一个存储：

	Datacenter -> Storage -> Remove 选中的内容。

不过需要注意的是如果 GUI 移除了 Storage 定义， mount 文件并不会被删除，如果想要删除 mount 文件，只能通过 SSH 登录后台进行。Proxmox 中每一个 mount 都是由 systemd 管理，可以看到类似如下这样的文件。

假如新建了一个 `testxfs` 的存储，想要删掉：

	cat /etc/systemd/system/mnt-pve-testxfs.mount
	[Install]
	WantedBy=multi-user.target

	[Mount]
	Options=defaults
	Type=xfs
	What=/dev/disk/by-uuid/xxxx6149-ce8f-4e36-94c4-xxxxxxj33e72
	Where=/mnt/pve/testxfs

	[Unit]
	Description=Mount storage 'testxfs' under /mnt/pve

如果想要彻底删除的话，用 `rm` 把这个文件也删除。[^1]

	systemctl disable mnt-pve-testdir.mount
	umount /mnt/pve/testdir
	rm /etc/systemd/system/mnt-pve-testdir.mount

[^1]: <https://forum.proxmox.com/threads/remove-unused-directory-from-gui.63451/>

## 如何选择存储磁盘格式
在创建磁盘的时候可以选择 Directory, ZFS, LVM, LVM-Thin 等等。

![Proxmox Storage types](/assets/proxmox-storage-types.png)


### Directory
Directory 是最常见的文件格式，Proxmox 包括了 ext4，xfs 。更多的文件格式可以参考我之前的[文章](/post/2020/02/linux-nas-file-system.html)

> Proxmox VE can use local directories or locally mounted shares for storage. A directory is a file level storage, so you can store any content type like virtual disk images, containers, templates, ISO images or backup files.

Directory 可以存储任何的类型。

### LVM 和 LVM-Thin
LVM 是 Logical Volume Manager（逻辑卷管理）的简写，是 Linux 环境下对磁盘分区进行管理的一种机制

在 Proxmox 中 只有 LVM 有 Snapshot 快照功能，而 LVM-Thin 是没有的。相反如果建立了 LVM 分区，那么整个分区只能给虚拟机或者容器使用，其他文档是无法放进去的，LVM-Thin 则没有这个限制。[^lvm]

[^lvm]: <https://pve.proxmox.com/wiki/Storage:_LVM>


### ERROR 挂载 NFS
在我想挂载 NAS 上 NFS 时，Proxmox 给了这错误，至今无解，不清楚是 NFS 版本不兼容的原因还是其他。

> create storage failed: error with cfs lock 'file-storage_cfg': storage 'Network-Proxmox' is not online (500)

## 虚拟化技术
简单总结。

### OpenVZ
OpenVZ 基于 Linux 内核的操作系统级虚拟化技术。OpenVZ 允许物理服务器同时运行多个操作系统。目前正逐渐被 KVM 代替。

### KVM
[[KVM]] 全称是 Kernel-based Virtual Machine，基于内核的虚拟机，

### Xen
Xen 是开放源代码虚拟机监视器，由 XenProject 开发，经过十几年时间的发展，目前正逐渐被 KVM 代替。

### LXC
[[LXC]] 名字来自于 Linux Containers 缩写，是操作系统级的虚拟化，LXC 是 Linux 内核容器功能的一个用户空间接口。

## 其他虚拟化系统

### VMware ESXi
VMware ESXi 可以直接存取控制底层资源，有效的利用硬件。ESXi 是 VMware 推出的虚拟化系统，对个人的授权是免费的。

### Hyper-V
Hyper-V 是以 Hypervisor 为基础的虚拟化技术。适用于 x64 位的 Windows 系统。

## Further

- Proxmox 提供的官方[文档](https://pve.proxmox.com/pve-docs/)
- Proxmox 官方 [Wiki](https://pve.proxmox.com/wiki/Main_Page)

## reference

- <https://en.wikipedia.org/wiki/Proxmox_Virtual_Environment>

