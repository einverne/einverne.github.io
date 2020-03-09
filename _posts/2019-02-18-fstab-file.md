---
layout: post
title: "启动挂载配置 fstab 文件"
tagline: ""
description: ""
category: 学习笔记
tags: [fstab, mount, linux, file, disk,]
last_updated:
---

因为之前[克隆系统](/post/2016/08/clonezilla-clone-system.html) 获知了 fstab 文件，用来在启动系统时挂载对应硬盘分区中的系统。打开我自己系统的文件之后也发现可以配置挂载其他 FAT 或者 NTFS 格式的 Windows 下的分区。而最近可能因为 SSD 挂掉的原因，系统无法启动，再次把 fstab 放到了重要的位置，所以才有了这样一篇文章，主要用来总结一下 `/etc/fstab` 文件的作用及配置。

fstab 的完整路径是 `/etc/fstab`，纯文本文件，root 用户用任意的文本编辑器打开即可。fstab 是启动时配置文件，实际文件挂载是记录到 `/etc/mtab` 和 `/proc/mounts` 两个文件。

## 文件配置格式
每一个硬盘分区都有一个 UUID，可以使用 `blkid` 命令来查看（需 root 权限），在确定每一个硬盘分区的 ID 之后再来查看 fstab 文件就能非常轻松的看到 fstab 中挂载的内容具体含义。

    # <file system> <mount point>   <type>  <options>       <dump>  <pass>
    UUID=b9999999-a25b-4ca0-b597-fc62e121aae1 none            swap    sw              0       0
    UUID=89999999-e8f2-4e68-84a1-b82e79a041c7 / ext4 errors=remount-ro 0 1

上述两条配置可以看到一个挂载了 swap 分区，一个挂载了根分区，分别在两个分区中。其实 fstab 文件就是将 mount 命令挂载的参数写到了文件中。

各字段具体解释：

- **file syste** 挂载设备，指的是硬盘分区，光驱等设备，指定分区的名字
- **mount point** 挂载点，挂载到系统的位置
- **type** 文件系统类型，包括 ext3,ext4,swap,ntfs,auto 等等，auto 表示让 mount 命令自动判断文件类型
- **options**  参数，挂载的设备开机自动加载，显示，读写权限的配置等等，mount 命令用法相关，具体参数配置见 man mount
- dump 备份命令，dump utility 用来决定是否做备份，dump 检查 entry 并用数字来决定是否对文件系统进行备份。为 0，则忽略，为 1，则备份
- pass 是否 fsck 检查扇区，启动过程中，系统默认会用 fsck 检查文件系统是否完整。但是有些文件系统不需要检查，比如 swap 或者特殊文件系统 /proc 或者 /sys 等等。0 是不要检验，1 表示最早检验（根目录配置为 1），2 表示要检验

options 常用参数：

- `defaults` 使用默认设置，rw,suid,dev,exec,auto,nouser,async
- `auto` `noauto` 自动和手动挂载
- `ro` `rw` 只读和读写挂载
- `exec` `noexec` 二进制文件是否允许执行
- `sync` `async` I/O 同步，I/O 非同步
- `user` 允许任何用户挂载设备，`nouser` 只允许 root 用户挂载
- `async` 所有文件系统 I/O 异步进行，同理还有 sync 选项
- `suid` `nosuid` 是否允许 set-user-ID 和 set-group-ID 生效
- `nodev` do not interpret character or block special devices on the file system
- `nofail` 如果不存在错误就不报告

系统挂载的限制：

- 根目录 `/` 必须先于其他设备挂载
- 挂载点必须为已经创建的目录
- 挂载点在同一时间只能挂载一次
- 分区在同一时间只能挂载一次

