---
layout: post
title: "斐讯 T1 盒子去除广告"
tagline: ""
description: ""
category: 经验总结
tags: [android, box, adb, apk, ads, phicomm, 斐讯, tv, 电视盒子,]
last_updated: 
---

斐讯投资送硬件这路子是着魔了，所以在斐讯 K2P 之后又入手了这个 T1 的盒子，配置2G RAM，16G Sdcard，配置还不错。接口有 USB，网口，HDMI 口，还有 一个 AV 输出口，日常使用是没有任何问题的，初尝试一下非常流畅，不过让我不爽的是，第一次进入竟然需要验证手机，说是 CIBN 盒子的验证，如果不注册还不让进入。

## 配置

CPU：Amlogic S912 八核 Cortex-A53 CPU up to 2.0GHz
GPU：ARM Mali-T820MP3 GPU up to 750MHz

2G RAM+16G ROM

## 删除不需要的应用

首先，进入盒子的设置--高级--远程调试打开，然后下载 adb， 开发过 Android 的人，或者大概熟悉 Android 的人一定用过这个命令，我之前也写过文章，总结[adb常用的命令](/post/2016/09/useful-adb-command.html)。

将盒子通电，将盒子联网（可以使用网线，也可以使用无线网络），只要能够在局域网中有一个IP地址，然后进路由器里记录，找到盒子的IP（192.168.x.x）地址。

    adb connect 192.168.x.x        （盒子IP）
    adb shell
    pm list packages # 可以用来查看安装的应用列表
    pm uninstall -k --user 0 com.feixun.dangbeimarket     #自带cibn当贝市场
    pm uninstall -k --user 0 com.tianci.ad                #广告
    pm uninstall -k --user 0 com.feixun.qiyiguo           #自带爱奇艺
    pm uninstall -k --user 0 cn.cibn.health               #健康中国  
    pm uninstall -k --user 0 com.pptv.tvsports.preinstall #CIBN体育
    pm uninstall -k --user 0 com.phicomm.phiweather       #天气
    pm uninstall -k --user 0 com.pplive.atv               #聚精彩
    pm uninstall -k --user 0 cn.cibntv.ott                #CIBN高清影视
    pm uninstall -k --user 0 com.phicomm.update           #斐讯OTA升级
    pm uninstall -k --user 0 com.phicomm.datatracker      #斐讯数据收集

如果想要恢复最原始的状态，在设置选项里，恢复出厂设置，还是最原来的状态。

## 添加过滤规则
如果路由器支持过滤广告，可以添加如下两条规则：

    asimgs.cp61.ott.cibntv.net
    hoisin.coocaatv.com

## 安装应用
简单的方法，只通过遥控器操作，先用系统自带的当贝市场，找到“视频加速器”这个应用，安装然后运行，就会在视频加速器运行界面的下方，看到有“当贝市场”，再安装这个当贝市场。

如果你有需要安装本地文件的APK安装包，有两种方式，推荐使用 adb 方式安装，先将想要安装的 apk，下载到本地文件，然后 adb 连接盒子

    adb connect <ip>
    adb install /path/to/app.apk   # 安装本地路径下的应用

直接将本地的应用安装到盒子。

如果安装不成功，记得禁用安装验证，在 adb 连接的情况下

    settings put global package_verifier_enable 0

或者用“悟空遥控器”这个应用，当贝市场里可以搜索它来安装，但也要在手机上下载安装“悟空遥控器”APP，里面有个“本地APK推送”，用它就可以安装你想要装的应用了，只要有APK安装包。

最后要强烈推荐一个投屏App，乐播投屏，因为斐讯T1并没有 DLNA 的功能，但幸而只要一个 App 就能够解决，这样就能够将手机爱奇艺上的内容快速的投屏到盒子上。

## su 密码
恩山最近的帖子更新了 T1 su 的密码，记录一下

    31183118

最后这篇[文章](/post/2018/01/android-tv-applications.html) 是我使用过并且觉得不错的 Android TV 的应用，可以参考。

## reference

- <http://www.right.com.cn/forum/thread-266642-1-1.html>
- <http://www.right.com.cn/forum/thread-265874-1-1.html>
