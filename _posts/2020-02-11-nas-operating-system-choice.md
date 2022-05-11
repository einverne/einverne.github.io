---
layout: post
title: "几个常见的 NAS 系统整理及选择"
aliases: "几个常见的 NAS 系统整理及选择"
tagline: ""
description: ""
category: 学习笔记
tags: [freenas, unraid, esxi, docker, linux, freebsd, openmediavault, nas, operating-system, ]
last_updated:
---

看文章老有几个 NAS 系统被翻来覆去的提到，这里就一起看看 Wiki，看看有什么区别吧。

## FreeNAS
开源 NAS 系统中最著名也最强大的一个系统，基于安全和稳定著称的 FreeBSD，集成了 Sun 公司的 ZFS 文件系统，ZFS 拥有很多文件管理的特性，非常适合管理大量可扩展的数据系统。[^zfs] 目前由 ixsystems 公司维护。

- <http://www.freenas.org>

[^zfs]: <https://en.wikipedia.org/wiki/ZFS>

### 硬件依赖
FreeNAS 对硬件有一定的要求（ECC 内存），达到日常可用需要较大内存，如果要安装插件或者启用虚拟机可能需要更多。FreeNAS 的 ZFS 需要一个基本的内存量来维持基本的运行。[^1]

[^1]: <https://www.getnas.com/freenas-hardware-guide-goal/>

### 安装

安装教程：

- <https://www.youtube.com/watch?v=QgTBUQ6C2ZY>
- <https://www.youtube.com/watch?v=wk3JTY045s4>

## NAS4Free
基于 FreeNAS 0.7 开发的一个分支，由原 FreeNAS 系统开发者发起创建。

官网：

- <http://www.nas4free.org/>

## OpenMediaVault
OpenMediaVault 是一款基于 Debian 的 NAS 操作系统，项目领导人是 Volker Theile，于 GUN GPLv3 下开源。OpenMediaVault 和 FreeNAS 有个很深的缘源，他们都基于 FreeNAS，不过在 2009 主要的两位项目负责人产生分歧，所以 Volker Theile 基于 Linux 重写了 FreeNAS 于是成就了 OpenMediaVault，而另一位 FreeNAS 的创始人 Olivier Cochard-Labbé 则基于 FreeBSD 重写了 FreeNAS，于是成就了今天的 FreeNAS。[^wiki]

[^wiki]: <https://en.wikipedia.org/wiki/OpenMediaVault>

OpenMediaVault 主要面向小型办公环境和家庭，所以体积非常小，并且还有树莓派版本。

个人在对比了开源操作系统之后选择了 OpenMediaVault，日常使用起来基本无问题。


### 优点

- 内存占用小
- 可以充分利用 Debian 的软件生态
- 支持 Docker
- 可以借助第三方软件([[MergerFS]])组存储池，磁盘冗余备份

### 其他参考链接

- <http://www.openmediavault.org/>

## ESXi
准确来讲 [[ESXi]] 不能算作是一个 NAS 系统，更多地可以称其为虚拟机系统，用户可以在 ESXi 上虚拟化出多个系统充分利用硬件性能。

ESXi 由 VMware 公司开发，是VMWare vSphere Hypervisor 套件之下重要组件，这是一套为企业而设计的虚拟机。ESXi 可以方便的安装在服务器中，然后就可以虚拟化安装其他系统。

前身是 ESX，依赖 Linux，后来抛弃 Linux 变成了 ESXi。

界面比较友好，但是硬件兼容性差。


更详细的介绍可以参考这个[视频](https://www.youtube.com/watch?v=-Hltydu9PXk)

<iframe width="560" height="315" src="https://www.youtube.com/embed/-Hltydu9PXk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## PVE
[[PVE]] 的全称是 Proxmox Virtual Environment，是基于 Debian 的 Linux 系统，虚拟机内核为 KVM，硬件兼容性好。和 ESXi 一样，也算不上 NAS 系统，但是可以将其作为物理机的操作系统，再此基础之上安装，比如 OpenMediaVault这样为 NAS 而设计的系统。我自己配置的 NAS 就是这样一套系统。


## unRAID
[[unRAID]] 是基于 [Slackware](https://zh.wikipedia.org/wiki/Slackware) 这个 Linux 发行版的 NAS 系统 (6.2RC2 基于 14.2)。unRAID （又有人写作 Unraid, 或者 UnRaid) 是另一款 NAS 操作系统，实现的功能都大同小异 [^unraid]，unRAID 不通过组 RAID 方式来存储数据，但是可以和 RAID 一样做到冗余备份，简单来说 unRAID 就是带有检验盘的磁盘簇 (JBOD)。

unRAID 另外比较亮眼的就是虚拟化技术以及硬件直通，可以在此基础上虚拟化安装各个操作系统以及充分利用硬件接口。

> unRAID Server OS is a Network Attached Storage server operating system that boots from a USB Flash device, and is specifically designed for digital media storage.


unRAID 6 默认使用 XFS 文件系统，但如果定义了 Cache poll，那么会使用 BTRFS 文件系统。

### unRAID 优点

- 系统从 U 盘启动，启动后系统在内存中
- 集成插件支持，集成 Docker 支持，支持虚拟机
- 支持硬盘无访问自动休眠
- 只需要一个校验盘（需大于阵列中最大的盘的容量），整个磁盘阵列允许一个磁盘挂掉，只需要用同等大小的磁盘替换即可
- 扩容方便，只需要往阵列中继续添加磁盘即可，唯一的限制就是新添加的硬盘容量不能大于校验盘大小。如果新加入的盘容量大于校验盘则需要先将校验盘替换成该硬盘，然后将原来的校验盘作为新盘加入


### unRAID 缺点

- 系统配置在重启后可能丢失，并且基于一个非主流的 Linux 发行版，排查问题可能遇到瓶颈
- unRAID 是需要授权的，但相反这个对于非技术人员反而可能是优势，毕竟可以有一个技术支持。unRAID 的授权价格从最低 $59(6 块硬盘）， $89(12 快硬盘），到 Pro $129 （无限硬盘）[^price]


[^price]: <https://unraid.net/pricing>

[^unraid]: <https://unraid.net/product>


## 其他

### Openfiler
这是一款基于文件的存储系统。

官网： <https://www.openfiler.com/>

- CIFS，NFS，HTTP
- SAN feature，iSCSI，FC
- High Availability / Failover
- Block Replication （LAN & WAN）
- Web-based Management
- Cost-free Storage Capacity Expansion

### NexentaStor
NexentaStor is an OpenSolaris or more recently Illumos distribution optimized for virtualization, storage area networks, network-attached storage, and iSCSI or Fibre Channel applications employing the ZFS file system. Like OpenSolaris, NexentaStor is a Unix-like operating system.

- <https://nexenta.com/products/nexentastor>

### RockStor
基于 Linux，采用企业级文件系统 BTRFS，提供 SMB/CIFS、NFS 以及 SFTP 常见的共享方式

- <http://rockstor.com/>

### EasyNAS

- <https://www.easynas.org/>


## Conclusion

总结来讲，FreeNAS 有最好的文件系统 -- ZFS，但是对 Docker 支持需要借助虚拟机有一定性能损耗，OpenMediaVault 最轻量，但是对虚拟机不支持硬件直通，unRAID 可以非常方便的扩展硬盘池大小，对虚拟机支持也比较完善。

对于我个人而言，目前我并没有支持 ECC 的内存，也没有备用多余的内存条，我目前的数据也不需要做到实时备份，所以目前我不需要 FreeNAS，而 unRaid 又有一些我无法容忍的问题（比如配置丢失的问题，作为个人家用虽然可以 24 小时开机，但我不想每次开机后需要重新配置），综合下来 OpenMediaVault 最符合我的需求：

- 一个稳定的系统，Debian 上的扩展也非常多
- Docker 也支持
- 配合 [mergerfs](https://github.com/trapexit/mergerfs) 可以实现多物理盘组合，实现 UnRaid 中随时添加磁盘的特性
- 配合 [SnapRAID](https://www.snapraid.it/) 可以实现冗余备份
- 配合 [[Prometheus]] 和 [Grafana](/post/2018/02/grafana.html) 可以对 NAS 进行全面的监控，弥补起管理后台监控的不足
- 最重要的就是 [OpenMediaVault](/post/2020/04/prometheus-monitoring-system-and-tsdb.html) 是[开放源代码的](https://sourceforge.net/projects/openmediavault/)

最后我的方案就是在硬件上安装 Proxmox，然后在 Proxmox 中安装了 OpenMediaVault。

## reference

- FreeNAS vs unRAID <https://www.youtube.com/watch?v=aXsRIrC5bjg>
- <https://www.openmediavault.org>
