---
layout: post
title: "服务器监控整理"
tagline: ""
description: ""
category: 整理合集
tags: [server, monitor, collection, ]
last_updated:
---

之前也有分享过两个很不错的服务器监控程序 [nodequery](/post/2017/08/nodequery.html) 和 [netdata](/post/2018/02/netdata.html)。之后又陆陆续续发现了其他一些不错的监控程序，所以就顺手整理一下。

## nodequery

这一个产品只需要在服务器上安装一个脚本，该脚本会定时将 Linux 系统状态发送到 nodequery 的网站，在他的网站后台显示，界面非常简介，提供邮件报警服务，简单的使用完全没有任何问题。

唯一的问题就是该网站已经很多年没有更新，很担心后续是否能够继续使用。

## netdata

netdata 是一款开源的监控程序，安装简单，安装之后会开启一个服务端口用来展示服务器状态，这个监控页面上各个参数都有非常好看的图表来展示。

主页：<https://github.com/netdata/netdata>

## ServerStatus
上面两种监控方案需要针对每一台服务器进行安装，如果有多台服务器需要在统一的后台进行监控，那么可以选择 ServerStatus ，ServerStatus 是一个开源的监控系统，可以在同一个页面同时检测多台服务器流量，硬盘，内存等多个参数。


主页：<https://github.com/BotoX/ServerStatus>
中文版：<https://github.com/cppla/ServerStatus>

## eZ Server Monitor
一款非常轻便的服务器监控程序，PHP 脚本。同时提供了 Bash 和 Web 版本。

主页：<https://www.ezservermonitor.com/>
源码：<https://github.com/shevabam/ezservermonitor-web>

## reference

- <https://cloud.tencent.com/developer/article/1046068>
