---
layout: post
title: "我买了一条 Thunderbolt 数据线"
aliases:
- "我买了一条 Thunderbolt 数据线"
tagline: ""
description: ""
category: 
tags: [thunderbolt, cable, macos, migration-assistant]
create_time: 2025-09-10 09:37:33
last_updated: 2025-09-10 09:37:33
dg-home: false
dg-publish: false
---

这两天使用 macOS 的 Migration Assistant 迁移系统，按照应用中的提示，连接同一个 WiFi，或者使用 Peer-to-Peer 方式，但是在使用的过程中 macOS 提交使用 Thunderbolt Cable 连接两台 macOS 的 Type-C 可以将速度提升到 3000MB~4000MB/s 左右。

最开始的时候我尝试了所有 macOS 自带的数据线，还尝试了 iPhone 的 Type-C 到 Type-C 数据线，竟然都不支持 Thunderbolt，这就引起了我的好奇，所以才有了这篇文章。虽然 macOS 的雷电口是早有耳闻，但是我一直以为 macOS 自带的 Type-C 充电线自然可能也支持 Thunderbolt，但实际并不是。

## Thunderbolt 协议

在进一步说 Thunderbolt（雷电）数据线之前，可能首先要来先了解一下 Thunderbolt 协议。

Thunderbolt 协议是一项由 Intel 和 Apple 联合开发的高速数据传输和视频传输标准，核心技术在于将多种协议通过单一物理接口融合，实现高带宽和多功能连接。

Thunderbolt 协议通过隧道融合了 PCI Express（高速数据传输），DisplayPort（视频音频输出），兼容 USB 和 Ethernet 协议。一条 Thunderbolt 线缆可以同时传输数据，视频音频，并进行供电。

在第一，二代 Thunderbolt 中采用 Mini DisplayPort 物理接口，第三代及后续标准 Thunderbolt 3/4，采用 USB Type-C 接口，兼容现代设备。

每个接口使用双通道独立数据传输，最新的 Thunderbolt 3/4 均为 40Gbps 带宽，实现双向高速传输，通道之间完全独立。

Thunderbolt 协议支持 Daisy Chain 拓扑结构，一根线串联最多 6 个设备。

| 协议          | 最大带宽                  | 视频带宽             | PCIe 通道及速率     | 显示支持                | 供电能力  | 信号编码 | 兼容性                |
| ------------- | ------------------------- | -------------------- | ------------------- | ----------------------- | --------- | -------- | --------------------- |
| Thunderbolt 4 | 40Gbps 对称               | 40Gbps               | PCIe 3.0 x4，32Gbps | 双 4K@60Hz 或单 8K@60Hz | 最高 100W | NRZ      | 完全兼容雷电 3/USB4   |
| Thunderbolt 5 | 80Gbps 对称，120Gbps 单向 | 视频流量最高 120Gbps | PCIe 4.0 x4，64Gbps | 双 8K@60Hz/三 4K@144Hz  | 最高 240W | PAM3     | 完全兼容雷电 4/USB4.2 |

雷电数据线，也常被称为 Thunderbolt 线缆，是一种集高速数据传输、视频输出与供电于一体的多功能线材。它基于 USB-C 或 Mini DisplayPort 接口形态，整合了 PCI Express、DisplayPort 和 USB 协议。

## 功能

- 高速数据传输
  - 雷电线缆支持双向 40Gbps 带宽，可以在秒级别完成大容量文件的拷贝、备份或实时编辑。例如，传输数百 GB 的 4K 视频素材仅需数秒至数十秒，大幅提升专业影像、剪辑和渲染工作效率
- 多显示器输出
  - 集成 Display Port 通道，雷电线可同时驱动多台高分辨率显示器。Thunderbolt 3/4 一条线即可外接两台 4K（60 Hz）或一台 8K（30 Hz）显示器，无需额外视频线或转换器。
- 链式扩展 Daisy-chain
  - 雷电支持链式连接功能，单一接口可依次串联多达六台兼容设备（如硬盘阵列、显示器、扩展坞等），无需占用多个主机端口，也简化了线材管理。
- 供电和快充
  - Thunderbolt 3/4 线缆具备高达 100 W（或更高）的供电能力，可为笔记本电脑、平板等设备同时提供电力，不仅传输数据，还能实现快速充电，免去单独电源适配器的束缚。
- 兼容性
  - 尽管 Thunderbolt 线缆接口与 USB-C 完全兼容，使用时仍能向下兼容 USB 3.2、DisplayPort 等标准，用户可混合连接各类外围设备

苹果 Thunderbolt 4 Pro 线支持最高 40 Gbps 数据传输、10 Gbps USB 3.2，以及最高 100 W 充电；Thunderbolt 5 Pro 线更可达 120 Gbps 和 240 W。

## 原厂附带

- **Apple Thunderbolt Display** 该款 27 英寸显示器自带一条不可拆卸的 Thunderbolt 线缆和一条 MagSafe 电源线，可直接连接带有 Thunderbolt 端口的 Mac 电脑使用。
- **苹果 Pro Display XDR** Pro Display XDR 随包装附赠一条 Thunderbolt 3 线缆（USB-C 接头），可连接 Mac Pro、Mac mini 及 Mac Book Pro 等设备，实现 40 Gbps 数据传输与 96 W 电力传输。
- **Apple Studio Display** Studio Display 随附一条 1 米长的 Thunderbolt 3 线缆，不仅支持高达 40 Gbps 的数据带宽，还可为 MacBook 系列提供最多 96 W 的充电功率。
- **LG UltraFine 5K（以及 4K）显示器** LG 官方提供的 UltraFine 5K/4K 显示器包装中内置 USB-C/Thunderbolt 3 线缆，能够直接与 MacBook 等设备进行高分辨率视频与高速数据传输。
- **外置 Thunderbolt SSD/硬盘** 如 LaCie Rugged Thunderbolt、SanDisk Professional G-RAID、LaCie 5big/8big 系列 RAID 存储等，通常随机附带一条 Thunderbolt 线缆，用户可立即利用其高达 40 Gbps 的速率进行数据备份和传输。
- **Thunderbolt 扩展坞（Docking Station）** CalDigit TS3 Plus、OWC Thunderbolt Dock、Elgato Thunderbolt 3 Dock 等扩展坞产品，包装内一般会附送一条 Thunderbolt 3 线缆，用于连接笔记本，快速扩展多种接口和外设。

## 我买了一条 Thunderbolt 5 数据线

在 MacBook Air (2024) 下，查了一下电脑的端口是 thunderbolt 4，使用 Blackmagic Disk Speed Test 软件，对 [三星的 T7](https://blog.einverne.info/post/2023/09/i-bought-a-samsung-ssd-disk-t7-1t.html) 进行测试 5 轮读写。

![KWBItq5M1K](https://pic.einverne.info/images/KWBItq5M1K.png)

使用 thunderbolt 5 数据线连接 thunderbolt 4 接口， 3 轮读写测试。

![7AJ6fIGojT](https://pic.einverne.info/images/7AJ6fIGojT.png)

在 MacBook Pro（M4 Pro）的 thunderbolt 5 接口下。使用三星 T7 硬盘自带数据线进行 3 论测试。

![Ph8kr_0bTW](https://pic.einverne.info/images/Ph8kr_0bTW.png)

thunderbolt 5 接口使用 thunderbolt 5 数据线，三轮测试。

![MRdsv-qwHP](https://pic.einverne.info/images/MRdsv-qwHP.png)

四轮测试几乎没有任何差别，于是我去查询了一下三星 T7 的读写速度，发现原来瓶颈是 SSD。这就让我犯难了，我手上没有任何一个设备可以让我去测试一下这一根雷电 5 协议的线材。

而我也没有专业的 USB 电压以及传输速度的测试设备，这让我拿到了这根雷电 5 协议的线，也不知道怎么去测试。

如果大家有更好的办法的话，也可以留言告诉我。
