---
layout: post
title: "Linux 设备中的 major 和 minor 数字"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, device, hardware, kernel,]
last_updated:
---

Today, when I visit tldr [issue](https://github.com/tldr-pages/tldr/issues/4080) and I saw a talk about the command `lsblk`, although I used a lot before, I really don't understand the `MAJ:MIN` in the result. Most time, I use it to check the harddrive disk and partitions.

	lsblk
	NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
	loop0    7:0    0 260.7M  1 loop /snap/kde-frameworks-5-core18/32
	loop1    7:1    0 253.5M  1 loop /snap/electronic-wechat/7
	loop2    7:2    0    69M  1 loop /snap/telegram-desktop/1634
	loop3    7:3    0  21.3M  1 loop /snap/communitheme/1987
	loop4    7:4    0    55M  1 loop /snap/core18/1754
	loop5    7:5    0  93.9M  1 loop /snap/core/9066
	loop6    7:6    0  54.8M  1 loop /snap/gtk-common-themes/1502
	loop7    7:7    0  93.8M  1 loop /snap/core/8935
	loop8    7:8    0 373.5M  1 loop /snap/anbox/158
	loop10   7:10   0 397.1M  1 loop /snap/redis-desktop-manager/335
	loop11   7:11   0 160.2M  1 loop /snap/gnome-3-28-1804/116
	loop12   7:12   0    32M  1 loop /snap/git-fame/15
	loop13   7:13   0 149.2M  1 loop /snap/postman/109
	loop14   7:14   0    16M  1 loop /snap/communitheme/1768
	loop15   7:15   0    55M  1 loop /snap/core18/1705
	loop16   7:16   0 374.9M  1 loop /snap/redis-desktop-manager/400
	loop17   7:17   0    69M  1 loop /snap/telegram-desktop/1627
	loop18   7:18   0  62.1M  1 loop /snap/gtk-common-themes/1506
	loop19   7:19   0  32.1M  1 loop /snap/git-fame/23
	loop20   7:20   0 310.8M  1 loop
	loop21   7:21   0 163.6M  1 loop /snap/postman/110
	sda      8:0    0 931.5G  0 disk
	├─sda1   8:1    0 214.9G  0 part
	├─sda2   8:2    0  16.3G  0 part [SWAP]
	└─sda3   8:3    0 700.4G  0 part /media/Backup
	sdb      8:16   0 232.9G  0 disk
	├─sdb1   8:17   0 232.9G  0 part /
	└─sdb2   8:18   0     2M  0 part

However, when I take a close look at the output, I can see only the disk device output, but also see the `snap` package output. So I started to search informations about the `MAJ:MIN`.

## Major and minor device number
We all know that under linux, all devices are managed under `/dev` folder. So lets check the special device first:

	ls -al /dev/zero
	crw-rw-rw- 1 root root 1, 5 May 29 19:40 /dev/zero

We can see that, `ls` output is a little bit different from normal output, `/dev/zero` device's major number is `1` and minor is `5`

Then let's check `/proc/devices`:

	cat /proc/devices

This file contains the list of device drivers configured into the current running kernal(block and character).[^proc]

We can see that under `/proc/devices` file, there are a list of number and strings. For example:

	Character devices:
	1 mem
	5 /dev/tty
	5 /dev/console
	7 vcs

	Block devices:
	8 sd

[^proc]: <https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/4/html/Reference_Guide/s2-proc-devices.html>



Each device node's type (block or character) and numbers serve as identifiers for the kernel.



On Linux, the canonical list of devices, with a brief explanation of their function, is maintained [in the kernel](https://www.kernel.org/doc/html/latest/admin-guide/devices.html).


- **major number**: identify the driver associated with the device. For example `/dev/null` and `/dev/zero` are both managerd by driver 1, whereas virtual consoles and serial terminals are managed by driver 4. Kernal uses the major number at open time to dispatch execution to the appropriate driver.
- **minor number**: refers to an instance, which is used by the driver itself, specified by the major number. Minor number is used for driver to identify the difference between devices.

After version 2.4, the kernel introduced a new feature, the device file system or `devfs`. But for now most distributions do not add these feature. Read more from [here](https://www.oreilly.com/library/view/linux-device-drivers/0596000081/ch03s02.html).

When `devfs` is not being used, adding a new driver to the system means assigning a major number to it. The assignment should be made at driver (module) initialization by calling the following function, defined in `<linux.fs.h>`:

	int register_chrdev(unsigned int major, const char* name, struct file_operations* fops);

Once the driver has been registered in the kernel table, its operations are associated with the given major number.
And a name must be inserted into the `/dev` directory and associated with your driver's major and minor numbers.

The command to create a device node on the filesystem is called `mknod`:

	mknod /dev/scull0 c 254 0

Explain:

- `c` means: create a char device
- with major nubmer 254
- and minor number 0, minor number should be in the range 0 to 255

## reference

- 《Linux Device Drivers, Second Edition by Jonathan Corbet, Alessandro Rubini》
