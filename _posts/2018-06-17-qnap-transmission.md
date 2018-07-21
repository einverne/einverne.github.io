---
layout: post
title: "威联通折腾篇五：安装 Transmission 下载 BT"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, qnap-tutorial, download, bt,]
last_updated:
---

这一篇讲在威联通上安装和使用下载工具 -- Transmission。

[Transmission](https://transmissionbt.com/) 是一个 BT 客户端，提供了 Web 和命令行界面，非常适合在威联通机子上跑。威联通自身的 Download Station 根本无法用，而迅雷和百度也基本无法用。只能尝试一下这个方法了。

## 安装
如果看过之前的文章，应该知道威联通第三方的应用市场 QNAP CLUB，在其中直接能够找到 QTransmission。安装完成之后用户名密码是 qnap 和 qnap。

配置文件路径：

- `/opt/QTransmission/etc`
- `/share/CACHEDEV1_DATA/.qpkg/QTransmission/etc`

为什么有两个路径呢，是因为 opt 目录下的路径其实是一个软连接，指向真实在 `/share/CACHEDEV1_DATA/.qpkg/QTransmission` 的目录。

如果要修改 WEB 界面的端口，需要同时修改 `/mnt/HDA_ROOT/.config/qpkg.conf` 里面 QTransmission 配置的端口。

## 配置
安装完成后直接在威联通 WEB 界面上点击进入，然后使用 qnap - qnap 登录。设置限速、关闭 DHT，然后在路由器上做端口转发，保证 51413 端口开放。

其他常用的配置

    "cache-size-mb": 16

然后在威联通中新建共享文件夹，配置下载保存的位置。

    "download-dir": "/share/Transmission"

等等。

不过经过我这番尝试，我的 51413 端口依然无法连上，所以放弃了。代替方案先用小米路由器好了。
