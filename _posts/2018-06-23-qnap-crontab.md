---
layout: post
title: "威联通折腾篇七：定时任务"
tagline: ""
description: ""
category: 学习笔记
tags: [qnap, qnap-tutorial, linux, crontab]
last_updated:
---

威联通的机器本来就是基于 Linux 定义的，所以想要定时任务就会想到 [crontab](/post/2017/03/crontab-schedule-task.html)，在威联通中使用 crontab 必须使用 SSH 登录。

然后基本使用 `crontab -l` 查看当前 qnap 中已经存在的定时任务。

在大多数桌面版 Linux 中会使用 `crontab -e` 来编辑 crontab 配置，但是注意**不要在威联通中使用这种方法**，威联通在重启的时候会覆盖使用这种方式写入的配置。如果想要永久的保存配置，应该使用

    vi /etc/config/crontab

然后写入配置，比如

    0 4 * * * /share/custom/scripts/custom1.sh

这行配置表示在 凌晨 4 点执行后面的脚本。

重启 crontab

    crontab /etc/config/crontab && /etc/init.d/crond.sh restart

## reference

- <https://wiki.qnap.com/wiki/Add_items_to_crontab>
