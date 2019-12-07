---
layout: post
title: "每天学习一个命令：inxi 显示系统和硬件信息"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, ]
last_updated:
---

inxi 是一个用来显示系统基本信息的脚本，输出结果经过整理适合打印到控制台或者 IRC，也非常适合在论坛中寻求技术支持时将结果贴出来。inxi 的输出信息包括系统硬件，CPU，驱动，Xorg，桌面环境，Kernel，GCC 版本，Processes，内存使用量，和其他一些信息。结果的输出颜色可以使用 `-c 0` 来禁用。

为了尽可能的保持基本的隐私和安全，inxi 自动过滤了一些敏感信息，包括网卡 mac 地址，WAN 和 LAN IP 地址，桌面用户名和其他一些内容。

## 安装

    sudo apt-get install inxi

## 参数说明

    -A          显示音频 声卡相关信息
    -b          输出基本信息
    -c [0-32]   不同的配色
    -C          显示完整的 CPU 信息
    -d          显示光驱和硬盘相关信息
    -D          显示硬盘相关信息
    -F          完整报告
    -G          显卡
    -i          WAN IP
    -I          processes, uptime, memory, shell type etc
    -m          RAM data
    -M          machine data 主板，BIOS etc
    -p          完整分区信息
    -S          系统信息，hostname，kernel，桌面环境，发行版等等
    -u          分区 UUID

## 使用实例

### 查看电脑硬件型号

    inxi -F

### 监控 CPU 进程和内存使用

    inxi -t c
    inxi -t m
    inxi -t cm

### 查看 CPU 温度和风扇速度

    inxi -s
