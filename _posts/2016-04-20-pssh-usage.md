---
layout: post
title: "每天学习一个命令：pssh 一条命令在多个主机上执行"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [pssh, ssh, openssh, ]
last_updated:
---

OpenSSH 毫无疑问是世界上使用最广泛允许用户通过终端安全连接远程主机的工具了，但是 OpenSSH 存在一个比较大的问题就是不能在多台主机中执行相同的命令，OpenSSH 并不是设计做此用途的。所以 Parallel SSH 或者简称 PSSH 就出现了。PSSH 是一个 python 编写的用来在多台主机中并行执行相同命令的工具。

PSSH 工具集包含如下命令：

- pssh
- pscp
- prsync
- pnuke - 并行在多台机器中杀死进程
- pslurp - 从多台主机中拷贝文件到中心主机

## installation

    sudo apt install python-pip
    sudo pip install pssh

## 使用

首先创建 pssh host 文件

    192.168.0.10:22
    192.168.0.11:22

比如执行 echo

    pssh -h pssh-hosts-file -l root -A echo "TEST"

比如查看硬盘使用情况

    pssh -h pssh-hosts-file -l root -A -i "df -hT"

同理

    pssh -h pssh-hosts-file -l root -A -i "uptime"


## 总结
PSSH 工具适合用来在管理员需要在多台主机上执行重复命令时。

## reference

- <https://gtk.pw/P-gcU>
