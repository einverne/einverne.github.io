---
layout: post
title: "斐讯 k2p 刷机"
tagline: ""
description: ""
category: 经验总结
tags: [k2p, 路由器 , router, openwrt, linux, phicomm]
last_updated: 
---

以前也整理过一篇 [TP LINK MR12U 刷 Openwrt](/post/2017/03/tp-link-mr12u-flash-openwrt.html) ，路由器刷机和手机刷机异曲同工。不过刷机需谨慎，稍有错误就有可能导致硬件损坏。前些时候入手了一个斐讯的 K2P，


大致分为几步，第一步开启 telnet，刷入 uboot，然后通过 uboot 刷入新固件。

因为新版本固件 V22.7.8.2版本及之后 需要使用 [特殊工具](http://www.right.com.cn/forum/thread-261028-1-3.html) 才能开启 telnet ，所以先要使用这个工具来开启 telnet。然后再使用 [a大](http://www.right.com.cn/forum/thread-221578-1-1.html) 的脚本安装 breed。

Opboot 及 Breed进入方法：

如果你当前是官改或其他第三方固件，请在opboot或breed输入：

1. 计算机设置为自动获取IP，计算机网线连接K2P的任一LAN口
2. K2P断电，按住K2P复位键，K2P开电，按住10秒后放开
3. 访问<http://192.168.1.1>，可刷入K2P的任何版本
4. 重新启动后建议K2P恢复一次出厂设置；



### 官改版本 

地址： <http://www.right.com.cn/forum/thread-221578-1-1.html>

官改版本比较稳定，占用内存小，同时也带去广告，SS/SSR，内网穿透等等功能

### 潘多拉固件

地址： <http://www.right.com.cn/forum/thread-216468-1-1.html>

潘多拉版本，同时也支持 SS/SSR，去广告，定时重启等等功能

### 梅林固件 

地址： <http://www.right.com.cn/forum/thread-255053-1-1.html>

- 支持adbyby及koolproxy广告屏蔽
- 支持最新版本ss及S-S R客户端
- 支持webshell、kms、ngrok内网穿透、wol网络唤醒
- 支持ssh、用户脚本、硬盘休眠、指示灯控制等

### Openwrt 固件 

地址： <http://www.right.com.cn/forum/thread-240730-1-1.html>

K2P基于openwrt最新稳定版chaos_calmer的固件


### Padavan

荒野无灯 <http://www.right.com.cn/forum/thread-218704-1-1.html> 这个固件和原版固件的性能对比可以参考这一篇 <http://www.acwifi.net/3173.html>

下载地址：<http://files.80x86.io/router/rom/K2P/>


k2p 全套其他的固件，可以参考这个帖子 <http://www.right.com.cn/forum/thread-254947-1-1.html>

最后总结下，其实大部分的教程都能在恩山找到，在斐讯的论坛里面，找精华贴，能过滤很多杂乱的信息。并且通过 Google 关键词搜索也能够很快的找到答案。
