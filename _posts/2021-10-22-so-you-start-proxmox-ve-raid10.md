---
layout: post
title: "So you Start 独服 Proxmox VE 配置 RAID 10"
aliases: 
- "So you Start 独服 Proxmox VE 配置 RAID 10"
tagline: ""
description: ""
category: [ 经验总结, Proxmox-VE ]
tags: [ linux, raid, raid-10, proxmox, pve, dedicated-server, hard-disk, backup, so-you-start, ovh ]
last_updated:
---

之前购买的 So you Start(OVH 旗下品牌) 的独服，配置有 4 块 2T 的硬盘，但是 So you Start 后台默认的 RAID 级别是 RAID1，这样使得可用的空间只有 8T 中的 2T，25% 的使用率，虽然硬盘安全性级别比较高（允许多块硬盘损坏的情况下依然不丢数据），但是空间可用率太低了，所以折中一下可以使用 RAID-10（允许一块硬盘损坏而不丢失数据），这里就记录一下如何把 So you Start 的独服从 RAID-1 级别在线调整成 RAID-10。正常情况下 OVH 旗下的主机品牌，包括 OHV，So you Start, Kimsufi 都可以适用本教程，其他独服的操作也类似。


## 前提知识

- mdadm, fdisk 等基础命令的使用
- 对 RAID 级别有基础的了解
- 了解 Linux 下分区

## 几个主要的步骤

- 首先使用 So you Start 后台的系统安装工具，使用默认的 RAID1 安装 Debian Buster
- 然后在线调整 RAID1 到 RAID10
- 在 Debian 基础之上安装 [[Proxmox VE]]

主要分成后面几个步骤（具体的操作步骤和演示可以参考后文）：

    mdadm /dev/md1 --fail /dev/sdc1
    mdadm /dev/md1 --remove /dev/sdc1
    wipefs -a /dev/sdc1
    mdadm --grow /dev/md1 --raid-devices=2



first think about a partitioning scheme. usually there is no need to absolutely put everything on a single large partition. proxmox for instance puts disk images and whatnot into /var/lib/vz which then is an ideal mount point for a split partition.

## Install Debian
首先在 So you Start 后台管理面板中使用 Reinstall 重新安装系统。

- 使用 Custom 安装
- 在下一步分区中，使用 RAID1 安装系统，可以根据自己的需要调整分区大小，如果怕麻烦可以，可以把所有空间划分给 `/` 然后留一定空间给 `swap`。比如我的机器是 32G 的，可以给 16G swap，然后剩余的空间都划给 `/`。如果熟悉 Linux 的分区，并且想要自己定义剩下的空间给 RAID-x，或 ZFS，或 LVM，可以划分一个比如 2G 给 `/boot` 分区，然后划分240G 给 `/` 然后 16G 给 `swap`，之后可以把 `/` 从 RAID1 调整为 RAID10

安装完成进入系统：

    debian@pve:~$ lsb_release -a
    No LSB modules are available.
    Distributor ID: Debian
    Description:    Debian GNU/Linux 10 (buster)
    Release:        10
    Codename:       buster

## Reshape RAID
重新调整 RAID 级别。需要特别感谢 LET 上面的 [Falzo](https://www.lowendtalk.com/post/quote/174583/Comment_3292088) 根据他所提供的详细步骤我才完成了 RAID1 到 RAID10 的在线调整。

大致的步骤需要先将 RAID1 调整为 RAID0，然后在调整为 RAID10.

首先来查看一下默认的 RAID 信息：

```
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid1 sda2[0] sdc2[1] sdd2[3] sdb2[2]
      511868928 blocks super 1.2 [4/4] [UUUU]
      bitmap: 2/4 pages [8KB], 65536KB chunk

unused devices: <none>
```

可以看到有一个 md2 RAID，使用了 raid1，有四个分区分别是 sda2, sdc2, sdd2, sdb2 组合而成。

查看硬盘信息（模糊掉敏感的一些标识信息）：

```
root@pve:~# fdisk -l
Disk /dev/sdb: 1.8 TiB, 2000398934016 bytes, 3907029168 sectors
Disk model: HGST HUS7-----AL
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: B411C4C1-EA13-42F1-86D8-DC-------115

Device          Start        End    Sectors   Size Type
/dev/sdb1        2048    1048575    1046528   511M EFI System
/dev/sdb2     1048576 1025048575 1024000000 488.3G Linux RAID
/dev/sdb3  1025048576 1058603007   33554432    16G Linux filesystem


Disk /dev/sdc: 1.8 TiB, 2000398934016 bytes, 3907029168 sectors
Disk model: HGST HUS7-----AL
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: DA108B72-B409-4F9E-8FF1-0D---------8

Device          Start        End    Sectors   Size Type
/dev/sdc1        2048    1048575    1046528   511M EFI System
/dev/sdc2     1048576 1025048575 1024000000 488.3G Linux RAID
/dev/sdc3  1025048576 1058603007   33554432    16G Linux filesystem


Disk /dev/sdd: 1.8 TiB, 2000398934016 bytes, 3907029168 sectors
Disk model: HGST HUS-----0AL
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: DC27A340-79CB-437E-952F-97A-------A8

Device          Start        End    Sectors   Size Type
/dev/sdd1        2048    1048575    1046528   511M EFI System
/dev/sdd2     1048576 1025048575 1024000000 488.3G Linux RAID
/dev/sdd3  1025048576 1058603007   33554432    16G Linux filesystem


Disk /dev/sda: 1.8 TiB, 2000398934016 bytes, 3907029168 sectors
Disk model: HGST HU------0AL
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 76C633FE-ACC3-40FA-A111-2C--------C8

Device          Start        End    Sectors   Size Type
/dev/sda1        2048    1048575    1046528   511M EFI System
/dev/sda2     1048576 1025048575 1024000000 488.3G Linux RAID
/dev/sda3  1025048576 1058603007   33554432    16G Linux filesystem
/dev/sda4  3907025072 3907029134       4063     2M Linux filesystem


Disk /dev/md2: 488.2 GiB, 524153782272 bytes, 1023737856 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
```

然后可以通过 mdadm 命令 reshape RAID1，这一步可以直接在线执行，完全不需要 [[IPMI]] 等等额外的工具。

在线将 RAID1 转变成 RAID10 的步骤可以参考这篇[文章](https://www.berthon.eu/2017/converting-raid1-to-raid10-online/) 作者写的非常清楚。[[Converting RAID1 to RAID10 online]]

具体的步骤可以查看如下：

```
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid1 sda2[0] sdc2[1] sdd2[3] sdb2[2]
      511868928 blocks super 1.2 [4/4] [UUUU]
      bitmap: 2/4 pages [8KB], 65536KB chunk

unused devices: <none>
root@pve:~# mdadm /dev/md2 --fail /dev/sdc2
mdadm: set /dev/sdc2 faulty in /dev/md2
root@pve:~# mdadm /dev/md2 --remove /dev/sdc2
mdadm: hot removed /dev/sdc2 from /dev/md2
root@pve:~# wipefs -a /dev/sdc2
/dev/sdc2: 4 bytes were erased at offset 0x00001000 (linux_raid_member): fc 4e 2b a9
root@pve:~# mdadm /dev/md2 --fail /dev/sdd2
mdadm: set /dev/sdd2 faulty in /dev/md2
root@pve:~# mdadm /dev/md2 --remove /dev/sdd2
mdadm: hot removed /dev/sdd2 from /dev/md2
root@pve:~# wipefs -a /dev/sdd2
/dev/sdd2: 4 bytes were erased at offset 0x00001000 (linux_raid_member): fc 4e 2b a9
root@pve:~# mdadm --grow /dev/md2 --raid-devices=2
raid_disks for /dev/md2 set to 2
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid1 sda2[0] sdb2[2]
      511868928 blocks super 1.2 [2/2] [UU]
      bitmap: 3/4 pages [12KB], 65536KB chunk

unused devices: <none>
root@pve:~# mdadm --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid1
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 2
     Total Devices : 2
       Persistence : Superblock is persistent

     Intent Bitmap : Internal

       Update Time : Thu Oct 21 13:33:45 2021
             State : clean
    Active Devices : 2
   Working Devices : 2
    Failed Devices : 0
     Spare Devices : 0

Consistency Policy : bitmap

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 158

    Number   Major   Minor   RaidDevice State
       0       8        2        0      active sync   /dev/sda2
       2       8       18        1      active sync   /dev/sdb2
root@pve:~# sudo mdadm --grow /dev/md2 --level=0 --backup-file=/home/backup-md2
mdadm: level of /dev/md2 changed to raid0
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid0 sdb2[2]
      511868928 blocks super 1.2 64k chunks

unused devices: <none>
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid0
        Array Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 1
     Total Devices : 1
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 13:40:10 2021
             State : clean
    Active Devices : 1
   Working Devices : 1
    Failed Devices : 0
     Spare Devices : 0

        Chunk Size : 64K

Consistency Policy : none

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 163

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync   /dev/sdb2
root@pve:~# mdadm --grow /dev/md2 --level=10 --backup-file=/home/backup-md2 --raid-devices=4 --add /dev/sda2 /dev/sdc2 /dev/sdd2
mdadm: level of /dev/md2 changed to raid10
mdadm: added /dev/sda2
mdadm: added /dev/sdc2
mdadm: added /dev/sdd2
raid_disks for /dev/md2 set to 5
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid10 sdd2[5] sdc2[4](S) sda2[3](S) sdb2[2]
      511868928 blocks super 1.2 2 near-copies [2/1] [U_]
      [>....................]  recovery =  0.5% (2835392/511868928) finish=50.8min speed=166787K/sec

unused devices: <none>
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 2
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 13:42:49 2021
             State : active, degraded, recovering
    Active Devices : 1
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 3

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

    Rebuild Status : 1% complete

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 221

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      spare rebuilding   /dev/sdd2

       3       8        2        -      spare   /dev/sda2
       4       8       34        -      spare   /dev/sdc2
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 2
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 13:47:58 2021
             State : active, degraded, recovering
    Active Devices : 1
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 3

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

    Rebuild Status : 11% complete

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 554

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      spare rebuilding   /dev/sdd2

       3       8        2        -      spare   /dev/sda2
       4       8       34        -      spare   /dev/sdc2
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 2
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 13:48:29 2021
             State : clean, degraded, recovering
    Active Devices : 1
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 3

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

    Rebuild Status : 12% complete

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 588

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      spare rebuilding   /dev/sdd2

       3       8        2        -      spare   /dev/sda2
       4       8       34        -      spare   /dev/sdc2
root@pve:~# mdadm --grow /dev/md2 --raid-devices=4
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid10 sdd2[5] sdc2[4] sda2[3] sdb2[2]
      511868928 blocks super 1.2 64K chunks 2 near-copies [4/3] [U_UU]
      [>....................]  reshape =  0.2% (1387520/511868928) finish=67.4min speed=126138K/sec

unused devices: <none>
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 4
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 13:50:47 2021
             State : clean, degraded, reshaping
    Active Devices : 3
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 1

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

    Reshape Status : 1% complete
     Delta Devices : 2, (2->4)

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 725

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      spare rebuilding   /dev/sdd2
       4       8       34        2      active sync set-A   /dev/sdc2
       3       8        2        3      active sync set-B   /dev/sda2
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 4
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 13:51:59 2021
             State : active, degraded, reshaping
    Active Devices : 3
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 1

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

    Reshape Status : 3% complete
     Delta Devices : 2, (2->4)

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 769

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      spare rebuilding   /dev/sdd2
       4       8       34        2      active sync set-A   /dev/sdc2
       3       8        2        3      active sync set-B   /dev/sda2
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid10 sdd2[5] sdc2[4] sda2[3] sdb2[2]
      511868928 blocks super 1.2 64K chunks 2 near-copies [4/3] [U_UU]
      [====>................]  reshape = 21.8% (111798784/511868928) finish=59.6min speed=111736K/sec

unused devices: <none>
root@pve:~# mdadm --misc --detail /dev/md2
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 511868928 (488.16 GiB 524.15 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 4
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Thu Oct 21 14:05:44 2021
             State : active, degraded, reshaping
    Active Devices : 3
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 1

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

    Reshape Status : 22% complete
     Delta Devices : 2, (2->4)

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 1345

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      spare rebuilding   /dev/sdd2
       4       8       34        2      active sync set-A   /dev/sdc2
       3       8        2        3      active sync set-B   /dev/sda2
root@pve:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev             16G     0   16G   0% /dev
tmpfs           3.2G  8.9M  3.2G   1% /run
/dev/md2        481G  1.5G  455G   1% /
tmpfs            16G     0   16G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs            16G     0   16G   0% /sys/fs/cgroup
/dev/sdd1       511M  3.3M  508M   1% /boot/efi
tmpfs           3.2G     0  3.2G   0% /run/user/1000
root@pve:~# lsblk
NAME    MAJ:MIN RM   SIZE RO TYPE   MOUNTPOINT
sda       8:0    0   1.8T  0 disk
├─sda1    8:1    0   511M  0 part
├─sda2    8:2    0 488.3G  0 part
│ └─md2   9:2    0 488.2G  0 raid10 /
├─sda3    8:3    0    16G  0 part   [SWAP]
└─sda4    8:4    0     2M  0 part
sdb       8:16   0   1.8T  0 disk
├─sdb1    8:17   0   511M  0 part
├─sdb2    8:18   0 488.3G  0 part
│ └─md2   9:2    0 488.2G  0 raid10 /
└─sdb3    8:19   0    16G  0 part   [SWAP]
sdc       8:32   0   1.8T  0 disk
├─sdc1    8:33   0   511M  0 part
├─sdc2    8:34   0 488.3G  0 part
│ └─md2   9:2    0 488.2G  0 raid10 /
└─sdc3    8:35   0    16G  0 part   [SWAP]
sdd       8:48   0   1.8T  0 disk
├─sdd1    8:49   0   511M  0 part   /boot/efi
├─sdd2    8:50   0 488.3G  0 part
│ └─md2   9:2    0 488.2G  0 raid10 /
└─sdd3    8:51   0    16G  0 part   [SWAP]
root@pve:~# cat /proc/mdstat
Personalities : [raid1] [linear] [multipath] [raid0] [raid6] [raid5] [raid4] [raid10]
md2 : active raid10 sdd2[5] sdc2[4] sda2[3] sdb2[2]
      511868928 blocks super 1.2 64K chunks 2 near-copies [4/3] [U_UU]
      [======>..............]  reshape = 32.9% (168472448/511868928) finish=49.0min speed=116718K/sec

unused devices: <none>
```


等待很长一段时间之后 RAID10 完成：

```
root@pve:~# mdadm --misc --detail /dev/md2 
/dev/md2:
           Version : 1.2
     Creation Time : Thu Oct 21 12:58:06 2021
        Raid Level : raid10
        Array Size : 1023737856 (976.31 GiB 1048.31 GB)
     Used Dev Size : 511868928 (488.16 GiB 524.15 GB)
      Raid Devices : 4
     Total Devices : 4
       Persistence : Superblock is persistent

       Update Time : Fri Oct 22 01:39:27 2021
             State : clean 
    Active Devices : 4
   Working Devices : 4
    Failed Devices : 0
     Spare Devices : 0

            Layout : near=2
        Chunk Size : 64K

Consistency Policy : resync

              Name : md2
              UUID : 0686b64f:07957a70:4e937aa2:23716f6e
            Events : 6536

    Number   Major   Minor   RaidDevice State
       2       8       18        0      active sync set-A   /dev/sdb2
       5       8       50        1      active sync set-B   /dev/sdd2
       4       8       34        2      active sync set-A   /dev/sdc2
       3       8        2        3      active sync set-B   /dev/sda2
```

## Install Proxmox VE on Debian
完成 RAID10 的调整之后，如果磁盘还有剩余的空间，可以再分区，之后使用 ZFS，raidz 可以自己选择。

然后可以更具官方的[教程](https://pve.proxmox.com/wiki/Install_Proxmox_VE_on_Debian_Buster)，直接在 Debian 的基础之上安装 Proxmox VE。之后需要移除掉 cloud-init 否则网络配置会产生[问题](/post/2020/05/proxmox-web-ui-stop-working.html)。


## reference

- [[mdadm-command]]