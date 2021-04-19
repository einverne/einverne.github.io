---
layout: post
title: "Clonezilla 克隆系统"
tagline: ""
description: "问题的提出到解决"
category: 经验总结
tags: [clonezilla, linux, backup, clone, ssd, system,]
last_updated:
---

之前遇到的一个问题，安装 Linux Mint 的系统分区快要满了，但是我又不想重装系统，于是就提出来这样的一个问题 ---- 如何在不重装系统的情况下，将系统盘从一块分区中复制到另一块磁盘的分区中，整体备份系统。当时整天得想着如何解决这样的一个问题比较好，于是有了这篇文章。当然也借由这篇文章讲述一个复杂问题的提出到解答的整个过程。其他类似问题的解决过程也是类似的。

## 一个问题的提出到解决

问题：整体备份 Linux 系统，免去重装系统，进行各种配置，以及安装各种应用的麻烦

问题相关：Windows 下有 Ghost 类似的工具可以协助完成 Windows 系统镜像的制作，并且可以完整恢复系统，而 Mac 下有 Time Machine 类似的工具，似乎可以还原整个系统。我想 Linux 下应该也存在类似的工具。

问题解决：经过 Google，Linux 下备份系统的方式可以有很多，我不想使用命令行，如果有现成工具最好，最后锁定关键词 “Clonezilla”，一款非常强大的备份工具，可以用来备份整块硬盘，从分区到镜像，或者直接写入其他硬盘或者分区。

之后搜索 Clonezilla 相关教程以及使用，借助 YouTube 视频熟悉使用过程，下载 ISO 镜像，安装物理硬盘，制作启动 U 盘，从 U 盘启动电脑，熟悉 Linux 下电脑硬盘的名称，sda1，sdb1，sdb2，sdc1，类似的名称，基本上 sda 就表示一块硬盘，后面接的数字是在该硬盘上的分区，在使用 Clonezilla 的过程中一定要**注意备份数据**，目标一定要指定**空分区**，或者**空磁盘**，否则目标磁盘的数据会全部被清除。

在我的真实例子中，我的 Linux Mint 安装在一块硬盘的一个分区中，利用命令或者 GUI，查看该分区的名称，然后我的解决方法是给电脑新安装了一块 SSD，将光驱位换了。然后给该硬盘分区，并查看该分区的名称，然后利用学习到的 Clonezilla 来完成系统从一个分区到另一个分区的克隆。

![clonezilla clone linux partition](https://img.gtk.pw/file/evimages/clonezilla_linux_IMG_20160606_224814.jpg)

从上图就可以看出，我是将 `/dev/sdb8` 分区拷贝到 `/dev/sda1` 分区。

如下使用 `sudo blkid` 查看 UUID。

```
/dev/sda1: UUID="a7a98d76-5dab-4272-8b9a-b82042b279c5" TYPE="ext4"
/dev/sdb1: LABEL="Program" UUID="000E3FDB00097ED7" TYPE="ntfs"
/dev/sdb5: LABEL="Document" UUID="000C3A300002F285" TYPE="ntfs"
/dev/sdb6: LABEL="Media" UUID="0005653100096CB5" TYPE="ntfs"
/dev/sdb7: UUID="ad6f91df-ba08-4fad-8efc-ac1254320e2d" TYPE="swap"
/dev/sdb8: UUID="5f920149-5676-46ef-b545-e50be77c65e2" TYPE="ext4"
/dev/sdc1: LABEL="System" UUID="EEBACEF9BACEBCF9" TYPE="ntfs"
/dev/sdc2: UUID="8A0005F80005EBCF" TYPE="ntfs"
```

在完成从分区到分区的克隆之后，修复系统磁盘 UUID 以及启动引导 grub。这里花费了一些时间去了解 [[GRUB]] 的启动过程。学习了一些命令。

```
sudo blkid   #查看磁盘 UUID
sudo fdisk -l  #查看磁盘

vim /etc/fstab  #磁盘的信息
vim /boot/grub/grub.cfg   #启动引导的信息
# 大部分的情况下不需要直接修改这两个文件，查看一下内容即可，使用其他命令更新，无需手动的修改里面的值。

update-grub2   #更新启动引导
```

由于我在使用 Clonezilla 备份恢复的时候使用的是从硬盘一块分区拷贝到另一块硬盘分区，所以在完成备份成功之后两款分区的 UUID 是一样的，这样就导致开机引导的时候总是回到原来的系统，需要给新的分区重新指定一个 UUID，然后更新 GRUB 才能完成启动到新的硬盘分区。可以通过下面的教程完成 UUID 的修改。

至于修改 Linux 分区的 UUID 其实是另一个问题，当完成从问题提出到解决的过程就能解决。

## 修改 Linux 分区 UUID

以下为翻译，原文见[参考][^1]

### UUID 介绍
Linux 分区的 UUID 的全称是 Universally Unique IDentifier。 这个 ID 会被用在不同的地方用来标识硬盘分区。最常见的就是在 `/etc/fstab` 文件中， 这个文件用来再系统启动时挂载分区。以下是一个小例子：

```
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
proc            /proc           proc    nodev,noexec,nosuid 0       0
# / was on /dev/sdc3 during installation
UUID=9467f4de-4231-401f-bcaa-fee718d49e85 /               ext4    errors=remount-ro 0       1
# swap was on /dev/sdb1 during installation
UUID=aabe7e48-2d11-421f-8609-7ea9d75e7f9b none            swap    sw              0       0
```

### UUID 的理由

理论上来讲创建两个 UUID 相同的几率是非常小的，可以参考 [Random UUID](http://en.wikipedia.org/wiki/Universally_unique_identifier) , 但是如果使用 [DD](http://www.sudo-juice.com/how-to-clone-a-hard-drive-in-ubuntu-linux/) 或者 Clonezilla 在同一台设备克隆并恢复了分区，那么就有可能导致完全一样的分区 ID。

使用以上两个命令将会创建两个一模一样的分区，包括 UUID。在这样的情况下，就需要手动更改 UUID。

### 修改 UUID

第一步，首先利用 `sudo blkid` 来获取分区标示。

```
/dev/sdb1: UUID="aabe7e48-2d11-421f-8609-7ea9d75e7f9b" TYPE="swap"
/dev/sdc1: UUID="9467f4de-4231-401f-bcaa-fee718d49e85" TYPE="ext4"
/dev/sdc3: UUID="93a54a4a-e0f5-4152-ae59-2245e8d16ee4" TYPE="ext4"
/dev/sde5: UUID="9467f4de-4231-401f-bcaa-fee718d49e85" TYPE="ext4"
/dev/sde6: LABEL="var" UUID="30433f28-1b79-4b4d-9985-fef5b1c886b5" TYPE="ext4"
```

如上图可以看出 `/dev/sdc1` 和 `/dev/sde5` 的 UUID 完全一致。第二步，使用命令 `uuidgen` 产生新的 UUID

```bash
uuidgen
f0acce91-a416-474c-8a8c-43f3ed3768f9
```

最后将新的 UUID 应用到新的分区中，

```
sudo tune2fs /dev/sde5 -U f0acce91-a416-474c-8a8c-43f3ed3768f9
```

最后，更新 grub (`sudo update-grub`) 来使用新的 UUID，以免导致系统的混乱。

## reference

[^1]: <http://www.sudo-juice.com/how-to-change-the-uuid-of-a-linux-partition/>
