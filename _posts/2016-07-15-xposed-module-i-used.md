---
layout: post
title: "我使用的 Xposed module"
tagline: ""
description: "Android 上的神器"
category: 整理合集
tags: [Android, AndroidDev, Xposed, 整理合集]
last_updated: 2016-10-03
---

什么都不多说，这个神器就如 Chrome 下的 [Tampermonkey](/post/2015/08/userscripts.html),有很多神奇的待发现。

官网地址：<http://repo.xposed.info/>

更新及 change log： <http://forum.xda-developers.com/showthread.php?t=3034811>

![Xposed Framwork](https://lh3.googleusercontent.com/-qCYmQsf81cE/V4kH46p7umI/AAAAAAAA_-U/c4yhnpq-h-8MATH5XQpacc8gOBLUH67xwCL0B/w790-h395-no/xposed.png)

## 安装之前 {#before}

### 查看设备CPU架构
例如：Nexus 6 CPU芯片是 armv7，选择 arm 即可。 Play Store 上有一个 Hardware Info 的 APP，可以查看 CPU 架构。

然后需要确认手机的 SELinux 设置成 Permissive ， 可以使用 SELinuxModeChanger 一款修改 SELinux 的应用。不过 N6 默认是 Permissive 的，也就不用修改了。

### 下载必要内容 {#download}
准备好apk，和 zip 包，最好也下载好 xposed-uninstaller*.zip ，当刷入 zip 包之后无限启动的时候可以恢复。不过最好的方式还是通过 recovery 整体备份原来的数据 Nandroid backup 。数据是最重要的！！切记。

Android 6.0 的 framework zip 包在 [官网](http://dl-xda.xposed.info/framework/) 可以下到。 而 APK 在 Xda 论坛可以找到。

### 刷入 {#flash}
通过 recovery 刷入 flash zip 之后进入系统会很长时间，之后启动 Xposed Installer ，enable module 之后需要 soft reboot 。 切记需要点击 Xposed Installer 中的 reboot ，不能自己手工 reboot ，否则无法识别 module，掉进这个坑，重启无数次无效。

## 保留 modules
经过反复尝试保留下来的一些modules，

### AdBlocker
屏蔽广告，另外一个可选择的屏蔽广告的 module 叫做 MinMinGuard，还没尝试，效果应该也很好。很多 ROM 集成的 Adaway 似乎也不错。

### AppOpsXposed
权限管理，一张图解释所有

![AppOpsXposed](https://lh5.googleusercontent.com/-KW38IwvF_u0/V_IOa6ULO8I/AAAAAAABDcA/sKAiTCqhWAE5UiRzuOr5A2xmWdua7pWbgCL0B/w600-h849-no/Untitled%2Bimage.png)

### Xposed Pokemon
模拟地址，但是 XPrivacy 也是可以有相同的功能的。但是最后还是另一个 module 叫做 Xposed Pokemon 好用。

### GravityBox MM
可以定制很多部分，包括状态栏，导航栏，感觉最有用的就是可以定制长按 recent 按钮弹出小的 Launcher。然后自定义快速点击 recent 两次切换最近使用应用也是很有用的。还可以给状态栏加上网速监测。

自用上这个功能感觉已经不在需要刷其他ROM来支持一些特殊功能了，完全原生+Xposed 就已经让我很舒服了。

### Greenify
休眠后台服务，很好的App。

### No Lock Home
原生 Android 的 Smart Lock 只有根据蓝牙，GPS和侦测随身携带，这个 module 增加了可以根据 WIFI，或者 mac 地址或者 LAC CID 来增加信任的地点，感觉这个更加实用。日常实用 WIFI 的地方一般都是自己熟悉的地方，将那些地方的 WIFI AP name 或者 WIFI Mac 地址加入信任列表，这样就不用总在熟悉的地方解锁解锁解锁了。自己熟悉的地方也总不至于丢手机的吧。

### WechatForwarder
很强大的转发，原先一直想要的转发功能都能搞定了。

### WechatUnrecalled
微信不撤回

### XInsta
下载 Instagram 的图片，自从 IFTTT 不让我自动下载图片之后就诞生了这种需求。也正是因为这个需求让我发现并使用了 Xposed，然后又间接的找到了很多好玩的 module ，不过后来又找到了自动下载 ins 照片到 Google Drive 的[方法](/post/2016/09/auto-save-other-instagram-to-google-drive.html)。

### 运动修改器
修改运动记步频率，还挺神奇的。

### NavBar / StatusBar media visualizer [L-M]
在导航栏或者状态栏显示音乐波形，太赞了。

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

