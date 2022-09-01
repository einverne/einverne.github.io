---
layout: post
title: "Netdata outbound_packets_dropped_ratio 告警"
aliases:
- "Netdata outbound_packets_dropped_ratio 告警"
tagline: ""
description: ""
category: 经验总结
tags: [ netdata, monitor, vps, network, ]
create_time: 2022-08-26 10:05:47
last_updated: 2022-08-26 10:05:47
---

一直使用 [Netdata](/post/2018/02/netdata.html) 来作为 VPS 的监控，配合 [Netdata Cloud](/post/2021/06/netdata-cloud.html) 来作为监控面板体验一直都不错。不过最近有一台机器经常发送邮件告警：

> outbound_packets_dropped_ratio

看这个告警一头雾水，虽然每个词都懂，但就是不知道表示的什么含义。所以搜罗各种资料学习一下。

## 什么是 outbound packets dropped ratio
详细的解释 Netdata 也给了出来：

> Details: ratio of outbound dropped packets for the network interface venet0 over the last 10 minutes

过去 10 分钟内网卡 venet0 出站的流量丢包率。

那具体什么是 dropped packets 呢？在 Linux 下有很多原因会出现丢包，有可能是网络不稳提，或者网络拥堵，或者应用无法处理负载。

## Linux 下显示网络接口的 dropped packet

```
❯ sudo netstat -i
Kernel Interface table
Iface      MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
br-c834d  1500  7024713      0      0 0       5439423      0      0      0 BMU
br-f28aa  1500   446015      0      0 0       7656772      0      0      0 BMRU
br-f50ea  1500  5779300      0      0 0       6093954      0      0      0 BMRU
docker0   1500        0      0      0 0             0      0      0      0 BMU
lo       65536 38808638      0      0 0      38808638      0      0      0 LRU
venet0    1500 78213871      0      0 0      114697804      0  25737      0 BOPRU
venet0:0  1500      - no statistics available -                        BOPRU
vethd37c  1500   151555      0      0 0        209478      0      0      0 BMRU
vethe8b7  1500     8254      0      0 0        134561      0      0      0 BMRU
```

可以看到图中 `venet0` 这块网卡在 `TX-DRP` 上确实是有一定的丢包。

显示网卡的统计信息：

```
netstat -s
# 显示 tcp
netstat -s -t
# 显示 udp
netstat -s -u
```

`netstat -s` 的结果

```
Ip:
    Forwarding: 1          //开启转发
    31 total packets received    //总收包数
    0 forwarded            //转发包数
    0 incoming packets discarded  //接收丢包数
    25 incoming packets delivered  //接收的数据包数
    15 requests sent out      //发出的数据包数
Icmp:
    0 ICMP messages received    //收到的ICMP包数
    0 input ICMP message failed    //收到ICMP失败数
    ICMP input histogram:
    0 ICMP messages sent      //ICMP发送数
    0 ICMP messages failed      //ICMP失败数
    ICMP output histogram:
Tcp:
    0 active connection openings  //主动连接数
    0 passive connection openings  //被动连接数
    11 failed connection attempts  //失败连接尝试数
    0 connection resets received  //接收的连接重置数
    0 connections established    //建立连接数
    25 segments received      //已接收报文数
    21 segments sent out      //已发送报文数
    4 segments retransmitted    //重传报文数
    0 bad segments received      //错误报文数
    0 resets sent          //发出的连接重置数
Udp:
    0 packets received
    ...
TcpExt:
    11 resets received for embryonic SYN_RECV sockets  //半连接重置数
    0 packet headers predicted
    TCPTimeouts: 7    //超时数
    TCPSynRetrans: 4  //SYN重传数
```

或者可以使用 `ip` 命令：

```
❯ ip -s link show venet0
2: venet0: <BROADCAST,POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN mode DEFAULT group default 
    link/void 
    RX: bytes  packets  errors  dropped overrun mcast   
    30619319736 78217051 0       0       0       0       
    TX: bytes  packets  errors  dropped carrier collsns 
    32292008558 114701118 0       25738   0       0       
```


## Why does linux drop packets?

为了找出 Linux 服务器为什么 drop packets 可以借助 [dropwatch](https://github.com/nhorman/dropwatch)。这个工具可以用来诊断 Linux networking stack 的问题，主要是查看协议栈丢包问题。

### dropwatch

安装必要的工具：

```
sudo apt-get install libpcap-dev libnl-3-dev libnl-genl-3-dev binutils-dev libreadline6-dev autoconf libtool pkg-config build-essential
```

安装完之后执行 `libtoolize`，这会拷贝，连接必要的脚本，包括 `ltmain.sh` 。

然后手动编译：

```
git clone https://github.com/nhorman/dropwatch
cd dropwatch
./autogen.sh
./configure
make
make install
```

## 如何修改告警策略

因为我是用 docker 安装，所以需要进入 netdata 容器：

```
docker exec -it netdata /bin/sh
```

然后执行：
```
/etc/netdata/edit-config health.d/net.conf
```

其中的第 107 行即可。


## reference

- <https://www.cyberciti.biz/faq/linux-show-dropped-packets-per-interface-command/>