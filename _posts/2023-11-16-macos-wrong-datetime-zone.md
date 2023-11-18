---
layout: post
title: "修复 macOS 时区和时间错误"
aliases:
- "修复 macOS 时区和时间错误"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, datetime, macbook, mac ]
create_time: 2023-11-16 19:00:19
last_updated: 2023-11-16 19:00:19
---

今天 macOS 上又发生了一个奇怪的问题，昨天晚上因为没有连接充电线，所以导致 MacBook 晚上自动关机了，看起来是因为没电自动关机了，但是早上看的时候还有一点点电，白天的时候没有任何操作就直接充电到满，但是晚一些使用的时候就发现系统的时间不太对了，在系统设置中强制同步系统时间，但没有用处，每一次同步都比当前的时间慢了一天和几个小时，甚至连分钟都对不上。于是就开始了一系列的修复过程。

因为操作系统时间已经不对了，所以无论访问什么网页，都会因为时间对不上而被安全证书拒绝访问，所以我只能将系统的时间手动修正为大致准确的。然后通过浏览器查询解决方法。

## 调整 NTP 服务器

我怀疑的第一个问题就是，是不是 Apple 自带的 NTP（Network Time Protocol，时间服务器）出错了，因为即使是我手动修正正确的时间，只要使用这个 Time Server 同步一下，时间就错了。

![fhLN](https://photo.einverne.info/images/2023/11/17/fhLN.png)
所以我在网上找了一些其他公司公开的 NTP 服务

- time.cloudflare.com
- time.google.com

但问题在于，我试了两个，发现 macOS 都会把时间纠正错误。这个时候我就有点担心是不是最近升级了操作系统的问题，但是这个问题也没有解，毕竟也不能降级，所以我将问题点移动到了，是不是在 Intel 的 macOS 上的 NVRAM 和 SMC 这两块存储芯片因为断电的问题出错了。

## 重置 NVRAM 和 SMC

macOS 上的 NVRAM（非易失性随机存储器） 和 PRAM （参数随机存储器）是有可能因为断电而倒置出错的。之前有一次出现问题，联系客服的时候，客服那边知道了这个操作。

简单的记录

- 关机
- 同时按下 Option + Command + P + R，并在启动过程中一直按住，直到听到两次启动的声音
- 释放按键，macOS 会重新启动并重置 NVRAM

S.M.C 是 System Management Controller 的缩写，是 macOS 上的一块[微控制器](https://electronics.howstuffworks.com/microcontroller.htm)，在 Intel 芯片的 Mac 上同来处理不同的电源，灯光，传感器等等硬件。

重置 SMC

- 关机
- 在关机的状态下，安装 Option + Command + Shift + 电源键，长按 10 秒
- 等待重启

具体可以参考[这篇文章](/post/2021/03/repair-macos-smc-nvram.html)

但重置了这两个微芯片之后还是还是没有解决这个时间的问题，使用 NTP 服务同步一下时间，就又错位了。

## Google

在尝试了所有我知道的解决方法之后，就只能求助于 Google 了，我使用 macos 时间 错误 ntp 等等关键字，进行了一番搜索。发现了一些可能的问题。

- 有些反馈说是因为系统的定位服务错误，所以可能 macOS 不知道你的位置而调用了其他地区的时区，但我检查了一下定位服务，是有权限的，并且网页上也是能获取到位置的。[^1]

[^1]: <https://www.makeuseof.com/how-to-fix-wrong-date-and-time-on-mac/>

- 然后我使用 `macos date wrong` 尝试看看英文的帖子有没有出现过类似的问题，果不其然，官方的 [论坛](https://discussions.apple.com/thread/253973068) 上就有类似的问题

然后我按照这个帖子上面的方法，执行了如下的命令

```
sudo sntp -sS time.apple.com
```

然后竟然好了！
