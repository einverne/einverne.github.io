---
layout: post
title: "我的一加3手机设置"
tagline: "从新手机开始设置"
description: ""
category: 经验总结
tags: [OnePlus, Android, Xposed, Magisk, Root]
last_updated: 
---

最近屏幕摔碎了一次，维修过程中无奈抹掉了所有数据，于是只能从头开始开搞。这里只是简单的记录一下，以免哪一天又有同样的悲剧发生，当然不可能再有下次了。

## 刷回原厂设置 {#flash-factory-image}
对于 Nexus 机型来说，Google 都提供了原厂镜像，一加同样也是，可以从[官网下载](http://downloads.oneplus.net/oneplus-3/oneplus_3_oxygenos_3.2.8/)  ，不过亲身经历一加官网的好多链接都挂掉了，直接从 xda 找反而要方便许多。官网的链接使用迅雷下载还遭遇了掉包，所以对于刷机包，一定要验证md5，一定一定。

刷 Oxygen OS (氧OS) , 有很多方法，如果使用的 stock recovery ，可以使用 `adb sideload full-rom.zip` 来刷入（官网有详细教程）。
而如果安装了 TWRP 或者 `twrp-3.0.2-0_blu_spark_v11-op3.img` 等等第三方的 recovery , 可以直接在 recovery 中 install ROM。虽然间隔遇到了一些问题，在使用 recovery 刷机的时候遇到 “this package is for OnePlus 3 devices this is one plus 3”，这样奇怪的错误。但是最后找原因还是因为 recovery 的关系，使用 TWRP 3.0.2 及以前的版本即可，或者 blu spark 的版本都可以完美解决。

## root
使用下面地址给出的 superSu, systemless 可以完美root。

<https://forum.xda-developers.com/oneplus-3/how-to/oneplus-3-how-to-unlock-bootloader-t3398733> 

xda 终究是一切的开端，很多内容都是从这边开始，然后被无数人复制粘贴搬运到互联网的各个角落。因此，遇到任何刷机或者root，或者 Android 相关的任何折腾的问题，用英语关键词来这里搜索有的时候比直接在 Google 搜索要灵得多。这有的时候就像是要查找某一款产品的型号或者功能时，直接在 jd.com 或者 淘宝搜索要来的快得多。或者垂直搜索领域确实值得深入发展一下，感觉这也是 Google 越来越担心亚马逊存在的原因之一吧。

## 修改 DPI
在root之后，开机进入，就会发现一加默认的DPI 实在感人，远看像老人机，每一个图标都老大老大。Oxygen OS 默认的DPI是 480，实际使用感受设置在 420 到 440 最佳。基本上Launcher 中一行 5 个 图标，原始设置一行只能放下 4 个图标。

一加3 修改 DPI ，可以有很多方法，最最简单的方法就是下载 Le DPI Changer 这个应用，直接在应用中修改（记得上一次可以修改成功，但是这一次差点将系统搞坏，这里要注意，修改 build.prop 文件一定要备份，否则有可能遇到无法开机的情况。幸亏这一次在系统中找到了 build.prop 的备份，在 recovery 中恢复了之前的设置）。

另外一种情况就是，直接修改 `/system/build.prop` 系统目录下的 build.prop 文件，直接修改文件内容。

    ro.sf.lcd_density=420

同样也可以利用  BuildProp Editor 应用来修改，开启应用，右上角设置，中添加，键为 `ro.sf.lcd_density` ，值为 420 的条目。重启手机便可以生效。记住修改 build.prop 文件，以及任何系统文件一定要备份系统，或者可以在 recovery 中能够恢复修改的内容，否则有可能无法开机。建议使用 BuildProp Editor 这个应用来修改。

## Magisk
从 Play Store 中下载 Magisk Manager，安装打开，保证ROOT，此时从 Magisk 中更新组件，重启，即可。

下文中的 boot.img 不要轻易刷入，其他未经验证的 boot.img 也不要轻易刷入。
https://forum.xda-developers.com/oneplus-3/how-to/guide-oneplus-3-magisk-install-android-t3433093

https://forum.xda-developers.com/apps/magisk/official-magisk-v7-universal-systemless-t3473445

## Xposed
在安装好 Magisk 之后，从 Magisk 中可以选择安装 Xposed ，然后参照之前整理过的文章 [我使用的 Xposed Module](https://einverne.github.io/post/2016/07/xposed-module-i-used.html) 安装一遍。还很快。

如果不想使用 Systemless 的 Xposed ，可以使用[官网的地址](http://repo.xposed.info/)，直接从 recovery 中刷入。

## Kernel
一直使用的 ElementalX 的 kernel ，直接从 Play Store 上下载 ElementalX Manager，在应用中安装即可，应用会自动选择相应的版本。

## 中间遇到的几个问题

### The dm-verity is not started in enforcing mode
原厂给我刷了 Android 7.0 的系统，在开机的时候除了解锁 bootloader 的提醒之外，还多了这个提醒，猜测可能是 Android 7.0 导致的，在刷完 Oxygen OS 3.2.8 （Android 6.0.1) 之后，这个提示就消失了。

### Adblocker 被移除
在原本的 Xposed 列表中我曾经写过， Adblocker 这样一款广告去除 Module，但是这个 module 莫名其妙被 Xposed 仓库和 xda 移除，没有任何消息。有人说是因为有木马导致的，但是我更加觉得是因为去广告有用，得罪了不少人才导致下架的。

更多的细节可以参考下面的文章：

- https://forum.xda-developers.com/xposed/happened-to-adblocker-t3453144
- https://forum.xda-developers.com/android/general/guide-ad-blocking-t3218167
- https://www.reddit.com/r/xposed/comments/50s0ow/discussion_the_adblocker_module_has_been_removed/

不过还是能从 Coolapk.com 来下载到下架版本。个人感觉还是能够屏蔽很多广告的。

至此所有系统级别设置都已经完成。附上一张桌面

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/32965991542/in/album-72157677227076474/" title="OnePlus3 Wallpaper"><img src="https://c1.staticflickr.com/3/2935/32965991542_123b29699d.jpg" width="281" height="500" alt="OnePlus3 Wallpaper"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## reference
- <https://forum.xda-developers.com/oneplus-3/help/changing-lcd-density-dpi-problem-t3402210/page5>
- <http://www.androidpolice.com/2016/09/11/guide-play-pokemon-go-0-37-rooted-android-magisk/>