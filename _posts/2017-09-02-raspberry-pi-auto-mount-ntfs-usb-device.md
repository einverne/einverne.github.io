---
layout: post
title: "Raspberry pi 自动挂载 NTFS USB 设备"
tagline: ""
description: ""
category: 经验总结
tags: [linux, raspberrypi, mount, ntfs, usb, ]
last_updated:
---


一些相关的命令

	sudo fdisk -l    # 列出磁盘分区表

结果是这样的：

	Disk /dev/ram0: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram1: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram2: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram3: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram4: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram5: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram6: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram7: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram8: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram9: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram10: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram11: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram12: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram13: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram14: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/ram15: 4 MiB, 4194304 bytes, 8192 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 4096 bytes
	I/O size (minimum/optimal): 4096 bytes / 4096 bytes


	Disk /dev/mmcblk0: 7.4 GiB, 7948206080 bytes, 15523840 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 512 bytes
	I/O size (minimum/optimal): 512 bytes / 512 bytes
	Disklabel type: dos
	Disk identifier: 0x1fdbda7f

	Device         Boot Start      End  Sectors  Size Id Type
	/dev/mmcblk0p1       8192    93813    85622 41.8M  c W95 FAT32 (LBA)
	/dev/mmcblk0p2      94208 15523839 15429632  7.4G 83 Linux


	Disk /dev/sda: 1.4 TiB, 1500301909504 bytes, 2930277167 sectors
	Units: sectors of 1 * 512 = 512 bytes
	Sector size (logical/physical): 512 bytes / 512 bytes
	I/O size (minimum/optimal): 512 bytes / 512 bytes
	Disklabel type: dos
	Disk identifier: 0x4c63688c

	Device     Boot Start        End    Sectors  Size Id Type
	/dev/sda1        2048 2930272255 2930270208  1.4T  7 HPFS/NTFS/exFAT

在最后可以看到一块磁盘 `/dev/sda1` 。

然后可以使用如下的方式手动挂载。

## 手动挂载
为了让 Linux 能够读取 NTFS 格式的硬盘，需要安装 `ntfs-3g` 。然后可以手动挂载。

	sudo apt-get install ntfs-3g
	sudo mkdir -p /media/sda1
	sudo mount -t ntfs-3g /dev/sda1 /media/sda1

挂载完成后可以查看

	sudo df -h
	Filesystem      Size  Used Avail Use% Mounted on
	/dev/root       7.3G  2.2G  4.8G  31% /
	devtmpfs        460M     0  460M   0% /dev
	tmpfs           464M     0  464M   0% /dev/shm
	tmpfs           464M   13M  452M   3% /run
	tmpfs           5.0M  4.0K  5.0M   1% /run/lock
	tmpfs           464M     0  464M   0% /sys/fs/cgroup
	/dev/mmcblk0p1   42M   21M   21M  51% /boot
	tmpfs            93M     0   93M   0% /run/user/1000
	/dev/sda1       1.4T  1.1T  363G  75% /media/sda1



通过编辑 fstab 来让系统自动挂载

    sudo vim /etc/fstab

插入

    /dev/sda1 /mnt/hdd ext4 defaults 0 0

从而实现 USB 设备的自动挂载

    sudo vim /etc/udev/rules.d/10-usbstorage.rules

    KERNEL!="sd*", GOTO="media_by_label_auto_mount_end"
    SUBSYSTEM!="block",GOTO="media_by_label_auto_mount_end"
    IMPORT{program}="/sbin/blkid -o udev -p %N"
    ENV{ID_FS_TYPE}=="", GOTO="media_by_label_auto_mount_end"
    ENV{ID_FS_LABEL}!="", ENV{dir_name}="%E{ID_FS_LABEL}"
    ENV{ID_FS_LABEL}=="", ENV{dir_name}="Untitled-%k"
    ACTION=="add", ENV{mount_options}="relatime,sync"
    ACTION=="add", ENV{ID_FS_TYPE}=="vfat", ENV{mount_options}="iocharset=utf8,umask=000"
    ACTION=="add", ENV{ID_FS_TYPE}=="ntfs", ENV{mount_options}="iocharset=utf8,umask=000"
    ACTION=="add", RUN+="/bin/mkdir -p /media/%E{dir_name}", RUN+="/bin/mount -o $env{mount_options} /dev/%k /media/%E{dir_name}"
    ACTION=="remove", ENV{dir_name}!="", RUN+="/bin/umount -l /media/%E{dir_name}", RUN+="/bin/rmdir /media/%E{dir_name}"
    LABEL="media_by_label_auto_mount_end"

如果要卸载文件系统，比如将挂载的 `/media/sda1` 卸载

    umount /media/sda1
