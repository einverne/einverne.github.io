---
layout: post
title: "balenaEtcher 开源跨平台镜像写入工具"
aliases:
  - "balenaEtcher 开源跨平台镜像写入工具"
tagline: ""
description: ""
category: 经验总结
tags: [ etcher, flash, usb, iso, ubuntu, proxmox, pve]
create_time: 2025-10-27 15:29:41
last_updated: 2025-10-27 15:29:41
dg-home: false
dg-publish: false
---

[balenaEtcher](https://etcher.balena.io/) 是一个开源的跨平台镜像写入工具，可以将操作系统镜像文件安全写入到 SD 卡或者 USB 设备（比如 U 盘中），由 balena 公司开发，大大简化了镜像文件烧录的过程。无论是需要安装 Linux 发行版，或者是制作树莓派系统盘，或者安装 Proxmox VE，还是制作 Ventoy 多系统启动盘，balenaEtcher 都可以以最简单的方式完成。

## 功能

- 跨平台，支持 Windows，macOS，Linux 操作系统
- 简单易用，无需命令行，选择镜像，选择目标磁盘，点击 Flash 即可完成烧录
- Etcher 在完成烧录之后会自动进行数据验证，确保数据安全
- Etcher 完全开源
- 内置了强大的安全防护机制。软件默认会隐藏系统硬盘，防止用户误操作格式化本地存储设备。
- balenaEtcher 支持 ISO、IMG、ZIP、DMG、GZ、BZ2 等 16 种以上的镜像文件格式，大多数镜像文件都无需解压即可直接烧录。
- 支持使用专门的硬件工具同时对多达 16 个驱动器进行烧录，大大提高了批量制作启动盘的效率

## 安装

在 macOS 下直接安装

```
brew install --cask balenaetcher
```

其他系统可以到官网点击安装包进行安装。
