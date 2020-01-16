---
layout: post
title: "QNAP 上 SQL server 数据备份"
tagline: ""
description: ""
category: 经验总结
tags: [qnap, sql-server, mysql, maria, sql, backup]
last_updated:
---


平时没有注意备份 QNAP 上系统盘的数据，从昨天开始系统盘突然只读，而无法写入，发现磁盘有问题了，无奈只能边申请售后，边想着怎么备份数据，还要恢复这么多的配置。

平常的哪些文件备份倒是还好说，但是一直有用 QNAP 提供的 SQL server 服务，这部分数据平时也没有 mysqldump 下来，所以这就变得比较尴尬，但是 sql server 还有一种方法可以从物理文件中恢复。

用 ps 工具查看可以看到 [^data]：

	/bin/sh /usr/local/mysql/bin/mysqld_safe --datadir=/usr/local/mysql/var --pid-file=/var/lock/qmysql.pid --user=admin

`datadir` 就是 marialdb 真正存放数据的地方，ssh 进后台，备份该部分数据。

在该目录中能看到不同的文件

- FRM 表定义
- MYD 文件保存真实数据
- MYI 是索引文件

通常情况下 linux 是在 `/var/lib/mysql/` 文件夹下，QNAP 的地址是 `/usr/local/mysql/var` 目录下。

## Backup

使用 `rsync` 将该目录下的数据全部备份到另外的磁盘上

	rsync -azvhP --progress /usr/local/mysql/var/ /share/Backup/mysql_var/

## Restore
等 QTS 系统安装完成后，再使用 rsync 来将数据恢复回来。

[^data]: <https://forum.qnap.com/viewtopic.php?t=91799>



