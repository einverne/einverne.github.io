---
layout: post
title: "lsb init scripts"
tagline: ""
description: ""
category: 学习笔记
tags: [lsb, init, debian, ubuntu, linux, startup, script ]
last_updated:
---

I found someone submit a pull-request to redis, which modify the init.d script. The modification make me curious about the init script. So this is the research result.

LSB stand for Linux Standard Base.

LSB-compliant init scripts need to:

- provide, at least, the following actions: start, stop, restart, force-reload, and status.
- return proper exit status codes
- document runtime dependencies
- [optionally] Log messages using the Init.d functions: log_success_msg, log_failure_msg and log_warning_msg


	#!/bin/sh
	### BEGIN INIT INFO
	# Provides:          scriptname
	# Required-Start:    $all
	# Required-Stop:
	# Default-Start:     2 3 4 5
	# Default-Stop:      0 1 6
	# Short-Description: Start daemon at boot time
	# Description:       Enable service provided by daemon.
	### END INIT INFO

解释：

- Provides 可识别名字
- Required-Start 启动此程序前要先启动那个项目
- Required-Stop 在哪一个项目前停止，可留白
- Default-Start 在哪些 run level 下启动程序 ，比如 `2 3 4 5`
- Default-Stop 在哪些 run level 下停止此程序，一般 `0 1 6`


几个虚设项目，以 `$` 开头

- `$local_fs` 本地文件系统被挂载，用到 `/var` 目录的启动项都需要依赖此
- `$network` 网络被启用
- `$named` 名称功能被启用
- `$remote_fs` 所有文件系统被挂载，包含 `/usr`
- `$syslog` 系统记录功能启用
- `$time` 系统时间被设定
- `$all` 所有项目

一般的 daemon 应该依赖 `$remote_fs` 和 `$syslog` ，核心模块驱动程序等，需要依赖 `$local_fs`

## Edit
在 `/etc/init.d` 目录下有一个 `skeleton` 文件，可以以此作为文件的基础来进行编辑。

### Actions

一个脚本需要提供 start, stop, restart, force-reload, status 这几个动作。

## reference

- <https://wiki.debian.org/LSBInitScripts>
- <http://rocksaying.tw/archives/19886844.html>
