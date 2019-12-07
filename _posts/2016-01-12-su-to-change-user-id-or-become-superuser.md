---
layout: post
title: "每天学习一个命令：su 切换身份或者使用 superuser"
tagline: ""
description: ""
category: 每天学习一个命令
tags: [linux, command, su, superuser,]
last_updated:
---


su 用来切换身份或者升级成使用 superuser。如果没有加任何参数，则 su 默认变为 superuser。

## 参数格式

    su [options] [username]

su 命令用来改变当前登录 session 的用户身份。直接使用 `su` 默认成为 superuser，使用参数 `su -` 短横线，则完全切换成该用户登录的状态，连同环境变量一同切换，工作目录也会切换。


    -c 指令  或 --command= 指令 ：执行完指定的指令后，即恢复原来的身份； 
    -f 或——fast：适用于 csh 与 tsch，使 shell 不用去读取启动文件； 
    - 或 -l 或——login：改变身份时，也同时变更工作目录，以及 HOME,SHELL,USER,logname。此外，也会变更 PATH 变量； 
    -m,-p 或 --preserve-environment：变更身份时，不要变更环境变量； 
    -s 或 --shell=：指定要执行的 shell； 

## 使用

切换用户而不切换工作目录

    whoami   # 显示当前用户
    einverne
    pwd  # 当前目录
    /home/einverne
    su root # 切换到 root 用户
    Password:
    ev einverne # whoami
    root
    ev einverne # pwd
    /home/einverne
    ev einverne # exit
    exit

切换用户并切换工作目录

    whoami
    einverne
    pwd
    /home/einverne
    su -
    Password:
    ev ~ # pwd  # 注意此目录
    /root
    ev ~ #


