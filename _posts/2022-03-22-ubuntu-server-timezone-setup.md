---
layout: post
title: "Ubuntu 上命令行设置时区"
aliases: 
- "Ubuntu 上命令行设置时区"
tagline: ""
description: ""
category: 学习笔记
tags: [ ubuntu, server, timezone,  ]
last_updated:
---

一台新的 Ubuntu 服务器通常时区可能不是想要的时区，可以通过如下步骤设定时区。

检查当前时区，在命令行下输入 `date`:

    date

可以查看当前的时间。

输入 `timedatectl` 可以查看更具体的时区。

## 使用 timedatectl
修改为东八区北京时间。

    sudo timedatectl set-timezone "Asia/Shanghai"
    
## ln
也可以通过软链接来修改系统的时区，在 Linux 下 `/etc/localtime` 中定义了系统要使用的时区。正确的配置在 `/usr/share/zonefine` 目录中

    mv /etc/localtime /etc/localtime-backup
    ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

修改完成后可以通过 `timedatectl` 来验证。