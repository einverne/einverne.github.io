---
layout: post
title: "修复 Ubuntu 丢失的引导"
aliases: ""
tagline: ""
description: ""
category: 经验总结
tags: [ linux, ubuntu, grub, boot-loader,  ]
last_updated:
---

今天工作的电脑因为长时间没有关机，重启了一下之后发现竟然无法启动，显示 no bootable device。大概率是因为更新的时候把 Ubuntu 的 GRUB 给更新坏了。

## 纯手工
首先需要通过可以启动的 U 盘系统开机，然后使用 `grub-install` 来安装 GRUB:

    fdisk -l
    sudo blkid
    sudo mount /dev/sda1 /mnt
    sudo grub-install --boot-directory=/mnt/boot /dev/sda

## 使用 boot-repair 工具一键修复
先使用 USB Ubuntu 系统，从 USB 启动系统，然后在上面安装工具 boot-repair 工具：

```
sudo apt-add-repository ppa:yannubuntu/boot-repair
sudo apt update
sudo apt-get install boot-repair -y
```

然后启动 boot-repair 自动找到对应的硬盘进行修复。

推荐使用这种方式进行修复。


在 Windows 上有一个类似的工具叫做：EasyBCD


## 半自动
修复完成之后再复盘之前的错误，大概率是因为我的系统是 Clonezilla 从之前的硬盘中拷贝过来的，所以我的引导分区在另外一块硬盘之上，但是更新系统的时候将这块引导分区给更新坏了。

    # backup
    dd if=/dev/sda2 of=$HOME/sda2.dd
    
    #wipe it
    dd if=/dev/zero of=/dev/sda2
    
