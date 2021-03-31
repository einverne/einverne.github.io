---
layout: post
title: "重置 macOS S.M.C 和 NVRAM"
aliases: "重置 macOS S.M.C 和 NVRAM"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, apple, apple-support, nvram, operating-system,  ]
last_updated:
---

今天用得好好的电脑突然三次黑屏，两次发生在早上刚刚使用的时候，一次发生在晚上回家之后。所以一怒之下就直接上官网联系了 Apple Support，但是也不知道是不是我直接登录的 `.com` 网站，在我提交了 Support 之后一分钟一个外国小哥打了电话过来，我一下子没反应过来，只能用着不那么熟练的英语开始了 macOS 修复之路。

我简单地向这位技术小哥描述了我的问题，大致意思就是系统突然崩溃了三次，然后在聊的过程之中，经过他的提醒，我发现出现问题的时候都是系统从睡眠状态中恢复，并刚开机不久，在打字的过程中，突然风扇很响一声，电脑就黑屏了。

虽然这个时候能启动，并且启动之后运行有没有问题，但是技术小哥还是提议清理一下系统的缓存，和 NVRAM，虽然在讲电话的过程中我并不知道 NVRAM 是什么，但后来查了发现 macOS 会在这一块区域存放一些硬件配置信息。

在技术指导的过程中，发现我的硬盘剩余空间只剩下了 27G，技术就判断这可能是因为磁盘空间不足导致，睡眠的时候一些系统的内存的缓存问题而导致的系统故障，然后又指导我清理了一下系统 Cache。


我就在技术的指导下，进行了一系列的操作，总结如下。如果有人遇到了相同的问题，可以自行先试试了。

## 重置 S.M.C {#reset-smc}
我在网上查询技术小哥让我执行的操作时，发现其实做的第一步就是重置了 S.M.C。

技术先让我正常关机，等 Mac 完全关机之后，让我按下左边的 Shift，Control 和 Option 按键，然后同时按下电源键（[Touch ID 开机键](https://support.apple.com/en-us/HT207054)）并持续 10 秒时间。这个是重置 MacBooks S.M.C 的方法。这个步骤之后，重新按下电源键，笔记本会正常启动。

![20210331213513-reset-macbook-pro-smc.png](/assets/20210331213513-reset-macbook-pro-smc.png)

S.M.C 是 System Management Controller 的缩写，这是电脑上的一块[微控制器](https://electronics.howstuffworks.com/microcontroller.htm)，在 Intel 芯片的 Mac 上同来处理不同的电源，灯光，传感器等等硬件。

如果 Mac 不响应电源按键也可以尝试使用上面的步骤进行重置。

当你发现电池无法正常充电， Mac 无法识别插入 USB-C 端口的设备，或者键盘背光无法正常工作，或者睡眠功能运行不正常的时候，重置 S.M.C 可能是有用的。其他的症状比如系统的风扇高速运转，或者即使没有运行很多应用程序但 Mac 也运行迟钝，这时候重置 S.M.C 可能有效。


> An S.M.C. reset may help if you notice things like the battery is not charging properly, the Mac does not recognize devices plugged into its USB-C port, the keyboard backlight is not working correctly or the sleep function is out of whack. Other symptoms include the computer fan’s running at high speed or the Mac’s acting sluggish, even if you are not using a lot of processor-hogging programs.

Apple’s support site has [a full guide to the S.M.C. reset process](https://support.apple.com/en-us/HT201295) for all its Intel-based Macs, including those with removable batteries and desktop models. The guide also lists a series of things you should try _before_ resetting the S.M.C. While performing a reset does not generate an alert box or notification, you can tell if you were successful if the odd Mac behavior stops. (You may also have to redo any preferences for your display and power-management settings.)

重置 S.M.C 可能修复一些不确定的错误行为，但不会对任何电源的损坏或者硬件的故障有任何帮助。

## reset NVRAM
现在的 Mac 会在 nonvolatile random access memory(NVRAM) 的地方存储一些设置。如果 Mac 无法操作音量，屏幕分辨率，时区信息，或启动影片，那么极有可能是存放在 NVRAM 中的信息损坏了。

你通过如下的方式可以 [重置 NVRAM 或 PRAM](https://support.apple.com/en-us/HT204063) ：

- 首先关闭 Mac
- 然后同时按下 Option, Command, P and R 键
- 当你听到[开机启动的声音](https://support.apple.com/en-us/HT202768)，或者在 Mac Pro 上看到 Apple logo 出现并消失，松开这些按键，让系统完成启动过程

## 清理系统缓存
在执行这一步之前请一点先做好系统的全盘备份，使用 Time Machine 将系统备份到外置存储中。

然后打开 Finder：

![20210326225923-mac-finder-go-library.png](/assets/20210326225923-mac-finder-go-library.png)

在打开的文件夹中删除 `Caches` 文件夹：

![20210326225953-library-delete-caches.png](/assets/20210326225953-library-delete-caches.png)

我在执行完这一步之后释放了大约100G的空间。

## reference

- <https://www.nytimes.com/2018/05/11/technology/personaltech/mac-smc.html>