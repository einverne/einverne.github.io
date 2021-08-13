---
layout: post
title: "每天学习一个命令：traceroute 查看路由信息"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [traceroute, network, linux, command]
last_updated:
---

traceroute（跟踪路由）是路由跟踪程序，用于确定 IP 数据报访问目标所经过的路径。traceroute 命令用 IP 存活时间 (TTL) 字段和 ICMP 错误消息来确定从一个主机到网络上其他主机的路由。

通过 traceroute 命令可以知道数据包从你的计算机到互联网另一端的主机是走的什么路径。当然每次数据包由某一同样的出发点（source）到达某一同样的目的地 (destination) 走的路径可能会不一样，但大部分时候所走的路由是相同的。

Linux 系统中是 traceroute, 在 Windows 中为 tracert。traceroute 通过发送小数据包到目的主机直到其返回，来测量其耗时。一条路径上的每个设备 traceroute 要测 3 次。输出结果中包括每次测试的时间 (ms) 和设备的名称及其 IP 地址。

在大多数情况下，在 Linux 主机系统下，直接执行命令行：

    traceroute hostname

## 使用

命令格式：

    traceroute options host

命令功能：

traceroute 预设数据包大小是 40Bytes，可设置。

具体参数格式：

    traceroute [-dFlnrvx][-f 存活数值][-g 网关...][-i 网络界面][-m 存活数值][-p 通信端口][-s 来源地址][-t 服务类型][-w 超时秒数][主机名称或 IP 地址] 数据包大小

命令参数：

```
-d 使用 Socket 层级的排错功能。
-f 设置第一个检测数据包的存活数值 TTL 的大小。
-F 设置勿离断位。
-g 设置来源路由网关，最多可设置 8 个。
-i 使用指定的网络界面送出数据包。
-I 使用 ICMP 回应取代 UDP 资料信息。
-m 设置检测数据包的最大存活数值 TTL 的大小。
-n 直接使用 IP 地址而非主机名称。
-p 设置 UDP 传输协议的通信端口。
-r 忽略普通的 Routing Table，直接将数据包送到远端主机上。
-s 设置本地主机送出数据包的 IP 地址。
-t 设置检测数据包的 TOS 数值。
-v 详细显示指令的执行过程。
-w 设置等待远端主机回报的时间。
-x 开启或关闭数据包的正确性检验。
```

## 实例

### 最常用法
直接追踪路由

    traceroute ip_or_host

结果说明：

```
traceroute to 180.149.128.9 (180.149.128.9), 30 hops max, 32 byte packets
 1  209.17.118.3  0.30 ms  AS59253  Singapore, greenserver.io
 2  23.106.255.6  0.68 ms  AS59253  Singapore, leaseweb.com
 3  23.106.255.198  1.38 ms  AS59253  Singapore, leaseweb.com
 4  204.130.243.4  1.26 ms  *  United States
 5  154.54.45.193  178.34 ms  AS174  United States, California, Los Angeles, cogentco.com
 6  38.142.238.34  179.28 ms  AS174  United States, California, Los Angeles, cogentco.com
 7  202.97.59.141  334.31 ms  AS4134  China, Beijing, ChinaTelecom
 8  202.97.12.117  328.51 ms  AS4134  China, Beijing, ChinaTelecom
 9  *
10  *
11  *
12  180.149.128.9  342.12 ms  AS23724  China, Beijing, ChinaTelecom
```

序列号从 1 开始，每条纪录就是一跳，每一跳表示一个网关，每行有三个时间，单位都是 ms，其实就是 `-q` 的默认参数。探测数据包向每个网关发送三个数据包后，网关响应后返回的时间；如果您用 `traceroute -q 10 google.com` ，表示向每个网关发送 10 个数据包。

traceroute 一台主机有时会看到一些行以星号表示，出现这样的情况，可能是防火墙封掉了 ICMP 的返回信息，得不到什么相关的数据包返回数据。

有时在某一网关处延时比较长，可能是某台网关比较阻塞，也可能是物理设备本身的原因。当然如果某台 DNS 出现问题时，不能解析主机名、域名时，也会有延时长的现象；您可以加 `-n` 参数来避免 DNS 解析，以 IP 输出数据。

如果在局域网中的不同网段之间，可以通过 traceroute 来排查问题所在，是主机的问题还是网关的问题。如果通过远程来访问某台服务器遇到问题时，用到 traceroute 追踪数据包所经过的网关，提交 IDC 服务商，也有助于解决问题；但目前看来在国内解决这样的问题是比较困难的，即使发现问题，IDC 服务商也不可能帮助解决。

### 跳数设置

    traceroute -m 10 google.com

### 不解析主机名

    traceroute -n google.com

### 设置探测包数量

    traceroute -q 4 google.com

### 绕过正常的路由表直接发送到网络相连的主机

    traceroute -r douban.com

## 工作原理

traceroute 命令利用 ICMP 及 IP header 的 TTL(Time To Live) 字段 (field)。

- traceroute 送出一个 TTL 是 1 的 IP datagram 到目的地（每次送出的为 3 个 40 字节的包，包括源地址，目的地址和包发出的时间），当路径上的第一个路由器 (router) 收到这个 datagram 时，它将 TTL 减 1。此时，TTL 变为 0 了，所以该路由器会将此 datagram 丢掉，并送回一个「ICMP time exceeded」消息（包括发 IP 包的源地址，IP 包的所有内容及路由器的 IP 地址），traceroute 收到这个消息后，便知道这个路由器存在于这个路径上
- 接着 traceroute 再送出另一个 TTL 是 2 的 datagram，发现第 2 个路由器
- ......
- traceroute 每次将送出的 datagram 的 TTL 加 1 来发现另一个路由器，这个重复的动作一直持续到某个 datagram 抵达目的地。当 datagram 到达目的地后，该主机并不会送回 ICMP time exceeded 消息，因为它已是目的地了。
- traceroute 如何得知目的地到达了呢？traceroute 在送出 UDP datagrams 到目的地时，它所选择送达的 port number 是一个一般应用程序都不会用的端口 (30000 以上），所以当此 UDP datagram 到达目的地后该主机会回送一个 (ICMP port unreachable) 的消息，而当 traceroute 收到这个消息时，便知道目的地已经到达了。所以 traceroute 在 Server 端也是没有所谓的 Daemon 程式。

traceroute 提取发 ICMP TTL 到期消息设备的 IP 地址并作域名解析。每次 traceroute 都打印出一系列数据，包括所经过的路由设备的域名及 IP 地址，三个包每次来回所花时间。

