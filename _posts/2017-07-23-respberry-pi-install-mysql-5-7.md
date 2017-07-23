---
layout: post
title: "树莓派中安装MySQL 5.7"
tagline: ""
description: ""
category: 经验总结
tags: [MySQL, Linux, RespberryPi, ]
last_updated: 
---

最近用到 MySQL 5.7 把所有设备上的 MySQL 版本都升级到了最新，在 Ubuntu/Debian 上[升级MySQL 5.7](/post/2017/07/mysql-upgrade-to-5-7.html) 的内容可以在之前的文章看到。现在记录一下树莓派中升级 MySQL 的步骤。使用到 MySQL 5.7 主要也是因为其支持的新数据类型，之前项目用到了，迁移的时候会遇到问题。在网上寻找解决方案的时候遇到了一个和我遭遇差不多的，需要使用到 MySQL 5.7+ 才支持的 JSON data-type。

在 respberry pi 官方的源中，只有稳定版的 5.5 MySQL，如果要用到最新的版本只能够自己手动编译更新安装，幸而 Debian 提供了编译好的[安装包](http://ftp.debian.org/debian/pool/main/m/mysql-5.7/) ，根据以下步骤就能够安装上。

## 下载依赖
`apt-get` 安装

	sudo apt-get install libaio1 libaio-dev libhtml-template-perl libevent-core-2.0-5

需要安装新版本的 gcc，所以要从 stretch 源中拉取

	sudo vim /etc/apt/sources.list
	# change jessie to stretch

	sudo apt-get update
	sudo apt-get install gcc-6 g++-6

	# change stretch back to jessie 
	sudo apt-get update

然后安装两个依赖

	wget http://ftp.debian.org/debian/pool/main/m/mecab/libmecab2_0.996-3.1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/l/lz4/liblz4-1_0.0~r131-2+b1_armhf.deb
	sudo dpkg -i libmecab2_0.996-3.1_armhf.deb
	sudo dpkg -i liblz4-1_0.0~r131-2+b1_armhf.deb

## 移除原来的版本

	sudo apt-get --purge remove mysql-server # and a lot of like client, common etc

## 安装最新版

下载 deb 并安装

	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/libmysqlclient-dev_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/libmysqlclient20_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/libmysqld-dev_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/mysql-client-5.7_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/mysql-client-core-5.7_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/mysql-server-5.7_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-5.7/mysql-server-core-5.7_5.7.18-1_armhf.deb
	wget http://ftp.debian.org/debian/pool/main/m/mysql-defaults/mysql-common_5.8+1.0.2_all.deb

	sudo dpkg -i mysql-common_5.8+1.0.2_all.deb
	sudo dpkg -i mysql-client-core-5.7_5.7.18-1_armhf.deb
	sudo dpkg -i mysql-client-5.7_5.7.18-1_armhf.deb
	sudo dpkg -i mysql-server-core-5.7_5.7.18-1_armhf.deb
	sudo dpkg -i mysql-server-5.7_5.7.18-1_armhf.deb

注意这里的版本号，可能之后会更新，去 ftp 中获取最新的版本在这里替换即可。

安装完成之后 `sudo reboot`

在启动之后

	mysql_upgrade -u root -p --force
	# 然后输入密码
	sudo service mysql restart

安装完毕。

## reference

- <http://dariancabot.com/2017/04/26/raspberry-pi-installing-mysql-5-7-on-jessie/>
