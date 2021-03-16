---
layout: post
title: "解决 Linux Mint 18.1 安装 NVIDIA 驱动后黑屏"
tagline: ""
description: ""
category: 经验总结
tags: [linux, nvidia, linux-mint,]
last_updated: 
---

Mint 下有一个 Driver Manager 驱动管理，手贱升级了一下到 378，下载，自动安装，重启倒是没有什么但问题，最关键的是，第二次重启的时候直接黑屏，之前也遇到过一回，记忆中是修改了 `/etc/X11/xorg.conf` 才修复这个问题，没想到这一次又遇到了这个问题。但是无论我怎么修复笔记本始终黑屏在，开机闪过 Linux Mint 的 logo 之后始终无法启动 x server。

## 第一步尝试卸载NVIDIA驱动

凭借这记忆中的印象，在启动登录之后 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>1~7</kbd> 1~7中的任意一个键，进入 tty 终端，用 root 用户登录，成功后在其中 `apt purge nvidia*` 移除所有 NVIDIA 驱动。然后重启。

## 第二部修改 xorg.conf

在第一步尝试不成功之后，尝试修改 `xorg.conf` 文件，在 `/etc/X11` 目录下发现了，原始的 xorg.conf 的备份，在尝试恢复以前版本的时候，X server 不断的报错，在查看 `cat /var/log/Xorg.0.log` 的时候发现 xorg.conf 配置有很大问题，尝试恢复原始设置失败，尝试自己手动修改配置失败。

    Section "ServerLayout"
        Identifier "layout"
        Screen 0 "nvidia"
        Inactive "intel"
    EndSection

    Section "Device"
        Identifier "intel"
        Driver "intel"
        BusID "PCI:0@0:2:0"
        Option "AccelMethod" "SNA"
    EndSection

    Section "Screen"
        Identifier "intel"
        Device "intel"
    EndSection

    Section "Device"
        Identifier "nvidia"
        Driver "nvidia"
        BusID "PCI:1@0:0:0"
        Option "ConstrainCursor" "off"
    EndSection

    Section "Screen"
        Identifier "nvidia"
        Device "nvidia"
        Option "AllowEmptyInitialConfiguration" "on"
        Option "IgnoreDisplayDevices" "CRT"
    EndSection

## 尝试重新安装 NVIDIA 驱动
甚至在终端下安装了 370, 331 版本的驱动多次尝试，尝试使用 NVIDIA 自带的命令 `nvidia-xconfig` 重新生成 xorg.conf ，终究无法成功启动 Cinnamon.

	dpkg-reconfigure nvidia-331

## 终极解决办法
寻找解决办法的时候，偶然间在论坛上看到有人留言，说，删除 xorg.conf 文件之后一切就正常了，我保证尝试的心态，将 `mv xorg.conf xorg.conf_backup` 之后，启动 `startx` 竟然进去了 Cinnamon。顿时感觉有希望，直接重启，用自己账户登录，果然可以了，同时还发现竟然把鼠标延迟的问题解决了。有时间真应该好好研究下 Linux 的启动过程和驱动配置。


## 外延
关于 Xorg，X.org 项目旨在创建和维护开源可在发行版 X11，在运行的硬件和图形界面之间提供接口。

关于 X server，是 X.org 项目的部分，是 X Window System 的重要组成部分。xorg.conf 文件是 X server 的主要配置文件

Mint 中系统额外的默认 Xorg 配置地址 `/usr/share/X11/xorg.conf.d`

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/einverne/33260819255/in/dateposted-public/" title="linux_trovalds_fuck_nvidia"><img src="https://c1.staticflickr.com/4/3862/33260819255_da339624db_z.jpg" width="640" height="480" alt="linux_trovalds_fuck_nvidia"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>

## reference

- <http://www.techbang.com/posts/9858-why-linus-torvalds-publicly-say-nvidia-fuck-you>
- <https://johners.tech/2017/01/11/installing-the-latest-nvidia-graphics-drivers-on-linux-mint-18/>
- <https://forums.linuxmint.com/viewtopic.php?t=232814>
- <http://slaytanic.blog.51cto.com/2057708/1630597>
- NVIDIA 官方驱动下载 <http://www.nvidia.com/Download/index.aspx?lang=en-us>
- <http://askubuntu.com/questions/162639/how-do-i-get-ubuntu-to-recognize-my-nvidia-graphics-card>
- <https://wiki.archlinux.org/index.php/Xorg_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)>