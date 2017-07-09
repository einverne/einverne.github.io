---
layout: post
title: "使用 nethogs 查看每个进程流量"
tagline: ""
description: ""
category: Linux
tags: [Linux, nethogs, network, ]
last_updated: 
---

在 Linux 上查看系统流量有很多命令，平时一直使用 iftop 来查看单块网卡或者系统整体的流量，iftop 可以查看 TCP 链接的流量情况，分析出流量连往的 IP 地址。但是 iftop 无法做到查看系统中单个进程的网络流量情况。所以 Google 一下之后发现了 nethogs 。

nethogs 自己的介绍

> NetHogs is a small 'net top' tool. Instead of breaking the traffic down per protocol or per subnet, like most such tools do,  it  groups  bandwidth  by  process - and does not rely on a special kernel module to be loaded. So if there's suddenly a lot of network traffic, you can fire up  NetHogs and immediately see which PID is causing this, and if it's some kind of spinning process, kill it.

看介绍就能很快速的知道 nethogs 的设计用途，他就是为了查看单独进程流量情况而被创造出来的。

## Install

在 Debian/Ubuntu 下，`sudo apt-get install nethogs` 官方源的中 nethogs 因为版本过老，可能会有一些问题，不过可以先尝试安装一下。如果启动 `sudo nethogs` 之后发现有 

> creating socket failed while establishing local IP - are you root?

这样的错误。(PS: 这个错误已经在 [0.8.1](https://github.com/raboof/nethogs/issues/9) 中被解决)请使用编译安装。

	wget -c https://github.com/raboof/nethogs/archive/v0.8.5.tar.gz
	tar xf v0.8.5.tar.gz 
	cd ./nethogs-0.8.5/

安装必要的依赖，编译安装

	sudo apt-get install libncurses5-dev libpcap-dev
	make && sudo make install 

检查版本并启动

	nethogs -V
	sudo nethogs

## Usage

使用就非常简单了，直接运行就能查看结果.

	~# nethogs
	NetHogs version 0.8.5
	 
	  PID USER     PROGRAM                      DEV        SENT      RECEIVED
	2214  root     /usr/lib/apt/methods/http    eth0       4.693     238.631 KB/sec
	2051  ubuntu   sshd: ubuntu@pts/1           eth0       3.442       0.310 KB/sec
	1120  ubuntu   sshd: ubuntu@pts/0           eth0       0.416       0.035 KB/sec
	2213  root     /usr/lib/apt/methods/http    eth0       0.021       0.023 KB/sec
	?     root     unknown TCP                             0.000       0.000 KB/sec
	 
	  TOTAL                                                8.572     239.000 KB/sec


## reference

- <https://askubuntu.com/questions/726601>
- <http://www.slashroot.in/find-network-traffic-and-bandwidth-usage-process-linux>

