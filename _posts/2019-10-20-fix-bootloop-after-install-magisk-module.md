---
layout: post
title: "记一次修复安装 Magisk 模块后的 bootloop"
tagline: ""
description: ""
category: 经验总结
tags: [magisk, oneplus-7-pro, android, recovery, root]
last_updated:
---

昨天看到系统通知有 Android 10 的 OTA，就顺手把系统升级了，也知道可能有些 Magisk Module 不兼容，所以把所有的 Module 都先关闭了，升级的过程倒是[非常顺利](/post/2019/06/oneplus-7-pro-usage.html)。所以也就没有多想就依次想试试 Magisk 模块能不能启用，尤其是 EdXposed。可是就是没有想到这个启用让手机停留在了 OnePlus 的开机 Logo 无限开机中。这个问题倒也不是很大，之前也就遇到过，只要刷入一个 uninstall 的包就可以了。所以就想要进入 recovery。

这里插入一下一加的几个组合按键。

- 在开机状态下 Volume Up + Boot 按键长按可以强制关机
- 在关机状态下 Volumn Down + Boot 按键长按可以进入 recovery 模式
- 在关机状态下 Volumn Up + Volumn Down + Boot 三个按键同时按住可以进入 fastboot 模式

因为之前就刷入了 TWRP 的 recovery 所以也不是很怕，但是当我进入 TWRP 的 recovery 的时候，我发现 TWRP 没有要求我输入 PIN 密码，并且进入后也无法加载 data 分区，所以手机内部的所有内容都无法读取，这一下就有点慌了，因为我不想丢失数据。经过一番搜索，尝试了重新刷 boot.img，后来发现 Android 10 的 TWRP recovery 可能需要升级，所以在 xda 上找到了 unofficial 的 [Android 10 的 recovery](https://forum.xda-developers.com/oneplus-7-pro/how-to/guide-bootloader-unlock-twrp-install-t3940368)，刷入后果然能够解锁了。

然后再把 Magisk 的 uninstall 的包刷入，开机果然就没事了。然后不甘心，从头开始，重刷了最新的 [TWRP 3.3.1-xx Unified Unofficial by mauronofrio](https://forum.xda-developers.com/oneplus-7-pro/development/recovery-unofficial-twrp-recovery-t3931322)，然后刷入 Magisk，不过没有启用任何 Module，然后一个个尝试启用 Module，果然 EdXposed 启用之后还是会卡在 Logo，但是这个时候我就不需要重新刷入 uninstall magisk 的包了，我只需要进入 recovery.

- 进入 TWRP
- Advanced > File Manager > data > adb > modules
- 然后找到对应新安装的 module，进入文件夹，然后点击右下角的勾
- 在弹出的对话框中选择 Delete

再重启进入系统即可。

## reference

- <https://forum.xda-developers.com/oneplus-7-pro/how-to/guide-how-to-uninstall-magisk-module-t3940369>
