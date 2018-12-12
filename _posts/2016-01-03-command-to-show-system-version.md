---
layout: post
title: "查看系统版本和发行版信息"
tagline: ""
description: ""
category: Linux
tags: [linux, command,]
last_updated:
---

查看系统版本和发行版的命令有很多，这里就列一些比较常见的。

## 查看 Linux Kernel 版本

    uname -a
    Linux ev 4.4.0-66-generic #87-Ubuntu SMP Fri Mar 3 15:29:05 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux

    uname -r

## 查看发行版信息

print distribution-specific information

    lsb_release -a
    No LSB modules are available.
    Distributor ID:	Ubuntu
    Description:	Ubuntu 16.04.1 LTS
    Release:	16.04
    Codename:	xenial

## 使用 inxi

    inxi -S
