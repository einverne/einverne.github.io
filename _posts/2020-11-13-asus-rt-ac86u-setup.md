---
layout: post
title: "Asus RT-AC86U 初始设置"
aliases: "Asus RT-AC86U 初始设置"
tagline: ""
description: ""
category:
tags: [router, asus, 路由器 , linux, ssh, entware,]
last_updated:
---

前些天给家里买手机正好凑单了一个 Asus RT-AC86U，正好可以代替出了两次故障的[小米 3G](/post/2020/04/mi-wifi-3g.html)。

## 提前工作

- 登录管理后台（<http://router.asus.com/Main_Login.asp>)启用 SSH （系统管理 - 系统设置 - 服务 - 启用 SSH)
- 开启 JFFS 分区，系统管理 - 系统设置 - Persistent JFFS2 partition - Enable JFFS custom scripts and configs
- U 盘格式成 ext4 插到路由器
- 一个已经刷成 [Merlin 固件](https://www.asuswrt-merlin.net/) 的路由器

## 固件选择

- [官改固件](https://koolshare.cn/thread-139965-1-1.html) 是在官方的固件上的增强，增加了软件中心
- [原版 Merlin 固件](https://www.asuswrt-merlin.net/download)
- [Merlin 改版](http://koolshare.cn/thread-127878-1-1.html) 在原本梅林固件的基础上修改而来



## 刷机步骤
AC86U 的刷机步骤非常简单，通过网页「升级页面」，直接上传 `.w` 后缀的固件，然后等待刷机完成自动重启即可。

2020 年 11 月固件版本：3.0.0.4.386_40451_koolshare
2022 年 8 月升级到：3.0.0.4.386_41634_koolshare

## 启用 Clash 代理插件

禁用检测：

    sed -i 's/\\tdetect\_package/\\t# detect\_package/g' /koolshare/scripts/ks_tar_install.sh
    
[这里](https://github.com/hq450/fancyss) 是 shadowsocks 插件地址。

[这里](https://t.me/s/merlinclashcat) 是 Merlin Clash 插件。在这个 Telegram 频道中下载 merlinclash_hnd 开头的插件按照包。

## 在 Merlin firmware 下安装 Entware
Entware 是一个嵌入式设备的包管理工具，之前在 [QNAP NAS](/post/2019/05/entware-ng-usage.html) 上也有安装过。

梅林内置了 entware 安装脚本，直接在终端执行：

	entware-setup.sh

执行后 entware 会把软件安装在 `/opt` 目录下。

在安装 Entware 的时候记得一定保证网络环境畅通，否则下载下来的不完整的 opkg 二进制可能有各种问题，要不就是 Permission denied, 要不就是 Segmentation fault。

![amtm terminal menu](/assets/asus-rt-ac86u-merlin-amtm-terminal-menu.png)

在安装了 Entware 之后，就可以非常方便的进行常用的包安装，比如安装 [rsync](/post/2017/07/rsync-introduction.html):

	opkg update
	opkg install rsync

或者安装更加复杂的应用，比如说在路由器上

- 通过 Entware 安装 [Transmission](https://github.com/RMerl/asuswrt-merlin.ng/wiki/Installing-Transmission-through-Entware)
- 安装 [支持 PHP 的 Lighttpd Web 服务器](https://github.com/RMerl/asuswrt-merlin.ng/wiki/Lighttpd-web-server-with-PHP-support-through-Entware)
- 安装 Plex Server
- 安装 UPNP 服务器

等等很多特性，都可以在官方提供的[页面](https://github.com/RMerl/asuswrt-merlin.ng/wiki) 看到。

## 设置 Swap 分区
在之前的 [Linux swap 分区](/post/2018/04/linux-swap-partition.html) 的文章里面提过，Swap 分区会在系统物理内存将满的时候被使用，虽然 AC86U 自身具备了 500 多兆的内存，但是如果跑多了应用可能会很快被用尽。所以如果看到内存将被用满，可以尝试创建 swap 分区。

如果是 Merlin 的固件，通过 SSH 登录后台之后直接运行 `amtm`，这是梅林固件自带的一个终端管理工具，在其中可以非常快速的通过交互命令创建 swap 分区。如果想手动创建也可以通过如下的方式纯手工进行设置。[^amtm]

[^amtm]: <https://diversion.ch/amtm.html>

依次执行：

	dd if=/dev/zero of=/tmp/mnt/sda1/swapfile bs=1024 count=512000
	mkswap /tmp/mnt/sda1/swapfile
	swapon /tmp/mnt/sda1/swapfile

然后，创建启动脚本：

```
echo '
#!/bin/sh

# Turn On Usage Of Swapfile
if [ -f "/tmp/mnt/sda1/swapfile" ];then
swapon /tmp/mnt/sda1/swapfile
echo "Turning Swapfile On"
fi
' >> /jffs/scripts/post-mount
```

增加执行权限：

	chmod a+rx /jffs/scripts/*

这样系统每一次重启就会自动的使用该 swap 分区。
- <https://www.asuswrt-merlin.net/>


## 其他工具
可以通过 amtm 安装其他工具，比如：

	dnscrypt-proxy, skynet, diversion, mini dns-server


