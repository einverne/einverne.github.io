---
layout: post
title: "在 OpenMediaVault 上使用 SnapRAID 和 MergerFS"
tagline: ""
description: ""
category: 学习笔记
tags: [openmediavault, snapraid, raid, backup, mergerfs, linux, debian]
last_updated:
---


首先来介绍一下这两个软件，SnapRAID 和 MergerFS，不同于其他现有的 NAS 系统，可以把 OpenMediaVault 看成一个简单的带有 Web UI 的 Linux 系统，他使用最基本的文件系统，没有 ZFS 的实时文件冗余，所以需要 SnapRAID 提供的冗余来保护硬盘数据安全。SnapRAID 需要一块单独的硬盘来存放校验数据，这个盘的容量必须大于等于其他任何一个数据盘。SnapRAID 采用快照的方式来做数据冗余，这种设计避免了所有硬盘在没有数据操作情况下也要运转来实时数据备份的消耗。

MergerFS 则是一个联合文件系统，可以将多块硬盘挂载到一个挂载点，通过 MergerFS 来自动决定数据该存储在哪块硬盘上。

## Prerequisite
先决条件：

- 至少三块硬盘，两块硬盘用来演示 MergerFS 合并，一块硬盘用来作为 SnapRAID 冗余备份
- 一个安装好的 OpenMediaVault 以及安装好 [OMV-Extras](/post/2020/03/openmediavault-setup.html) 相关的插件
- System - Plugin 下安装 `openmediavault-snapraid` 和 `openmediavault-unionfilesystem` 插件

## MergerFS
[MergerFS](https://github.com/trapexit/mergerfs) 是一个联合文件系统 (union file system)，MergerFS 会将多块硬盘，或者多个文件夹合并到 MergerFS pool 中，这样一个系统就会有一个统一的文件入口，方便管理。

选用 MergerFS 另外一个理由就是，通过 MergerFS 合并的目录并不会对数据进行条带化的处理，每块硬盘上还是保存原来的文件目录和文件，任意一块硬盘单独拿出来放到其他系统上，不需要额外的逻辑卷的配置，就可以直接挂载读取这个硬盘的数据。

### 创建 MergerFS pool
通过如下步骤创建 MergerFS 磁盘池：

- Storage > Union Filesystems
- Add
- Give the pool a name
- In the **Branches** 选项中，选择所有要合并的磁盘，这里**不要选 parity 的磁盘**
- 在 **Create policy** 中选择 **Most free space**
- **Minimum free space** 中选择一个合适的大小，默认也可以
- **Option** 中，默认
- **Save**
- **Apply**

这样以后在文件系统中就会看到新创建的联合目录。在创建共享文件夹的时候就可以在合并的联合文件系统上进行。

在创建了 MergerFS Pool 后，在 OpenMediaVault 的文件目录 `/srv` 目录下会多出一个文件夹，这个文件夹就会存放 MergerFS Pool 中的数据。

## SnapRAID
[SnapRAID](https://www.snapraid.it/) 是一个磁盘阵列的冗余备份工具，它可以存储额外的奇偶校验信息用来校验数据，以便在磁盘发生故障时恢复数据。

SnapRAID 适用于家庭媒体服务器，适合于存储多数不经常变动的大文件场景。

特性：

- 所有的数据都经过哈希处理，以确保数据完整性来避免可能的磁盘损坏
- 如果故障磁盘太多而无法恢复，则只会丢失故障磁盘上的数据。其他磁盘中的所有数据都是安全的
- 如果意外的删除了某些文件，可以轻松的恢复
- 可以在已经有数据的硬盘上使用
- 硬盘可以有不同的大小
- 可以在任何时候添加磁盘
- 不会占用数据，可以在任何时候停用 SnapRAID 而不用重新格式化
- 访问数据时，只有一块磁盘会转动，节省电源以及减少噪声

SnapRAID 作为一个备份工具非常强大，强烈推荐阅读官网上关于 SnapRAID 和 [[unRAID]], ZFS 等系统或文件系统提供的备份的对比 [^s]

[^s]: <https://www.snapraid.it/compare>


在 OpenMediaVault 中使用 SnapRAID :

### 设置需要保护的磁盘
假设三块硬盘中前两块用来存储重要的数据，第三块用来存放奇偶校验信息。那么首先设置数据盘：

- 在 Services > SnapRAID 菜单，click **Drives** 选项
- 点击 Add
- 选择第一块硬盘
- 起一个友好的名字
- 选择 Content
- 选择 Data
- 不需要选 Parity
- 保存

重复上面的步骤将第二块磁盘也添加进来。

### 设置奇偶校验盘

添加奇偶校验信息盘的时候，和上面步骤相似。不过要注意的是在添加磁盘时

- 不需要选择 Content
- 不需要选择 Data
- **选择 Parity**

然后点击保存。

## SnapRAID 操作

在添加完硬盘之后，可以进行同步操作：

- Sync, 同步数据，并更新校验，默认进行差量同步
- Scrub，检查潜在的错误
- Diff，列出和上一次存在的差别
- Fix，尽可能恢复到上一次同步状态
- Fix silent，修复潜在的错误

### SnapRAID Scrub
最后设置 SnapRAID Scrub，scrubbing 的目的是检查数据盘和校验信息盘的错误。可以在 SnapRAID 的 settings 界面中启用 Scheduled diff，启用后会自动创建一个周期性 Crontab 任务。

### SnapRAID Rules

对于一些不需要 SnapRAID 进行冗余校验的目录，可以在 Rules 选项中进行排除。比如说经常变动的 metadata 信息，Docker 容器配置，虚拟机等等。

### SnapRAID Scheduled Jobs
周期性的执行这些命令。

sync 命令会更新 parity 信息，所有磁盘中修改的文件都会被读取，然后对应的 parity 信息都会更新。

touch 命令会将所有拥有 sub-second 时间戳的文件设置为 0，这样提高了 SnapRAID 识别移动和复制过的文件的能力，可以消除可能的重复。

scrub 命令会验证磁盘阵列中的数据和 `sync` 命令产生的 hash.

    # Run this command for the first time
    snapraid sync

    # Run this command after the sync is completed
    snapraid scrub

    # Run this command for status
    snapraid status


## mergerfsfolders vs unionfilesystems
在安装完 OMV-Extras 后会在插件中看到两个相似的插件：

- mergerfsfolders, 利用 mergerfs 将多个**文件夹**挂载到同一个挂载点
- unionfilesystems，使用 union filesystem mergerfs 来将多块硬盘挂载到一个挂载点

其主要区别就在于一个是合并文件夹，一个是合并硬盘。所以如果对于全新的硬盘，没有任何数据，可以直接利用 unionfilesystems 来将多块硬盘组合成一个 pool.


## reference

- <https://www.networkshinobi.com/snapraid-and-mergerfs-on-openmediavault/>
- <https://www.snapraid.it/manual>
- <https://www.snapraid.it/compare>
