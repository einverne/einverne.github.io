---
layout: post
title: "使用 Clonezilla 将硬盘中系统恢复到虚拟机中"
tagline: ""
description: ""
category: 经验总结
tags: [clonezilla, system, fusion, vmware, virtual-machine, linux, restore]
last_updated:
---

今年陆陆续续将工作的环境迁移到了 macOS，虽然已经把日常的资料迁移到了 macOS，但是之前的 Linux 上还有一些配置，以及可以的一些测试还需要用到 Linux 虚拟机，所以我就想能不能用 Clonezilla 将磁盘中的系统备份然后恢复到虚拟机里面。因为我发现 macOS 下的 [Fusion](https://www.vmware.com/asean/products/fusion.html) 还是很强大的。

之前已经写过[使用 Clonezilla 备份和恢复系统](/post/2018/03/clonezilla-backup-and-restore-tutorial.html)、[使用 Clonezilla 克隆系统](/post/2016/08/clonezilla-clone-system.html), [Clonezilla 恢复系统时可能遇到的问题](/post/2017/09/linux-system-boot-sequence.html) ，这里关于备份的部分就不再赘述。

## 准备工作
开始之前需要先准备几个东西：

- 备份好的系统镜像，最好是能放到移动硬盘中
- Clonezilla ISO 镜像
- 安装好的 Fusion 软件
- 足够的空间可以恢复系统镜像

## 恢复工作
通过 Clonezilla 将整块硬盘备份成为 Images，然后在 Fusion 中新建虚拟机 Ubuntu 64 bit 类型。

- 在新建的虚拟机设置中，CD/DVD (SATA) 中装载 Clonezilla 的 ISO 镜像。
- 在 USB & Bluetooth 中，Advanced USB options，将 USB Compatibility 选为 USB 3.1
- 在 Startup Disk 中选择 CD/DVD 作为启动设备
- 启动虚拟机
- 这个时候会进入 Clonezilla 的界面，之后的步骤就和在 Clonezilla 中恢复一个 Image 一样了。等待恢复一段时间即可完成。

## 问题

问题： The device 'xxx' was unable to connect to its ideal host controller.

在虚拟机设置 USB 设置里面，确保使用 USB compatibility 3.0 以上。

具体解决方法：

- 关闭虚拟机
- 到 Settings -> USB & Bluetooth 设置中，可以看到插入的 USB 设备
- 在 Advance USB options 中
    - USB compatibility： USB 3.1
- 启动虚拟机，启动后在 UBS 设置中勾选需要分享的 USB 设备

from: <https://communities.vmware.com/t5/VMware-Fusion-Discussions/USB-3-0-support/m-p/1288281>

