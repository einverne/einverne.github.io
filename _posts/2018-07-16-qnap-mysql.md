---
layout: post
title: "威联通折腾篇九：MySQL 设置"
aliases: "威联通折腾篇九：MySQL 设置"
tagline: ""
description: ""
category: 经验总结
tags: [mysql, qnap, qnap-tutorial, ]
last_updated:
---

威联通自带 MySQL 当前我使用的版本是 MariaDB 5.5.57 ，威联通也可以看成是类 Unix 系统吧，但是他和 Linux 还是有很多不同，毕竟深度定制过。

MySQL 在威联通的配置路径在

    /etc/config/my.cnf

找到该文件，其他配置就和 MySQL 一样了。

如果想要 MySQL 支持远程访问，在 “控制台” - “应用服务” - “MySQL 服务器” 中选择允许远程连接即可。此时设定一个比较强的密码。


