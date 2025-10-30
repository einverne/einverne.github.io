---
layout: post
title: "我购买了一台迷你主机零刻 SER8 8845HS"
aliases:
  - "我购买了一台迷你主机零刻 SER8 8845HS"
tagline: ""
description: ""
category: 产品体验
tags: [零刻, SER8, minipc, pc, windows, macmini, AMD, 集成显卡, 迷你主机, PVE, Proxmox, proxmox-ve]
create_time: 2024-09-07 11:11:12
last_updated: 2024-10-27 11:11:12
dg-home: false
dg-publish: false
---

去年国家补贴看到迷你主机零刻 SER8 有非常大的折扣，AMD 8845HS 16GB 1TB 的版本补贴之后 2689.59 人民币，算还是比较划算，所以就买下了，但一直放在了国内，这一次来日本把 SER8 带来回来。顺便也把之前的 Mac Mini M1 给了，腾了一个位置给它。我家里面本来就有一台非常迷你的低功耗软路由，安装了 [[Proxmox VE]]，以及一台 Ubuntu 虚拟机，在 Ubuntu 虚拟机上安装了 [Swizzin](https://blog.einverne.info/post/2021/12/swizzin-usage.html) ，以及相关的 Flexget 等等工具，挂载了一个 8TB 的硬盘作为一个日常的下载机。普通的 Python 任务也放在 Ubuntu 上跑一跑，今天上到机器上看了一下已经稳定运行 508 天了。这一台 SER8 就是准备用来升级这一台小主机的，虽然功耗高了一些，但是计算能力也更强。

## SER8 整体配置

零刻 SER8 采用 AMD 7 芯片 CPU AMD Ryzen 7 8845HS ，具有 8 核 16 线程，带有集成显卡 Radeon 780M Graphics 3800 MHZ。

内存采用的是 Crucial DDR5 5600 内存，我购买的是装机 16GB，可以使用同频率的 32 GB 内存替换。

## 配置

- 135 _ 135 _ 44.7 mm 两种颜色，冰霜银 / 深空灰
- AMD 锐龙 7 8 核 16 线程 R7 8845HS，主频 3.8GHz ~ 5.1GHz，三级缓存 16 MB
- AMD 显卡 Radeon 780M 12 核心 2700 MHz
- 系统盘 M.2 2280 PCIe 4.0 x 4（最大 4TB）
- 存储盘 M.2 2280 PCIe 4.0 x 4 （最大 4TB） \* 1
- WiFi 6 (AX200) 蓝牙 5.2
- 接口 DC
- 4 USB
  - USB 2.0 480Mbps \* 2
  - USB 3.2 10Gbps \* 2
  - LAN 2.5G \* 1
  - 3.5 mm 音频插孔 \* 2
  - Type-C 10Gbps \* 1
  - DP1.4 \* 1
  - HDMI 2.1 \* 1
  - USB4 (40Gbps / TBT3 / PD / DP 1.4) \* 1
- 适配器 输入 200~240V AC 50/60Hz 输出 19V 6.32A

两种颜色可选

![gH-Di946N6](https://pic.einverne.info/images/gH-Di946N6.png)

前部面板接口，包括电源键，耳机接口，Type-C 接口，USB 接口。

![0R7-BDaxLU](https://pic.einverne.info/images/0R7-BDaxLU.jpg)

底部拥有一个防尘网。

![5LKxs3TIwh](https://pic.einverne.info/images/5LKxs3TIwh.jpg)

利用 VC 均热板导热降温。

![wsSp-NREM1](https://pic.einverne.info/images/wsSp-NREM1.jpg)

内部采用全新的风道设计。

![BMGrlJvlvD](https://pic.einverne.info/images/BMGrlJvlvD.jpg)

![e01fYI6TiL](https://pic.einverne.info/images/e01fYI6TiL.jpg)

SER8 提供两种工作模式，可以在 BIOS 中切换

- 平衡模式，54 W，适合日常办公，轻度应用
- 性能模式，65 W，适合游戏，视频剪辑，AI 任务等

![yZRchfVW3e](https://pic.einverne.info/images/yZRchfVW3e.jpg)

SER8 非常安静

![zHUhvqG5_4](https://pic.einverne.info/images/zHUhvqG5_4.jpg)

CPU 温度和噪音测试

![2b2BcMBSR4](https://pic.einverne.info/images/2b2BcMBSR4.jpg)

AMD 处理器

![up_VxWpP-O](https://pic.einverne.info/images/up_VxWpP-O.jpg)

双通道 DDR5 内存，存储支持扩展至 8TB。

![1Jk05kX2Rz](https://pic.einverne.info/images/1Jk05kX2Rz.jpg)

支持使用 HDMI，DP，以及 USB4 接口连接支持三台扩展屏幕。

![VOTuitqdaW](https://pic.einverne.info/images/VOTuitqdaW.jpg)

体积小巧，几乎不占用太多桌面空间。

![7NjM7hWs3X](https://pic.einverne.info/images/7NjM7hWs3X.jpg)

背部接口齐全，包括视频音频，USB，Type-C 等等接口。
![mS5cdkOj1v](https://pic.einverne.info/images/mS5cdkOj1v.jpg)

内部结构。

![JZ-Q3iT24E](https://pic.einverne.info/images/JZ-Q3iT24E.jpg)

产品图

![jSHSRVm_Nn](https://pic.einverne.info/images/jSHSRVm_Nn.jpg)

相关的配件，还贴心的附赠了一个小螺丝刀。

![U5N84MKQ8a](https://pic.einverne.info/images/U5N84MKQ8a.jpg)

更多详细的产品参数

![IZUkmXmrua](https://pic.einverne.info/images/IZUkmXmrua.jpg)

## 价格

原价 ¥3362.01，各种优惠和减免之后 2689.59 CNY。

## 加装内存条

预装的内存是英睿达的 DDR5 5600MHz 单根 16GB 容量，两根组成 32GB 双通道设计。内存最大更是可以支持双通道 256GB DDR5 5600MHz 的内存。
买回来第一件事情就是加装内存，之前在 eBay 购买了 64 GB 内存条，SER8 也支持最高 64GB 内存(32GB x 2)

我使用英睿达的 DDR5 内存条 5600MHz \* 2，型号是 CT32G56C46S5.C16D。

### 番外

我自己在加装 Crucial 内存条的时候遇到一些问题，我购买了两条 32GB 的 DDR5 5600MHz 内存条，但是两根一起安装的时候无论如何都无法启动机器，无奈之下只好一条条尝试，发现其中一条安装之后就无法启动，并且 SER8 短暂开机之后非常烫手，但是另外一条及时开机很长时间也感受不到外壳的问题，反复尝试多次，还升级了一下 BIOS 到最新，依然无法解决，感觉 Crucial 内存条存在问题。查阅了 BeeLink 官方的 [BBS](https://bbs.bee-link.com/d/4907-ser-8-problem-to-boot-after-memory-upgrade) ，也有相应的帖子，加装 64GB 内存之后无法开机，也尝试了关闭 BIOS 中的内存 Train 但还是无法开机。直接联系客服申请 Crucial 质保了。幸好 Crucial 的内存条提供了无限期保修，但是日本的保修需要直接联系零售商。

## 加装固态硬盘

在主板上找到 M.2 插槽，SER8 有两个 M.2 2280 插槽，支持 PCIe 4.0。SER8 有一个很大的散热片，用螺丝刀小心拧下之后，将 M.2 固态硬盘以约 30 度的角度对准插槽，轻轻插入。 固态硬盘应完全插入后，轻轻向下压，使其平放在主板上。 使用附带的小螺丝将固态硬盘固定在主板上，注意不要过紧。

预装的 SSD 也是来自英睿达品牌的 P3 Plus 固态硬盘。此外提供的 M.2 SSD 散热片规格还是蛮高的，首先从侧面可以看出本身厚度还是十分可观的。

零刻 SER8 内置了双 M.2 2280 PCIe 4.0 SSD 卡槽，从官方可以看到最高支持 4TB \* 2。

如果是用户日常对存储需求量很大，比如视频剪辑作者等等，可以选择准系统版本，自己直接一步到位安装两个 4TB 的硬盘。

## BIOS 调整设置

处理器和缓存优化：

- **Core Performance Boost**: 启用
- **REP-MOV/STOS Streaming**: 启用
- **Prefetcher Settings**: 启用
- **Opcache Control**: 启用
- **L1 Hardware Stream Prefetcher**: 启用
- **L2 Stream Hardware Prefetcher**: 启用
- **SVM Enable** (虚拟化): 启用
- **AVX512**: 启用

显卡和内存优化：

- **Above 4G Decoding**: 启用
- **Re-Size BAR/Resize BAR**: 启用
- **iGPU Configuration**: 选择 UMA_SPECIFIED
- **UMA Frame Buffer Size**: 设置为 8G（如果进行视频编辑，可选）
- **DDR Power Down Mode**: 禁用（性能优先）

功率管理：

- **Power Limit**: 设置为 Performance Mode（65W）以获得最大性能
- **PSPP Policy**: 禁用（优先性能而非省电）
- **Pluton Security Processor**: 禁用（非关键安全功能）

## related

- [[零刻 SER8 8845HS 安装 Proxmox VE 完整指南]]
