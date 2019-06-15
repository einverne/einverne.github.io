---
layout: post
title: "Magisk 模块整理 For OnePlus 7 Pro"
tagline: ""
description: ""
category: 经验总结
tags: [magisk, root, android, android-dev, adb, adaway, youtube, exposed ]
last_updated:
---

Magisk 通过修改启动（Boot）文件，在开机时加载 Magisk 框架，“不修改实际的系统文件”而“达到修改系统的效果”.

Magisk 在数据（非系统）分区里放置了一些修改好的系统文件 / 程序，系统启动时会加载这些修改过的文件 / 程序，而不是系统本身的文件，这样系统本身的文件并没有被实际修改，

Magisk 的另一大功能就是获取 Root 权限 / 授权（Root）管理（MagiskSU）了，在原本的 SuperSu 被国内厂家收购后就失去了大部分的支持，所以现在 ROOT 基本通过 Magisk 来实现了。

Magisk 的另一个用处是帮助系统通过各种检测系统安全 / 完整性的测试。部分应用游戏 和 Google 的 SafetyNet 检测（用于 Google Pay 等）会检测 Root 权限 / 系统文件是否被修改，Magisk 的 Magisk 隐藏（Magisk Hide）功能可以让它们无法检测到 Magisk 的存在，你便可以在正常使用这些应用 / 游戏 / 功能的同时享受 Magisk 带来的便捷。Magisk Hide 功能也能解决 Magisk 和一些软件的冲突。

和 Magisk 不同， Xposed 通过劫持系统文件，使得所有程序启动时都会被注入 Xposed 的进程，这样 Xposed 模块就可以通过这些进程对程序进行系统层面的几乎任何修改。Magisk 除了 Magisk Hide 功能，再无单个应用级别的操作，同时在开机后也几乎无法再对系统 / 应用进行修改，所以 Xposed 所能实现的绝大多数功能，Magisk 都无法完美实现。

所以这篇文章就暂时先列举一些好用的 Magisk 模块，Xposed 和 EdXposed 模块另外写总结。

## Magisk Manager for Recovery Mode (mm)
这个 Module 可以让我们在 Recovery （比如 TWRP） 下修改 Magisk 的设置

使用方法：

- 在终端中执行 `sh /sdcard/mm`
- 或者在 Recovery 模式终端下执行 `sh /sdcard/mm`

## Riru - Core
Riru 模块进入应用进程或系统服务进程并执行他们的代码

- <https://github.com/RikkaApps/Riru>


## Riru - EdXposed
Android Pie 无法使用原版的 Xposed 所以有了 EdXposed 。

## Busybox for Android NDK
BusyBox 是标准 Linux 工具的一个单个可执行实现，简单的说 BusyBox 就好像是个大工具箱，它集成压缩了 Linux 的许多工具和命令。

- <https://github.com/Magisk-Modules-Repo/busybox-ndk>
- <https://forum.xda-developers.com/showpost.php?p=64228091>

## Wifi Bonding (Qualcomm)
在高通设备上以 40MHz 的运行的 2.4GHz / 5.0GHz 的无线网络连接。在使用该 Module 之前需要了解什么是 Channel bonding，简单来说 Channel bonding 就是使用多于一条的通道来传输数据。

但说实话个人感觉提升并不明显。具体数据可以看下方。

Before
![oneplus 7 pro wifi bonding before](/assets/magisk/Screenshot_oneplus_7_pro_wifi_bonding_before-142850.jpg)

After
![oneplus 7 pro wifi bonding after](/assets/magisk/Screenshot_oneplus_7_pro_wifi_bonding_after-143650.jpg)

- <https://github.com/Magisk-Modules-Repo/wifi-bonding>

## Riru - Location Report Enabler
一直都是使用 Market Unlocker 来虚拟运营商来开启 Google Location 的，但是每次 Market Unlocker 都需要手动启用一下，换成这个开机启动即可。

## 其他模块

### Energized Protection
去广告模块，本人尝试后，误杀率挺大的，所以暂时先禁用。

### Greenify4Magisk
似乎在 Pie 上系统自带的后台管理已经很强大，绿色守护也不怎么用了。

### NFS-INJECTOR
内核优化，知识体系还没有深入到这里，暂时不安装。

### App Systemizer
把系统应用转成系统应用，需要借助终端，下载 Termux 或者 Terminal Emulator

- `su` 获取 root 权限
- 输入 `systemize` 进入设置

## 编写 Magisk 模块
从模板克隆一份

- <https://github.com/topjohnwu/magisk-module-template>

各个目录解释：

- META-INF: 刷机包签名 / 脚本文件，通常不动
- common/post-fs-data.sh、common/service.sh：开机时执行的脚本文件，通常不动
- common/system.prop: Build.prop 文件
- system: 将需要替换的系统文件（空文件（夹）也可）按照位置放置即可
- config.sh: 模块设置和安装 / 刷入时使用 ui_print 命令显示的提示信息
- module.prop: 模块信息

然后将模块打包压缩成 zip 文件。

如果你使用 Telegram，这有一个频道可以关注一下，会发布 Magisk 模块。

- https://t.me/magiskmod
