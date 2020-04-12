---
title: Nexus 5 不同版本
layout: post
category: 经验总结
tagline: ""
tags: [android, nexus, google, lg]
redirect_from: "/post/2014/11/different-version-Nexus-5.html"
---

要给哥弄个 Nexus 5，网上一查有美版的 D820，还有国际版的 D821。顺手做个笔记**LG D820** VS **LG D821**。两个版本的 LG Nexus 5 在几乎所有的配置和外观上都没有任何的区别，主要区别在通讯模块上，一个支持 GSM/CDMA/WCDMA/LTE，而另外一个不支持 CDMA，具体的支持情况外媒梳理如下：

##北美 Nexus 5 版本 (LG D820):
* GSM: 850/900/1800/1900 MHz
* CDMA: Band Class: 0/1/10（这个频段是中国电信也支持的，其实大多数有 CDMA 的国家都在这个频段范围内，所以是支持所有 CDMA 频段的）
* WCDMA: Bands: 1/2/4/5/6/8/19
* LTE: Bands: 1/2/4/5/17/19/25/26/41

##Nexus 5 国际版本，没有 CDMA (LG D821):
* GSM: 850/900/1800/1900 MHz
* WCDMA: Bands: 1/2/4/5/6/8
* LTE: Bands: 1/3/5/7/8/20

D820 能够兼容 AT&T、T-Mobile 和 Sprint 的 2G、3G 和 LTE 网络；而 D821 则可兼容欧洲、亚洲等其余地区的网络频段。

D820 美版需要破解才能电信 4G，D821 支持联通 4G，中国移动所使用的是特有的频段，不支持

##D820(H)、D820(E)、D820(S) 区别

D820(H)、D820(E)、D820(S) 三者其实硬件都是一样的，就是 RAM 颗粒使用得不一样而已。 D820(H) 是 Skhynix（海力士）的 RAM 颗粒，D820(E) 是 Elpida（尔必达）的 RAM 颗粒，D820(S) 是 Samsung（三星）的 RAM 颗粒。查了下 LG 的内部资料，貌似 D820(S) 故障率最高，无故黑砖的同学警惕是否买到 D820(S) 的机器~

查看 D820(H)、D820(E)、D820(S) 方法~关机后，按音量“-”以及开机键同时开机，然后进 bootloader 查看~

参考：
- [http://www.androidcentral.com/nexus-5-models-whats-different-between-two](http://www.androidcentral.com/nexus-5-models-whats-different-between-two)
