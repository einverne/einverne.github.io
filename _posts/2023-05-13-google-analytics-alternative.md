---
layout: post
title: "Google Analytics 代替产品对比"
aliases: 
- "Google Analytics 代替产品对比"
tagline: ""
description: ""
category: 整理合集
tags: [ google-analytics, google, plausible, matomo, umami, fathom ]
last_updated: 2023-05-18 10:24:22
create_time: 2023-04-26 01:50:53
---

虽然我把其他服务陆陆续续从 Google 迁移出来，但 Google Analytics 一直都运行良好所以也没有怎么管，但 Google Analytics 到今年年中的时候会强行升级 GA4，看了一下升级的过程和 Google Analytics 的操作实在太复杂，就诞生了迁移出 Google Analytics 的想法。简单地了解了一下目前的 Google Analytics 的代替品，收费的，自行架设的还很多选择。这篇文章就简单地对比一下。

主要还是分成两个部分来划分搜罗的产品，可以自行托管的，和商用的。看过我之前文章的小伙伴应该知道，我个人会偏向于开源，可自行托管的服务。即便这个服务还在初始阶段可能还比不上某个商业化的服务，但我依然会选择开源的那个，比如我会选择 [[Wallabag]] 更甚于 [[Pocket]] 和 [[Instapaper]]，我会选择 [[miniflux]] 更甚于我过去常常推荐的 [InoReader](/post/2013/11/inoreader-using-feelings.html)。如果实在找不到合适的开源的，我会优先选择数据归属权在于个人的服务（比如数据不联网，存在本地，可以使用纯文本或有格式的类型导出数据），比如 Obsidian 更甚于 [[Notion]] 和 [[Roam Research]] 以及一切基于网页的笔记应用。

可 Self-hosted：

- [[Matomo]] (PHP + MySQL)是一款 PHP 开发的流量监控工具，报表功能比较强大.
- [[Umami]] TypeScript + MySQL/PostgreSQL
- [[Plausible]] [plausible analytics](https://github.com/plausible/analytics) Elixir 开发的小巧的流量监控平台.
- [[Fathom Analytics]] Go + JavaScript
- [[shynet]] Python
- [[Ackee]] Node.js, JavaScript, SCSS
- [[uxwizz]] PHP+MySQL

不可自架，闭源

- [[Splitbee]] 被 Vercel 收购，即将关闭，过去调研的时候曾经用过一段时间，体验确实不错，界面非常简洁，但是被收购之后就被整合到了 Vercel
- [[Tiny Analytics]]
- [[Smatlook]]
- [Simple Analytics](https://simpleanalytics.com/)

下面就重点介绍一下我准备去试试的几个服务。

## Umami

[Umami](https://umami.is/) 是一个可以自托管的数据统计服务，可以用来代替 [[Google Analytics]]。 "Umami"，源于 "Umai"，在日语里是“美味、鲜味”的意思。

![92m2](https://photo.einverne.info/images/2023/05/17/92m2.png)

## Matomo

[Matomo](https://matomo.org/) （原名 Piwik）是一款使用 PHP 编写的网站访问统计分析工具，开源，可自行架设，可以很好的代替 [[Google Analytics]] ，Matomo 使用 PHP 和 MySQL 实现，已经被超过 100 万网站所使用 。

Matomo 非常强大，并且只需要一来 PHP 和一个数据库，并且其报表分析非常强大。

- 支持根据用户访问的 IP 来查询地理位置
- 支持各种类型的表报

![matomo](https://photo.einverne.info/images/2023/04/26/YqCG.jpg)

## Fathom

[Fathom Analytics](https://usefathom.com/) 是一个 [[Google Analytics]] 的代替。Fathom Analytics 是一个基于加拿大的团队推出的服务。

Fathom Analytics 是一个官方推出的 SaaS 平台，是一个收费的商业服务。如果不想使用官方的，也可以利用 [Fathom Lite](https://github.com/usefathom/fathom) 自己搭建服务。

Fathom Lite 主要是使用 Go 语言 和 JavaScript 编写。Fathom Lite 和 Analytics 的区别可以参考[这里](https://usefathom.com/lite)。

![9s9M](https://photo.einverne.info/images/2023/05/17/9s9M.png)

## Plausible

[Plausible](https://plausible.io/) 是一个简单的 [[Google Analytics]] 代替。Plausible 是使用 [[Elixir]] 语言编写的，我最早知道这个服务是在 Twitter 上偶然之间看到了创始人分享如何想要找到一个 Google Analytics 代替，然后自己做，最后到如何打造成为一个 SaaS 产品，支撑自己的全部生活的成功故事。

![9niG](https://photo.einverne.info/images/2023/05/17/9niG.png)

## shynet

[shynet](https://github.com/milesmcc/shynet) 是一款使用 Python 编写的网站流量分析工具。

![99pI](https://photo.einverne.info/images/2023/05/18/99pI.jpg)

## Ackee

[Ackee](https://ackee.electerious.com/) 是一个关注隐私的开源（基于 MIT 协议）网页分析工具，采用轻量级的 Node.js 和 MongoDB 架构，接口使用 [[GraphQL]]。

Ackee 界面简洁美观，采用匿名数据采集的方式，分析你网站的流量并在最小的界面中提供有用的统计信息。对于不需要像 Google Analytics 或 Matomo 这样的全功能营销分析平台的个人来说，是一款非常不错的工具。

![9A24](https://photo.einverne.info/images/2023/05/18/9A24.png)

## 总结

除了浏览了一下官网和 GitHub 页面，没有对这些产品更进一步的了解了，但是我个人感觉 Umami 还不错，页面简洁，功能也满足我的使用。然后后端数据库支持 PostgreSQL 和常用的 MySQL，并且浏览了一下帮助文档，发现还支持 [PlanetScale](/post/2022/08/planetscale-mysql-service.html) ，并且资源消耗也比较小，所以立马 Docker 搞起，创建数据库连接字符串，然后直接拉取镜像就能起来，配合 [HestiaCP](/post/2022/07/web-server-control-panel-hestia-usage.html) 申请一个 SSL 证书很快就搞定了。
