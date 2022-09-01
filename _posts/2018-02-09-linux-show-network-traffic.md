---
layout: post
title: "Linux 下显示网络流量"
aliases: "Linux 下显示网络流量"
tagline: ""
description: ""
category: 整理合集
tags: [linux, command, network, iftop, bmon]
last_updated: 
---

Linux 下查看网络流量的命令有很多，[之前](/post/2017/07/use-nethogs-to-check-network-traffic-per-process.html) 也介绍过使用 `nethogs` 来按照进程查看网络流量。但其实 Linux 下有很多命令同样可以达到效果。


## 总体带宽使用

### bmon
使用 `apt install bmon` 安装，使用非常简单直接运行即可。

`bmon` 的介绍说是一个网络监控和调试工具，能够提供一个可视化的界面。

其他还有 nload, slrum, speedometer, netload

## 套接字连接带宽使用
常用的有 iftop，iptraf

iftop 使用 pcap 库来捕获进出网络适配器的数据包，然后汇报总数据包大小和数量。iftop 报告每一个连接所使用的带宽，但是没有办法报告进程名和编号。使用 `iftop` 时如果系统包含多个网络接口可能需要指定监控的接口 `sudo iftop -i eth0`，类似 top 命令，`iftop` 可以在运行时改变显示：

- `h` 帮助
- `n` 是否解析域名
- `s` 是否显示源地址
- `d` 是否显示目标地址
- `S` 是否显示端口号


### iptraf
iptraf 是一款交互式的网络监控工具，它可以显示每个连接和主机之间的传输数据。按连接/端口查看流量。

### ifstat

ifstat: 按设备查看流量

## ethtool

[[ethtool]]: 诊断工具

## ss

ss: 连接查看工具


