---
layout: post
title: "常见的邮件发送错误"
aliases:
- "常见的邮件发送错误"
tagline: ""
description: ""
category: 经验总结
tags: [ 经验总结, email, smtp, mail-server, mail, email-hosting, ev-hosting ]
create_time: 2024-03-09 17:37:27
last_updated: 2024-03-09 17:37:27
dg-home: false
dg-publish: false
---

本文总结常见的邮件发送的错误。

## 450

> 450 4.1.8 Sender address rejected: Domain not found

这个错误提示表明发件人地址被拒绝，因为域名未找到。这通常是由于发件人地址的域名无法在 DNS（域名系统）中找到所致。解决这个问题可能需要以下步骤：

- 检查发件人地址：确保你使用的发件人地址是正确的，并且包含有效的域名。如果你使用的是自定义域名，请确保该域名已正确配置，并且在 DNS 中有相应的记录。
- 验证域名配置：确保你的域名已经在 DNS 中正确配置。你可以通过使用 DNS 查询工具来验证域名的 MX 记录、SPF 记录和其他必需的记录是否已设置正确。
- 确认域名注册：如果你使用的是自定义域名，确保该域名已经注册，并且没有过期或被暂停。有时域名注册过期或被暂停会导致域名无法解析。
- 检查 DNS 服务器设置：如果你使用的是自托管的邮件服务器，确保你的 DNS 设置正确，包括正确配置了邮件服务器的 A 记录、MX 记录等。
- 联系你的域名注册商或托管提供商：如果以上步骤都无法解决问题，你可以联系你的域名注册商或者托管提供商，向他们寻求帮助解决域名解析问题。

表示邮件被拒绝了，因为发件人的邮箱无法正确解析，因为特定的 DNS 记录（A，MX，PTR 记录） 缺失了。

- [Intodns.com](https://intodns.com/)
- [Mxtoolbox.com](https://mxtoolbox.com/)
- [Whatsmydns.net](https://whatsmydns.com/)

![DmML](https://photo.einverne.info/images/2023/08/03/DmML.png)

## 50

> 50 5.1.1: Recipient address rejected: User unknown in local recipient table

这个错误表示你尝试发送邮件给一个在本地收件人表中未知的用户。

## 553

> 553 5.7.3 CONTENT REJCT：blockid=xx:URL

这个错误意味着你尝试发送的邮件包含被拒绝的内容，通常是因为邮件包含了被认为是垃圾邮件或恶意链接的内容。通常是如下的原因：

- 恶意链接或内容：邮件中包含的链接可能被认为是恶意链接，或者邮件内容被认为是垃圾邮件。
- 邮件服务器策略：邮件服务器可能已经配置了策略，拒绝包含特定类型内容的邮件。

遇到此错误一般可以检查一下发送的邮件是否合法，是否包含恶意链接或内容。

## 550

Recipient address rejected: User unknown in virtual mailbox table

> Net::SMTPFatalError: 550 5.1.1 <your@email.address>: Recipient address rejected: User unknown in virtual mailbox table

错误表明你尝试发送邮件给一个在邮件服务器的虚拟邮箱表中不存在的用户。

可能是如下的原因：

- 输入的收件人邮箱有错误
- 收件人的信箱已经被删除或禁用
- 邮件配置有错误