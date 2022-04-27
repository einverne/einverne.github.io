---
layout: post
title: "什么是 DMARC"
aliases: 
- "什么是 DMARC"
tagline: ""
description: ""
category: 学习笔记
tags: [ dmarc, email, domain, spf, dkim,  ]
last_updated:
---

DMARC 是 Domain-based Message Authentication Reporting & Conformance 的缩写，是一个标准的电子邮件验证标准。[^rfc] DMARC 帮助邮箱管理员防止黑客或其他攻击者伪装（_Spoofing_）其组织和域名。Spoofing（伪装）是一种电子邮件攻击方式，攻击者通过伪装邮件地址中的 From 字段，来假装发件人。DMARC 会检查电子邮件是否来自邮件中声称的发送者。

DMARC 构建在 [[SPF]] 和 [[DKIM]] 基础之上，来防止域名欺诈。

[^rfc]: <https://datatracker.ietf.org/doc/html/rfc7489>

之前提到过[自建域名邮箱](/post/2021/08/poste-self-hosted-email-service.html) 的文章中就配置过 DMARC，这篇文章就对 DMARC 具体展开讲讲。

## DMARC 是什么？

DMARC 建立在广泛使用的 SPF 和 DKIM 协议上, 并且添加了域名对齐检查和报告发送功能。这样可以有效保护域名免受钓鱼攻击。

来自 dmarc.org 的示意图：

![](/assets/what-is-dmarc.jpg)

## 为什么 DMARC 如此重要？

根据 dmarc.org 的说法：

> 随着社交网络和电子商务的繁荣，垃圾邮件发送者和钓鱼攻击发起者基于利益的原因，想要入侵用户的账户，破解用户的信用卡等。Email 的相对容易攻击的特性备受罪犯们的青睐。只是简单地把企业的 logo 嵌入到 email 中，就能获取用户的信任。
>
> 用户很难辨别一封假的 email，邮件提供商也很难判断哪些邮件有可能会伤害用户。邮件发送者基本上对邮件认证的问题一无所知，因为他们缺少合理的反馈机制。那些尝试部署 SPF 和 DKIM 的企业的进展非常慢，因为没有监督进度和除错的机制。
>
> DMARC 解决了这些问题。它帮助 email 发送者和接收者来共同保护 email，避免了昂贵的入侵损失。

## DMARC 记录是什么？

DMARC 记录作为 TXT 记录发布到 DNS 中。指示邮件收件服务当验证失败时，应当如何处理收到的邮件。

比如以下发布在域名 "sender.exampledomain.com" 上的 DMARC 记录：

> v=DMARC1;p=reject;pct=100;rua=mailto:postmaster@exampledomain.com

在这个例子中表示发件人要求收件人如果遇到验证未通过的邮件，则完全拒绝，并且发送相关报告到 `postmaster@exampledomain.com`。如果发件人在测试配置，"reject" 可以被替换成 "quarantine"，表示验证未通过的 邮件将被隔离。

## DMARC 记录标签
DMARC 记录使用可扩展的 “标签-值” 语法。

这是一个典型的 DMARC 记录：

> v=DMARC1; p=reject; rua=mailto: dmarc_report@example.com; ruf=mailto: dmarc_report@example.com; pct=100; adkim=s; aspf=s;

它由多个key-value标签组成。这些标签会告诉邮件服务提供商如何发送 DMARC 报告:

- `v` 是 DMARC 协议版本，它的值必须是 `DMARC1`
- `p` 是策略，策略将被应用到验证失败的邮件上,可以设置成 'none', 'quarantine', 或者 'reject'
    - 'none' 如果接收服务器接收到的邮件没有通过 DMARC 校验，不会做任何操作，邮件会正常被递交
    - 'quarantine' 用来隔离可疑邮件，如果接收服务器收到的邮件没有通过验证，那么会把邮件单独隔离
    - 'reject' 告诉接收方拒收可疑邮件
- rua 是一组用来接收报告的电子邮件地址(DMARC aggregate)
- ruf 是一系列用来接受失败报告的电邮地址(DMARC failure)
- pct 对失败邮件应用策略的百分比
- adkim 制定 DKIM 的对齐策略，可选 `s` 或 `r`
- aspf 制定 SPF 的对齐策略，可选 `s` 或 `r`


### DMARC 策略

DMARC 策略是在 DMARC 记录中制定的 p 标签。它指示邮件服务提供商应该如何处理验证失败的邮件。

DMARC 策略可以取三个值中的一个：none (monitor), quarantine 和 reject。

– **none**: 邮件提供商对验证失败邮件不采取任何处理。这个模式用来收集 DMARC 报告。
– **quarantine**: 邮件提供商把验证失败邮件放到垃圾邮件文件夹。
– **reject**: 邮件提供商拒收验证失败邮件。

## DMARC alignment options
DMARC 对齐策略。DMARC 通过检验 header 部分是否和发送的域名相匹配，这个动作称为 `alignment`，这个部分验证依赖 SPF 和 DKIM。

用户可以在 DMARC 中配置两种 alignment 模式，`strict` 和 `relaxed`。上面提到的 `aspf` 和 `adkim` 选项就是这个作用。`s` 和 `r` 分别是两个缩写。

| 验证方式 | Strict                                   | Relaxed                                              |
| -------- | ---------------------------------------- | ---------------------------------------------------- |
| SPF      | SPF 验证域名，和邮件 Header 中 From 一致 | Header 中的 From 必须匹配域名或子域名                |
| DKIM     | From 中的地址和 DKIM 配置一致            | From 必须匹配 DKIM signature d= 后配置的域名或子域名 |

Envelope sender address: 是 Return-Path 头的邮件地址，收件人是看不到该地址的

From: 地址，收件人看到的地址

SPF alignment example

| Envelop sender address | Header From       | strict | relaxed |
| ---------------------- | ----------------- | ------ | ------- |
| admin@example.com      | admin@example.com | Pass   | Pass    |
| admin@mail.example.com | admin@example.com | Fail   | Pass    |
| admin@example.com      | admin@example.org | Fail   | Fail    |

DKIM alignment example

DKIM signature domain 中的 `d=` 后面部分。

| From                   | DKIM d=     | strict | relaxed |
| ---------------------- | ----------- | ------ | ------- |
| admin@example.com      | example.com | Pass   | Pass    |
| admin@mail.example.com | example.com | Fail   | Pass    |
| admin@example.org      | example.com | Fail   | Fail    | 



## 发布 DMARC 记录
发布 DMARC 记录需要你有权限修改域名的 DNS 记录。

在 DNS 记录后台，需要创建一条 DMARC 记录。

创建一条 TXT 记录:

> Type: TXT Host: _dmarc TXT Value: (DMARC record generated above) TTL: 1 hour

以 Cloudflare 后台为例：

![cloudflare dmarc](/assets/cloudflare-dmarc-config.png)

如果用其他的域名服务的话，界面类似。

保存更改。现在你已经在域名 yourdomain.com 上面成功发布 DMARC 记录了。

## reference

- <https://support.google.com/a/answer/10032169?hl=en&ref_topic=2759254>
- [Getting Started with DMARC](https://dmarcly.com/blog/getting-started-with-dmarc)