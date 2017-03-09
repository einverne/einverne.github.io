---
layout: post
title: "Opwnwrt 设置"
tagline: ""
description: ""
category: 经验总结
tags: [Openwrt, Linux, Opkg, ]
last_updated: 
---

在上一篇中讲了[如何刷Openwrt]()，这一篇主要讲一些 Openwrt 的东西，以及配置相关的内容。我有一个主路由器，设置分配的局域网地址为 192.168.1.x，给内网中分配的地址也是 192.168.1.x 开头。

但是 Openwrt 默认为 AP 模式，我想要从主路由器 LAN 口连出到新的这个 Openwrt 路由器上，那么便得设置 Openwrt 路由器为 Router 模式以便于级联。

在设置路由器模式之前先来看看这几个接口，否则怎么都不会明白怎么配置的。

## br-lan, eth0, eth0.1

Openwrt 的接口名字太多，最早接触路由器的时候只知道 WLAN 口，LAN 口，后来接触 Linux 才慢慢知道 eth0， lo 等等接口，但是在  Openwrt 上接口中突然冒出来一堆看着名字熟悉，却不知道什么作用的接口。今天配置 LAN ，WAN 口时还差点把 MR12U 搞砖，幸亏昨天刷了不死 boot。

可以使用 `ifconfig` 来查看设备，常见的几个端口：

- lo 虚拟设备端口，自身回环设备，一般指向 127.0.0.1
- ra0  rai0 成对出现，无线设备，对应各自的 SSID，分别是 2.4G 和 5G
- pppoe-wan 虚拟设备，常见的拨号宽带上网
- eth0 物理网卡， eth0.1 或者 eth0.2 都是从此设备虚拟而出。
- `br-lan` 虚拟设备，用于 LAN 口设备桥接，用来使得多个虚拟或物理网络接口的行为好像他们仅有一个网络接口一样。目前路由器普遍将有线LAN口(一般四个)和WIFI无线接口桥接在一起作为统一的LAN。可以使用 `brctl show` 来查看使用情况。

可以使用如下命令来查看 `br-lan` 配置

    ~ brctl show
    bridge name bridge id       STP enabled interfaces
    br-lan      7fff.64098005e1bb   no      eth0.1 rai0 ra0

br-lan = eth0.1 + rai0 + ra0，即将有线LAN口和无线网统一划分为 LAN。


## 更改内网地址

LAN 是设置局域网内的相关属性，可以设置内网的IP，桥接的端口。比如我们默认使用192.168.1.1访问，可以修改为192.168.9.1，生效后内网的ip就会变掉。LAN口的协议为【静态地址】。下一次访问路由器管理页面就需要使用 192.168.9.1 了。

## Openwrt 修改 LuCI 语言

System->Software->在Filter栏里面输入 `-zh-cn` 点击搜索

找到 luci-i18n-base-zh-cn  点击前面的安装。然后去设置语言即可。


## 设置路由器模式

路由器模式也就是最常见的无线模式，通过有线连接至外网并发射无线提供局域网络。由于默认只有 LAN 接口，我们需要添加 WAN 接口。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/4h6LT2" title="Openwrt interface screenshot-area-2017-03-08-212320"><img src="https://c1.staticflickr.com/3/2937/33295382196_b987ce7638_z.jpg" width="640" height="274" alt="Openwrt interface screenshot-area-2017-03-08-212320"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Openwrt morning配置只有上述图片的 LAN 口，下面的 WAN 口通过如下方法添加。

点击下方的“添加新接口”

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/uUCte8" title="screenshot-area-2017-03-08-212349"><img src="https://c1.staticflickr.com/3/2939/33181066302_05d2d9fe19_z.jpg" width="640" height="307" alt="screenshot-area-2017-03-08-212349"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

为了便于区分，接口名称建议使用 WAN。按照网络接入类型，选择 DHCP（从外网自动获取ip地址），静态ip或者PPPoE拨号即可。其它设置如图，请勿选择“在多个接口上创建桥接”，最后点击提交。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/32gf24" title="screenshot-area-2017-03-08-212405"><img src="https://c1.staticflickr.com/3/2939/32522019393_741095bf88_z.jpg" width="640" height="250" alt="screenshot-area-2017-03-08-212405"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

提交后选择刚刚创建的 WAN 接口，点击“防火墙设置”，选择 WAN 并保存即可。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/1P0MFf" title="screenshot-area-2017-03-08-212422"><img src="https://c1.staticflickr.com/1/770/33181064922_794e933581_z.jpg" width="640" height="276" alt="screenshot-area-2017-03-08-212422"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

这时需要再次回到 LAN 接口，点击编辑。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/V5169u" title="screenshot-area-2017-03-08-212808"><img src="https://c1.staticflickr.com/1/695/33181064042_23f517950a_z.jpg" width="640" height="266" alt="screenshot-area-2017-03-08-212808"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

选择“物理设置”，确保“桥接接口”为选中，接口中不选中“以太网适配器”。确认后保存并应用，至此所有配置完成，连接网线即可使用。

## 无线桥接模式

无线中继模式使用无线网络接入互联网，并生成一个新的 SSID。无线桥接模式无需更改有线连接接口设置。打开无线接口设置，点击搜索。在自动弹出的设置页面中，填写上级无线密码。新网络的名称使用默认 wwan 即可。防火墙区域选择 wan，在这里请勿选择“重置无线配置”。在保存并应用后就完成了所有设置。


## 无线AP模式
无线AP模式多应用于公共场所，所有无线设备将被桥接至以太网接口，由上级网关负责 DHCP。在设置完成后 AP 所在路由器将无法访问。


首先打开 LAN 接口或者 WAN 接口，选择“物理设置”，确保“桥接接口”为选中。在下方接口选中“以太网适配器”以及“无线网络”，保存并应用即可。

至于无线加密设置以及 DHCP 设置较为简单，自行在“网络”分类下查找即可。


## reference

- <https://roov.org/2014/10/openwrt-setup-guide/>
- https://blog.phpgao.com/openwrt-interface.html
- http://wizju.com/post/102/
- http://wizju.com/post/94/
- http://unix.stackexchange.com/questions/57309/how-can-i-tell-whether-a-network-interface-is-physical-device-or-virtual-alia
- https://wiki.openwrt.org/zh-cn/doc/networking/network.interfaces
- https://wiki.openwrt.org/zh-cn/doc/uci/network/switch

