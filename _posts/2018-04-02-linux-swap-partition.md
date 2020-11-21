---
layout: post
title: "Linux 交换分区"
tagline: ""
description: "Linux 交换分区相关知识"
category: Linux
tags: [linux, swap, partition, lvm, ]
last_updated:
---

Linux 内核为了提高读写效率与速度，会将文件在内存中进行缓存，这部分内存就是 Cache Memory（缓存内存）。即使你的程序运行结束后，Cache Memory 也不会自动释放。这就会导致你在 Linux 系统中程序频繁读写文件后，你会发现可用物理内存变少。

> Linux divides its physical RAM (random access memory) into chucks of memory called pages. Swapping is the process whereby a page of memory is copied to the preconfigured space on the hard disk, called swap space, to free up that page of memory. The combined sizes of the physical memory and the swap space is the amount of virtual memory available.

> Swap space in Linux is used when the amount of physical memory (RAM) is full. If the system needs more memory resources and the RAM is full, inactive pages in memory are moved to the swap space. While swap space can help machines with a small amount of RAM, it should not be considered a replacement for more RAM. Swap space is located on hard drives, which have a slower access time than physical memory.Swap space can be a dedicated swap partition (recommended), a swap file, or a combination of swap partitions and swap files.

Linux 通过一个参数 swappiness 来控制 swap 分区使用情况，swappiness 是控制系统使用 swap 分区的频率阈值，当 swappiness = 100 时，系统会积极使用 swap 分区，而当 swappiness = 0 时，系统会最大限度的使用物理内存。

    Swappiness is a property for the Linux kernel that changes the balance between swapping out runtime memory, as opposed to dropping pages from the system page cache. Swappiness can be set to values between 0 and 100 inclusive. A low value means the kernel will try to avoid swapping as much as possible where a higher value instead will make the kernel aggressively try to use swap space. The default value is 60, and for most desktop systems, setting it to 100 may affect the overall performance, whereas setting it lower (even 0) may improve interactivity (decreasing response latency.)[1]
    In short:
    vm.swappiness = 0 - it will swap only to avoid an out of memory condition
    vm.swappiness = 60 - default value
    vm.swappiness = 100 - it will swap aggressvely
    To temporarily set the swappiness in Linux, as root you set the value to 100 with the following command: echo 100 > /proc/sys/vm/swappiness
    Permanent changes are made in /etc/sysctl.conf via the following configuration line (inserted if not present previously): vm.swappiness = 100

临时修改 swappiness 值可以通过以下两种方式：

手动修改文件

    vim /proc/sys/vm/swappiness
    # or
    echo 10 > /proc/sys/vm/swappiness

或者

    sysctl vm.swappiness=10

永久修改 swappiness 参数的方法就是在配置文件 `/etc/sysctl.conf` 里面修改 vm.swappiness 的值，然后重启系统

    echo 'vm.swappiness=10' >>/etc/sysctl.conf

## swap 分区操作

查看 swap 分区大小及使用情况，使用 free 命令

    free -h

也可以使用 swapon 查看 swap 分区信息

    swapon -s                   # --summary 显示 swap 的使用情况
    swapon --show               # 显示结果更好看

也可以直接查看文件

    cat /proc/swaps             # 和 swapon -s 相同

关闭交换分区

    swapoff /dev/mapper/VolGroup00-LogVol01

缩小 swap 分区

    lvreduce -L 8G /dev/mapper/VolGroup00-LogVol01

格式化 swap 分区

    mkswap /dev/mapper/VolGroup00-LogVol01

启动 swap 分区，并增加到 /etc/fstab 自动挂载

    swapon /dev/mapper/VolGroup00-LogVol01

## swap 分区建立
在装完 Linux 系统之后，建立 Swap 分区有两种方法：

1. 新建磁盘分区作为 swap 分区
2. 用文件作为 swap 分区

swap 分区大小设置

    4G 以内的物理内存，SWAP 设置为内存的 2 倍。
    4-8G 的物理内存，SWAP 等于内存大小。
    8-64G 的物理内存，SWAP 设置为 8G。
    64-256G 物理内存，SWAP 设置为 16G。

### 新建磁盘分区作为 swap 分区
以 root 身份登入控制台，输入：

    swapoff -a              #停止所有的 swap 分区

用 fdisk 命令对磁盘进行分区，添加 swap 分区，新建分区，在 fdisk 中用"t"命令将新添的分区 id 改为 82（Linux swap 类型），最后用 w 将操作实际写入硬盘：

    fdisk /dev/sdb

格式化 swap 分区，这里的 sdb2 要看，加完后 p 命令显示的实际分区设备名：

    mkswap /dev/sdb2

启用新的 swap 分区：

    swapon /dev/sdb2

为了让系统启动时能自动启用这个交换分区，可以编辑 `/etc/fstab`, 加入下面一行

    /dev/sdb2 none swap sw 0 0

### 使用文件作为 swap 分区

创建要作为 swap 分区的文件：增加 1GB 大小的交换分区，则命令写法如下，其中的 count 等于想要的块的数量（bs*count= 文件大小）。注意这里的 `of` 后面的路径可以根据自己的环境变化。

    dd if=/dev/zero of=/root/swapfile bs=1M count=1024

格式化为交换分区文件：

    mkswap /root/swapfile #建立 swap 的文件系统

启用交换分区文件：

    swapon /root/swapfile #启用 swap 文件

使系统开机时自启用，在文件 /etc/fstab 中添加一行：

    /root/swapfile none swap sw 0 0

