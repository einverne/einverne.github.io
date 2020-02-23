---
layout: post
title: "树莓派系统安装及设置"
tagline: ""
description: ""
category: 经验总结
tags: [raspberrypi, linux,]
last_updated: 
---

树莓派官网有很多系统可以[选择](https://www.raspberrypi.org/downloads/)，我选了官方维护的 Raspbian 基于 Debian 的衍生版，主要是熟悉他的 APT 包管理，看评价三方维护的 Snappy Ubuntu Core 换用了其他的 snap 的管理，不是很了解，所以还是选择了 Raspbian。

## 系统安装

官网提供的[教程](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)非常方便， 采用开源的镜像烧录工具 [Etcher](https://etcher.io/) 非常方便的就可以在三大平台上完成镜像到 SD 的烧录。当然如果熟悉各个平台的工具也可以自己手动完成烧制。


## 启动系统

在将系统写入 microSD 卡之后，将卡插入树莓派板子，启动树莓派，开机即可，可以用 HDMI 接口连接显示器，用一个外接键盘来输入。树莓派的默认用户名是: `pi` ，默认密码为: `raspberry` 。

### root 账户

使用如下命令给 root 账户设置密码并允许登录

	sudo passwd root
	# 然后输入密码
	# 用同样的方式修改默认账户 pi 的密码
	sudo passwd pi

### 启用 SSH

raspbian 自带 SSH ，启动

	sudo service ssh start

### 其他配置

	raspi-config

运行该命令可以看到一系列的选项，比如修改 Hostname ,修改密码等等选项，可以配置一下。

### 更换 sources.list

换用清华的源 : <https://mirror.tuna.tsinghua.edu.cn/help/raspbian/>

## 必备应用

	apt install vim
	apt install samba samba-common-bin
	apt install zsh
	apt-get install nginx
	sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
	chsh -s /bin/zsh
	apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
	libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
	xz-utils tk-dev
	curl -L https://raw.githubusercontent.com/pyenv/pyenv-installer/master/bin/pyenv-installer | bash
	apt install mysql-server
	apt-get install libmysqlclient-dev


