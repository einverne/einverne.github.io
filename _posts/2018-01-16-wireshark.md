---
layout: post
title: "又一款抓包分析软件 wireshark"
tagline: ""
description: ""
category: 学习笔记
tags: [wireshark, charles, mitmproxy, proxy,]
last_updated:
---

Wireshark 是一款网络分析工具，也是学习网络协议的工具，原先介绍过的 [Charles](/post/2016/11/android-http-proxy-debug.html) ，[mitmproxy](/post/2017/02/mitmproxy.html) 等 HTTP 抓包工具，都局限于 HTTP/HTTPS 请求，对于更底层的 TCP/IP，UDP 等协议就无能为力了。Wireshark 可以抓取网卡上的网络包，并实时展示，Wireshark 包括了过滤器，协议显示等等工具。

Wireshark 和其他工具的区别，比如 Charles，mitmproxy，Fiddler 等。Charles, mitmproxy，Fiddler 是专门用来捕获 HTTP，HTTPS 请求的。Wireshark 能获取 HTTP，也能获取 HTTPS，但是不能解密 HTTPS，所以 Wireshark 看不懂 HTTPS 中的内容。总结，如果是处理 HTTP,HTTPS 还是用 Charles, mitmproxy, Fiddler 等，其他协议比如 TCP,UDP,IP,ICMP 等就用 Wireshark

## 安装 {#install}

各大系统的安装文件：<https://www.wireshark.org/download.html>

Linux 下可以使用 PPA

    sudo add-apt-repository ppa:wireshark-dev/stable && sudo apt-get update
    sudo apt-get install wireshark

安装过程中选择 YES，让普通用户也能够抓包。

如果启动之后遇到

    couldn't run /usr/bin/dumpcap in child process: Permission Denied.

这样的问题，

    sudo dpkg-reconfigure wireshark-common

选择 “YES”， 将当前用户添加到 group

    sudo adduser $USER wireshark

然后再登出登入 [^q]

[^q]: https://askubuntu.com/a/778170/407870

## 简单使用

打开 Wireshark 就可以看到很多网络硬件可以选择，任选其中一块网卡就能够抓取经过这个网卡的所有流量包。常见的设备名字，或者网卡名字有这样几个：

- eth0 物理网卡，一般连接网线会获取到 IP 地址
- eth1 第二块网卡
- wlan0 是无线网卡，一般连接无线网会获取到 IP 地址
- lo 设备虚拟端口，自身回环，一般指向 127.0.0.1

还有一些设备名字可以参考之前的[文章](/post/2017/03/openwrt-settings-and-tips.html)。比如我笔记本使用无线网卡连接了 WIFI，那么进入 Wireshark 之后选择 `wlan0` 设备，自动进入抓包，可以看到经过无线网卡的所有请求包。

<a data-flickr-embed="true"  href="https://www.flickr.com/gp/einverne/6736b4" title="wireshark-windows"><img src="https://farm5.staticflickr.com/4625/25916169768_f83330e856_c.jpg" alt="wireshark-windows"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

Wireshark 的界面大致可以分成三个部分，最上面的部分为原始数据包预览，可以在该面板中看到抓取的包大致内容，包括序号，耗时，原始地址，目标地址，协议，长度，基本信息等等，分别使用不同的颜色标记了，这个颜色可以在设置 `View -> Coloring Rules` 中设置，根据不同的协议，或者自定义一些过滤规则，将关心的内容以不同的颜色标记出。

面板中间是封包详细信息 (Packet Details Pane)，这个面板是最重要的，用来查看协议中的每一个字段。各行信息分别为

- Frame:   物理层的数据帧概况
- Ethernet II: 数据链路层以太网帧头部信息
- Internet Protocol Version 4: 互联网层 IP 包头部信息
- Transmission Control Protocol:  传输层 T 的数据段头部信息，此处是 TCP
- Hypertext Transfer Protocol:  应用层的信息，此处是 HTTP 协议

面板最下面一栏是数据包真正传输的内容，以十六进制和 ASCII 显示出来。

## 过滤器

https://wiki.wireshark.org/CaptureFilters

两种过滤器的目的是不同的。

捕捉过滤器（CaptureFilters）：用于决定将什么样的信息记录在捕捉结果中。需要在开始捕捉前设置。捕捉过滤器是数据经过的第一层过滤器，它用于控制捕捉数据的数量，以避免产生过大的日志文件。

显示过滤器（DisplayFilters）：在捕捉结果中进行详细查找。他们可以在得到捕捉结果后随意修改。显示过滤器是一种更为强大（复杂）的过滤器。它允许您在日志文件中迅速准确地找到所需要的记录。

两种过滤器使用的语法是完全不同的。

http://openmaniak.com/cn/wireshark_filters.php

## 三次握手

Wireshark 实际分析下三次握手的过程

在 wireshark 中输入 http 过滤， 然后选中 GET /tankxiao HTTP/1.1 的那条记录，右键然后点击"Follow TCP Stream",

这样做的目的是为了得到与浏览器打开网站相关的数据包

可以看到 wireshark 截获到了三次握手的三个数据包。第四个包才是 HTTP 的， 这说明 HTTP 的确是使用 TCP 建立连接的。

第一次握手数据包

客户端发送一个 TCP，标志位为 SYN，序列号为 0， 代表客户端请求建立连接。

第二次握手的数据包

服务器发回确认包，标志位为 SYN,ACK. 将确认序号 (Acknowledgement Number) 设置为客户的 ISN 加 1 以. 即 0+1=1

第三次握手的数据包

客户端再次发送确认包 (ACK) SYN 标志位为 0,ACK 标志位为 1. 并且把服务器发来 ACK 的序号字段 +1, 放在确定字段中发送给对方. 并且在数据段放写 ISN 的 +1

