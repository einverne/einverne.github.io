---
layout: post
title: "端到端加密邮箱 Skiff 邮箱使用体验"
aliases:
- "端到端加密邮箱 Skiff 邮箱使用体验"
tagline: ""
description: ""
category: 产品体验
tags: [skiff, skiff-mail, custom-domain-mail, mail, email, mailbox,]
create_time: 2023-07-14 14:46:58
last_updated: 2023-07-14 14:46:58
---

去年的时候有介绍过一款 Web3 下的协同文档 [Skiff](/post/2022/05/skiff-web3-mail-docs.html)，虽然我自己没有在深入使用，但是一直都在观察它的发展，之前也简单的介绍过 Skiff 邮箱，但当时 Skiff 提供的域名邮箱只能够使用 `@skiff.com` 自己的邮箱后缀，自定义的域名邮箱需要付费。但是今年 Skiff 周年的时候，免费的用户也可以绑定一个域名，因为 Skiff 提供了不错的 Web 界面，并且还提供了不错的客户端，所以如果有朋友不想自己折腾，先尝试一下 [Skiff](https://gtk.pw/skiff) 提供的邮箱也不错。

## 2024 年更新

Skiff 已经被 [[Notion]] 收购，将在 6 个月内关闭服务。

## Skiff 介绍

Skiff 本来是一个 Web3 下的协同文档工具，可以帮助用户在区块链上创建和共享文档。但是随着它业务的扩张，现在也提供了邮箱服务，感觉就是要对标 Web 3 下面的 Google 套件，目前 Skiff 不仅有协同文档，邮件，还有日历，同步云盘。

![DOPR](https://photo.einverne.info/images/2023/07/14/DOPR.png)

Skiff 的主要特点包括：

1. 去中心化：Skiff 使用区块链技术，将文档存储在多个节点上，而不是集中存储在单个服务器上。这意味着即使某个节点被攻击或故障，其他节点仍然可以继续提供服务。
2. 安全性：由于 Skiff 使用了区块链技术，所有的文档修改都会被记录在不可篡改的区块链上。这确保了文档的完整性和可追溯性，并防止了潜在的篡改或删除。
3. 透明性：所有参与者都可以查看和验证文档的历史记录和更改。这使得合作方更加信任和理解彼此的操作，并减少了可能引起纠纷或争议的情况。
4. 实时协作：Skiff 允许多个用户同时编辑同一份文档，并实时显示其他用户对文档所做的更改。这使得团队成员能够更好地协同工作，提高工作效率。
5. 智能合约支持：Skiff 可以与智能合约集成，使得文档的创建和访问可以通过智能合约进行管理和控制。这为文档的权限管理和审计提供了更高级别的自动化。

![skiff mail](https://photo.einverne.info/images/2022/05/25/z5AY.jpg)

### 域名邮箱

优点 ：

- 免费的 10GB 空间
- 免费的一个域名
- 端到端加密
- 去中心化
- 界面干净

缺点：

- 不提供 SMTP
- Skiff 这个项目的未来有待观察

### 注册与登录

Skiff 邮箱可以使用传统的注册（用户名密码），也可以使用 Web 3 的 [[MetaMask]] 小狐狸来登录使用。

### 收费方案

Skiff 目前提供了三档付费方案，ESSENTIAL，PRO，BUSINESS，另外 Skiff 也支持使用加密货币支付。

![D2YM](https://photo.einverne.info/images/2023/07/14/D2YM.png)

## 另外做个广告

如果有人想要使用自定义域名邮箱，不妨试试购买 [EV HOST](https://client.einverne.info/order.php?step=1&productGroup=9) 我在维护的服务，使用 EV_MAIL 可以享受 6 折优惠，最低 30 元一年，无限制域名，无限制别名，但不能恶意滥用，不能发送垃圾邮件，另外每个小时有 300 封邮件的发件限制。购买之后只需要进行简单地几条 DNS 设置就能立即开始使用。我过去也有写过很多关于电子邮件的文章，可以在博客中搜索到。[调研的邮箱服务](https://blog.einverne.info/post/2017/07/email-services-collection.html) ，中间还考虑过自建域名邮箱  [Mailu](https://blog.einverne.info/post/2021/07/email-server-mailu.html)， [Mailcow](https://blog.einverne.info/post/2022/04/mailcow-email-server.html) 。
