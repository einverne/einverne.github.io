---
layout: post
title: "Ubuntu 20.04 使用 MergerFS"
aliases: 
- "Ubuntu 20.04 使用 MergerFS"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, ubuntu, mergerfs, proxmox-ve, proxmox, raid, pve, dedicated-server ]
last_updated:
---

[[so-you-start]] 的独服有4块 2T 的硬盘，本来想配置一个 Soft RAID-10，但折腾了一个礼拜，重装了无数遍系统，配置了很多次，从 Ubuntu，Proxmox VE，Debian 都尝试了一遍，最终放弃了，想着充分利用其空间，使用 Proxmox VE，备份好数据，不用 RAID 了，毕竟如果使用默认的 RAID-1，我只能利用8T空间中的 2T 不到，而使用 RAID-10 也只能利用不到 4T 左右空间。至于使用单盘，所有的数据备份，和数据安全性的工作就完全依靠自己的备份去完成了。但是好处是可利用的空间大了。

## Proxmox VE 硬盘直通
参考之前的文章[Proxmox VE 硬盘直通](/post/2020/03/proxmox-passthrough-hard-disk.html)，将 Proxmox VE 安装后剩下的三块硬盘直通给 Ubuntu。

```
root@pve:/var/lib/vz/dump# qm set 101 -scsi1 /dev/disk/by-id/ata-HGST_HUS726020ALA610_K5HWJ6NG
update VM 101: -scsi1 /dev/disk/by-id/ata-HGST_HUS726020ALA610_K5HWJ6NG
root@pve:/var/lib/vz/dump# qm set 101 -scsi2 /dev/disk/by-id/ata-HGST_HUS726020ALA610_K5J0ZUWA
update VM 101: -scsi2 /dev/disk/by-id/ata-HGST_HUS726020ALA610_K5J0ZUWA
root@pve:/var/lib/vz/dump# qm set 101 -scsi3 /dev/disk/by-id/ata-HGST_HUS726020ALA610_K5HW9RJG
update VM 101: -scsi3 /dev/disk/by-id/ata-HGST_HUS726020ALA610_K5HW9RJG
```

在 Ubuntu 虚拟机就可以看到：

```
einverne@sysubuntu:~$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0    7:0    0 61.9M  1 loop /snap/core20/1169
loop1    7:1    0 55.4M  1 loop /snap/core18/2128
loop2    7:2    0 70.3M  1 loop /snap/lxd/21029
loop3    7:3    0 67.3M  1 loop /snap/lxd/21545
loop5    7:5    0 32.4M  1 loop /snap/snapd/13270
loop6    7:6    0 32.5M  1 loop /snap/snapd/13640
sda      8:0    0   64G  0 disk 
├─sda1   8:1    0    1M  0 part 
└─sda2   8:2    0   64G  0 part /
sdb      8:16   0  1.8T  0 disk 
sdc      8:32   0  1.8T  0 disk 
sdd      8:48   0  1.8T  0 disk 
sr0     11:0    1 1024M  0 rom  
```

然后使用 [fdisk](/post/2016/04/fdisk.html) 或 [parted](/post/2018/04/parted-linux-partition.html) 给硬盘进行分区，格式化之后，挂载到 `/mnt`:

```
root@sysubuntu:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            1.9G     0  1.9G   0% /dev
tmpfs           394M  1.1M  393M   1% /run
/dev/sda2        63G   10G   50G  17% /
tmpfs           2.0G  468K  2.0G   1% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
/dev/loop0       62M   62M     0 100% /snap/core20/1169
/dev/loop2       71M   71M     0 100% /snap/lxd/21029
/dev/loop1       56M   56M     0 100% /snap/core18/2128
/dev/loop3       68M   68M     0 100% /snap/lxd/21545
/dev/loop5       33M   33M     0 100% /snap/snapd/13270
/dev/loop6       33M   33M     0 100% /snap/snapd/13640
tmpfs           394M     0  394M   0% /run/user/1000
/dev/sdb1       1.8T   77M  1.7T   1% /mnt/sdb1
/dev/sdc1       1.8T   77M  1.7T   1% /mnt/sdc1
/dev/sdd1       1.8T   77M  1.7T   1% /mnt/sdd1
```


## Install MergerFS

在[官方发布页面](https://github.com/trapexit/mergerfs/releases) 下载最新的安装包：

    wget https://github.com/trapexit/mergerfs/releases/download/2.32.6/mergerfs_2.32.6.ubuntu-bionic_amd64.deb
    sudo dpkg -i mergerfs_2.32.6.ubuntu-bionic_amd64.deb

## MergerFS 配置

MergerFS 可以将一组硬盘（JBOD）组合形成一个硬盘，类似于 RAID，但完全不同。


```
root@sysubuntu:~# mkdir -p /mnt/storage
root@sysubuntu:~# mergerfs -o defaults,allow_other,use_ino,category.create=mfs,minfreespace=100G,ignorepponrename=true,fsname=mergerFS /mnt/sdb1:/mnt/sdc1/:/mnt/sdd1/ /mnt/storage/
root@sysubuntu:~# df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            1.9G     0  1.9G   0% /dev
tmpfs           394M  1.1M  393M   1% /run
/dev/sda2        63G   10G   50G  17% /
tmpfs           2.0G  468K  2.0G   1% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
/dev/loop0       62M   62M     0 100% /snap/core20/1169
/dev/loop2       71M   71M     0 100% /snap/lxd/21029
/dev/loop1       56M   56M     0 100% /snap/core18/2128
/dev/loop3       68M   68M     0 100% /snap/lxd/21545
/dev/loop5       33M   33M     0 100% /snap/snapd/13270
/dev/loop6       33M   33M     0 100% /snap/snapd/13640
tmpfs           394M     0  394M   0% /run/user/1000
/dev/sdb1       1.8T   77M  1.7T   1% /mnt/sdb1
/dev/sdc1       1.8T   77M  1.7T   1% /mnt/sdc1
/dev/sdd1       1.8T   77M  1.7T   1% /mnt/sdd1
mergerFS        5.4T  229M  5.1T   1% /mnt/storage
```

参数说明：

- `defaults`: 开启以下 FUSE 参数以提升性能：atomic_o_trunc, auto_cache, big_writes, default_permissions, splice_move, splice_read, splice_write；
- `allow_other`: 允许挂载者以外的用户访问。需要编辑 /etc/fuse.conf。
- `use_ino`: 使用 mergerfs 而不是 libfuse 提供的 inode，使硬链接的文件 inode 一致；
- `category.create=mfs`: Spreads files out across your drives based on available space；
- `minfreespace=100G`: 最小剩余空间 100G，当写文件时，跳过剩余空间低于 100G 的文件系统
- `ignorepponrename=true`: 重命名时保持原来的存储路径

最后编辑 `/etc/fstab` 来在启动时自动挂载。

使用 `lsblk -f` 查看：

```
root@sysubuntu:~# lsblk -f
NAME   FSTYPE   LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINT
loop0  squashfs                                                  0   100% /snap/core20/1169
loop1  squashfs                                                  0   100% /snap/core18/2128
loop2  squashfs                                                  0   100% /snap/lxd/21029
loop3  squashfs                                                  0   100% /snap/lxd/21545
loop5  squashfs                                                  0   100% /snap/snapd/13270
loop6  squashfs                                                  0   100% /snap/snapd/13640
sda                                                                       
├─sda1                                                                    
└─sda2 ext4           8ecce3ba-cd9f-494a-966a-d90fc31cd0fc   49.6G    16% /
sdb                                                                       
└─sdb1 ext4           50292f2c-0f85-4871-9c41-148038b31e24    1.7T     0% /mnt/sdb1
sdc                                                                       
└─sdc1 ext4           1de9b276-5a5d-41ac-989a-12bdc9ef4d0b    1.7T     0% /mnt/sdc1
sdd                                                                       
└─sdd1 ext4           420d99a9-de31-4df4-af93-6863f3284f3d    1.7T     0% /mnt/sdd1
sr0                                                                       
```

然后在 `/etc/fstab` 中配置：

```
/dev/disk/by-uuid/50292f2c-0f85-4871-9c41-148038b31e24 /mnt/sdb1 ext4 defaults 0 0
/dev/disk/by-uuid/1de9b276-5a5d-41ac-989a-12bdc9ef4d0b /mnt/sdc1 ext4 defaults 0 0
/dev/disk/by-uuid/420d99a9-de31-4df4-af93-6863f3284f3d /mnt/sdd1 ext4 defaults 0 0

/mnt/sdb1:/mnt/sdc1/:/mnt/sdd1 /mnt/storage   fuse.mergerfs defaults,allow_other,use_ino,category.create=mfs,minfreespace=100G,fsname=mergerfs 0 0
```


这样重启也会自动进行挂载。

## 注意 rtorrent 使用
如果要在 mergerfs 上使用 rtorrent 需要注意使用如下配置：

    allow_other,use_ino,cache.files=partial,dropcacheonclose=true,category.create=mfs


## reference

- <https://the-orb.uk/index.php/2020/10/12/mergerfs-on-ubuntu-20-04/>
- <https://wzyboy.im/post/1148.html>