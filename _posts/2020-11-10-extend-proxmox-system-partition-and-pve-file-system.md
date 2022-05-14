---
layout: post
title: "扩展 Proxmox 系统分区以及 Proxmox 文件系统初识"
tagline: ""
description: ""
category: [ 学习笔记, Proxmox-VE ]
tags: [proxmox, linux, nas, openmediavault, system, fdisk, partition, gpt, clonezilla]
last_updated:
---

昨天想要扩展一下之前[安装的 Proxmox](/post/2020/03/proxmox-install-and-setup.html) 容量，对系统进行了一次关机，然而关机之后就悲剧的发现在 U 盘中的系统启动不了了，将 U 盘拔下检测之后发现 U 盘可能挂了，一个全新的 U 盘，在连续 192 天运行之后挂掉了。无奈之下只能想办法先恢复一下 Proxmox 系统以及安装在系统之上的 OpenMediaVault 了。

恢复的过程倒也是很麻烦，只不过这一次想稳定一些，将系统还是安装在一块之前主力机上淘汰下的 SSD 上吧，所以用 [Clonezilla 先备份 SSD 上的系统](/post/2018/03/clonezilla-backup-and-restore-tutorial.html)，然后将之前 U 盘上的 Proxmox 系统恢复到 SSD 上，做完之后发现 Clonezilla 实际上是将整块 U 盘上的分区表，分区一并搬到了 SSD 上，所以在磁盘里面能看到实际 Proxmox 系统只是占用了 32G 的大小。那这个时候就需要将现在的 Proxmox 分区扩展到整块磁盘了。

这个时候就需要复习之前整理过的两个命令了 [fdisk](/post/2016/04/fdisk.html) 和 [parted](/post/2018/04/parted-linux-partition.html)。fdisk 用来查看磁盘的分区详情，然后使用 parted 对磁盘分区进行扩容。

不过在进入正题之前，先提前警告一下，对磁盘的操作请格外小心，请先备份好数据，或者找一块闲置的磁盘进行操作，否则可能丢失整块磁盘的数据！

## 前提知识

### Proxmox 的文件系统
在正式进入之前先来回顾一下 Proxmox 的文件系统，在全新安装的 Proxmox 系统上可以看到一块硬盘被划分了三个分区。

```
root@pve:~# fdisk -l /dev/sdd
Disk /dev/sdd: 232.9 GiB, 250059350016 bytes, 488397168 sectors
Disk model: Samsung SSD 850
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: AC6AD606-ED82-475B-A813-7----------2

Device       Start       End   Sectors   Size Type
/dev/sdd1       34      2047      2014  1007K BIOS boot
/dev/sdd2     2048   1050623   1048576   512M EFI System
/dev/sdd3  1050624 488397134 487346511 232.4G Linux LVM
```

上面已经是我扩容后的结果，扩容之前 `sdd3` 这个分区只有不到 30G。

说明：

- BIOS boot 分区是 GNU [[GRUB]] 来引导基于 Legacy BIOS 但是启动设备上有 GPT 格式分区表的操作系统时使用的分区。
- EFI System 分区是一块 FAT32 格式的分区，存储 EFI 引导程序以及启动时固件使用的应用程序。
- Linux LVM 分区则是系统真正可以使用的分区。LVM 是逻辑卷管理器，可以用来创建和管理逻辑卷，而不是直接管理磁盘，这就使得我们之后对分区大小进行调整变得可能。对 LVM 逻辑卷的扩大缩小并不会影响其中的已存储的数据。

接下来再来看看 LVM 分区下的逻辑卷。

```
Disk /dev/mapper/pve-swap: 3.5 GiB, 3758096384 bytes, 7340032 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/mapper/pve-root: 7 GiB, 7516192768 bytes, 14680064 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

Disk /dev/mapper/pve-vm--100--disk--0: 32 GiB, 34359738368 bytes, 67108864 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 65536 bytes / 65536 bytes
Disklabel type: dos
Disk identifier: 0x4236f4d0

Device                                 Boot    Start      End  Sectors  Size Id Type
/dev/mapper/pve-vm--100--disk--0-part1 *        2048 56868863 56866816 27.1G 83 Linux
/dev/mapper/pve-vm--100--disk--0-part2      56870910 67106815 10235906  4.9G  5 Extended
/dev/mapper/pve-vm--100--disk--0-part5      56870912 67106815 10235904  4.9G 82 Linux swap / Solari
```


从 `fdisk -l` 的输出可以看到 Proxmox 创建了三个逻辑卷分区：

- `/dev/mapper/pve-swap` 是 swap 分区
- `/dev/mapper/pve-root` 是 Proxmox 的 root 分区 7 GB
- `/dev/mapper/pve-vm--100--disk--0` 则是我在其中安装的 OpenMediaVault 划分给了它 32 GB 空间

使用 `lvdisplay` 可以看到逻辑卷的详细信息。可以看到 `/dev/mapper/pve-root` 就是 pve 卷组里面的逻辑卷。

```
root@pve:~# lvdisplay
  --- Logical volume ---
  LV Path                /dev/pve/swap
  LV Name                swap
  VG Name                pve
  LV UUID                cYatZ5-kif7-n8N2-v9c5-UOlb-wfLJ-qt35G7
  LV Write Access        read/write
  LV Creation host, time proxmox, 2020-11-10 18:42:21 +0800
  LV Status              available
  # open                 2
  LV Size                3.50 GiB
  Current LE             896
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0

  --- Logical volume ---
  LV Path                /dev/pve/root
  LV Name                root
  VG Name                pve
  LV UUID                dc0VlK-7DSo-lgzw-7Zxy-aK3s-jlTc-TPOmDA
  LV Write Access        read/write
  LV Creation host, time proxmox, 2020-11-10 18:42:22 +0800
  LV Status              available
  # open                 1
  LV Size                7.00 GiB
  Current LE             1792
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:1

  --- Logical volume ---
  LV Name                data
  VG Name                pve
  LV UUID                oNuSZd-JoDA-1jPW-Wdcs-q59D-vuDx-fDnUab
  LV Write Access        read/write
  LV Creation host, time proxmox, 2020-11-10 18:42:22 +0800
  LV Pool metadata       data_tmeta
  LV Pool data           data_tdata
  LV Status              available
  # open                 2
  LV Size                219.88 GiB
  Allocated pool data    1.72%
  Allocated metadata     1.84%
  Current LE             56290
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:4
```

到这里其实就能看到 Proxmox 安装的时候实际上创建了一个叫做 `pve` 的卷组 (Volume Group)，然后在上面分别创建了 swap, root, data 三个逻辑卷 (Logical Volume)。

## 什么是 LVM
LVM 是 Logical Volume Manager 逻辑卷管理的简称。

LVM 对底层的物理磁盘进行封装，向上以逻辑卷的形式提供。当上层的应用要访问文件系统的时候，不是通过直接操作分区，而是通过 VLM 的逻辑卷，对底层的磁盘进行管理。

LVM 最大的特点是可以对磁盘进行动态管理，逻辑卷大小可以在变更文件内容情况下动态调整。

### 基本术语

存储介质，系统的存储设备，比如常见的硬盘等等。

Physical Volume 物理卷，物理卷在逻辑卷管理中的最底层，实际上是物理硬盘的分区，也可以是整个物理硬盘。

Volume Group 卷组，建立在物理卷之上，一个卷组至少要包括一个物理卷，卷组建立之后可以动态添加物理卷到卷组中。逻辑卷管理系统中可以只有一个卷组，也可以拥有多个卷组。

Logical Volume 逻辑卷，建立在卷组之上，卷组中未分配的空间可用于建立新的逻辑卷，逻辑卷建立之后可动态地扩展和缩小空间。

## 扩容过程

如果 Proxmox 没有安装 `parted` 先安装：

	apt update && apt install -y parted

安装后再执行 `parted -l` 列出分区信息。

如果有弹出 Fix/Ignore 的提示，输入 Fix 快速修复。

### 扩容分区
使用 `fdisk -l` 来查看 Proxmox 在哪一块磁盘，以及磁盘上的分区信息，文章之前以及提过，可以看到 Proxmox 划分的三个分区没有完全利用 SSD 的全部空间。

对于我的系统，我的 Proxmox 安装在 `sdd` 这块硬盘上，使用 parted 对磁盘分区进行操作：

	parted /dev/sdd

进入交互模式后，可以使用 `print` 来查看分区信息，可以看到 LVM 分区只用了很小一部分空间，扩容：

	resizepart 3 100%

这里的 `3` 指的是分区编号，一定小心。

然后退出：

	quit

这个时候已经将磁盘剩余的空间都划分给了 `/dev/sdd3`

可以使用 `fdisk -l` 或 `parted` 的 print 来查看。

```
root@pve:~# parted /dev/sdd
GNU Parted 3.2
Using /dev/sdd
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print
Model: ATA Samsung SSD 850 (scsi)
Disk /dev/sdd: 250GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name  Flags
 1      17.4kB  1049kB  1031kB                     bios_grub
 2      1049kB  538MB   537MB   fat32              boot, esp
 3      538MB   250GB   250GB                      lvm
```

更新物理卷的大小：

	pvresize /dev/sdd3

提示更新成功。

### 扩容逻辑卷
查看 Proxmox 的逻辑卷内容，`cat /etc/pve/storage.cfg` 可以看到：

```
root@pve:~# cat /etc/pve/storage.cfg
dir: local
        path /var/lib/vz
        content iso,backup,vztmpl

lvmthin: local-lvm
        thinpool data
        vgname pve
        content rootdir,images
```

`local-lvm` 是对应着 `vgname` 这个叫做 pve 的 Volume Group 中的 data 名字的逻辑卷。

使用 `lvdisplay` 可以看到：

```
  --- Logical volume ---
  LV Name                data
  VG Name                pve
  LV UUID                oNuSZd-JoDA-1jPW-Wdcs-q59D-vuDx-fDnUab
  LV Write Access        read/write
  LV Creation host, time proxmox, 2020-11-10 18:42:22 +0800
  LV Pool metadata       data_tmeta
  LV Pool data           data_tdata
  LV Status              available
  # open                 2
  LV Size                29.88 GiB
  Allocated pool data    1.72%
  Allocated metadata     1.84%
  Current LE             56290
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:4
```

这里的 LV Size 就是逻辑卷的大小。

然后使用 `pvs` 查看物理卷的使用情况，在 PFree 里面能看到有很大部分的空间是没有使用的。

然后利用 `lvextend` 命令进行逻辑卷的扩容：

	lvextend -l +100%FREE /dev/pve/data

上面的命令会将 100% 空间划分给 data，如果只想要增加 10 GB，那么：

	lvextend -L +10G /dev/pve/data

如果熟悉 `lvresize` 也可以：

	lvresize --extents +100%FREE --resizefs /dev/pve/data

然后可以使用 `pvs` 和 `lvdisplay` 进行查看。


## reference

- <https://en.wikipedia.org/wiki/GUID_Partition_Table>
- <https://wiki.archlinux.org/index.php/LVM>
- <https://www.wnark.com/archives/118.html>
- <https://www.reddit.com/r/Proxmox/comments/aagsgn/extend_locallvm/>
