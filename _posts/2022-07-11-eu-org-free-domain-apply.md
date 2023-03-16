---
layout: post
title: "Eu.org 免费域名申请"
aliases:
- "Eu.org 免费域名申请"
tagline: ""
description: ""
category: 经验总结
tags: [ eu-org, domain, free-domain,  ]
create_time: 2022-02-16 21:39:01
last_updated: 2023-03-16 21:38:02
---

eu.org 是欧盟组织下面的域名，EU 代表欧盟，Paul Mockapetris 在 1996 年的 9-10 月份创建了这个域名的 DNS 服务器。现在对个人和组织是免费注册的。

> “EU.org, free domain names since 1996”。

eu.org 是 Google 认可的顶级域名。

优点：

1. 历史悠久；
2. 支持 NS 记录，意味着支持所有域名记录；
3. 稳定，可长期使用；
4. 没有任何限制

缺点：

eu.org 在国内使用 http 会被被强行重置，配合 HTTPS 才可正常访问。

## 注册账号

申请页面 [https://nic.eu.org/arf/](https://nic.eu.org/arf/) 注册账号，验证邮箱。

## 申请域名

点击 New Domain 申请域名。

- 输入想要注册的域名，包括后缀
- 填写地址
- 需要提前添加 DNS 服务器，需要把准备申请的域名添加

在申请域名的时候需要提前填写 DNS 信息，但是 Cloudflare 不能提前添加未注册的域名，所以不能用 Cloudflare。

这里可以使用：

- https://dns.he.net/
- dns.com
- dnspod

Hurricane Electric Hosted DNS(HE) NS Records：

- ns1.he.net
- ns2.he.net
- ns3.he.net
- ns4.he.net
- ns5.he.net

DNSPOD 的 NS Record 一般都是 XXX.dnspod.com

之后 EU.org 会开始验证 NS 记录。如果没有问题最后的日志会是 `done`。

```
---- Servers and domain names check

Getting IP for PHIL.NS.CLOUDFLARE.COM: 108.162.193.137 172.64.33.137 173.245.59.137
Getting IP for PHIL.NS.CLOUDFLARE.COM: 2803:f800:50::6ca2:c189 2606:4700:58::adf5:3b89 2a06:98c1:50::ac40:2189
Getting IP for VERA.NS.CLOUDFLARE.COM: 172.64.32.147 108.162.192.147 173.245.58.147
Getting IP for VERA.NS.CLOUDFLARE.COM: 2803:f800:50::6ca2:c093 2a06:98c1:50::ac40:2093 2606:4700:50::adf5:3a93


No error, storing for validation...
Saved as request 202303xxxxxxxx-arf-3xxxx

Done
```

这个过程的时间不确定，可能会是 1 天，也可能好几个星期，最后注册邮箱中会收到 EU.org 发过来的邮件，标题一般是 `request [20210906172103-arf-xxxx] (domain test.EU.ORG) accepted`，这表示域名注册成功了。

## 中途遇到的问题

Eu.org 在验证 NS 的过程中可能会出现如下错误：

SOA from NS1.HE.NET at 216.218.130.2: Error: Answer not authoritative (148.835 ms)

这个时候注意在前面选项 Name Servers 中选择 server names 单选项。

## 将 eu.org 域名添加到 Cloudflare

当 eu.org 域名申请完毕，可以将域名添加到 Cloudflare 管理。

首先需要在 eu.org 管理后台中修改域名的 nameservers 修改成 Cloudflare 的 NS 地址。

通常是：

- phil.ns.cloudflare.com
- vera.ns.cloudflare.com

这两个地址可以在 Cloudflare 后台添加域名之后获得。

在 Cloudflare 添加新申请的域名，如果添加的时候提示：

    eu.org is not a registered domain

或者提示这个域名没有注册，就等待一下 EU.org 刷新 WHOIS，然后等待一会儿再尝试添加。