---
layout: post
title: "Linux 管理开机启动"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, startup, script, shell, command]
last_updated:
---

如果想要科学的管理 Linux 的开机启动项，那么[了解](http://www.ruanyifeng.com/blog/2013/08/linux_boot_process.html) Linux 开机启动流程是非常有必要的。链接的文章将 Linux 开机启动流程讲述的非常通俗易懂，这里就不再详述。简单地归纳：

1. 加载内核 ，读入 `/boot` 目录下内核文件
2. 内核加载完成后，运行第一个程序 `/sbin/init`(PID 为 1)，用来初始化系统环境
3. 依据运行级别启动[守护进程](http://zh.wikipedia.org/wiki/%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)(daemon 或者称为服务）
4. 加载开机启动程序
5. 用户登录
6. 进入 login shell，依据不同的登录方式（命令行登录，ssh 登录，图形界面登录），系统加载不同的 shell 配置，基本上就完成启动了

这篇文章涉及到的开机启动项内容主要就是集中在上述的第 3,4 步。Linux 预置七种运行级别 (0-6)，系统在 `/etc` 目录会有各个运行级别对应的子目录，目录中指定要加载的程序

　　/etc/rc0.d
　　/etc/rc1.d
　　/etc/rc2.d
　　/etc/rc3.d
　　/etc/rc4.d
　　/etc/rc5.d
　　/etc/rc6.d

目录中的 `rc` 表示 run command，最后的 `d` 表示 directory 目录。`/etc/rcN.d`（其中 N 表示的 run level) 目录下是一系列启动脚本。文件都是以 `字母 S+ 两位数字 + 程序名` 的形式构成。字母 S 表示 Start，如果第一个字母是 K，那么表示 Kill 关闭。中间两位数字表示处理顺序，数字越小表示处理越早。不建议直接手动修改 `/etc/rcN.d` 目录下的文件。这就要涉及到本文的重点，如何科学的管理 Linux 自启动脚本。

## rcconf
使用命令 `apt-get install rcconf` 来安装， rcconf 使用了一个非常友好的界面来管理启动项，使用 `sudo rcconf` 就能看到一个开机启动时可以执行的程序列表，使用空格选中就能添加到开机启动，同理撤销选中就取消开机启动，最后 OK，保存就行。rcconf 是 `update-rc.d` 命令的 TUI(Text User Interface)。

几个重要的文件

- `/var/lib/rcconf/services` 用来保存服务启动 number，如果服务的启动顺序不是 20（默认），那么 rcconf 会将服务的启动顺序保存到该文件中以备重新启用时恢复。
- `/var/lib/rcconf/lock` Lock 锁
- `/var/lib/rcconf/guide` 管理员用来定义的 Guide

## update-rc.d

上一个 `rcconf` 命令中就提到了其实 rcconf 就是这个 `update-rc.d` 命令的封装，`update-rc.d` 命令可以用来安装或者移除 init 脚本。

    update-rc.d [-n] [-f] name remove
    update-rc.d [-n] name defaults
    update-rc.d [-n] name disable|enable [ S|2|3|4|5 ]

其中 `-n` 选项，不会做任何实际操作，但是会显示运行命令之后会执行的操作，可以用来检查命令。`-f` 命令可以记忆为 `force` 表示强行删除链接。

当执行该命令时，就是用将 `/etc/rcN.d/[SK]NNname` 指向 `/etc/init.d/name` ，如果有任何的 `/etc/rcN.d/[SK]??name` 存在的话，`update-rc.d` 不会做任何改动。

    update-rc.d service enable
    update-rc.d samba defaults
    update-rc.d mysql defaults 10 10  # 启动优先级，顺序
    update-rc.d apache2 start 10 2 3 4 5 . stop 90 0 1 6 .     # 指定优先级，启动时 10，关闭时 90，后面的 `2 3 4 5` 表示 run level
    update-rc.d -f samba remove       # 移除服务自启动

## sysv-rc-conf
使用命令安装 `apt-get install sysv-rc-conf` ，然后使用管理员运行 `sudo sysv-rc-conf`。

## systemctl
还有一个命令 `systemctl` 涉及太多 `systemd` 的内容，暂时先略过

## 手动
如果先要自己写一个服务，或者脚本开机启动，那么可以把文件放到 `/etc/init.d/` 目录下，改权限

    chmod +x /etc/init.d/startup.sh
    ln -s /etc/init.d/startup.sh /etc/rc.d/

## reference

- <http://www.debianadmin.com/manage-linux-init-or-startup-scripts.html>
- <http://manpages.ubuntu.com/manpages/xenial/man8/update-rc.d.8.html>
- <https://www.jamescoyle.net/cheat-sheets/791-update-rc-d-cheat-sheet>
