---
layout: post
title: "SD 卡种类和标示"
tagline: ""
description: ""
category: 经验总结
tags: [sdcard, sd, tf, ]
last_updated:
---

如果注意观察 SD 卡面上的内容就会发现上面有很多标签，除开 SD 的品牌，可能还会看见，micro，I， U，等等标识，这些标识都不是厂家随意标注的，每一个都有其特殊的含义。了解这些特殊的标示之后对 SD 卡的选购也有一定的便捷。

## microSD vs SD 卡
microSD 卡和 SD 卡的区别其实不用太多交代，基本上从大小就能看出区别。因为体积的区别，所以 microSD 卡经常用于便携，小型设备，比如手机，行车记录仪，运动相机等设备中，而大的 SD 卡则会用于单反等设备。

## SD vs SDHC vs SDXC

- SD 卡，Secure Digital Memory Card，安全数字存储卡，SD 1.0 标准，由日本 Panasonic、TOSHIBA 及美国 SanDisk 公司于 1999 年 8 月共同开发研制
- SDHC，Secure Digital High Capacity，高容量 SD 存储卡，SD 2.0 标准，2006 年 5 月 SD 协会发布了 SD 2.0 的系统规范，并在其中规定 SDHC 是符合该规范，SDHC 存储卡容量为：4GB--32GB
- SDXC，SD eXtended Capacity，容量扩大化的安全存储卡，新一代 SD 存储卡标准，SD 3.0 标准，旨在大幅提高内存卡界面速度及存储容量，SDXC 存储卡的目前最大容量可达 512GB，理论上最高容量能达到 2TB

SD 卡标示   |   SD          | SDHC          | SDXC
------------|---------------|---------------|---------------
容量        | 上限 2G       | 2GB - 32 GB   | 32G - 2T
格式        | FAT 12, 16    | FAT 32        | exFAT

可以看到其实我们平时所说的 SD 卡一直在发展，不管是容量还是速度。

## 速度等级
在一些稍微老一些的卡上还可能看到 class 2, class 4, class 6, class 10 这样的标识，新一代的 SD 卡会以一个圆圈中间写一个 10 数字来标识 class 10，这个标识表示的是 SD 卡的速度等级。在 2006 年制定 SD 2.0 标准的时候引入了 Class2、Class4、Class6、Class10 级别。

这个 Class 等级，基本上可以理解为 class 10 是 10M/s 的写入速度。


但其实这个级别现在来看又已经过时了，所以现在在 2019 年又会看到 UHS-I，UHS-II，这样的标识，在卡面上会简写成 I，或者 II 这样，这就是 UHS 速度等级。也经常会在旁边看到英文字幕 U 中间写 1 或者 3 这样的标识，这代表着两种不同的速度等级，U1 = 10M/s， U3 = 30M/s.

UHS 速度等级 1 和 3 则是被设计用于 UHS 总线界面，“U1”和“U3”代表的是 UHS 接口规范下的写入速度标准，U1 表示 UHS Class 1，最低写入速度 10MB/s，U3 表示 UHS Class 3，最低写入速度 30MB/s。为了区分 Speed Class 的 Class 2，UHS Class 并没有设置 U2 等级，目前仅有 U1 和 U3，下一个等级也将是 U5。

另外还有一个视频速度等级，会标识成 V6,V10,V30,V60,V90 这样。V 后面的数字和简单的理解成 SD 卡的写入速度，比如 V90 ，就可以理解成写入速度 90M/s .

最低写入速度	| Class 写入速度等級标示	| UHS Speed Class 速度	| Video Speed Class	| 建议使用环境
----------------|---------------------------|-----------------------|-------------------|-------------------------
2 MB/s          | C2                        |                       |                   | 720p
4 MB/s          | C4                        |                       |                   | 高画质拍摄
6 MB/s          | C6                        |                       | V6                | 高画质拍摄
10 MB/s         | C10                       | U1                    | V10               | 1080p Full HD
30 MB/s         |                           | U3                    | V30               | 4K Video 60/120 fps
60 MB/s         |                           |                       | V60               | 8K Video 60/120 fps
90 MB/s         |                           |                       | V90               | 8K Video 60/120 fps


![sdcard speed](/assets/sdcard-speed.jpg)








