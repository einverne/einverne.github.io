---
layout: post
title: "PulsedMedia 套餐区别"
aliases: 
- "PulsedMedia 套餐区别"
tagline: ""
description: ""
category: 学习笔记
tags: [ pulsedmedia , pt , seedbox, linux , shared-box, vps  ]
last_updated: 2022-05-18 04:57:09
create_time: 2022-05-18 04:55:58
---

之前在 PlusedMedia 12 周年活动的时候因为可以免费试用一个月的 V1000 套餐，所以就下单了一个 12th Anniversary V1000 Raffle，套餐的详情如下：

-   **12th Anniversary V1000 500GB**: 500GB(455GiB) RAID0 HDD Storage, 1GB Ram, 1Gbps bandwidth, 8 000GiB External Traffic, Unlimited Internal Traffic, 35% Hourly Chance: [2.99€ Per Month FREE First Month](https://pulsedmedia.com/specials.php)

今天又看到 Pulsed Media V1000 系列的操作在做[活动](https://lowendtalk.com/discussion/179179/pulsed-media-v1000-series-25-up-to-8tb-and-3years-term-1-31-tb-unmetered-seedbox#latest)，就想来整理一下 Pulsed Media 家的套餐，并进行一下简单的对比。

点开[官网](https://gtk.pw/pm) 可以看到几个套餐名字 Rragon R, V1000 系列，V10G 系列。

## 介绍

### Dragon-R
Dragon-R 系列[^dr]的套餐是性能最好的系列，使用 AMD EPyC 的 CPU，32核64线程，磁盘使用 RAID 10，并且拥有 20Gbps 的共享带宽。不过价格当然也是最感人的，起步的 3TB 套餐每个月就要 14.99欧元。

硬件部分除了上面提及的 AMD EPyC CPU，主机有 256GB ECC 内存，24x7200RPM RAID10 array。

[^dr]: <https://pulsedmedia.com/dragon-r-20gbps-rtorrent-seedboxes.php>

![pulsed media dragon-r](https://photo.einverne.info/images/2022/05/18/zlAw.png)

### M10G
M10G 系列[^mg]套餐是比较适合大多数人的套餐。

硬件上：

- CPU：CPU Dual Xeon 6core 8605pts 或者是 Ryzen 3900X 12Core 32805pts
- 内存：48GB 到 144 GB
- 带宽：10Gbps

通常一台机器上最多会有 18 位用户，硬盘使用 RAID5 。


[^mg]: <https://pulsedmedia.com/m10g-seedbox.php>

![pulsed media m10g](https://photo.einverne.info/images/2022/05/18/zojc.png)


### V10G
Value10G 套餐[^vg]是最实惠的套餐。

通常的硬件：

- CPU: Xeon 6core
- RAM: 36GB 到 72GB
- 使用 RAID0，这里需要注意的这个系列的套餐在磁盘冗余上可能存在一块磁盘 fail 而丢失数据的情况，如果需要高可用的数据存储，可以考虑 M10G 和 Dragon-R 系列的套餐
- 带宽：10Gbps 共享


[^vg]: <https://pulsedmedia.com/value10g-seedbox.php>

![pulsed-media v10g](https://photo.einverne.info/images/2022/05/18/zxpd.png)



### V1000
Value1000套餐[^v]是兼顾性能和价格的套餐。带宽 1Gbps。使用 RAID0 ，同样考虑到数据安全性，可以购买更好的套餐。

[^v]: <https://pulsedmedia.com/value1000-seedbox.php>

![pulsed media v1000](https://photo.einverne.info/images/2022/05/18/z62r.png)


### Other
Pulsed Media 还提供了 [Storage Seedbox](https://pulsedmedia.com/storage-seedbox.php) 这个系列属于 M10G 套餐，只不过在套餐上更加偏向与存储，所以流量会少一些，容量会大一些。


## 起名方式
经过上面的总结，也能看出来，Pulsed Media 在起名的时候通常是套餐系列加上 `XS`, `S`, `M`, `L` 这样的标识，通常归纳总结也能大致看出来，分别对应不同的容量和流量。

比如拿到一个 V10G L，大致就能看出来是属于 V10G 系列的套餐，容量 Large （8T）。


## 案例

### 12th Anniversary V10G L
我所购买的 [[Pulsed Media 12th Anniversary V10G L]] 登录系统之后可以看到使用的是 Intel Xeon(R) CPU L5640@2.27GHz，内存是 94GB。

```
❯ lscpu
Architecture:        x86_64
CPU op-mode(s):      32-bit, 64-bit
Byte Order:          Little Endian
Address sizes:       40 bits physical, 48 bits virtual
CPU(s):              24
On-line CPU(s) list: 0-23
Thread(s) per core:  2
Core(s) per socket:  6
Socket(s):           2
NUMA node(s):        1
Vendor ID:           GenuineIntel
CPU family:          6
Model:               44
Model name:          Intel(R) Xeon(R) CPU           L5640  @ 2.27GHz
Stepping:            2
CPU MHz:             1634.332
CPU max MHz:         2268.0000
CPU min MHz:         1600.0000
BogoMIPS:            4533.10
Virtualization:      VT-x
L1d cache:           32K
L1i cache:           32K
L2 cache:            256K
L3 cache:            12288K
NUMA node0 CPU(s):   0-23
Flags:               fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 cx16 xtpr pdcm pcid dca sse4_1 sse4_2 popcnt aes lahf_lm epb pti tpr_shadow vnmi flexpriority ept vpid dtherm ida arat
```

内存：

```
❯ free -h
              total        used        free      shared  buff/cache   available
Mem:           94Gi        14Gi       1.8Gi       781Mi        78Gi        76Gi
Swap:         1.1Gi       1.1Gi       3.0Mi
```

## 12th Anniversary V1000 Raffle

而 V1000 Raffle 可以看到：

```
❯ lscpu
Architecture:        x86_64
CPU op-mode(s):      32-bit, 64-bit
Byte Order:          Little Endian
Address sizes:       48 bits physical, 48 bits virtual
CPU(s):              6
On-line CPU(s) list: 0-5
Thread(s) per core:  1
Core(s) per socket:  6
Socket(s):           1
NUMA node(s):        1
Vendor ID:           AuthenticAMD
CPU family:          16
Model:               8
Model name:          Six-Core AMD Opteron(tm) Processor 2419 EE
Stepping:            0
CPU MHz:             1200.000
CPU max MHz:         1800.0000
CPU min MHz:         800.0000
BogoMIPS:            3600.03
Virtualization:      AMD-V
L1d cache:           64K
L1i cache:           64K
L2 cache:            512K
L3 cache:            6144K
NUMA node0 CPU(s):   0-5
Flags:               fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx mmxext fxsr_opt pdpe1gb rdtscp lm 3dnowext 3dnow constant_tsc rep_good nopl nonstop_tsc cpuid extd_apicid pni monitor cx16 popcnt lahf_lm cmp_legacy svm extapic cr8_legacy abm sse4a misalignsse 3dnowprefetch osvw ibs skinit wdt hw_pstate vmmcall npt lbrv svm_lock nrip_save pausefilter
```

内存：

```
❯ free -h
              total        used        free      shared  buff/cache   available
Mem:           23Gi       2.3Gi       1.6Gi        38Mi        19Gi        17Gi
Swap:         5.6Gi       1.2Gi       4.4Gi
```
