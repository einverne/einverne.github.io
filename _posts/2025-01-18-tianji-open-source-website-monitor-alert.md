---
layout: post
title: "Tianji 开源的网站流量分析，服务监控系统"
aliases:
- "Tianji 开源的网站流量分析，服务监控系统"
tagline: ""
description: ""
category: 产品体验
tags: [ uptime, website-monitor, kuma, open-source, golang ]
create_time: 2025-01-19 21:16:26
last_updated: 2025-01-19 21:16:26
dg-home: false
dg-publish: false
---

[Tianji](https://github.com/msgbyte/tianji) 是一个 All in One 的网站分析（Website analytics），服务监控（Uptime Monitor），业务告警（Server Status）的系统。

作者在项目动机中描述到，我们通常需要很多服务来监控一个网站的健康，比如我们可能需要使用访问分析工具，比如 [[Google Analytics]] 或者开源的 [Umami](https://blog.einverne.info/post/2024/02/umami-planetscale-web-analytics.html) 来统计我们网站每一个页面的 PV 和 UV，我们还需要一个 Uptime 监控来持续的检测服务器的网络质量和在线程度，我们可能还需要 Prometheus 这样的服务器来持续检测服务器的 CPU 使用率，内存使用率，网络包发送，磁盘读写等等。所以作者在这样一系列的需求下，为我们打造了一款开源的合为一体的综合解决方案，这个解决方案就是 Tianji，只需要安装一次，维护一个服务，就可以实现上述的需求。可以简单地将 Tianji 看做是 Google Analytics / Umami + Uptime Kuma + 哪吒监控 / Prometheus。

在 GitHub 的页面上，我们也可以看到作者将项目的 Roadmap 也列了出来，目前项目也已经可以满足大部分的需求，包括了网页浏览分析，服务监控，问题告警，数据采集，团队协作，轻量的报告，Hooks，Helm 安装支持等等，具体的可以参考 GitHub 页面。

## 安装

推荐使用 Docker Compose 安装。参考[配置](https://github.com/einverne/dockerfile)。

```
git clone
cd tianji
cp env .env
# modify .env
docker compose up -d
```

## 视频教程

<iframe width="560" height="315" src="https://www.youtube.com/embed/AW4gpCGOy3M?si=j8-fxzi2L2WTYjh8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[YouTube](https://youtu.be/AW4gpCGOy3M) | [Bilibili](https://www.bilibili.com/video/BV1MswCeYEyU/)

## 优点

Tianji 通过一个服务就实现了网站分析，服务监控，告警等等功能，只需要维护一个服务就可以满足多样需求。

## 缺点

### 可监控类型较少

服务可用性监控，仅支持 Ping，TCP Port，DNS，HTTP，OpenAI 等，相较于 Kuma 还是比较好，不过轻量使用也足够了。

![3Ow6cTom16](https://pic.einverne.info/images/3Ow6cTom16.png)

### 消息通知种类少

目前消息通知还是依赖于 apprise 实现，支持的通知类型较少，只有邮件，Telegram 等。
