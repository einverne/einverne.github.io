---
layout: post
title: "爱沙尼亚电子公民身份启动及邮件转发"
aliases:
- "爱沙尼亚电子公民身份启动及邮件转发"
tagline: ""
description: ""
category: 经验总结
tags: [estonia, e-residency, e-id, id-card,]
create_time: 2024-10-01 21:40:02
last_updated: 2024-10-01 21:40:02
dg-home: false
dg-publish: false
---

今年 6 月份的时候[申请](https://blog.einverne.info/post/2024/06/estonia-e-residency.html) 了爱沙尼亚电子居民卡，其实一个月左右就已经审批通过了，但是一直懒得没有去拿，直到 9 月底，终于抽出空来去了趟东京的爱沙尼亚大使馆，领取了实体卡片。

## 领取卡片

在申请审批通过之后会收到一封邮件，告诉卡片会寄往选择的大使馆，等到了大使馆之后，会再接受到一封通知邮件，在 6 个月之内去大使馆领取即可。在东京大使馆需要提前在网页预约，在预约的时候发现东京的大使馆竟然只在周一和周三上午 10:30 到 12:30 工作，大使的这一份工作也太轻松了，真正的每周工作 4 小时！

在预约的时间到大使馆之后，按门铃，说明来意，会有人接待并邀请上二层，在二楼大厅等待一会儿就有来准备初期的工作，只见一个胖胖的工作人员，也不知道是不是大使，在电脑上敲了一会儿，让我出示护照，然后叫我录入指纹，最后签名，加上日期，就完成了实体 ID 卡的交付。整个过程没有超过 10 分钟。

录入的指纹会回传给爱沙尼亚边境和警察局，因为时差的原因，一般在 24 小时之内会收到一封邮件说明卡片已经激活，之后就可以正常使用了。

领取到的 e-Residency Kit 如下。

![zFh5wnjZJj](https://pic.einverne.info/images/zFh5wnjZJj.jpeg)

盒子中有这几件东西

- 卡片
- 读卡器
- 密码信封
- 使用说明

我们可以参考官方给出的 [欢迎指南](https://www.e-resident.gov.ee/welcome/) 首先将卡片和读卡器进行组合使得卡片和通过 USB 连接。

## 安装

通过 [官方 ID Software](https://www.id.ee/en/article/install-id-software/) 下载对应系统的应用，ID-software 支持 Windows，macOS，Chrome，Safari，还有一个独立的 DigiDoc4 客户端可以用来签名文件。

惊讶地发现这个软件还是开源的，代码全部托管在了[GitHub](https://github.com/open-eid/)，应该是由爱沙尼亚 Information System Authority 负责的。

![1s5VWhAy2K](https://pic.einverne.info/images/1s5VWhAy2K.png)

安装完成之后，需要在 Chrome 中[启用 Web eID](https://www.id.ee/en/article/configuring-browsers-for-using-id-card/)。如果没有弹出这个启用的窗口，可能需要重启一下 Chrome。

e-ID 本质上其实就是一个安全证书，基于公钥 PKI，来确保系统安全，并负责验证数字证书持有者身份的一种方式。

## 邮件转发

安装好软件之后，可以设置 @eesti.ee 的邮箱，每一个 e-Residency 卡片，都会有一个默认的 @eesti.ee 邮箱，可以登录官方的网站 <https://www.eesti.ee/en> 将邮箱自动转发到常用的邮箱，比如 Gmail 中。

![pk1LPq0L0q](https://pic.einverne.info/images/pk1LPq0L0q.png)

- 首先使用 e-Residency digital ID 卡片登录网站
- 然后选择侧边栏 Mailbox -> Mailbox settings，或者直接访问 <https://www.eesti.ee/eraisik/en/postkast/seaded>
- 然后在邮箱设置中添加一个个人的邮箱，绑定激活码。

爱沙尼亚国家信息管理局 RIA，在 2023 年停止了用户 firstname.lastname@eesti.ee 和 company@eesti.ee 地址的私人通信邮件服务。每个人分配的私人邮件地址是 2005 年到 2018 年发放个人数字居民身份时自动创建的。政府官员说，转发到个人邮箱这个功能早在 20 年前就已经存在，有转发这样的服务存在，政府不需要花费纳税人的钱来维护私人邮箱这样很少被人使用的服务。

已经创建的 59 万个邮件中只有 2% 被积极使用，60% 的拥有 @eest.ee 邮箱的人甚至都不知道自己拥有这个邮箱地址，70% 的人认为没有必要。公司名称的地址有 25.6 万个，这些邮箱的使用甚至比个人邮箱还要少。[^1]

[^1]: <https://news.err.ee/1608966110/ria-ends-support-for-eesti-ee-email-addresses>

## 其他服务

有了 ID Card 之后，很多爱沙尼亚的政府公共服务都可以登录，比如爱沙尼亚的车辆管理所，可以在线申请驾照，注册车辆等。

也有很多商业公司，比如爱沙尼亚的域名注册商 zone.ee 也可以使用 ID Card 登录。

更多的服务可以直接参考官方网站，比如[如何注册公司](https://www.e-resident.gov.ee/start-a-company/)。
