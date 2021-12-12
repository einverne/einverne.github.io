---
layout: post
title: "哪吒监控安装及简单使用说明"
aliases: 
- "哪吒监控安装及简单使用说明"
tagline: ""
description: ""
category: 经验总结
tags: [ uptime, vps, monitor, open-source, go, grpc ]
last_updated:
---


哪吒监控是一个使用 Go 和 Vue 实现的服务器监控探针，UI 简洁，可以自定义 CSS，一行命令就可以将新的服务器添加到监控面板。之前一直使用 [nodequery](/post/2017/08/nodequery.html)，这个服务由于作者已经不再更新所以网站已经无法登录。

在没有遇到哪吒监控之前一直都是使用的 [Netdata cloud](/post/2021/06/netdata-cloud.html) 来监控 VPS，虽然 Natdata 非常强大，数据非常详细，后台界面也非常有设计感，还带邮件告警通知，但是 Netdata Cloud 后台访问速度实在有点慢，并且我没有找到办法在一个界面查看所有的网络状态。所以用哪吒监控相互弥补一下。

GitHub 地址：<https://github.com/naiba/nezha>

哪吒监控特性：

- 支持 HTTP，TCP，Ping 监控报警
- 监控报警：CPU、内存、硬盘、带宽、实时流量
- 服务监控：HTTP，SSL 证书，Ping，TCP 端口
- 自定义布局，LOGO，颜色，统计代码
- 定时任务：备份、服务重启，定期运维

## 部署哪吒探针 Dashboard
可以使用官方提供的一键脚本，但我害怕这个脚本设定的环境对我不透明，所以我选择把里面的内容提取成 docker-compose 的配置，可以在[这里](https://github.com/einverne/dockerfile/tree/master/nezha) 查看。

修改一下配置，直接 `docker-compose up -d` 即可。


## 部署 Agent 客户端
Agent 客户端，可以在哪吒监控的后台通过添加新的节点，然后复制脚本执行即可。


## 备份和恢复

数据都存储在 `/opt/nezha` 文件夹中，打包文件夹，在新环境解压。然后执行安装脚本即可。


## 问题

如果出现首页服务器随机掉线的问题，需要通过服务器时间。

执行 `ntpdate 0.pool.ntp.org` 同步面板部署服务器的时间。

## 常用的命令

```
哪吒监控 管理脚本使用方法: 
--------------------------------------------------------
./nezha.sh                            - 显示管理菜单
./nezha.sh install_dashboard          - 安装面板端
./nezha.sh modify_dashboard_config    - 修改面板配置
./nezha.sh start_dashboard            - 启动面板
./nezha.sh stop_dashboard             - 停止面板
./nezha.sh restart_and_update         - 重启并更新面板
./nezha.sh show_dashboard_log         - 查看面板日志
./nezha.sh uninstall_dashboard        - 卸载管理面板
--------------------------------------------------------
./nezha.sh install_agent              - 安装监控Agent
./nezha.sh modify_agent_config        - 修改Agent配置
./nezha.sh show_agent_log             - 查看Agent日志
./nezha.sh uninstall_agent            - 卸载Agen
./nezha.sh restart_agent              - 重启Agen
./nezha.sh update_script              - 更新脚本
--------------------------------------------------------
```


## Nezha 监控存在的问题
因为存储历史的数据可能会占用非常多的磁盘，所以 Nezha 监控目前只能显示这个时刻各个机器的资源占用，而不能查看单台机器历史资源的使用情况。

## reference

- [[website-monitor]]
- <https://s.888766.xyz/>