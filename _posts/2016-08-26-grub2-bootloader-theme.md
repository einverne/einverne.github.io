---
layout: post
title: "Grub2 bootloader 主题"
aliases: "Grub2 bootloader 主题"
tagline: ""
description: ""
category: 经验总结
tags: [grub2, bootloader, theme, grub-theme]
last_updated:
---

之前把 Linux Mint Grub2 bootloader 的背景图片更换了一下，直接用的 [gnome-look](https://www.gnome-look.org/p/1252310/) 的 [Anonymous Hope 主题](https://www.gnome-look.org/p/1252310/) ，这里就记录一下，以便快速恢复。

Gnome-look 这个网站上有非常多人分享的内容，可以到这个网站自行选择自己喜欢的内容。

## Usage
一般 grub 的主题需要在 `/boot/grub/themes` 目录下。如果没有这个目录需要手动创建

    sudo mkdir -p /boot/grub/themes

然后将下载的文件内容拷贝到该目录下。完成拷贝之后需要修改一下 `/etc/default/grub` 配置文件，增加如下配置：

    GRUB_THEME="/boot/grub/themes/Anonymous-Hope/theme.txt"

然后更新 `grub.cfg`

    sudo update-grub

如果一切都按照步骤，应该可以看到日志显示

    Generating grub configuration file ...
    Found theme: /boot/grub/themes/Anonymous-Hope/theme.txt

然后一切 OK。

## reference

- <https://github.com/PowderLinux/Anonymous-Hope-GrubTheme>
