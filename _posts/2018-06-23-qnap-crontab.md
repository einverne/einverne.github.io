---
layout: post
title: "威联通折腾篇七：定时任务"
aliases: "威联通折腾篇七：定时任务"
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

或者直接使用 echo，将命令放到双引号中

    echo "1 4 * * * /share/custom/scripts/custom1.sh" >> /etc/config/crontab

> 另外需要注意可执行文件一定需要可执行权限 chmod +x filename.sh

重启 crontab

    crontab /etc/config/crontab && /etc/init.d/crond.sh restart

## 标准的 crontab 任务

定时任务                                                | 解释
--------------------------------------------------------|-----------------------------------------
0 3 * * 0 /etc/init.d/idmap.sh dump                     |
10 15 * * * /usr/bin/power_clean -c 2>/dev/null         |
0 4 * * * /sbin/hwclock -s                              | <http://linux.die.net/man/8/hwclock>
0 3 * * * /sbin/vs_refresh      |
0 3 * * * /sbin/clean_reset_pwd         |
0-59/15 * * * * /etc/init.d/nss2_dusg.sh        |
30 7 * * * /sbin/clean_upload_file      |
0-59/10 * * * * /etc/init.d/storage_usage.sh        |
30 3 * * * /sbin/notice_log_tool -v -R      |
*/10 * * * * /sbin/config_cache_util 0      |
0-59/20 3 * * * /sbin/adjust_time       |
0 8 * * * /usr/local/medialibrary/bin/mymediadbcmd buildall 1>/dev/null 2>/dev/null         |
55 9,21 * * * /sbin/notify_update -s -p 1>/dev/null 2>&1        |
0 23 */1 * * /sbin/qpkg_cli -U 1>/dev/null 2>/dev/null      |
0 0 * * * /share/CACHEDEV1_DATA/.qpkg/Qcenter/qnap-cms/bin/log_retention.sh > /dev/null         |
0 0 * * * /share/CACHEDEV1_DATA/.qpkg/Qcenter/qnap-cms/bin/nasconfig_retention.sh > /dev/null       |
0 2 * * * /sbin/qfstrim         |
0 0 * * 0 /sbin/storage_util --data_scrubbing raid_id=-1 >/dev/null 2>&1        |
51 * * * * /sbin/qddns_check 2>/dev/null        |
* * * * * /var/cache/netmgr/lock_timer.sh       |
* * * * * /var/cache/netmgr/detect_defaultgw_internet.sh        |
0 4 * * * /etc/init.d/wsd.sh restart        |
4 3 * * 3 /etc/init.d/backup_conf.sh        |
0 0 * * * /etc/init.d/antivirus.sh archive_log      |
56 0 */1 * * /etc/init.d/antivirus.sh update_db         |
20 08 * * * /mnt/ext/opt/QcloudSSLCertificate/bin/ssl_agent_cli         |
35 7 * * * /sbin/qsyncsrv_util -c  > /dev/null 2>/dev/null      |
0 0 * * * /sbin/qsyncsrv_tool --fix  > /dev/null 2>/dev/null        |


## reference

- <https://wiki.qnap.com/wiki/Add_items_to_crontab>
