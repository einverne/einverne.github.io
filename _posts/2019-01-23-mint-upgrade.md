---
layout: post
title: "记录一下 Linux Mint 19 升级过程"
tagline: ""
description: ""
category: 经验总结
tags: [mint, linux, ubuntu, cinnamon,  ]
last_updated:
---

记录一下从 mint 18.3 升级到 19, 然后小版本升级的过程。虽然总结这篇文章的时候比较早，但是一直没有发布出去，现在想想 Mint 20 都快出了，放在这里做个记录吧。

都知道 Ubuntu 大版本更新极有可能会让一些熟悉的应用没有及时维护而无法使用。Mint 也是一样从 18.3 升级到 19 的过程就比较痛苦，需要升级各种依赖版本。

## 备份
使用 Mint 自带的 timeshift 应用进行备份：

	sudo apt install timeshift

查看当前的 dm, 并变更为 lightdm:

	cat/etc/X11/default-display-manager
	/usr/sbin/mdm
	sudo apt install lightdm lightdm-settings slick-greeter

	sudo dpkg-reconfigure lightdm

安装 mintupgrade:

	sudo apt install mintupgrade
	# 检查目前的依赖及安装包
	sudo mintupgrade check
	# 下载最新的安装包
	sudo mintupgrade download
	# 执行升级的过程
	sudo mintupgrade upgrade


Update 工具中，选择 Edit, 然后选择升级到某某某版本。

在升级 Ubuntu 或者 Mint 的时候，千万小心，有很大的程度可能导致无法进入系统，最好做到资料的备份，如果进不去系统也不要担心，Linux 下提供了很多 Debug 工具，可以通过各种方法做到不丢数据。现在想一想我 MSI 笔记本上的系统升级过两次大版本，都或多或少的遇到过各种问题，但从来没有丢过数据，并通过一些配置都可以很快的进入桌面。

