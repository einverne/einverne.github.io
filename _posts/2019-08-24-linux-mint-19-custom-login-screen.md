---
layout: post
title: "Linux Mint 19 自定义登录界面"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, mint, linux-mint, lightdm, mdm, login-manager, ]
last_updated:
---

Linux Mint 19 不支持 MDM 显示管理器，您需要安装 LightDM

检查当前显示管理

	cat /etc/X11/default-display-manager

如果输出 mdm 则需要更换

	sudo apt install lightdm lightdm-settings slick-greeter
	sudo dpkg-reconfigure lightdm

这里的 mdm 和 lightdm 值得都是 Linux Login manager，或者也被叫做 Linux Display Manager。更多的选择可以看[这里](https://www.slant.co/topics/2053/~best-linux-display-manager)

## 配置
显示配置

	/usr/sbin/lightdm --show-config

## 修改背景图片
Linux Mint 下系统自带壁纸在

	/usr/share/backgrounds/

更多的配置参考： <https://wiki.debian.org/LightDM>

## 更多主题

- https://www.gnome-look.org/search/projectSearchText/login
