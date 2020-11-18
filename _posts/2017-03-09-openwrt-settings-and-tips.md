---
layout: post
title: "Openwrt 接口及基本设置"
tagline: ""
description: ""
category: 经验总结
tags: [openwrt, linux, opkg, router, ]
last_updated:
---

在上一篇中讲了[如何刷 Openwrt](/post/2017/03/tp-link-mr12u-flash-openwrt.html)，这一篇主要讲一些 Openwrt 的东西，以及配置相关的内容。我有一个主路由器，设置分配的局域网地址为 192.168.1.x，给内网中分配的地址也是 192.168.1.x 开头。

但是 Openwrt 默认为 AP 模式，我想要从主路由器 LAN 口连出到新的这个 Openwrt 路由器上，那么便得设置 Openwrt 路由器为 Router 模式以便于级联。

在设置路由器模式之前先来看看这几个接口，否则怎么都不会明白怎么配置的。

## br-lan, eth0, eth0.1

Openwrt 的接口名字太多，最早接触路由器的时候只知道 WLAN 口，LAN 口，后来接触 Linux 才慢慢知道 eth0， lo 等等接口，但是在  Openwrt 上接口中突然冒出来一堆看着名字熟悉，却不知道什么作用的接口。今天配置 LAN ，WAN 口时还差点把 MR12U 搞砖，幸亏昨天刷了不死 boot。

可以使用 `ifconfig` 来查看设备，常见的几个端口：

- `lo` 虚拟设备端口，自身回环设备，一般指向 127.0.0.1
- `ra0`  `rai0` 成对出现，无线设备，对应各自的 SSID，分别是 2.4G 和 5G
- `pppoe-wan` 虚拟设备，常见的拨号宽带上网
- `eth0` 物理网卡， eth0.1 或者 eth0.2 都是从此设备虚拟而出。
- `br-lan` 虚拟设备，用于 LAN 口设备桥接，用来使多个虚拟或物理网络接口的行为好像他们仅有一个网络接口一样。目前路由器普遍将有线 LAN 口（一般四个）和 WIFI 无线接口桥接在一起作为统一的 LAN。可以使用 `brctl show` 来查看使用情况。
- `eth1` 如果路由器有两块网卡，一般 eth1 作为 WAN 口
- `wlan0` 一般是无线网卡，无线端口
- `wlan1` 另一块无线网卡

可以使用如下命令来查看 `br-lan` 配置

    brctl show

    bridge name bridge id       STP enabled interfaces
    br-lan      7fff.64098005e1bb   no      eth0.1 rai0 ra0

`br-lan` = eth0.1 + rai0 + ra0，即将有线 LAN 口和无线网统一划分为 LAN。

下面张图比较直观：

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/27528019117/in/dateposted/" title="openwrt-interface"><img src="https://farm2.staticflickr.com/1723/27528019117_5798e19506_z.jpg" alt="openwrt-interface"></a>

## 更改内网地址

LAN 是设置局域网内的相关属性，可以设置内网的 IP，桥接的端口。比如我们默认使用 192.168.1.1 访问，可以修改为 192.168.9.1，生效后内网分配的 ip 网段就会变成 192.168.9.x 。LAN 口的协议为【静态地址】。下一次访问路由器管理页面就需要使用 192.168.9.1 了。

## Openwrt 修改 LuCI 语言

System->Software->在 Filter 栏里面输入 `-zh-cn` 点击搜索

找到 luci-i18n-base-zh-cn  点击前面的安装。然后去设置语言即可。


## 设置路由器模式

**路由器模式**也就是最常见的无线模式，通过有线连接路由器 WAN 口至互联网，并发射无线提供局域网络。由于 OpenWrt 默认只有 LAN 接口，我们需要添加 WAN 接口。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/4h6LT2" title="Openwrt interface screenshot-area-2017-03-08-212320"><img src="https://c1.staticflickr.com/3/2937/33295382196_b987ce7638_z.jpg" width="640" height="274" alt="Openwrt interface screenshot-area-2017-03-08-212320"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Openwrt morning 配置只有上述图片的 LAN 口，下面的 WAN 口通过如下方法添加。

点击下方的“添加新接口”

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/uUCte8" title="screenshot-area-2017-03-08-212349"><img src="https://c1.staticflickr.com/3/2939/33181066302_05d2d9fe19_z.jpg" width="640" height="307" alt="screenshot-area-2017-03-08-212349"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

为了便于区分，接口名称建议使用 WAN。按照网络接入类型，选择 DHCP（从外网自动获取 ip 地址），静态 ip 或者 PPPoE 拨号即可。其它设置如图，请勿选择“在多个接口上创建桥接”，最后点击提交。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/32gf24" title="screenshot-area-2017-03-08-212405"><img src="https://c1.staticflickr.com/3/2939/32522019393_741095bf88_z.jpg" width="640" height="250" alt="screenshot-area-2017-03-08-212405"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

提交后选择刚刚创建的 WAN 接口，点击“防火墙设置”，选择 WAN 并保存即可。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/1P0MFf" title="screenshot-area-2017-03-08-212422"><img src="https://c1.staticflickr.com/1/770/33181064922_794e933581_z.jpg" width="640" height="276" alt="screenshot-area-2017-03-08-212422"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

这时需要再次回到 LAN 接口，点击编辑。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/V5169u" title="screenshot-area-2017-03-08-212808"><img src="https://c1.staticflickr.com/1/695/33181064042_23f517950a_z.jpg" width="640" height="266" alt="screenshot-area-2017-03-08-212808"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

选择“物理设置”，确保“桥接接口”为选中，接口中不选中“以太网适配器”。确认后保存并应用，至此所有配置完成，连接网线即可使用。

## 设置有线中继模式
一种需求是将有线网络转为无线 WiFi，使得 WiFi 网络和其他原来在有线网络中的设备在同一子网中，比如说一级路由网段 192.168.2.X，然后添加无线路由器分享 WiFi，使得 WiFi 上的设备网段依然是 192.168.2.X，不产生新子网，没有 NAT，一级路由下面设备可以访问二级路由下任何设备不需要做端口转发。

有线中继的方式下，二级路由不会 DHCP，并且网段相同。如果要实现这种模式，OpenWrt 需要将无线网卡接口和 WAN 划分到一起，路由器 Master 模式 + 无线 AP.

- 设置无线 wlan0, 接入点 AP 模式，并且将网络和 WAN 划到一起。

此时连接 WiFi，会发现客户端通过一级路由分配 IP 地址，网关是上一级路由的网关。

## 设置有线桥接模式


## 无线桥接模式
有些时候并没有有线网络可以连接到 OpenWrt 路由器 WAN 口，但是有 WiFi 可以连接，那么可以将路由器转变成一个 WiFi 信号放大器，扩展 WiFi 信号覆盖范围。

**无线中继模式**使用无线网络接入互联网，并生成一个**新的 SSID**。**无线桥接模式**无需更改有线连接接口设置。打开无线接口设置，点击搜索。在自动弹出的设置页面中，填写上级无线密码。新网络的名称使用默认 **WWAN** 即可。防火墙区域选择 WAN，在这里请勿选择“重置无线配置”。在保存并应用后就完成了所有设置。

假如有一台主路由已经接入了互联网（内网网段是 192.168.2.1/24)，现在要在一台从路由 (OpenWrt) 上无线桥接到主路由。

- 在二级 OpenWrt 路由器上安装 `luci-proto-relay` 和 `relayd`
- 在 “网络” -> “接口” 中修改 LAN 口地址，与主路由不在同一个网段，比如主路由在 192.168.2.1/24，那么在二级路由中就不用这个网段，而配置 192.168.199.1/24
- 关闭 LAN 口 DHCP
- 设置 OpenWrt 桥接模式，在无线接口中，**搜索（扫描）**，找到主路由 Wifi 名字，输入主路由的密码连接，在接口配置中使用客户端模式，网络选择 wwan.  然后生成新的 wwan 接口。点到接口页面，能看到 WWAN 获取了主路由分配的 IP。
- 设备无线网络，从路由器发送 AP，设置 ESSID（起一个无线 Wifi 的名字）, 模式选择接入点 AP，网络选 lan，在安全页面设定 WiFi 密码
- 设置后就连接新的无线网络就实现了 OpenWrt 上的无线桥接。

## 无线 AP （中继）模式
无线 AP（接入点） 模式多应用于公共场所，所有无线设备将被桥接至以太网接口，由上级网关负责 DHCP。在设置完成后 AP 所在路由器将无法访问。

首先打开 LAN 接口或者 WAN 接口，选择“物理设置”，确保“桥接接口”为选中。在下方接口选中“以太网适配器”以及“无线网络”，保存并应用即可。

至于无线加密设置以及 DHCP 设置较为简单，自行在“网络”分类下查找即可。

## 桥接中继模式的区别
总结性的归纳一下，中继和桥接都可以扩大原来的信号范围。

- 无线中继通过接受信号，再发送信号的方式，可以自己设定是否提供 DHCP NAT
- 而无线桥接模式不参与

	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-updates main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ buster-backports main contrib non-free
	deb https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
	# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security buster/updates main contrib non-free
中继模式 (Repeater) 下，路由器会通过**无线** 方式与一台可以上网的无线路由器建立连接，用来放大可以上网的无线路由器上的无线信号（放大后的无线信号和原来的无线路由器名称一致）。适用于扩大一台可以上网的无线路由器的信号覆盖范围。中继**一边接受信号**，一边发射**自己的无线信号**。这种模式下无线路由器以 Client 方式接入主路由，另外新增虚拟接口提供无线接入。

而桥接模式 (Bridge) 下，路由器通过无线方式与可以上网的无线路由器连接，而放大后的无线信号名称可以和原来的不一样。桥接模式下路由器可以设定自己的 DHCP，提供一个自己的局域网。

中继和桥接模式都可以通过无线方式扩大信号，区别在于扩大后的无线信号名字不一样。

## reference

- <https://roov.org/2014/10/openwrt-setup-guide/>
- https://blog.phpgao.com/openwrt-interface.html
- http://wizju.com/post/102/
- http://wizju.com/post/94/
- http://unix.stackexchange.com/questions/57309/how-can-i-tell-whether-a-network-interface-is-physical-device-or-virtual-alia
- Linux 网络接口 https://wiki.openwrt.org/zh-cn/doc/networking/network.interfaces
- https://wiki.openwrt.org/zh-cn/doc/uci/network/switch
- <https://openwrt.org/docs/guide-user/network/wifi/relay_configuration>
