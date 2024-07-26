---
layout: post
title: "通过 Uptime Kuma 监控服务在线状态"
aliases:
- "通过 Uptime Kuma 监控服务在线状态"
tagline: ""
description: ""
category: 产品体验
tags: [linux, monitor, website, uptime, self-hosted]
create_time: 2023-02-23 09:13:28
last_updated: 2024-02-23 09:13:28
---

[Uptime Kuma](https://github.com/louislam/uptime-kuma) 是 [[Uptime Robot]] 的一个开源实现，可以自行架设。

如果看过我之前的文章，应该知道我过去也[整理了很多服务器监控服务](https://blog.einverne.info/post/2018/10/server-monitor.html)，我一路经历过了 [Nodequery](https://blog.einverne.info/post/2017/08/nodequery.html) 、 [Netdata](https://blog.einverne.info/post/2018/02/netdata.html) 以及 [哪吒](https://blog.einverne.info/post/2021/08/nezha-monitor.html)。甚至一度想要上商业的服务监控比如 [[Datadog]]，但后来想想目前应该还不需要，但是这么多年过来，我整理笔记的时候发现很早之前写的 uptime kuma 的文章竟然没有发布出去。所以再在 2024 年时间的维度梳理一下。

具体来说 Uptime Kuma 是一款监控服务在线状态的工具，可以监控的类型见下图，简单的来说，还是非常丰富的。

![uptime kuma add monitor](https://pic.einverne.info/images/JmhmtS2lGS.png)

特性：

- 支持监控 HTTPS，TCP 等等非常丰富的类型
- 支持 Webhook，邮件，Telegram 通知等等丰富的通知方式
- 基于 Node.js 和 Vue 3 开发

## Installation

推荐使用 docker compose 安装，配置见我的 [dockerfile](https://github.com/einverne/dockerfile/tree/master/uptime-kuma)。

## Upgrade

因为使用 Docker 来安装，直接修改指定的最新版本，然后启动即可。

## 一点点问题

在我过去几年的使用中，发现可能存在的一点点小问题，就是 Uptime Kuma 在网络波动的时候可能存在一点点误报的情况，已经有好几次，收到即使的报警，因为服务比较重要，所以立即确认，但却发现服务是完全正常的，但 Uptime Kuma 却还在报警，后来就在配置的时候，让 Uptime Kuma 多尝试几次，如果还发现错误才报警，这才让误报率降下来。
