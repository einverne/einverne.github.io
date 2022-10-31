---
layout: post
title: "服务器监控整理"
tagline: ""
description: ""
category: 整理合集
tags: [server, monitor, collection, linux]
last_updated:
---

手上的 VPS 多余一台的时候总是想着通过一个统一的界面来监控管理。


## 需要监控的项

- VPS 及服务在线时间
- 从某地到该 VPS 的 ping 值稳定程度 smokeping
- 该 VPS 各项资源的使用情况，包括 CPU，内存，IO，网络带宽使用



之前也有分享过两个很不错的服务器监控程序 [nodequery](/post/2017/08/nodequery.html) 和 [netdata](/post/2018/02/netdata.html)。之后又陆陆续续发现了其他一些不错的监控程序，所以就顺手整理一下。



商业方案，也就是提供服务在线监控，并且如果超过一定使用量向用户收取一定费用的服务：

- [[SyAgent]]
- [[EHEH]]

商业开源方案：

- [[Netdata]]


Self-hosted 方案，容器化方案，所有监控内容可以直接通过容器部署：

- [[dockprom]]
- [[2021-08-28-nezha-monitor]]
- [[uptime-kuma]]
- [[ServerStatus]]

### SyAgent
SyAgent 是我在 LET 上面看到的一个选项，不过该网站由个人运营维护。

- <https://syagent.com/>

### EHEH
一个闭源的监控平台，类似于 Nodequery，安全性待评估。

- <https://eheh.org/index/index>


### dockprom
一个容器化解决方案，集成了 Prometheus, Grafana, cAdvisor 等等。

- <https://github.com/stefanprodan/dockprom>

## Zabbix
Zabbix 是一个企业级的开源监控方案。

GPL开源协议。

## Cockpit
[[Cockpit]] 是一款开源的Linux服务器管理解决方案。可以执行如启动容器，管理存储，配置网络，检查日志等操作。它能够同时控制和监控多台服务器。它提供的主要功能如：可视化的监控系统性能，管理Docker容器，终端窗口中基于Web，管理用户帐号，收集系统配置和诊断信息，修改网络设置等。它的配置文档也很实用，可以快速安装并开始监控服务器。

## nodequery

这一个产品只需要在服务器上安装一个脚本，该脚本会定时将 Linux 系统状态发送到 nodequery 的网站，在他的网站后台显示，界面非常简介，提供邮件报警服务，简单的使用完全没有任何问题。

唯一的问题就是该网站已经很多年没有更新，很担心后续是否能够继续使用。

## netdata

[[Netdata]] 是一款开源的监控程序，安装简单，安装之后会开启一个服务端口用来展示服务器状态，这个监控页面上各个参数都有非常好看的图表来展示。

主页：<https://github.com/netdata/netdata>

## ServerStatus
上面两种监控方案需要针对每一台服务器进行安装，如果有多台服务器需要在统一的后台进行监控，那么可以选择 ServerStatus ，ServerStatus 是一个开源的监控系统，可以在同一个页面同时检测多台服务器流量，硬盘，内存等多个参数。


主页：<https://github.com/BotoX/ServerStatus>
中文版：<https://github.com/cppla/ServerStatus>

## eZ Server Monitor
一款非常轻便的服务器监控程序，PHP 脚本。同时提供了 Bash 和 Web 版本。

主页：<https://www.ezservermonitor.com/>
源码：<https://github.com/shevabam/ezservermonitor-web>

## Nezha monitor

- [哪吒监控使用](/post/2021/08/nezha-monitor.html)
- [[2021-08-28-nezha-monitor]]

## Datadog


- <https://www.datadoghq.com/>



## reference

- <https://cloud.tencent.com/developer/article/1046068>
