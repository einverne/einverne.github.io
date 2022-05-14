---
layout: post
title: "在 Proxmox VE 上使用 qm 命令管理虚拟机"
aliases: "在 Proxmox VE 上使用 qm 命令管理虚拟机"
tagline: ""
description: ""
category: [ 学习笔记 , Proxmox-VE ]
tags: [proxmox, pve, linux, debian, qm, vm]
last_updated:
---

`qm` 是 [[Proxmox VE]] 系统上用来管理 Qemu/Kvm 虚拟机的命令。可以用这个命令来**创建**，**销毁**虚拟机，也可以用它来控制虚拟机的启动，暂停，继续和停止。另外也可以用 qm 命令来设定虚拟机的配置。`qm` 命令也可以用来创建和删除虚拟磁盘 (virtual disks).


## Usage
使用已经上传到 `local` storage 的 iso 文件来在 `local-lvm` storage 上创建一个 4G IDE 的虚拟磁盘。

	qm create 300 -ide0 local-lvm:4 -net0 e1000 -cdrom local:iso/proxmox-mailgateway_2.1.iso

启动 VM

	qm start 300

发送一个停止请求，并等待 VM 停止：

	qm shutdown 3000 && qm wait 300

等待 40 秒：

	qm shutdown 3000 && qm wait 300 -timeout 40


## Configuration
虚拟机的配置文件可以在 `/etc/pve/qemu` 文件找到。

配置文件都是纯文本，你可以用任何编辑器来编辑。不过建议用 `qm` 命令或者通过界面来进行修改。对配置的任何修改都需要重启 VM 才能生效。



