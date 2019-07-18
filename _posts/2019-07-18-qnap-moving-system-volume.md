---
layout: post
title: "威联通折腾篇十四：迁移系统盘"
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


## reference

- <https://forum.qnap.com/viewtopic.php?t=132729>
