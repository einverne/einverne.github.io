---
layout: post
title: "OnePlus 7 Pro 折腾记"
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

- 确保已经安装 Magisk v17.2 版本
- Download Riru-Core [riru-core-v19.1](https://github.com/RikkaApps/Riru/releases/download/v19/magisk-riru-core-v19.zip)
- Download EdXposed From [magisk-EdXposed-v0.4.2.3_alpha-release](https://github.com/ElderDrivers/EdXposed/releases/download/v0.4.2.3_a/magisk-EdXposed-SandHook-v0.4.2.3_alpha-release.zip)
- 在 Magisk Module 中，点击 + 号，选择 Riru-Core 和 EdXposed
- 然后重启手机，然后下载 EdXposed Apk From [here](https://github.com/ElderDrivers/EdXposed/releases/download/v0.3.1.7/EdXposedInstaller_v2.2.4-release.apk)

From: [xda](https://forum.xda-developers.com/oneplus-7-pro/how-to/root-oneplus-7-pro-install-magisk-t3931256)

## 更新系统 OTA 之后保留 recovery root 等

- 使用全量包更新，然后在 System , System, 设置中使用本地更新，**切记更新完成不要立即重启**
- 打开 Magisk ，点击 Magisk 一行的安装，在弹出的对话框中点击安装
- 然后在弹出的对话框 (select Method) 中选择 `Install to Inactive Slot (After OTA)` 选项 （中文应该是，安装到未使用的槽位，安装完 OTA 后）
- 最后安装重启

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


