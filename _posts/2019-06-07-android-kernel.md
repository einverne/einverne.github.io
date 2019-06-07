---
layout: post
title: "Android Kernel"
tagline: ""
description: ""
category: 学习笔记
tags: [android, kernel, linux-kernel, aosp, ]
last_updated:
---

说到 [Android Kernel](https://source.android.com/devices/architecture/kernel) 那就不得不说到 Linux Kernel，Android Kernel 基于 Linux Kernel 的[长期稳定版本](https://kernelnewbies.org/DevelopmentStatistics)，

## Linux Kernel
首先 Linux Kernel 是什么？ Linux Kernel 是在 GNU GPL v2 开源许可下开源的硬件底层驱动，包括了 CPU 调度，存储管理，IO 管理，等等。Linux Kernel 是 GPL 开源，所以为了适用移动设备内存，CPU 频率，耗电等特点，Google 将这部分 Linux Kernel 做了修改，并按照 GPL 将修改开源了。

> The kernel has complete control over the system.

Android 最早的内核是基于 Linux 2.6 内核的，在很长一段时间内，Android 的 Kernel 一直使用非常老版本的 Linux Kernel，但是随着时间发展，渐渐的每一个版本的 Android 发布都再使用最新的 Linux Kernel [^1].

[^1]: <https://en.wikipedia.org/wiki/Android_version_history>

## Android Kernel
回到 Android Kernel，不同设别出厂的时候就会带一个 stock 官方的 kernel，当然这个 Kernel 是稳定可以用于日常使用的。但是有些官方优化的 Kernel 并没有发挥硬件的最佳，所以 xda 上就有很多人发布不同的 Kernel，可以支持一些电池的优化，或者对硬件一些更好的支持。

### ElementalX
ElementalX 内核是一个我从 Nexus 6, OnePlus 3 开始就使用过的 Kernel，由 [flar2](https://forum.xda-developers.com/member.php?u=4684315) 开发。

ElementalX 内核的突出特点就是稳定，在不牺牲稳定性的前提下对系统做一些优化，比如滑动手势，亮度模式，震动模式，声音控制，文件系统格式等等。

个人使用的情况也是非常稳定，没有遇到过任何硬件不兼容问题。

- <https://elementalx.org/devices/>

### Franco Kernel
Franco Kernel 由 [franciscofranco](https://forum.xda-developers.com/member.php?u=3292224) 开发，是非常著名的一个 Kernel，支持非常多的设备。

- <https://kernels.franco-lnx.net/>

### blu_spark
blu_spark kernel 由 [eng.stk](https://forum.xda-developers.com/member.php?u=3873953) 开发。

更多的 kernel 可以查阅[这里](https://www.xda-developers.com/most-popular-custom-kernels-for-android/)

## reference

- <https://android.googlesource.com/kernel/>
- <https://source.android.com/devices/architecture/kernel/releases.html>
- <https://www.xda-developers.com/most-popular-custom-kernels-for-android/>
