---
layout: post
title: "kindlepush_bot 机器人使用指南"
aliases: "kindlepush_bot 机器人使用指南"
tagline: ""
description: ""
category: 经验总结
tags: [telegram, kindle, bot,  ]
last_updated:
---

这是一篇 Telegram kindlepush_bot 机器人绑定邮箱的教程。

推送邮箱绑定指南。

## 使用 163 邮箱作为推送邮箱

使用电脑登录 <https://mail.163.com> ，右上角「设置」，选择「POP3/SMTP/IMAP」设置。

![MaQI](https://photo.einverne.info/images/2024/07/25/MaQI.png)

在设置中，勾选 「POP3/SMTP 服务」，这个时候会弹出一个确认界面，点击确认，设置授权码。

![M1i4](https://photo.einverne.info/images/2024/07/25/M1i4.png)

开启「设置客户端授权码」，这个时候绑定的手机会收到一个短信。记住该授权码。

将完整的邮箱和授权码，作为发送者邮箱和发送者密码发送给机器人即可。

最后不要忘了到 Amazon 后台将自己的发送邮箱设置为可信邮箱。

在设置的时候如果遇到 (550, b'User has no permission') 错误。需要设置：

![MCAW](https://photo.einverne.info/images/2024/07/25/MCAW.png)

如果遇到 (535, b'Error: authentication failed') 错误，同样需要使用 163 邮箱的授权码，而不是密码。

## 使用 QQ 邮箱作为推送邮箱

为了你的帐户安全，更改 QQ 密码以及独立密码会触发授权码过期，需要重新获取新的授权码登录。

进入设置 -> 账户，开启 POP3/SMTP 服务。

![MEjQ](https://photo.einverne.info/images/2024/07/25/MEjQ.png)

根据提示验证密码。

获取授权码。

## 使用 Gmail 作为推送邮箱

建议开启二步验证后使用专有密码来设置 `kindlepush_bot` 的发送密码。

首先登录：

- <https://myaccount.google.com/>

选择「安全性]

![M5pX](https://photo.einverne.info/images/2024/07/25/M5pX.png)

点击应用专用密码。中间可能需要重新输入密码。

![MdOi](https://photo.einverne.info/images/2024/07/25/MdOi.png)

选择自定义名称：

![Mzb0](https://photo.einverne.info/images/2024/07/25/Mzb0.png)

输入 `kindlepush_bot`，获取一次性的验证码。

### 使用 Gmail 密码

登录 Gmail 账户

在设置页面开启 less secure apps <https://www.google.com/settings/security/lesssecureapps>

![MZw9](https://photo.einverne.info/images/2024/07/25/MZw9.png)

然后登录 <https://accounts.google.com/DisplayUnlockCaptcha> 根据提示进行设置
