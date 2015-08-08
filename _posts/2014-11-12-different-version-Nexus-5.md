---
title: Nexus 5 不同版本
layout: post
category: 经验总结
tagline: ""
tags: [Android, Nexus, Google, LG]
---

要给哥弄个Nexus 5，网上一查有美版的D820，还有国际版的D821。顺手做个笔记**LG D820** VS **LG D821**。两个版本的LG Nexus 5在几乎所有的配置和外观上都没有任何的区别，主要区别在通讯模块上，一个支持GSM/CDMA/WCDMA/LTE，而另外一个不支持CDMA，具体的支持情况外媒梳理如下：

##北美Nexus 5版本 (LG D820):
* GSM: 850/900/1800/1900 MHz
* CDMA: Band Class: 0/1/10（这个频段是中国电信也支持的，其实大多数有CDMA的国家都在这个频段范围内，所以是支持所有CDMA频段的）
* WCDMA: Bands: 1/2/4/5/6/8/19
* LTE: Bands: 1/2/4/5/17/19/25/26/41

##Nexus 5国际版本，没有CDMA (LG D821):
* GSM: 850/900/1800/1900 MHz
* WCDMA: Bands: 1/2/4/5/6/8
* LTE: Bands: 1/3/5/7/8/20

D820能够兼容AT&T、T-Mobile和Sprint的2G、3G和LTE网络；而D821则可兼容欧洲、亚洲等其余地区的网络频段。

D820美版需要破解才能电信4G，D821支持联通4G，中国移动所使用的是特有的频段，不支持

##D820(H)、D820(E)、D820(S)区别

D820(H)、D820(E)、D820(S)三者其实硬件都是一样的，就是RAM颗粒使用得不一样而已。 D820(H)是Skhynix（海力士）的RAM颗粒，D820(E)是Elpida（尔必达）的RAM颗粒，D820(S)是Samsung（三星）的RAM颗粒。查了下LG的内部资料，貌似D820(S)故障率最高，无故黑砖的同学警惕是否买到D820(S)的机器~

查看D820(H)、D820(E)、D820(S)方法~关机后，按音量“-”以及开机键同时开机，然后进bootloader查看~

参考:
- [http://www.androidcentral.com/nexus-5-models-whats-different-between-two](http://www.androidcentral.com/nexus-5-models-whats-different-between-two)
