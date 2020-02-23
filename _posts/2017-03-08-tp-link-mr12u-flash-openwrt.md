---
layout: post
title: "TP LINK MR12U 刷 openwrt"
tagline: ""
description: ""
category: 经验总结
tags: [openwrt, linux, router, ]
last_updated:
---

今天翻箱倒柜竟然找出了我的 TP-LINK MR12U，很早之前因为 3G 上网卡而买的便携式路由，突然脑袋一热，干嘛不试试刷个 Openwrt 呢。记得当时是没有支持的，但是一搜竟然发现了 Openwrt 有官方支持了。于是开始动手。

这里主要记录一下 MR12U v1.0 版本的过程，但是感觉其他路由器异曲同工，掌握了一种方法其他路由器也是类似的原理。刷机的过程有风险，因此一定要做好充分的调查和心理准备。很早之前写过一篇文章讲[防止 Android 刷机变砖](/post/2013/09/prevent-flash-android-rom-brick.html) ，我利用其中用到的方法一直刷机至今。说到底，终究要知道自己做的每一步是什么含义，出现的每一个术语是什么含义。

我一直坚信着“授人以鱼不如授人以渔”的理念，因此我在文中会把我参考的所有文章以及想法过程都记录下来，以便于在以后刷其他路由器的时候能够更加快速，并且如果有其他人能看到也能更加明白。

## Openwrt
首先什么是 Openwrt，Openwrt 是一个适合嵌入式设备的 Linux 发行版 [^wiki]，相对原厂固件而言，OpenWrt 不是一个单一静态的固件，而是提供了一个可添加软件包的可写的文件系统。这使用户可以自由的选择应用程序和配置，而不必受设备提供商的限制，并且可以使用一些适合某方面应用的软件包来定制你的设备。对于开发者来说，OpenWrt 是一个框架，开发者不必麻烦的构建整个固件就能得到想要的应用程序；对于用户来说，这意味着完全定制的能力，与以往不同的方式使用设备，OPKG 包含超过 3500 个软件。

默认使用 LuCI 作为 web 交互界面。

[^wiki]: 维基百科 <https://zh.wikipedia.org/wiki/OpenWrt>

因为其强大的扩展性，所以能用 Linux 做到的事情，Openwrt 几乎都能做到，而如今生活在墙内，路由器很重要的一个功能便是翻墙，结合 Shadowsocks，pdnsd 等等 Openwrt 可以做到透明代理。去除这个硬性需求外，其他比如：

- 脱机下载
- SMB
- SSH
- 单线多播
- 远程视频监控
- 去广告，屏蔽恶意域名

甚至定时关 WIFI，开 WIFI，都几乎是一行命令。

## 选择路由器
其实 Openwrt 自身维护一个兼容路由器列表 <https://wiki.openwrt.org/toh/start> 。在购买或者刷机之前都可以看一眼。网上推荐的很多支持比较好，性价比比较高的路由器，NETGEAR 的比较多，WNDR 4300，WNDR 3700 和 WNDR 3800 都是比较流行的路由器。在选择一款路由器上，其实最好的不是性能最强的，而是最适合自己的。知乎上有个回答说得很好：

> 对于 Openwrt 用户而言，因地制宜合理发挥才是最优选择。对于家用环境而言更适合性能向（千兆局域网、强劲的性能、MIMO&5G hz 表现优异），对于差旅党、安全狗而言便携路由器更具备实用性。所以在初入 openwrt 圈子的前提下建议先上手一款大方向上适合自己的机器。

然后下面是一些链接，在刷机或者购机之前都看一眼比较好：

- Openwrt 官网 <https://openwrt.org/>
- 恩山 <http://www.right.com.cn/forum/forum.php>
- <http://www.anywlan.com/>

## 开刷
在网上搜索了一圈，很少有 MR12U v1.0 版本的教程，倒是找到一个 v2 版本的详细教程。但是 v1 版本的刷机和 v2 相差不大。v2 版原帖 <http://www.right.com.cn/forum/thread-169358-1-1.html> 。

硬件：TP-MR12U(v1) 路由器一个，网线一根，PC 一台，戳菊花工具一根。

软件：如果在 Windows 下需要 TPRouter  用于修改固件版本信息。putty: 以命令行方式登陆路由器。WinSCP: 上传文件到路由器。而如果在 Linux 下，打开终端即可。

固件：

(1) 对应的 Openwrt 解锁 U-Boot 分区固件，文件名为 openwr-ar71xx-generic-tl-mr11u-v2-squashfs-factory.bin 。看清楚是 11U 的不是 12U 的，因为 12U(v1) 和 12U(v2) 硬件不同，12U(v1) 需要使用 11U(v2) 的固件。这个也是我们第一次需要刷入的固件。

(2)openwrt 适用于 MR12Uv1 的官方固件，文件名为 openwrt-15.05.1-ar71xx-generic-tl-mr12u-v1-squashfs-factory.bin。如果你不在意用的 openwrt 不是最新版的话可以不用。

(3) 不死 boot 固件，文件名为 breed-ar9331-mr12u.bin。

刷机过程：

1. 开机状态下按住路由器 reset 按 5 秒，重置路由器。
2. 连上 wifi，进入 192.168.1.1，系统工具 -> 软件升级，刷入 openwr-ar71xx-generic-tl-mr11u-v2-squashfs-factory.bin，等上几分钟
3. 用 lan 线连接路由器和电脑，会发现已经变成 openwrt 的界面了，在后台修改密码，打开无线功能。
4. 如果需要刷 不死 u-boot , 可以参考[原贴](http://xzper.com/2015/07/11/TP-MR12U%E5%88%B7openwrt-%E4%B8%8D%E6%AD%BBboot/).
5. 具体过程总结，使用 `ssh root@192.168.1.1` 连上路由器

        root@mr12u:/tmp# ifconfig eth0

        eth0      Link encap:Ethernet  HWaddr XX:XX:XX:XX:XX:XX
                  UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
                  RX packets:16514 errors:0 dropped:0 overruns:0 frame:0
                  TX packets:13371 errors:0 dropped:0 overruns:0 carrier:0
                  collisions:0 txqueuelen:1000
                  RX bytes:2388356 (2.2 MiB)  TX bytes:2518125 (2.4 MiB)
                  Interrupt:4

		记住上述 HWaddr 后面 MAC 地址，后面会用到。

6. 上传 `breed-ar9331-mr12u.bin` 使用 `scp breed-ar9331-mr12u.bin root@192.168.1.1:/tmp/`
7. 再使用 ssh 连山路由器，使用如下命令

        cd /tmp
        mtd write breed-ar9331-mr12u.bin u-boot
        # 成功后 reboot 重启路由器即可。

8. 如果这一步出现如下信息，是使用了 Openwrt 官方的固件，默认是锁了 `u-boot` 的。

        Could not open mtd device: u-boot
        Can't open device for writing!

9. 当前的 Openwrt 锁了 `u-boot` 分区，需要刷入一个未锁分区的 Openwrt 固件，可以上论坛找一下，将解锁分区的固件上传到 /tmp 目录，使用 mtd 命令写入固件 firmware 分区。

	cd /tmp
	mtd write openwr-ar71xx-generic-tl-mr11u-v2-squashfs-factory.bin firmware

10. 刷入了 `u-boot` 分区后可按照如下步骤进入 `u-boot` 控制台。
11. 路由器和电脑连接，在关机状态下，使用工具按住 reset 按钮不放，打开路由器开关，过一会儿看到蓝色灯亮一下，再过一会儿看到蓝色灯闪 4 下，松开 reset 按钮，在浏览器输入 192.168.1.1 进入 `u-boot` 界面。
12. 修改 MAC 地址， `u-boot` 会将 MAC 地址重置，需要将 MAC 地址还原回来，不然有些功能无法使用，比如无线功能，将之前备份好的 MAC 地址放入 TP-LINK 设置下的 MAC 地址位置。
13. 如果想要刷入新固件，直接在 `u-boot` 中固件更新刷入新固件即可。


## reference

- 官方资源 <https://wiki.openwrt.org/toh/hwdata/tp-link/tp-link_tl-mr12u_10>
- <http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=184784&highlight=mr12u>
- TP-MR12U(v2) <http://xzper.com/2015/07/11/TP-MR12U%E5%88%B7openwrt-%E4%B8%8D%E6%AD%BBboot/>
- <http://m.weixindou.com/p/NTE53GBTKS.html>
- <http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=184784&highlight=mr12u>
- U-boot 刷机方法大全 <http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=154561&page=1>
- TP-LINK 全系列解锁 U-Boot 分区固件 <http://www.right.com.cn/forum/thread-142763-1-1.html>
- breed-ar9331-mr12u.bin <http://breed.hackpascal.net/>
- 不死 boot <http://www.right.com.cn/forum/thread-161906-1-1.html>
- TP-Link mr12u v2 <http://www.right.com.cn/forum/thread-169358-1-1.html>
- 单反控制器思路  <http://www.right.com.cn/forum/thread-208325-1-1.html>
- mr12u 兼容 3G 网卡型号 <http://service.tp-link.com.cn/download/list/TL-MR12U/>
