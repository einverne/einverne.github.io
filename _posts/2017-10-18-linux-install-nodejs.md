---
layout: post
title: "Linux 安装 nodejs"
tagline: ""
description: ""
category: 学习笔记
tags: [Linux, nodejs,]
last_updated: 
---

大部分情况下 Debian/Ubuntu 下只要使用包管理直接安装 

	sudo apt-get install nodejs
	sudo apt-get install npm

即可，可是今天网络环境太差，不是 npm package not found 就是 update 半天不动。

[官网](https://nodejs.org/en/download/package-manager/) 提供的安装方式

	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs

也是网络环境无法安装

所以使用 二进制 安装

在官网 <https://nodejs.org/en/download/> 找到编译好的二进制文件

然后解压到 `/usr/local` 目录下

然后配置 `vim ~/.zshrc`

	export NODE_HOME=/usr/local/node-v6.11.4-linux-x64/
	export PATH=$NODE_HOME/bin:$PATH

使用命令检查

	node -v
	npm -v

输出即可。
