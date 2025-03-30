---
layout: post
title: "免费发送邮件的服务收集整理"
aliases: "免费发送邮件的服务收集整理"
tagline: ""
description: ""
category: 整理合集
tags: [email, collection, email-service, linux, smtp]
last_updated:
---

这一篇文章整理了一下目前互联网上免费，并且能够稳定发送邮件的服务，能够满足个人使用需求，能够通过 API 调用直接发送邮件的服务。

个人的一些要求有这些：

- 有一些免费的额度可以供测试及小规模的使用
- 域名不需要备案直接配置 DNS 即可使用

## Gmail SMTP

对于小型的应用，最开始的时候可以使用 Gmail SMTP 来发送邮件，免费，并且送达率由 Google 来保证，基本没有啥问题。

但是 Gmail SMTP 发送有数量限制：

- 对于免费的 Gmail 账号，每 24 小时限制 500 封邮件
- 对于 G Suite 账号每天 1000 封邮件

如果你使用超过了 Gmail 的限制，那么 Google 会在没有任何警告的前提下停止 Gmail 账号的访问，需要等一整天之后才能再访问，所以如果你的服务每天会发送超过 500 封邮件的情况下最好还是不要使用 Gmail。

## Elastic Email

[[Elastic Email]] 是一家加拿大的公司。官网地址：

- <https://elasticemail.com/>

在官网上可以看到调用 API 发送邮件的价格大约在 1000 封邮件 $0.12 左右。当每天发送超过 100 封邮件的时候需要增加支付方式。这也就意味着当每天发送的邮件数量不超过 100 封邮件的时候完全免费。但一旦超过数量，就必须购买其服务。如果一个月超过 10000000 封邮件的时候可以联系客服给予优惠价。

## Mailgun

[[Mailgun]] 提供了 HTTP API 和 SMTP 两种方式发送邮件。

~~免费服务每个月 10000 封 / 单个域名 限制，个人其实完全用不完。~~老账号似乎还有每个月 10000 封邮件的免费额度。但是 Mailgun 的 Free 账号，没有绑定信用卡已经无法添加域名了。

Mailgun 似乎调整了收费方式，对于新注册的用户，前三个月可以每个月有 5000 封邮件的免费额度。一旦超过 3 个月，就需要根据使用来选择套餐付费使用。

而 Mailgun 升级第一档付费的就要 35 美元一个月，并且也只能发送 5 万邮件一个月。

## SendGrid

[[SendGrid]] 免费服务每天可以发送 100 封邮件，同样支持 API 和 SMTP 方式，还可以使用 Webhook 方式。

## MXRoute

[MXRoute](https://mxroute.com/) 是 LowEndTalk 上一位名叫 [jar](https://lowendtalk.com/profile/jar) 的管理员提供的邮件服务，在最便宜的时候可以以 15 美元的价格购买一年的服务，目前也在官网提供 199 美元终身的服务。

MXRoute 不允许发送垃圾邮件，并且对于发送邮件每个电子邮件地址每小时 300 封出站电子邮件。

如果你想以更低的价格使用 MXRoute 的服务，也可以[联系我](https://client.einverne.info) 以更低的价格出售 MXRoute 的服务。

## Resend

[Resend](https://resend.com/home) 是一个专为开发者而服务的发送邮件系统。提供每天 100 封，一个月 3000 封邮件的免费试用额度。

## Mailjet

- <https://app.mailjet.com/signin>

## Postmark

[Postmark](https://postmarkapp.com/) 每个月 100 封邮件免费额度。

Postmark 的优点如下：

1. 高可靠性，保证邮件的传递不丢失
2. 提供 45 天的完整内容历史记录、收件人信息和消息事件
3. 模版支持，可以自定义邮件模版或者使用现成的模版，所见即所得
4. 提供邮件分析功能，可以查看邮件的打开率、点击率等数据
5. 提供 DKIM、Return-Path、DMARC 等验证和技术，保证邮件不被当成垃圾邮件
6. 支持主流编程语言的 API 库和 Restful API，方便接口调用
7. 优秀的客服支持

而 Postmark 的缺点在于：

1. 如果需要发送大量邮件，每月固定费用相对较高
2. Postmark 对开发者友好，对于非技术用户来说，需要一些时间去理解和使用它的功能

至于价格方面，基础计划从每月 15 美元开始，包含 10k 封电子邮件。之后按用量递增，详情请看官网。

## SparkPost

[Sparkpost](https://developers.sparkpost.com/) 屏蔽了 xyz 域名。

## mailchimp

Mailchimp 是一个电子邮件订阅的在线工具。

## SendCloud

搜狐的服务，免费账号 50 封邮件 / 天 20 条短信 / 天。需要域名备案。

- https://sendcloud.sohu.com/price.html

## Amazon SES

如果是通过 Amazon EC2 托管的程序，每个月前 62000 封邮件免费。

- <https://aws.amazon.com/cn/ses/>

## Sendinblue

[[Sendinblue]] 提供免费的发送额度，每天可以至多发送 300 封邮件。

- <https://www.sendinblue.com/>

## mailtrap

[mailtrap](https://mailtrap.io/) 给个人开发这提供免费 500 封测试邮件。

## mail baby

Mail baby 是一个邮件服务提供商。只需要保持每个月 1$ 的费用，每发送 1000 封邮件花费 20 美分。

- <https://www.mail.baby/>

## mail space

Mail Space 最低的一个套餐是每个月 3.33$，年付。每个月可以发送 1000 封邮件。

- <https://mailpace.com/#pricing>

## Tutanota

Tutanota 是一家德国公司，可以支付每个月 1 欧元使用。

- <https://tutanota.com/pricing/>

## mailbox.org

mailbox.org 也是一家德国公司，提供三档套餐：

- Light，2GB 空间，3 个域名昵称，日历和联系人同步，1 欧元/每月
- Standard，10GB 空间，5GB 云端存储，25 个 @mailbox.org 邮箱昵称，50 个自定义域名迷城，3 欧元/每月
- Premium，25GB 邮件空间，50GB 云端存储空间，25 个 @mailbox.org 昵称，250 个自定义域名昵称，9 欧元/每月

- <https://register.mailbox.org/en>

## ProtonMail

ProtonMail 是一款加密电子邮箱。

免费版提供 500MB 空间，每天 150 封邮件限制，3 个文件夹/标签限制。

- <https://protonmail.com/pricing>

## Mailchannels

Mailchannels 是一家邮件发送服务提供商。

- <https://www.mailchannels.com/>

## zoho

一个域名邮箱提供商。

- <https://www.zoho.com/mail/>

## Mailcheap

[Mailcheap](https://www.mailcheap.co/) 是一家提供邮件发送服务的供应商。

## Migadu

[Migadu](https://www.migadu.com/) 是一个收费的域名邮箱服务提供商，看了一下价格还挺贵。

## mailtrap

[mailtrap](https://mailtrap.io/) 是一个发送邮件的服务，免费版本提供每个月 100 封的测试邮件。

## Sendy

[Sendy](https://sendy.co/) 是一个电子邮件发送服务，宣称比 Amazon SES 便宜 100 倍。

## XyaMail

[XyaMail](https://xyamail.com/) 是一个发送邮件的服务，基本套餐 7.99$ 一年，Premium 19.99$ 一年。

## mymangomail

[mymangomail](https://www.mymangomail.com/) 是一个收费的邮件发送服务。

![feVl](https://photo.einverne.info/images/2023/11/20/feVl.png)

## Benchmark
[Benchmark](https://www.benchmarkemail.com/jp/) 每个月可以免费发送 3500 封，之后需要付费。

![vBO8NyxMsF](https://pic.einverne.info/images/vBO8NyxMsF.png)

## 相关

- [[SMTP Relay]]
