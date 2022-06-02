---
layout: post
title: "OnePlus 7 Pro 折腾记"
aliases: "OnePlus 7 Pro 折腾记"
tagline: ""
description: ""
category: 经验总结
tags: [oneplus, android, root, magisk, adb, ]
last_updated:
---

OnePlus 7 Pro 折腾记。

## Unlock Bootloader

先前准备：

- 备份数据，具体可以使用 adb 命令，见后文
- 开启开发者模式，Settings -> About Phone -> 点击 Build Number 7 次
- 调试模式，Settings -> Developer option -> Enable USB Debugging
- 开启 OEM Unlocking，Settings -> Developer options -> OEM Unlocking 开启
- PC 上安装 fastboot 工具

具体步骤

- 数据线连接手机，adb devices 确认连接成功
- 手机出现 Debug 对话框，确认
- 进入 bootloader 模式，`adb reboot bootloader`
- `fastboot devices`
- `fastboot oem unlock`
- 然后使用音量键选择，重启
- 等待重启完毕就 OK 了


## TWRP
第三方的 Recovery，首推 TWRP, 在 OnePlus 7 Pro 推出不久之后 xda 上面的 mauronofrio 就发布了非官方版本的 TWRP，当然随着时间往后 mauronofrio 将其制作的 TWRP 发布到了[官方页面](https://twrp.me/oneplus/oneplus7pro.html) . 本人测试 2019-06-08 的 twrp-3.3.1-3-guacamole.img ，非常完美。

安装 TWRP 过程

- 去官方网站下载 twrp-3.3.1-3-guacamole.img 和 twrp-installer-3.3.1-3-guacamole.zip 文件准备，img 文件放到桌面版以便于 adb 刷入，zip 包拷贝到手机内存
- 连接电脑，让手机进入 fastboot 模式
- `fastboot boot twrp-3.3.1-3-guacamole.img` 让手机用该 Recovery 启动，boot 命令只会让手机此次启动使用 TWRP，需要进行下一步才能让手机保持 TWRP Recovery
- 在 TWRP 中 flash 之前准备好的 zip 包

刷完重启进入系统

注意：OnePlus 7 Pro 使用 Slot A/B，但是最新的 TWRP 已经自动支持 A/B 识别，不用担心 A/B 的问题

## Root OnePlus 7 Pro with patched Boot Image
在 root 之前需要注意

- 使用原生 OOS
- Unlocked bootloader
- fastboot 工具

然后根据一下流程：

- 根据自己的版本 GM1910，系统版本 Oxygen OS 9.5.6 下载 patched boot image，或者自己制作 patched boot image
- 安装最新的 Magisk Manager
- adb reboot bootloader 进入 fastboot mode
- fastboot devices
- 如果担心下错 boot image，可以尝试使用 fastboot boot boot.img 来用本地的 image 文件启动
- 确认没有问题之后，刷入 `fastboot flash boot boot_patched.img`
- `fastboot reboot` 重启
- 打开 Magisk ，安装，使用 Direct Install
- 这样就有了一个 root 的 OnePlus 7 Pro


From: [xda](https://forum.xda-developers.com/oneplus-7-pro/how-to/guide-root-oneplus-7-pro-patched-boot-t3931205)

## Magisk
使用 Magisk ROOT

- 确保已经安装 Magisk v17.2 版本
- Download Riru-Core [riru-core-v19.1](https://github.com/RikkaApps/Riru/releases/download/v19/magisk-riru-core-v19.zip)
- Download EdXposed From [magisk-EdXposed-v0.4.2.3_alpha-release](https://github.com/ElderDrivers/EdXposed/releases/download/v0.4.2.3_a/magisk-EdXposed-SandHook-v0.4.2.3_alpha-release.zip)
- 在 Magisk Module 中，点击 `+` 号，选择 Riru-Core 和 EdXposed
- 然后重启手机，然后下载 EdXposed Apk From [here](https://github.com/ElderDrivers/EdXposed/releases/download/v0.3.1.7/EdXposedInstaller_v2.2.4-release.apk)

From: [xda](https://forum.xda-developers.com/oneplus-7-pro/how-to/root-oneplus-7-pro-install-magisk-t3931256)

## 更新系统 OTA 之后保留 recovery root 等
更新 OTA， Magisk 在拥有 slot A/B 的设备上有新的特性，能让系统正常更新而不会丢失 ROOT。如果想要了解更多 A/B 分区的问题可以参考[这里](https://www.xda-developers.com/how-a-b-partitions-and-seamless-updates-affect-custom-development-on-xda/).

如果想要在 OTA 之后保留 ROOT：

- 使用全量包更新，然后在 System 设置中使用本地更新，**切记更新完成不要立即重启**
- 打开 Magisk ，点击 Magisk 一行的安装，在弹出的对话框中点击安装
- 然后在弹出的对话框 (select Method) 中选择 `Install to Inactive Slot (After OTA)` 选项 （中文应该是，安装到未使用的槽位，安装完 OTA 后）
- 最后安装重启

在上方的步骤重启进入系统之后会丢掉 TWRP，进入系统后需要重新刷入，在 OTA 之后保留 TWRP：

- 打开 Magisk Manager ，然后像刷入其他 Module 一样输入之前 TWRP 的 zip 包
- 不要重启，刷入 TWRP 之后会丢失 ROOT Access
- 然后重新到 Magisk，点击 Install , Direct Install，然后再重启

在最后一步，有些教程可能有问题，在这里只需要 Direct Install，而不需要 Install to Inactive Slot(After OTA) 了。

这些步骤之后就 OTA 成功，并且保留了 TWRP，以及 Magisk 和 Magisk 下所有的模块。

## 使用 adb 备份数据
使用 adb 备份数据的时候千万注意，adb 备份的数据恢复时不会自动安装应用，并且可能恢复不完整。如果可能还是使用 Titanium Backup (ROOT) 等专业工具备份和恢复。

    adb backup -apk -shared -all -f op7pro-backup-file.ad

参数解释：

- `-apk|-noapk` 是否备份包含 apk 或者仅仅备份应用数据，推荐使用 `-apk` 选项，默认为 `-noapk`
- `-shared|-noshared` 决定是否备份设备共享的 SD 卡内容，默认为 `-noshared`，主要包括内部存储中的音乐，图片和视频等，推荐使用 `-shared`
- `-all` 备份所有应用
- `-system|-nosystem` 决定 `-all` 选项是否包含系统应用，默认是 `-system`
- `-f` 后面需要指定路径及文件名，表示用来存储的位置，比如 `-f /path/backup.file` 那么会存储在 `path` 目录下名为 `backup.file` 的文件中

恢复数据

设备连接电脑，adb devices 查看连接成功

    adb restore op7pro-backup-file.ad

如果想要手动解开这个备份文件，可以参考[这个项目](https://github.com/nelenkov/android-backup-extractor)

## 一些问题

### GM 版本问题
氧系统有好几个版本的全量 ROM， GM21AA，GM21BA。这两个版本的含义是：

- 标记有 GM21AA 的包适用于印度、全球（不含欧洲）、美国的无锁版 Model

        - GM1911: India
        - GM1917: Global/US Unlocked (?)

- GM21BA 欧洲销售版本

        - GM1913: EU

- GM27BA EU 5G 版本，GM 1915
- GM31CB GM1915 T-Mobile （Carrier Locked）


### adb 连接问题

adb 之前保证打开开发者模式，并且设置中确保设置打开，

    adb devices
    List of devices attached
    5fxxxxxx	no permissions (verify udev rules); see [http://developer.android.com/tools/device.html]

在使用 adb 连接的时候如果遇到这个问题，那么在通知栏中，换一种 USB 连接模式，保证非充电模式。如果还不行可以尝试

    adb kill-server
    adb start-server

更多关于 adb 和 fastboot 命令的使用可以参考之前的 [adb 文章](/post/2016/09/useful-adb-command.html) 和 [fastboot 文章](/post/2017/02/fastboot-and-adb-tools.html)

## 从 recovery 中删除导致无限重启的 magisk module
按住音量下＋电源键进入 Recovery 模式，在 TWRP Recovery 下，Advanced > File Manager，打开文件管理，找到：

	/data/adb/modules

在这个目录里面就能看到安装的 Magisk 模块，删除新增的模块即可。

## reference

- <https://www.xda-developers.com/unlock-bootloader-root-oneplus-7-pro/>
