---
layout: post
title: "Entware-ng 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [entware-ng, package, linux, openwrt, merlin, 路由器 ,  ]
last_updated:
---

Entware-ng 是一个适用于嵌入式系统的软件包库，使用 opkg 包管理系统进行管理。之前的路由器刷了 Openwrt 之后直接能用命令行安装相关命令，之后的路由器，NAS 也能安装 Entware-ng 。可以将 Entware-ng 想象成嵌入式设备的一个包管理软件，能方便的用来在嵌入式设备上安装软件，现在在官方的源上已经有超过 2000 个软件包。

相关网址：

- <https://github.com/Entware/Entware>

## Installation

在群晖上安装

- <http://pkg.entware.net/binaries/armv7/Packages.html>

更具体的可以参考我之前的[文章](/post/2018/06/qnap-install-qpkg-from-command-line.html)

在 QNAP 上安装

- <https://github.com/Entware/Entware-ng/wiki/Install-on-QNAP-NAS>

## Usage

和普通 Linux 下的包管理一样，只要输入命令就能够联网下载相关软件。

    opkg update
    opkg install git

所有软件包列表可以查看 <http://pkg.entware.net/binaries/armv7/Packages.html>

通过 opkg 安装的软件启动脚本在 /opt/etc/init.d/ 目录

单个启动命令 /opt/etc/init.d/software_name start

