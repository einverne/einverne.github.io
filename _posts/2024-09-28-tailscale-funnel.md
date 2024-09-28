---
layout: post
title: "使用 Tailscale Funnel 暴露本地服务"
aliases:
- "使用 Tailscale Funnel 暴露本地服务"
tagline: ""
description: ""
category: 经验总结
tags: [tailscale, tailscale-funnel, frp, ngrok,]
create_time: 2024-09-28 17:24:53
last_updated: 2024-09-28 17:24:53
dg-home: false
dg-publish: false
---

之前我介绍过 [Tailscale](https://blog.einverne.info/post/2022/04/tailscale-usage.html)，也介绍过如何使用 [Tailscale 的出口节点功能配置流量出口](https://blog.einverne.info/post/2023/03/tailscale-exit-nodes.html)，今天再介绍一个 Tailscale 的功能 Tailscale Funnel，可以将本地服务完全地暴露在互联网上。Tailscale Funnel 允许将运行在私有 Tailnet 上的 Web 服务与公共互联网共享，提供了一种简单的方式，无需配置复杂的网络。

因为最好正好有一个需求需要接收并处理一个 Webhook，想在本地代码调试，查看 Webhook 的内容，所以想到了使用内网穿透的工具，之前其实知道 [[ngrok]]，[frp](https://blog.einverne.info/post/2017/11/frp-config.html) 这样的工具，但是配置相对比较复杂，而本地正好已经安装了 Tailscale，所以想到 Tailscale 是不是也有类似的功能，一搜果然有。Tailscale Funnel 就可以很方便地将本地服务暴露在互联网上。

Funnel 只需要一个命令就可以启动，并且自动提供 HTTPS 加密，可以随时启用或禁用公共访问。

当启用 Funnel 时，Tailscale 自动创建 DNS 记录，指向 Tailscale 全球入口服务器，这些服务器被授予对 tailnet 的有限访问权限，提供 TCP 连接。

当公共互联网用户请求服务时，Tailscale 使用安全隧道将请求转发至本地的服务器。

## 使用方法

确保本地已经安装并登录了 Tailscale 客户端。

如果本地运行的服务在端口 3000 上，那么可以使用如下的命令启用 Funnel

```
tailscale funnel 3000
```

第一次使用 Funnel 的时候会跳转到地址让用户授权。

Tailscale 会自动生成一个公共 URL

```
https://<device-name>.tailXXXXX.ts.net
```

访问该地址会直接将请求转发到本地 3000 端口。
