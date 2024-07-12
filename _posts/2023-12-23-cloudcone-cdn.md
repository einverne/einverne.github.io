---
layout: post
title: "CloudCone CDN 使用体验"
aliases:
- "CloudCone CDN 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [ cdn, cloudcone, cdn-nexus ]
create_time: 2024-07-12 22:03:51
last_updated: 2024-07-12 22:03:51
dg-home: false
dg-publish: false
---

去年有机会就体验了一下 CloudCone 发布的 CDN 服务 CDN Nexus，下一代的 CDN，但是说实话技术上没有啥特别的，当时节点也不是很多，CloudCone 作为一个 VPS 服务商，可能本来就是利用其全球的机房做一些 CDN 的服务，说实话没有太多的亮点。免费的 Cloudflare 可能更香，或者我之前介绍的 [Bunny CDN](https://blog.einverne.info/post/2024/03/bunny-cdn-speed-up-your-site.html) 也是不错的选择。

## CloudCone

CloudCone 是一家成立于 2017 年的主机服务商，主打 VPS，云服务器等服务，我第一次听说 CloudCone 还是在几年前的复活节彩蛋活动，CloudCone 在自家的页面里面埋了几个彩蛋，只要能挖到就可以以非常便宜的价格购买到 VPS。当时注册了他们家的账号，之后就在邮件里面知道了他们要发布新的 CDN 服务，当时还参加了他们的免费内测，但说实话当时把我的博客 CDN 了一份，但是测速效果并不好，就没有再理了。

## CDN 功能

- 支持回源 Host
- 静态和动态的内容分发
- 免费 SSL
- 支持防盗链
- Web 应用防火墙 WAF

![Ts02Hv6c6j](https://pic.einverne.info/images/Ts02Hv6c6j.png)

在下方也能看到每个节点使用的流量。

![NPYk6z-fJy](https://pic.einverne.info/images/NPYk6z-fJy.png)

但是总体来说，如果不购买其付费套餐，这些节点的速度访问都不是非常理想。

## 价格

根据他们官方的[价格表](https://cloudcone.com/cdn/)，亚太地区最低的价格也需要 6.68 美元一个月，并且流量才 100 GB。

![2V-LIIyR8Z](https://pic.einverne.info/images/2V-LIIyR8Z.png)

## 使用

购买成功之后通过添加回源协议，回源地址，添加域名，成功之后 CloudCone 会给一个 CDN 地址，类似 xxx.r.cloudnext.cc。

然后可以配置一个 CNAME 到这个 cloudnext 地址，等待别名解析成功之后，就可以享受 CDN 的加速了。

在设置中可以控制

- 回源地址
- 缓存时间
- 开启 CORS 跨域
- 阻止搜索引擎索引
- 设置访问密码
- URL 签名
- 防盗链
- IP 拦截
