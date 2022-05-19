---
layout: post
title: "每天学习一个命令：parted 在 Linux 下给硬盘分区"
aliases: "每天学习一个命令：parted 在 Linux 下给硬盘分区"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, parted, gparted, partition, clonezilla,]
last_updated:
---

`parted` 是 GNU 组织开发的一款功能强大的**磁盘分区**和**分区大小调整工具**，命令可以对磁盘进行分区和管理，和 `fdisk` 相比，能够支持 2T 以上磁盘。它可以处理最常见的分区格式，包括：ext2、ext3、fat16、fat32、NTFS、ReiserFS、JFS、XFS、UFS、HFS 以及 Linux 交换分区。

功能特点：

- 能够创建、清除、调整、移动和复制 ext2, ext3, ext4, linux swap, fat32, ntfs 等分区
- 能够重新分配磁盘使用情况

`parted` 有两种使用方式：

- 命令行模式
- 交互命令模式

## 命令行方式
定义分区表格式

    parted -s /dev/sda mklabel gpt

划分主分区

    parted -s /dev/sda mkpart primary ext4 1 10G

划分逻辑分区

    parted -s /dev/sda mkpart logic 10G 20G

查看分区情况

    parted -s /dev/sda p

直接使用一行命令来完成分区操作

    parted /dev/sdb mklabel gpt mkpart 1 ext4 1 5T


## 交互命令方式
使用 `parted /dev/sdb` 来进入对 `/dev/sdb` 硬盘的管理。

在交互命令下可以使用如下命令

| 交互命令    | 功能                                                                                    |
| ----------- | --------------------------------------------------------------------------------------- |
| mklabel gpt | 定义分区表格式，常用的有 msdos 和 gpt 分区格式，2T 以上硬盘选用 gpt                     |
| mkpart p1   | 创建第一个分区，名称为 p1，在使用该命令后会选择分区的格式，分区起始位置，分区的结束位置 |
| print       | 查看当前分区情况                                                                        |
| rm          | 删除分区，之后会选择想要删除的分区‘                                                     |
| help        | 帮助                                                                                    |
| quit        | 退出                                                                                    |

在划分分区之后，可以使用

    mkfs.ext4 /dev/sdb1

来针对 sdb 磁盘上第一块分区进行格式化。然后挂载分区 `mount /dev/sdb1 /mnt/sdb1`。

对于一块新的硬盘，如果没有 GUI 的界面来进行格式化，就需要用到这个命令了。

## 具体用法

### 变更分区大小
执行 `parted /dev/sda` 进入交互式命令之后。 

可以使用 `resizepart` 命令来更改分区的大小。

	resizepart partition end

说明：

- 这里的 partition 值得是分区的编号，可以使用 `print` 查看，前面的数字编号就是这里的分区编号
- end 值得是更改后的分区末尾位置
