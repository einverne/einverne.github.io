---
layout: post
title: "介绍一下新推出的 EV Hosting 网络共享托管服务"
aliases:
- "介绍一下新推出的 EV Hosting 网络共享托管服务"
tagline: ""
description: ""
category: 产品体验
tags: [hosting, email, mailcow, clientexec, online-business, vps]
create_time: 2023-04-04 22:58:42
last_updated: 2023-04-04 22:58:42
---

因为自己之前买过一些 VPS，但是一直空闲很多，所以想着是否能够充分利用起来。最近正好看到可以免费使用 [[Clientexec]] 管理 Web Hosting 账单，所以隆重介绍一下刚刚推出的新服务 [EV Hosting](https://client.einverne.info/)，目前上线了两个功能，共享网站托管服务和自定义域名邮箱服务。

## 共享网站托管服务

共享网站托管服务（Shared Web Hosting） 是一种网站托管服务，是将多个网站存储在同一台服务器上，并共享服务器上的 CPU、内存和带宽。这种类型的托管服务通常是最便宜和最受欢迎的选择，特别适合个人和小型企业。

如果你是一个不懂技术的个人但想在网络上有一片属于自己的空间，或者你想以最低的成本开展在线商城，欢迎来订购使用。

本站提供的托管服务，服务器位于新加坡，CPU 是 AMD Ryzen 9 3900X 12-Core Processor，服务器共 128 GB 内存。

### 一键安装超过 400 种应用

目前该服务托管于新加坡的服务器，使用 [[DirectAdmin]] 面板，装有 [[Softaculous]]，可以一键安装包括 [[WordPress]]，[[Joomla]]，[[NextCloud]]，[[Tiny Tiny RSS]]，[[miniflux]]，[[FreshRSS]]，[[phpmyadmin]] 等等超过 450 种的应用程序[^1]，不少的应用我之前也是介绍过的，并且还一直在用，比如 [[NextCloud]] 这个文件同步工具，[[miniflux]] 这个 在线的 RSS 阅读器。Softaculout 非常强大，很多功能和特性有待你去发现。

[^1]: <https://www.softaculous.com/software/>

DirectAdmin 后台也有一个在线的文件管理器，可以直接基于网页对网站内容进行管理。

![nrWr](https://photo.einverne.info/images/2023/04/04/nrWr.png)

### 自定义域名邮箱

另外订购所有的套餐都可以在后台配置自定义邮箱，每一个邮箱每个小时可以发送至多 200 封邮件。请不要滥用发件发送恶意、垃圾邮件。

也可以使用后台提供的 Roundcube 网络邮箱界面来管理自己的邮件。

### MySQL 数据库

购买套餐之后可以在后台创建响应的 MySQL 数据库供应用程序保存数据使用。所有的数据库内容及网站内容都会定期通过备份来保证安全。

### 附加功能

可以通过附加功能，来设置 Node.js，PHP，Python 等应用程序。

![neId](https://photo.einverne.info/images/2023/04/04/neId.png)

为了庆祝上线，在订购年付套餐的时候输入 `EVHOSTING` 则可以享受 5 折的优惠（优惠截止 4 月末）。最低可以以 8 元购买一年 Bronze 套餐。

## 自定义域名邮箱服务

如果你只需要发送邮件的服务，那么也可以订购这个自定义域名邮箱的服务，订购服务之后需要我手工启用，后台使用的是 Mailcow，我再添加了域名之后会给你的邮箱发送相应管理后台的信息。

所有在线购买的产品都可以通过在线提交工单的方式获得支持，并且后续会陆陆续续更新更多相关的使用技巧，欢迎关注。另外服务刚刚上线，如果有任何使用的问题，反馈并且到的验证的都可以免费获取一年的 Bronze 套餐。