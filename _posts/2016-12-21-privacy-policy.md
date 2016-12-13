---
layout: post
title: "更新隐私政策"
tagline: ""
description: ""
category: 经验总结
tags: [Privacy]
last_updated: 
---

今天突然收到 Google Play Store 发来的邮件通知，说违反社区准则，原因是没有隐私政策说明。全文如下：

> Our records show that your app, {Application Name}, with package name {package name}, currently violates our User Data policy regarding Personal and Sensitive Information.

> Policy issue: Google Play requires developers to provide a valid privacy policy when the app requests or handles sensitive user or device information. Your app requests sensitive permissions (e.g. camera, microphone, accounts, contacts, or phone) or user data, but does not include a valid privacy policy.

> Action required: Include a link to a valid privacy policy on your app's Store Listing page and within your app. You can find more information in our help center.

> Alternatively, you may opt-out of this requirement by removing any requests for sensitive permissions or user data.

仔细研读几遍之后发现其实只要增加一条链接，说明一下隐私政策。其实主要的原因就是应用中使用到了 `android.permission.GET_ACCOUNTS,android.permission.READ_CONTACTS` 这俩权限，都是 Firebase SDK 里卖弄登陆要用到的。

仔细研究了一番 [Google 的隐私政策](https://www.google.com/policies/privacy/)， [Instagram 的隐私政策](https://help.instagram.com/155833707900388) 。

然后随着大概意思拷贝了[一份](/privacy)。

