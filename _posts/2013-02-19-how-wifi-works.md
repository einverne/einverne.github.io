---
layout: post
title: "Wifi 是如何工作的？"
tagline: ""
description: ""
category: 学习笔记
tags: [wifi, tcp, network]
last_updated:
---

要了解 WiFi 那么则先要分清楚这几个名词，WiFi，WLAN:

- WiFi 的全称是 Wireless Fidelity，目前我们见到的 Wifi 其实是隶属于 Wifi 联盟的商标，表示的是建立于 IEEE 802.11 标准的无线局域网技术
- 而 WLAN 是无线局域网络 (Wireless Local Area Networks) 的缩写， Wifi 是 WLAN 的一种实现

## WiFi 的技术优势

- 无线电波相较于蓝牙覆盖面积广，WiFi 的理论半径可以达到 100 米
- 商家接入成本低

## 无线组网的节点

在 WLAN 中有几个常见的名词，比如：

- AP，表示的是 Access Point，无线接入点
- STA, 其实是 Station 的缩写，指代的是连接到无线网络中的设备

## 信道
如果稍微留意一下家用路由器的设置后台就会发现，除了网络名称，加密方式之外还有无线模式，和信道之别。大部分家用路由器是无法设置信道的，但是如果用 OpenWrt 或者刷了其他固件可能会有调整设置。而这里的信道就是指的在 2.4GHz 或者 5GHz 下不同的频率的传输通道，2.4 GHz 频段频率范围为 2.400—2.4835GHz，下面划分了 14 个信道。现在的家用网络环境越来越复杂，所以导致相同频率之间的设备可能会有干扰，所以手动先观察周围的信道 (Android 下可以使用开源的 WiFiAnalyzer)，再选择一个不干扰的信道可以优化一下家用网络环境。


## 2.4GHz 和 5GHz 区别
802.11 划分了四个独立频段，2.4 GHz、3.6 GHz、4.9 GHz 和 5.8 GHz [^hz]

2.4 GHz 频段频率范围为 2.400—2.4835GHz，共 83.5M 带宽，在 2.4 GHz 下又划分了 14 个信道，每个子信道宽度为 22MHz，相邻信道的中心频点间隔 5MHz。观察信道的频率重合就能发现，信道 1,2,3,4,5 频率有重叠，整个 2.4 GHz 频段内只有 1,6,11 互不干扰。

[^hz]: https://zh.wikipedia.org/wiki/WLAN%E4%BF%A1%E9%81%93%E5%88%97%E8%A1%A8

- 第一代 802.11：1997 年制定，只使用 2.4GHz，最快 2Mbit/s
- 第二代 802.11b，只使用 2.4GHz，最快 11Mbit/s，正逐渐被淘汰
- 第三代 802.11g/a，分別使用 2.4GHz 和 5GHz，最快 54Mbit/s
- 第四代 802.11n（Wi-Fi 4），可使用 2.4GHz 或 5GHz，20 和 40MHz 頻寬下最快 72 和 150Mbit/s
- 第五代 802.11ac（Wi-Fi 5），工作频率 5GHz，频道带宽支持 20, 40, 80, 160MHz，速率最高可以单条 866.7 Mbit/s
- 第六代 802.11ax（Wi-Fi 6），WiFi-6 在目前 802.11ac 标准的基础上，WiFi-6 是为了解决局域网中连接设备的增多而诞生

IEEE 802.11b 是无线局域网的一个标准，载波的频率为 2.4GHz，传送速度为 11Mbit/s . IEEE 802.11b 的后继标准是 IEEE 802.11g，其传送速度为 54Mbit/s。所以我们日常提及的 2.4G 和 5GHz 的区别就在与路由器发射频率的区别，实现的 802.11 协议的区别。当我们距离路由器相同距离，5G 信号相比于 2.4G 信号较弱，这是由于电磁波的物理特性决定，波越长衰减越少，更容易绕过障碍物传播。5G 信号频率高，波长短，所以 5G 信号绕过障碍物衰减更多。但是信号衰减并不代表影响网络速度，网络速度还与信道相关，上文提及 2.4G 下互不干扰的信道只有 3 个，但是 5G 下有 20 多个，并且 5G 可以支持更高的网络传输速率。所以如果追求更加稳定不受干扰的信号就用 5GHz。

IEEE 802.11n 是 802.11a 和 802.11g 改良，改进的地方：

- channel 可以使用 40MHz 频宽
- 使用 MIMO(multiple-input and multiple-output) 技术，可以一次多个通道发送数据，其实就是用多根天线。

## WiFi 的加密方式
常见的 WiFi 加密方式有：WPA 、WPA2、WPA/WPA2、WEP、802.1x(EAP)

### WPA
WPA 是 Wi-Fi Protected Access(WiFi 安全存取）, 有 WPA 和 WPA2 两个标准，WPA 继承了 WEP 基本原理，同时加强了生成密钥的算法，追加了防止数据中途被篡改的功能。

完整的 WPA 实现复杂，一般家用采用的是 WPA 的简化版本：WPA-PSK（预共享密钥）。

WPA 加密方式有四种认证方式：WPA，WPA-PSK，WPA2，WPA2-PSK。

#### WPA2
WPA2 是 WPA 的增强型版本，WPA2 新增了对 AES 的加密方式的支持。

#### WPA-PSK
WPA-PSK 适用于个人或普通家庭网络，使用预先共享密钥，支持 TKIP 和 AES 两种加密方式。

### WEP
WEP 全称是 Wired Equivalent Privacy（有线等效保密），是对两台设备间无线传输的数据加密的一种。WEP 是一种加密方法，安全性没有 WPA 高。



## 外延
Android 下有款 APP 叫做 **WiFiAnalyzer** 可以扫描周围 WiFi 占用的信道，以便于调整路由器信道。


802.11 协议规定，不同的无线网络可以具有相同的网络名称（也就是 SSID/ESSID)，但是必须对应一个唯一的 BSSID 地址。非法入侵者可以通过建立具有相同的 SSID/ESSID 的无线网络的方法，使得网络中的 STA 联接到非法的 AP 上，从而造成网络的泄密。通过 BSSID 地址绑定的方式，可以防止 STA 接入到非法的网络，从而提高无线网络的安全性。

## reference

- <https://zh.wikipedia.org/wiki/Wi-Fi>
