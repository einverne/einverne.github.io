---
layout: post
title: "每天学习一个命令：df 查看磁盘剩余空间"
aliases: "每天学习一个命令：df 查看磁盘剩余空间"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, df, disk, 磁盘空间 , command, ]
last_updated:
---

之前也介绍过 [di](/post/2017/10/disk-information-command.html) disk information，不过系统默认不带，需要自己安装，如果遇到没有权限安装时，就可以使用 df 来查看当前机器剩余磁盘空间。

df 全称 disk filesystem，用于显示 Linux 系统磁盘利用率，通常也用来查看磁盘占用空间。

## 命令格式

    df [OPTIONS] [FILE]

直接使用不加任何参数会显示所有当前被挂载的文件系统的可用空间。默认会以 1KB 为单位显示。

选项：

    -a      全部文件系统列表
    -h      方便阅读方式显示
    -H      等于“-h”，但是计算式，1K=1000，而不是 1K=1024
    -i      显示 inode 信息
    -k      区块为 1024 字节
    -l      只显示本地文件系统
    -m      区块为 1048576 字节
    --no-sync 忽略 sync 命令
    -P      输出格式为 POSIX
    --sync  在取得磁盘信息前，先执行 sync 命令
    -T      展示文件系统类型，比如 ext4, tmpfs, 等等

## 使用实例

### 直接使用

直接使用 `df` ，显示设备名称、总块数、总磁盘空间、已用磁盘空间、可用磁盘空间和文件系统上的挂载点。

    Filesystem     1K-blocks      Used Available Use% Mounted on
    udev             8126360         0   8126360   0% /dev
    tmpfs            1629376     75432   1553944   5% /run
    /dev/sdb1      240230912 185617700  42387064  82% /
    tmpfs            8146864    546884   7599980   7% /dev/shm
    tmpfs               5120         4      5116   1% /run/lock
    tmpfs            8146864         0   8146864   0% /sys/fs/cgroup
    /dev/loop1         83712     83712         0 100% /snap/core/4206
    /dev/loop4        259584    259584         0 100% /snap/electronic-wechat/7
    cgmfs                100         0       100   0% /run/cgmanager/fs
    tmpfs            1629376        72   1629304   1% /run/user/1000
    /dev/sda3      723180576     70584 686351464   1% /media/user/add8bd89-da2a-4573-ac6e-7ec44f8c5414
    /dev/loop5         84096     84096         0 100% /snap/core/4327
    /dev/loop3         95872     95872         0 100% /snap/slack/6
    /dev/loop6         88704     88704         0 100% /snap/core/4407

df 命令输出：

- 第一列是文件系统对应的设备文件路径名，一般是硬盘分区名
- 第二列是分区包含的数据块数目
- 第三、四列分别表示已用和可用的数据块数目，三、四列块数之和不等于第二列块数，缺省每个分区都会预留少量空间给系统管理员使用
- 第五列，Use% 表示普通用户空间占用百分比
- 最后一列，表示文件系统挂载点

优化输出，以更加易读的方式输出结果

`df -h` 可以显示比较友好的输出

    Filesystem      Size  Used Avail Use% Mounted on
    udev            7.8G     0  7.8G   0% /dev
    tmpfs           1.6G   74M  1.5G   5% /run
    /dev/sdb1       230G  178G   41G  82% /
    tmpfs           7.8G  534M  7.3G   7% /dev/shm
    tmpfs           5.0M  4.0K  5.0M   1% /run/lock
    tmpfs           7.8G     0  7.8G   0% /sys/fs/cgroup
    /dev/loop1       82M   82M     0 100% /snap/core/4206
    /dev/loop4      254M  254M     0 100% /snap/electronic-wechat/7
    cgmfs           100K     0  100K   0% /run/cgmanager/fs
    tmpfs           1.6G   72K  1.6G   1% /run/user/1000
    /dev/sda3       690G   69M  655G   1% /media/mi/add8bd89-da2a-4573-ac6e-7ec44f8c5414
    /dev/loop5       83M   83M     0 100% /snap/core/4327
    /dev/loop3       94M   94M     0 100% /snap/slack/6
    /dev/loop6       87M   87M     0 100% /snap/core/4407

`df -hT` 其中 `-T` 参数显示文件类型 ext4 等等

    Filesystem     Type      Size  Used Avail Use% Mounted on
    udev           devtmpfs  7.8G     0  7.8G   0% /dev
    tmpfs          tmpfs     1.6G   74M  1.5G   5% /run
    /dev/sdb1      ext4      230G  178G   41G  82% /

说明：

- `-h`  目前磁盘空间和使用情况 以更易读的方式显示
- `-H`  和上面的 -h 参数相同，换算时采用 1000 而不是 1024 进行容量转换
- `-k`  以单位 1K 显示磁盘的使用情况

### 用 inode 方式显示磁盘使用情况
使用 `-i` 参数

    df -i

输出结果为

    Filesystem       Inodes   IUsed    IFree IUse% Mounted on
    udev            2031887     539  2031348    1% /dev
    tmpfs           2036709     941  2035768    1% /run
    /dev/sdb1      15269888 1896147 13373741   13% /
    tmpfs           2036709     497  2036212    1% /dev/shm
    tmpfs           2036709       4  2036705    1% /run/lock
    tmpfs           2036709      18  2036691    1% /sys/fs/cgroup
    /dev/loop0        28782   28782        0  100% /snap/electronic-wechat/7
    cgmfs           2036709      14  2036695    1% /run/cgmanager/fs
    tmpfs           2036709     132  2036577    1% /run/user/1000
    /dev/loop8        12810   12810        0  100% /snap/core/6034
    /dev/sda1      14082048 1673302 12408746   12% /media/mi/3d1b7e3e-c184-4664-9555-2b088997f2c8
    /dev/sda3      45932544      11 45932533    1% /media/mi/8803a3c6-1561-4957-b9b3-e60d5688d1a6
    /dev/sdc       12229708      20 12229688    1% /media/mi/data

**inode** (index node) 是一个在类 Unix 文件系统下用来描述文件系统对象（文件或者目录）的数据结构。每一个 indoe 保存对象数据的属性和磁盘块地址。文件类型对象属性包括 metadata（修改时间，访问属性等）和文件的所有者以及文件权限。

`df -ih` 显示 inodes

    Filesystem     Inodes IUsed IFree IUse% Mounted on
    udev             2.0M   520  2.0M    1% /dev
    tmpfs            2.0M   888  2.0M    1% /run
    /dev/sdb1         15M  1.8M   13M   12% /

### 输出磁盘文件系统
常见的文件系统有 Windows 下的 FAT32，NTFS，Unix 系统下的 ext3， ext4，添加 `-T` 参数在输出结果中增加一列来表示当前分区的文件系统。

    df -T

而如果要在结果中筛选特定文件系统的分区可以使用 `-t ext4` ，比如要过滤出只显示 ext4 分区

    df -t ext4

## 相关

查看磁盘占用 [du](/post/2018/03/du-find-out-which-fold-take-space.html)

## 外延
假如你的 250G 的系统盘即将存满，下面的方式可以缓解一下硬盘压力。

移除不再使用的 package

	sudo apt autoremove
	sudo apt-get autoclean

查看系统日志占用：

	journalctl --disk-usage
	sudo journalctl --vacuum-time=3d


查看 SNAP 占用

	du -h /var/lib/snapd/snaps
	snap list --all
	snap remove some-package

## reference

- man df
