---
layout: post
title: "Linux 常用命令合集"
tagline: ""
description: ""
category: 整理合集
tags: [commands, linux, network, cpu]
last_updated:
---

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

    free -m                # 查看内存使用量和交换区使用量
    df -h                  # 查看各分区使用情况
    du -sh 《目录名》        # 查看指定目录的大小
    grep MemTotal /proc/meminfo   # 查看内存总量
    grep MemFree /proc/meminfo    # 查看空闲内存量
    uptime                 # 查看系统运行时间、用户数、负载
    cat /proc/loadavg      # 查看系统负载


## 磁盘和分区

    mount | column -t      # 查看挂接的分区状态
    fdisk -l               # 查看所有分区
    swapon -s              # 查看所有交换分区
    hdparm -i /dev/hda     # 查看磁盘参数（仅适用于 IDE 设备）
    dmesg | grep IDE       # 查看启动时 IDE 设备检测状况

## 网络

    ifconfig               # 查看所有网络接口的属性
    iptables -L            # 查看防火墙设置
    route -n               # 查看路由表
    netstat -lntp          # 查看所有监听端口
    netstat -antp          # 查看所有已经建立的连接
    netstat -s             # 查看网络统计信息


## 进程

    ps -ef                 # 查看所有进程
    top                    # 实时显示进程状态

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


