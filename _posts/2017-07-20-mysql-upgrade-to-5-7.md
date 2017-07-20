---
layout: post
title: "将 MySQL 升级到 5.7"
tagline: ""
description: ""
category: 经验总结
tags: [MySQL, Linux,]
last_updated: 
---

这些天折腾 Django 的时候用到了 MySQL，然而本地和VPS 上使用的版本不一致，本地使用了 5.7 版本，而 VPS 上使用了 5.5 的老版本，在数据迁移的时候遇到了 5.5 版本下不支持 DATETIME(6) 这样的数据类型。 DATETIME(6) 用来保存精确到微秒的时间。

环境：

系统：Debian 7, 按道理 Ubuntu/Debian 系应该都可以


无奈只能升级 MySQL 到 5.7 , 结果也比较顺利，官方有很[详细](https://dev.mysql.com/downloads/repo/apt/) 的升级说明:

	wget http://dev.mysql.com/get/mysql-apt-config_x.y.z-1_all.deb  # 从官网找到最新的版本，上面的链接中有
	sudo dpkg -i mysql-apt-config_x.y.z-1_all.deb
	sudo apt-get update
	sudo apt-get install mysql-server

在中间弹出配置框时选择 5.7 ，应用，即可

	mysql --version

最后记得运行

	sudo mysql_upgrade -u root -p


## reference

- <https://askubuntu.com/questions/750498/mysql-5-5-update-to-mysql-5-7>
- <https://dev.mysql.com/doc/refman/5.7/en/upgrading-from-previous-series.html>
