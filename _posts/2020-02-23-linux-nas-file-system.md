---
layout: post
title: "NAS 下文件系统比较"
tagline: ""
description: ""
category: 学习笔记
tags: [nas, filesystem, file, ext4, owm, zfs]
last_updated:
---

记录一下常见的 Linux 的文件系统。

## ext4
ext4 是目前 Debian/Ubuntu/Mint 的默认文件系统，比较常见，它其实是第 4 代扩展文件系统 (Fourth extended filesystem), 是 ext3 的延续。

- ext4 对大文件有着比较好的支持，最大支持 1 EiB 的卷，标准 4Kib 块大小下支持单文件最大 16 TiB
- Extents
- ext4 兼容 ext3, ext2
- ext4 允许对一些文件预留空间 (Persistent pre-allocation)
- Delayed allocation
- 无限制的子目录，Linux 4.12 及以后 `largedir` 功能使用 3 级 HTree，允许在单目录下拥有大约 6 百万条目
- ext4 使用日志校验和来提高稳定性
- ext4 使用纳秒来管理 timestamp
- Linux kernel 4.1 后加入了透明加密
- ext4 支持默认写屏障，确保了即使写时断电，文件的元信息可以正确写入磁盘

更多的 ext4 的特性，可以参考 [wiki](https://en.wikipedia.org/wiki/Ext4)

## ZFS
ZFS 是由 Sun Microsystems 设计的组合文件系统和逻辑卷管理器。ZFS 具有良好的扩展性，可以有效防止数据损坏，对高容量有着良好支持，可以有效压缩数据，有快照功能，有 copy-on-write 特性，支持完整性检查，支持 RAID-Z。ZFS 最初是 Sun 作为 Solaris 内部开发的闭源软件，2005 年跟随着 Solaris 开源。2010 年，Sun 被 Oracle 收购，ZFS 成为 Oracle 的注册商标，Oracle 停止为新的 OpenSolaris 和 ZFS 开发发布更新的源代码，从而有效地将 Oracle 的 ZFS 恢复为封闭源代码。作为回应开源社区建立了 illumos 项目，维护 Solaris 开发，并在 2013 年成立 OpenZFS 继续开源版本的 ZFS 开发。OpenZFS 被广泛用于类 Unix 系统中。[^zfs]

- ZFS 为数据长期存储和扩容而设计
- ZFS 支持存储池，可以建立跨越磁盘的存储池
- copy-on-write, ZFS 文件系统中，新信息会被写入到不同的 block 中，写完成后元数据将更新指向为新信息，这个机制可以保证写过程中即使系统崩溃，旧数据也会保留，这意味着系统崩溃后无需执行 fsck.
- 数据和元数据分开存储，用以校验整个文件系统，在文件发生损坏时及时修复
- 在某些情况下，如果发生错误或不一致，将自动回滚文件系统和数据的最新更改。
- ZFS 有自己的 RAID，RAID-Z 实现
- ZFS 文件系统能够提供最大 16 EiB 文件大小，最大 256 万亿 ZiB 存储

[^zfs]: <https://en.wikipedia.org/wiki/ZFS>

## btrfs
btrfs 是 b-tree 文件系统的缩写，最初是 Oracle 为 Linux 而设计，遵循着 copy-on-write 原则。btrfs 旨在解决 Linux 文件系统中缺乏 pooling，快照，校验和和完整的多设备跨接的问题。[^btrfs]

[^btrfs]: <https://en.wikipedia.org/wiki/Btrfs>


## XFS 文件系统
XFS 是一个高性能 64 bit 日志文件系统， 1993 年由 Silicon Graphics, Inc (SGI) 公司创建，原来是作为该公司 IRIX 操作系统 5.3 版本后的默认文件系统，后在 2001 年被移植到 Linux Kernel，XFS 被大多数的 Linux 发行版支持，XFS 适合用来处理大文件。[^xfs]

[^xfs]: <https://en.wikipedia.org/wiki/XFS>

## JFS 文件系统
JFS是一款由IBM开发的64位日志文件系统。支持AIX，eComStation，OS/2和Linux等操作系统。


## f2fs
F2FS 是一种闪存文件系统，由金载极在三星集团研发，适合Linux内核使用。此文件系统起初是为了NAND闪存的存储设备设计，这些设备广泛存在于自移动设备至服务器领域。 三星应用了日志结构文件系统的概念，使它更适合用于存储设备。[^f2fs]

[^f2fs]: <https://zh.wikipedia.org/zh-hans/F2FS>