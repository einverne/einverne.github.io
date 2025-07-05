---
layout: post
title: "NameCrane 邮件托管服务体验：超大存储空间的终身邮箱解决方案"
aliases:
- "NameCrane 邮件托管服务体验：超大存储空间的终身邮箱解决方案"
tagline: ""
description: ""
category: 产品体验
tags: [ namecrane, email-hosting, email-provider, email-server, email-route, email-host, domain-email ]
create_time: 2025-05-22 21:34:47
last_updated: 2025-05-22 21:34:47
dg-home: false
dg-publish: false
---

去年黑五以及今年年初逛论坛的时候偶然间发现一款邮件托管服务 NameCrane，我自己一直都有发邮件的需求，我自己也有维护[邮件服务器](https://client.einverne.info/)，但是看到有合理的邮件托管服务还是会忍不住多看一下，于是我就被 [NameCrane](https://gtk.pw/namecrane) 提供的终身套餐吸引住了。

## CraneMail 服务概述

[NameCrane](https://gtk.pw/namecrane) 的 CraneMail 是一个专业的商业邮件套件，集成了云存储、网页邮件客户端、垃圾邮件过滤等多种功能。它被定位为 Google Workspace 和 Office 365 的替代品，但价格更为亲民。NameCrane 是 BuyVM 旗下独立公司。

在黑五促销期间，[NameCrane](https://gtk.pw/namecrane) 推出了几个特别优惠的套餐，其中最吸引我的是 250GB 的终身套餐，只需一次性支付 69.42 美元。考虑到这个价格可以获得永久使用权，我毫不犹豫地购买了这个套餐。

## 主要功能特点

- 支持多域名
- 域名无限别名，每个域名无限邮箱数量
- 每个域名每小时 600 封邮件发送限制
- 超大的容量和空间，支持 FTP 和 SFTP，可以挂载 [[AList]] 来使用，也可以和 [[rclone]] 挂载使用
- CraneMail 节点使用 ZFS 支持的存储和镜像 NVMe 进行邮件处理
- 服务器数据异地备份每小时进行一次，用于灾难恢复
- 支持 IMAP/SMTP/POP，另赠送 eM Client Pro 许可证
- 网页邮件双因素认证
- 语音/视频/文字聊天（XMPP/Jabber）支持外部客户端，文件共享带预览功能
- 联系人和日历共享，完整的 CardDAV/CalDAV 支持
- 支持从其他邮箱接受邮件
- 基于 OnlyOffice 的网页文档编辑，支持文档/电子表格/演示文稿（测试版）
- 邮件归档 - 为特定邮箱保存收发邮件的额外副本，永不意外删除邮件（计入主存储空间）
- 简单的电子报/邮件列表退订功能
- [访问 SmarterMail 网站查看所有功能列表](https://www.smartertools.com/smartermail/business-email-server)

目前，CraneMail 在美国（拉斯维加斯）数据中心提供服务，另外最近还推出了阿姆斯特丹数据中心。

### 专业邮件功能

使用 CraneMail 几个月后，我发现它的功能远超我的预期：

- **优秀的网页邮件体验**：界面类似 Outlook，操作直观，集成了邮件、联系人、日历等功能。
- **SpamExperts 垃圾邮件过滤**：内置高级垃圾邮件过滤系统，有效阻挡垃圾邮件。
- **内置邮件迁移工具**：可以轻松从现有邮件提供商迁移邮件。
- **良好的邮件送达率**：通过自己的出站中继发送邮件，保持良好的发件人声誉。

NameCrane 还给每个客户提供了 3 个免费的 eM Client Pro 许可证。

![PjiC](https://photo.einverne.info/images/2025/05/22/PjiC.png)

除了基本的邮件功能外，CraneMail 还提供：

- **集成云存储**：可以轻松上传和分享大文件。
- **联系人和日历共享**：完整的 CardDAV/CalDAV 支持。
- **OnlyOffice 文档编辑**：网页版文档、电子表格和演示文稿编辑功能（测试版）。
- **双因素认证**：增强网页邮件的安全性。

![PPmh](https://photo.einverne.info/images/2025/05/22/PPmh.png)

### 内置邮件迁移工具

NameCrane 内置了**邮件迁移工具**，可以轻松从现有邮件提供商迁移到 NameCrane 邮箱。只需要输入 Gmail，Outlook 等服务提供商，通过标准 IMAP 可以完成批量迁移。但是对于 iCloud 邮件迁移成功率比较低。

### SpamExperts 的高级垃圾邮件过滤

每个 CraneMail 账户都搭配 SpamExperts 的垃圾邮件过滤服务。过滤通过我们的本地 SpamExperts 节点进行。您可以访问控制面板来调整垃圾邮件过滤设置、释放/训练邮件等。

### 最新功能更新

[NameCrane](https://gtk.pw/namecrane) 因为刚刚推出不就，还在不断更新新的功能：

1. **Z-Push (ActiveSync)**：支持 iOS 设备推送邮件/联系人/日历。
2. **Rclone 支持**（测试版）：可以通过 Rclone 工具访问和管理云存储。
3. FTP 和 SFTP 的支持，可以充分利用大容量作为存储

### FTP 信息

```
FTPS信息
主机：us1.workspace.org
端口：8221
用户名：您的电子邮件
密码：您的密码

SFTP信息
主机：us1.workspace.org
端口：8222
用户名：您的电子邮件
密码：您的密码
```

这些新功能提升了在移动设备上使用的便捷性，用户可以获得实时邮件通知。

## SMTP

配置信息如下

| Protocol | Name / Host       | Port | SSL / TLS     | Purpose                         |
| -------- | ----------------- | ---- | ------------- | ------------------------------- |
| SMTP     | us1.workspace.org | 465  | Yes (SSL/TLS) | Outgoing emails                 |
| SMTP     | us1.workspace.org | 587  | Yes (SSL/TLS) | Outgoing emails                 |
| POP      | us1.workspace.org | 995  | Yes (SSL/TLS) | POP client connections over SSL |
| IMAP     | us1.workspace.org | 993  | Yes (SSL/TLS) | IMAP client over SSL            |
| POP      | us1.workspace.org | 110  | None          | POP client connections          |
| IMAP     | us1.workspace.org | 143  | None          | IMAP client connections         |


## 历史套餐价格

```
CraneMail BF 100G
100GB邮件+存储服务（100GB Combined Mail & File Storage）
可绑定15个域名
无限域名转发
无限Mailboxes
SpamExperts Premium Spam Filtering
600 Sent Emails/hour per Domain
$10 / 年, $20 / 3 年

CraneMail LIFETIME 250G
250GB邮件+存储服务（250GB Combined Mail & File Storage）
可绑定15个域名
无限域名转发
无限Mailboxes
SpamExperts Premium Spam Filtering
600 Sent Emails/hour per Domain
$69.42 / 永久
```

价格变动

值得注意的是，[NameCrane](https://gtk.pw/namecrane) 已经宣布从 2025 年 4 月 1 日起，CraneMail 终身计划的价格将上调。如果你对这项服务感兴趣，现在购买可能是最经济的选择。

## 我的使用体验

使用 [NameCrane](https://gtk.pw/namecrane) 的 CraneMail 服务几个月后，我对其稳定性和功能非常满意。作为一个经常需要管理多个域名邮箱的用户，我特别欣赏它的无限邮箱功能和直观的管理界面。

邮件送达率一直保持良好，垃圾邮件过滤效果也很出色。云存储功能让我可以轻松分享大文件，而不必依赖第三方服务。最重要的是，一次性支付 69.42 美元获得终身使用权，让我不必担心未来的订阅费用增加，这在当今订阅模式盛行的时代显得尤为珍贵。

### 我购买的套餐记录

CraneMail 250GB 终身套餐提供：

- 250GB 邮件和云存储组合空间
- 最多支持 15 个主域名
- 无限域名别名
- 每个域名无限邮箱数量
- 每个域名每小时 300 封发送邮件限制，不是一个用于批量邮件、营销邮件等的服务，主要是一个面向商业/个人的收件邮箱托管服务。

这对于个人用户来说非常慷慨，尤其是可以添加多个域名的功能，让我可以为不同的项目或用途设置专门的邮箱。

## 结论

如果你正在寻找一个功能全面、价格合理的邮件托管服务，特别是如果你需要管理多个域名和邮箱，[NameCrane](https://gtk.pw/namecrane) 的 CraneMail 值得考虑。虽然它可能不像 Google Workspace 或 Office 365 那样知名，但它提供了这些服务的大部分功能，而价格却低得多，尤其是考虑到终身套餐的长期价值。对于那些重视邮件服务稳定性和长期成本效益的用户来说，[NameCrane](https://gtk.pw/namecrane) 的 CraneMail 终身套餐是一个值得认真考虑的选择。
