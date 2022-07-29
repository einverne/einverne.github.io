---
layout: post
title: "每天学习一个命令：通过 arp 学习地址解析协议"
aliases:
- "每天学习一个命令：通过 arp 学习地址解析协议"
tagline: ""
description: ""
category: 学习笔记
tags: [ linux, arp, ip, ipv4,  ]
create_time: 2022-07-27 11:37:28
last_updated: 2022-07-27 11:37:28
---

ARP( Address Resolution Protocol) 地址解析解析，用来将 IP 地址解析为 MAC 地址的协议。

主机会维护一张 ARP 表，存储 IP 地址和 MAC 地址映射关系。

# arp
直接执行 `arp` 会列出系统当前的 arp 记录：

```
arp
Address                  HWtype  HWaddress           Flags Mask            Iface
10.236.151.50            ether   50:9a:4c:2d:--:--   C                     eth0
172.17.0.2               ether   02:42:ac:11:00:02   C                     docker0
10.236.151.83            ether   ac:87:a3:17:72:26   C                     eth0
172.25.0.2               ether   02:42:ac:19:00:02   C                     br-8ff872eb50bd
```

如果有多张网卡，可以使用 `-i` 指定网卡：

```
arp -i eth0
```

使用 `-a` 参数使用 BSD 风格输出：

``` bash
$ arp -a
? (10.236.151.19) at 50:9a:4c:2d:--:-- [ether] on eth0
? (10.236.151.200) at e4:54:e8:cd:--:-- [ether] on eth0
```

删除 ARP 记录，可以使用 `-d` 参数：

```
sudo arp -d 192.168.0.1
```

删除之后 ARP 记录就会显示为 incomplete。

添加 ARP 记录：

```
sudo arp -s 192.168.0.1 12:34:56:78:90:ab
```

如果要批量添加，可以从文件中读取添加，可以先准备好一个文件，然后其中添加 IP 和 MAC 地址：

```
192.168.0.201 11:22:33:44:55:66
192.168.0.202 12:23:34:45:56:67
```

最后使用 `-f` 参数：

```
sudo arp -f arp_list.txt
```
