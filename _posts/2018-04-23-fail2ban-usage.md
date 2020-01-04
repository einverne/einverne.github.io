---
layout: post
title: "VPS 安全保护：使用 fail2ban 防止暴力破解"
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

## Configurarion
fail2ban 的主要配置都集中在 `/etc/fail2ban/` 目录下

- fail2ban.conf 主要是 fail2ban 自身的配置，包括日志级别，日志存储位置，PID 等
- jail.conf 是配置 fail2ban 功能配置

fail2ban 的功能可以分散在不同的文件中进行管理，配置优先顺序是：

- jail.conf
- jail.d/*.conf
- jail.local
- jail.d/*.local

在 `jail.local` 中配置

	[ssh]
	enabled  = true
	port     = ssh, 10022
	filter   = sshd
	logpath = /var/log/auth.log
	maxretry = 5

修改配置后可以使用如下方法来重新加载配置：

	fail2ban-client reload

## fail2ban-client
查看状态：

	fail2ban-client status

## 分析
测试筛选规则设否匹配当前的日志格式 auth.log

	fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf

## 查看生效
用 iptables 来查看：

	sudo iptables -L -v -n

