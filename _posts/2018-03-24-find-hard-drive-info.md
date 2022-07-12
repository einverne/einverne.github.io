---
layout: post
title: "Linux 下使用命令获取硬盘信息"
aliases: "Linux 下使用命令获取硬盘信息"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, hard-drive, ssd, ]
last_updated:
---

本文主要是一些和硬盘相关的命令，包括如何查看硬盘的型号，容量，还有硬盘上的分区情况，来详细了解本机硬盘的状态。

## hdparm
如果想要在 Linux 下查看硬盘信息，可以使用命令 `hdparm` 。这个命令可以用来查看硬盘制造商，序列号等等有用信息。`man hdparm` 中告诉我， `hdparm` 命令是用来查看或者设置 SATA/IDE 设备参数的。

### 查看设备信息
假设本地有设备 `/dev/sda` 那么可以使用

    hdparm -I /dev/sda

来查看该设备的信息

    /dev/sda:

    ATA device, with non-removable media
            Model Number:       Netac SSD  240G
            Serial Number:      5002B725438XXXX
            Firmware Revision:  O1217A
            Transport:          Serial, ATA8-AST, SATA 1.0a, SATA II Extensions, SATA Rev 2.5, SATA Rev 2.6, SATA Rev 3.0
    Standards:
            Supported: 9 8 7 6 5
            Likely used: 9
    Configuration:
            Logical         max     current
            cylinders       16383   16383
            heads           16      16
            sectors/track   63      63
            --
            CHS current addressable sectors:   16514064
            LBA    user addressable sectors:  268435455
            LBA48  user addressable sectors:  468862128
            Logical  Sector size:                   512 bytes
            Physical Sector size:                   512 bytes
            Logical Sector-0 offset:                  0 bytes
            device size with M = 1024*1024:      228936 MBytes
            device size with M = 1000*1000:      240057 MBytes (240 GB)
            cache/buffer size  = unknown
            Nominal Media Rotation Rate: Solid State Device
    Capabilities:
            LBA, IORDY(can be disabled)
            Queue depth: 32
            Standby timer values: spec'd by Standard, no device specific minimum
            R/W multiple sector transfer: Max = 2   Current = 2
            DMA: mdma0 mdma1 mdma2 udma0 udma1 udma2 udma3 udma4 udma5 *udma6
                 Cycle time: min=120ns recommended=120ns
            PIO: pio0 pio1 pio2 pio3 pio4
                 Cycle time: no flow control=120ns  IORDY flow control=120ns
    Commands/features:
            Enabled Supported:
               *    SMART feature set
                    Security Mode feature set
               *    Power Management feature set
               *    Write cache
               *    Look-ahead
               *    Host Protected Area feature set
               *    WRITE_BUFFER command
               *    READ_BUFFER command
               *    NOP cmd
               *    DOWNLOAD_MICROCODE
                    SET_MAX security extension
               *    48-bit Address feature set
               *    Device Configuration Overlay feature set
               *    Mandatory FLUSH_CACHE
               *    FLUSH_CACHE_EXT
               *    SMART error logging
               *    SMART self-test
               *    General Purpose Logging feature set
               *    WRITE_{DMA|MULTIPLE}_FUA_EXT
               *    {READ,WRITE}_DMA_EXT_GPL commands
               *    Segmented DOWNLOAD_MICROCODE
               *    Gen1 signaling speed (1.5Gb/s)
               *    Gen2 signaling speed (3.0Gb/s)
               *    Gen3 signaling speed (6.0Gb/s)
               *    Native Command Queueing (NCQ)
               *    Host-initiated interface power management
               *    Phy event counters
               *    READ_LOG_DMA_EXT equivalent to READ_LOG_EXT
               *    DMA Setup Auto-Activate optimization
                    Device-initiated interface power management
               *    Software settings preservation
                    Device Sleep (DEVSLP)
               *    SMART Command Transport (SCT) feature set
               *    SCT Write Same (AC2)
               *    SCT Features Control (AC4)
               *    SCT Data Tables (AC5)
               *    DOWNLOAD MICROCODE DMA command
               *    WRITE BUFFER DMA command
               *    READ BUFFER DMA command
               *    Data Set Management TRIM supported (limit 8 blocks)
               *    Deterministic read ZEROs after TRIM
    Security:
            Master password revision code = 65534
                    supported
            not     enabled
            not     locked
                    frozen
            not     expired: security count
                    supported: enhanced erase
            2min for SECURITY ERASE UNIT. 2min for ENHANCED SECURITY ERASE UNIT.
    Device Sleep:
            DEVSLP Exit Timeout (DETO): 40 ms (drive)
            Minimum DEVSLP Assertion Time (MDAT): 31 ms (drive)
    Checksum: correct

### 测试读取速度
`hdparm` 提供了一个简单的读速度测试参数

    hdparm -Tt /dev/sda

结果

    /dev/sda:
     Timing cached reads:   25572 MB in  2.00 seconds = 12798.56 MB/sec
     Timing buffered disk reads: 800 MB in  3.01 seconds = 266.08 MB/sec

能够看到 2 秒内读取了 25572M 缓存，而在 3 秒内从磁盘上物理读 800M 数据。


## fdisk
`fdisk` 主要用来查看和修改硬盘分区表，它能够识别 GPT，MBR，BSD 等等分区表。设备可以被划分为一个或者若干逻辑磁盘，这些逻辑磁盘叫做分区。这些分区信息被包含在分区表 (partition table) 中，通常在硬盘的 sector 0 中保存。

设备名通常叫做 `/dev/sda`， `/dev/sdb` 等等，设备的名字通常指整块硬盘，分区名字通常是设备名后面加上分区的序号，比如 `/dev/sda1` 表示的是第一块硬盘上的一个分区。详细的信息可以在 Linux kernel 文档 Documentation/devices.txt 文件中找到。

### GPT
GPT 的全称是 GUID Partition Table，全局唯一标识分区表，指的是一个实体硬盘的**分区表结构布局标准**。[^gpt] GPT 使用 64 bit 逻辑块地址。

[^gpt]: https://en.wikipedia.org/wiki/GUID_Partition_Table

### MBR
MBR 全称为 Master Boot Record，主引导扇区， DOS type。Sector 0 是被 4 个主分区 primary partition 描述占用的，逻辑分区 (Logical partition) 从序号 5 开始。

如果要查看硬盘的分区情况，可以使用 `fdisk`

    fdisk -l

结果

    Disk /dev/loop0: 81.7 MiB, 85692416 bytes, 167368 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes


    Disk /dev/loop1: 81.7 MiB, 85639168 bytes, 167264 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes


    Disk /dev/loop2: 81.6 MiB, 85549056 bytes, 167088 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes


    Disk /dev/sda: 223.6 GiB, 240057409536 bytes, 468862128 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes
    Disklabel type: dos
    Disk identifier: 0x5ad18deb

    Device     Boot Start       End   Sectors   Size Id Type
    /dev/sda1          63 468862127 468862065 223.6G 83 Linux


    Disk /dev/sdb: 931.5 GiB, 1000204886016 bytes, 1953525168 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 4096 bytes
    I/O size (minimum/optimal): 4096 bytes / 4096 bytes
    Disklabel type: dos
    Disk identifier: 0x29049925

    Device     Boot      Start        End    Sectors   Size Id Type
    /dev/sdb1  *            63  629153594  629153532   300G  7 HPFS/NTFS/exFAT
    /dev/sdb2        629153656 1953523711 1324370056 631.5G  f W95 Ext'd (LBA)
    /dev/sdb5        629153658 1153466999  524313342   250G  7 HPFS/NTFS/exFAT
    /dev/sdb6       1153467063 1782588464  629121402   300G  7 HPFS/NTFS/exFAT
    /dev/sdb7       1782589440 1798213631   15624192   7.5G 82 Linux swap / Solaris
    /dev/sdb8       1798215680 1953523711  155308032  74.1G 83 Linux

    Partition 1 does not start on physical sector boundary.
    Partition 5 does not start on physical sector boundary.
    Partition 6 does not start on physical sector boundary.


    Disk /dev/sdc: 119.2 GiB, 128035676160 bytes, 250069680 sectors
    Units: sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes
    Disklabel type: dos
    Disk identifier: 0x326f11b9

    Device     Boot     Start       End   Sectors   Size Id Type
    /dev/sdc1  *           63 248346992 248346930 118.4G  7 HPFS/NTFS/exFAT
    /dev/sdc2       248348672 250066943   1718272   839M 27 Hidden NTFS WinRE

## dd

`dd` 工具是一个专业的测试工具，对测试结果要求不高，可以用来做 IO 读写的简单评估。首先要了解两个特殊设备：

    /dev/null 伪设备，回收站。写该文件不会产生 IO
    /dev/zero 伪设备，会产生空字符流，对它不会产生 IO

`dd` 命令使用：

    dd if=/dev/zero of=/tmp/test bs=1G count=1 oflag=dsync

- `if` 用来设置 dd 命令读取的输入文件名
- `of` dd 输出文件名
- `bs` 设置 dd 命令读取的块大小
- `count` dd 命令读取的块个数
- `oflag=dsync` 使用同步 I/O 去除 caching 影响

综上

测试硬盘写速度

    sync; dd if=/dev/zero of=tempfile bs=1M count=1024; sync

测试磁盘读速度

    dd if=tempfile of=/dev/null bs=1M count=1024


## GUI
同样在 Linux 下也可以使用 GUI 图形化的工具来查看，搜索菜单 Disks，然后就能查看当前电脑安装的硬盘了。


## 查看分区
使用命令 `lsblk` 查看。
