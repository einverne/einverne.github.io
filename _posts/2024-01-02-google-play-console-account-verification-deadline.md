---
layout: post
title: "Google Play Console 账户身份验证"
aliases:
- "Google Play Console 账户身份验证"
tagline: ""
description: ""
category: 经验总结
tags: [google, play-store, google-play, android-develop, development]
create_time: 2024-02-07 13:34:07
last_updated: 2024-02-07 13:34:07
---

早好几个月就收到了 Google Play Console 的身份验证请求，一直也没有理会，但是今天突然收到一封邮件告诉我，如果再不处理，那么就要按照删除帐号处理了，吓得我赶紧登录了后台查看。大致浏览了一下，说是开发者帐号需要完成帐号的验证以满足 Play Console 的最低要求，我这个帐号开通的时间比较久了，上大学那一会儿交了钱就开通了，也没有说要验证什么内容。

但是网上查了一下之后这个身份验证功能 2021 年就推出了，但是当时没有启用验证，只是在部分地区开启了，目的是为了限制恶意注册开发者帐号，利用伪造的开发者帐号来上传恶意软件和诈骗应用的人。

然后时间回到现在，如果要在 Google Play 上分发应用，那么就必需要验证身份，好在 Google Play Console 里面允许用户选择是个人帐号还是组织帐号。直接设定截止日期，然后通过个人帐号，提供身份证件，提交即可。

## Verify your developer account

在 10 月 30 号之前需要验证账户。

![S6zM9D5OYp](https://pic.einverne.info/images/S6zM9D5OYp.png)

开始

![KlGaQ5W1eI](https://pic.einverne.info/images/KlGaQ5W1eI.png)

我是个人账号，如果是组织账号，需要 [[D-U-N-S]] 号。

![YaI8TxceXW](https://pic.einverne.info/images/YaI8TxceXW.png)

需要连接一个支付信息来验证身份。

![lkR4gt-vk-](https://pic.einverne.info/images/lkR4gt-vk-.png)

之后需要创建一个合法的支付 Profile。

需要添加国家以及一个合法的地址。

然后需要确认用户的邮箱，手机号，我直接使用 Google Voices 的验证。

需要注意的是如果提交材料之后需要验证地址和身份。

连接 Google Payment profile 的时候千万要注意，一旦连接 Payments profile 之后就不能解开，或者更改。

![nSX-O5fKPE](https://pic.einverne.info/images/nSX-O5fKPE.png)



![eEYP-Xt34O](https://pic.einverne.info/images/eEYP-Xt34O.png)

更新个人开发者账号信息

通过填写[表单](https://support.google.com/googlepay/contact/change_name_address?sjid=9248559490398603859-AP)，更改法定名字和地址。

验证合法的名字需要

- 驾照
- 护照
- State ID
- 绿卡

![mTaZxpDxjn](https://pic.einverne.info/images/mTaZxpDxjn.png)

需要地址证明

- 政府发行的文件
- 手机电话账单
- 银行对帐单
- 租房或抵押贷款合约

![dwIsV8pBRD](https://pic.einverne.info/images/dwIsV8pBRD.png)

## related

- [Google 帮助文档 验证开发者身份信息](https://support.google.com/googleplay/android-developer/answer/10841920?sjid=9248559490398603859-AP&authuser=1#zippy=%2C%E4%B8%AA%E4%BA%BA%E8%B4%A6%E5%8F%B7)
