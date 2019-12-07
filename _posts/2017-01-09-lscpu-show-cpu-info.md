---
layout: post
title: "每天学习一个命令：lscpu 查看 CPU 信息"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, ]
last_updated:
---

`lscpu` 显示 CPU 的架构信息

`lscpu` 从 `sysfs` 和 `proc/cpuinfo` 中收集信息。这个命令的输出是规范的可以用来解析，或者给人来阅读。该命令显示的信息包括，CPU 的数量，线程 (thread)，核心 (core)，Socket 还有 Non-Uniform Memory Access (NUMA) 节点数。

- Socket 具体是指的主板上 CPU 的**插槽数量**，一般笔记本只有一个，而服务器可能会有多个。如果有两个插槽，通常称为两路
- Core 具体是指 CPU 的**核心**，也就是平常说的几核，比如八核之类
- thread 是指的每个 Core 的硬件线程数，超线程

举例来说，如果某个服务器"2 路 4 核超线程"，也就是 2 个插槽，4 核心，默认为 2 thread，也就是 2*4*2 是 16 逻辑 CPU。对操作系统来说，逻辑 CPU 的数量就是 `Socket * Core * Thread`。

比如下面我的台式机，1 Sockets， 4 Cores，2 Threads，那么就是 4 核 8 线程。

如下示例：

    Architecture:          x86_64
    CPU op-mode(s):        32-bit, 64-bit
    Byte Order:            Little Endian
    CPU(s):                8
    On-line CPU(s) list:   0-7
    Thread(s) per core:    2
    Core(s) per socket:    4
    Socket(s):             1
    NUMA node(s):          1
    Vendor ID:             GenuineIntel
    CPU family:            6
    Model:                 94
    Model name:            Intel(R) Core(TM) i7-6700 CPU @ 3.40GHz
    Stepping:              3
    CPU MHz:               1075.117
    CPU max MHz:           4000.0000
    CPU min MHz:           800.0000
    BogoMIPS:              6816.61
    Virtualization:        VT-x
    L1d cache:             32K
    L1i cache:             32K
    L2 cache:              256K
    L3 cache:              8192K
    NUMA node0 CPU(s):     0-7
    Flags:                 fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc aperfmperf eagerfpu pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch epb invpcid_single intel_pt retpoline kaiser tpr_shadow vnmi flexpriority ept vpid fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm mpx rdseed adx smap clflushopt xsaveopt xsavec xgetbv1 dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp


## Byte Order

Big endian vs Little endian 大端和小端，对于整型、长整型等数据类型，Big endian 认为第一个字节是最高位字节（按照从低地址到高地址的顺序存放数据的高位字节到低位字节）；而 Little endian 则相反，认为第一个字节是最低位字节（按照从低地址到高地址的顺序存放据的低位字节到高位字节）。

一般来说，x86 系列 CPU 都是 little-endian 的字节序，PowerPC 通常是 big-endian，网络字节顺序也是 big-endian 还有的 CPU 能通过跳线来设置 CPU 工作于 Little endian 还是 Big endian 模式。

## 扩展
Linux 有很多命令可以用来查看 cpu 的信息，如果不使用 `lscpu` 那么可以直接查看 `less /proc/cpuinfo` 文件。

或者使用 `sudo lshw -class processor`

或者

    sudo dmidecode -t 4 | less

或者

    sudo apt install hardinfo
    hardinfo | less

或者

    sudo apt install cpuid
    cpuid

或者

    sudo apt install inxi
    inxi -C

## reference

- <https://www.binarytides.com/linux-cpu-information/>
