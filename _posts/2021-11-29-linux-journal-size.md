---
layout: post
title: "Linux 下 journal 日志清理"
aliases:
- "Linux 下 journal 日志清理"
tagline: ""
description: ""
category: 经验总结
tags: [ linux, journal, systemd, journalctl, gdu, du ]
last_updated: 2022-08-18 10:54:25
create_time: 2021-11-29 07:29:55
---

Linux 在运行的过程中会产生很多日志文件，一般存放在 `/var/log` 目录下，而其中 `journal` 目录中存放的是 `journald` daemon 程序生成的日志，其中包括了所有 kernel, initrd, services 等等产生的日志。这些日志在系统发生状况排查问题的时候非常有用。

`jounrnald` daemon 程序会收集系统运行的日志并存储到二进制文件中。为了查看这些二进制文件通常会使用到 `journalctl` 命令。但是默认情况下这些日志文件会占用磁盘空间的 10%，而大部分情况下这些日志文件是不需要查看的。所以可以配置减小一些 journal 日志的占用。

默认的日志文件保存在 `/var/log/journal` 下，可以使用 `du` 查看。不过我个人推荐使用可视化的 `gdu` 来 [查看](/post/2021/07/gdu-fast-disk-usage-analyzer.html) 。

- `du -sh /var/log/journal` 查看占用磁盘空间

## 查看 journal 日志占用大小
可以使用 `journalctl` 命令查看日志占用：

    sudo journalctl --disk-usage

## 手动清理 journal 日志
如果要去清理 journal 日志，可以先执行 `rotate` 命令：

```
journalctl --rotate && \
systemctl restart systemd-journald
```

删除两天前的日志：

```
journalctl --vacuum-time=2days
```

删除两个礼拜前的日志：

```
journalctl --vacuum-time=2weeks
```

或者删除超出文件大小的日志：

```
journalctl --vacuum-size=20M
```

```
journalctl --disk-usage
# OR
du -sh /run/log/journal
journalctl --verify
ls -l /run/log/journal/*
systemctl status systemd-journald
```

## 修改配置文件限制 journal 日志最大占用
修改配置文件：

`sudo vi /etc/systemd/journald.conf`

修改其中的两项：

```
SystemMaxUse=100M
RuntimeMaxUse=100M
```

SystemMaxUse 设置 `/var/log/journal`
RuntimeMaxUse 设置 `/run/log/journal`

然后使设置生效：

```
sudo systemctl daemon-reload
```

## journal 日志过大可能产生的问题

问题

> Warning: Journal has been rotated since unit was started. Log output is incomplete or unavailable.

原因是：

`the disk usage of the log files for journald` journal 日志空间达到了上限
