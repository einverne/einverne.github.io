---
layout: post
title: "Linux 主机在线监控: nodequery"
aliases: "Linux 主机在线监控: nodequery"
tagline: ""
description: ""
category: 产品体验
tags: [linux, vps, monitor]
last_updated:
---

很久没有更新这个分类下的文章了，其实一直在体验不同的产品，只是真的很少有能拿出来讲一下的东西。不管是硬件还是软件，最近几年使用的东西越来越狭窄，越来越收缩，当然对于某一个特定的需求，总有一个产品能够占领绝大多数市场，而也有部分产品能够瓜分小众市场。这里要介绍的这个 NodeQuery 就不是一个大而全的产品，而是一个很精细的小众产品。我用它也一年多了，我的需求很简单，能够实时监控我的 VPS，能够在宕机或者高负载时报警。NodeQuery 完全能够满足我的需求。

用 NodeQuery 自己的话描述自己就是："一个轻量、易用的 Linux 服务器监控服务".

> NodeQuery provides a lightweight and easy to use Linux server monitoring service.

NodeQuery 免费账户可以提供 10 台机器的监控，

官网地址： <https://nodequery.com/>

## 界面展示

![index](https://i.imgur.com/LAdQV3H.png)

![details](https://i.imgur.com/IKlMOLG.jpg)

## 使用
同样使用也非常方便，新建 Server，然后会给出一个一键脚本，在自己的 VPS 上一键安装就行，脚本同样是开源的托管在 GitHub 上。人人都可以审查。

### 移除 nodequery
2021 年 10月更新

很多年没有上 NodeQuery 查看，发现 NodeQuery 已经不更新了，这里记录一下移除 NodeQuery 的命令：

```
rm -R /etc/nodequery && (crontab -u nodequery -l | grep -v "/etc/nodequery/nq-agent.sh") | crontab -u nodequery - && userdel nodequery
```

## API
这个网站也能够提供 API 支持，能够读取历史情况下 Server 的状态，目前写功能暂时还无法使用。

## reminder

不过需要提醒的是，这个网站自从 2014 年起就再没有更新，不清楚背后发生了什么事情，但是也是感到非常的可惜。



