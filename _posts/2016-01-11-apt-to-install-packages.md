---
layout: post
title: "每天学习一个命令：apt 安装卸载软件"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [apt, linux, command, ubuntu,]
last_updated:
---

 APT 是 Advanced Packaging Tools 的缩写，是 Debian 及其派生的发行版（使用最广泛的 Ubuntu/Linux Mint 等等）的软件包管理器。 APT 可以自动下载、配置和安装二进制或源代码格式软件包，简化了 Unix 系统上管理软件的过程。 APT 最早被设计成 dpkg 的前端，用来处理 deb 格式的软件包。

APT 主要由以下几个命令组成：

- `apt-get`
- `apt-cache`
- `apt-file`

APT 能够自动处理软件的依赖问题，大大简化了工作流程

这里主要讲 `apt-get` 的常见用法

## 常用命令

### 搜索软件包

    apt search package_name

### 安装软件包

    apt install package

### 更新源

自动根据 `/etc/apt/sources.list` 中的设定，以及 `/etc/apt/sources.list.d` 目录下的设定，更新软件资料源。

    sudo apt update

使用如下命令安装更新

    sudo apt upgrade

### 移除软件源

    apt remove package  # 移除软件包，但是保留配置文件
    apt purge package #移除软件包并移除配置
    apt autoremove # 移除孤立的并不被依赖的软件包

### 列出软件清单

    apt list

### 升级系统

    sudo apt-get dist-upgrade


最后如果还有什么不明了的，可以 `man apk` 。

## 前端界面

我目前使用

- Synaptic



## reference

- <https://en.wikipedia.org/wiki/Advanced_Packaging_Tool>
- <https://help.ubuntu.com/community/AptGet/Howto>
