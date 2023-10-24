---
layout: post
title: "EV Hosting 共享邮件服务"
aliases:
- "EV Hosting 共享邮件服务"
tagline: ""
description: ""
category: 产品体验
tags: [ev-hosting, email-hosting, shared-web-hosting, directadmin, clientexec, ]
create_time: 2023-05-24 18:24:49
last_updated: 2023-05-24 18:24:49
---

过去的一个月里面 [EV Hosting](https://client.einverne.info) 陆陆续续更新了[共享主机服务](/post/2023/04/introducing-ev-hosting.html)，[域名注册服务](/post/2023/05/ev-hosting-domain-registrar.html)，现在因为我自己使用域名邮箱一直也在使用域名邮箱，所以现在也推出了域名邮箱服务。

很早之前就想给自己的网站弄一个自定义的域名邮箱发发验证码，邮件通知之类的，就了解了一下域名邮箱的服务。我自己之前就尝试过国内的一系列的域名邮箱，但后来这种限制（绑定电话，限制发件）就不再使用了，之前的网站我是自己注册了一个 Gmail SMTP 发件，虽然没遇到什么大的问题，但 Gmail 还是有一些发件限制的（每 24 小时不能超过 500 封）一旦超过，可能 Gmail 收发件都会收到影响。另外我还[调研](https://blog.einverne.info/post/2017/07/email-services-collection.html)  了其他的一些邮件发送服务，但是最开始的时候，我就没有想使用大公司的服务（虽然 AWS 好像提供一个月上万的邮件发送额度，我还是没有考虑）。中间还考虑过自建域名邮箱  [Mailu](https://blog.einverne.info/post/2021/07/email-server-mailu.html)， [Mailcow](https://blog.einverne.info/post/2022/04/mailcow-email-server.html)  对于接受邮件来说没有任何问题，但是对于发信来说，还是依赖于服务器的 IP 地址的权重，所以最后我还是将发信迁移到了  [MXRoute](https://blog.einverne.info/post/2023/03/mxroute-usage.html)，我体验了一段时间之后觉得不错，所以也申请了一个转售，现在在  [这里](https://client.einverne.info/order.php?step=1&productGroup=9)  购买使用 EV_MAIL 折扣码可以获得 6 折优惠，最低 30 元一年。后台使用的 DirectAdmin 面板，购买后配置几条 DNS 记录就能直接开始用了。注意不要发送垃圾邮件。另外每小时发送 300 封的限制只存在每个邮箱，也就是注册邮箱，通知邮箱可以单独开来以提升发件的限制，这对于我来说以及完全足够了。

## 体验套餐

为了让大家快速体验这个域名邮箱托管服务，现在设置了一个[体验套餐](https://client.einverne.info/order.php?step=1&productGroup=9&product=46) 只需要 24 元就可以购买入门的套餐，包含 500 MB 空间，一个域名，一个子域名，每个邮箱可以享受每小时 300 封邮件的发信。

## 使用教程

共享的域名邮箱服务由 [[MXRoute]] 提供服务，使用 [[DirectAdmin]] 控制面板，在购买之后会收到一封叫做「您的自定义域名邮箱帐号信息」其中包含了使用该邮箱的具体信息。

使用自定义域名邮箱一般需要设置几条 DNS 记录。

- [[MX 记录]]，用设置接受邮件的路由
- [[SPF]] 记录，SPF 让域名所有者可以授权允许发送其域名邮箱的 IP 地址。用来防止其他人伪装你的域名。
- [[DKIM]] 记录，允许发送者通过在邮件 header 中包含一段数字签名来鉴定其邮件。DKIM 使用公钥加密来确保邮件内容是从权威邮件服务器发送的。
- [[DMARC]] 记录，防止伪装邮件的 From

所有具体的配置[教程](https://client.einverne.info/index.php?fuse=knowledgebase&controller=articles&view=article&articleId=20) 可以参考 [EV Hosting 的知识库](https://client.einverne.info/index.php?fuse=knowledgebase&controller=articles&view=article&articleId=20) 所有配置的详情都可以从收到的邮件中获得。

当完成配置之后，就可以在 DirectAdmin 界面中创建邮箱，然后进行邮件的收发了。
