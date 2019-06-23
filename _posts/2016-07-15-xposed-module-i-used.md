---
layout: post
title: "我使用的 Xposed module"
tagline: ""
description: "Android 上的神器 Xposed"
category: 整理合集
tags: [android, androiddev, xposed, 整理合集 ]
last_updated: 2016-10-03
---

什么都不多说，这个神器就如 Chrome 下的 [Tampermonkey](/post/2015/08/userscripts.html), 有很多神奇的待发现。一句话概括 Xposed 就是 Android 上一款可以修改任意系统进程模式的框架，包括系统进程。下面介绍的 module 基本上都是 Xposed 框架下的插件，实现了各种神奇的功能，有些功能有被官方收录到应用官方功能中的，比如 Instagram 的图片放大功能，有些功能至今还在和官方捉迷藏的，比如微信抢红包插件，还有些功能增强了系统的扩展性，让整个手机能够高效的完成日常的工作，比如在信任 WIFI 下自动解锁屏幕等等功能。总之 Xposed 框架让整个 Android 系统上升了一个层次。

用 Xposed 的自我介绍来说，就是能够在无感知不接触任何 APK 的情况下修改系统或者应用的行为

> Xposed is a framework for modules that can change the behavior of the system and apps without touching any APKs.

Xposed 是由 [rovo89](https://github.com/rovo89) 开发和维护的一个项目， 官网地址：<http://repo.xposed.info/>， 源代码地址在 Github: <https://github.com/rovo89/Xposed>

更新及 change log 在 xda 论坛： <http://forum.xda-developers.com/showthread.php?t=3034811>

![Xposed Framwork](https://lh3.googleusercontent.com/-qCYmQsf81cE/V4kH46p7umI/AAAAAAAA_-U/c4yhnpq-h-8MATH5XQpacc8gOBLUH67xwCL0B/w790-h395-no/xposed.png)

## Android 9.0 使用 Xposed


- https://github.com/solohsu/EdXposed/releases
- https://github.com/RikkaApps/Riru/releases
- https://github.com/ElderDrivers/EdXp...nager/releases
- https://github.com/solohsu/XposedInstaller/releases

步骤：

1. Flash magisk-riru-core-arm-arm64-v10.zip
2. Flash magisk-EdXposed-arm-arm64-v x.x_beta-release.zip
3. Installation XposedInstaller_by_dvdandroid_19_10_18. apk

## 安装之前 {#before}

### 查看设备 CPU 架构
例如：Nexus 6 CPU 芯片是 armv7，选择 arm 即可。 Play Store 上有一个 Hardware Info 的 APP，可以查看 CPU 架构。

然后需要确认手机的 SELinux 设置成 Permissive ， 可以使用 SELinuxModeChanger 一款修改 SELinux 的应用。不过 N6 默认是 Permissive 的，也就不用修改了。

### 下载必要内容 {#download}
准备好 apk，和 zip 包，最好也下载好 xposed-uninstaller*.zip ，当刷入 zip 包之后无限启动的时候可以恢复。不过最好的方式还是通过 recovery 整体备份原来的数据 Nandroid backup 。数据是最重要的！！切记。

Android 6.0 的 framework zip 包在 [官网](http://dl-xda.xposed.info/framework/) 可以下到。 而 APK 在 Xda 论坛可以找到。

### 刷入 {#flash}
通过 recovery 刷入 flash zip 之后进入系统会很长时间，之后启动 Xposed Installer ，enable module 之后需要 soft reboot 。 切记需要点击 Xposed Installer 中的 reboot ，不能自己手工 reboot ，否则无法识别 module，掉进这个坑，重启无数次无效。

## 保留 modules
经过反复尝试保留下来的一些 modules，

### AdBlocker
屏蔽广告，另外一个可选择的屏蔽广告的 module 叫做 MinMinGuard，还没尝试，效果应该也很好。很多 ROM 集成的 Adaway 似乎也不错。

2019 年更新：AdBlocker 已经不再更新，故版本停止在了 1.12

### AppOpsXposed
权限管理，一张图解释所有

![AppOpsXposed](https://lh5.googleusercontent.com/-KW38IwvF_u0/V_IOa6ULO8I/AAAAAAABDcA/sKAiTCqhWAE5UiRzuOr5A2xmWdua7pWbgCL0B/w600-h849-no/Untitled%2Bimage.png)

20190620 更新：不再更新，版本停留在 1.30.3

### Xposed Pokemon
模拟地址，但是 XPrivacy 也是可以有相同的功能的。但是最后还是另一个 module 叫做 Xposed Pokemon 好用。

### GravityBox for Pie
可以定制很多部分，包括状态栏，导航栏，感觉最有用的就是可以定制长按 recent 按钮弹出小的 Launcher。然后自定义快速点击 recent 两次切换最近使用应用也是很有用的。还可以给状态栏加上网速监测。

自用上这个功能感觉已经不在需要刷其他 ROM 来支持一些特殊功能了，完全原生 +Xposed 就已经让我很舒服了。

- <https://forum.xda-developers.com/xposed/modules/app-gravitybox-v9-0-0-beta-1-android-9-t3908768>

### Greenify
休眠后台服务，很好的 App。

### No Lock Home
原生 Android 的 Smart Lock 只有根据蓝牙，GPS 和侦测随身携带，这个 module 增加了可以根据 WIFI，或者 mac 地址或者 LAC CID 来增加信任的地点，感觉这个更加实用。日常实用 WIFI 的地方一般都是自己熟悉的地方，将那些地方的 WIFI AP name 或者 WIFI Mac 地址加入信任列表，这样就不用总在熟悉的地方解锁解锁解锁了。自己熟悉的地方也总不至于丢手机的吧。

### 20170805 更新 WeXposed
作者将原本的多个 module 合并为一个，现在集成了抢红包（自定义关键词过滤），阻止撤回，防朋友圈删除，扩展表情限制，筛子随机等等等等功能，非常强大

	WechatForwarder
	很强大的转发，原先一直想要的转发功能都能搞定了。

	WechatUnrecalled
	微信不撤回

### XInsta
下载 Instagram 的图片，自从 IFTTT 不让我自动下载图片之后就诞生了这种需求。也正是因为这个需求让我发现并使用了 Xposed，然后又间接的找到了很多好玩的 module ，不过后来又找到了自动下载 ins 照片到 Google Drive 的[方法](/post/2016/09/auto-save-other-instagram-to-google-drive.html)。

- <https://repo.xposed.info/module/com.ihelp101.instagram>
- Source code <https://github.com/iHelp101/XInsta>

### 运动修改器
修改运动记步频率，还挺神奇的。

### 短信验证码识别模块

- <https://github.com/tianma8023/XposedSmsCode>

### NavBar / StatusBar media visualizer [L-M]
在导航栏或者状态栏显示音乐波形，太赞了。

2019 年更新，不再使用，都不用 NavBar 了，显示效果再赞也不顶用啊。

### No Lock Home
通过信任连接的 WIFI，或者 WIFI MAC 地址来自动解锁屏幕，感觉比 Android 自带的 SmartLock 要好用很多。Smart Lock 中的 Body Detect，还算有用，其他根据 GPS 来自动解锁必须得开着高精度 GPS， 不仅耗电也不精确。

### LocationReportEnabler
开启 Google 位置报告

### Unblock163MusicClient - Xposed
音量增强器

网易云音乐插件
解锁网易云音乐的版权锁定。

地址在：<https://github.com/bin456789/Unblock163MusicClient-Xposed/releases>

### PureNeteaseCloudMusic-Xposed
云村清洁工

- <https://github.com/zjns/PureNeteaseCloudMusic-Xposed/releases>

## 不太需要的 module
使用之后感觉不太需要的 module ，但是很强大的 module

### XPrivacy
很复杂的但是很强大的权限管理，非常细节，但是对新手不好，使用非常复杂。对权限要求比较高的可以尝试一下。

链接： <http://repo.xposed.info/module/biz.bokhorst.xprivacy>

### Flat Style Bar Indicators
高度自定义状态栏

### Flat Style Colored Bars
和之前使用的 tint status bar 效果差不多，根据应用颜色改变状态栏和导航栏的颜色

### Flat Style Colored Keyboard
自动改变键盘的颜色，我使用 TouchPal 所以也用不到。

### Ifont
修改系统字体

### Amplify
查看那些服务，禁用服务，省电

所有的 Xposed Module 都可以在 <http://repo.xposed.info/module-overview> 这里找到。当然 Xda 也有很多更新内容。

## 外延
网上流传着一份清单，其中有很多国产应用，但是有部分软件是闭源的，在未审查其代码之前慎重使用。 https://www.lanzous.com/b746243

    微信密友 v1.1.6.apk
    QQ 净化 -4.6.3.2108-beta.apk
    要妳命三千 v8.0.apk
    ColorQQ_1.3.6.apk
    蚂蚁森林助手 v1.3.91.apk
    微 x_v2.3.apk
    微大师 v1.0.7.apk
    QX 模块 v1.21_6.34.apk
    YouTube 去广告 v2.0.0.apk
    要妳命三千 v7.0.apk
    ColorQQ_v1.3.5.apk
    小米净化 v3.2.0.apk
    微咖 v2.0.2.apk
    对话框取消 v1.7.1-beta5.apk
    XMiTools_v1.1.0.apk
    抖音大师 v1.0.2.apk
    QQ 净化 v4.4.5.2335-beta.apk
    app-release-21626-o_1caj5fb9a1a9dv1pf98nf5ncq-uid-441926.apk
    应用管理 v5.2.1_b605c.apk
    重力工具箱 + P -v9.0.0-beta-11_build_910_e4b90.apk
    云村清洁工_v2.7.0-release_67f39.apk
    YouTube 去广告 v1.0.0_e49d8.apk
    移除原生锁屏遮罩 v1.3_0b32f.apk
    X 状态栏农历日期_3e093.apk
    指纹支付_3.9.2_3669f.apk
    Xposed edge（PRO）v5.4.2_5c1d2.apk
    MDWechat_v3.5.0_a1cc1.apk
    ad 快消 1.4.5_557ea.apk
    CustoMIUIzer 汉化版_v1.5.2_bd2f4.apk
    QX 模块 1.21_6.33_70734.apk
    阻止运行 v2.6.1_a8eee.apk
    运动加速器 v1.6.1_e3c89.apk
    QQ 斗图神器_2.0_a47e4.apk
    q++1.3.1_52bac.apk
    ChiMi-v2.4.17_55a57.apk
    运动修改器_2.1.4_e8c30.apk
    音量增强器 v0.0.34_12a4c.apk
    验证码提取器 v2.0.4_29017.apk
    GLTools_v4.01_mod_9b103.apk
    Xp 快译 3.1.3_5eca6.apk
    小米净化 v2.1.8_2f11e.apk
    MIUI10 时钟模块 v1.0.5_3418c.apk
    QQ 净化 -4.2.4.1705-beta_3e1a3.apk
    v++1.0.6_a2ac4.apk
    flyme 净化 v3.2.6_59311.apk
    QQHelper1.3.1_3fdc3.apk
    color qq_v1.3.4_98de0.apk
    要妳命三千 Xposed 模組 v6.0_fbf0b.apk
    悟空加速 v1.8.63_68a2b.apk
    微群发模块 v7.0.4_0d38e.apk

