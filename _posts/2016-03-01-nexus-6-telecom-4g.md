---
layout: post
title: "Nexus 6 刷机及电信 3G/4G 破解"
tagline: ""
description: ""
category: 经验总结
tags: [Android, Nexus 6, ]
last_updated: 
---

## adb and fastboot
从 Android 开发官网下载 Android SDK，从事过 Android 开发的应该知道 adb 和 fastboot 工具，在完整 SDK 中这两个工具在 platform-tools 文件夹下。如果想要方便的使用这两个工具，可以将文件路径加入到系统环境变量中，这样以后就可以在任何目录使用 adb 和 fastboot 命令。

## flash factory image
救砖，或者在 recovery 下没有备份又无法开机的情况下只能刷回原厂镜像救砖机。因此折腾需谨慎，刷机前请一定使用 recovery 备份系统及数据。可以从 Google 官网下载镜像。

### 下载镜像 {#download-image}
https://developers.google.com/android/nexus/images#shamu

解压之后应该会有如下文件

    bootloader-shamu-moto-apq8084-71.15.img  2016/01/06  07:19        10,636,288
    flash-all.bat                            2016/01/06  07:19               985
    flash-all.sh                             2016/01/06  07:19               856
    flash-base.sh                            2016/01/06  07:19               814
    image-shamu-mmb29q.zip                   2016/01/06  07:19     1,009,825,337
    radio-shamu-d4.01-9625-05.32+fsg-9625-02.109.img      2016/01/06  07:19       118,272,512

### 解锁bootloader {#unlock-bootloader}
解锁 bootloader 会抹去手机一切内容，需谨慎，总之只需要一句命令

     fastboot oem unlock

然后利用音量键及电源键来确认解锁 bootloader, 之后运行

     fastboot reboot

重启手机。

### 刷镜像 {#flash-image}

1. 关机并进入 fastboot 也就是 bootloader模式，在关机状态下，同时按住“电源键”+“音量下”
2. 数据线连接手机与电脑，在驱动安装正确之后
3. 执行 flash-all.bat (Windows 下） 或者 flash-all.sh （MAC或者 Linux 下）
4. 等待执行完毕，手机恢复成出厂镜像

## root
root 工具及教程来自 @Chainfire ，在此由衷的感谢他。

- 下载[ZIP工具](http://download.chainfire.eu/628/CF-Root/CF-Auto-Root/CF-Auto-Root-shamu-shamu-nexus6.zip)
- 解压文件，并将手机进入 bootloader/fastboot 模式
- 连接数据线，并运行 root-windows.bat （Windows 下）或者 chmod +x root-linux.sh 并运行 root-linux.sh （Linux下） Mac下同Linux

## Recovery
第三方的 Recovery 有以下的功能：

- Wipe your phone’s data (Factory reset) and cache
- Make, restore and manage backups of your phone’s operating system and software
- Mount, unmount and format your phone’s internal as well as external storage partitions
- Install a custom ROM or application from a zip file to your phone
- Wipe Dalvik cache and battery statistics
- Make logs for error reporting and debugging

刷入 recovery

- 从[官网](https://twrp.me/devices/motorolanexus6.html) 下载 Nexus 6 TWRP 的 recovery 文件
- 进入 bootloader/fastboot 模式
- 执行以下命令

     	fastboot flash recovery recovery.img

     recovery.img 即下载的 Recovery 镜像。
- 利用音量键选择 recovery ，点击电源键选择，可以进入 "Recovery Mode".

安装完 recovery 之后就能够快速的备份系统，恢复出厂设置，恢复备份数据，刷入新ROM，刷入ZIP

## kernel
一张图解释什么是 kernel

![android kernel](https://lh3.googleusercontent.com/-sIqESm3F9Z0/VtVJZVcko6I/AAAAAAAA67c/3DObK5dDQKE/s382-Ic42/kernel-android.png)

Nexus 6 第三方的 kernel 有[很多选择](http://forum.xda-developers.com/nexus-6/Kernel) 比如 franco.kernel，这里推荐 ElementalX，有如下功能

- Easy installation and setup with Aroma installer
- overclock/underclock CPU
- user voltage control
- Advance color control
- MultiROM support
- optional USB fastcharge
- optional sweep2wake and doubletap2wake
- optional sweep2sleep
- sound control
- init.d support
- NTFS r/w and exFAT support
- option to disable fsync
- adjustable vibration
- does not force encryption

安装 ElementalX kernel

- 从[ElementalX](http://elementalx.org/devices/nexus-6/) 官网下载，并保存到手机
- 进入 Recovery Mode
- 刷入 ZIP ，选择下载的文件，安装

## Nexus 6 破解电信3G/4G

6.0.1 (MMB29Q) 有效

下载文件，教程中需要用的软件及文件 <https://yunpan.cn/cxCaHyqkKPwg9> 提取码 db02

- DFS
- QPST

还有[这里](https://github.com/einverne/einverne.github.io/tree/master/assets/nexus6)

- moto x qc diag interface - 64bit.zip
- carrier\_policy.xml

具体步骤参考[nexus6破解电信教程](../../../assets/nexus6/nexus6_4g.pdf)

简单来说破解4G步骤：

- 用QPTS工具里面的EFS Explorer, 添加/policyman/carrier\_policy.xml,nexus6 默认没有这个文件
- 进入BP TOOLS模式,安装好后，必须确认好你的设备管理器 端口（COM和LPT）中BP驱动的端口号
- 从开始菜单中，打开QPST configuration
- 先点Ports标签,然后点Add New Prot 输入你的设备端口号
- 点StartClient菜单中的EFS Explorer选项
- 连接上手机后,在EFS 根目录创建policyman目录
- 把carrier\_policy.xml(见附件)拖进policyman目录中
- 完成后重启手机

破解完成后请在手机拨号面板那输入 `*#*#4636#*#*` 看下首选网络是不是LTE/GSM/CDMA  auto(prl)


## 参考

- <http://forum.xda-developers.com/nexus-6/general/guide-flash-factory-images-nexus-6shamu-t2954008>
- <http://forum.xda-developers.com/showpost.php?p=56938530&amp;postcount=1>
- <http://bbs.gfan.com/android-7828699-1-1.html>
- <http://m.anruan.com/view_7100.html>
- <http://bbs.gfan.com/forum.php?mod=viewthread&tid=7795111>
- <http://bbs.gfan.com/android-8085647-1-1.html>