---
layout: post
title: "免费发送邮件的服务收集整理"
aliases: "免费发送邮件的服务收集整理"
tagline: ""
description: ""
category: 整理合集
tags: [email, collection, email-service,]
last_updated:
---

这一篇文章整理了一下目前互联网上免费，并且能够稳定发送邮件的服务，能够满足个人使用需求，能够通过 API 调用直接发送邮件的服务。

个人的一些要求有这些：

- 有一些免费的额度可以供测试及小规模的使用
- 域名不需要备案直接配置 DNS 即可使用


## Elastic Email
Elastic Email 似乎是一家加拿大的公司。官网地址：

- <https://elasticemail.com/>

在官网上可以看到调用 API 发送邮件的价格大约在 1000 封邮件 $0.12 左右。当每天发送超过 100 封邮件的时候需要增加支付方式。这也就意味着当每天发送的邮件数量不超过 100 封邮件的时候完全免费。但一旦超过数量，就必须购买其服务。如果一个月超过 10000000 封邮件的时候可以联系客服给予优惠价。


## Mailgun
Mailgun 提供了 HTTP API 和 SMTP 两种方式发送邮件。

~~免费服务每个月 10000 封 / 单个域名 限制，个人其实完全用不完。~~

Mailgun 似乎调整了收费方式，对于新注册的用户，前三个月可以每个月有 5000 封邮件的免费额度。一旦超过 3 个月，就需要根据使用来选择套餐付费使用。

## SendGrid

免费服务每天可以发送 100 封邮件，同样支持 API 和 SMTP 方式，还可以使用 Webhook 方式。

## Mailjet
个人还没有注册


## Postmark
每个月 100 封邮件


## SparkPost


## mailchimp
Mailchimp 是一个电子邮件订阅的在线工具。


## SendCloud
搜狐的服务，免费账号 50 封邮件 / 天 20 条短信 / 天。需要域名备案。

- https://sendcloud.sohu.com/price.html

## Amazon SES
如果是通过 Amazon EC2 托管的程序，每个月前 62000 封邮件免费。

- <https://aws.amazon.com/cn/ses/>

## sendinblue


