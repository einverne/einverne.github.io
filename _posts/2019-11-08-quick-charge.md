---
layout: post
title: "快充协议笔记"
tagline: ""
description: ""
category: 经验总结
tags: [quick-charge, android, usb, type-c, phone, ios, iphone, ]
last_updated:
---

中文里面的快充，其实对应着很多个英文单次，Quick Charge, fast charge, dash charge, USB PD(USB Power Delivery), Dual charge, 这些许许多多的名词，在中文的语境中都被叫做快充其实是不太准确的。虽然都叫快充，但是其实各个设备厂商都有各自自己的实现，目前市场上比较常见的快充实现是 QC，PD。

## 快充区别和历史
追溯快充的历史，可以追到高通的芯片，一般被用来给移动设备芯片供电。通常意义上所讲的快充是指的，通过 USB 标准，提供 5V，2A 的充电技术。

不过不同厂家都有自己的专有技术，比如联科发的 Pump Express， OPPO 的 [VOOC](https://en.wikipedia.org/wiki/VOOC) 以及华为的 SuperCharge.

### QC
我们通常所讲的 QC 快充其实是高通的一套快充解决方案，一般搭载高通处理芯片的移动设备会用到该快充技术。

Quick Charge 也有其自身的发展，从 Quick Charge 2.0，到 3.0，到随着 Snapdragon 835 发布的 4.0，再到目前的 4+，维基百科有非常完整 QC 快充发展历史 [^qc]。

![qc history](/assets/quick-charge-qc-4-history.jpg)

### PD
这里的 PD 快充指的是 USB 联盟制定的快充规范，不仅可以用于手机，还可以用于 PC，相机，显示器等等设备。PD 协议的出现也是一定程度上缓解市面上的各种不同快充协议。不过 PD 快充一定需要通过 USB Type-C 接口。使用 PD 快充，最高可达到 100W (20V * 2A). 充电装置和充电器会自动判断用多大的电流充电。高通在 QC4.0 后使用了 USB PD 规则，理论上 QC4.0 快充装置也能支持 USB PD 快充。

### VOOC
这是 OPPO 的快充专有技术，授权给 OnePlus 叫做 Dash Charge，或者又叫做 Warp Charge. OPPO 算是市面上研究充电技术比较早的公司，14 年推出 VOOC 闪充，18 年商用 SuperVOOC 超级闪充，而后者是目前最快的手机充电技术。

SuperVOOC 充电规格，通过 10V/5A 高电压，大电流方式，充电功率可以达到 50W，充电 10 分钟可以得到 40% 电量。

而一加的 Warp 充电，使用 5V/6A 大电流。

### SuperCharge
这是华为用来给麒麟芯片提供快充的技术。

## 快充实现原理
不同厂家的快充技术听名字可能会非常困惑，但追溯到原理无非就是：

- 提高充电电压
- 加大电流
- 或者同时提高电压和电流

具体的实现原理，本人也不是硬件设计出身，所以具体内容也就不好展开了。

## 充电头和充电线
对于快充技术，一般情况下都是需要电源适配器和充电线搭配使用才能发挥最佳，使用普通充电线可能并不能达到快充效果。

这里有个小技巧，在电源适配上，除了一般的电压和电流标识，如果支持 QC 快充，一般在适配器 LOGO 中会显示一个 QC 的 LOGO（上面图中右上角的标识），一般也会标注快充的版本。

所以最理想的状态就是等 N 年过去，大家可以不再纠结什么快充协议，一个 PD 充电适配器，适配所有的设备，不管是手机，电脑，相机还是显示器。但显然要等待的时间还有些漫长。

### reference

- <https://en.wikipedia.org/wiki/Quick_Charge>


[^qc]: <https://en.wikipedia.org/wiki/Quick_Charge>
