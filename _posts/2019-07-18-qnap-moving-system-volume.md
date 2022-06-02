---
layout: post
title: "威联通折腾篇十四：迁移系统盘"
aliases: "威联通折腾篇十四：迁移系统盘"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, backup, system, nas, ]
last_updated:
---

当时安装系统的时候就直接插入了一块硬盘，安装在了第一块机械硬盘上面，虽然读写也没有遇到什么瓶颈，但是记录以做备份，可以用于将系统迁移到 SSD 上。

下面的方法未经验证，慎用。应用可以迁移，但是一些配置可能无法成功备份到另一块硬盘中。

1. Create a small new Volume using some of the unused space in Storage Pool 1
2. Back up my System Setting (ControlPanel>Backup/Restore>Back up System Settings)
3. Shut down NAS (systems that access the iSCSI storage will also be shut down)
4. Pull the 1TB drive (System Volume)
5. Put a 2 TB drive in both bay 3 and 4 (matching the model in bay 1 and 2)
6. Power the NAS back on
7. Restore from the backup taken in step 2 (point to the new volume created in step 1 for the System Volume)
8. Add the new disks to the RAID Group in Storage Pool 1 and Migrate to RAID 5 then 6.


## 我把我的 NAS 系统盘搞砸了
2020 年 1 月 10 号更新。

![qnap dashboard disk failed](/assets/qnap-dashboard-disk-failed-2020-01-11-132345.png)

我的 NAS 没有组 RAID，因为磁盘也不是一次买的，所以是一次次增加到 NAS 中的，每块磁盘都是独立的 Volumn，在这种情况下系统盘损坏也就无法从其他盘恢复了。

![qnap storage snapshots](/assets/qnap-storage-snapshots-2020-01-11-132423.png)

上面的方法在硬盘还能正常运行的时候可以试试，但是从昨天起发现 NAS 系统盘突然只读，而无法写入，经过一系列诊断初步感觉是硬盘故障了，所以赶紧备份系统盘数据，也幸亏 NAS 在要磁盘完全挂之前还保存了读的功能，所以赶紧 ssh 到后台 rsync 系统盘数据到其他盘。

![qnap disk health check](/assets/qnap-disk-health-check-2020-01-11-100255.png)

备份完普通文件剩下的配置和应用就比较难备份了，前前后后花了很长时间去尝试和配置这些应用，但是最糟糕的可能就是要从头开始了。这么多应用和配置都要从头配置，想想就头疼。

![qnap all applications](/assets/qnap-all-applications-2020-01-11-095528.png)

在网上经过一番调查，QNAP QTS 系统和数据是分开存储的，所以即使系统盘挂掉，其他磁盘不用其他操作，可以更换新的系统盘，然后安装新系统，然后在新系统中恢复原来的数据。

先在"存储与快照总管"，安全卸载存储区。所有的盘都卸载掉，然后关机。换一个用来安装系统和应用的硬盘，重装系统。装好之后插上旧数据硬盘。在存储与快照总管那里，扫描闲置磁盘。然后原来的数据就恢复了。

安全卸载磁盘：

- 主菜单，存储与快照总管，存储，存储 / 快照
- 选择存储池
- 管理，打开存储池管理窗口
- 删除 > **安全卸载存储池** （注意这里千万要选择卸载存储池，而不是移除存储池）
- 单击“是”，存储池状态更改为安全卸载中...。QTS 卸载完存储池后，将从存储与快照总管中消失。
- 从 NAS 中移除包含存储池的硬盘

恢复磁盘：

- 在第二个 NAS 上安装硬盘。
- 在第二个 NAS 上，转到主菜单 > 存储与快照总管 > 存储 > 磁盘 /VJBOD
- 选择恢复 > 扫描闲置磁盘。 此时会出现确认消息。 单击确定。
- QTS 将扫描磁盘并检测存储池。
- 单击应用。


该方法也适用于将存储池移动到其他 NAS 中。[^sc]

![storage pool](/assets/storage-pool-2020-01-11-133634.png)


对于我这种只用了一块磁盘一个静态卷来安装系统的，恢复起来就比较麻烦了，大思路就是：

- 通过 QTS 自带的备份来备份系统设置
- 备份该盘中所有数据
- 备份 `/share/CACHEDEV1_DATA/.qpkg/` 目录下应用数据及配置
- 再将其他数据磁盘数据卷通过上面的方法移除，然后关机，再将系统磁盘移除
- 然后插入新的磁盘，在新磁盘上新建卷，安装系统
- 在新系统中恢复之前备份的设置
- 重新安装应用，然后从备份中恢复之前备份的应用数据



## reference

- <https://forum.qnap.com/viewtopic.php?t=132729>
- <https://www.qnap.com/en/how-to/knowledge-base/article/i-bought-a-new-qnap-nas-how-do-i-move-my-data-over-from-the-old-one/>

[^sc]: <https://docs.qnap.com/nas/QTS4.3.5/sc/>
