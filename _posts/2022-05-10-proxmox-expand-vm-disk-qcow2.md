---
layout: post
title: "Proxmox 扩展 VM 虚拟机磁盘容量"
aliases:
- "Proxmox 扩展 VM 虚拟机磁盘容量"
tagline: ""
description: ""
category: [ 经验总结 , Proxmox-VE ]
tags: [ proxmox, pve, linux, vm, virtual-machine, ]
last_updated: 2022-05-14 02:47:32
create_time: 2022-05-11 09:00:45
---

之前在 Proxmox 上给 Ubuntu 划分了 64GB 的空间，运行一段时间之后磁盘空间剩余不多，就抽时间扩展一下。本文就记录一下给 Proxmox VE 的虚拟机扩展的过程。其实之前的文章里面也略微提到过一些，但是没有完整记录。

本来想着是这一篇文章把虚拟机的扩展和缩减空间一并整理了，但写着写着篇幅就比较大了，本文最后还是集中在扩容部分，缩减（shrink） 部分有机会再整理吧。

## 扩容之前
在扩容之前，为了防止发生错误，请先备份虚拟机，然后关闭虚拟机操作。

关于备份的操作可以参考： [Proxmox VE 下备份和恢复虚拟机](/post/2021/11/proxmox-ve-backup-and-restore.html)

## 虚拟机磁盘扩容

在 Proxmox VE 管理后台，点击虚拟机，在 Hardware 中选中 Hard Disk，然后在菜单栏中就能看到 Resize disk

![proxmox resize vm disk](https://photo.einverne.info/images/2022/05/11/drb6.png)

不过需要注意的是，这里的只能给虚拟机的磁盘增加容量，而不能缩小容量，关于缩小容量的操作以后有机会再写。

图中可以看到原始的虚拟机磁盘分配了 64GB，我又扩容了 64GB。

扩容之后启动虚拟机，SSH 登录，然后执行 `df -h`

```
Filesystem      Size  Used Avail Use% Mounted on
udev            7.8G     0  7.8G   0% /dev
tmpfs           1.6G  1.5M  1.6G   1% /run
/dev/sda2        63G   38G   23G  63% /
tmpfs           7.9G  4.0K  7.9G   1% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           7.9G     0  7.9G   0% /sys/fs/cgroup
/dev/loop0       56M   56M     0 100% /snap/core18/2344
/dev/loop2       62M   62M     0 100% /snap/core20/1434
/dev/loop1       56M   56M     0 100% /snap/core18/2409
mergerfs        5.4T  4.6T  510G  91% /mnt/storage
/dev/loop3       68M   68M     0 100% /snap/lxd/22753
/dev/loop6       44M   44M     0 100% /snap/snapd/15177
/dev/loop7       62M   62M     0 100% /snap/core20/1405
/dev/loop5       45M   45M     0 100% /snap/snapd/15534
/dev/loop4       68M   68M     0 100% /snap/lxd/22526
/dev/sdd1       1.8T  1.6T  196G  89% /mnt/sdb1
/dev/sdb1       1.8T  1.6T  117G  94% /mnt/sdd1
/dev/sdc1       1.8T  1.6T  198G  89% /mnt/sdc1
tmpfs           1.6G     0  1.6G   0% /run/user/1000
```

可以看到系统分区的容量 `/dev/sda2` 并没有扩展。

还可以用 `sudo fdisk -l` 来查看。

然后检查一下分区，执行 `sudo lsblk`

```
❯ sudo lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0    7:0    0 55.5M  1 loop /snap/core18/2344
loop1    7:1    0 55.5M  1 loop /snap/core18/2409
loop2    7:2    0 61.9M  1 loop /snap/core20/1434
loop3    7:3    0 67.8M  1 loop /snap/lxd/22753
loop4    7:4    0 67.9M  1 loop /snap/lxd/22526
loop5    7:5    0 44.7M  1 loop /snap/snapd/15534
loop6    7:6    0 43.6M  1 loop /snap/snapd/15177
loop7    7:7    0 61.9M  1 loop /snap/core20/1405
sda      8:0    0  128G  0 disk
├─sda1   8:1    0    1M  0 part
└─sda2   8:2    0   64G  0 part /
```

可以看到系统的分区 sda2 确实是没有完全占用全部的磁盘（sda）。这个时候我们只需要扩展一下系统分区即可。

我们可以使用很多种方式（`parted`, `growpart`, `cfdisk`）扩展分区，这里我们就使用 `growpart` 命令。

在 Debian 和 Ubuntu 下 `growpart` 命令在 [cloud-guest-utils](https://packages.debian.org/stretch/cloud-guest-utils) 包中。

注意这里的数字 `2` 要替换成自己的分区号。

    sudo growpart /dev/sda 2

结果：

```
❯ sudo growpart /dev/sda 2
CHANGED: partition=2 start=4096 old: size=134211584 end=134215680 new: size=268431327 end=268435423
```

没有使用 [[LVM]]，就使用 `resize2fs`，执行：

    sudo resize2fs /dev/sda2

执行结果：

```
❯ sudo resize2fs /dev/sda2
resize2fs 1.45.5 (07-Jan-2020)
Filesystem at /dev/sda2 is mounted on /; on-line resizing required
old_desc_blocks = 8, new_desc_blocks = 16
The filesystem on /dev/sda2 is now 33553915 (4k) blocks long.
```

之后在查询 `df -h` 就看到空间完美的被使用了。

如果使用了 LVM，需要执行如下步骤：

```
sudo pvresize /dev/sda2
```

更新逻辑卷的大小：

```
sudo lvresize --extents +100%FREE --resizefs /dev/mapper/ubuntu--vg-ubuntu--lv
```

## reference

- <https://medium.com/google-cloud/resize-your-persist-disk-on-google-cloud-on-the-fly-b3491277b718>
