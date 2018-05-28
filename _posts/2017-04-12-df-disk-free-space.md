---
layout: post
title: "每天学习一个命令：df 查看磁盘剩余空间"
tagline: ""
description: ""
category: Linux
tags: [linux, df, disk, 磁盘空间,]
last_updated: 
---

之前也介绍过 [di](/post/2017/10/disk-information-command.html) disk information，不过系统默认不带，需要自己安装，如果遇到没有权限安装时，就可以使用 df 来查看当前机器剩余磁盘空间。

df 全称 disk filesystem，用于显示 Linux 系统磁盘利用率。

## 使用

直接使用 `df` ，显示设备名称、总块数、总磁盘空间、已用磁盘空间、可用磁盘空间和文件系统上的挂载点。

    Filesystem     1K-blocks      Used Available Use% Mounted on
    udev             8126360         0   8126360   0% /dev
    tmpfs            1629376     75432   1553944   5% /run
    /dev/sdb1      240230912 185617700  42387064  82% /
    tmpfs            8146864    546884   7599980   7% /dev/shm
    tmpfs               5120         4      5116   1% /run/lock
    tmpfs            8146864         0   8146864   0% /sys/fs/cgroup
    /dev/loop1         83712     83712         0 100% /snap/core/4206
    /dev/loop2           128       128         0 100% /snap/anbox-installer/17
    /dev/loop4        259584    259584         0 100% /snap/electronic-wechat/7
    cgmfs                100         0       100   0% /run/cgmanager/fs
    tmpfs            1629376        72   1629304   1% /run/user/1000
    /dev/sda3      723180576     70584 686351464   1% /media/user/add8bd89-da2a-4573-ac6e-7ec44f8c5414
    /dev/loop5         84096     84096         0 100% /snap/core/4327
    /dev/loop3         95872     95872         0 100% /snap/slack/6
    /dev/loop6         88704     88704         0 100% /snap/core/4407

`df -h` 可以显示比较友好的输出

    Filesystem      Size  Used Avail Use% Mounted on
    udev            7.8G     0  7.8G   0% /dev
    tmpfs           1.6G   74M  1.5G   5% /run
    /dev/sdb1       230G  178G   41G  82% /
    tmpfs           7.8G  534M  7.3G   7% /dev/shm
    tmpfs           5.0M  4.0K  5.0M   1% /run/lock
    tmpfs           7.8G     0  7.8G   0% /sys/fs/cgroup
    /dev/loop1       82M   82M     0 100% /snap/core/4206
    /dev/loop2      128K  128K     0 100% /snap/anbox-installer/17
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

`df -ih` 显示 inodes

    Filesystem     Inodes IUsed IFree IUse% Mounted on
    udev             2.0M   520  2.0M    1% /dev
    tmpfs            2.0M   888  2.0M    1% /run
    /dev/sdb1         15M  1.8M   13M   12% /

## 相关

查看磁盘占用 [du](/post/2018/03/du-find-out-which-fold-take-space.html)
