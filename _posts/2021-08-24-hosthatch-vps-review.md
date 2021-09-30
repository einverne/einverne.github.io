---
layout: post
title: "HostHatch VPS 测评及使用"
aliases: 
- "HostHatch VPS 测评及使用"
tagline: ""
description: ""
category: 经验总结
tags: [ vps, linux, hosthatch, management, ubuntu, ]
last_updated:
---

两个礼拜前买过一个月 [A400 互联](/post/2021/08/a400-vps-test-and-usage.html) 的 VPS，但是因为其提供商不是非常靠谱，所以尽管在使用，但还只是用作流量转发，并没有把重要的数据放在上面。这两天在 LowEndTalk 上正好看到 [HostHatch](https://hosthatch.com/a?id=2135) 扩展新加坡业务，发布新机器 2核4G 1T流量的机器只需要 35$ 一年，而且两年付还可以得到两倍的内存，空间和流量，所以就立即下了一单。

```
2 CPU cores (50% dedicated, burstable up to 200%)
4 GB RAM
20 GB NVMe SSD
1 TB bandwidth
$35 per year
Pay for two years - get doubled RAM, storage, and bandwidth
```

中间还发生了一点小小问题，因为付款的 Paypal 很久没有使用，付款之后 HostHatch 没有处理，开了 Ticket 之后回复说因为 Paypal on-hold 了这笔订单需要等待 24 小时，等 Paypal 处理之后 HostHatch 才会开始处理。所以等待的期间我又用信用卡下了一单，然后过了一天，我突然发现账号下面有两台机器。不过也好，两台机器做个主备。


## 机器性能
bench 的结果：

```
----------------------------------------------------------------------
 CPU Model             : Intel(R) Xeon(R) CPU E5-2690 v2 @ 3.00GHz
 CPU Cores             : 2
 CPU Frequency         : 3000.000 MHz
 CPU Cache             : 16384 KB
 Total Disk            : 39.0 GB (18.0 GB Used)
 Total Mem             : 7976 MB (2120 MB Used)
 Total Swap            : 1023 MB (5 MB Used)
 System uptime         : 24 days, 17 hour 59 min
 Load average          : 0.21, 0.12, 0.10
 OS                    : Ubuntu 18.04.5 LTS
 Arch                  : x86_64 (64 Bit)
 Kernel                : 4.15.0-20-generic
 TCP CC                : cubic
 Virtualization        : Dedicated
 Organization          : AS63473 HostHatch, LLC
 Location              : Singapore / SG
 Region                : Singapore
----------------------------------------------------------------------
 I/O Speed(1st run)    : 495 MB/s
 I/O Speed(2nd run)    : 731 MB/s
 I/O Speed(3rd run)    : 715 MB/s
 Average I/O speed     : 647.0 MB/s
----------------------------------------------------------------------
 Node Name        Upload Speed      Download Speed      Latency     
 Speedtest.net    3295.69 Mbps      2583.03 Mbps        0.65 ms     
 Shanghai   CU    219.87 Mbps       629.33 Mbps         214.01 ms   
 Guangzhou  CT    18.45 Mbps        113.17 Mbps         229.08 ms   
 Guangzhou  CU    424.10 Mbps       587.32 Mbps         203.09 ms   
 Hongkong   CN    2560.67 Mbps      1094.98 Mbps        33.92 ms    
 Tokyo      JP    294.63 Mbps       614.84 Mbps         74.30 ms    
----------------------------------------------------------------------
```


YABS 的结果：

```
# ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## #
#              Yet-Another-Bench-Script              #
#                     v2021-06-05                    #
# https://github.com/masonr/yet-another-bench-script #
# ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## #

Wed Aug 25 00:46:05 BST 2021

Basic System Information:
---------------------------------
Processor  : Intel(R) Xeon(R) CPU E5-2690 v2 @ 3.00GHz
CPU cores  : 2 @ 2999.998 MHz
AES-NI     : ✔ Enabled
VM-x/AMD-V : ❌ Disabled
RAM        : 3.9 GiB
Swap       : 1024.0 MiB
Disk       : 18.7 GiB

fio Disk Speed Tests (Mixed R/W 50/50):
---------------------------------
Block Size | 4k            (IOPS) | 64k           (IOPS)
  ------   | ---            ----  | ----           ----
Read       | 237.97 MB/s  (59.4k) | 1.78 GB/s    (27.9k)
Write      | 238.59 MB/s  (59.6k) | 1.79 GB/s    (28.0k)
Total      | 476.57 MB/s (119.1k) | 3.58 GB/s    (55.9k)
           |                      |
Block Size | 512k          (IOPS) | 1m            (IOPS)
  ------   | ---            ----  | ----           ----
Read       | 2.85 GB/s     (5.5k) | 2.87 GB/s     (2.8k)
Write      | 3.00 GB/s     (5.8k) | 3.07 GB/s     (2.9k)
Total      | 5.85 GB/s    (11.4k) | 5.94 GB/s     (5.8k)

iperf3 Network Speed Tests (IPv4):
---------------------------------
Provider        | Location (Link)           | Send Speed      | Recv Speed
                |                           |                 |
Clouvider       | London, UK (10G)          | 1.11 Gbits/sec  | 412 Mbits/sec
Online.net      | Paris, FR (10G)           | 1.37 Gbits/sec  | 993 Mbits/sec
WorldStream     | The Netherlands (10G)     | 788 Mbits/sec   | 638 Mbits/sec
Biznet          | Jakarta, Indonesia (1G)   | 3.41 Gbits/sec  | 2.55 Gbits/sec
Clouvider       | NYC, NY, US (10G)         | 628 Mbits/sec   | 562 Mbits/sec
Velocity Online | Tallahassee, FL, US (10G) | 476 Mbits/sec   | 238 Mbits/sec
Clouvider       | Los Angeles, CA, US (10G) | 930 Mbits/sec   | 908 Mbits/sec
Iveloz Telecom  | Sao Paulo, BR (2G)        | busy            | 348 Mbits/sec

Geekbench 5 Benchmark Test:
---------------------------------
Test            | Value
                |
Single Core     | 593
Multi Core      | 1191
Full Test       | https://browser.geekbench.com/v5/cpu/9485985
```

## 使用

### 数据库
因为看 LET 上对 HostHatch 的评价还好，并且这是一家长期做生意的提供商，所以我就陆陆续续把其他平台上的 MySQL 数据迁移过来了，并且正好两台机器配置了一下[Master Master Replication](/post/2021/07/mysql-master-master-replication.html)。


### 应用
和之前在 [A400](/post/2021/08/a400-vps-test-and-usage.html) 的机器一样，用 Docker 来管理各个服务。基本上也是同步一下数据，更改一下[配置](https://github.com/einverne/dockerfile)就可以起来。



## reference

- [[HostHatch]]