---
layout: post
title: "NextDNS 使用体验"
aliases:
- "NextDNS 使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [ nextdns, dns, adguard-home, privacy,  ]
create_time: 2023-07-14 22:30:36
last_updated: 2023-07-14 22:30:36
---

之前在折腾 [[AdGuard Home]] 的时候偶然间了解到了 NextDNS，简单了解一下 NextDNS 能做的事情相当于把 AdGuard Home 在本地的 DNS 处理给部分搬到了云端。虽然提升了一定的可用度，毕竟不是所有的设备都在 AdGuard Home 的网络中。然后看到 NextDNS 还支持 Web3，看设置界面就已经支持了 ENS，HNS 等等。

但之所以没有深入使用就是因为 DNS 还是一个非常基础的服务，但是 NextDNS 在国内并没有节点，所以导致连接经常出问题，要不就是连接不上，要不就是拖慢了解析速度。

## NextDNS 是什么

NextDNS 是一个私人的 DNS 解析服务器。它提供了一种更安全、更私密的互联网浏览方式。通过将所有网络流量路由到 NextDNS 服务器上，NextDNS 可以过滤广告和恶意内容，阻止跟踪器，并提供家长控制功能。同时，NextDNS 还支持自定义规则和白名单，用户可以根据自己的需求对互联网体验进行定制。此外，NextDNS 还提供了详细的统计数据和日志记录，方便用户了解自己的网络使用情况。总之，NextDNS 是一个强大而灵活的工具，可以提供更安全、更私密的互联网浏览体验。

原理是 NextDNS 通过 DNS 层面来阻挡任何安全威胁，包括屏蔽广告，阻挡 trackers，保护网络中的用户安全。

- 支持 DNS-over-TLS , DNS-over-HTTPS, DNS-over-QUIC

NextDNS 可以通过 DNS 查询过滤，遇到匹配规则的域名，返回不存在的地址来实现广告和追踪的特性。

免费用户提供每个月 300000 次的查询。

## NextDNS 存在的问题

NextDNS 有时候会因为服务器分布位置的差异，比如将 Google 解析到其他地区的服务器 IP 上，导致访问 Google 的时候变慢。

- <https://ping.nextdns.io/>

[我的邀请](https://nextdns.io/?from=fgmesze4)
