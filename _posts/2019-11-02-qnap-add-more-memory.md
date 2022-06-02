---
layout: post
title: "威联通折腾篇十六：加内存"
aliases: "威联通折腾篇十六：加内存"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, memory, ]
last_updated:
---

最近发现威联通 TS-453Bmini 在安装服务比较多的情况下内存有些吃紧，默认的 4G 内存已经不够，日常使用开机就已经要到瓶颈，所以就不得不升级一下。网上简单的查了一下低电压版 DDR3L 1600 的内存即可，所以看到京东有十铨的有卖，所以就趁着打折买了两条 8G，119 一条也不是很贵。

具体型号：十铨低电压（1.35V） DDR3 1600 8G 笔记本内存 X2

![qnap ram not enough](/assets/qnap-ram-not-enough.png)

具体更换过程还是挺简单的，Ts-453b mini 的设计也非常简单，关机，断电，然后在机器底部有可拆卸的盖子，打开盖子就能看到非常清晰的内存条插槽，然后换入新入的内存条即可。

具体可以参考[这里](https://paulsrepo.gitbooks.io/qnap-nas-hardware-user-manual/en/05%20-%20Upgrade%20Memory%20on%20QNAP%20Turbo%20NAS/05%20-%20Upgrade%20Memory%20on%20QNAP%20Turbo%20NAS.html)

## reference

- [更新系统时注意备份和还原系统设置](https://www.qnap.com/zh-cn/how-to/tutorial/article/ 如何更新 -qnap-nas- 的韧体)
