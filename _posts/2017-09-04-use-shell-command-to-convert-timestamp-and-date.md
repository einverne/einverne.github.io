---
layout: post
title: "使用 Shell 命令来对 Unix 时间戳和日期进行转换 date 命令"
aliases: "使用 Shell 命令来对 Unix 时间戳和日期进行转换 date 命令"
tagline: ""
description: "熟悉 Shell 命令来对日期进行转换"
category: 学习笔记
tags: [shell, linux]
last_updated:
---

在程序中经常要使用到 Unix timestamp 和日期的转换，通常情况下都是 Google 一个时间戳转换的网页在进行转换，其实 Linux 命令中就有能够快速实现转换的命令。主要都是集中在 date 这个命令。date 命令主要用于显示或设定系统时间和日期。

## 修改系统的时区
Linux 用来修正系统的时区

	sudo dpkg-reconfigure tzdata

选择 Asia > Shanghai

## date 常用命令

### 获取当前的 Unix timestamp

	date +%s    # 返回 10 位时间戳，%s 表示从 1970-01-01 0 点 (epoch 开始的秒数）
	date +%s%3N # 返回 13 位时间戳，毫秒
	date +%s%N  # 返回 10 + 9 位纳秒

### 将时间戳转换成日期

	$ date +%s
	1504516338
	$ date -d @1504516338
	Mon Sep  4 17:12:18 CST 2017


### 将 string 日期转成日期
使用 `-d` 参数可以用来将输入 String 转成特定格式日期，如果不指定具体时间，date 会使用 `00:00:00`

	$ date -d "06/04/1989"
	Sun Jun  4 00:00:00 CDT 1989
1559192456
	$ date -d "04 June 1989"
	Sun Jun  4 00:00:00 CDT 1989
	$ date -d "June 04 1989"
	Sun Jun  4 00:00:00 CDT 1989
	$ date -d "June 04 1989 12:01:01"
	Sun Jun  4 12:01:01 CDT 1989

`-d` 选项也有一些其他很强大的功能，比如

	$ date -d '5 minutes ago' # 5 分钟前的时间
	Mon Sep  4 17:22:58 CST 2017
	$ date -d '100 days'      # 100 天以后的日期
	Wed Dec 13 17:29:14 CST 2017
	$ date -d '-100 days'     # 100 天以前的日子
	Sat May 27 17:30:01 CST 2017
	$ date -d '100 days ago'  # 同上
	Sat May 27 17:31:10 CST 2017
	$ date -d 'next monday'
	Mon Sep 11 00:00:00 CST 2017

或者 -d 选项还可以有这样的语法

    date -d@1559192456


### 格式化参数

可以使用 + 来输出不同格式

	date +%<format options>

比如

	$ date '+%Y-%m-%d %H:%M:%S'
	2017-09-04 17:38:46

Format options|	Purpose of Option	| Output
date +%a	| 缩略方式显示星期 (like Mon, Tue, Wed)	|Thu
date +%A	| 全称显示星期 (like Monday, Tuesday)	|Thursday
date +%b	| Displays Month name in short (like Jan, Feb, Mar )	|Feb
date +%B	| Displays Month name in full short (like January, February)	|February
date +%d	| Displays Day of month (e.g., 01)	|07
date +%D	| Displays Current Date; shown in MM/DD/YY	|02/07/13
date +%F	| Displays Date; shown in YYYY-MM-DD	|2013-02-07
date +%H	| Displays hour in (00..23) format	|23
date +%I	| Displays hour (01..12) format	|11
date +%j	| Displays day of year (001..366)	|038
date +%m	| Displays month (01..12)	|02
date +%M	| Displays minute (00..59)	|44
date +%S	| Displays second (00..60)	|17
date +%N	| Displays nanoseconds (000000000..999999999)	|573587606
date +%T	| Displays time; shown as HH:MM:SS Note: Hours in 24 Format	|23:44:17
date +%u	| Displays day of week (1..7); 1 is Monday	|4
date +%U	| Displays week number of year, with Sunday as first day of week (00..53)	|05
date +%Y	| Displays full year i.e. YYYY	|2013
date +%Z	| alphabetic time zone abbreviation (e.g., EDT)	|IS


## reference

- <https://stackoverflow.com/a/16548827/1820217>
- <http://www.cnblogs.com/peida/archive/2012/12/13/2815687.html>
