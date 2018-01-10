---
layout: post
title: "Linux 下查看内存使用"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, memory, ram, free, command]
last_updated: 
---

在 Linux 下，命令行就是一切，GUI 不是任何时候都可用的，所以掌握一定的常用命令，能够方便日常使用，比如查看进程，查看内存占用，等等，这篇文章就总结了一下 Linux 下查看当前系统占用内存的命令。

## free

`free` 命令是最常用的查看系统使用内存及剩余可用内存的命令。`free` 命令能够显示系统使用和可用的物理内存，同时能够显示 swap 分区内容使用量。`free` 命令也能够显示被 kernel 使用的 buffers 和 caches。`free` 命令通过解析 `/proc/meminfo` 来收集信息。

    free -m
                  total        used        free      shared  buff/cache   available
    Mem:          15911        8803        1100         886        6007        3750
    Swap:         16246        3100       13146

`-m` 选项表示使用 MB 来显示数据，上面表示总共 15911 MB 内存，使用了 8803 M 内存。

> A buffer is something that has yet to be "written" to disk.
> A cache is something that has been "read" from the disk and stored for later use.

上面的解释非常清晰， buffer 用于存放要输出到disk的数据，cache是存放disk上读取的数据，这两者都为了提高IO性能由OS控制管理的。

还有一些其他比较有用的参数，比如 `free -h` 显示比较可读 `h for human`，还有 `free -g` 使用 GB 为单位显示信息。


## /proc/meminfo

第二种方法就是直接读取 `/proc/meminfo` 文件， `/proc` 文件系统并不是真实的文件系统，不真正包含文件，他是虚拟文件系统，存储的是当前内核运行状态的一系列特殊文件。

运行命令 `cat /proc/meminfo` 检查其中的 `MemTotal, MemFree, Buffers, Cached, SwapTotal, SwapFree` 这几个字段，显示的内容和 `free` 命令是一样的。

## vmstat

通过 `vmstat` 和 `-s` 选项来显示内存使用

    vmstat -s
     16293800 K total memory
      9125168 K used memory
     10143256 K active memory
      2252796 K inactive memory
      1001072 K free memory
       746520 K buffer memory
      5421040 K swap cache
     16636924 K total swap
      3174096 K used swap
     13462828 K free swap
     33736485 non-nice user cpu ticks
        57413 nice user cpu ticks
     10985936 system cpu ticks
    465486969 idle cpu ticks
      6378633 IO-wait cpu ticks
            0 IRQ cpu ticks
       114100 softirq cpu ticks
            0 stolen cpu ticks
     41745039 pages paged in
    125109404 pages paged out
      1098642 pages swapped in
      2128871 pages swapped out
    2199460184 interrupts
    3279263642 CPU context switches
    1514898192 boot time
       3676272 forks

前面几行就能看到内存使用。

`vmstat` 命令能够显示进程，内存，paging，block IO，traps，disks，和 cpu 的活动及使用状态。

## top

`top` 命令通常被用来检查每一个进程的内存和CPU使用，但其实也可以用他来查看系统整个的内存使用，最上方的数据就能看到。

同样，可视化程度更高的 `htop` 也能够快速的查看到使用的内存

## dmidecode

通过一下命令也可以查看，这个命令只能够查看到物理内存条的大小，但是可以提供给我们一个信息就是系统的总内存，是由两个8G内存组成，而不是由8个2G内存条组成。

    sudo dmidecode -t 17

选项 `-t` 是 `--type` 缩写

    sudo dmidecode -t 17
    # dmidecode 3.0
    Getting SMBIOS data from sysfs.
    SMBIOS 2.8 present.

    Handle 0x001A, DMI type 17, 40 bytes
    Memory Device
            Array Handle: 0x0019
            Error Information Handle: Not Provided
            Total Width: 64 bits
            Data Width: 64 bits
            Size: 8192 MB
            Form Factor: DIMM
            Set: None
            Locator: DIMM1
            Bank Locator: Not Specified
            Type: DDR4
            Type Detail: Synchronous
            Speed: 2400 MHz
            Manufacturer: 802C0000802C
            Serial Number: 12303315
            Asset Tag: 0F161300
            Part Number: 8ATF1G64AZ-2G3B1
            Rank: 1
            Configured Clock Speed: 2133 MHz
            Minimum Voltage: Unknown
            Maximum Voltage: Unknown
            Configured Voltage: 1.2 V

    Handle 0x001B, DMI type 17, 40 bytes
    Memory Device
            Array Handle: 0x0019
            Error Information Handle: Not Provided
            Total Width: 64 bits
            Data Width: 64 bits
            Size: 8192 MB
            Form Factor: DIMM
            Set: None
            Locator: DIMM2
            Bank Locator: Not Specified
            Type: DDR4
            Type Detail: Synchronous
            Speed: 2400 MHz
            Manufacturer: 802C0000802C
            Serial Number: 1230330E
            Asset Tag: 0F161300
            Part Number: 8ATF1G64AZ-2G3B1
            Rank: 1
            Configured Clock Speed: 2133 MHz
            Minimum Voltage: Unknown
            Maximum Voltage: Unknown
            Configured Voltage: 1.2 V

这个输出信息中可以看到电脑使用的两条 8G 的内存，类型 DDR4，速度是 2400 MHz.

下面这个命令也能够查看电脑上安装的内存条

    sudo lshw -short -C memory
    H/W path        Device     Class          Description
    =====================================================
    /0/0                       memory         64KiB BIOS
    /0/18/15                   memory         128KiB L1 cache
    /0/18/16                   memory         1MiB L2 cache
    /0/18/17                   memory         8MiB L3 cache
    /0/14                      memory         128KiB L1 cache
    /0/19                      memory         16GiB System Memory
    /0/19/0                    memory         8GiB DIMM Synchronous 2400 MHz (0.4 ns)
    /0/19/1                    memory         8GiB DIMM Synchronous 2400 MHz (0.4 ns)
    /0/19/2                    memory         [empty]
    /0/19/3                    memory         [empty]
    /0/100/1f.2                memory         Memory controller

