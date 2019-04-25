---
layout: post
title: "Linux 启动项管理"
tagline: ""
description: ""
category: Linux
tags: [linux, 学习笔记 ]
last_updated: 
---

Linux 启动项管理

Debian/Ubuntu/Linux Mint 系利用 update-rc.d 来管理 Linux 自启动服务。RedHat/Fedora/CentOS  下貌似有一个 chkconfig 来管理。

而我使用的 Linux Mint 自带的启动服务管理配置地址在 `~/.config/autostart` 目录下。

Linux 中的服务通常利用 `/etc/init.d/` 目录下的脚本进行启动，停止或者重新加载等操作。一般情况下如果安装完服务之后，该服务会自动启动。比如安装完 _apache2_ 之后， apache 服务会在下次启动时自动启动。如果不需要 apache2 随机启动，可以你禁用自启动，然后在需要的时候手动的启动 apache 服务

    # /etc/init.d/apache2 start

先看一下启动脚本的内容

    # ls -l /etc/rc?.d/*apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc0.d/K09apache2 -> ../init.d/apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc1.d/K09apache2 -> ../init.d/apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc2.d/K09apache2 -> ../init.d/apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc3.d/K09apache2 -> ../init.d/apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc4.d/K09apache2 -> ../init.d/apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc5.d/K09apache2 -> ../init.d/apache2
    lrwxrwxrwx 1 root root 17 Feb  5 21:47 /etc/rc6.d/S09apache2 -> ../init.d/apache2

运行级别(run level) 从 0，1到6，在每一个链接前有K和S区别，K 表示 Kill  停止一个服务，而 S 表示 Start 启动一个服务。

不同的运行级别定义如下：

    # 0 - 停机
    # 1 - 单用户模式
    # 2 - 多用户，没有 NFS
    # 3 - 完全多用户模式(标准的运行级)
    # 4 – 系统保留的
    # 5 - X11 （x window)
    # 6 - 重新启动

## Debian (Ubuntu/Linux Mint)

### rcconf

Debian 系Linux下利用 rcconf 管理自启动脚本，rcconf的全称是 Debian Runlevel Configuration tool， 运行级别配置工具。作用和 update-rc.d 类似，但是更加直观简洁。他是一个 TUI(Text User Interface)。

[rcconf](http://man.he.net/man8/rcconf)

    sudo apt-get install rcconf
    sudo rcconf

运行之后就会出现非常直观的配置界面，用方向键，空格，Tab就能够实现配置。如果熟悉命令依然可以通过 rcconf 命令来进行快速配置。


### update-rc.d

如果想要完全禁止 apache2 服务，需要删除 `/etc/rcX.d/` 目录下所有的链接，而使用 update-rc.d 

    # update-rc.d -f apache2 remove

添加自启动服务

    # update-rc.d apache2 defaults
    Adding system startup for /etc/init.d/apache2 ...
    /etc/rc0.d/K20apache2 -> ../init.d/apache2
    /etc/rc1.d/K20apache2 -> ../init.d/apache2
    /etc/rc6.d/K20apache2 -> ../init.d/apache2
    /etc/rc2.d/S20apache2 -> ../init.d/apache2
    /etc/rc3.d/S20apache2 -> ../init.d/apache2
    /etc/rc4.d/S20apache2 -> ../init.d/apache2
    /etc/rc5.d/S20apache2 -> ../init.d/apache2

从上面的log中可以看到，默认的优先级是20（K和S后面数字）和 91 有很大区别。 S20 链接早于 S91 启动， K91 在 K20 之前停止。

如果想要 apache2 服务以 91 优先级启动或者停止，可以使用

    # update-rc.d apache2 defaults 91
    Adding system startup for /etc/init.d/apache2 ...
    /etc/rc0.d/K91apache2 -> ../init.d/apache2
    /etc/rc1.d/K91apache2 -> ../init.d/apache2
    /etc/rc6.d/K91apache2 -> ../init.d/apache2
    /etc/rc2.d/S91apache2 -> ../init.d/apache2
    /etc/rc3.d/S91apache2 -> ../init.d/apache2
    /etc/rc4.d/S91apache2 -> ../init.d/apache2
    /etc/rc5.d/S91apache2 -> ../init.d/apache2

如果需要为启动和停止设置不同的优先级，则可以

    # update-rc.d apache2 defaults 20 80
    Adding system startup for /etc/init.d/apache2 ...
    /etc/rc0.d/K80apache2 -> ../init.d/apache2
    /etc/rc1.d/K80apache2 -> ../init.d/apache2
    /etc/rc6.d/K80apache2 -> ../init.d/apache2
    /etc/rc2.d/S20apache2 -> ../init.d/apache2
    /etc/rc3.d/S20apache2 -> ../init.d/apache2
    /etc/rc4.d/S20apache2 -> ../init.d/apache2
    /etc/rc5.d/S20apache2 -> ../init.d/apache2

这样启动为20，停止为80. 而如果需要自定义不同的运行级别，则可以

    # update-rc.d apache2 start 20 2 3 4 5 . stop 80 0 1 6 .
    Adding system startup for /etc/init.d/apache2 ...
    /etc/rc0.d/K80apache2 -> ../init.d/apache2
    /etc/rc1.d/K80apache2 -> ../init.d/apache2
    /etc/rc6.d/K80apache2 -> ../init.d/apache2
    /etc/rc2.d/S20apache2 -> ../init.d/apache2
    /etc/rc3.d/S20apache2 -> ../init.d/apache2
    /etc/rc4.d/S20apache2 -> ../init.d/apache2
    /etc/rc5.d/S20apache2 -> ../init.d/apache2

如此之后，在运行级别 2, 3, 4, 5 为S20 ，运行级别 0, 1, 6 则是 K80.

同样可以更加复杂

    # update-rc.d apache2 start 20 2 3 4 . start 30 5 . stop 80 0 1 6 .
    Adding system startup for /etc/init.d/apache2 ...
    /etc/rc0.d/K80apache2 -> ../init.d/apache2
    /etc/rc1.d/K80apache2 -> ../init.d/apache2
    /etc/rc6.d/K80apache2 -> ../init.d/apache2
    /etc/rc2.d/S20apache2 -> ../init.d/apache2
    /etc/rc3.d/S20apache2 -> ../init.d/apache2
    /etc/rc4.d/S20apache2 -> ../init.d/apache2
    /etc/rc5.d/S30apache2 -> ../init.d/apache2

## RedHat/Fedora/CentOS
[chkconfig](http://linux.die.net/man/8/chkconfig)

    sudo chkconfig --add apache2

or

    sudo chkconfig -- level 35 apache2 on

关于 chkconfig 更多的用法可以参考[这里](http://www.aboutlinux.info/2006/04/enabling-and-disabling-services-during_01.html)

## reference

- <http://unix.stackexchange.com/questions/33793/how-to-auto-start-a-service-apache2-with-linux-mint>
- <https://www.debuntu.org/how-to-managing-services-with-update-rc-d/>
- <http://manpages.ubuntu.com/manpages/xenial/en/man8/update-rc.d.8.html>
- <http://www.aboutlinux.info/2006/04/enabling-and-disabling-services-during_01.html>
- <https://packages.debian.org/wheezy/rcconf>
