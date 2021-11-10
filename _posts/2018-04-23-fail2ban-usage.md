---
layout: post
title: "VPS 安全保护：使用 fail2ban 防止暴力破解"
aliases: "VPS 安全保护：使用 fail2ban 防止暴力破解"
tagline: ""
description: ""
category: 学习笔记
tags: [linux, fail2ban, security, sshd, password, ]
last_updated:
---

之前的文章里面也总结过一些 fail2ban 的[简单使用](/post/2018/03/vps-security.html)，这里就扩展开来，把一些常见的使用方式记录一下，以便后面回顾。

今天想起这件事情主要是看到日志发现新建的服务（非标准端口）也有人不断的扫描，尝试登录，虽然已经设置过 SSH，nginx 端口的 fail2ban，但是没有考虑到所有的服务端口。

## Installation

	sudo apt install fail2ban

## Configuration
fail2ban 的主要配置都集中在 `/etc/fail2ban/` 目录下

- fail2ban.conf 主要是 fail2ban 自身的配置，包括日志级别，日志存储位置，PID 等
- jail.conf 是配置 fail2ban 功能配置

fail2ban 的功能可以分散在不同的文件中进行管理，配置优先顺序是：

- `jail.conf`
- `jail.d/*.conf`
- `jail.local`
- `jail.d/*.local`

在 `jail.local` 中配置

	[ssh]
	enabled  = true
	port     = ssh, 10022
	filter   = sshd
	logpath = /var/log/auth.log
	maxretry = 5

修改配置后可以使用如下方法来重新加载配置：

	fail2ban-client reload

## N 次尝试后永久禁止 IP
用上面的方法配置 ssh 后查看 Nginx access 日志还依然有非常多的 IP 再不停的扫描，所以想办法如果能把 fail2ban 的日志过滤出来然后再给 fail2ban 就可以把 fail2ban 中发现的 IP 再 block 掉。

参考该[链接](http://whyscream.net/wiki/index.php/Fail2ban_monitoring_Fail2ban) 中内容新增 filter，然后配置：

	[fail2ban]
	enabled = true
	filter = fail2ban
	action = iptables-allports[name=fail2ban]
	logpath = /var/log/fail2ban.log
	# findtime: 1 day
	findtime = 86400
	# bantime: 1 year
	bantime = 31536000

解决方法来自 [stackoverflow](https://serverfault.com/a/415357/288331)

## fail2ban-client
查看状态：

	fail2ban-client status

## 分析
测试筛选规则设否匹配当前的日志格式 auth.log

	fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf

## 查看生效
用 iptables 来查看：

	sudo iptables -L -v -n


## 其他配置

### MySQL

```
[mysqld]
port = 3306
logpath = /var/log/mysql/error.log
log_warnings = 2
maxretry = 5
```