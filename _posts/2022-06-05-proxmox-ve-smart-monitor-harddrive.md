---
layout: post
title: "在 Proxmox VE 上使用 S.M.A.R.T 信息监控硬盘状态"
aliases:
- "在 Proxmox VE 上使用 S.M.A.R.T 信息监控硬盘状态"
tagline: ""
description: ""
category: 学习笔记
tags: [ openmediavault , omv, nas, hard-disk , hard-disk ]
create_time: 2022-06-12 09:37:41
last_updated: 2022-06-12 11:03:25
---

自己组的 NAS，是用 Proxmox VE 做虚拟化，然后再其中安装了 OpenMediaVault 作为 NAS 系统，因为时间有些久[^1]，所以不免有点担心硬盘的寿命，所以今天来好好了解一下 SMART 信息，并对磁盘进行一个全面的诊断，以保护数据的安全。

[^1]: [从零开始搭建 NAS 硬件篇](/post/2018/12/build-nas-from-scratch.html)

## S.M.A.R.T 信息

查看 S.M.A.R.T 信息是用来监控硬盘健康状态最直接的办法。

S.M.A.R.T 全称是 Self-Monitoring, Analysis and Reporting Technology，这是硬盘内建的一种状态检测和预警规范。[^wiki]

[^wiki]: <https://en.wikipedia.org/wiki/S.M.A.R.T.>

SMART 信息中包含了硬盘的运行信息，包括硬盘的工作时间，通电次数，盘片温度，坏块的数量，写入量，读取量等等

## Proxmox VE Disks
在 Proxmox VE 后台能直接通过界面查看到磁盘的 SMART 信息。

点击左侧的 PVE 节点，然后在 `Disks` 中就能查看到磁盘的信息。

![pve smart value](https://img.gtk.pw/i/2022/06/12/62a54f35ca4a9.png)

![smart value](https://img.gtk.pw/i/2022/06/12/62a5508c8335f.png)

如果熟悉命令行，也可以直接 SSH 登录之后执行：

    smartctl --all /dev/sda

同样能获取到 SMART 信息。

```
root@pve:~# smartctl --all /dev/sda
smartctl 7.2 2020-12-30 r5155 [x86_64-linux-5.4.143-1-pve] (local build)
Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF INFORMATION SECTION ===
Model Family:     Seagate BarraCuda 3.5
Device Model:     ST4000DM004-RRRRR
Serial Number:    WFNRRRRR
LU WWN Device Id: 5 000c50 0cd3f38d9
Firmware Version: 0001
User Capacity:    4,000,787,030,016 bytes [4.00 TB]
Sector Sizes:     512 bytes logical, 4096 bytes physical
Rotation Rate:    5425 rpm
Form Factor:      3.5 inches
Device is:        In smartctl database [for details use: -P show]
ATA Version is:   ACS-3 T13/2161-D revision 5
SATA Version is:  SATA 3.1, 6.0 Gb/s (current: 6.0 Gb/s)
Local Time is:    Sun Jun 12 10:30:29 2022 CST
SMART support is: Available - device has SMART capability.
SMART support is: Enabled

=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED

General SMART Values:
Offline data collection status:  (0x00) Offline data collection activity
                                        was never started.
                                        Auto Offline Data Collection: Disabled.
Self-test execution status:      (   0) The previous self-test routine completed
                                        without error or no self-test has ever
                                        been run.
Total time to complete Offline
data collection:                (    0) seconds.
Offline data collection
capabilities:                    (0x73) SMART execute Offline immediate.
                                        Auto Offline data collection on/off support.
                                        Suspend Offline collection upon new
                                        command.
                                        No Offline surface scan supported.
                                        Self-test supported.
                                        Conveyance Self-test supported.
                                        Selective Self-test supported.
SMART capabilities:            (0x0003) Saves SMART data before entering
                                        power-saving mode.
                                        Supports SMART auto save timer.
Error logging capability:        (0x01) Error logging supported.
                                        General Purpose Logging supported.
Short self-test routine
recommended polling time:        (   1) minutes.
Extended self-test routine
recommended polling time:        ( 475) minutes.
Conveyance self-test routine
recommended polling time:        (   2) minutes.
SCT capabilities:              (0x30a5) SCT Status supported.
                                        SCT Data Table supported.

SMART Attributes Data Structure revision number: 10
Vendor Specific SMART Attributes with Thresholds:
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  1 Raw_Read_Error_Rate     0x000f   084   064   006    Pre-fail  Always       -       235499960
  3 Spin_Up_Time            0x0003   097   097   000    Pre-fail  Always       -       0
  4 Start_Stop_Count        0x0032   100   100   020    Old_age   Always       -       33
  5 Reallocated_Sector_Ct   0x0033   100   100   010    Pre-fail  Always       -       0
  7 Seek_Error_Rate         0x000f   088   060   045    Pre-fail  Always       -       573161103
  9 Power_On_Hours          0x0032   080   080   000    Old_age   Always       -       17577 (6 153 0)
 10 Spin_Retry_Count        0x0013   100   100   097    Pre-fail  Always       -       0
 12 Power_Cycle_Count       0x0032   100   100   020    Old_age   Always       -       33
183 Runtime_Bad_Block       0x0032   100   100   000    Old_age   Always       -       0
184 End-to-End_Error        0x0032   100   100   099    Old_age   Always       -       0
187 Reported_Uncorrect      0x0032   100   100   000    Old_age   Always       -       0
188 Command_Timeout         0x0032   100   100   000    Old_age   Always       -       0 0 0
189 High_Fly_Writes         0x003a   100   100   000    Old_age   Always       -       0
190 Airflow_Temperature_Cel 0x0022   061   058   040    Old_age   Always       -       39 (Min/Max 31/42)
191 G-Sense_Error_Rate      0x0032   100   100   000    Old_age   Always       -       0
192 Power-Off_Retract_Count 0x0032   100   100   000    Old_age   Always       -       650
193 Load_Cycle_Count        0x0032   100   100   000    Old_age   Always       -       760
194 Temperature_Celsius     0x0022   039   042   000    Old_age   Always       -       39 (0 21 0 0 0)
195 Hardware_ECC_Recovered  0x001a   084   064   000    Old_age   Always       -       235499960
197 Current_Pending_Sector  0x0012   100   100   000    Old_age   Always       -       0
198 Offline_Uncorrectable   0x0010   100   100   000    Old_age   Offline      -       0
199 UDMA_CRC_Error_Count    0x003e   200   200   000    Old_age   Always       -       0
240 Head_Flying_Hours       0x0000   100   253   000    Old_age   Offline      -       17435h+59m+22.019s
241 Total_LBAs_Written      0x0000   100   253   000    Old_age   Offline      -       31388806852
242 Total_LBAs_Read         0x0000   100   253   000    Old_age   Offline      -       28853375635

SMART Error Log Version: 1
No Errors Logged

SMART Self-test log structure revision number 1
No self-tests have been logged.  [To run self-tests, use: smartctl -t]

SMART Selective self-test log data structure revision number 1
 SPAN  MIN_LBA  MAX_LBA  CURRENT_TEST_STATUS
    1        0        0  Not_testing
    2        0        0  Not_testing
    3        0        0  Not_testing
    4        0        0  Not_testing
    5        0        0  Not_testing
Selective self-test flags (0x0):
  After scanning selected spans, do NOT read-scan remainder of disk.
If Selective self-test is pending on power-up, resume after 0 minute delay.
```

其中比较重要的值。

```
01（001） Raw_Read_Error_Rate 底层数据读取错误率 
04（004） Start_Stop_Count 启动/停止计数 
05（005） Reallocated_Sector_Ct 重映射扇区数 
09（009） Power_On_Hours 通电时间累计，出厂后通电的总时间，一般磁盘寿命三万小时 
0A（010） Spin_Retry_Count 主轴起旋重试次数（即硬盘主轴电机启动重试次数） 
0B（011） Calibration_Retry_Count 磁盘校准重试次数 
0C（012） Power_Cycle_Count 磁盘通电次数 
C2（194） Temperature_Celsius 温度 
C7（199） UDMA_CRC_Error_Count 奇偶校验错误率 
C8（200） Write_Error_Rate: 写错误率 
F1（241） Total_LBAs_Written：表示磁盘自出厂总共写入的的数据，单位是LBAS=512Byte 
F2（242） Total_LBAs_Read：表示磁盘自出厂总共读取的数据，单位是LBAS=512Byte
```

### ID
前两位十六进制数，括号中为对应的十进制，表示检测的参数，各个硬盘制造商大部分的 SMART ID 所代表的含义是一致的。但有的厂商也会根据自己的需求增减 ID。

### ATTRIBUTE_NAME
属性名，ID 代码的文字解释。

### FLAG
属性标志

### VALUE
当前值，根据硬盘运行数据计算获得。

### WORST
最差值，是硬盘运行时各 ID 曾出现过的最小 Value。

通常最差值与当前值是相等的，如果最差值出现较大波动，小于当前值，表明磁盘曾经出现过错误。

### Threshold
在报告硬盘 FAILED 状态前，WORST 可以允许的最小值。

### RAW_VALUE
原始值，是硬盘运行时各项参数的实测值。

### TYPE
属性的类型（Pre-fail 或 Oldage）

### WHEN_FAILED

如果 VALUE 小于等于 THRESH，会被设置成“FAILING_NOW”；如果 WORST 小于等于 THRESH 会被设置成“In_the_past”；如果都不是，会被设置成“-”。在“FAILING_NOW”情况下，需要尽快备份重要 文件，特别是属性是 Pre-fail 类型时。“In_the_past”代表属性已经故障了，但在运行测试的时候没问题。“-”代表这个属性从没故障过。

### UPDATED
属性的更新频率。Offline 代表磁盘上执行离线测试的时间。

## SMART 参数解读

### 01（001）底层数据读取错误率 Raw Read Error Rate
底层数据读取错误率，当前值应远大于临界值。

### 02（002）磁盘读写通量性能 Throughput Performance
数值越大越好。

当前值如果偏低或趋近临界值，表示硬盘存在严重的问题。但现在的硬盘通常显示数据值为 0 或根本不显示此项，一般在进行了人工脱机 SMART 测试后才会有数据量。

### 07（007）寻道错误率 Seek Error Rate
数据应为 0，当前值应远大于与临界值。

### 08（008）寻道性能 Seek Time Performance
表示硬盘寻道操作的平均性能（寻道速度），通常与前一项（寻道错误率）相关联。

### 09（009）通电时间累计 Power-On Time Count (POH)

表示硬盘通电的时间，数据值直接累计了设备通电的时长，新硬盘当然应该接近 0，但不同硬盘的计数单位有所不同，有以小时计数的，也有以分、秒甚至 30 秒为单位的，这由磁盘制造商来定义。
这一参数的临界值通常为 0，当前值随着硬盘通电时间增加会逐渐下降，接近临界值表明硬盘已接近预计的设计寿命，这并不表明硬盘将出现故障或立即报废。参考磁盘制造商给出的该型号硬盘的 MTBF（平均无故障时间）值，可以大致估计剩余寿命或故障概率。

对于固态硬盘，要注意“设备优先电源管理功能（device initiated power management，DIPM）”会影响这个统计：如果启用了 DIPM，持续通电计数里就不包括睡眠时间；如果关闭了 DIPM 功能，那么活动、空闲和睡眠三种状态的时间都会被统计在内。
