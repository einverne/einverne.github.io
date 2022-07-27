---
layout: post
title: "Linux 常用命令合集"
aliases: "Linux 常用命令合集"
tagline: ""
description: ""
category: 整理合集
tags: [commands, linux, cli, network, cpu, collection, ]
last_updated:
---

部分内容为 《Linux 命令速查手册》读书记录。

## 系统

    uname -a               # 查看内核 / 操作系统 /CPU 信息
    head -n 1 /etc/issue   # 查看操作系统版本
    cat /proc/cpuinfo      # 查看 CPU 信息
    hostname               # 查看计算机名
    lspci -tv              # 列出所有 PCI 设备
    lsusb -tv              # 列出所有 USB 设备
    lsmod                  # 列出加载的内核模块
    env                    # 查看环境变量

## 资源
监视系统资源，包括跟踪正在运行的程序 （ps，top）终止进程（kill），列出打开的文件（[lsof](/post/2017/04/lsof-lists-openfiles.html)），报告系统内存占用（free），磁盘空间占用（[df](/post/2017/04/df-disk-free-space.html)，[du](/post/2018/03/du-find-out-which-fold-take-space.html)）等等。

    ps aux                  # 查看系统正在运行的进程
    ps -ef                  # 查看所有进程
    ps f                    # 查看进程树
    top                     # 实时显示进程状态
    kill -9 PID             # 终止正在运行的进程 -9 强制中断， -15 正常中止
    lsof                    # 列出打开的文件
    free -m                 # 查看内存使用量和交换区使用量
    df -h                   # 查看各分区使用情况
    du -sh 《目录名》        # 查看指定目录的大小
    grep MemTotal /proc/meminfo   # 查看内存总量
    grep MemFree /proc/meminfo    # 查看空闲内存量
    uptime                  # 查看系统运行时间、用户数、负载
    cat /proc/loadavg       # 查看系统负载

## 磁盘和分区

    mount | column -t      # 查看挂接的分区状态
    fdisk -l               # 查看所有分区
    swapon -s              # 查看所有交换分区
    hdparm -i /dev/hda     # 查看磁盘参数（仅适用于 IDE 设备）
    dmesg | grep IDE       # 查看启动时 IDE 设备检测状况

## 网络
这里列举了常用和网络相关的命令，包括查看本地 IP（ifconfig），判断网络连通性（ping，traceroute) 等等。其中 ifconfig, iwconfig ，route 等等命令都有双重用途，不仅能够查看网络连接属性，也能够进行配置。

    ifconfig               # 查看所有网络接口的属性
    ifup eth0              # 开启网络
    ifdown eth0            # 关闭 eth0 网卡
    iwconfig               # 查看无线接口属性
    iptables -L            # 查看防火墙设置
    ping                   # 网络连通性
    route -n               # 查看路由表
    netstat -lntp          # 查看所有监听端口
    netstat -antp          # 查看所有已经建立的连接
    netstat -s             # 查看网络统计信息
    traceroute https://google.com  # 显示数据包从计算机路由到指定的主机经过的每一步
    mtr                    # traceroute 更好的代替
    host                   # 查看网站 DNS 结果
    dhclient -r eth0       # 使用 DHCP 获得新网络地址

mtr 使用[介绍](/post/2017/11/mtr-usage.html)

## 用户

    w                      # 查看活动用户
    id 《用户名》            # 查看指定用户信息
    last                   # 查看用户登录日志
    cut -d: -f1 /etc/passwd   # 查看系统所有用户
    cut -d: -f1 /etc/group    # 查看系统所有组
    crontab -l             # 查看当前用户的计划任务

## 服务

    chkconfig --list       # 列出所有系统服务
    chkconfig --list | grep on    # 列出所有启动的系统服务


