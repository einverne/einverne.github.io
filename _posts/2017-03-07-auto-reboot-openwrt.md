---
layout: post
title: "使用 Cron 定时重启 Openwrt 路由器"
tagline: ""
description: ""
category: 经验总结
tags: [Linux, crontab, Openwrt, Router]
last_updated:
---

最近了解了一下 Cron，也在 WizNote [上](http://note.wiz.cn/pages/manage/biz/payRead.html?kb=8b40bf53-6ce7-4f5e-bbfc-99b2628340f3) 记录了一些笔记。学习一个新命令最好的方法就是将其用于实践。于是正好在 Openwrt 路由器上跑一下。

## 定时任务

使用 `crontab -e` 编辑 Openwrt 的定时任务，添加如下

    # Reboot at 4:30am every day
    # Note: To avoid infinite reboot loop, wait 70 seconds
    # and touch a file in /etc so clock will be set
    # properly to 4:31 on reboot before cron starts.
    30 4 * * * sleep 70 && touch /etc/banner && reboot

这个 task 将在每天 4:30am 的时候重启路由器。

需要注意的是，一定要延迟重启，否则可能无限重启，官方给出的配置 [^official] 中，在 `sleep 70` 秒之后，使用 `touch` 写文件，因为路由器如果没有及时联网从 NTP 服务器上获取到时间，那么路由器的系统时间和重启的系统时间便一样，如果修改过文件，Openwrt 开机后会把最后修改或者访问的文件时间作为默认系统时间。因此延迟 70s 重启，可以避免这个问题。

小知识点，OpenWrt 会在开机时检测 /etc 目录下最近修改的文件，并将该文件修改的时间戳作为开机的初始时间。

[^official]: 官方配置详解：<https://wiki.openwrt.org/doc/howto/cron>

## cron 语法
一个 crontab 的配置文件，通过前五个域来表示时刻，时期，甚至是时间段。每一个域中，可以包含 `*` 或者逗号分割的数字，或者 `-` 连接的数字。

    *     *     *   *    *        command to be executed
    -     -     -   -    -
    |     |     |   |    |
    |     |     |   |    +----- day of week (0 - 6) (Sunday=0)
    |     |     |   +------- month (1 - 12)
    |     |     +--------- day of month (1 - 31)
    |     +----------- hour (0 - 23)
    +------------- min (0 - 59)

- `*` 号表示任意
- 逗号分割表示时刻
- 短横线连接，表示时间段。
- / 表示间隔， 如果第一个域为 /2 ，则表示每隔两分钟


而空格分割的六个域分别表示：

- 第 1 列分钟，取值范围 0～59
- 第 2 列小时 0～23（0 表示子夜）
- 第 3 列日 1～31
- 第 4 列月 1～12
- 第 5 列星期 0～7（0 和 7 表示星期天）
- 第 6 列要运行的命令



注意事项：

1. 重复格式 `/2` 表示没两分钟执行一次 或者 `/10` 表示每 10 分钟执行一次，这样的语法格式并不是被所有系统支持。
2. 具体某一天的指定，可以由第三项（month day）和第五项（weekday）指定，如果两项都被设定，那么 cron 都会执行。


更多具体关于 crontab 的内容，可以参考 [WizNote](https://note.wiz.cn/pages/manage/biz/payRead.html?kb=8b40bf53-6ce7-4f5e-bbfc-99b2628340f3)。
