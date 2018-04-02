---
layout: post
title: "Linux 交换分区"
tagline: ""
description: ""
category: 
tags: [linux, swap, partition, ]
last_updated: 
---

Linux内核为了提高读写效率与速度，会将文件在内存中进行缓存，这部分内存就是Cache Memory(缓存内存)。即使你的程序运行结束后，Cache Memory也不会自动释放。这就会导致你在Linux系统中程序频繁读写文件后，你会发现可用物理内存变少。

> Linux divides its physical RAM (random access memory) into chucks of memory called pages. Swapping is the process whereby a page of memory is copied to the preconfigured space on the hard disk, called swap space, to free up that page of memory. The combined sizes of the physical memory and the swap space is the amount of virtual memory available.

> Swap space in Linux is used when the amount of physical memory (RAM) is full. If the system needs more memory resources and the RAM is full, inactive pages in memory are moved to the swap space. While swap space can help machines with a small amount of RAM, it should not be considered a replacement for more RAM. Swap space is located on hard drives, which have a slower access time than physical memory.Swap space can be a dedicated swap partition (recommended), a swap file, or a combination of swap partitions and swap files.

Linux通过一个参数swappiness来控制swap分区使用情况，临时修改swappiness值可以通过以下两种方式

手动修改文件

    vim /proc/sys/vm/swappiness
    # or
    echo 10 > /proc/sys/vm/swappiness

或者

    sysctl vm.swappiness=10

永久修改swappiness参数的方法就是在配置文件 `/etc/sysctl.conf` 里面修改vm.swappiness的值，然后重启系统

    echo 'vm.swappiness=10' >>/etc/sysctl.conf

## swap 分区操作

查看 swap 分区大小及使用情况,使用 free 命令

    free -h

也可以使用 swapon 查看 swap 分区信息

    swapon -s

也可以直接查看文件

    cat /proc/swaps

关闭交换分区

    swapoff /dev/mapper/VolGroup00-LogVol01
    
缩小 swap 分区

    lvreduce -L 8G /dev/mapper/VolGroup00-LogVol01

格式化 swap 分区

    mkswap /dev/mapper/VolGroup00-LogVol01

启动swap分区,并增加到/etc/fstab自动挂载

    swapon /dev/mapper/VolGroup00-LogVol01

## swap 分区建立
在装完Linux系统之后，建立Swap分区有两种方法:

1. 新建磁盘分区作为swap分区
2. 用文件作为swap分区 

swap 分区大小设置

    4G以内的物理内存，SWAP 设置为内存的2倍。
    4-8G的物理内存，SWAP 等于内存大小。
    8-64G 的物理内存，SWAP 设置为8G。
    64-256G物理内存，SWAP 设置为16G。

### 新建磁盘分区作为swap分区
以root身份登入控制台，输入

    swapoff -a #停止所有的swap分区

用fdisk命令对磁盘进行分区，添加swap分区，新建分区，在fdisk中用"t"命令将新添的分区id改为82（Linux swap类型），最后用w将操作实际写入硬盘

    fdisk /dev/sdb

格式化swap分区，这里的sdb2要看您加完后p命令显示的实际分区设备名

    mkswap /dev/sdb2 

启动新的swap分区

    swapon /dev/sdb2 

为了让系统启动时能自动启用这个交换分区，可以编辑 `/etc/fstab`,加入下面一行

    /dev/sdb2 swap swap defaults 0 0

### 使用文件作为swap分区

创建要作为swap分区的文件:增加1GB大小的交换分区，则命令写法如下，其中的count等于想要的块的数量（bs*count=文件大小）。

    dd if=/dev/zero of=/root/swapfile bs=1M count=1024

格式化为交换分区文件:

    mkswap /root/swapfile #建立swap的文件系统

启用交换分区文件:

    swapon /root/swapfile #启用swap文件

使系统开机时自启用，在文件/etc/fstab中添加一行：

    /root/swapfile swap swap defaults 0 0

