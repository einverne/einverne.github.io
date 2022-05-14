---
layout: post
title: "Proxmox VE 备份和恢复虚拟机"
aliases: 
- "Proxmox VE 备份和恢复虚拟机"
tagline: ""
description: ""
category: [ Proxmox-VE, 学习笔记 ]
tags: [ proxmox, pve, vm, backup, data-backup, ]
last_updated: 2022-05-14 02:39:38
create_time: 2021-11-25 08:05:42
---

数据是最重要的，本着系统可以挂，但是数据不能丢的原则，这里就整理一下在 Proxmox VE 系统中，直接备份虚拟机，和恢复虚拟机的过程。

## 为什么需要备份

- 保证数据的安全性
- 硬件故障
- 服务器升级或迁移
- 恶意软件破坏了系统

## 准备工作

### 设置备份存储
设置 Storage，允许保存 VZDump backup 文件：

- 转到 Datacenter > Storage。
- 选择备份存储位置。
- 单击编辑选项卡。
- 确保有一个 Storage 已经选择了 Content 下的 VZDump backup file
- 单击确定。

在执行备份之前，需要通过上面的设置设定一个允许备份的 Storage，然后之后的备份文件会存放到该 Storage 中。备份文件以文件形式存储。在大部分的情况下，可以使用 NFS 服务器作为存储备份。

### Backup Modes
Proxmox VE 备份服务提供了三种不同的备份模式，在备份菜单中可以看到：

- stop mode，这个模式以短暂停止 VM 的代价提供了高一致性备份。这个模式会先关闭 VM，然后在后台执行 Qemu 进程来备份 VM 数据，一旦备份开始，如果之前 VM 在运行会继续 VM 的运行状态
- suspend mode，因兼容原因提供，在调用 snapshot mode 之前 suspend VM，因为 suspend VM 会导致较长时间的停机时间，所以建议使用 snapshot mode
- snapshot mode，不需要很长的停机时间，代价为可能的一小部分数据不一致，执行 Proxmox VE Live backup，当 VM 在运行的时候拷贝 data blocks

### Back File Compression
对于备份的文件，Proxmox VE 提供了多种压缩算法，[lzo](https://en.wikipedia.org/wiki/Lempel-Ziv-Oberhumer), [gzip](https://en.wikipedia.org/wiki/Gzip), [zstd](https://en.wikipedia.org/wiki/Zstandard)。

目前来说，Zstandard(zstd) 是三种算法中最快的，多线程也是 zstd 优于 lzo 和 gzip 的地方。但 lzo 和 gzip 通常来说更加常用。可以安装 [pigz](https://zlib.net/pigz/) 来无缝替换 gzip 以提供更好的性能。

使用了不同的压缩算法的备份文件的扩展名如下：

| file extension | algorithms                  |
| -------------- | --------------------------- |
| .zst           | Zstandard(zstd) compression |
| .gz or .tgz    | gzip compression            |
| .lzo           | .zo compression             |


## Backup

备份可以通过 GUI 或者 命令行工具来进行。


### 备份虚拟机
首先关闭虚拟机

#### CLI
通过命令行备份：

    cd /var/lib/vz/dump
    vzdump 101

说明：

- 以上的命令会在 `/var/lib/vz/dump` 目录中备份 101 号虚拟机

#### GUI
通过 UI 界面备份数据：

- 数据中心> Backup。
- 转到 添加>创建备份作业。
- 选择详细信息，例如节点，目标存储，星期几，时间等。
- 确保备份作业已启用。


### 备份时跳过特定的目录

在备份虚拟机时有些时候不想要备份虚拟机中的特定目录，比如说缓存目录，这样可以加快备份的速度，以及减小备份文件的体积。

在 Datacenter -> Backup 中建立备份任务之后，会在系统中新建一个 cron，在 `/etc/pve/vzdump.cron` 文件中：

```
PATH="/usr/sbin:/usr/bin:/sbin:/bin"

15 2 * * 6           root vzdump 100 101 102 --mailnotification always --compress zstd --mode snapshot --quiet 1 --storage local --exclude-path /mnt/ --exclude-path '/dev/disk/by-id/ata-HGST*'
```

可以看到，实际使用了 `vzdump` 命令，直接在后面添加 `--exclude-path` 并加上不需要备份的目录即可。

更多的用法可以参考 `vzdump` 命令的使用。

### 备份时跳过 Disk
配置了备份之后查看日志可以看到：

```
INFO: Backup started at 2021-10-23 16:59:05
INFO: status = running
INFO: VM Name: ubuntu20.04
INFO: include disk 'scsi0' 'local:101/vm-101-disk-0.qcow2' 64G
INFO: include disk 'scsi1' '/dev/disk/by-id/ata-HGST_HUS726020ALA610_K5HWJ6NG' 1953514584K
INFO: include disk 'scsi2' '/dev/disk/by-id/ata-HGST_HUS726020ALA610_K5J0ZUWA' 1953514584K
INFO: include disk 'scsi3' '/dev/disk/by-id/ata-HGST_HUS726020ALA610_K5HW9RJG' 1953514584K
INFO: backup mode: snapshot
INFO: ionice priority: 7
INFO: creating vzdump archive '/var/lib/vz/dump/vzdump-qemu-101-2021_10_23-16_59_05.vma.zst'
```

我的虚拟机挂载了三块硬盘，而备份的时候会包括这三块 2T 的硬盘，这是没有必要的，可以通过如下的方法跳过备份挂载而硬盘。

在虚拟机的设置中，点击 Hard Disk，在 Advance 高级选项中可以将 Backup 取消选中，然后保存，在备份的时候就不会保存该设备了。

![proxmox ve hard disk backup](/assets/proxmox-ve-hard-disk-backup-option-20211023170351.png)

### 定时清理过期的备份
随着虚拟机备份文件的增多，可以占用的本地文件会越来越多，所以定时清理必不可少。

#### 在界面上设置
在 Datacenter -> Storage 在备份的 Storage 中双击进行设置，在 Backup Retention 中可以去掉勾选 `Keep all backups` 然后进行设置。

![proxmox ve backup retention](/assets/screenshot-area-2021-11-25-195618.png)

#### 执行命令
`crontab -e` 然后编辑：

    10 2 * * * find /var/lib/vz/dump/ -mtime +14 -delete


## Restore

我们使用 `qmrestore` 命令从备份中还原 KVM VM 101。

```
pct restore 600 /mnt/backup/vzdump-lxc-777.tar
qmrestore vzdump-qemu-019-2018_10_14-15_13_31.vma 101
```


要从GUI还原VM，请执行以下步骤。

-  浏览到要移动的VM。
-  单击 Backup。
-  选择生成的备份文件，然后单击“还原”。
-  在 Restore 字段中，指定还原虚拟机的位置。
-  单击 restore 。


## reference

- <https://pve.proxmox.com/wiki/Backup_and_Restore>