---
layout: post
title: "在 Linux 上测试硬盘读写速度"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, dd, hdd, ssd,]
last_updated:
---

记录一下在 Linux 下测试硬盘读写速度的命令和方法。

## dd

使用 dd 测试写速度，千万有注意 `of` 后接的文件必须是一个不存在的文件，否则可能造成数据丢失！

	sync; dd if=/dev/zero of=/tmp/tempfile bs=1M count=1024; sync
	1024+0 records in
	1024+0 records out
	1073741824 bytes (1.1 GB, 1.0 GiB) copied, 2.55331 s, 421 MB/s

同样的道理，如果要测试一个外部存储，需要知道挂载点，然后用 dd 命令：

	sync; dd if=/dev/zero of=/media/user/MyUSB/tempfile bs=1M count=1024; sync

使用 dd 测试读取速度，注意这里的 `if` 后需要接上一个命令生成的文件：

	dd if=/tmp/tempfile of=/dev/null bs=1M count=1024
	1024+0 records in
	1024+0 records out
	1073741824 bytes (1.1 GB, 1.0 GiB) copied, 0.271083 s, 4.0 GB/s

清楚 cache，准确的测试真实的读速度：

	sudo /sbin/sysctl -w vm.drop_caches=3
	dd if=/tmp/tempfile of=/dev/null bs=1M count=1024


## hdparm
使用 hdparm 也可以对硬盘进行测试。

	apt install hdparm

先用 `lsblk` 或者 `fdisk -l` 来查看设备信息，一般磁盘都是 `/dev/sda` 这样。

然后用如下命令测试：

	sudo hdparm -Tt /dev/sda

	/dev/sda:
	 Timing cached reads:   31236 MB in  1.99 seconds = 15733.75 MB/sec
	 Timing buffered disk reads: 504 MB in  3.01 seconds = 167.51 MB/sec


## reference

- <https://www.shellhacks.com/disk-speed-test-read-write-hdd-ssd-perfomance-linux/>



