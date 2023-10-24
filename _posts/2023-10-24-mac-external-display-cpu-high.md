---
layout: post
title: "MacBook 16 寸连接外接显示器 CPU kernel_task 占用极高问题解决"
aliases:
- "MacBook 16 寸连接外接显示器 CPU kernel_task 占用极高问题解决"
tagline: ""
description: ""
category: 经验总结
tags: [ macos, macbook, macbook-16, kernel_task, monitor, 4k-display, 4k ]
create_time: 2023-10-24 23:32:34
last_updated: 2023-10-24 23:32:34
---

上个礼拜在 Prime Day 购入了明基的 4K 显示器，但是用 Type-C 连接上电脑（Macbook 2019 16 寸）的时候发现，MacBook 非常卡顿，用 [[iStat Menu]] 查看了一下，发现 kernal_task 占用极高，进而导致系统非常缓慢。刚开始的时候还以为是软件开多了哪里不对，但是逐渐的发现，当我把显示器断掉之后立即就恢复了正常水平。所以立即把问题定位到了显示器上面。

![X3GH](https://photo.einverne.info/images/2023/10/24/X3GH.png)

根据之前的[经验](/post/2021/03/repair-macos-smc-nvram.html)，我尝试重置 S.M.C，还重置了一下 NVRAM，但是都不管用。中间还尝试了一下将 Type-C 线更换成 HDMI，但依然没有用。

## 解决方案：GPU

下载一个 [gfxCardStatus](https://github.com/codykrieger/gfxCardStatus) 可以查看当前使用的 GPU 是核显还是独显。外接显示器必须使用独立显卡，使用该软件手动切换为独立显卡。然后再接上显示器，之后就再没有出现 CPU 过高的问题。

## More

我使用 M1 芯片的 Macbook 连接显示器的时候，却完全没有出现问题，真的不知道是 Intel 芯片的问题，还是 GPU 问题，还是 Apple 的问题了。

## reference

- <https://apple.stackexchange.com/questions/441348/2022-high-kernel-task-cpu-usage-with-external-monitor-reaching-to-1000>
