---
layout: post
title: "使用 Cloudflare Tunnel 将本地服务公开到互联网"
aliases: "使用 Cloudflare Tunnel 将本地服务公开到互联网"
tagline: ""
description: ""
category: 经验总结
tags: [cloudflare, cloudflared, cloudflare-tunnel, frp, ngrok, tailscale-funnel]
dg-home: false
dg-publish: false
create_time: 2021-10-25 05:06:48
last_updated: 2022-10-14 05:06:03
---

Cloudflare Tunnel 是 Cloudflare 提供的一个零信任网络，就像它的名字一样，Cloudflare Tunnel 会提供一个网络隧道，让服务器在不暴露任何公共端口的情况下直接将服务暴露给 Cloudflare 对外提供服务。这样可以完全隐藏 Web 服务器的 IP 地址，阻止潜在的攻击。

Tunnel 会在后台的源服务器和 Cloudflare 最近的数据中心之间建立一条加密隧道。

在部署了 Tunnel 之后，所有的入站 Web 流量都会通过 Cloudflare 网络过滤，享受 Cloudflare DDos 的保护和 Web 应用服务器防火墙（WAF）的保护。

最近是由于需要调试 Webhook，想要将本地的 Flask 应用暴露到公网上，然后通过 HeyForm 的 Webhook 触发调用本地的服务，所以想到了 Cloudflare Tunnel 这样的服务，就像博客之前也写过 [[Tailscale Funnel]]，以及开源的 [[frp]] ，[[ngrok]] 等等项目，都可以实现类似的功能。

Clodflare 会在本地运行一个守护程序，Tunnel 通过本地网络，与 Cloudflare 服务器建立通信，将对 Cloudflare 服务器请求的数据转发到本地 IP 端口。

## 特性

- 可隐藏真实 IP 地址，将本地服务暴露到互联网
- 对外隐藏端口，直接使用域名访问本地服务
- 提供 HTTPS 证书
- 无流量限制
- WAF 应用程序防火墙
- DDoS 防御

## 前提条件 Prerequisites

- 拥有一个 Cloudflare 账户，并且添加要使用的域名，开通了 [[Cloudflare Zero Trust]]
- 本地内网一台运行服务的机器

## 使用流程

首先打开 [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)，首次使用的时候可能需要创建免费计划，需要验证和绑定信用卡，服务是免费的，但是需要验证付款方式，为了防止滥用。

由于我本地全部使用命令行实现，所以就简单的记录一下命令行实现的方式，如果不熟悉命令行，也可以根据官方的网页指导，直接通过页面完成。

安装 [Cloudflared](https://github.com/cloudflare/cloudflared) 这是一个 Cloudflare Tunnel 的本地 CLI 客户端

```
brew install cloudflared
```

首先登录

```
cloudflared tunnel login
```

登录 Cloudflare，命令会给出一个登录地址，拷贝到浏览器登录并授权。注意，授权只能选择一个网站，如果要选择多个网站，授权完成之后不要关闭网页，继续点击授权。

然后创建隧道

```
cloudflared tunnel create tunnel-name
```

隧道创建完成之后会产生一个 UUID。

将域名指向对应的隧道

```
cloudflared tunnel route dns tunnel-name your-name.example.com
```

这个时候 Cloudflare 会自动添加一条 CNAME 记录到对应的域名。

在创建隧道的时候 Cloudflare 就已经添加了 隧道 UUID.cfargotunnel.com 这样的记录到域名中。也可以手动创建 CNAME 记录指向这个地址。这个地址就是隧道的入口。

然后进行隧道的配置

创建一个配置文件

```
vim ~/.cloudflared/config.yml
```

然后在其中添加配置

```
tunnel: <Tunnel UUID>
credentials-file: /root/.cloudflared/<Tunnel UUID>.json
protocol: h2mux
ingress:
  # 第一个网站，连接到本地的 3000 端口
  - hostname: your-name-1.example.com
    service: http://127.0.0.1:3000
  # 第二个网站，https协议，连接到本地的443端口，禁用证书校验（用于自签名SSL证书）
  - hostname: your-name-2.example.com
    service: https://127.0.0.1:443
    originRequest:
      noTLSVerify: true
      originServerName: your-name-2.example.com
  # 第三个网站，8012端口，泛域名
  - hostname: <*.example3.com>
    service: http://localhost:8012
  # 第四个，反代MySQL sock服务
  - hostname: <mysql.example4.com>
    service: unix:/tmp/mysql.sock
  # 第五个，反代SSH服务
  - hostname: <ssh.example5.com>
    service: ssh://localhost:22
  - service: http_status:404
```

记住最后的一行是必须的。更多的配置相关的内容，可以参考[官方文档](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/local/local-management/ingress/?ref=bra.live#supported-protocols)

配置完成之后，测试一下

```
cloudflared tunnel ingress validate
```

如果没有报错证明没有问题

然后运行

```
cloudflared tunnel run tunnel-name
```

终端会出现一系列的日志，没有红色的报错即可。最后可以登录 Cloudflare Zero Trust 的[网站](https://one.dash.cloudflare.com) 查看一下 Tunnels ，Active 即可。

这一步完成之后，就可以在浏览器直接通过域名来访问本地的服务了。

如果要让 Cloudflare 一直在后台运行，可以使用 service 安装

```
cloudflared service install
```

另外需要注意的是，如果是创建了系统服务之后，配置文件会被拷贝到 `/etc/cloudflared/config.yml` 目录中，后续的修改需要使用这个配置文件。
