---
layout: post
title: "利用 Cloudflare 和 Gmail 配置域名邮箱的收发"
aliases: 
- "利用 Cloudflare 和 Gmail 配置域名邮箱的收发"
tagline: ""
description: ""
category: 经验总结
tags: [cloudflare, cloudflare-email, google-domains, google, gmail]
last_updated:
create_time: 2022-04-06 01:53:22
last_updated: 2023-01-18 08:57:52
---

早在 2022 年年初的时候 Cloudflare 就推出了 Email Routing 的服务，在第一时间就从 Google Domains 中迁移到了 Cloudflare，中间好像也没有遇到什么问题，正常的收到域名邮箱的邮件，转发到 Gmail。

> Cloudflare Email Routing (beta) is designed to simplify the way you create and manage email addresses, without needing to keep an eye on additional mailboxes. With Email Routing, you can create any number of custom email addresses that you can use in situations where you do not want to share your primary email address, such as when you subscribe to a new service or newsletter. Emails are then routed to your preferred email inbox, without you ever having to expose your primary email address.
>
> Email Routing is free and private by design. Cloudflare will not store or access the emails routed to your inbox.

## Prerequisites

- 首先需要将域名添加到 Cloudflare
- Cloudflare 已经开通 Email Routing 功能
- 一个可以接收 Email Routing 的 Gmail 邮箱

## 接收邮件

Cloudflare 接收邮件的设置非常简单，在页面中可以创建自定义地址的域名邮箱，然后自动转发至指定的首选邮箱。也可以设置 Catch-all 将所有发送至域名邮箱的邮件，即使没有定义前缀也全部转发到指定邮箱。

![cloudflare-email-routing](https://photo.einverne.info/images/2023/01/18/gA33.png)

具体步骤：

- 点击电子邮件 -> 开始使用
  - 创建自定义邮件地址
- 会收到一封验证电子邮件路由地址邮件，点击验证电子邮箱地址，验证成功后会提示启用电子邮件路由，点击添加记录并启用
  - Cloudflare 会自动设置 DNS 记录

随后发往该域名邮箱的所有邮件都会通过 Cloudflare 转发到指定的 Gmail 中。

## 发送邮件

使用 Cloudflare 的域名邮箱发送邮件则需要用到 Gmail 中的设定。Cloudflare Email Routing 自身是不支持发送邮件的。但可以通过如下方法实现域名邮箱的发送：

- Gmail SMTP
- [[sendinblue]] 等等第三方[邮件发送服务提供商](/post/2017/07/email-services-collection.html)
- [[AWS SES]] 邮件发送服务

首先要生成[应用专用密码](https://myaccount.google.com/apppasswords)，主要用来代替密码来登录 Gmail，如下图，记住生成的密码。

![](https://photo.einverne.info/images/2023/01/18/gUxY.png)

然后打开 [Gmail](https://mail.google.com/mail)，点击「Settings」，在所有的设置中，找到 「Accounts and Import」，在「Send mail as」中，点击「Add another email address」。

在弹出的对话框中设置「Name」和 「Email address」：

- 邮箱名字用于发送邮件的默认名，会显示在邮件上
- 域名邮箱地址填写 Cloudflare 中配置的邮箱，确保可以接收邮件

然后进入下一步：

- SMTP 填写 `smtp.gmail.com`
- port 端口默认
- username 填写 Gmail 账号
- password 填写之前获取的专属应用密码

填写成功之后，需要填入验证码，域名邮箱会收到一份邮件，包含验证码，在页面上填入即可。

完成配置之后，在发送邮件的时候就可以选择自定义的邮箱了。

不过需要注意的是，通过 Gmail 代发的邮件在 QQ 邮箱，163 邮箱等邮箱中会显示代发邮箱本身，并且会出现「**此地址未验证，请注意识别**」等等字样。如果介意这一点，可能还是需要找一家正规的域名邮箱服务提供商比较合适。

