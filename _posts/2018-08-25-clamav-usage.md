---
layout: post
title: "Linux 下使用 ClamAV 扫描病毒"
aliases: "Linux 下使用 ClamAV 扫描病毒"
tagline: ""
description: ""
category: 经验总结
tags: [linux, clamav, virus,]
last_updated:
---

ClamAV 是开源的杀毒软件

## 安装

    sudo apt-get install clamav

## 使用

更新“病毒库”

    sudo freshclam

然后可以使用 scan 来扫描

    clamscan OPTIONS file/folders

如果可以直接从 root 开始扫描：`sudo clamscan`

## 举例
扫描全盘，并显示文件名

    clamscan -r /

扫描文件，只显示被感染的文件，并且声音提醒

    clamscan -r --bell -i /

扫描全盘文件，只显示感染的文件，后台执行

    clamscan -r -i / &

检查所有用户 home 目录下文件

    clamscan -r /home

检查用户 home 目录，并将感染的病毒移动到另外的文件夹

    clamscan -r --move=/home/USER/VIRUS /home/USER

检查用户 home 目录并移除感染的文件

    clamscan -r --remove /home/USER

查看帮助

    clamscan --help

更多

- 官方资料 [HTML](http://www.clamav.net/doc/install.html) | [PDF](https://github.com/vrtadmin/clamav-faq/raw/master/manual/clamdoc.pdf)
- ClamAV 官方 [wiki](http://wiki.clamav.net/)
- Ubuntu [wiki](https://help.ubuntu.com/community/ClamAV)

## 相关
[ClamTk](https://launchpad.net/clamtk) 是 ClamAV 的 GUI 版本

    sudo apt install clamtk

从 PPA 获取

    sudo apt-add-repository ppa:landronimirc/clamtk
    sudo apt-get update && sudo apt-get install clamtk

## reference

- <https://askubuntu.com/a/560947/407870>
