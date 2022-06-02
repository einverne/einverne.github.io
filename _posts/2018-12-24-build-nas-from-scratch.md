---
layout: post
title: "从零开始搭建 NAS: 硬件篇"
aliases: "从零开始搭建 NAS: 硬件篇"
tagline: ""
description: ""
category: 学习笔记
tags: [nas, linux, cpu, motherboard, ]
last_updated:
---

自从年初注册了 [PT 站](/post/2020/02/everything-related-about-bittorrent-and-pt.html) 就发现原来的 [QNAP TS453bmini](/post/2018/04/qnap-ts453bmini.html) 的硬盘就不堪重负，所以想要把下载和真正想要管理的数据安全的从硬件上隔离开，所以才有了这篇文章。

## 研究阶段
自行组装 NAS 相较于买成品 NAS 中间可能遇上许许多多坑，不过填坑的过程就是学习的过程，能学到很多硬件知识，并且通过对自己需求的合理规划能够组一台最合理的符合自己需求的机器。

下面就记录一下研究过程中新接触到的概念。

### ITX
在看主板的时候不可避免的会看到这个 ITX，实际上 ITX 就是主板的一个大小，ITX 或者又称为 Mini-ITX 是一块 17 * 17cm 的主板，这种格式的主板是 2001 年时由 VIA Technologies 公司开发。ITX 主板通常被用在小型电脑中，比如一些嵌入式，无风扇，低功耗的机器中，比如[[家庭媒体中心]]，或者家用服务器中，在很多人推荐的低功耗华擎 J3455 主板中，就有一款 J3455-itx 的主板。

市面上除了 ITX，还有如下几个常见的主板尺寸：

- ITX（Mini-ATX，尺寸 17cm * 17cm）
- M-ATX（Micro-ATX，尺寸 24.4cm * 24.4cm）
- ATX（尺寸：30.5cm * 24.4cm）


### PCIe
PCIe 或者是 PCI-e，又叫做 PCI Express 全称是，Peripheral Component Interconnect Express，PCIe 是一个高速串行计算机扩展总线标准，设计的目标是为了替换老的 PCI, PCI-X 和 AGP 总线标准。它是个人计算机主板的显卡，硬盘，SSD，Wi-Fi，网卡的连接接口。有了这个接口就多了一个扩展接口，比如通过 PCIe 接口转 SATA 接口可以扩容，可以通过 PCIe 接口来接外置显卡扩展显示能力，或者扩展以太网卡等等。

通常还会看到 PCIe x1, PCIe x4, PCIe x16 几个，要了解这些就需要知道 lane 的概念，lane 由两个不同的信号对组成，一个用来接收数据，一个用来发送数据。PCIe 的连线由不同的 lane 来连接，lane 组合可以提供更高的带宽。

> A PCIe connection consists of one or more (up to sixteen, at the moment) data-transmission lanes, connected serially. Each lane consists of two pairs of wires, one for transmitting and one for receiving. There are 1, 4, 8 or 16 lanes in a single PCIe slot – denoted as x1, x4, x8, or x16.

PCIe 接口也经过了几个迭代，目前最常用的还是 PCIe 3.0.

系列	|Bandwidth	|Giga transfer	|Frequency
--------|------------|--------------|----------
PCIe 1.0	|8 GB/s	    |2.5 GT/s	| 2.5 GHz
PCIe 2.0	|16 GB/s	|5 GT/s	    | 5 GHz
PCIe 3.0	|32 GB/s	|8 GT/s	    | 8 GHz
PCIe 4.0	|64 GB/s	|16 GT/s	| 16 GHz
PCIe 5.0	|128 GB/s	|32 GT/s	| 32 GHz
PCIe 6.0	|256 GB/s	|64 GT/s	| 32 GHz

### TDP
TDP，全称叫做 Thermal Design Power, 散热设计功耗，表示的是**芯片达到最大负荷时热量释放的标准**，单位是**瓦特**，是电脑冷却系统必须有能力驱散热量的最大限度，TDP 不是芯片释放热量的功率。

### RAID 卡
RAID 卡是一种把多块独立物理硬盘按照不同方式组合形成一个逻辑硬盘，从而提供比单碟更高性能和提供冗余资料的物理硬件。

#### RAID
RAID 卡是一种物理设备，但是组 RADI 还可以通过软件方式，称为软 RAID ，通过硬件完成 RAID 功能的叫做硬 RAID，通过软件使用 CPU 完成 RADI 的叫做软 RAID。一般不推荐使用软 RAID，出错和故障的概率较高。

如果想要了解更多 RAID 相关知识可以参考这篇[文章](/post/2018/04/raid.html)。

### 网卡
在民用级别，目前市面上大都是千兆网卡，不过渐渐有人已经开始使用万兆网卡了。我个人觉得如果不是剪辑视频，或者需要在局域网中传输高码率的视频，目前个人是完全不需要使用到万兆网卡的。千兆网卡理论速度能到达 100 多M每秒，日常使用是完全没有问题的。

网卡      | 传输速率      | 理论峰值 | 备注
-----------|--------------|----------|------
百兆 | 100Mbps  |  12.5MB/s |
千兆 | 1000Mbps |  125MB/s       | 超五类以上的网线
万兆 | 10000Mbps | 1250MB/s |

### ECC memory
ECC memory 是 Error-correcting code memory 的缩写，这是一个可以校验并检查数据错误的内存。ECC 内存条一般用在不能忍受数据损坏的计算机中，比如科学计算或者金融领域。

### 塔式 vs 机架 vs 刀片
塔式服务器外形和普通家用服务器相差不多，塔式主机在主板扩展上有优势，一般预留接口较多，方便扩展。适用于入门和工作站。

机架服务器的外观安装工业标准统一设计，需要配合机柜统一使用，主要用于企业服务器密集部署。机架服务器因为需要密集紧凑，所以在设计时会非常紧凑，充分利用有限的空间。机架服务器宽度 19 英寸，高度以 U 为单位 (1U=1.75 英寸 =44.45 毫米）.

刀片服务器的主体结构是主体机箱中可以有许多热拔插的主板，每一块主板都可以独立运行自己的系统，这些主板可以集合成一个服务器集群，在集群模式下可以连接起来提供更好的网络以及共享资源。

## 准备阶段
在了解了这一系列的概念后就可以开始准备工作了，但首先需要了解配一台 NAS 的主要需求是什么，是作为媒体备份，是作为 Home Server，还是作为工作文件备份，还是作为下载机。

1. 首先你了解自己需要多少存储容量，不同的使用需求自然对容量的要求也不一致，我的 QNAP 用了一年多，但是用来存每天使用的文件的 NextCloud 目前也只用了靠近 90G 左右，然而自从注册了 PT，不到半个月时间，就塞了近 1T 的磁盘，加上之前零零落落的文件，一块盘几乎要满了。所以对容量的需求直接决定了 NAS 组件的基础，需要多少盘位，需要多大容量的磁盘。如果普通家庭只用来存储家庭相片，那么即使按照单反最大一张照片几十兆来算，假设 50M 算，一块 4T 的硬盘也足够用好几年的；而如果是视频拍摄者，动辄几个 G 的视频素材，或者是高清视频爱好者，一部蓝光几十 GB，那么在硬盘上的预算就要单独考虑了。
2. 第二，存储在 NAS 中的数据安全性，存储的文件是否容忍丢失，是否需要冗余备份，还是说对数据安全没那么多要求（比如 PT 中下载的内容随时可以删除重新获取）。
3. NAS 系统的[选择](/post/2020/02/nas-operating-system-choice.html)，需要重量级的 FreeNAS 呢，还是轻量的 OpenMediaVault，还是说需要开虚拟机，上 [[unRAID]]，[[ESXi]]，或者 [[Proxmox VE]]，操作系统的选择间接地影响着硬件的选择，比如 FreeNAS 则需要支持 ECC 的内存，并且系统对内存的要求也比较多，如果选择 ESXi 则需要考虑主板是否对硬件直通有支持。
4. 最次，功能方面，对数据的同步是否要各个客户端的支持，是否需要内网穿透等等，如果你已经选择了自己组装 NAS，那么在同步数据，内网穿透方面，我建议可以使用我之前推荐过的 [Syncthing](/post/2019/10/syncthing.html)，而内网穿透，有非常多而选择 [ZeroTier](/post/2018/06/zerotier.html)，[[Tailscale]], [OmniEdge](/post/2021/11/omniedge-usage.html)。

做好前期的评估，那接下来就是进行采购，NAS 必须的几个部分，包括 CPU，主板，内存，硬盘，机箱，这几部分最为重要，下面分开讲讲我是如何选择的。

### 如何选购 CPU
在 CPU 选购方面，NAS 看中的是**低功耗**，我需要 NAS 长时间运行，而不需要 NAS 进行 CPU 密集型任务，所以对于 CPU 而言我并不追求性能，而如果其他人想要自己组一个 Home Server 就需要另外考虑了。

可能需要 CPU 的需求：

- 视频转解码

综上所述，我个人认为在我写这篇文章的时候（2020年）J3455 已经能满足我的需求。

### 如何选购主板
在主板选购时需要注意主板上接口的数量，比如 SATA 接口的数量；有没有预留一些可以扩展的口比如 PCIe；如果想要连接电视或者投影，是否有 HDMI，或者 DP 口。

初步确定可选主板：

- 华擎 J3455-ITX 主板
- 华硕 Strix B360itx 主板
- 超微 x10sba-o

对于我个人而言，我希望至少有四个 SATA 口，这样我就可以买一个 4 盘位的 NAS 机箱，我还希望最好有一个 PCIe 扩展口，可以给未来留有一定的扩展空间，

综合性能和价格，[J3455-ITX](https://www.asrock.com/mb/Intel/J3455-ITX/index.cn.asp)，自带 4 个 SATA，内存支持 DDR3/DDR3L 1866 SO-DIMM，也可以让我笔记本淘汰的内存条派上用场，留有一个 PCIe 2.0，看起来比较适合我。

#### J3455-ITX 对比 J3455B-ITX
J3455 自带 4 个 SATA 接口，J3455B 只有 2 个 SATA 口。

### 如何选购内存
内存的选购也得看主板是否支持，上面提到了 ECC 内存，如果主板支持当然更好，不过大部分家用其实也不太需要上 ECC。

- 如果选用比较老的主板可能只会有 DDR3L 的支持
- 三星 8GB 2666Mhz DDR4 内存
- 协德 1.35V 低电压 DDR3L 1600 8G 笔记本内存条

因为主板选择了 J3455-ITX，所以找一个便宜实用的低电压版的内存条即可。

### 如何选购机箱
机箱相较于 CPU 和主板，并没有那么主要，基本上也是跟着主板而选择。

- 迎广 INWIN MS04，外观不错，4 个 3.5 寸盘热拔插，1 个或者 2 个 2.5 寸盘，ITX 机箱，1 个 5.25 寸光驱位，半高扩展卡
- 万由 U-NAS NSC-410，4 盘热拔插，ITX 主板，全高扩展卡，1U 电源
- mineNAS 4* 3.5 寸盘，2 * 2.5 寸盘，机箱含电源套装重量约 7 公斤，含电源 880

综合外观和易用性考虑，我选择了迎广 MS04，外观看起开也不错。

![inwin ms04](https://img.gtk.pw/i/2022/06/02/6297faf58e24a.jpg)

### 如何选购电源
不同的主板，机箱对电源大小和功率有一定的要求。

#### 额定功率
不同型号的电源上经常能看到一个额定功率，这里的额定功率指的是电源能提供的最大功率，单位是瓦特 (W). 对于低功耗的 J3455 主板，使用 200~300W 左右的电源即可。

#### FLEX 和 1U 电源
在关于电源的选购上经常会听到 1U 或者 FLEX 电源这种说法，其实这里的 1U 和 FLEX 指的是电源的型号，有各自的规格：

- 1U 电源一般是 40.5mm（高）*100mm（宽）*240mm（长）
- FLEX 电源大小一般为 40.5mm*81.5mm*150mm, 一般又被称为小 1U 电源
- 标准大小电源 ATX 电源，86mm* 140mm * 150mm 大小

1U 电源通常有更高的额定功率；因为 1U 通常是给机架服务器 (rack server) 设计，所以通常缺乏 PCIe 6/8 接口；因为在服务器领域，1U 电源通常设计为一直全功率运行，噪声可能是一个问题。而 FLEX 电源是从 1U 电源进化而来，通常设计为根据负载来调整风扇运行的速度，噪声影响可能稍微小一些。[^re]

[^re]: https://www.reddit.com/r/sffpc/comments/78fxd0/difference_between_flex_atx_and_1u/


### 如何选择网卡
我对于网卡要求不高，毕竟家里千兆差不多了，也不是不够用。不过看到有人提到一块拆机万兆网卡 Mellanox 淘宝只要¥190，听起来还不错。

不过我个人并没有上万兆网卡，等未来需要再说吧。

### 如何选择操作系统
之前整理过 [几个 NAS 系统](/post/2020/02/nas-operating-system-choice.html)，FreeNas 需要硬件，而 unRAID, ESXi 都是闭源产品，且需要授权，先不论其强大的功能，对我而言 OpenMediaVault 比较合适，基于 Debian，我一直用 Mint 所以也比较熟悉。

所以最终的方案是在物理机的 SSD 上安装 Proxmox VE，然后在其中安装 OpenMediaVault，四块机械硬盘直通给 OpenMediaVault 然后使用 [[SnapRAID]] 和 [[MergerFS]] 组成一个存储池使用。

## 实践阶段

### 可参考的搭配方案
我的搭配方案：

- 主板 华擎 J3455 京东全新价格 Plus -20 488 入手
- 内存 QNAP 拆机剩下的笔记本 DDR3L 2G*2
- 机箱 迎广 MS04 加电源，淘宝 879 购入
- SSD 拆机的闪迪 128G
- 电源 益衡 7025B 淘宝价格 245 元

总价格在 1500 元，另外再加硬盘的价格。

其他可选的机箱还有无牌的 ITX4 盘位机箱加一个航嘉电源，558。[^ximeng]

[^ximeng]: https://zhuanlan.zhihu.com/p/29970896

### Babesun
什么值得买的分享 [^sm]

[^sm]: <https://post.smzdm.com/p/546701/>

- 机箱：博世 NAS 机箱（DIVAR IP3000）
- 主板：ASROCK 华擎 J3455
- 内存：金士顿 8G 1600
- 硬盘：希捷 3TB x 2
- 电源：ZUMAX 小 1U(FLEX) 200W

### chriscn 配置
chriscn 的配置 [^chriscn]

- 主板 /CPU 华擎 J3455-ITX 619 元
- 金士顿 4GB DDR3L 179 元
- 机箱 酷冷至尊小魔方 239 元
- 电源 台达 VX270 270W 179 元
- 系统盘 光威 120GB SSD 119 元
- 数据盘 西部数据 紫盘 4TB * 3

[^chriscn]: https://www.chriscn.cn/entry-level-nas-solution-part-01-hardware/

### v2ex 留言
v2ex 的留言 [^v2]:

- 华擎的板载 CPU 的主板，J5005 J4105 J4005 都可以，板载 CPU 有 Intel 的核显，HDMI 接电视性能足够看 4K，TDP 10W 省电 - 迎广的 4 盘位机箱（ J 系列板子最多 4 个 SATA 口，用 PCIe 转 SATA 的转接卡可以再扩展 1-2 个）
- 系统装 OMV(Debian)，系统直接装在 16-32G 的 U 盘长期插在背面（ OMV 里有扩展可以优化日志写入，提升节省闪存寿命，怕 U 盘挂掉还可以装个定时备份系统镜像的插件，拷出来写个新 U 盘插上继续用），装个 Docker 扩展，然后 Gogs、Pi-hole、Wiki 等等的都可以用 Docker 来跑，存储部分是用 SnapRAID （需要自己写定时任务更新校验盘）+ MergerFS （把多个硬盘分区虚拟成一个分区）。

不算硬盘的话整体下来 2000 左右（半年前的价格），比群辉性能高，还便宜，要是喜欢群辉也可以装黑群晖，CPU 是 x86 架构的跑软件没有兼容问题。[^v2]

[^v2]: <https://www.v2ex.com/t/636772>

### XEON E3
这是一个来自[知乎](https://zhuanlan.zhihu.com/p/62970984) 的文章：

- CPU XEON E3 1230V2, 4 核 8 线程，ECC
- 主板 Supermicro X9SCL/X9SCM
- 内存 32GB(8GB*4 ECC unbuffered)
- SSD Samsung 840Pro 或者 Optane NVME MLC 的盘。用来当 L2ARC
- HDD, 非 SMR 的硬盘 5T*4 个。东芝和 HGST 比较稳一些。SG WD 也不怕，反正 RAIDZ2 很稳。
- U 盘一个
- 电源，散热器，风扇，机箱随意。散热最好通畅一些最好。

当然如果追求极致性能，可以像这位大神一样配置：[^da] 

[^da]: https://zhuanlan.zhihu.com/p/92257487

- 机箱 Fractal Design Node 804 Micro ATX Chassis
- 电源 Corsair HX1000i ATX Power Supply
- 主板 Supermicro A2SDi-H-TP4F Mini-ITX Motherboard
- 内存 32GB DDR4-2400 Reg / ECC Memory × 4
- 可信平台模块 Asus TPM-L R2.0 TPM
- SFP+ 铜缆模块 Ubiquiti UF-RJ45-10G × 2
- 网络适配器 Intel Ethernet Converged Network Adapter X550-T2
- M.2 固态硬盘 Intel SSD Pro 7600p Series (1.02TB, M.2 80mm, PCIe 3.0 × 4, 3D2, TLC)
- SATA 固态硬盘 Intel SSD DC S3710 Series (400GB, 2.5in SATA 6Gb/s, 20nm, MLC) × 2
- SATA 机械硬盘 WD Red 3.5" 10TB WD100EFAX × 9
- 光盘驱动器 Pioneer BDR-US01FAN
- 风扇扩展卡 Asus Fan Extension Card × 2
- CPU 风扇 Noctua NF-A6x25 60mm PWM Fan
- 机箱风扇 Thermalright TR-121BP 120mm PWM Fan × 5
- 机箱风扇 Thermalright TY-145SP 140mm PWM Fan
- 硬盘支架 E.mini L04
- 机箱串口挡板 Supermicro Serial Port Bracket
- 机箱 USB 挡板 Asus USB 2.0 Bracket


## 推荐几个网站

- <https://www.chiphell.com/>
- <http://smzdm.com/>
