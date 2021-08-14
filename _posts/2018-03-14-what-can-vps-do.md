---
layout: post
title: "VPS 云服务器能够做什么"
tagline: ""
description: ""
category: 经验总结
tags: [linux, vps, cloud, server, docker, ]
last_updated: 
---

很早以前买一台VPS主要的功能就是翻墙，然后常年也仅仅是跑一个 Shadowsocks，后来渐渐的发现其实有一台服务器即使只有单核1G，也能够用来做很多事情。以前我也看过一些文章讲述如何充分利用起VPS，但大部分除了说自建网站，挂机刷 YouTube 赚钱外也都没有什么实质性的内容。而自从[开始接触](/post/2017/07/docker-introduction.html)Docker，我渐渐的发现了很多服务，因此我自己搜罗了[一些](https://github.com/einverne/dockerfile)。当然其实 GitHub 上有一个 [Awesome Selfhosted](https://github.com/Kickball/awesome-selfhosted) 这里面列举了成百上千种可以自己托管部署的服务，几乎可以代替掉日常生活中用到的80%的服务，可以自建 nextcloud 代替 Dropbox，可以用 WordPress 代替 Blogger，可以用 GitLab，gogs 代替 GitHub，你甚至可以构建自己的即时通讯，邮件服务，社交媒体[^link] 等等。

当然这一切都无法离开一台可用稳定的VPS，并且借助Docker几乎可以做到无痛搭建，备份，迁移，不用在花费时间在环境和部署中。下面就分享一些我觉得很好用的服务，可以用来充分利用你的机器。

总得来说一般可以将 VPS 用于如下几类用途：

- Web Hosting，托管网站
- Back up data
- VPN
- Developing and Testing Code，自动跑 CI 程序

## Web Hosting

### wordpress
自建博客

### linx server
文件共享服务，使用 Go 书写，可以用来快速分享本地文件给别人。支持 Web UI，也支持 API 上传。

### h5ai
一款文件夹浏览，一般情况下开启 Nginx 允许浏览目录的设置也足够了，h5ai提供了一些额外的功能，比如二维码，搜索等等

### gogs
一款较 GitLab 轻便的 Git 托管服务。

### Drone
持续集成 CI

### frp
内网穿透

### qiandao
签到服务，binux 写的自动签到服务

### pyspider
爬虫

### 自建DNS
无污染 DNS 服务器

- AdGuard Home
- pi-hole

### jumpserver
作为跳板机 ssh 连接其他电脑用

### aria2
aria2 挂机下载


[^link]: <https://github.com/Kickball/awesome-selfhosted#communication-systems>
