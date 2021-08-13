---
layout: post
title: "每天学习一个命令：dpkg-reconfigure 命令重新配置软件包"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, dpkg-reconfigure, debian, ubuntu, linux-mint, ]
last_updated:
---

`dpkg-reconfigure` 命令是 Debian 系 Linux 中用来重新配置软件包的命令，运行该命令可以重新配置软件包第一次安装后的配置问题。

## 使用方式

    sudo dpkg-reconfigure [package name]

## 举例

常用的配置，比如配置语言

    sudo dpkg-reconfigure locales

配置 display manager

    sudo dpkg-reconfigure lightdm
    sudo dpkg-reconfigure mdm

配置时区

    sudo dpkg-reconfigure tzdata
