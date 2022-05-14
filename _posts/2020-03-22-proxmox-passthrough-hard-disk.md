---
layout: post
title: "Proxmox VE 设定直通硬盘"
aliases: "Proxmox VE 设定直通硬盘"
tagline: ""
description: ""
category: [ 学习笔记 , Proxmox-VE ]
tags: [proxmox, pve, virtual, linux, debian, ]
last_updated:
---

之前的文章讲了 [Proxmox VE 的安装](/post/2020/03/proxmox-install-and-setup.html)，以及在此基础上又安装了 OpenMediaVault，现在我的机器上一共三块硬盘，120G SSD 安装了系统，并作为默认的 lvm，放一些 ISO，以及存放一些系统盘，另外的 1T 准备做 Proxmox 相关的数据盘，而剩下的一块 4T 盘想要直通给 OpenMediaVault 做数据盘。所以就产生了这样的一个需求。

首先在设定之前，需要知道 Linux 下的硬盘都会以文件方式存放在 `/dev/disk/by-id/` 目录下。

## 查看硬件设备
安装：

	apt install lshw

查看：

	lshw -class disk -class storage

在输出的一串中，找到想要直通的硬盘 Serial，这一步一般也可以通过 Proxmox 后台 Disk 来查看到。比如我的情况是第一块硬盘 `/dev/sda` 然后假设 Serial 是 WFN1XXXX.

那么过滤出该硬盘：

	ls -al /dev/disk/by-id |grep WFN1XXXX

然后添加到具体 ID 的 KVM 虚拟机。

	qm set 100 -scsi2 /dev/disk/by-id/ata-ST4000DM004-2CV104_WFN1XXXX

说明：

- 这里 100 是我的 OpenMediaVault 虚拟机的 ID
- 后面是硬盘的位置，这里的参数 `-scsi2` 表示的是使用 [[SCSI]] 的第二块硬盘，如果你要加多块硬盘，数字 2 需要往后加 `-scsi3` 这样。

如果要检查虚拟机 100 中已经添加的硬盘，可以在 Proxmox 后台，点击虚拟机 ID，然后在 Hardware 中看 Hard Disk。

![pve-hard-disk-pass-through.png](/assets/pve-hard-disk-pass-through.png)


## 检查是否配置成功
在上面添加到虚拟机之后，可以在 Proxmox 界面中查看，或者用命令：

	grep "WFN" /etc/pve/qemu-server/100.conf

理论上应该输出 scsi2 然后后面是硬盘的位置及编号。

然后就能在 OpenMediaVault 中识别出该硬盘了。在 OpenMediaVault 中识别出硬盘之后就可以把这个硬盘加到联合硬盘池里面，扩展存储空间。

## SCSI vs VIRTIO
上面 `qm` 命令中用了 `-scsi2` 这里指的是磁盘总线类型 (scsi) 和编号 (2)，目前磁盘总线类型大致上有这么几种：

- IDE (Integrated Drive Electronics, 电子集成驱动器） - Slow Write in the Guest System
- SCSI (Small Computer System Interface, 小型计算机系统接口，用于计算机和设备比如硬盘，光驱，打印机等等的系统级接口和独立处理器标准） - Faster Write(as IDE) in Guest System
- VIRTIO - Fastest Write (more that SCSI and IDE) in the Guest System, but only with extra Drivers (In Guest)

三种类型的对比：



## reference

- <https://pve.proxmox.com/wiki/Physical_disk_to_kvm>
- <https://pve.proxmox.com/wiki/Paravirtualized_Block_Drivers_for_Windows>
