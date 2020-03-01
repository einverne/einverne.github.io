---
layout: post
title: "网件 WNDR3800 刷机"
tagline: ""
description: ""
category: 经验总结
tags: [openwrt, wndr3800, router, linux, tutorial, ]
last_updated:
---


## 进入 U-boot
路由先断电，然后按住复位键或者 WPS 键开机，保持 10S 钟左右，然后用网线连接 LAN 口和电脑，打开浏览器进 192.168.1.1，就可以进入 U-boot 控制台，进去刷写固件

操作路径 ：固件更新 -> 固件 -> 选择固件文件 -> 上传 -> 更新，刷完后机器会自动重启。

## 固件

### 自行编译

- <https://github.com/coolsnowwolf/lede>


或者下载他人编译好的固件。
